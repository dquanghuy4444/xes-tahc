import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatRoom extends Document {
    @Prop()
    name: string;
    @Prop()
    isGroup: boolean;
    @Prop({ type: String, default: "https://i.pinimg.com/originals/fa/02/02/fa0202572e8aa734cedb154c413a4846.jpg" })
    avatar: string;
    @Prop()
    createdBy: string;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

export { ChatRoomSchema };
