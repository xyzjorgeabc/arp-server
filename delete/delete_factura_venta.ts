import { dbconn } from '../db/db';
import { Request, Response } from 'express';

export function deleteFacturaVenta (req: Request, res: Response, next: Function): void {
  
  const id = req.body.factura_venta.id;
  const idSerie = req.body.factura_venta.id_serie;

  if ( !isNaN(id) && !isNaN(idSerie) ) {

    const q = dbconn.format('DELETE FROM facturas_venta WHERE id_serie = ? AND id = ?;', [idSerie, id]);
    dbconn.query(q,
    function(err, result, fields){
      if(err) res.status(500), res.send();
      else res.send();
    })
  }
}