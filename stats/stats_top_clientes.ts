import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';


export function statsTopCli(req: Request, res: Response, next: Function){

  const top_cli_q = `SELECT regs.*, DATE_FORMAT(albs.fecha, "%d-%m-%Y") as FECHA, albs.descuento_general as DESC_GEN, cli.nombre_comercial as NOMBRE_CLI
  FROM registros_albaran_venta regs
  RIGHT JOIN albaranes_venta as albs ON
    albs.id = regs.id_albaran AND albs.id_serie = regs.id_serie_albaran
  JOIN clientes as cli ON
    albs.id_cliente = cli.id
    ORDER BY albs.fecha`;

  dbconn.query(dbconn.format(top_cli_q, ["01-01-2019", "30-12-2019"]), function(err, result: Array<any>){

    if(err) res.status(500), res.send();
    else if (result.length === 0) res.status(404), res.send();
    else {
      const clientes:{[key:string]: any} = {};

      for (let i = 0; i < result.length; i++) {
  
        const cli:string = result[i].NOMBRE_CLI;
  
        if(!clientes.hasOwnProperty(cli)) clientes[cli] = [];
        clientes[cli].push(result[i]);
      }
      
      for (const cli in clientes) {
        clientes[cli] = clientes[cli].reduce(function(sum: number, reg: any) {
          return (sum + reg.PRECIO_COSTE * reg.CANTIDAD * ((100 - reg.DESCUENTO) / 100) * ((100 + reg.IVA) / 100 ) * ((100 - reg.DESC_GEN) / 100 ));
        }, 0).toFixed(3);
      }
      res.send(JSON.stringify(clientes));
    }
  });
}