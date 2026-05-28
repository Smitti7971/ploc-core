const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/trackerController');

router.get('/items', trackerController.getTrackerItems);
router.post('/items', trackerController.createTrackerItem);
router.post('/logs', trackerController.createTrackerLog);
router.delete('/logs/:id', trackerController.deleteTrackerLog);
router.delete('/items/:id', trackerController.deleteTrackerItem);

module.exports = router;
