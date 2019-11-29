import { dbconn, repformat } from '../db/db';
import { Request, Response } from 'express';

interface Cliente {
  id: number;
  nombre_comercial: string;
  cif: string;
  persona_contacto: string;
  direccion: string;
  telefono: string;
  fax: string;
  precio_albaran: boolean;
  factura_automatica: boolean;
  id_metodo_pago: number;
  cuenta_bancaria: string;
  sitio_web: string;
  email: string;
  fecha_nacimiento: string;
  fecha_captacion: string;
  descuento: number;
  informacion_adicional: string;
}

export function editarCliente(req: Request, res: Response, next: Function){

  const cliente: Cliente = req.body.cliente;
  let cli_q = `INSERT INTO clientes
  VALUES (:id, :nombre_comercial, :cif, :persona_contacto, :direccion, :telefono, :fax,
    :precio_albaran, :factura_automatica, :id_metodo_pago, :cuenta_bancaria,
    :sitio_web, :email, STR_TO_DATE(:fecha_nacimiento, "%d-%m-%Y"), STR_TO_DATE(:fecha_captacion, "%d-%m-%Y"), :descuento, :informacion_adicional)
  ON DUPLICATE KEY UPDATE
    nombre_comercial = :nombre_comercial, cif = :cif, persona_contacto = :persona_contacto,
    direccion = :direccion, telefono = :telefono, fax = :fax, precio_albaran = :precio_albaran,
    factura_automatica = :factura_automatica, id_metodo_pago = :id_metodo_pago,
    cuenta_bancaria = :cuenta_bancaria, sitio_web = :sitio_web, email = :email,
    fecha_nacimiento = STR_TO_DATE(:fecha_nacimiento, "%d-%m-%Y"), fecha_captacion = STR_TO_DATE(:fecha_captacion, "%d-%m-%Y"),
    descuento = :descuento, informacion_adicional = :informacion_adicional;`;

  cli_q = repformat(cli_q, 'id', cliente.id);
  cli_q = repformat(cli_q, 'nombre_comercial', cliente.nombre_comercial);
  cli_q = repformat(cli_q, 'cif', cliente.cif);
  cli_q = repformat(cli_q, 'persona_contacto', cliente.persona_contacto);
  cli_q = repformat(cli_q, 'direccion', cliente.direccion);
  cli_q = repformat(cli_q, 'telefono', cliente.telefono);
  cli_q = repformat(cli_q, 'fax', cliente.fax);
  cli_q = repformat(cli_q, 'precio_albaran', cliente.precio_albaran);
  cli_q = repformat(cli_q, 'factura_automatica', cliente.factura_automatica);
  cli_q = repformat(cli_q, 'id_metodo_pago', cliente.id_metodo_pago);
  cli_q = repformat(cli_q, 'cuenta_bancaria', cliente.cuenta_bancaria);
  cli_q = repformat(cli_q, 'sitio_web', cliente.sitio_web);
  cli_q = repformat(cli_q, 'email', cliente.email);
  cli_q = repformat(cli_q, 'fecha_nacimiento', cliente.fecha_nacimiento);
  cli_q = repformat(cli_q, 'fecha_captacion', cliente.fecha_captacion);
  cli_q = repformat(cli_q, 'descuento', cliente.descuento)
  cli_q = repformat(cli_q, 'informacion_adicional', cliente.informacion_adicional);
  console.log(cli_q);
  dbconn.query(cli_q, function(err, result, fields){
    if(err) res.status(500), res.send();
    else res.status(200), res.send();
  });
}