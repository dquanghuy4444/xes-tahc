import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessengerReq, CreateMessengerByFilesReq , MessengerResponse } from './dto/messengers.dto';
import { ChatRoom } from 'resources/chat-rooms/entities/chat-room.entity';
import { MessageType, Messenger } from './entities/messenger.entity';
import { ChatParticipalsService } from 'resources/chat-participals/chat-participals.service';

@Injectable()
export class MessengersService {
    constructor(
        private readonly chatParticipalsService: ChatParticipalsService,

        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
        @InjectModel(Messenger.name) private messengerModel: Model<Messenger>,
    ) {}

    async create(createMessengerReq: CreateMessengerReq, idFromToken: string) {
        const { chatRoomId, type } = createMessengerReq;
        const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec(); // findById
        if (!chatRoom) {
            throw new BadRequestException('Wrong chat! Please try again');
        }

        const doc: any = {
            type,
            chatRoomId,
        };

        if (type === MessageType.TEXT && createMessengerReq.content) {
            doc.content = createMessengerReq.content;
        }
        if (type === MessageType.INFO && createMessengerReq.info) {
            doc.info = createMessengerReq.info;
        }

        await this.messengerModel.create({
            ...doc,
            senderId: idFromToken,
        });
        return '';
    }

    async get(chatRoomId: string, idFromToken: string) {
        await this.chatParticipalsService.getDetailByChatRoomId(chatRoomId, idFromToken);

        const messengers = await this.messengerModel.find({ chatRoomId });

        return messengers.map((mess) => new MessengerResponse(mess));
    }

    async createByFiles(
        createMessengerByFilesReq: CreateMessengerByFilesReq,
        files: Express.Multer.File[],
        idFromToken: string,
    ) {
        console.log(files);
    }
}
