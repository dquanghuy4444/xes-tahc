import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ChatCalendarType {
    REVERSE_COUNT = 'REVERSE_COUNT',
    CALENDAR_DAILY = 'CALENDAR_DAILY',
}
@Schema()
export class ChatCalendar extends Document {
    @Prop()
    createdBy: string;
    @Prop()
    content: string;
    @Prop()
    chatRoomId: string;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
    @Prop({ default: 0 })
    numberRuns: number;
    @Prop()
    type: ChatCalendarType;
    @Prop()
    time: string;
}

const ChatCalendarSchema = SchemaFactory.createForClass(ChatCalendar);

export { ChatCalendarSchema };
