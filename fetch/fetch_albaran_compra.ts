import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';

interface AlbaranCompra extends Object {
  id: number;
  registros: any[];
}

export function fetchAlbaranCompra(req: Request, res: Response, next: Function){

  const id = req.body.albaran_compra.id;
  const idSerie = req.body.albaran_compra.id_serie;

  if(id === 'all' && !isNaN(idSerie)){
    const q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_compra WHERE id_serie = ?;', [idSerie]);
    dbconn.query(q,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else res.send(JSON.stringify(keysToLC(result)));
    });
  }
  else if ( id === 'last' && !isNaN(idSerie)){
    const alb_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_compra WHERE id_serie = ? ORDER BY id DESC LIMIT 1;', [idSerie]);
    let albaran: AlbaranCompra;
    let registros: any[];

    dbconn.query(alb_q,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else {
        albaran = keysToLC(result[0]);
        const reg_q = dbconn.format('SELECT * FROM registros_albaran_compra WHERE id_serie_alabaran = ? and id_albaran = ?;', [idSerie, albaran.id]);
        dbconn.query(reg_q,
          function(err, result, fields){
            if(err || result.length === 0) res.status(404), res.send();
            else {
              registros = keysToLC(result);
              if(albaran && registros){
                albaran.registros = registros;
                res.send(JSON.stringify(albaran));
              }
            }
          });
      }
    });

  }
  else if (!isNaN(id) && !isNaN(idSerie)) {
    const alb_q = dbconn.format('SELECT *, DATE_FORMAT(fecha, "%d-%m-%Y") as fecha FROM albaranes_compra WHERE id_serie = ? AND id = ?;', [idSerie, id]);
    const reg_q = dbconn.format('SELECT * FROM registros_albaran_compra WHERE id_serie_albaran = ? AND id_albaran = ?;', [idSerie, id]);
    let albaran: AlbaranCompra;
    let registros: any[];
    dbconn.query(alb_q,
    function(err, result, fields){
      if(err || result.length === 0) res.status(404), res.send();
      else {
        albaran = keysToLC(result[0]);
        if(albaran && registros){
          albaran.registros = registros;
          res.send(JSON.stringify(albaran));
        }
      }
    });

    dbconn.query(reg_q,
    function(err, result, fields){
      if(err) res.status(404), res.send();
      else {
        registros = keysToLC(result);
        if(albaran && registros){
          albaran.registros = registros;
          res.send(JSON.stringify(albaran));
        }
      }
    });
  }
}