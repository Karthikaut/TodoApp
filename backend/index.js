const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const todoRoutes = require('./src/route/todoRoute');
const winston = require('winston');
const cookieParser = require('cookie-parser');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
    new winston.transports.File({filename: 'logs/combined.log'}),
  ],
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});


const app = express();

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});


app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(cookieParser());

app.use('/', todoRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
});
