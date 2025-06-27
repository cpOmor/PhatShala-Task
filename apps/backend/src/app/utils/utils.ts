/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';



export const createToken = (
  jwtPayload: any,
  secret: string,
  expiresIn: any,
): string => {
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
