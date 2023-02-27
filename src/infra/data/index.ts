import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
  log: ['info', 'warn', 'error']
})

export default db
