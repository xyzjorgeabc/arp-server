import { dbconn, repformat } from '../db/db';
import { Request, Response } from 'express';

interface Proveedor {
  id: number;
  nombre: string;
  cif: string;
  persona_contacto: string;
  direccion: string;
  telefono: string;
  fax: string;
  id_metodo_pago: number;
  cuenta_bancaria: string;
  sitio_web: string;
  email: string;
  informacion_adicional: string;
}

export function editarProveedor(req: Request, res: Response, next: Function){

  const proveedor: Proveedor = req.body.proveedor;
  let prov_q = `INSERT INTO proveedores 
  VALUES( :id, :nombre, :cif, :persona_contacto, :direccion, :telefono, :fax,
  :id_metodo_pago, :cuenta_bancaria, :sitio_web, :email, :informacion_adicional)
  ON DUPLICATE KEY UPDATE nombre = :nombre, cif = :cif, persona_contacto = :persona_contacto,
  direccion = :direccion, telefono = :telefono, fax = :fax, id_metodo_pago = :id_metodo_pago,
  cuenta_bancaria = :cuenta_bancaria, sitio_web = :sitio_web, email = :email,
  informacion_adicional = :informacion_adicional;`;

  prov_q = repformat(prov_q, 'id', proveedor.id);
  prov_q = repformat(prov_q, 'nombre', proveedor.nombre);
  prov_q = repformat(prov_q, 'cif', proveedor.cif);
  prov_q = repformat(prov_q, 'persona_contacto', proveedor.persona_contacto);
  prov_q = repformat(prov_q, 'direccion', proveedor.direccion);
  prov_q = repformat(prov_q, 'telefono', proveedor.telefono);
  prov_q = repformat(prov_q, 'fax', proveedor.fax);
  prov_q = repformat(prov_q, 'id_metodo_pago', proveedor.id_metodo_pago);
  prov_q = repformat(prov_q, 'cuenta_bancaria', proveedor.cuenta_bancaria);
  prov_q = repformat(prov_q, 'sitio_web', proveedor.sitio_web);
  prov_q = repformat(prov_q, 'email', proveedor.email);
  prov_q = repformat(prov_q, 'informacion_adicional', proveedor.informacion_adicional);
  prov_q = repformat(prov_q, 'email', proveedor.email);
  console.log(prov_q);
  dbconn.query(prov_q, function(err, result, fields){
    if(err) res.status(500), res.send();
    else res.status(200), res.send();
  });
}