const queue = require('../models/queue');
const whatsappService = require('./whatsappService');
const config = require('../config/config');

class LaundryService {
  async handleCommand(from, body) {
    const command = body.toLowerCase().trim();
    const phone = from;

    if (command === 'join washer queue') {
      queue.addToQueue('washer', phone);
      const { queue: wQueue } = queue.getQueueStatus('washer');
      const position = wQueue.findIndex((entry) => entry.phone === phone) + 1;
      const waitTime = queue.activeWasher
        ? config.WASHER_CYCLE_TIME - (Date.now() - queue.activeWasher.startedAt) + (position - 1) * config.WASHER_CYCLE_TIME
        : 0;
      await whatsappService.sendMessage(phone, `You're #${position} in the washer queue. Estimated wait: ${Math.round(waitTime / 60000)} min.`);
    } else if (command === 'join dryer queue') {
      queue.addToQueue('dryer', phone);
      const { queue: dQueue } = queue.getQueueStatus('dryer');
      const position = dQueue.findIndex((entry) => entry.phone === phone) + 1;
      const waitTime = queue.activeDryer
        ? config.DRYER_CYCLE_TIME - (Date.now() - queue.activeDryer.startedAt) + (position - 1) * config.DRYER_CYCLE_TIME
        : 0;
      await whatsappService.sendMessage(phone, `You're #${position} in the dryer queue. Estimated wait: ${Math.round(waitTime / 60000)} min.`);
    } else if (command === 'start washer' && queue.getNext('washer')?.phone === phone) {
      queue.startCycle('washer', phone);
      await whatsappService.sendMessage(phone, 'Washer cycle started.');
      await this.notifyGuard('washer', phone);
      setTimeout(() => this.endCycle('washer'), config.WASHER_CYCLE_TIME);
    } else if (command === 'start dryer' && queue.getNext('dryer')?.phone === phone) {
      queue.startCycle('dryer', phone);
      await whatsappService.sendMessage(phone, 'Dryer cycle started.');
      await this.notifyGuard('dryer', phone);
      setTimeout(() => this.endCycle('dryer'), config.DRYER_CYCLE_TIME);
    } else if (command.startsWith('/admin confirm')) {
      if (phone === config.GUARD_PHONE_NUMBER) {
        const type = command.includes('washer') ? 'washer' : 'dryer';
        await whatsappService.sendMessage(phone, `${type} cycle confirmed.`);
      }
    } else {
      await whatsappService.sendMessage(phone, 'Invalid command. Use: "join washer queue", "join dryer queue", "start washer", "start dryer".');
    }
  }

  async endCycle(type) {
    const nextUser = queue.getNext(type);
    queue.endCycle(type);
    if (nextUser) {
      await whatsappService.sendMessage(nextUser.phone, `${type} is free—your turn! Reply "start ${type}" within 10 min.`);
      setTimeout(() => this.checkResponse(type, nextUser.phone), config.RESPONSE_TIMEOUT);
    }
  }

  async checkResponse(type, phone) {
    if ((type === 'washer' && queue.activeWasher?.phone !== phone) || (type === 'dryer' && queue.activeDryer?.phone !== phone)) {
      queue.removeFromQueue(type, phone);
      await whatsappService.sendMessage(phone, `You missed your ${type} turn—rejoin the queue if needed.`);
      const nextUser = queue.getNext(type);
      if (nextUser) await whatsappService.sendMessage(nextUser.phone, `${type} is free—your turn!`);
    }
  }

  async notifyGuard(type, phone) {
    await whatsappService.sendMessage(config.GUARD_PHONE_NUMBER, `${phone} started ${type} cycle. Check in ${type === 'washer' ? 40 : 60} min.`);
  }
}

module.exports = new LaundryService();