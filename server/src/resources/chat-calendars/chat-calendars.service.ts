import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from 'resources/chat-rooms/entities/chat-room.entity';
import { CreateChatCalendarReq } from './dto/chat-calendar.dto';
import { Model } from 'mongoose';
import { ChatCalendar } from './entities/chat-calendar.entity';
import { ChatRoomsService } from 'resources/chat-rooms/chat-rooms.service';

@Injectable()
export class ChatCalendarsService {
    constructor(
        @InjectModel(ChatCalendar.name) private messengerModel: Model<ChatCalendar>,
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
        private readonly chatRoomsService: ChatRoomsService,
    ) {}

    async create(createChatCalendarReq: CreateChatCalendarReq, idFromToken: string) {
        // const { recipentId, content, type, time } = createChatCalendarReq;

        // let chatRoom = await this.chatRoomModel.findOne({ userIds: [idFromToken, recipentId] }).exec();
        // if (!chatRoom) {
        //     chatRoom = await this.chatRoomsService.create(
        //         {
        //             userIds: [recipentId],
        //         },
        //         idFromToken,
        //     );
        // }

        // await this.messengerModel.create({
        //     content,
        //     type,
        //     time,
        //     createdBy: idFromToken,
        //     chatRoomId: chatRoom.id,
        //     createAt: Date.now(),
        // });

        return 'This action adds a new chatCalendar';
    }
}
