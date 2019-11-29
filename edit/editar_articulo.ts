import { dbconn, repformat } from '../db/db';
import { Request, Response } from 'express';

interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  id_categoria: number;
  id_proveedor: number;
  cantidad_master: number;
  iva: number;
  coste_anterior: number;
  coste: number;
  pvp_detalle: number;
  pvp_mayor: number;
}

export function editarArticulo(req: Request, res: Response, next: Function){

  const articulo: Articulo = req.body.articulo;
  let art_q = `INSERT INTO articulos
  VALUES( :id, :nombre, :descripcion, :id_categoria,
  :id_proveedor, :cantidad_master, :iva, :coste_anterior, :coste, :pvp_detalle, :pvp_mayor)
  ON DUPLICATE KEY UPDATE nombre = :nombre, descripcion = :descripcion, id_categoria = :id_categoria,
  id_proveedor = :id_proveedor, cantidad_master = :cantidad_master, iva = :iva,
  coste = :coste, pvp_detalle = :pvp_detalle, pvp_mayor = :pvp_mayor;`;

  art_q = repformat(art_q, 'id', articulo.id);
  art_q = repformat(art_q, 'nombre', articulo.nombre);
  art_q = repformat(art_q, 'descripcion', articulo.descripcion);
  art_q = repformat(art_q, 'id_categoria', articulo.id_categoria);
  art_q = repformat(art_q, 'id_proveedor', articulo.id_proveedor);
  art_q = repformat(art_q, 'cantidad_master', articulo.cantidad_master);
  art_q = repformat(art_q, 'iva', articulo.iva);
  art_q = repformat(art_q, 'coste_anterior', 0);
  art_q = repformat(art_q, 'coste', articulo.coste);
  art_q = repformat(art_q, 'pvp_detalle', articulo.pvp_detalle);
  art_q = repformat(art_q, 'pvp_mayor', articulo.pvp_mayor);

  dbconn.query(art_q, function(err, result, fields){
    if(err) res.status(500), res.send();
    else res.status(200), res.send();
  });
}