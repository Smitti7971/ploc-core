const express = require('express');
const router = express.Router();
const viceController = require('../controllers/viceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', viceController.getVices);
router.post('/', viceController.syncVice);
router.post('/log', viceController.syncViceLog);
router.delete('/:viceId', viceController.deleteVice);

module.exports = router;
