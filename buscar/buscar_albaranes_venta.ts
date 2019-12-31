import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';

interface AlbaranVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  id_metodo_pago: number;
  fecha: string;
  descuento_general: number;
  id_serie_factura: number;
  id_factura: number;
}

export function buscarAlbaranesVenta(req: Request, res: Response, next: Function){

  const idSerie = req.body.albaran_venta.id_serie;
  const fecha_desde = req.body.albaran_venta.fecha_desde;
  const fecha_hasta = req.body.albaran_venta.fecha_hasta;

  const albs_q = dbconn.format(`SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_venta 
  WHERE id_serie = ? AND id_serie_factura IS NULL AND id_factura IS NULL AND fecha between STR_TO_DATE(?, "%d-%m-%Y") AND STR_TO_DATE(?, "%d-%m-%Y")
  ORDER BY fecha DESC;`, [idSerie, fecha_desde, fecha_hasta]);
  
  dbconn.query(albs_q, function(err, result: AlbaranVenta[], fields){
    if(err) res.status(500), res.send();
    if(result.length === 0) res.status(404), res.send();
    else res.send(JSON.stringify(keysToLC(result)));
  });

}