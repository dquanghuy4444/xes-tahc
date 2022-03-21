import { Module } from '@nestjs/common';
import { ChatCalendarsService } from './chat-calendars.service';
import { ChatCalendarsController } from './chat-calendars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from 'resources/chat-rooms/entities/chat-room.entity';
import { ChatCalendar , ChatCalendarSchema } from './entities/chat-calendar.entity';
import { ChatRoomsModule } from 'resources/chat-rooms/chat-rooms.module';

@Module({
    imports: [
        ChatRoomsModule,
        MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
        MongooseModule.forFeature([{ name: ChatCalendar.name, schema: ChatCalendarSchema }]),
    ],
    controllers: [ChatCalendarsController],
    providers: [ChatCalendarsService],
})
export class ChatCalendarsModule {}
