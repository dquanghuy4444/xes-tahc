import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    ChatRoomDescriptionResponse,
    ChatRoomDetailResponse,
    CreateRoomReq,
    UpdateRoomReq,
} from './dto/chat-rooms.dto';
import { User } from 'resources/users/entities/user.entity';
import { Model, Types } from 'mongoose';
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

        const { name, userIds, isGroup, avatar } = createRoomChatReq;
        const chatRoom = await this.chatRoomModel.create({
            name,
            isGroup,
            avatar,
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

        return new ChatRoomDetailResponse(room, messengers);
    }

    async getMyChatRooms(idFromToken: string) {
        const rooms = await this.chatRoomModel.find({ userIds: idFromToken }).exec(); // findById

        const chatPrivateRooms = rooms.filter((item) => !item.isGroup);

        const tempChatRoomDescriptionsResponse: ChatRoomDescriptionResponse[] = [];
        await Promise.all(
            chatPrivateRooms.map(async (room) => {
                const userId = room.userIds.find((id) => id !== idFromToken);

                const user = await this.userModel.findById(userId).exec(); // findById

                const item = new ChatRoomDescriptionResponse(room);
                item.name = user.fullName;
                tempChatRoomDescriptionsResponse.push(item);
            }),
        );

        const results = rooms.map((room) => {
            const tempRoom = tempChatRoomDescriptionsResponse.find((crDes) =>
                (room._id as Types.ObjectId).equals(crDes.id),
            );
            if (tempRoom) {
                return tempRoom;
            }

            return new ChatRoomDescriptionResponse(room);
        });

        return results
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
