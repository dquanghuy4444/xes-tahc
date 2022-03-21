import { IsNotEmpty } from 'class-validator';

export class UpdateUserReq {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phoneNumber: string;
}
