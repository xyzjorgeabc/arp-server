import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';


export function statsTopProv(req: Request, res: Response, next: Function){

  const top_prov_q = `SELECT regs.*, DATE_FORMAT(albs.fecha, "%d-%m-%Y") as FECHA, albs.descuento_general as DESC_GEN, provs.nombre as NOMBRE_PROV
  FROM registros_albaran_compra regs
  RIGHT JOIN albaranes_compra as albs ON
    albs.id = regs.id_albaran AND albs.id_serie = regs.id_serie_albaran
  JOIN proveedores as provs ON
    albs.id_proveedor = provs.id
    ORDER BY albs.fecha`;

  dbconn.query(dbconn.format(top_prov_q, ["01-01-2019", "30-12-2019"]), function(err, result: Array<any>){

    const provs:{[key:string]: any} = {};

    for(let i = 0; i < result.length; i++) {

      const prov:string = result[i].NOMBRE_PROV;

      if(provs.hasOwnProperty(prov)){
        provs[prov].push(result[i]);
      }
      else {
        provs[prov] = [];
        provs[prov].push(result[i]);
      }
    }
    
    /*
    const meses: Array<any> = [[], [], [], [], [], [], [], [], [], [], [], []];

    meses.forEach(function(arr:Array<any>, ind: number, meses){
      meses[ind] = +arr.reduce(function(sum: number, reg: any){
        if(reg.N === null) return sum;
        console.log(reg.DESC_GEN);
        return (sum + reg.PRECIO_COSTE * reg.CANTIDAD * ((100 - reg.DESCUENTO) / 100) * ((100 + reg.IVA) / 100 ) * ((100 - reg.DESC_GEN) / 100 ));
      }, 0).toFixed(3);
    });
    res.status(200);
    res.send(JSON.stringify(meses));*/
    res.send(JSON.stringify(provs));
  });

}