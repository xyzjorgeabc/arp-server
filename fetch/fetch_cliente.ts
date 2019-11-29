import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';

export function fetchCliente(req: Request, res: Response, next: Function){

  const id = req.body.cliente.id;

  if(id === 'all'){
    dbconn.query('SELECT * FROM clientes;',
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result)));
    });
  }
  else if ( id === 'last'){
    dbconn.query(`SELECT *,
    DATE_FORMAT(fecha_captacion, "%d-%m-%Y") AS fecha_captacion,
    DATE_FORMAT(fecha_nacimiento, "%d-%m-%Y") AS fecha_nacimiento FROM clientes ORDER BY id DESC LIMIT 1;`,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result[0])));
    });
  }
  else if (!isNaN(id)) {
    const q = dbconn.format(`SELECT *,
    DATE_FORMAT(fecha_captacion, "%d-%m-%Y") AS fecha_captacion,
    DATE_FORMAT(fecha_nacimiento, "%d-%m-%Y") AS fecha_nacimiento FROM clientes WHERE id = ?`, [id]);
    dbconn.query(q,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result[0])));
    });
  }

}