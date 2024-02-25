import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { ResponseFunkoDto } from '../funkos/dto/response-funko.dto'
import { CategoryResponseDto } from '../category/dto/category-response.dto'

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  private server: Server

  private readonly logger = new Logger(NotificationGateway.name)

  constructor() {
    this.logger.log(`NotificationGateway created`)
  }

  sendMessage(
    tipo: string,
    notification: ResponseFunkoDto | CategoryResponseDto,
  ) {
    if (this.isFunko(notification)) {
      this.logger.log(`Sending message: ${JSON.stringify(notification)}`)
      this.server.emit(`FUNKO_${tipo}`, notification)
    } else {
      this.logger.log(`Sending message: ${JSON.stringify(notification)}`)
      this.server.emit(`CATEGORY_${tipo}`, notification)
    }
  }

  private isFunko(
    notification: ResponseFunkoDto | CategoryResponseDto,
  ): notification is ResponseFunkoDto {
    return (notification as ResponseFunkoDto).image !== undefined
  }

  private handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
    this.server.emit('connection', 'Connected to NotificationGateway')
  }

  private handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id)
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
