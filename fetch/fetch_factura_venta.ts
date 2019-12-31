import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';

interface Factura extends Object {
  id: number;
  albaranes: any[];
}

export function fetchFacturaVenta(req: Request, res: Response, next: Function){

  const id = req.body.factura_venta.id;
  const idSerie = req.body.factura_venta.id_serie;

  if((id === 'all') && !isNaN(idSerie)){
    const q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM facturas_venta WHERE id_serie = ?;', [idSerie]);
    dbconn.query(q,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result)));
    });
  }
  else if ( id === 'last' && !isNaN(idSerie)){
    const fact_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM facturas_venta WHERE id_serie = ? ORDER BY id DESC LIMIT 1;', [idSerie]);

    let factura: Factura;
    let albaranes: any[];

    dbconn.query(fact_q,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else {
        factura = keysToLC(result[0]);
        const alb_q = dbconn.format('SELECT * FROM albaranes_venta WHERE id_serie_factura = ? AND id_factura = ?;', [idSerie, factura.id]);
        dbconn.query(alb_q,
          function(err, result, fields){
            if(err || result.length === 0) res.status(404), res.send();
            else {
              albaranes = keysToLC(result);
              factura.albaranes = albaranes;
              res.send(JSON.stringify(factura));
            }
          });
      }
    });
  }
  else if (!isNaN(id) && !isNaN(idSerie)) {
    const fact_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM facturas_venta WHERE id_serie = ? AND id = ?;', [idSerie, id]);
    const alb_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_venta WHERE id_serie_factura = ? AND id_factura = ?;', [idSerie, id]);
    
    let factura: Factura;
    let albaranes: any[];

    dbconn.query(fact_q,
    function(err, result, fields){
      if(err) res.status(500), res.send();
      else if(result.length === 0) res.status(404), res.send();
      else {
        factura = keysToLC(result[0]);
        dbconn.query(alb_q,
          function(err, result, fields){
            if(err) res.status(500), res.send();
            else if (result.length === 0) {
              factura.albaranes = [];
              res.status(200);
              res.send(JSON.stringify(factura));
            }
            else {
              albaranes = keysToLC(result);
              factura.albaranes = albaranes;
              res.send(JSON.stringify(factura));
            }
          });
        }
    });
  }
}