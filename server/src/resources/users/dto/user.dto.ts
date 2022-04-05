import { User } from '../entities/user.entity';

export class UserInfor {
    id: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
    email: string;
    isOnline: boolean;
    lastTimeOnline: Date;

    constructor(user: User) {
        this.id = user.id;
        this.fullName = user.fullName;
        this.avatar = user.avatar;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
        this.isOnline = user.isOnline;
        this.lastTimeOnline = user.lastTimeOnline;

    }
}

export interface IGetAllUserReq {
    remove_users?: string;
    search?: string;
}


export interface IUpdateOnlOffStatusReq{
    id: string;
    isOnline: boolean;
}
