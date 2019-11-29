import {Router} from 'express';
import {editarArticulo} from './editar_articulo';
import {editarCategoria} from './editar_categoria';
import {editarCliente} from './editar_cliente';
import {editarProveedor} from './editar_proveedor';
import {editarAlbaranCompra} from './editar_albaran_compra';

export const editRouting = Router();

editRouting.post('/articulo', editarArticulo);
editRouting.post('/categoria', editarCategoria);
editRouting.post('/cliente', editarCliente);
editRouting.post('/proveedor', editarProveedor);
editRouting.post('/albaran_compra', editarAlbaranCompra);
