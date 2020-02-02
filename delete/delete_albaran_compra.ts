import { dbconn } from '../db/db';
import { Request, Response } from 'express';

export function deleteAlbaranCompra (req: Request, res: Response, next: Function): void {
  
  const id = req.body.albaran_compra.id;
  const idSerie = req.body.albaran_compra.id_serie;

  if ( !isNaN(id) && !isNaN(idSerie) ) {

    const q = dbconn.format('DELETE FROM albaranes_compra WHERE id_serie = ? AND id = ?;', [idSerie, id]);
    dbconn.query(q,
    function(err, result, fields){
      if(err) res.status(500), res.send();
      else res.send();
    })
  }
}