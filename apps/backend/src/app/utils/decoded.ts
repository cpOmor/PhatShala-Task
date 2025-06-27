/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const decoded = ({ token ,  res}: { token: string , res : any}) => {
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized: Invalid or expired token',
    });
  }
  return decoded;
};

export default decoded;


export interface IMyRequest extends Request {
  query: {
      [key: string]: string;
  };
}
