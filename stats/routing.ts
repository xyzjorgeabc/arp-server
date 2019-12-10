import {Router} from 'express';
import {statsGastos} from './stats_gastos';
import {statsTopProv} from './stats_top_prov';
import {statsVentas} from './stats_ventas';
import {statsTopCli} from './stats_top_clientes';
export const statsRouting = Router();

statsRouting.post('/gastos', statsGastos);
statsRouting.post('/top_prov', statsTopProv);
statsRouting.post('/ventas', statsVentas);
statsRouting.post('/top_clientes', statsTopCli);
