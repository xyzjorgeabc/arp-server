//import { Request, Response } from 'express';
import passport from 'passport'
import { dbconn } from '../db/db';

const pp = require('passport');
const ppLocal = require('passport-local').Strategy;
const ppJwt = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const secret = 'QeThWmZq4t7w!z%C*F-JaNdRgUjXn2r5';

function getToken(user: Object){
  return jwt.sign(user, secret);
}

const jwtOpts = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromBodyField('token')
};

const localOpts = {
  usernameField: 'usuario',
  passwordField: 'contrasena',
}

const jwtStrat = new ppJwt(jwtOpts, function( payload: string, done: Function ){
  return done(null, payload);
});

const localStrat = new ppLocal(localOpts, function(usr: string, pssw: string, done: Function){
  const q = dbconn.format('SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?', [usr, pssw]);
  dbconn.query(q, function(err, res, fields){
    if(err){
      process.exit(0);
    } else if (res.length === 1){
      return done(null, {user: usr, info: pssw});
    } else {
      return done(null, false);
    }
  });
});

pp.use(jwtStrat);
pp.use(localStrat);

module.exports.pp = pp;
module.exports.getToken = getToken;