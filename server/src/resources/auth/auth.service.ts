import { BadRequestException, Injectable } from '@nestjs/common';
import { ChangePasswordRequest, ForgetPasswordRequest, LoginRequest, RegisterRequest } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { createTransport } from 'nodemailer';
import { sign } from 'jsonwebtoken';
import { ENUM_ENVIRONMENT_VARIABLE, getEnv } from 'configs/env';
import { User } from 'resources/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    private createToken(userId: string): string {
        return sign(
            {
                id: userId,
            },
            getEnv(ENUM_ENVIRONMENT_VARIABLE.SECRET_OR_PUBLIC_KEY),
        );
    }

    private async sendMail(email, subject, text, html) {
        const smtpTransport = createTransport({
            service: getEnv(ENUM_ENVIRONMENT_VARIABLE.NODEMAILER_MAIL_SERVICE),
            auth: {
                user: getEnv(ENUM_ENVIRONMENT_VARIABLE.NODEMAILER_MAIL_USERNAME),
                pass: getEnv(ENUM_ENVIRONMENT_VARIABLE.NODEMAILER_MAIL_PASSWORD),
            },
        });

        await smtpTransport.sendMail({
            from: getEnv(ENUM_ENVIRONMENT_VARIABLE.NODEMAILER_MAIL_USERNAME),
            to: email,
            subject,
            text,
            html,
        });
    }

    async register(registerReq: RegisterRequest): Promise<string> {
        const { username, password, phoneNumber, email, fullName } = registerReq;
        let user = await this.userModel.findOne({ username }).exec();
        if (user) {
            throw new BadRequestException('Username exists');
        }
        user = await this.userModel.create({
            username,
            phoneNumber,
            email,
            fullName,
            isOnline: false,
            password: await hash(password, 10),
        });
        const authToken = this.createToken(user._id as string);
        return authToken;
    }

    async login(loginReq: LoginRequest): Promise<string> {
        const { username, password } = loginReq;
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new BadRequestException('No User found');
        }
        const passwordValid = await compare(password, user.password);

        if (!passwordValid) {
            throw new BadRequestException('Invalid password');
        }
        const authToken = this.createToken(user._id as string);
        return authToken;
    }

    async changePassword(changePasswordReq: ChangePasswordRequest): Promise<string> {
        const { username, oldPassword, newPassword } = changePasswordReq;
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new BadRequestException('No User found');
        }
        const passwordValid = await compare(oldPassword, user.password);
        if (!passwordValid) {
            throw new BadRequestException('Invalid password');
        }
        await this.sendMail('dquanghuy4444@gmail.com', 'huy test', 'huy test', '<h4>huy hgfhgfhfg</h4>');
        await user.updateOne({
            password: await hash(newPassword, 10),
        });

        return 'success';
    }

    async forgetPassword(forgetPasswordReq: ForgetPasswordRequest): Promise<string> {
        const { username, phoneNumber, newPassword } = forgetPasswordReq;
        const user = await this.userModel.findOne({ username, phoneNumber }).exec();
        if (!user) {
            throw new BadRequestException('No User found');
        }
        await user.updateOne({
            password: await hash(newPassword, 10),
        });

        return 'success';
    }
}
