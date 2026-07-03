// backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const taskTypes = [
    'Work',
    'Personal',
    'Family',
    'Friends',
    'College',
    'Health',
    'Other',
  ]

  for (const name of taskTypes) {
    await prisma.taskType.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  console.log('Task types seeded')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())