import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
    @Prop({ type: String, default: 'https://thao68.com/wp-content/uploads/2022/02/avatar-hero-team-15.jpg' })
    avatar: string;
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
