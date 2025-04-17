import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server!: Server;

  // @SubscribeMessage('joinRoom')
  // async handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
  //   console.log('roomId:', roomId);
  //   client.join(roomId);
  //   // Получаем историю сообщений при входе в комнату
  //   const messages = await this.chatService.getRoomMessages(roomId);

  //   // console.log('Messages:', messages);
  //   return { event: 'joinRoom', data: { roomId, messages } };
  // }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.leave(roomId);
    return { event: 'leaveRoom', data: `Left room ${roomId}` };
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(
    @MessageBody() data: { roomId: string; message: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messageData = {
      content: data.message,
      userId: parseInt(data.userId),
      roomId: data.roomId,
    };

    // Сохраняем сообщение через сервис
    const savedMessage = await this.chatService.sendMessage(data.roomId, messageData);

    // Отправляем сообщение всем в комнате
    this.server.to(data.roomId).emit('onMessage', savedMessage);

    return { event: 'newMessage', data: savedMessage };
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Если у клиента был сохранен userId, выполняем дополнительные действия
    if (client.data && client.data.userId) {
      console.log(`Пользователь ${client.data.userId} вышел из сети`);
    }
  }

  @SubscribeMessage('userOnline')
  handleUserOnline(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    // Присоединяем пользователя к его персональной комнате
    client.join(`user_${userId}`);

    // Сохраняем ID пользователя в данных сокета
    client.data.userId = userId;

    console.log(`Пользователь ${userId} онлайн`);
    return { event: 'userOnline', data: { success: true } };
  }

  // PRIVATE CHAT

  @SubscribeMessage('startPrivateChat')
  async handleStartPrivateChat(
    @MessageBody() data: { fromUserId: string; toUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = await this.chatService.getOrCreatePrivateRoom(data.fromUserId, data.toUserId);
    client.join(roomId);

    const messages = await this.chatService.getRoomMessages(roomId);
    return { event: 'privateChat', data: { roomId, messages } };
  }

  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    @MessageBody() data: { fromUserId: string; toUserId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = await this.chatService.getOrCreatePrivateRoom(data.fromUserId, data.toUserId);

    const messageData = {
      content: data.message,
      userId: parseInt(data.fromUserId),
      roomId: roomId,
    };

    const savedMessage = await this.chatService.sendMessage(roomId, messageData);

    // Отправляем сообщение участникам приватного чата
    this.server.to(roomId).emit('onPrivateMessage', { message: savedMessage, fromUserId: data.fromUserId });

    // Отправляем уведомление получателю в его персональную комнату
    this.server.to(`user_${data.toUserId}`).emit('newMessageNotification', {
      fromUserId: data.fromUserId,
      messagePreview: data.message.substring(0, 30) + (data.message.length > 30 ? '...' : ''),
      roomId: roomId,
      timestamp: new Date(),
    });

    return { event: 'privateMessage', data: savedMessage };
  }
}
