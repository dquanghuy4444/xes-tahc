import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    ChatRoomDescriptionResponse,
    ChatRoomDetailResponse,
    CreateRoomReq,
    UpdateRoomReq,
} from './dto/chat-rooms.dto';
import { Model, Types } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { Messenger } from 'resources/messengers/entities/messenger.entity';
import { ChatParticipalsService } from 'resources/chat-participals/chat-participals.service';
import { IUserInformation } from 'resources/chat-participals/entities/chat-participal.entity';
import { UsersService } from 'resources/users/users.service';

@Injectable()
export class ChatRoomsService {
    constructor(
        private readonly chatParticipalsService: ChatParticipalsService,
        private readonly usersService: UsersService,
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
        @InjectModel(Messenger.name) private messengerModel: Model<Messenger>,
    ) {}

    async create(createRoomChatReq: CreateRoomReq, idFromToken: string) {
        const me = await this.usersService.getDetail(idFromToken);

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
            addedBy:me.id,
            stillIn:true
        }));
        await this.chatParticipalsService.create({
            chatRoomId: chatRoom.id,
            userInformations,
        });
        return chatRoom;
    }

    async getDetail(chatRoomId: string, idFromToken: string) {
        const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(chatRoomId, idFromToken);

        const userInfors = [];
        await Promise.all(
            chatParticipal.userInformations.map(async (infor) => {
                if (infor.userId !== idFromToken) {
                    const userInfor = await this.usersService.getDetail(infor.userId);
                    userInfors.push(userInfor);
                }
            }),
        );

        const room = await this.chatRoomModel.findById(chatRoomId).exec(); // findById

        const result = new ChatRoomDetailResponse(room, userInfors)
        if(!result.isGroup){
            result.name = userInfors[0].fullName
            result.avatar = userInfors[0].avatar
        }
        return result;
    }

    async getMyChatRooms(idFromToken: string) {
        const rooms = await this.chatRoomModel.find({ userIds: idFromToken }).exec(); // findById

        const result: ChatRoomDescriptionResponse[] = [];

        await Promise.all(
            rooms.map(async (room) => {
                const item = new ChatRoomDescriptionResponse(room);
                const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(room.id, idFromToken);

                if (!room.isGroup) {
                    const userInformations = chatParticipal.userInformations.find(
                        (infor) => infor.userId !== idFromToken,
                    );
                    const userInfor = await this.usersService.getDetail(userInformations.userId);

                    item.name = userInfor.fullName;
                    item.avatar = userInfor.avatar;
                }

                const myInfor = chatParticipal.userInformations.find((infor) => infor.userId === idFromToken);
                const { lastTimeReading } = myInfor;

                const lastMessage = await this.messengerModel
                    .findOne({ chatRoomId: room.id })
                    .sort({ createdAt: -1 })
                    .exec();

                if (lastMessage) {
                    let userName = 'Bạn';

                    if (room.isGroup && lastMessage.createdBy !== idFromToken) {
                        const userInfor = await this.usersService.getDetail(lastMessage.createdBy);

                        userName = userInfor.fullName;
                    }
                    item.lastMessageInfor = {
                        createdAt: lastMessage.createdAt,
                        content: lastMessage.content,
                        userName,
                        hasRead: new Date(lastMessage.createdAt).getTime() <= new Date(lastTimeReading).getTime(),
                    };
                }

                result.push(item);
            }),
        );

        return result;
    }

    async update(chatRoomId: string, updateRoomChatReq: UpdateRoomReq, idFromToken: string) {
        const room = await this.chatRoomModel.findById(chatRoomId).exec();
        await this.chatParticipalsService.getDetailByChatRoomId(room.id, idFromToken);

        const { name, avatar } = updateRoomChatReq;

        await room.updateOne({
            name: name || room.name,
            avatar: avatar || room.avatar,
        });

        return room;
    }
}
