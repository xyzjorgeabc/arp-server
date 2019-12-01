import {Router} from 'express';
import {buscarAlbaranesCompra} from './buscar_albaranes_compra';
import {buscarAlbaranesVenta} from './buscar_albaranes_venta';

export const buscarRouting = Router();

buscarRouting.post('/albaranes_compra', buscarAlbaranesCompra);
buscarRouting.post('/albaranes_venta', buscarAlbaranesVenta);
