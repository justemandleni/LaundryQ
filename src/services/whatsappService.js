const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

class WhatsAppService {
  async sendMessage(to, body) {
    try {
      await client.messages.create({
        from: config.TWILIO_PHONE_NUMBER,
        to,
        body,
      });
      console.log(`Message sent to ${to}: ${body}`);
    } catch (error) {
      console.error(`Failed to send message to ${to}:`, error);
    }
  }
}

module.exports = new WhatsAppService();