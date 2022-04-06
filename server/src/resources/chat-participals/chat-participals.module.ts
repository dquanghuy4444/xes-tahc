import { Module } from '@nestjs/common';
import { ChatParticipalsService } from './chat-participals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatParticipal, ChatParticipalSchema } from './entities/chat-participal.entity';
import { ChatRoom, ChatRoomSchema } from 'resources/chat-rooms/entities/chat-room.entity';

@Module({
    imports: [
    MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
        MongooseModule.forFeature([{ name: ChatParticipal.name, schema: ChatParticipalSchema }])
    ],
    providers: [ChatParticipalsService],
    exports: [ChatParticipalsService],
})
export class ChatParticipalsModule { }
