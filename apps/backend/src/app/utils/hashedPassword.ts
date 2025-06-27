import config from '../config';
import bcrypt from 'bcrypt';
import { forbidden } from './errorfunc';


export const hashedPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = Number(config.bcrypt_salt_rounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error) {
    throw forbidden('Something is wrong!')
  }
};
