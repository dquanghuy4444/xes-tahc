import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    ChatRoomDescriptionResponse,
    ChatRoomDetailResponse,
    ChatRoomResponse,
    CreateRoomReq,
    ENUM_UPDATE_MEMBER_TYPE,
    UpdateMemberReq,
    UpdateRoomReq,
} from './dto/chat-rooms.dto';
import { Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { Messenger } from 'resources/messengers/entities/messenger.entity';
import { ChatParticipalsService } from 'resources/chat-participals/chat-participals.service';
import { ChatParticipal, IUserInformation } from 'resources/chat-participals/entities/chat-participal.entity';
import { UsersService } from 'resources/users/users.service';

@Injectable()
export class ChatRoomsService {
    constructor(
        private readonly chatParticipalsService: ChatParticipalsService,
        private readonly usersService: UsersService,
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
        @InjectModel(ChatParticipal.name) private chatParticipalModel: Model<ChatParticipal>,
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
            addedAt: Date.now(),
            addedBy: me.id,
            stillIn: true,
        }));

        const chatParticipals = await this.chatParticipalsService.create({
            chatRoomId: chatRoom.id,
            userInformations,
        });

        return new ChatRoomResponse(
            chatRoom,
            chatParticipals.userInformations.map((ui) => ui.userId),
        );
    }

    async getDetail(chatRoomId: string, idFromToken: string) {
        const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(chatRoomId, idFromToken);

        const userInfors = [];
        await Promise.all(
            chatParticipal.userInformations.map(async (infor) => {
                if (infor.userId !== idFromToken) {
                    const userInfor = await this.usersService.getDetail(infor.userId);
                    userInfors.push({
                        ...infor,
                        ...userInfor,
                    });
                }
            }),
        );

        const room = await this.chatRoomModel.findById(chatRoomId).exec(); // findById

        const result = new ChatRoomDetailResponse(room, userInfors);
        if (!result.isGroup) {
            result.name = userInfors[0].fullName;
            result.avatar = userInfors[0].avatar;
        }
        return result;
    }

    async getMyChatRooms(idFromToken: string) {
        const rooms = await this.chatRoomModel.find({ userIds: idFromToken }).exec(); // findById

        const result: ChatRoomDescriptionResponse[] = [];

        await Promise.all(
            rooms.map(async (room) => {
                const item = new ChatRoomDescriptionResponse(room);
                const chatParticipal = await this.chatParticipalModel
                    .findOne({
                        chatRoomId: room.id,
                        userInformations: { $elemMatch: { userId: idFromToken, stillIn: true } },
                    })
                    .exec();
                if (!chatParticipal) {
                    return;
                }
                if (!room.isGroup) {
                    const userInformation = chatParticipal.userInformations.find(
                        (infor) => infor.userId !== idFromToken,
                    );
                    const userInfor = await this.usersService.getDetail(userInformation.userId);

                    item.name = userInfor.fullName;
                    item.avatar = userInfor.avatar;
                }

                const myInfor = chatParticipal.userInformations.find((infor) => infor.userId === idFromToken);
                const { lastTimeReading } = myInfor;

                const lastMessenger = await this.messengerModel
                    .findOne({ chatRoomId: room.id })
                    .sort({ createdAt: -1 })
                    .exec();

                if (lastMessenger) {
                    let userName = 'Bạn';

                    if (room.isGroup && lastMessenger.createdBy !== idFromToken) {
                        const userInfor = await this.usersService.getDetail(lastMessenger.createdBy);

                        userName = userInfor.fullName;
                    }
                    item.lastMessengerInfor = {
                        createdBy: lastMessenger.createdBy,
                        createdAt: lastMessenger.createdAt,
                        content: lastMessenger.content,
                        type: lastMessenger.type,
                        info: lastMessenger.info,
                        userName,
                        hasRead: new Date(lastMessenger.createdAt).getTime() <= new Date(lastTimeReading).getTime(),
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

    async updateMember(chatRoomId: string, updateMemberReq: UpdateMemberReq, idFromToken: string) {
        const { type, userIds } = updateMemberReq;

        if (type === ENUM_UPDATE_MEMBER_TYPE.ADD) {
            const temp: IUserInformation[] = userIds.map((userId) => ({
                userId,
                lastTimeReading: Date.now(),
                addedBy: idFromToken,
                addedAt: Date.now(),
                stillIn: true,
            }));

            const res = await this.chatParticipalsService.addMember(chatRoomId, temp, idFromToken);

            return res;
        }

        if (type === ENUM_UPDATE_MEMBER_TYPE.REMOVE) {
            const res = await this.chatParticipalsService.removeMember(chatRoomId, userIds[0], idFromToken);

            return res;
        }
    }
}
