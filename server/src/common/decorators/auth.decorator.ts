import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ENUM_ENVIRONMENT_VARIABLE, getEnv } from 'configs/env';
import { FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';

export const IdFromToken = createParamDecorator((_, context: ExecutionContext) => {
    let token = context.switchToHttp().getRequest<FastifyRequest>().headers['x-auth-token'];
    if (!token) {
        throw new UnauthorizedException();
    }
    if (typeof token === 'object') {
        token = token[0] as string;
    }

    try {
        const data = verify(token, getEnv(ENUM_ENVIRONMENT_VARIABLE.SECRET_OR_PUBLIC_KEY));
        if (typeof data !== 'string') {
            return data['id'] as string;
        } else {
            return '';
        }
    } catch (error) {
        throw new UnauthorizedException();
    }
});
