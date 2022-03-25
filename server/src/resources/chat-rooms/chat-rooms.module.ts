import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomSchema, ChatRoom } from './entities/chat-room.entity';
import { Messenger, MessengerSchema } from 'resources/messengers/entities/messenger.entity';
import { ChatParticipalsModule } from 'resources/chat-participals/chat-participals.module';
import { UsersModule } from 'resources/users/users.module';
import { ChatParticipal, ChatParticipalSchema } from 'resources/chat-participals/entities/chat-participal.entity';

@Module({
    imports: [
        ChatParticipalsModule,
        UsersModule,
        MongooseModule.forFeature([{ name: ChatParticipal.name, schema: ChatParticipalSchema }]),
        MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
        MongooseModule.forFeature([{ name: Messenger.name, schema: MessengerSchema }]),
    ],
    controllers: [ChatRoomsController],
    providers: [ChatRoomsService],
    exports:[ChatRoomsService]
})
export class ChatRoomsModule {}
