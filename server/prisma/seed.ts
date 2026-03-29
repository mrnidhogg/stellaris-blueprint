import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 清空现有建筑数据
  await prisma.building.deleteMany()

  // 添加默认建筑
  const buildings = [
    {
      name: '冶炼厂',
      icon: '🏭',
      width: 3,
      height: 4,
      canRotate: true,
      description: '冶炼厂 - 大小3*4，可旋转，入口/出口为短边中点',
      entryPoints: [{ x: 1, y: 0, edge: 'bottom' }],
      exitPoints: [{ x: 1, y: 3, edge: 'top' }],
    },
    {
      name: '制造厂',
      icon: '⚙️',
      width: 3,
      height: 3,
      canRotate: true,
      description: '制造厂 - 大小3*3，可旋转，入口/出口为对边中点',
      entryPoints: [{ x: 1, y: 0, edge: 'bottom' }],
      exitPoints: [{ x: 1, y: 2, edge: 'top' }],
    },
    {
      name: '熔炉',
      icon: '🔥',
      width: 3,
      height: 4,
      canRotate: true,
      description: '熔炉 - 大小3*4，可旋转，入口/出口为短边中点',
      entryPoints: [{ x: 1, y: 0, edge: 'bottom' }],
      exitPoints: [{ x: 1, y: 3, edge: 'top' }],
    },
  ]

  for (const b of buildings) {
    await prisma.building.create({
      data: {
        name: b.name,
        icon: b.icon,
        width: b.width,
        height: b.height,
        canRotate: b.canRotate,
        description: b.description,
        entryPoints: b.entryPoints,
        exitPoints: b.exitPoints,
      },
    })
  }

  console.log('默认建筑已创建！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
