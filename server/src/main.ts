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
import { config } from 'aws-sdk';

async function bootstrap() {
    config.update({
        accessKeyId: getEnv(ENUM_ENVIRONMENT_VARIABLE.AWS_ACCESS_KEY_ID),
        secretAccessKey: getEnv(ENUM_ENVIRONMENT_VARIABLE.AWS_SECRET_ACCESS_KEY),
        region: getEnv(ENUM_ENVIRONMENT_VARIABLE.AWS_REGION),
    });

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ logger: getEnv(ENUM_ENVIRONMENT_VARIABLE.NODE_ENV) === 'dev' }),
    );
    app.setGlobalPrefix('v1');

    const configSwagger = new DocumentBuilder().setTitle('NestJS Auth').setDescription('').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, configSwagger);

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

    await app.listen(getEnv(ENUM_ENVIRONMENT_VARIABLE.PORT));
}

bootstrap();
