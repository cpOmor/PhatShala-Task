/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
  statusCounts?: any;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  exportData?: any;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
    exportData: data.exportData,
  });
};

export default sendResponse;
