const prisma = require('../config/database');

exports.createTrackerItem = async (req, res) => {
  try {
    const userId = req.user?.id || 'c3dd1b0e-7465-4739-86de-db474c853d8e'; // fallback to hardcoded if no auth
    const { id, type, name, description, status,
      coverPhoto,
      config,
      correlations,
      defaultTimer,
      isConsuming,
      startDate,
      endDate
    } = req.body;

    const parsedStartDate = startDate ? new Date(startDate) : new Date();
    const parsedEndDate = endDate ? new Date(endDate) : null;

    let trackerItem;
    const createData = {
      userId,
      type,
      name,
      description,
      status,
      config: config || {},
      correlations: correlations || {},
      coverPhoto,
      defaultTimer,
      isConsuming: isConsuming || false,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    };
    
    const updateData = {
      type,
      name,
      description,
      status,
      config: config || {},
      correlations: correlations || {},
      coverPhoto,
      defaultTimer,
      isConsuming: isConsuming || false,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    };

    if (id) {
      trackerItem = await prisma.trackerItem.upsert({
        where: { id },
        create: { id, ...createData },
        update: updateData
      });
    } else {
      // Try to find by user, type, and name
      const existing = await prisma.trackerItem.findFirst({
        where: { userId, type, name }
      });
      if (existing) {
        trackerItem = await prisma.trackerItem.update({
          where: { id: existing.id },
          data: updateData
        });
      } else {
        trackerItem = await prisma.trackerItem.create({
          data: createData
        });
      }
    }

    res.status(201).json(trackerItem);
  } catch (error) {
    console.error("Error syncing TrackerItem:", error);
    res.status(500).json({ error: "Failed to sync TrackerItem." });
  }
};

exports.getTrackerItems = async (req, res) => {
  try {
    const userId = req.user?.id || 'c3dd1b0e-7465-4739-86de-db474c853d8e';
    const items = await prisma.trackerItem.findMany({
      where: { userId }
    });
    
    // Serialize BigInts before sending response
    const serializedItems = items.map(item => ({
      ...item,
      consumptionStart: item.consumptionStart ? item.consumptionStart.toString() : null
    }));
    
    res.status(200).json(serializedItems);
  } catch (error) {
    console.error("Error fetching TrackerItems:", error);
    res.status(500).json({ error: "Failed to fetch TrackerItems." });
  }
};

exports.getTrackerLogs = async (req, res) => {
  try {
    const userId = req.user?.id || 'c3dd1b0e-7465-4739-86de-db474c853d8e';
    const logs = await prisma.trackerLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });
    
    const serializedLogs = logs.map(log => ({
      ...log,
      timestamp: log.timestamp.toString()
    }));
    
    res.status(200).json(serializedLogs);
  } catch (error) {
    console.error("Error fetching TrackerLogs:", error);
    res.status(500).json({ error: "Failed to fetch TrackerLogs." });
  }
};

exports.deleteTrackerItem = async (req, res) => {
  try {
    const userId = req.user?.id || 'c3dd1b0e-7465-4739-86de-db474c853d8e';
    const { id } = req.params;
    const { byName } = req.query;

    let existing;
    if (byName === 'true') {
      existing = await prisma.trackerItem.findFirst({
        where: { userId, name: id } // in this case id is actually the name
      });
    } else {
      existing = await prisma.trackerItem.findUnique({
        where: { id }
      });
    }

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "TrackerItem not found or unauthorized" });
    }

    await prisma.trackerItem.delete({
      where: { id: existing.id }
    });

    res.status(200).json({ message: "TrackerItem deleted successfully" });
  } catch (error) {
    console.error("Error deleting TrackerItem:", error);
    res.status(500).json({ error: "Failed to delete TrackerItem." });
  }
};

exports.createTrackerLog = async (req, res) => {
  try {
    const userId = req.user?.id || 'c3dd1b0e-7465-4739-86de-db474c853d8e';
    const { id, trackerItemId, type, timestamp, photoUrl, info, durationSeconds, value, metadata } = req.body;

    let finalTrackerItemId = trackerItemId;
    
    // If trackerItemId is missing or not a UUID, it might be a 'name' passed from frontend. Try to look it up.
    if (!finalTrackerItemId || finalTrackerItemId.length < 10) {
      const { trackerItemName } = req.body;
      const lookupName = trackerItemName || trackerItemId; // fallback to trackerItemId if it was actually the name
      if (lookupName) {
         const item = await prisma.trackerItem.findFirst({
            where: { userId, name: lookupName }
         });
         if (item) {
            finalTrackerItemId = item.id;
         } else {
            return res.status(404).json({ error: "Linked TrackerItem not found by name" });
         }
      } else {
         return res.status(400).json({ error: "TrackerItemId is required" });
      }
    }

    let log;
    if (id && id.length > 10) {
      try {
        const existingLog = await prisma.trackerLog.findUnique({ where: { id } });
        if (existingLog) {
          log = await prisma.trackerLog.update({
            where: { id },
            data: {
              type,
              timestamp: BigInt(timestamp),
              photoUrl,
              info,
              durationSeconds,
              value,
              metadata: metadata || {}
            }
          });
        }
      } catch (e) {
        console.warn("Error updating tracker log, will create instead", e.message);
      }
    }
    
    if (!log) {
      log = await prisma.trackerLog.create({
        data: {
          id: id && id.length > 10 ? id : undefined,
          trackerItemId: finalTrackerItemId,
          userId,
          type,
          timestamp: BigInt(timestamp),
          photoUrl,
          info,
          durationSeconds,
          value,
          metadata: metadata || {}
        }
      });
    }

    // UPDATE START DATE ATOMICALLY FOR VICES
    if (type === 'consumption') {
      const item = await prisma.trackerItem.findUnique({ where: { id: finalTrackerItemId } });
      if (item && item.type === 'vice' && item.config) {
        // Prisma JSONB returns as object
        const config = typeof item.config === 'string' ? JSON.parse(item.config) : item.config;
        if (config.mode === 'diminua') {
          // Update the startDate to the log's timestamp and remove regretStart
          delete config.regretStart;
          await prisma.trackerItem.update({
            where: { id: finalTrackerItemId },
            data: {
              startDate: new Date(Number(timestamp)),
              config: config
            }
          });
        }
      }
    }

    // BigInt cant be directly JSON stringified
    const logObj = { ...log, timestamp: log.timestamp.toString() };

    res.status(201).json(logObj);
  } catch (error) {
    console.error("Error syncing TrackerLog:", error);
    res.status(500).json({ error: "Failed to sync TrackerLog." });
  }
};

exports.deleteTrackerLog = async (req, res) => {
  try {
    const userId = req.user?.id || 'c3dd1b0e-7465-4739-86de-db474c853d8e';
    const { id } = req.params;

    const existing = await prisma.trackerLog.findUnique({
      where: { id }
    });

    if (!existing) {
      console.warn(`TrackerLog with id ${id} not found in DB, assuming already deleted`);
      return res.status(200).json({ message: "TrackerLog deleted or not found" });
    }
    if (existing.userId !== userId) {
      console.error(`Unauthorized deletion. DB user: ${existing.userId}, Request user: ${userId}`);
      return res.status(403).json({ error: "TrackerLog unauthorized" });
    }

    await prisma.trackerLog.delete({
      where: { id }
    });

    res.status(200).json({ message: "TrackerLog deleted successfully" });
  } catch (error) {
    console.error("Error deleting TrackerLog:", error);
    res.status(500).json({ error: "Failed to delete TrackerLog." });
  }
};
