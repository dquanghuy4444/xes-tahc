import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ENUM_ENVIRONMENT_VARIABLE, getEnv } from 'configs/env';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {

    async uploadFile(file: Express.Multer.File, rootFolder: string = "xes-tahc") {
        const s3 = new S3();

        const result = await s3.upload({
            ACL: "public-read",
            ContentType: file.mimetype,
            Bucket: getEnv(ENUM_ENVIRONMENT_VARIABLE.AWS_PUBLIC_BUCKET_NAME),
            Body: file.buffer,
            Key: `${rootFolder}/${uuid()}.${file.originalname.split(".")[file.originalname.split(".").length - 1]}`,
            ContentDisposition: "inline",
        })
            .promise();

        return result.Location
    }
}
