import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { AppError } from '../utils/appError';
import redisService from '../utils/redis';

const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 20;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

export const customRedisRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!redisService) {
      throw new AppError('Redis client does not exist!', 500);
    }
    console.log({ IPAddress: req.ip });
    const record = await redisService.get(req.ip);
    const currentRequestTime = moment();

    if (!record) {
      const newRecord = [{ requestTimeStamp: currentRequestTime.unix(), requestCount: 1 }];
      await redisService.set({ key: req.ip, value: JSON.stringify(newRecord) });
      return next();
    }

    const data = JSON.parse(record);
    const windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_HOURS, 'hours').unix();
    const requestsWithinWindow = data.filter(
      (entry: { requestTimeStamp: number }) => entry.requestTimeStamp > windowStartTimestamp,
    );
    const totalWindowRequestsCount = requestsWithinWindow.reduce(
      (accumulator: any, entry: { requestCount: any }) => accumulator + entry.requestCount,
      0,
    );

    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      return res.status(429).send({
        message: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`,
      });
    }

    const lastRequestLog = data[data.length - 1];
    const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
      .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours')
      .unix();

    if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
      lastRequestLog.requestCount++;
      data[data.length - 1] = lastRequestLog;
    } else {
      data.push({ requestTimeStamp: currentRequestTime.unix(), requestCount: 1 });
    }

    await redisService.set({ key: req.ip, value: JSON.stringify(data) });
    next();
  } catch (error) {
    next(error);
  }
};
