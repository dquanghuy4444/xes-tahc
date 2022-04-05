import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatParticipalReq } from './dto/chat-participal.dto';
import { Model } from 'mongoose';
import { ChatParticipal, IUserInformation } from './entities/chat-participal.entity';

@Injectable()
export class ChatParticipalsService {
    constructor(@InjectModel(ChatParticipal.name) private chatParticipalModel: Model<ChatParticipal>) { }

    async create(createChatParticipalReq: CreateChatParticipalReq) {
        const chatParticipals = await this.chatParticipalModel.create(createChatParticipalReq);

        return chatParticipals
    }

    async getDetailByChatRoomId(chatRoomId: string, userId: string) {
        const chatParticipal = await this.chatParticipalModel
            .findOne({ chatRoomId, userInformations: { $elemMatch: { userId, stillIn: true } } })
            .exec();
        if (!chatParticipal) {
            throw new BadRequestException('Wrong chat! Please try again');
        }
        return chatParticipal;
    }

    async addMember(chatRoomId: string, userInfors: IUserInformation[], userId: string) {
        const chatParticipal = await this.getDetailByChatRoomId(chatRoomId, userId);

        const temp = [...userInfors];
        const newUserInformations = chatParticipal.userInformations.map((info) => {
            if (userInfors.some((i) => i.userId === info.userId)) {
                temp.splice(
                    temp.findIndex((idx) => idx.userId === info.userId),
                    1,
                );

                return {
                    ...info,
                    stillIn: true,
                };
            }

            return info;
        });

        await chatParticipal.update({
            userInformations: [...newUserInformations, ...temp],
        });

        return true;
    }

    async updateStatusMember(chatRoomId: string, removedUserId: string, userId: string, status: boolean = false) {
        const chatParticipal = await this.getDetailByChatRoomId(chatRoomId, userId);

        const newUserInformations = chatParticipal.userInformations.map((info) => {
            if (removedUserId === info.userId) {
                return {
                    ...info,
                    stillIn: status,
                };
            }

            return info;
        });

        await chatParticipal.update({
            userInformations: newUserInformations,
        });
        return true;
    }
}
