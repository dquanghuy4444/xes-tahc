import { Controller, Post, Body, Get, Param, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ROUTER_FILES } from 'configs/routers';
import { IdFromToken } from 'common/decorators/auth.decorator';
import { FilesService } from './files.service';
import { FastifyFilesInterceptor } from 'common/interceptors/fastify-files.interceptor';

@Controller(ROUTER_FILES)
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post()
    @UseInterceptors(FastifyFilesInterceptor('file', 1))
    create(@UploadedFiles() files: Express.Multer.File[]) {
        return this.filesService.uploadFile(files[0]);
    }
}
