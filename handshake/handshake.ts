import { Request, Response } from 'express';
import { User } from '../auth/auth';
export function handshake (req: Request, res: Response, next: Function): void {
  const user = req.user as User;
  if( !user || (user.iat > Date.now() + (3600000 * 24))) {
    res.status(401);
    res.send();
  } else {
    res.status(200);
    res.send(JSON.stringify(user));
  }
}