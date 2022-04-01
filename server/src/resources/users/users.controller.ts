import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ROUTER_USERS } from 'configs/routers';
import { IdFromToken } from 'common/decorators/auth.decorator';
import { IGetAllUserReq, IUpdateOnlOffStatusReq, UserInfor } from './dto/user.dto';

@Controller(ROUTER_USERS)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getAll(@IdFromToken() idFromToken: string, @Req() req) {
        return this.usersService.getAll(req.query, idFromToken);
    }

    @Get('me')
    getMyDetail(@IdFromToken() idFromToken: string) {
        return this.usersService.getDetail(idFromToken);
    }

    @Put('me')
    update(@IdFromToken() idFromToken: string, @Body() request: UserInfor) {
        return this.usersService.update(request, idFromToken);
    }

    @Put('status')
    updateOnlOffStatus(@Body() request: IUpdateOnlOffStatusReq) {
        return this.usersService.updateOnlOffStatus(request);
    }
}
