import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { loggerGlobal } from './middlewares/loggers-global.middleware';
import { ENUM_ENVIRONMENT_VARIABLE, getEnv } from 'configs/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCsrf from 'fastify-csrf';
import fastifyCookie from 'fastify-cookie';
import { contentParser } from 'fastify-multer';
import secureSession from 'fastify-secure-session';
import { fastifyHelmet } from 'fastify-helmet';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.setGlobalPrefix('v1');

    const config = new DocumentBuilder().setTitle('NestJS Auth').setDescription('').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/', app, document);

    app.useGlobalPipes(new ValidationPipe());

    app.use(loggerGlobal);
    app.enableCors();
    await app.register(secureSession, {
        secret: getEnv(ENUM_ENVIRONMENT_VARIABLE.SECURE_SESSION_SECRET_KEY),
        salt: getEnv(ENUM_ENVIRONMENT_VARIABLE.SECURE_SESSION_SALT),
    });
    // await app.register(fastifyCookie, {
    //     secret: getEnv(ENUM_ENVIRONMENT_VARIABLE.COOKIE_SECRET_KEY),
    // });
    await app.register(fastifyCsrf);
    await app.register(fastifyHelmet);
    await app.register(contentParser);

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(getEnv(ENUM_ENVIRONMENT_VARIABLE.PORT));
}

bootstrap();
