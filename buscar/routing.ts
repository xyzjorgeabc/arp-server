import {Router} from 'express';
import {buscarAlbaranesCompra} from './buscar_albaranes';
export const buscarRouting = Router();

buscarRouting.post('/albaranes_compra', buscarAlbaranesCompra);
