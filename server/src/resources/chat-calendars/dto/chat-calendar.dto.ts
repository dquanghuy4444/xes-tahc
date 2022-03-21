import { IsEnum, IsNotEmpty } from 'class-validator';
import { ChatCalendarType } from '../entities/chat-calendar.entity';

export class CreateChatCalendarReq {
    @IsNotEmpty()
    recipentId: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    time: string;

    @IsNotEmpty()
    @IsEnum(ChatCalendarType, { each: true })
    type: ChatCalendarType;
}
