import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    ChatRoomDescriptionResponse,
    ChatRoomDetailResponse,
    ChatRoomResponse,
    CreateRoomReq,
    ENUM_UPDATE_MEMBER_TYPE,
    SearchedRoomDescriptionResponse,
    UpdateMemberReq,
    UpdateRoomReq,
} from './dto/chat-rooms.dto';
import { Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { Messenger } from 'resources/messengers/entities/messenger.entity';
import { ChatParticipalsService } from 'resources/chat-participals/chat-participals.service';
import { ChatParticipal, IUserInformation } from 'resources/chat-participals/entities/chat-participal.entity';
import { UsersService } from 'resources/users/users.service';
import { MY_NAME } from 'configs';

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
            result.isOnline = userInfors[0].isOnline;
        }

        return result;
    }

    async getMyChatRooms(idFromToken: string) {
        const chatParticipals = await this.chatParticipalModel
            .find({
                userInformations: { $elemMatch: { userId: idFromToken, stillIn: true } },
            })
            .exec();
        const result: ChatRoomDescriptionResponse[] = [];

        await Promise.all(
            chatParticipals.map(async (chatParticipal) => {
                const room = await this.chatRoomModel.findById(chatParticipal.chatRoomId).exec(); // findById

                const item = new ChatRoomDescriptionResponse(room);

                if (!room.isGroup) {
                    const userInformation = chatParticipal.userInformations.find(
                        (infor) => infor.userId !== idFromToken,
                    );
                    const userInfor = await this.usersService.getDetail(userInformation.userId);

                    item.name = userInfor.fullName;
                    item.avatar = userInfor.avatar;
                    item.isOnline = userInfor.isOnline;
                }

                const myInfor = chatParticipal.userInformations.find((infor) => infor.userId === idFromToken);
                const { lastTimeReading } = myInfor;

                const lastMessenger = await this.messengerModel
                    .findOne({ chatRoomId: room.id })
                    .sort({ createdAt: -1 })
                    .exec();

                if (lastMessenger) {
                    let userName = MY_NAME;

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

    async searchMyChatRooms(search: string, idFromToken: string) {
        if (!search) {
            return [];
        }
        const tempRooms: SearchedRoomDescriptionResponse[] = [];
        const chatParticipals = await this.chatParticipalModel.find({
            userInformations: { $elemMatch: { userId: idFromToken, stillIn: true } },
        });

        await Promise.all(
            chatParticipals.map(async (chatParticipal) => {
                const roomModel = await this.chatRoomModel
                    .findOne({ _id: chatParticipal.chatRoomId, name: { $regex: search, $options: 'i' } })
                    .exec();
                if (!roomModel) {
                    return;
                }
                const room = new ChatRoomResponse(roomModel);
                const description = `Gồm có ${chatParticipal.userInformations.length} thành viên`;
                tempRooms.push(new SearchedRoomDescriptionResponse(room.id, room.name, room.avatar, true, description));
            }),
        );

        const users = await this.usersService.getAll({ search }, idFromToken); // findById
        const tempUser = users.map(
            (user) => new SearchedRoomDescriptionResponse(user.id, user.fullName, user.avatar, false),
        );

        return [...tempRooms, ...tempUser];
    }

    async findRoom(userId: string, idFromToken: string) {
        const chatParticipals = await this.chatParticipalModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            userInformations: { $elemMatch: { userId, stillIn: true } },
                        },
                        {
                            userInformations: { $elemMatch: { userId: idFromToken, stillIn: true } },
                        },
                        {
                            $expr: {
                                $eq: [
                                    {
                                        $size: '$userInformations',
                                    },
                                    2,
                                ],
                            },
                        },
                    ],
                },
            },
            {
                $project: { chatRoomObjId: { $toObjectId: '$chatRoomId' } },
            },
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: 'chatRoomObjId',
                    foreignField: '_id',
                    as: 'chatRooms',
                },
            },
            {
                $match: {
                    chatRooms: {
                        $elemMatch: { isGroup: false },
                    },
                },
            },
        ]);

        if (chatParticipals.length === 0) {
            const chatRoom = await this.create(
                {
                    name: '',
                    avatar: '',
                    isGroup: false,
                    userIds: [userId],
                },
                idFromToken,
            );

            return chatRoom.id;
        }

        return chatParticipals[0]?.chatRooms[0]._id;
    }

    async getPrivateChatRoom(userId:string){
        await this.usersService.getDetail(userId);

        const chatParticipals = await this.chatParticipalModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            userInformations: { $elemMatch: { userId, stillIn: true } },
                        },
                        {
                            $expr: {
                                $eq: [
                                    {
                                        $size: '$userInformations',
                                    },
                                    2,
                                ],
                            },
                        },
                    ],
                },
            },
            {
                $project: { chatRoomObjId: { $toObjectId: '$chatRoomId' } , infors: "$userInformations" },
            },
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: 'chatRoomObjId',
                    foreignField: '_id',
                    as: 'chatRooms',
                },
            },
            {
                $match: {
                    chatRooms: {
                        $elemMatch: { isGroup: false },
                    },
                },
            },
        ]);

        return chatParticipals.map((i) =>({
            chatRoomId: i.chatRoomObjId,
            userId:  i.infors.find(infor => infor.userId !== userId)?.userId
        }))
    }
}
