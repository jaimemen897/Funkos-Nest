import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { ResponseFunkoDto } from '../funkos/dto/response-funko.dto'

const ENDPOINT: string = `/ws/api/funkos`

@WebSocketGateway({ namespace: ENDPOINT })
export class FunkoNotificationGateway {
  @WebSocketServer()
  private server: Server

  private readonly logger = new Logger(FunkoNotificationGateway.name)

  constructor() {
    this.logger.log(`WebSocketGateway created on ${ENDPOINT}`)
  }

  sendMessage(tipo: string, notification: ResponseFunkoDto) {
    this.server.emit(tipo, notification)
  }

  private handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
    this.server.emit('connection', 'Connected to FunkoNotificationGateway')
  }

  private handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id)
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
