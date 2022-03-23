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

        const result: ChatRoomDescriptionResponse[] = [];

        await Promise.all(
            rooms.map(async (room) => {
                const item = new ChatRoomDescriptionResponse(room);
                const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(room.id);

                if (!room.isGroup) {
                    const userInfor = chatParticipal.userInformations.find((infor) => infor.userId !== idFromToken);
                    const user = await this.userModel.findById(userInfor.userId).exec(); // findById

                    item.name = user.fullName;
                }

                const myInfor = chatParticipal.userInformations.find((infor) => infor.userId === idFromToken);
                const { lastTimeReading } = myInfor;

                const lastMessage = await this.messengerModel
                    .findOne({ chatRoomId: room.id })
                    .sort({ createdAt: -1 })
                    .exec();

                if (lastMessage) {
                    let nameUser = 'Bạn';

                    if (room.isGroup && lastMessage.senderId !== idFromToken) {
                        const user = await this.userModel.findById(lastMessage.senderId).exec(); // findById
                        nameUser = user.fullName;
                    }
                    item.lastMessageInfor = {
                        createdAt: lastMessage.createdAt,
                        content: lastMessage.content,
                        nameUser,
                        hasRead: new Date(lastMessage.createdAt).getTime() <= new Date(lastTimeReading).getTime(),
                    };
                }

                result.push(item);
            }),
        );

        return result;
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
