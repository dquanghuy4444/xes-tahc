import { Controller, Get, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ROUTER_USERS } from 'configs/routers';
import { IdFromToken} from 'common/decorators/auth.decorator';
import { UserInfor } from './dto/user.dto';

@Controller(ROUTER_USERS)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getMyDetail(@IdFromToken() idFromToken: string) {
        return this.usersService.getDetail(idFromToken);
    }

    @Put('me')
    update(@IdFromToken() idFromToken: string, @Body() request: UserInfor) {
        return this.usersService.update(request , idFromToken);
    }
}
