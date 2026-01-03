import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        if (error instanceof ZodError || (error?.name === 'ZodError')) {
            // Safe access to errors
            const issues = error.errors || error.issues || [];
            return res.status(400).json({
                error: 'Validation failed',
                details: issues.map((e: any) => ({
                    field: e.path ? e.path[0] : 'unknown',
                    message: e.message
                }))
            });
        }
        next(error);
    }
};
