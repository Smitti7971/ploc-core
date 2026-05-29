import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando migração de Vícios e Tarefas (Legado) para TrackerItem...');

  // 1. Migração de Vícios
  const vices = await prisma.vice.findMany({ include: { logs: true } });
  console.log(`Encontrados ${vices.length} Vícios legados.`);

  for (const vice of vices) {
    // Verifica se já existe um TrackerItem equivalente para evitar duplicação
    const existing = await prisma.trackerItem.findFirst({
      where: { userId: vice.userId, type: 'vice', name: vice.viceId }
    });

    let trackerItemId = existing?.id;

    if (!existing) {
      const config = {
        mode: vice.mode,
        expectedFrequency: vice.expectedFrequency,
        timerLimitSeconds: vice.timerLimitSeconds,
        reductionTarget: vice.reductionTarget,
        costPerUse: vice.costPerUse
      };

      const newItem = await prisma.trackerItem.create({
        data: {
          type: 'vice',
          name: vice.customName || vice.viceId,
          userId: vice.userId,
          status: 'ACTIVE',
          config,
          isConsuming: vice.isConsuming,
          consumptionStart: vice.consumptionStartTime,
          defaultTimer: vice.defaultConsumptionSeconds,
          createdAt: vice.createdAt,
          updatedAt: vice.updatedAt
        }
      });
      trackerItemId = newItem.id;
    }

    // Migrar os Logs do vício
    const logs = await prisma.viceLog.findMany({ where: { viceId: vice.id } });
    let logsMigrados = 0;
    for (const log of logs) {
      // Evitar log duplicado verificando timestamp e tipo exato
      const existingLog = await prisma.trackerLog.findFirst({
        where: { trackerItemId, timestamp: log.timestamp, type: log.type }
      });

      if (!existingLog) {
        await prisma.trackerLog.create({
          data: {
            trackerItemId: trackerItemId as string,
            userId: log.userId,
            type: log.type,
            timestamp: log.timestamp,
            durationSeconds: log.durationSeconds,
            value: log.cost,
            info: log.motivator,
            createdAt: log.createdAt
          }
        });
        logsMigrados++;
      }
    }
    console.log(`- Vício '${vice.viceId}' migrado com ${logsMigrados} logs novos.`);
  }

  // 2. Migração de Tarefas (Tasks)
  const tasks = await prisma.task.findMany();
  console.log(`\nEncontradas ${tasks.length} Tarefas (Tasks) legadas.`);

  for (const task of tasks) {
    const existing = await prisma.trackerItem.findFirst({
      where: { userId: task.userId, type: 'task', name: task.name, createdAt: task.createdAt }
    });

    if (!existing) {
      const config = {
        priority: task.priority,
        category: task.category,
        tags: task.tags,
        color: task.color,
        isDraggable: task.isDraggable,
        scheduledDate: task.scheduledDate,
        scheduledTime: task.scheduledTime
      };

      const newItem = await prisma.trackerItem.create({
        data: {
          type: 'task',
          name: task.name,
          description: task.description,
          userId: task.userId,
          status: task.completed ? 'COMPLETED' : (task.status === 'CANCELADO' ? 'PAUSED' : 'ACTIVE'),
          config,
          createdAt: task.createdAt,
          updatedAt: task.completedAt || task.createdAt
        }
      });

      // Se foi completada, criar um log de conclusão
      if (task.completed && task.completedAt) {
        await prisma.trackerLog.create({
          data: {
            trackerItemId: newItem.id,
            userId: task.userId,
            type: 'milestone',
            timestamp: BigInt(task.completedAt.getTime()),
            info: 'Tarefa concluída (Migração)',
            createdAt: task.completedAt
          }
        });
      }
    }
  }

  console.log('\n✅ Migração concluída com sucesso!');
  console.log('AVISO: Verifique se os dados estão corretos no App antes de apagar as tabelas legadas do schema.prisma.');
}

main()
  .catch((e) => {
    console.error('Erro durante a migração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
