const express = require('express');
const laundryService = require('../services/laundryService');

const router = express.Router();

router.post('/webhook', async (req, res) => {
  const { From, Body } = req.body;
  await laundryService.handleCommand(From, Body);
  res.sendStatus(200);
});

module.exports = router;