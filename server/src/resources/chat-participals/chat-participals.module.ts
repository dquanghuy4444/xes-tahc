import { Module } from '@nestjs/common';
import { ChatParticipalsService } from './chat-participals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatParticipal, ChatParticipalSchema } from './entities/chat-participal.entity';

@Module({
    imports: [MongooseModule.forFeature([{ name: ChatParticipal.name, schema: ChatParticipalSchema }])],
    providers: [ChatParticipalsService],
    exports: [ChatParticipalsService],
})
export class ChatParticipalsModule {}
