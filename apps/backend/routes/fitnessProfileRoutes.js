const express = require('express');
const router = express.Router();
const fitnessProfileController = require('../controllers/fitnessProfileController');

router.get('/', fitnessProfileController.getProfile);
router.put('/', fitnessProfileController.updateProfile);

module.exports = router;
