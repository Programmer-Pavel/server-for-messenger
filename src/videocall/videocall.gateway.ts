import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VideoCallService } from './videocall.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VideoCallGateway {
  constructor(private readonly videoCallService: VideoCallService) {}

  @WebSocketServer()
  server!: Server;

  // Присоединение к комнате с ID пользователя
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    // Сохраняем ID пользователя в данных сокета для дальнейшего использования
    client.data.userId = data.userId;

    // Присоединяем клиента к комнате с его ID
    client.join(data.userId);

    console.log(`Пользователь ${data.userId} присоединился к своей комнате`);
  }

  // Инициация звонка
  @SubscribeMessage('call-user')
  async handleCallUser(
    @MessageBody() data: { offer: RTCSessionDescriptionInit; to: string; from: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.videoCallService.getUserById(data.from);
    const callerName = user?.name || 'Неизвестный пользователь';

    console.log(`Звонок от ${data.from} к ${data.to}`);

    this.server.to(data.to).emit('incoming-call', {
      offer: data.offer,
      from: data.from,
      fromName: callerName,
    });
  }

  // Принятие звонка
  @SubscribeMessage('call-accept')
  handleCallAccepted(
    @MessageBody() data: { answer: RTCSessionDescriptionInit; to: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Звонок принят, отправка ответа к ${data.to}`);

    this.server.to(data.to).emit('call-accepted', {
      answer: data.answer,
    });
  }

  // Передача ICE кандидатов
  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() data: { candidate: RTCIceCandidateInit; to: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`ICE кандидат для ${data.to}`);

    this.server.to(data.to).emit('ice-candidate', {
      candidate: data.candidate,
    });
  }

  // Завершение звонка
  @SubscribeMessage('end-call')
  handleEndCall(@MessageBody() data: { to: string }, @ConnectedSocket() client: Socket) {
    console.log(`Завершение звонка для ${data.to}`);

    this.server.to(data.to).emit('call-ended');
  }

  // Отклонение звонка
  @SubscribeMessage('decline-call')
  handleDeclineCall(@MessageBody() data: { to: string }, @ConnectedSocket() client: Socket) {
    console.log(`Отклонение звонка для ${data.to}`);

    this.server.to(data.to).emit('call-declined');
  }
}
