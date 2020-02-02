import { Router } from 'express';
import { deleteAlbaranCompra } from './delete_albaran_compra';
import { deleteAlbaranVenta } from './delete_albaran_venta';
import { deleteFacturaCompra } from './delete_factura_compra';
import { deleteFacturaVenta } from './delete_factura_venta';
import { deleteArticulos } from './delete_articulos';
import { deleteCategorias } from './delete_categorias';
import { deleteClientes } from './delete_clientes';
import { deleteProveedores } from './delete_proveedores';

export const deleteRouting = Router();

deleteRouting.post('/albaranes_compra', deleteAlbaranCompra);
deleteRouting.post('/albaranes_venta', deleteAlbaranVenta);
deleteRouting.post('/facturas_compra', deleteFacturaCompra);
deleteRouting.post('/facturas_venta', deleteFacturaVenta);
deleteRouting.post('/articulos', deleteArticulos);
deleteRouting.post('/categorias', deleteCategorias);
deleteRouting.post('/clientes', deleteClientes);
deleteRouting.post('/proveedores', deleteProveedores);
