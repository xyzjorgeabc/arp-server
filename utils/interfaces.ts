
export interface Serie {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_desde: string;
  fecha_hasta: string;
}
export interface Articulo {
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
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  iva_por_defecto: number;
}
export interface Cliente {
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
export interface Proveedor {
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
export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
}
export interface AlbaranCompra {
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
export interface RegistroAlbaranCompra {
  n: number;
  id_articulo: number;
  nombre_registro: string;
  iva: number;
  cantidad_master: number;
  precio_coste: number;
  descuento: number;
  cantidad: number;
}
export interface MuestraAlbaranCompra {
  id: number;
  fecha: string;
  id_albaran_proveedor: string;
  nombre_proveedor: string;
  nombre_metodo: string;
  descuento_general: number;
  import: number;
}
export interface FacturaCompra {
  id_serie: number;
  id: number;
  id_proveedor: number;
  fecha: string;
  id_factura_proveedor: string;
  id_metodo_pago: number;
  descuento_general: number;
  albaranes: AlbaranCompra[];
}

export interface PedidoVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  fecha_pedido: string;
  fecha_entrega: string;
  id_serie_albaran: number;
  id_albaran: number;
}
export interface AlbaranVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  id_metodo_pago: number;
  fecha: string;
  descuento_general: number;
  id_serie_factura: number;
  id_factura: number;
  registros: RegistroAlbaranVenta[];
}
export interface RegistroAlbaranVenta {
  n: number;
  id_articulo: number;
  nombre_registro: string;
  iva: number;
  cantidad_master: number;
  precio_coste: number;
  descuento: number;
  cantidad: number;
}
export interface MuestraAlbaranVenta {
  id: number;
  fecha: string;
  nombre_cliente: string;
  nombre_metodo: string;
  descuento_general: number;
  importe: number;
}
export interface FacturaVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  fecha: string;
  id_metodo_pago: number;
  descuento_general: number;
  albaranes: AlbaranVenta[];
}
export interface Empresa {
  id: number;
  cif: string;
  nombre_comercial: string;
  nombre: string;
  direccion: string;
  telefono: string;
  fax: string;
  email: string;
  sitio_web: string;
}
export interface DocAlbaranCompra {
  albaran: AlbaranCompra;
  serie: Serie;
  empresa: Empresa;
  proveedor: Proveedor;
}

export interface DocAlbaranVenta {
  albaran: AlbaranVenta;
  serie: Serie;
  empresa: Empresa;
  cliente: Cliente;
}

export interface DocFacturaVenta {
  factura: FacturaVenta;
  albaranes: AlbaranVenta[];
  serie: Serie;
  empresa: Empresa;
  cliente: Cliente;
}

export interface DocFacturaCompra {
  factura: FacturaCompra;
  albaranes: AlbaranCompra[];
  serie: Serie;
  empresa: Empresa;
  proveedor: Proveedor;
}

export interface UkObject {
  [key: string]: any;
}