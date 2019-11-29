import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';

export function fetchArticulo(req: Request, res: Response, next: Function){

  const id = req.body.articulo.id;

  if(id === 'all'){
    dbconn.query('SELECT * FROM articulos;',
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result)));
    });
  }
  else if ( id === 'last'){
    dbconn.query('SELECT * from articulos ORDER BY id DESC LIMIT 1;',
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result[0])));
    });
  }
  else if (!isNaN(id)) {
    const q = dbconn.format('SELECT * FROM articulos WHERE id = ?', [id]);
    dbconn.query(q,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result[0])));
    });
  }
}