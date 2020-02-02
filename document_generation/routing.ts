import {Router} from 'express';
import { docGenAlbaranCompra } from './doc_gen_albaran_compra';
import { docGenAlbaranVenta } from './doc_gen_albaran_venta';
import { docGenFacturaVenta } from './doc_gen_factura_venta';
import { docGenFacturaCompra } from './doc_gen_factura_compra';

export const docGenRouting = Router();

docGenRouting.post('/albaran_compra', docGenAlbaranCompra);
docGenRouting.post('/albaran_venta', docGenAlbaranVenta);
docGenRouting.post('/factura_venta', docGenFacturaVenta);
docGenRouting.post('/factura_compra', docGenFacturaCompra);