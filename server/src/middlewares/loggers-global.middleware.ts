import { Request, Response, NextFunction } from 'express';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
    // console.log('GLOBAL MIDDLEWARE');
    next();
}
