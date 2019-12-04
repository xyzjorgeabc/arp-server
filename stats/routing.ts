import {Router} from 'express';
import {statsGastos} from './stats_gastos';
import { statsTopProv } from './stats_top_prov';
export const statsRouting = Router();

statsRouting.post('/gastos', statsGastos);
statsRouting.post('/top_prov', statsTopProv)
