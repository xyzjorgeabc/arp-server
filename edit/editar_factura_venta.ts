import { dbconn, repformat } from '../db/db';
import { Request, Response } from 'express';

interface FacturaVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  fecha: string;
  id_metodo_pago: number;
  descuento_general: number;
  albaranes: AlbaranVenta[];
}
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

export function editarFacturaVenta(req: Request, res: Response, next: Function){

  const factura: FacturaVenta = req.body.factura_venta;
  const albaranes: AlbaranVenta[] = req.body.factura_venta.albaranes;
  let fact_q = `INSERT INTO facturas_venta VALUES (
    :id, :id_serie, :id_cliente, STR_TO_DATE(:fecha, "%d-%m-%Y"),
    :id_metodo_pago, :descuento_general)
    ON DUPLICATE KEY UPDATE id_cliente = values(id_cliente), fecha = values(fecha),
    id_metodo_pago = values(id_metodo_pago), descuento_general = values(descuento_general);`;

  fact_q = repformat(fact_q, 'id', factura.id);
  fact_q = repformat(fact_q, 'id_serie', factura.id_serie);
  fact_q = repformat(fact_q, 'id_cliente', factura.id_cliente);
  fact_q = repformat(fact_q, 'fecha', factura.fecha);
  fact_q = repformat(fact_q, 'id_metodo_pago', factura.id_metodo_pago);
  fact_q = repformat(fact_q, 'descuento_general', factura.descuento_general);

  let albs_q_sum = ' ';
  let albs_q = 'UPDATE albaranes_venta SET id_serie_factura = ?, id_factura = ? WHERE id_serie = ? AND id = ?;';
  
  dbconn.query(fact_q, function(err, result, fields){
    if(err) res.status(500), res.send();
    else {
      if(albaranes.length === 0){
        res.status(200);
        res.send();
      }
    }
  });

  if(albaranes.length){

    for(let i = 0; i < albaranes.length; i++){
      albs_q_sum += dbconn.format(albs_q, [factura.id_serie, factura.id, albaranes[i].id_serie, albaranes[i].id]);
    }

    dbconn.query(albs_q_sum, function(err, result, fields){
      if(err) res.status(500), res.send();
      else res.status(200), res.send();
    });
  }
}