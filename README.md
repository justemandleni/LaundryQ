# LaundryQ

Simple text-based, WhatsApp-integrated laundry queuing system with central command confirmation.

## Setup
1. Install dependencies: `npm install`
2. Configure `.env` with Twilio credentials and phone numbers.
3. Start the server: `npm start`
4. Set up Twilio webhook to point to `http://your-server/whatsapp/webhook`.

## Commands
- `join washer queue` - Join washer queue
- `join dryer queue` - Join dryer queue
- `start washer` - Start washer cycle (when your turn)
- `start dryer` - Start dryer cycle (when your turn)
- `/admin confirm washer` - Guard confirms washer cycle
- `/admin confirm dryer` - Guard confirms dryer cycle