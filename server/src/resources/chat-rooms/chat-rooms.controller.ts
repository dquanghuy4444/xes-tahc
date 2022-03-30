import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ROUTER_CHAT_ROOMS } from 'configs/routers';
import { IdFromToken } from 'common/decorators/auth.decorator';
import { ChatRoomsService } from './chat-rooms.service';
import { CreateRoomReq, UpdateMemberReq, UpdateRoomReq } from './dto/chat-rooms.dto';

@Controller(ROUTER_CHAT_ROOMS)
export class ChatRoomsController {
    constructor(private readonly chatRoomsService: ChatRoomsService) {}

    @Post()
    create(@IdFromToken() idFromToken: string, @Body() createChatReq: CreateRoomReq) {
        return this.chatRoomsService.create(createChatReq, idFromToken);
    }

    @Get(':id')
    getDetail(@IdFromToken() idFromToken: string, @Param('id') chatRoomId: string) {
        return this.chatRoomsService.getDetail(chatRoomId, idFromToken);
    }

    @Get('me')
    getMyChatRooms(@IdFromToken() idFromToken: string) {
        return this.chatRoomsService.getMyChatRooms(idFromToken);
    }

    @Get('me/user/:id')
    findRoom(@IdFromToken() idFromToken: string, @Param('id') id: string) {
        return this.chatRoomsService.findRoom(id , idFromToken);
    }

    @Get('me/:search')
    searchMyChatRooms(@IdFromToken() idFromToken: string, @Param('search') search: string) {
        return this.chatRoomsService.searchMyChatRooms(search , idFromToken);
    }

    @Put(':id')
    update(@IdFromToken() idFromToken: string, @Param('id') chatRoomId: string, @Body() updateRoomReq: UpdateRoomReq) {
        return this.chatRoomsService.update(chatRoomId, updateRoomReq, idFromToken);
    }

    @Put(':id/member')
    updateMember(
        @IdFromToken() idFromToken: string,
        @Param('id') chatRoomId: string,
        @Body() updateMemberReq: UpdateMemberReq,
    ) {
        return this.chatRoomsService.updateMember(chatRoomId, updateMemberReq, idFromToken);
    }
}
