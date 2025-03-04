import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'qrdata'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('qr_code_serial').primary().unique().notNullable()

      table.string('nom').notNullable()
      table.string('prenom').notNullable()
      table.string('bon').notNullable()
      table.string('carriere').notNullable()
      table.string('ministre').notNullable()
      table.text('qr_code_data').notNullable()
      table.string('status').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}