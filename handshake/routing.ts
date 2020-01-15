import {Router} from 'express';
import {handshake} from './handshake';

export const handshakeRouting = Router();
handshakeRouting.post('', handshake);

