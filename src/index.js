require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const db = require('./models');
const initSocket = require('./socket');

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api', routes);

initSocket(server);

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to MySQL via Sequelize');

    await db.sequelize.sync();
    console.log('Sequelize models synchronized');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with Socket.IO enabled`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

startServer();
