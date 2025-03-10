import {
  ParamsDictionary,
  ParsedQs,
  RouteParameters,
} from 'express-serve-static-core';
import { AuthRequest } from '../middleware/auth.middleware';

// Add types to use authorized controlleractions in routes
interface AuthRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
> {
  (
    req: AuthRequest<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
    res: Response<ResBody, LocalsObj>,
    next: NextFunction
  ): void;
}
declare module 'express-serve-static-core' {
  export interface IRouterMatcher<
    T,
    Method extends
      | 'all'
      | 'get'
      | 'post'
      | 'put'
      | 'delete'
      | 'patch'
      | 'options'
      | 'head' = any,
  > {
    <
      Route extends string,
      P = RouteParameters<Route>,
      ResBody = any,
      ReqBody = any,
      ReqQuery = ParsedQs,
      LocalsObj extends Record<string, any> = Record<string, any>,
    >(
      // (it's used as the default type parameter for P)
      path: Route,
      // (This generic is meant to be passed explicitly.)
      ...handlers: Array<
        AuthRequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
      >
    ): T;
  }
}
