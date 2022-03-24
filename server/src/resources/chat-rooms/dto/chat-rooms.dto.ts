import { IsNotEmpty, IsOptional } from 'class-validator';
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
    @IsOptional()
    @IsNotEmpty()
    name: string;

    @IsOptional()
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
    createdBy: string;
    createdAt: Date;

    constructor(chatRoom: ChatRoom) {
        this.id = chatRoom.id;
        this.name = chatRoom.name;
        this.avatar = chatRoom.avatar;
        this.isGroup = chatRoom.isGroup;
        this.createdBy = chatRoom.createdBy;
        this.createdAt = chatRoom.createdAt;
        this.lastMessageInfor = null;
    }
}



export class ChatRoomDetailResponse extends ChatRoomDescriptionResponse {
    userInfors: UserInfor[];

    constructor(chatRoom: ChatRoom, userInfors: UserInfor[]) {
        super(chatRoom);
        this.userInfors = userInfors;
    }
}
