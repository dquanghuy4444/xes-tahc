import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ENUM_MESSAGE_TYPE {
    INFO = 'INFO',
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
}

export enum ENUM_MESSAGE_INFO_TYPE {
    JOIN_CHAT = 'JOIN_CHAT',
    LEAVE_CHAT = 'LEAVE_CHAT',
    INVITED = 'INVITED',
    REJECTED = 'REJECTED',
    CHANGE_NAME_GROUP = 'CHANGE_NAME_GROUP',
}

export class MessageInfo {
    type: ENUM_MESSAGE_INFO_TYPE;
    victim?: string;
}

export class MessageAttachment {
    name: string;
    path: string;
}

@Schema()
export class Messenger extends Document {
    @Prop()
    type: ENUM_MESSAGE_TYPE;
    @Prop()
    chatRoomId: string;
    @Prop()
    createdBy: string;
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
