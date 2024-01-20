import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { ValidationPipe } from '@nestjs/common'
import { getSSLOptions } from './config/ssl/ssl.config'
import { setupSwagger } from './config/swagger/swagger.config'
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  if (process.env.NODE_ENV === 'dev') {
    console.log('🛠️ Iniciando Modo desarrollo')
  } else {
    console.log('🚗 Iniciando Modo producción')
  }

  const httpsOptions = getSSLOptions()

  const app = await NestFactory.create(AppModule, { httpsOptions })
  app.setGlobalPrefix('api')
  if (process.env.NODE_ENV === 'dev') {
    setupSwagger(app)
  }
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.API_PORT || 3000)
}

bootstrap().then(() =>
  console.log(
    `🟢 Servidor escuchando en puerto: ${
      process.env.API_PORT || 3000
    } y perfil: ${process.env.NODE_ENV} 🚀`,
  ),
)
