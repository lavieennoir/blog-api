import { Response, NextFunction } from 'express';
import { ParamsDictionary, Query, Request } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: JwtPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
