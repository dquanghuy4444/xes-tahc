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
import { ChatParticipalsService } from 'resources/chat-participals/chat-participals.service';
import { IUserInformation } from 'resources/chat-participals/entities/chat-participal.entity';

@Injectable()
export class ChatRoomsService {
    constructor(
        private readonly chatParticipalsService: ChatParticipalsService,
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
            createAt: Date.now(),
            createdBy: idFromToken,
        });

        const userInformations: IUserInformation[] = [idFromToken, ...userIds].map((userId) => ({
            userId,
            lastTimeReading: Date.now(),
        }));
        await this.chatParticipalsService.create({
            chatRoomId: chatRoom.id,
            userInformations,
        });
        return chatRoom;
    }

    async getDetail(chatRoomId: string, idFromToken: string) {
        const room = await this.chatRoomModel.findOne({ _id: chatRoomId }).exec(); // findById

        const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(room.id);

        if (!room || !chatParticipal.userInformations.some((infor) => infor.userId === idFromToken)) {
            throw new BadRequestException('Wrong chat! Please try again');
        }
        const messengers = await this.messengerModel.find({ chatRoomId: chatRoomId });

        return new ChatRoomDetailResponse(room, messengers);
    }

    async getMyChatRooms(idFromToken: string) {
        const rooms = await this.chatRoomModel.find({ userIds: idFromToken }).exec(); // findById

        const chatPrivateRooms = rooms.filter((item) => !item.isGroup);

        const tempChatRoomDescriptionsResponse: ChatRoomDescriptionResponse[] = [];

        const lastMessage = null;
        await Promise.all(
            chatPrivateRooms.map(async (room) => {
                const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(room.id);

                const userId = chatParticipal.userInformations.find((infor) => infor.userId !== idFromToken);

                const user = await this.userModel.findById(userId).exec(); // findById

                const item = new ChatRoomDescriptionResponse(room, lastMessage);
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

            return new ChatRoomDescriptionResponse(room, lastMessage);
        });

        return results;
    }

    async update(chatRoomId: string, updateRoomChatReq: UpdateRoomReq, idFromToken: string) {
        const room = await this.chatRoomModel.findOne({ _id: chatRoomId }).exec();
        const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(room.id);

        if (!room || !chatParticipal.userInformations.some((infor) => infor.userId === idFromToken)) {
            throw new BadRequestException('Wrong chat! Please try again');
        }

        const { name, avatar } = updateRoomChatReq;

        await room.updateOne({
            name: name || room.name,
            avatar: avatar || room.avatar,
        });

        return room;
    }
}
