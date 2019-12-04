import { dbconn } from '../db/db';
import { Request, Response } from 'express';
import { keysToLC } from '../utils/utils';


function getMes(strFecha: string): number {

  const tmp = strFecha.split('');
  return +(tmp[3] + tmp[4]);
}

export function statsGastos(req: Request, res: Response, next: Function){

  const gastos_q = `SELECT regs.*, DATE_FORMAT(albs.fecha, "%d-%m-%Y") as FECHA, albs.descuento_general as DESC_GEN
  FROM registros_albaran_compra regs
  RIGHT JOIN albaranes_compra as albs ON
    albs.fecha between STR_TO_DATE(?, "%d-%m-%Y") AND STR_TO_DATE(?, "%d-%m-%Y") AND
    albs.id = regs.id_albaran AND albs.id_serie = regs.id_serie_albaran
    ORDER BY albs.fecha`;

  dbconn.query(dbconn.format(gastos_q, ["01-01-2019", "30-12-2019"]), function(err, result){

    const meses: Array<any> = [[], [], [], [], [], [], [], [], [], [], [], []];

    for (let i = 0; i < result.length; i++){
      const mes = getMes(result[i].FECHA);
      meses[mes-1].push(result[i]);
    }
    meses.forEach(function(arr:Array<any>, ind: number, meses){
      meses[ind] = +arr.reduce(function(sum: number, reg: any){
        if(reg.N === null) return sum;
        return (sum + reg.PRECIO_COSTE * reg.CANTIDAD * ((100 - reg.DESCUENTO) / 100) * ((100 + reg.IVA) / 100 ) * ((100 - reg.DESC_GEN) / 100 ));
      }, 0).toFixed(3);
    });
    res.status(200);
    res.send(JSON.stringify(meses));
  });

}