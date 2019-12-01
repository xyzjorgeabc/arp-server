import {Router} from 'express';
import {listarAlbaranVenta} from './listar_albaranes_venta';
export const listarRouting = Router();

listarRouting.post('/albaran_venta', listarAlbaranVenta);
