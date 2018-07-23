import { Request, Response, NextFunction } from 'express';

export let controller = {
    get: (req: Request, res: Response, next: NextFunction) => {
        res.json({ok: true});
    },
    getById: (req: Request, res: Response, next: NextFunction) => {
        res.json({ok: true});
    },
    post: (req: Request, res: Response, next: NextFunction) => {
        res.json(req.body);
    },
    put: (req: Request, res: Response, next: NextFunction) => {
        res.json({ok: true});
    },
    delete: (req: Request, res: Response, next: NextFunction) => {
        res.json({ok: true});
    },
};