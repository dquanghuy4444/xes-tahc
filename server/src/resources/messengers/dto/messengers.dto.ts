import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MessageAttachment, MessageInfo, MessageType, Messenger } from '../entities/messenger.entity';

export class CreateMessengerReq {
    @IsNotEmpty()
    @IsEnum(MessageType, { each: true })
    type: MessageType;

    @IsNotEmpty()
    chatRoomId: string;

    @IsOptional()
    content?: string;

    @IsOptional()
    info?: MessageInfo;
}

export class CreateMessengerByFilesReq {
    @IsNotEmpty()
    chatRoomId: string;
}

export class MessengerResponse {
    id: string;
    type: MessageType;
    chatRoomId: string;
    senderId: string;
    content?: string;
    attachment?: MessageAttachment;
    info?: MessageInfo;
    createdAt: Date;

    constructor(messenger: Messenger) {
        this.id = messenger.id;
        this.type = messenger.type;
        this.chatRoomId = messenger.chatRoomId;
        this.senderId = messenger.senderId;
        this.content = messenger.content;
        this.attachment = messenger.attachment;
        this.info = messenger.info;
        this.createdAt = messenger.createdAt;
    }
}
