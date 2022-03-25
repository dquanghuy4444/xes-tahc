import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IUserInformation {
    userId: string;
    lastTimeReading: any;
    addedBy: string;
    addedAt: any;
    stillIn: boolean;
}

@Schema()
export class ChatParticipal extends Document {
    @Prop()
    userInformations: IUserInformation[];
    @Prop()
    chatRoomId: string;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

export const ChatParticipalSchema = SchemaFactory.createForClass(ChatParticipal);
