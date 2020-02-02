import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';
import { AlbaranCompra, RegistroAlbaranCompra, Serie, DocAlbaranCompra, Empresa, Proveedor } from '../utils/interfaces';
import { writeRegistrosAlbaran, drawProveedor, drawEmpresa, drawAlbaranCompraInfo, drawEmptyRegsTable, drawPageN, drawTotalesAlbaran } from './doc_plantillas';
import PDF from 'pdfkit'
import fs from 'fs';

export function docGenAlbaranCompra(req: Request, res: Response, next: Function){

  const id = req.body.albaran_compra.id;
  const idSerie = req.body.albaran_compra.id_serie;


  if (isNaN(id) || isNaN(idSerie)) return;

  res.setHeader('Content-disposition', 'attachment; filename="albaran' + idSerie + '_' + id + '.pdf"');
  res.setHeader('Content-type', 'application/pdf');

  const alb_prom: Promise<AlbaranCompra> = new Promise(function get_albaran_compra(resolve: Function, reject: Function){
    const alb_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_compra WHERE id_serie = ? AND id = ?;', [idSerie, id]);
    dbconn.query(alb_q,
      function(err, result, fields){
        if(err) reject(err);
        else resolve(keysToLC(result[0]));
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
  const regs_prom: Promise<RegistroAlbaranCompra> = new Promise(function get_regs_albaran_compra( resolve: Function, reject: Function){
    const reg_q = dbconn.format('SELECT * FROM registros_albaran_compra WHERE id_serie_albaran = ? AND id_albaran = ?;', [idSerie, id]);
    dbconn.query(reg_q,
      function(err, result, fields){
        if(err) reject(err);
        else resolve(keysToLC(result));
      });
  });
  const prov_prom: Promise<Proveedor> = alb_prom.then(function(alb: AlbaranCompra): Promise<Proveedor>{
    return new Promise(function(resolve: Function, reject: Function){
      const cli_q = dbconn.format('SELECT * FROM proveedores WHERE id = ?;', [alb.id_proveedor]);
      dbconn.query(cli_q,
        function(err, result, fields){
          if(err) reject(err);
          else resolve(keysToLC(result[0]));
        });
    });
  });

  Promise.all([alb_prom, empresa_prom, serie_prom, regs_prom, prov_prom])
  .then(function(dataArr: Array<any>){
    const data: DocAlbaranCompra = {
      albaran: dataArr[0] as AlbaranCompra,
      empresa: dataArr[1] as Empresa,
      serie: dataArr[2] as Serie,
      proveedor: dataArr[4] as Proveedor
    };
    data.albaran.registros = dataArr[3] as RegistroAlbaranCompra[];
    crearAlbaran(res, data);
  });

}

function crearAlbaran(res: Response, data: DocAlbaranCompra) {
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
  writeRegistrosAlbaran(doc, data.albaran.registros);
  const pages = doc.bufferedPageRange().count;
  for(let i = 0; i < pages; i++) {
    doc.switchToPage(i);
    drawProveedor(doc, data.proveedor);
    drawEmpresa(doc, data.empresa);
    drawAlbaranCompraInfo(doc, data.albaran, data.serie);
    drawEmptyRegsTable(doc);
    drawPageN(doc, i + 1, pages);
  }

  drawTotalesAlbaran(doc, data.albaran);

  doc.end();
  b.addListener('finish', function(){
    res.send(pdfstr.join(''));
  });
}
