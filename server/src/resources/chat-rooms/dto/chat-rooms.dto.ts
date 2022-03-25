import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ENUM_MESSAGE_TYPE, MessageInfo } from 'resources/messengers/entities/messenger.entity';
import { UserInfor } from 'resources/users/dto/user.dto';
import { ChatRoom } from '../entities/chat-room.entity';

export enum ENUM_UPDATE_MEMBER_TYPE {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}

export class CreateRoomReq {
    @IsOptional()
    name = 'Chat riêng';

    @IsOptional()
    isGroup = false;

    @IsOptional()
    avatar: string;

    @IsNotEmpty()
    userIds: string[];
}

export class UpdateRoomReq {
    @IsOptional()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    avatar: string;
}

export class UpdateMemberReq {
    @IsNotEmpty()
    @IsEnum(ENUM_UPDATE_MEMBER_TYPE, { each: true })
    type: ENUM_UPDATE_MEMBER_TYPE;

    @IsNotEmpty()
    userIds: string[];
}

interface ILastMessengerInfor {
    content: string;
    type: ENUM_MESSAGE_TYPE;
    userName: string;
    createdAt: Date;
    hasRead: boolean;
    info?: MessageInfo;
}

export class ChatRoomDescriptionResponse {
    id: string;
    name: string;
    isGroup: boolean;
    avatar: string;
    lastMessengerInfor: ILastMessengerInfor;
    createdBy: string;
    createdAt: Date;

    constructor(chatRoom: ChatRoom) {
        this.id = chatRoom.id;
        this.name = chatRoom.name;
        this.avatar = chatRoom.avatar;
        this.isGroup = chatRoom.isGroup;
        this.createdBy = chatRoom.createdBy;
        this.createdAt = chatRoom.createdAt;
        this.lastMessengerInfor = null;
    }
}

export class ChatRoomDetailResponse extends ChatRoomDescriptionResponse {
    userInfors: UserInfor[];

    constructor(chatRoom: ChatRoom, userInfors: UserInfor[]) {
        super(chatRoom);
        this.userInfors = userInfors;
    }
}
