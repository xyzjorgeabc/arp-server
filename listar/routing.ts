import {Router} from 'express';
import {listarAlbaranVenta} from './listar_albaranes_venta';
import {listarAlbaranCompra} from './listar_albaranes_compra';
export const listarRouting = Router();

listarRouting.post('/albaran_venta', listarAlbaranVenta);
listarRouting.post('/albaran_compra', listarAlbaranCompra);
