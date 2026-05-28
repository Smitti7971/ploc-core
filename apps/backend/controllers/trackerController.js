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

    const trackerItem = await prisma.trackerItem.upsert({
      where: { id: id || '' }, // if not found, create
      create: {
        id,
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
      },
      update: {
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
      }
    });

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

exports.deleteTrackerItem = async (req, res) => {
  try {
    const userId = req.user?.id || 'c3dd1b0e-7465-4739-86de-db474c853d8e';
    const { id } = req.params;

    // Verify it belongs to the user
    const existing = await prisma.trackerItem.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "TrackerItem not found or unauthorized" });
    }

    await prisma.trackerItem.delete({
      where: { id }
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

    const log = await prisma.trackerLog.upsert({
      where: { id: id || '' },
      create: {
        id,
        trackerItemId,
        userId,
        type,
        timestamp: BigInt(timestamp),
        photoUrl,
        info,
        durationSeconds,
        value,
        metadata: metadata || {}
      },
      update: {
        type,
        timestamp: BigInt(timestamp),
        photoUrl,
        info,
        durationSeconds,
        value,
        metadata: metadata || {}
      }
    });

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
