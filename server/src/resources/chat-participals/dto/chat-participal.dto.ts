import { IsNotEmpty } from 'class-validator';
import { IUserInformation } from '../entities/chat-participal.entity';

export class CreateChatParticipalReq {
    @IsNotEmpty()
    userInformations: IUserInformation[];

    @IsNotEmpty()
    chatRoomId: string;
}
