import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';
import { Serie, Empresa, RegistroAlbaranVenta, AlbaranVenta, Cliente, FacturaVenta, DocFacturaVenta, RegistroAlbaranCompra, DocFacturaCompra, Proveedor, FacturaCompra, AlbaranCompra } from '../utils/interfaces';
import { drawEmpresa, drawEmptyRegsTable, drawPageN, drawCliente, writeRegistrosFactura, drawFacturaVentaInfo, drawTotalesFactura, drawProveedor, drawFacturaCompraInfo } from './doc_plantillas';
import PDF from 'pdfkit'
import fs from 'fs';

export function docGenFacturaCompra(req: Request, res: Response, next: Function){

  const id = req.body.factura_compra.id;
  const idSerie = req.body.factura_compra.id_serie;

  if (isNaN(id) || isNaN(idSerie)) return;

  res.setHeader('Content-disposition', 'attachment; filename="factura' + idSerie + '_' + id + '.pdf"');
  res.setHeader('Content-type', 'application/pdf');

  const fact_prom: Promise<FacturaCompra> = new Promise(function get_factura_compra(resolve: Function, reject: Function){
    const alb_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM facturas_compra WHERE id_serie = ? AND id = ?;', [idSerie, id]);
    dbconn.query(alb_q,
      function(err, result, fields){
        if(err) reject(err);
        else resolve(keysToLC(result[0]));
      });
  });

  const albs_prom: Promise<AlbaranCompra[]> = new Promise(function get_albaranes_compra(resolve: Function, reject: Function){
    const albs_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_compra WHERE id_serie_factura = ? AND id_factura = ?;', [idSerie, id]);
    dbconn.query(albs_q,
      function(err, result, fields){
        if(err) reject(err);
        else {
          const albaranes: AlbaranCompra[] = keysToLC(result);
          const regs_proms: Promise<RegistroAlbaranCompra[]>[] = [];

          for(let i = 0; i < result.length; i++){
            const regs_prom: Promise<RegistroAlbaranCompra[]> = new Promise(function(resolve: Function, reject: Function){

              const regs_q = dbconn.format('SELECT * FROM registros_albaran_compra WHERE id_serie_albaran = ? AND id_albaran = ?;',
                [albaranes[i].id_serie, albaranes[i].id]);
              dbconn.query(regs_q,
                function(err, result, fields){
                  if(err) reject(err);
                  else resolve(keysToLC(result));
                });
            });
            regs_proms.push(regs_prom);
            regs_prom.then(function(regs: RegistroAlbaranCompra[]){
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
  const prov_prom: Promise<Proveedor> = fact_prom.then(function(fact: FacturaCompra): Promise<Proveedor>{
    return new Promise(function(resolve: Function, reject: Function){
      const cli_q = dbconn.format('SELECT * FROM proveedores WHERE id = ?;', [fact.id_proveedor]);
      dbconn.query(cli_q,
        function(err, result, fields){
          if(err) reject(err);
          else resolve(keysToLC(result[0]));
        });
    });
  });

  Promise.all([fact_prom, albs_prom, empresa_prom, serie_prom, prov_prom])
  .then(function(dataArr: Array<any>){
    const data: DocFacturaCompra = {
      factura: dataArr[0] as FacturaCompra,
      albaranes: dataArr[1] as AlbaranCompra[],
      empresa: dataArr[2] as Empresa,
      serie: dataArr[3] as Serie,
      proveedor: dataArr[4] as Proveedor
    };
    crearFactura(res, data);
  });

}

function crearFactura(res: Response, data: DocFacturaCompra) {
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
    drawProveedor(doc, data.proveedor);
    drawEmpresa(doc, data.empresa);
    drawFacturaCompraInfo(doc, data.factura, data.serie);
    drawEmptyRegsTable(doc);
    drawPageN(doc, i + 1, pages);
  }

  drawTotalesFactura(doc, data.albaranes);

  doc.end();
  b.addListener('finish', function(){
    res.send(pdfstr.join(''));
  });
}
