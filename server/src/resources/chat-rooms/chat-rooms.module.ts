import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'resources/users/entities/user.entity';
import { ChatRoomSchema, ChatRoom } from './entities/chat-room.entity';
import { Messenger, MessengerSchema } from 'resources/messengers/entities/messenger.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
        MongooseModule.forFeature([{ name: Messenger.name, schema: MessengerSchema }]),
    ],
    controllers: [ChatRoomsController],
    providers: [ChatRoomsService],
    exports:[ChatRoomsService]
})
export class ChatRoomsModule {}
