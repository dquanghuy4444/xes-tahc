import { CallHandler, ExecutionContext, Inject, mixin, NestInterceptor, Optional, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import FastifyMulter from 'fastify-multer';
import { Options, Multer } from 'multer';
import { Request } from 'express';
import { extname } from 'path';
import { diskStorage } from 'multer';

const editFileName = (req: Request, file: Express.Multer.File, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

const imageFileFilter = (req: Request, file: Express.Multer.File, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

type MulterInstance = any;
export function FastifyFilesInterceptor(
    fieldName: string,
    maxCount?: number,
    localOptions?: Options,
): Type<NestInterceptor> {
    class MixinInterceptor implements NestInterceptor {
        protected multer: MulterInstance;

        constructor(
            @Optional()
            @Inject('MULTER_MODULE_OPTIONS')
            options: Multer,
        ) {
            this.multer = (FastifyMulter as any)({
                ...options,
                // storage: diskStorage({
                //     // destination: './uploads',
                //     filename: editFileName,
                // }),
                fileFilter: imageFileFilter,
                ...localOptions,
            });
        }

        async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
            const ctx = context.switchToHttp();

            await new Promise<void>((resolve, reject) =>
                this.multer.array(fieldName, maxCount)(ctx.getRequest(), ctx.getResponse(), (error: any) => {
                    if (error) {
                        // const error = transformException(err);
                        return reject(error);
                    }
                    resolve();
                }),
            );

            return next.handle();
        }
    }
    const Interceptor = mixin(MixinInterceptor);
    return Interceptor as Type<NestInterceptor>;
}
