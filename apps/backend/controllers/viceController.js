const prisma = require('../config/database');

exports.getVices = async (req, res) => {
  try {
    const vices = await prisma.vice.findMany({
      where: { userId: req.user.id },
      include: {
        logs: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    // Converter BigInt para Number antes de enviar como JSON
    const serializedVices = JSON.parse(JSON.stringify(vices, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    res.json(serializedVices);
  } catch (error) {
    console.error('[GET /vices]', error);
    res.status(500).json({ error: 'Erro ao buscar vícios.' });
  }
};

exports.syncVice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      viceId, customName, mode, startTime, expectedFrequency, 
      timerLimitSeconds, reductionTarget, isConsuming, 
      consumptionStartTime, defaultConsumptionSeconds, costPerUse, currentMotivator 
    } = req.body;

    if (!viceId || !mode) {
      return res.status(400).json({ error: 'Campos obrigatórios: viceId e mode' });
    }

    const vice = await prisma.vice.upsert({
      where: { 
        userId_viceId: { userId, viceId }
      },
      update: {
        customName,
        mode,
        startTime: startTime ? BigInt(startTime) : undefined,
        expectedFrequency,
        timerLimitSeconds,
        reductionTarget,
        isConsuming: isConsuming ?? false,
        consumptionStartTime: consumptionStartTime ? BigInt(consumptionStartTime) : null,
        defaultConsumptionSeconds: defaultConsumptionSeconds ?? 300,
        costPerUse,
        currentMotivator
      },
      create: {
        userId,
        viceId,
        customName,
        mode,
        startTime: startTime ? BigInt(startTime) : BigInt(Date.now()),
        expectedFrequency,
        timerLimitSeconds,
        reductionTarget,
        isConsuming: isConsuming ?? false,
        consumptionStartTime: consumptionStartTime ? BigInt(consumptionStartTime) : null,
        defaultConsumptionSeconds: defaultConsumptionSeconds ?? 300,
        costPerUse,
        currentMotivator
      }
    });

    res.json(JSON.parse(JSON.stringify(vice, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )));
  } catch (error) {
    console.error('[POST /vices]', error);
    res.status(500).json({ error: 'Erro ao sincronizar vício.' });
  }
};

exports.syncViceLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, viceId, type, timestamp, durationSeconds, fastingSeconds, cost, motivator } = req.body;

    if (!viceId || !type || !timestamp) {
      return res.status(400).json({ error: 'Campos obrigatórios: viceId, type, timestamp' });
    }

    // Primeiro encontra o vício principal (para relacionar o log)
    const vice = await prisma.vice.findUnique({
      where: { userId_viceId: { userId, viceId } }
    });

    if (!vice) {
      return res.status(404).json({ error: 'Vício não encontrado.' });
    }

    const log = await prisma.viceLog.upsert({
      where: { id: id || 'new-log-uuid' },
      update: {
        type,
        timestamp: BigInt(timestamp),
        durationSeconds,
        fastingSeconds,
        cost,
        motivator
      },
      create: {
        id: id || undefined,
        viceId: vice.id,
        userId,
        type,
        timestamp: BigInt(timestamp),
        durationSeconds,
        fastingSeconds,
        cost,
        motivator
      }
    });

    res.json(JSON.parse(JSON.stringify(log, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )));
  } catch (error) {
    console.error('[POST /vices/log]', error);
    res.status(500).json({ error: 'Erro ao sincronizar log de vício.' });
  }
};

exports.deleteVice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { viceId } = req.params;

    await prisma.vice.delete({
      where: { userId_viceId: { userId, viceId } }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[DELETE /vices]', error);
    res.status(500).json({ error: 'Erro ao deletar vício.' });
  }
};
