import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatCalendar, ChatCalendarSchema } from 'resources/chat-calendars/entities/chat-calendar.entity';
import { MessengersModule } from 'resources/messengers/messengers.module';
import { ChatScheduleService } from './chat-schedule.service';

@Module({
    imports: [
        MessengersModule,
        MongooseModule.forFeature([{ name: ChatCalendar.name, schema: ChatCalendarSchema }]),
    ],
    providers: [ChatScheduleService],
})
export class ChatScheduleModule {}
