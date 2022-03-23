import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatParticipalReq } from './dto/chat-participal.dto';
import { Model } from 'mongoose';
import { ChatParticipal } from './entities/chat-participal.entity';

@Injectable()
export class ChatParticipalsService {
    constructor(@InjectModel(ChatParticipal.name) private chatParticipalModel: Model<ChatParticipal>) {}

    async create(createChatParticipalReq: CreateChatParticipalReq) {
        console.log(createChatParticipalReq);
        await this.chatParticipalModel.create(createChatParticipalReq);
    }

    async getDetailByChatRoomId(chatRoomId: string){
        const chatParticipal = await this.chatParticipalModel.findOne({chatRoomId}).exec();

        return chatParticipal
    }
}
