import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatRoom extends Document {
    @Prop()
    name: string;
    @Prop()
    userIds: string[];
    @Prop()
    isGroup: boolean;
    @Prop()
    avatar: string;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

export { ChatRoomSchema };
