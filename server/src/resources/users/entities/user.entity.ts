import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
    @Prop()
    name: string;
    @Prop()
    username: string;
    @Prop()
    fullName: string;
    @Prop()
    phoneNumber: string;
    @Prop()
    email: string;
    @Prop()
    password: string;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
