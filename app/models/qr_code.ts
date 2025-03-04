import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class QrCode extends BaseModel {
  public static table = 'qrdata'

  @column({ isPrimary: true })
  declare qrCodeSerial: string

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column()
  declare bon: string

  @column()
  declare carriere: string

  @column()
  declare ministre: string

  @column()
  declare qrCodeData: string

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
