import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterRequest {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6, 6)
    password: string;
}

export class LoginRequest {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @Length(6, 6)
    password: string;
}

export class ChangePasswordRequest {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @Length(6, 6)
    oldPassword: string;

    @IsNotEmpty()
    @Length(6, 6)
    newPassword: string;
}

export class ForgetPasswordRequest {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    @Length(6, 6)
    newPassword: string;
}
