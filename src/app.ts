import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AppError } from './utils/appError';
import userRouter from './modules/auth/controller';
import { globalErrorHandler } from './middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import { options } from './constant/swaggerOptions';
import { customRedisRateLimiter } from './middleware/ratelimiter';
dotenv.config();

// Start express app
const app = express();
const specs = swaggerJsdoc(options);
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.enable('trust proxy');

// Implement CORS
app.use(cors());
// Set security HTTP headers

// Implemened 10 requests in 24 hrs limit!
app.use(customRedisRateLimiter);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

// 3) ROUTES
app.use('/api/v1/auth', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
