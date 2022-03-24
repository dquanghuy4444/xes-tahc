import { Controller, Post, Body, UseInterceptors, UploadedFiles , Param , Get } from '@nestjs/common';
import { MessengersService } from './messengers.service';
import { ROUTER_MESSENGERS } from 'configs/routers';
import { CreateMessengerByFilesReq, CreateMessengerReq } from './dto/messengers.dto';
import { IdFromToken } from 'common/decorators/auth.decorator';
import { FastifyFilesInterceptor } from 'common/interceptors/fastify-files.interceptor';

@Controller(ROUTER_MESSENGERS)
export class MessengersController {
    constructor(private readonly messengersService: MessengersService) {}

    @Post()
    create(@IdFromToken() idFromToken: string, @Body() createMessengerReq: CreateMessengerReq) {
        return this.messengersService.create(createMessengerReq, idFromToken);
    }

    @Get(':chatRoomId')
    get(@IdFromToken() idFromToken: string, @Param('chatRoomId') chatRoomId: string) {
        return this.messengersService.get(chatRoomId, idFromToken);
    }

    @Post('files')
    @UseInterceptors(FastifyFilesInterceptor('files', 10))
    createByFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createMessengerByFilesReq: CreateMessengerByFilesReq,
        @IdFromToken() idFromToken: string,
    ) {
        return this.messengersService.createByFiles(createMessengerByFilesReq, files, idFromToken);
    }
}
