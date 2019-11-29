import { dbconn, repformat } from '../db/db';
import { Request, Response } from 'express';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  iva_por_defecto: number;
}

export function editarCategoria(req: Request, res: Response, next: Function){

  const articulo: Categoria = req.body.categoria;
  let cat_q = `INSERT INTO categorias
  VALUES( :id, :nombre, :descripcion, :iva_por_defecto )
  ON DUPLICATE KEY UPDATE nombre = :nombre, descripcion = :descripcion,
  iva_por_defecto = :iva_por_defecto;`;

  cat_q = repformat(cat_q, 'id', articulo.id);
  cat_q = repformat(cat_q, 'nombre', articulo.nombre);
  cat_q = repformat(cat_q, 'descripcion', articulo.descripcion);
  cat_q = repformat(cat_q, 'iva_por_defecto', articulo.iva_por_defecto);

  dbconn.query(cat_q, function(err, result, fields){
    if(err) res.status(500), res.send();
    else res.status(200), res.send();
  });
}