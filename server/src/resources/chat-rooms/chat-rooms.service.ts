import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoomResponse, CreateRoomReq, UpdateRoomReq } from './dto/chat-rooms.dto';
import { User } from 'resources/users/entities/user.entity';
import { Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { Messenger } from 'resources/messengers/entities/messenger.entity';

@Injectable()
export class ChatRoomsService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
        @InjectModel(Messenger.name) private messengerModel: Model<Messenger>,
    ) {}

    async create(createRoomChatReq: CreateRoomReq, idFromToken: string) {
        const user = await this.userModel.findOne({ _id: idFromToken }).exec(); // findById
        if (!user) {
            throw new BadRequestException('No User found');
        }

        const { name, userIds, isGroup } = createRoomChatReq;
        const chatRoom = await this.chatRoomModel.create({
            name,
            isGroup,
            userIds: [idFromToken, ...userIds],
            createAt: Date.now(),
        });
        return chatRoom;
    }

    async getDetail(chatRoomId: string, idFromToken: string) {
        const room = await this.chatRoomModel.findOne({ _id: chatRoomId }).exec(); // findById

        if (!room || !room.userIds.some((id) => id === idFromToken)) {
            throw new BadRequestException('Wrong chat! Please try again');
        }
        const messengers = await this.messengerModel.find({ chatRoomId: chatRoomId });

        const temp: ChatRoomResponse = new ChatRoomResponse(room, messengers);
        return temp;
    }

    async update(chatRoomId: string, updateRoomChatReq: UpdateRoomReq, idFromToken: string) {
        const room = await this.chatRoomModel.findOne({ _id: chatRoomId }).exec();

        if (!room || !room.userIds.some((id) => id === idFromToken)) {
            throw new BadRequestException('Wrong chat! Please try again');
        }

        const { name, userIds } = updateRoomChatReq;

        await room.updateOne({
            name: name || room.name,
            userIds: userIds || room.userIds,
        });

        return room;
    }
}
