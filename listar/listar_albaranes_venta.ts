import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';

interface MuestraAlbaranVenta {
  id: number;
  fecha: string;
  nombre_comercial_cliente: string;
  nombre_metodo: string;
  descuento_general: number;
  importe: number;
}

export function listarAlbaranVenta(req: Request, res: Response, next: Function){

  const idSerie = req.body.albaran_venta.id_serie;

  let albs_q = `
  SELECT alb.id_serie, alb.id, DATE_FORMAT(alb.fecha, "%d-%m-%Y") AS fecha, alb.descuento_general, cli.nombre_comercial as nombre_comercial_cliente, met.nombre as nombre_metodo_pago,
  (SELECT ROUND(SUM( precio_coste * cantidad * ((100 - descuento) / 100) * ((100 + iva) / 100 ) ) * ((100 - alb.descuento_general) / 100), 2) AS regimporte
  FROM registros_albaran_venta reg WHERE reg.id_albaran = alb.id AND reg.id_serie_albaran = alb.id_serie) as importe
  FROM albaranes_venta alb
  INNER JOIN clientes cli ON alb.id_cliente = cli.id INNER JOIN metodos_pago met ON alb.id_metodo_pago = met.id
  WHERE alb.id_serie = ?;`;

  albs_q = dbconn.format(albs_q, [idSerie]);
  dbconn.query(albs_q, function(err, result: Array<MuestraAlbaranVenta>, fields){
    if(err) res.status(500), res.send();
    else if (result.length === 0) res.status(404), res.send();
    else { 
      result.forEach(function(val){
        if (val.importe === null) val.importe = 0;
      });

      res.status(200);
      res.send(JSON.stringify(keysToLC(result)));
    }
  });

}