import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum MessageType {
    INFO = 'INFO',
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
}

export enum MessageInfoType {
    JOIN_CHAT = 'JOIN_CHAT',
    LEAVE_CHAT = 'LEAVE_CHAT',
    INVITED = 'INVITED',
    REJECTED = 'REJECTED',
}

export class MessageInfo {
    type: MessageInfoType;
    byUserId?: string;
}

export class MessageAttachment {
    name: string;
    path: string;
}

@Schema()
export class Messenger extends Document {
    @Prop()
    type: MessageType;
    @Prop()
    chatRoomId: string;
    @Prop()
    senderId: string;
    @Prop()
    content?: string;
    @Prop()
    attachment?: MessageAttachment;
    @Prop()
    info?: MessageInfo;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

const MessengerSchema = SchemaFactory.createForClass(Messenger);

export { MessengerSchema };
