import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MessageInfo, MessageType } from '../entities/messenger.entity';

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
