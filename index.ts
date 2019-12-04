import { Request, Response } from "express";
import { fetchRouting } from './fetch/routing';
import { editRouting } from './edit/routing';
import { buscarRouting } from './buscar/routing';
import { listarRouting } from "./listar/routing";
import { statsRouting } from './stats/routing';

const cors = require('./test/cors');
const bp = require('body-parser');
const express = require('express');
const auth = require('./auth/auth').pp;
const getToken = require('./auth/auth').getToken;
const app = express();

app.use(cors);
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(function(req: Request, res: Response, next: Function){
  console.dir(req.body);
  res.setHeader('Content-Type', 'application/json');
  next();
});
app.use(auth.initialize());
app.use('/login', auth.authenticate('local', { session: false }), 
function(req: Request, res: Response, next: Function){
  if(req.isAuthenticated()){
    res.send(JSON.stringify({token: getToken(req.user)}));
  }
});
app.use(auth.authenticate('jwt', { session: false }),
function(req: Request, res: Response, next: Function){
  if(req.isAuthenticated()){
    next();
  }
});

app.use('/fetch', fetchRouting);
app.use('/editar', editRouting);
app.use('/buscar', buscarRouting);
app.use('/listar', listarRouting);
app.use('/stats', statsRouting);
app.listen(3000);
console.log('listening ............................');