import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatSocketService } from './chat-socket.service';

@WebSocketGateway(8080)
export class ChatSocketGateway {
    constructor(private readonly chatSocketService: ChatSocketService) {}

    @SubscribeMessage('received-mess')
    received(@MessageBody() receivedMess: any) {
        return this.chatSocketService.received(receivedMess);
    }

    @SubscribeMessage('send-mess')
    send() {
        return this.chatSocketService.send();
    }
}
