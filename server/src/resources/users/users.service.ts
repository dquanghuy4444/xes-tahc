import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { IGetAllUserReq, IUpdateOnlOffStatusReq, UserInfor } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getAll(query: IGetAllUserReq, idFromToken: string) {
        await this.getDetail(idFromToken);

        const { remove_users, search = '' } = query;

        const removeUsers = remove_users?.split(',').filter(Boolean) || [];

        const users = await this.userModel
            .find({
                _id: {
                    $nin: [...removeUsers, idFromToken],
                },
                fullName: { $regex: search, $options: 'i' },
            })
            .exec();

        return users.map((user) => new UserInfor(user));
    }

    async getDetail(idFromToken: string): Promise<UserInfor> {
        const user = await this.userModel.findById(idFromToken).exec(); // findById
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
                    isOnline: updateUserReq.isOnline,
                },
                { new: true },
            )
            .exec();
        if (!user) {
            throw new BadRequestException();
        }
        return true;
    }

    async updateOnlOffStatus(updateOnlOffStatusReq: IUpdateOnlOffStatusReq) {

        const user = await this.userModel
            .findByIdAndUpdate(
                updateOnlOffStatusReq.id,
                {
                    isOnline: updateOnlOffStatusReq.isOnline,
                },
                { new: true },
            )
            .exec();
        if (!user) {
            throw new BadRequestException();
        }
        return true;
    }
}
