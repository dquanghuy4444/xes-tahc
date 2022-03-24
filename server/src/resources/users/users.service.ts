import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserInfor } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getAll(query: any, id: string) {
        await this.getDetail(id);

        const { remove_users } = query;

        const removeUsers = remove_users?.split(',').filter(Boolean) || [];

        const users = await this.userModel
            .find({
                _id: {
                    $nin: [...removeUsers , id],
                },
            })
            .exec();

        return users.map((user) => new UserInfor(user));
    }

    async getDetail(id: string): Promise<UserInfor> {
        const user = await this.userModel.findById(id).exec(); // findById
        if (!user) {
            throw new BadRequestException('No User found');
        }
        return new UserInfor(user);
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
