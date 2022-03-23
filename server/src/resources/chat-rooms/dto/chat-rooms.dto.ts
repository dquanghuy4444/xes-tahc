import { IsNotEmpty, IsOptional } from 'class-validator';
import { Messenger } from 'resources/messengers/entities/messenger.entity';
import { UserInfor } from 'resources/users/dto/user.dto';
import { ChatRoom } from '../entities/chat-room.entity';

export class CreateRoomReq {
    @IsOptional()
    name = 'Chat riêng';

    @IsOptional()
    isGroup = false;

    @IsOptional()
    avatar = 'https://thao68.com/wp-content/uploads/2022/02/avatar-hero-team-15.jpg';

    @IsNotEmpty()
    userIds: string[];
}

export class UpdateRoomReq {
    name: string;
    avatar: string;
}

interface IlastMessageInfor{
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

export class ChatRoomDetailResponse extends ChatRoomDescriptionResponse {
    messengers: Messenger[];
    userInfors: UserInfor[];

    constructor(chatRoom: ChatRoom,userInfors: UserInfor[] , messengers: Messenger[]) {
        super(chatRoom);
        this.messengers = messengers;
        this.userInfors = userInfors;
    }
}
