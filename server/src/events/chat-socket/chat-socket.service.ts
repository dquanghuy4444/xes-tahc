import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatSocketService {
    received(receivedMess: any) {
        console.log(receivedMess);
        return 'This action adds a new chatSocket';
    }

    send() {
        return `This action returns all chatSocket`;
    }
}
