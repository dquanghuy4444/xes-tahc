import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserInfor } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getDetail(id: string): Promise<UserInfor> {
        const user = await this.userModel.findById(id).exec(); // findById
        if (!user) {
            throw new BadRequestException('No User found');
        }
        return {
            id: user.id,
            fullName: user.fullName,
            avatar: user.avatar,
            phoneNumber: user.phoneNumber,
            email: user.email,
        };
    }

    async update(updateUserReq: UserInfor, idFromToken: string) {
        const user = await this.userModel
            .findByIdAndUpdate(
                idFromToken,
                {
                    fullName: updateUserReq.fullName,
                    phoneNumber: updateUserReq.phoneNumber,
                },
                { new: true },
            )
            .exec();
        if (!user) {
            throw new BadRequestException();
        }
        return;
    }
}
