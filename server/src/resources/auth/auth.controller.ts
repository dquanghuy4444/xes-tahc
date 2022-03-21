import { Controller, Post, Body } from '@nestjs/common';
import { ROUTER_AUTHEN } from 'configs/routers';
import { AuthService } from './auth.service';
import { ChangePasswordRequest, ForgetPasswordRequest, LoginRequest, RegisterRequest } from './dto/auth.dto';

@Controller(ROUTER_AUTHEN)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerRequest: RegisterRequest) {
        return this.authService.register(registerRequest);
    }

    @Post('login')
    login(@Body() loginRequest: LoginRequest) {
        return this.authService.login(loginRequest);
    }

    @Post('change-password')
    changePassword(@Body() changePasswordRequest: ChangePasswordRequest) {
        return this.authService.changePassword(changePasswordRequest);
    }

    @Post('forget-password')
    forgetPassword(@Body() forgetPasswordRequest: ForgetPasswordRequest) {
        return this.authService.forgetPassword(forgetPasswordRequest);
    }
}
