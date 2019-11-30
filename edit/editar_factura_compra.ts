import { dbconn, repformat } from '../db/db';
import { Request, Response } from 'express';

interface AlbaranCompra {
  id_serie: number;
  id: number;
  id_proveedor: number;
  fecha: string;
  id_albaran_proveedor: string;
  id_metodo_pago: number;
  descuento_general: number;
  id_serie_factura: number;
  id_factura: number;
}

interface FacturaCompra {
  id_serie: number;
  id: number;
  id_proveedor: number;
  fecha: string;
  id_factura_proveedor: string;
  id_metodo_pago: number;
  descuento_general: number;
  albaranes: AlbaranCompra[];
}

export function editarFacturaCompra(req: Request, res: Response, next: Function){

  const factura: FacturaCompra = req.body.factura_compra;
  const albaranes: AlbaranCompra[] = req.body.factura_compra.albaranes;
  let fact_q = `INSERT INTO facturas_compra VALUES (
    :id, :id_serie, :id_proveedor, STR_TO_DATE(:fecha, "%d-%m-%Y"), :id_factura_proveedor,
    :id_metodo_pago, :descuento_general)
    ON DUPLICATE KEY UPDATE id_proveedor = values(id_proveedor), fecha = values(fecha),
    id_factura_proveedor = values(id_factura_proveedor), id_metodo_pago = values(id_metodo_pago),
    descuento_general = values(descuento_general);`;

  fact_q = repformat(fact_q, 'id', factura.id);
  fact_q = repformat(fact_q, 'id_serie', factura.id_serie);
  fact_q = repformat(fact_q, 'id_proveedor', factura.id_proveedor);
  fact_q = repformat(fact_q, 'fecha', factura.fecha);
  fact_q = repformat(fact_q, 'id_factura_proveedor', factura.id_factura_proveedor);
  fact_q = repformat(fact_q, 'id_metodo_pago', factura.id_metodo_pago);
  fact_q = repformat(fact_q, 'descuento_general', factura.descuento_general);

  let albs_q_sum = ' ';
  let albs_q = 'UPDATE albaranes_compra SET id_serie_factura = ?, id_factura = ? WHERE id_serie = ? AND id = ?;';
  
  dbconn.query(fact_q, function(err, result, fields){
    console.log(err);
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
      console.log(err);
      if(err) res.status(500), res.send();
      else res.status(200), res.send();
    });
  }
  console.log(fact_q);
  console.log('\n\n\n');
  console.log(albs_q_sum);
}