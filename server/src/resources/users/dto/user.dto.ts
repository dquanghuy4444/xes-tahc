import { User } from '../entities/user.entity';

export class UserInfor {
    id: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
    email: string;

    constructor(user: User) {
        this.id = user.id;
        this.fullName = user.fullName;
        this.avatar = user.avatar;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
    }
}

export interface IGetAllUserReq {
    remove_users?: string;
    search?: string;
}
