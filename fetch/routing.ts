import {Router} from 'express';
import {fetchArticulo}  from './fetch_articulo';
import {fetchProveedor} from './fetch_proveedor';
import {fetchCategoria} from './fetch_categoria';
import {fetchMetodoPago} from './fetch_metodo_pago';
import {fetchCliente} from './fetch_cliente';
import {fetchSerie} from './fetch_serie';
import {fetchAlbaranCompra} from './fetch_albaran_compra';
import {fetchFacturaCompra} from './fetch_factura_compra';
import {fetchAlbaranVenta} from './fetch_albaran_venta';
import {fetchFacturaVenta} from './fetch_factura_venta';

export const fetchRouting = Router();

fetchRouting.post('/articulo', fetchArticulo);
fetchRouting.post('/proveedor', fetchProveedor);
fetchRouting.post('/categoria', fetchCategoria);
fetchRouting.post('/metodo_pago', fetchMetodoPago);
fetchRouting.post('/cliente', fetchCliente);
fetchRouting.post('/serie', fetchSerie);
fetchRouting.post('/albaran_compra', fetchAlbaranCompra);
fetchRouting.post('/factura_compra', fetchFacturaCompra);
fetchRouting.post('/albaran_venta', fetchAlbaranVenta);
fetchRouting.post('/factura_venta', fetchFacturaVenta);