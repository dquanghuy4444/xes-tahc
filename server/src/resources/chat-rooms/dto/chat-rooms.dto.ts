import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageAttachment, MessageInfo, MessageType, Messenger } from 'resources/messengers/entities/messenger.entity';
import { UserInfor } from 'resources/users/dto/user.dto';
import { ChatRoom } from '../entities/chat-room.entity';

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
    name: string;
    avatar: string;
}

interface IlastMessageInfor {
    content: string;
    userName: string;
    createdAt: Date;
    hasRead: boolean;
}

export class ChatRoomDescriptionResponse {
    id: string;
    name: string;
    isGroup: boolean;
    avatar: string;
    lastMessageInfor: IlastMessageInfor;

    constructor(chatRoom: ChatRoom) {
        this.id = chatRoom.id;
        this.name = chatRoom.name;
        this.avatar = chatRoom.avatar;
        this.isGroup = chatRoom.isGroup;
        this.lastMessageInfor = null;
    }
}

export class MessengerResponse {
    type: MessageType;
    chatRoomId: string;
    senderId: string;
    content?: string;
    attachment?: MessageAttachment;
    info?: MessageInfo;
    createdAt: Date;

    constructor(messenger: Messenger) {
        this.type = messenger.type;
        this.chatRoomId = messenger.chatRoomId;
        this.senderId = messenger.senderId;
        this.content = messenger.content;
        this.attachment = messenger.attachment;
        this.info = messenger.info;
        this.createdAt = messenger.createdAt;
    }
}

export class ChatRoomDetailResponse extends ChatRoomDescriptionResponse {
    messengers: MessengerResponse[];
    userInfors: UserInfor[];

    constructor(chatRoom: ChatRoom, userInfors: UserInfor[], messengers: Messenger[]) {
        super(chatRoom);
        this.messengers = messengers;
        this.userInfors = userInfors;
    }
}
