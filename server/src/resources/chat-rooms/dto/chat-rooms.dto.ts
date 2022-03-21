import { IsNotEmpty, IsOptional } from 'class-validator';
import { Messenger } from 'resources/messengers/entities/messenger.entity';

export class CreateRoomReq {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    isGroup = false;

    @IsNotEmpty()
    userIds: string[];
}

export class UpdateRoomReq {
    name: string;
    userIds: string[];
}

class ChatRoom {
    name: string;
    userIds: string[];
    isGroup: boolean;
    createdAt: Date;

    constructor(name: string, userIds: string[], isGroup: boolean, createdAt: Date) {
        this.name = name;
        this.userIds = userIds;
        this.isGroup = isGroup;
        this.createdAt = createdAt;
    }
}

export class ChatRoomResponse extends ChatRoom {
    messengers: Messenger[];

    constructor(chatRoom: ChatRoom, messengers: Messenger[]) {
        super(chatRoom.name, chatRoom.userIds, chatRoom.isGroup, chatRoom.createdAt);
        this.messengers = messengers;
    }
}
