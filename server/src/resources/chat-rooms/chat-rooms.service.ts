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
    ) { }

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
        const result: ChatRoomDescriptionResponse[] = [];

        const chatParticipals = await this.chatParticipalModel.aggregate([
            {
                $match: {
                    userInformations: { $elemMatch: { userId: idFromToken, stillIn: true } }
                },
            },
            {
                $project: { chatRoomObjId: { $toObjectId: '$chatRoomId' }, userInformations: "$userInformations" },
            },
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: 'chatRoomObjId',
                    foreignField: '_id',
                    as: 'chatRooms',
                },
            },
        ])

        await Promise.all(chatParticipals.map(async (chatParticipal: any) => {
            const room = new ChatRoomDescriptionResponse(chatParticipal.chatRooms[0])

            if (!room.isGroup) {
                const userInformation = chatParticipal.userInformations.find(
                    (infor) => infor.userId !== idFromToken,
                );
                const userInfor = await this.usersService.getDetail(userInformation.userId);

                room.name = userInfor.fullName;
                room.avatar = userInfor.avatar;
                room.isOnline = userInfor.isOnline;
            }

            const myInfor = chatParticipal.userInformations.find((infor) => infor.userId === idFromToken);
            const { lastTimeReading } = myInfor;

            const lastMessenger = await this.messengerModel
                .findOne({ chatRoomId: room.id })
                .sort({ createdAt: -1 })
                .exec();

            if (lastMessenger) {
                let userName = MY_NAME;

                const { createdBy, createdAt, content } = lastMessenger;

                if (createdBy !== idFromToken) {
                    const userInfor = await this.usersService.getDetail(createdBy);

                    userName = userInfor.fullName;
                }

                room.lastMessengerInfor = {
                    createdBy: createdBy,
                    createdAt: createdAt,
                    content: content,
                    type: lastMessenger.type,
                    info: lastMessenger.info,
                    userName,
                    hasRead: new Date(lastTimeReading).getTime() > new Date(createdAt).getTime(),
                };
            }

            result.push(room);
        }))

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
        const chatParticipals = await this.chatParticipalModel.aggregate(
            [
                {
                    $match: {
                        userInformations: { $elemMatch: { userId: idFromToken, stillIn: true } },
                    }
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
                            $elemMatch: { name: { $regex: search, $options: 'i' } },
                        },
                    },
                },
            ]
        );
        const tempRooms: SearchedRoomDescriptionResponse[] = [];

        chatParticipals.forEach((chatParticipal) => {

            const room = new ChatRoomResponse(chatParticipal.chatRooms[0]);
            const description = `Gồm có ${chatParticipal.userInformations.length} thành viên`;
            tempRooms.push(new SearchedRoomDescriptionResponse(room.id, room.name, room.avatar, true, description));
        })

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

    async getPrivateChatRoom(userId: string) {
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
                $project: { chatRoomObjId: { $toObjectId: '$chatRoomId' }, infors: "$userInformations" },
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

        return chatParticipals.map((i) => ({
            chatRoomId: i.chatRoomObjId,
            userId: i.infors.find(infor => infor.userId !== userId)?.userId
        }))
    }

    async updateLastTimeReading(chatRoomId: string, idFromToken: string) {
        const chatParticipal = await this.chatParticipalsService.getDetailByChatRoomId(chatRoomId, idFromToken);

        const temp = [...chatParticipal.userInformations]
        const userInfor = temp.find(infor => infor.userId == idFromToken)
        userInfor.lastTimeReading = Date.now()

        await chatParticipal.update({
            userInformations: temp
        })

        return chatParticipal
    }
}
