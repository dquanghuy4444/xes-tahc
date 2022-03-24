import { Module } from '@nestjs/common';
import { MessengersService } from './messengers.service';
import { MessengersController } from './messengers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomSchema , ChatRoom } from 'resources/chat-rooms/entities/chat-room.entity';
import { Messenger, MessengerSchema } from './entities/messenger.entity';
import { ChatParticipalsModule } from 'resources/chat-participals/chat-participals.module';

@Module({
    imports: [
        ChatParticipalsModule,
        MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
        MongooseModule.forFeature([{ name: Messenger.name, schema: MessengerSchema }]),
    ],
    controllers: [MessengersController],
    providers: [MessengersService],
    exports:[MessengersService]

})
export class MessengersModule {}
