import httpStatus from 'http-status';
import AppError from '../errors/AppError';

const unauthorized = (message: string) => {
  return new AppError(401, message, [{ path: 'unauthorize', message }]);
};
const notFound = (message: string) => {
  return new AppError(404, message, [{ path: 'not_found', message }]);
};
const conflict = (message: string) => {
  return new AppError(409, message, [{ path: 'conflict', message }]);
};
const serverError  = (message: string) => {
  return new AppError(httpStatus.INTERNAL_SERVER_ERROR, message, [{ path: 'server_error', message }]);
};
const forbidden = (message: string) => {
  return new AppError(403, message, [{ path: 'forbidden', message }]);
};

export { unauthorized, notFound, forbidden , serverError, conflict};
