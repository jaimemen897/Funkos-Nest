import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'
import { join } from 'path'

@Injectable()
export class StorageService {
  private readonly uploadsFolder = process.env.UPLOADS_FOLDER || './storage-dir'
  private readonly isDev = process.env.NODE_ENV === 'dev'
  private readonly logger = new Logger(StorageService.name)

  async onModuleInit() {
    if (this.isDev) {
      if (fs.existsSync(this.uploadsFolder)) {
        this.logger.log(`Eliminando ficheros de ${this.uploadsFolder}`)
        fs.readdirSync(this.uploadsFolder).forEach((file) => {
          fs.unlinkSync(path.join(this.uploadsFolder, file))
        })
      } else {
        this.logger.log(
          `Creando directorio de subida de archivos en ${this.uploadsFolder}`,
        )
        fs.mkdirSync(this.uploadsFolder)
      }
    }
  }

  findFile(filename: string) {
    this.logger.log(`Buscando fichero ${filename}`)
    const file = join(
      process.cwd(),
      process.env.UPLOADS_FOLDER || './storage-dir',
      filename,
    )
    if (fs.existsSync(file)) {
      this.logger.log(`Fichero encontrado ${file}`)
      return file
    } else {
      throw new NotFoundException(`El fichero ${filename} no existe.`)
    }
  }

  getFileNameWithoutUrl(fileUrl: string): string {
    try {
      const url = new URL(fileUrl)
      const pathname = url.pathname
      const segments = pathname.split('/')
      return segments[segments.length - 1]
    } catch (error) {
      this.logger.error(error)
      return fileUrl
    }
  }

  removeFile(filename: string): void {
    this.logger.log(`Eliminando fichero ${filename}`)
    const file = join(
      process.cwd(),
      process.env.UPLOADS_FOLDER || './storage-dir',
      filename,
    )
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    } else {
      throw new NotFoundException(`El fichero ${filename} no existe.`)
    }
  }
}
