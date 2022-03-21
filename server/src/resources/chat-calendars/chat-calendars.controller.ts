import { Controller, Post, Body } from '@nestjs/common';
import { IdFromToken } from 'common/decorators/auth.decorator';
import { ROUTER_CHAT_CALENDARS } from 'configs/routers';
import { ChatRoomsService } from 'resources/chat-rooms/chat-rooms.service';
import { ChatCalendarsService } from './chat-calendars.service';
import { CreateChatCalendarReq } from './dto/chat-calendar.dto';

@Controller(ROUTER_CHAT_CALENDARS)
export class ChatCalendarsController {
    constructor(
        private readonly chatCalendarsService: ChatCalendarsService,

    ) {}

    @Post()
    create(@IdFromToken() idFromToken: string, @Body() createChatCalendarDto: CreateChatCalendarReq) {
        return this.chatCalendarsService.create(createChatCalendarDto, idFromToken);
    }
}
