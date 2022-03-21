import { Controller, Get, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ROUTER_USERS } from 'configs/routers';
import { IdFromToken} from 'common/decorators/auth.decorator';
import { UpdateUserReq } from './dto/user.dto';

@Controller(ROUTER_USERS)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getDetail(@IdFromToken() idFromToken: string) {
        return this.usersService.getDetail(idFromToken);
    }

    @Put('me')
    update(@IdFromToken() idFromToken: string, @Body() request: UpdateUserReq) {
        return this.usersService.update(idFromToken, request);
    }
}
