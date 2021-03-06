import { dbconn } from '../db/db';
import { Request, Response } from 'express';

export function deleteArticulos (req: Request, res: Response, next: Function): void {
  
  const id = req.body.articulo.id;

  if (!isNaN(id)) {

    const q = dbconn.format('DELETE FROM articulos WHERE id = ?;', [id]);
    dbconn.query(q,
    function(err, result, fields){
      if(err) res.status(500), res.send();
      else res.send();
    })
  }
}