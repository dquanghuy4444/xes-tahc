import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MessageAttachment, MessageInfo, ENUM_MESSAGE_TYPE, Messenger } from '../entities/messenger.entity';

export class CreateMessengerReq {
    @IsNotEmpty()
    @IsEnum(ENUM_MESSAGE_TYPE, { each: true })
    type: ENUM_MESSAGE_TYPE;

    @IsNotEmpty()
    chatRoomId: string;

    @IsOptional()
    content = '';

    @IsOptional()
    info?: MessageInfo;
}

export class CreateMessengerByFilesReq {
    @IsNotEmpty()
    chatRoomId: string;
}

export class MessengerResponse {
    id: string;
    type: ENUM_MESSAGE_TYPE;
    chatRoomId: string;
    createdBy: string;
    content?: string;
    attachment?: MessageAttachment;
    info?: MessageInfo;
    createdAt: Date;

    constructor(messenger: Messenger) {
        this.id = messenger.id;
        this.type = messenger.type;
        this.chatRoomId = messenger.chatRoomId;
        this.createdBy = messenger.createdBy;
        this.content = messenger.content;
        this.attachment = messenger.attachment;
        this.info = messenger.info;
        this.createdAt = messenger.createdAt;
    }
}
