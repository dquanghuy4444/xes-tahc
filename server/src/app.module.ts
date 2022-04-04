import { ExceptionFormatter, ResponseFormatterInterceptor } from 'interceptors/response.interceptor';
import { Module, ValidationPipe, MiddlewareConsumer, NestModule, CacheModule } from '@nestjs/common';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggerMiddleware } from 'middlewares/loggers.middleware';
import { ROUTER_AUTHEN } from 'configs/routers';
import { ENUM_ENVIRONMENT_VARIABLE, getEnv } from 'configs/env';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from 'resources/auth/auth.module';
import { UsersModule } from 'resources/users/users.module';
import { ChatRoomsModule } from 'resources/chat-rooms/chat-rooms.module';
import { MessengersModule } from 'resources/messengers/messengers.module';
import { ChatCalendarsModule } from 'resources/chat-calendars/chat-calendars.module';

import { ChatScheduleModule } from 'events/chat-schedule/chat-schedule.module';

import redisStore from 'cache-manager-ioredis';
import { HttpCacheInterceptor } from 'interceptors/http-cache.interceptor';
import { ChatParticipalsModule } from './resources/chat-participals/chat-participals.module';
import { FilesModule } from './resources/files/files.module';

mongoose.set('debug', getEnv(ENUM_ENVIRONMENT_VARIABLE.NODE_ENV) === "dev");

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/.env.${getEnv(ENUM_ENVIRONMENT_VARIABLE.NODE_ENV)}`,
            isGlobal: true,
        }),
        MongooseModule.forRoot(getEnv(ENUM_ENVIRONMENT_VARIABLE.MONGODB_URL_CONNECT), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),

        ScheduleModule.forRoot(),

        AuthModule,
        UsersModule,
        ChatRoomsModule,
        MessengersModule,

        // ChatScheduleModule,

        ChatCalendarsModule,

        ChatParticipalsModule,

        FilesModule,

        // CacheModule.registerAsync({
        //     useFactory: () => ({
        //         store: redisStore,
        //         host: getEnv(ENUM_ENVIRONMENT_VARIABLE.REDIS_HOST),
        //         port: getEnv(ENUM_ENVIRONMENT_VARIABLE.REDIS_PORT),
        //         ttl: 60 * 3600 * 1000,
        //     }),
        // }),
    ],
    controllers: [],
    providers: [
        { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
        { provide: APP_INTERCEPTOR, useClass: ResponseFormatterInterceptor },
        // { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
        { provide: APP_FILTER, useClass: ExceptionFormatter },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(ROUTER_AUTHEN);
    }
}
