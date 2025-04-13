const express = require('express');
const config = require('./config/config');
const whatsappRoutes = require('./routes/whatsapp');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/whatsapp', whatsappRoutes);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});