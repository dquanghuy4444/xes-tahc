import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UpdateUserReq } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getDetail(idFromToken: string) {
        const user = await this.userModel.findOne({ _id: idFromToken }).exec(); // findById
        if (!user) {
            throw new BadRequestException('No User found');
        }
        return {
            username: user.fullName,
        };
    }

    async update(idFromToken: string, updateUserReq: UpdateUserReq) {
        const user = await this.userModel
            .findByIdAndUpdate(
                idFromToken,
                {
                    name: updateUserReq.name,
                    phoneNumber: updateUserReq.phoneNumber,
                },
                { new: true },
            )
            .exec();
        if (!user) {
            throw new BadRequestException();
        }
        return ;
    }
}
