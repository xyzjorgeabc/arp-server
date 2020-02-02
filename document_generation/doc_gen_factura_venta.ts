import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';
import { Serie, Empresa, RegistroAlbaranVenta, AlbaranVenta, Cliente, FacturaVenta, DocFacturaVenta } from '../utils/interfaces';
import { drawEmpresa, drawEmptyRegsTable, drawPageN, drawCliente, writeRegistrosFactura, drawFacturaVentaInfo, drawTotalesFactura } from './doc_plantillas';
import PDF from 'pdfkit'
import fs from 'fs';

export function docGenFacturaVenta(req: Request, res: Response, next: Function){

  const id = req.body.factura_venta.id;
  const idSerie = req.body.factura_venta.id_serie;

  if (isNaN(id) || isNaN(idSerie)) return;

  res.setHeader('Content-disposition', 'attachment; filename="factura' + idSerie + '_' + id + '.pdf"');
  res.setHeader('Content-type', 'application/pdf');

  const fact_prom: Promise<FacturaVenta> = new Promise(function get_factura_venta(resolve: Function, reject: Function){
    const alb_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM facturas_venta WHERE id_serie = ? AND id = ?;', [idSerie, id]);
    dbconn.query(alb_q,
      function(err, result, fields){
        if(err) reject(err);
        else resolve(keysToLC(result[0]));
      });
  });

  const albs_prom: Promise<AlbaranVenta[]> = new Promise(function get_albaranes_venta(resolve: Function, reject: Function){
    const albs_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_venta WHERE id_serie_factura = ? AND id_factura = ?;', [idSerie, id]);
    dbconn.query(albs_q,
      function(err, result, fields){
        if(err) reject(err);
        else {
          const albaranes: AlbaranVenta[] = keysToLC(result);
          const regs_proms: Promise<RegistroAlbaranVenta[]>[] = [];

          for(let i = 0; i < result.length; i++){
            const regs_prom: Promise<RegistroAlbaranVenta[]> = new Promise(function(resolve: Function, reject: Function){

              const regs_q = dbconn.format('SELECT * FROM registros_albaran_venta WHERE id_serie_albaran = ? AND id_albaran = ?;',
                [albaranes[i].id_serie, albaranes[i].id]);
              dbconn.query(regs_q,
                function(err, result, fields){
                  if(err) reject(err);
                  else resolve(keysToLC(result));
                });
            });
            regs_proms.push(regs_prom);
            regs_prom.then(function(regs: RegistroAlbaranVenta[]){
              albaranes[i].registros = regs;
            });
          }
          Promise.all(regs_proms).then(function(){
            resolve(albaranes);
          });
        }
      });
  });

  const empresa_prom: Promise<Empresa> = new Promise(function get_empresa( resolve: Function, reject: Function){
    const empresa_q = dbconn.format('SELECT * FROM empresas WHERE id = ?;', [1]);
    dbconn.query(empresa_q,
      function(err, result, fields){
        if(err) reject(err);
        else resolve(keysToLC(result[0]));
      });
  });
  const serie_prom: Promise<Serie> = new Promise(function get_serie(resolve: Function, reject: Function){
    const serie_q = dbconn.format('SELECT * FROM series WHERE id = ?;', [idSerie]);
    dbconn.query(serie_q,
      function(err, result, fields){
        if(err) reject(err);
        else resolve(keysToLC(result[0]));
      });
  });
  const cli_prom: Promise<Cliente> = fact_prom.then(function(fact: FacturaVenta): Promise<Cliente>{
    return new Promise(function(resolve: Function, reject: Function){
      const cli_q = dbconn.format('SELECT * FROM clientes WHERE id = ?;', [fact.id_cliente]);
      dbconn.query(cli_q,
        function(err, result, fields){
          if(err) reject(err);
          else resolve(keysToLC(result[0]));
        });
    });
  });

  Promise.all([fact_prom, albs_prom, empresa_prom, serie_prom, cli_prom])
  .then(function(dataArr: Array<any>){
    const data: DocFacturaVenta = {
      factura: dataArr[0] as FacturaVenta,
      albaranes: dataArr[1] as AlbaranVenta[],
      empresa: dataArr[2] as Empresa,
      serie: dataArr[3] as Serie,
      cliente: dataArr[4] as Cliente
    };
    crearFactura(res, data);
  });

}

function crearFactura(res: Response, data: DocFacturaVenta) {
  const doc = new PDF({bufferPages: true});

  const pdfstr:Array<string> = [];
  doc.setEncoding('base64');
  doc.on('data', function(data:string | Buffer ){
    if(typeof data === 'object'){
      pdfstr.push(data.toString('base64'));
    }
    else {
      pdfstr.push(data);
    }
  });

  const b = doc.pipe(fs.createWriteStream('./temp.pdf'));
  doc.page.size = 'A4';
  writeRegistrosFactura(doc, data.albaranes);
  const pages = doc.bufferedPageRange().count;
  for(let i = 0; i < pages; i++) {
    doc.switchToPage(i);
    drawCliente(doc, data.cliente);
    drawEmpresa(doc, data.empresa);
    drawFacturaVentaInfo(doc, data.factura, data.serie);
    drawEmptyRegsTable(doc);
    drawPageN(doc, i + 1, pages);
  }

  drawTotalesFactura(doc, data.albaranes);

  doc.end();
  b.addListener('finish', function(){
    res.send(pdfstr.join(''));
  });
}
