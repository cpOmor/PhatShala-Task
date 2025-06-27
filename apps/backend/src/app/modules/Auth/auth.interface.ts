import { Schema } from "mongoose";
import { BaseType } from "../../utils/utils.interface";
import { TUserRole, TUserStatus } from "./auth.utils";

export type TLoginUser = {
  email: string;
  password: string;
};


export type TVerification = BaseType & {
  code: string;
  verification: boolean;
  expired: Date;
};

//  Represents a user type.
export type TUser = BaseType & {
  profileId: Schema.Types.ObjectId;
  email: string;
  alterNumber: string;
  role: TUserRole;
  password: string;
  status: TUserStatus;
  verification?: TVerification;
  rememberPassword: boolean;
};

// Represents a profile type.
export type TProfile = BaseType & {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  image?: string;
};

