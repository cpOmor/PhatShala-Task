/* eslint-disable @typescript-eslint/no-explicit-any */

import { Schema } from 'mongoose';

export type TEmailInfo = {
  email: string;
  subject: string;
  body: any;
};

export type BaseType = {
  user?: Schema.Types.ObjectId;
  admin?: Schema.Types.ObjectId;
  _id?: Schema.Types.ObjectId;
  email? : string;
};
