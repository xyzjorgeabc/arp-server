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
  registros: RegistroAlbaranCompra[];
}

interface RegistroAlbaranCompra {
  n: number;
  id_articulo: number;
  nombre_registro: string;
  iva: number;
  cantidad_master: number;
  precio_coste: number;
  descuento: number;
  cantidad: number;
}

export function editarAlbaranCompra(req: Request, res: Response, next: Function){

  const albaran: AlbaranCompra = req.body.albaran_compra;
  const registros: RegistroAlbaranCompra[] = req.body.albaran_compra.registros;
  let alb_q = `INSERT INTO albaranes_compra VALUES (
    :id, :id_serie, :id_proveedor, STR_TO_DATE(:fecha, "%d-%m-%Y"), :id_albaran_proveedor,
    :id_metodo_pago, :descuento_general, null, null)
    ON DUPLICATE KEY UPDATE id_proveedor = values(id_proveedor), fecha = values(fecha),
    id_albaran_proveedor = values(id_albaran_proveedor), id_metodo_pago = values(id_metodo_pago),
    descuento_general = values(descuento_general), id_serie_factura = values(id_serie_factura), id_factura = values(id_factura);`;

  let reg_q = `INSERT INTO registros_albaran_compra VALUES (
    :n, :id_serie_albaran, :id_albaran, :id_articulo, :nombre_registro, :iva,
    :cantidad_master, :precio_coste, :descuento, :cantidad)`;
  
  let reg_vals = `,(:n, :id_serie_albaran, :id_albaran, :id_articulo, :nombre_registro, :iva,
  :cantidad_master, :precio_coste, :descuento, :cantidad)`;

  let reg_dp = ` ON DUPLICATE KEY UPDATE n = values(n), id_serie_albaran = values(id_serie_albaran), id_albaran = values(id_albaran),
  id_articulo = values(id_articulo), nombre_registro = values(nombre_registro), iva = values(iva),
  cantidad_master = values(cantidad_master), precio_coste = values(precio_coste), descuento = values(descuento),
  cantidad = values(cantidad)`;

  alb_q = repformat(alb_q, 'id_serie', albaran.id_serie);
  alb_q = repformat(alb_q, 'id', albaran.id);
  alb_q = repformat(alb_q, 'id_proveedor', albaran.id_proveedor);
  alb_q = repformat(alb_q, 'fecha', albaran.fecha);
  alb_q = repformat(alb_q, 'id_albaran_proveedor', albaran.id_albaran_proveedor);
  alb_q = repformat(alb_q, 'id_metodo_pago', albaran.id_metodo_pago);
  alb_q = repformat(alb_q, 'descuento_general', albaran.descuento_general);
  alb_q = repformat(alb_q, 'id_serie_factura', 'null');
  alb_q = repformat(alb_q, 'id_factura', 'null');

  dbconn.query(alb_q, function(err, result, fields){
    if(err) res.status(500), res.send();
    else {
      if(registros.length === 0){
        res.status(200);
        res.send();
      }
    }
    
  });

  if(registros.length){
    let regs_tmp = reg_q;
    regs_tmp = repformat(regs_tmp, 'n', 0);
    regs_tmp = repformat(regs_tmp, 'id_serie_albaran', albaran.id_serie);
    regs_tmp = repformat(regs_tmp, 'id_albaran', albaran.id);
    regs_tmp = repformat(regs_tmp, 'id_articulo', registros[0].id_articulo);
    regs_tmp = repformat(regs_tmp, 'nombre_registro', registros[0].nombre_registro);
    regs_tmp = repformat(regs_tmp, 'iva', registros[0].iva);
    regs_tmp = repformat(regs_tmp, 'cantidad_master', registros[0].cantidad_master);
    regs_tmp = repformat(regs_tmp, 'precio_coste', registros[0].precio_coste);
    regs_tmp = repformat(regs_tmp, 'descuento', registros[0].descuento);
    regs_tmp = repformat(regs_tmp, 'cantidad', registros[0].cantidad);

    for(let i = 1; i < registros.length; i++){
      let reg_tmp = reg_vals;
      reg_tmp = repformat(reg_tmp, 'n', i);
      reg_tmp = repformat(reg_tmp, 'id_serie_albaran', albaran.id_serie);
      reg_tmp = repformat(reg_tmp, 'id_albaran', albaran.id);
      reg_tmp = repformat(reg_tmp, 'id_articulo', registros[i].id_articulo);
      reg_tmp = repformat(reg_tmp, 'nombre_registro', registros[i].nombre_registro);
      reg_tmp = repformat(reg_tmp, 'iva', registros[i].iva);
      reg_tmp = repformat(reg_tmp, 'cantidad_master', registros[i].cantidad_master);
      reg_tmp = repformat(reg_tmp, 'precio_coste', registros[i].precio_coste);
      reg_tmp = repformat(reg_tmp, 'descuento', registros[i].descuento);
      reg_tmp = repformat(reg_tmp, 'cantidad', registros[i].cantidad);
      regs_tmp += reg_tmp;
    }
    regs_tmp += reg_dp + ";";

    dbconn.query(regs_tmp, function(err, result, fields){
      if(err) res.status(500), res.send();
      else res.status(200), res.send();
      
    });
  }
}