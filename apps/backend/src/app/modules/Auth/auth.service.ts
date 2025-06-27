/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config, {
  jwt_access_expires_in,
  jwt_refresh_expires_in,
} from '../../config';
import AppError from '../../errors/AppError';
import { TLoginUser, TProfile, TUser, TVerification } from './auth.interface';
import { forbidden, notFound, serverError } from '../../utils/errorfunc';
import { createToken, verifyToken } from '../../utils/utils';
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import { TEmailInfo } from '../../utils/utils.interface';
import sendEmail from '../../utils/sendEmail';
import { UserStatus } from './auth.utils';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Profile, User } from './auth.model';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw notFound('User not found!');
  }
  if (!user?.verification?.verification) {
    throw notFound('You are not verified!');
  }
  // checking if the user is already deleted
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw forbidden('Please provide the correct password.');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('The account has been blocked.');
  }

  if (user?.status !== UserStatus.inProgress) {
    throw forbidden('Please provide the correct password.');
  }

  const isProfile = await Profile.findOne({ email: user?.email });

  if (isProfile === null) {
    throw forbidden('Something was wrong.');
  }

  await user.save();

  const jwtPayload = {
    email: user?.email,
    firstName: isProfile?.firstName,
    lastName: isProfile?.lastName,
    phone: isProfile?.phone,
    id: user?._id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (req: any, data: any) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw notFound('Something was wrong');
  }

  await User.updateOne(
    { email: data?.email },
    { $pull: { devices: { deviceId: data?.deviceId } } },
  );

  req.headers.authorization = '';
  req.cookies.refreshToken = '';
};

const refreshToken = async (req: any, res: any) => {
  const { refreshToken } = req.cookies;

  const decoded = verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );

  const { email, deviceId } = decoded;
  const user = (await User.findOne({ email })) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('Please provide the correct password.');
  }
  if (user.status !== UserStatus.inProgress) {
    throw forbidden('Please provide the correct password.');
  }

  const isDevice = await User.findOne({
    email: decoded?.email,
    'devices.deviceId': deviceId,
  });

  if (isDevice === null || !isDevice) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Session is expire new error!',
      [
        {
          path: 'unauthorized',
          message: 'Session is expire new error!',
        },
      ],
    );
  }

  res.clearCookie('connect.sid');

  await User.updateOne(
    { email: user?.email, 'devices.deviceId': deviceId },
    {
      $set: {
        'devices.$.lastActivity': new Date(),
      },
    },
  );

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};
const forgerPassword = async (req: any, res: any) => {
  const { email } = req.body;
  const user: TUser | null = await User.findOne({ email });
  if (!user) {
    throw notFound('User not found!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('This user was blocked.');
  }

  const code = generateUniqueCode(6);

  const body = `This is your verification code ${code}`;

  const emailData: TEmailInfo = {
    email: email,
    body: ` <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify OTP to Change Password</title>
    <style>
      svg {
        height: 30px !important;
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif;  color: #fff; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #111; border-radius: 8px; box-shadow: 0 4px 8px rgba(255, 255, 0, 0.2); text-align: center;">
            <!-- Header with Logo -->
            <tr>
              <td style="background-color: #ffed00; padding: 10px; text-align: center;">
              
          <img src="https://res.cloudinary.com/dssmacjme/image/upload/v1741600767/vr4iqumzttiqefri1h3n.jpg" alt="Skillion" height="30" class="CToWUd" data-bit="iit">
        
              </td>
            </tr>
            <!-- OTP Section -->
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #fff; font-size: 24px;">🔐 Verify Your OTP</h2>
                <table align="center" style="background-color: #222; padding: 10px; border-radius: 5px;">
                  <tr>
                    <td style="font-size: 28px; font-weight: bold; color: #ffed00;">${code}</td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: red; margin-top: 10px; font-weight: bold;">
                  ⚠ This OTP is valid for **only 5 minutes**. Please use it before it expires!
                </p>
                <p style="font-size: 14px; color: #bbb; margin-top: 10px;">For security reasons, never share your OTP with anyone.</p>
              </td>
            </tr>
            <!-- Footer Links -->
            <tr>
              <td style="background-color: #000; padding: 15px; text-align: center; font-size: 14px;">
                <a href="https://www.facebook.com/skilliontech.official" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="https://www.youtube.com/@SkillionTech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">YouTube</a>
                <a href="https://www.tiktok.com/@skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">TikTok</a>
                <a href="https://www.linkedin.com/company/skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    subject: 'Verify OTP to Change Password',
  };

  const sentMail = await sendEmail(emailData);

  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 5);

  if (sentMail) {
    await User.findOneAndUpdate(
      { email },
      { verification: { code, verification: false, expired } },
    );

    // Generate JWT token for verification and set as cookie
    const jwtPayload = {
      email: user?.email,
      id: user?._id,
    };

    const token = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '5m',
    );

    res.cookie('forget-password-verification', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: 'strict',
    });
  }

  return body;
};

const verification = async (req: any) => {
  const code = req.body.code as string;
  const cookie = req.cookies['forget-password-verification'];

  if (!cookie) {
    throw forbidden('Something went wrong!');
  }
  let decodedCookie: TVerification;
  try {
    decodedCookie = jwt.verify(
      cookie,
      config.jwt_access_secret as string,
    ) as TVerification;
  } catch (err) {
    throw forbidden('Something went wrong!');
  }

  const user = await User.findOne({ email: decodedCookie.email }).select(
    'verification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (user?.verification?.verification) {
    throw forbidden('User already verified');
  }

  if (!code) {
    throw forbidden('Enter 6 digit code');
  }

  if (new Date() > (user?.verification?.expired as Date)) {
    throw forbidden('Expired . Please request a new code.');
  }

  if (!(code === user?.verification?.code)) {
    throw forbidden('Oops! That’s not the right code');
  }

  const update = await User.findOneAndUpdate(
    { email: decodedCookie.email },
    { verification: { verification: true, code } },
  );

  // Remove the 'forget-password-verification' cookie after successful verification
  if (update) {
    req.res.clearCookie('forget-password-verification', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const jwtPayload = {
      email: decodedCookie.email,
      id: user?._id,
      verified: true,
    };

    const token = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '5m',
    );

    req.res.cookie('verified-user', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: 'strict',
    });
  }
  return;
};

const verificationForgetPassword = async (payload: {
  code: string;
  email: string;
}) => {
  const user = await User.findOne({ email: payload.email }).select(
    'verification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  if (new Date() > (user?.verification?.expired as Date)) {
    throw forbidden('Expired . Please request a new code.');
  }

  if (!(payload?.code === user?.verification?.code)) {
    throw forbidden('Oops! That’s not the right code');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    { verification: { verification: true, code: payload?.code } },
  );

  const jwtPayload = {
    email: payload.email,
    code: payload.code,
  };

  const validation = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m' as string,
  );

  return { validation };
};

// Resend verification code
const verificationCodeReSend = async (payload: TUser & TProfile, req : any) => {
  const code = generateUniqueCode(6);
  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 5);

  const newUserInfo = {
    verification: { code, verification: false, expired },
  };

  const emailData: TEmailInfo = {
    email: payload?.email,
    body: `
       <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify OTP to Change Password</title>
    <style>
      svg {
        height: 30px !important;
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif;  color: #fff; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #111; border-radius: 8px; box-shadow: 0 4px 8px rgba(255, 255, 0, 0.2); text-align: center;">
            <!-- Header with Logo -->
            <tr>
              <td style="background-color: #ffed00; padding: 10px; text-align: center;">
              
          <img src="https://res.cloudinary.com/dssmacjme/image/upload/v1741600767/vr4iqumzttiqefri1h3n.jpg" alt="Skillion" height="30" class="CToWUd" data-bit="iit">
        
              </td>
            </tr>
            <!-- OTP Section -->
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #fff; font-size: 24px;">🔐 Verify Your OTP</h2>
                <table align="center" style="background-color: #222; padding: 10px; border-radius: 5px;">
                  <tr>
                    <td style="font-size: 28px; font-weight: bold; color: #ffed00;">${code}</td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: red; margin-top: 10px; font-weight: bold;">
                  ⚠ This OTP is valid for **only 5 minutes**. Please use it before it expires!
                </p>
                <p style="font-size: 14px; color: #bbb; margin-top: 10px;">For security reasons, never share your OTP with anyone.</p>
              </td>
            </tr>
            <!-- Footer Links -->
            <tr>
              <td style="background-color: #000; padding: 15px; text-align: center; font-size: 14px;">
                <a href="https://www.facebook.com/skilliontech.official" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="https://www.youtube.com/@SkillionTech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">YouTube</a>
                <a href="https://www.tiktok.com/@skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">TikTok</a>
                <a href="https://www.linkedin.com/company/skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    subject: 'Verify OTP to Change Password',
  };

  const mainSended = await sendEmail(emailData);

  if (mainSended) {
    const updatedUser = await User.findOneAndUpdate(
      { email: payload?.email },
      newUserInfo,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      throw notFound('User update filled');
    }

    if (updatedUser) {
      // Generate JWT token for verification and set as cookie
      const jwtPayload = {
        email: payload?.email,
      };

      const token = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '5m',
      );

      req.res.cookie('forget-password-verification', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000, // 5 minutes
        sameSite: 'strict',
      });
    }

    return;
  }
};
const setNewPassword = async (token: string, password: string, req: any) => {
  // Checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // Checking if the user exists
  const user = (await User.findOne({ email }).select(
    'email status -_id',
  )) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;

  if (userStatus === UserStatus.blocked) {
    throw forbidden('The user has been blocked!');
  }

  // Ensure bcrypt_salt_rounds is a valid number
  const saltRounds = Number(config.bcrypt_salt_rounds);

  if (isNaN(saltRounds) || saltRounds <= 0) {
    throw new Error('Invalid bcrypt salt rounds configuration.');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const updateUser = await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );
  if (updateUser) {
    // Remove the 'verified-user' cookie after successful password update
    // Assuming you have access to the response object, otherwise pass it as a parameter
    // Example: setNewPassword = async (token: string, password: string, res: any) => { ... }
    req.res.clearCookie('verified-user', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  return '';
};

const changePassword = async (req: any) => {
  // Check if the user is authenticated
  const token = req.cookies.refreshToken;
  if (!token) {
    throw forbidden('Something went wrong');
  }
  const payload = req.body;

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //hash new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update user password
  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );
};

const getMe = async (id: string) => {
  const user = await User.findById(id)
    .populate('profileId')
    .select('-verification');

  if (!user) {
    throw notFound('No user found.');
  }

  // Destructure and reassemble the user data
  const { profileId, email, ...restUserData } = user.toObject();

  return { ...profileId, email, ...restUserData };
};

// Update an existing user
const updateMe = async (req: any) => {
  const id: string = req?.user?.id;
  const payload: TUser & TProfile = req?.body;
  const file: any = req?.file;

  const isUser = (await User.findById(id).select('+password')) as TUser &
    TProfile;

  if (!isUser) {
    throw notFound('No user found');
  }

  let profile = isUser.image;
  if (file) {
    try {
      const result = await sendImageToCloudinary(file.filename, file.path);
      profile = result.url as string;
    } catch (error) {
      throw serverError(`Failed to upload the image. ${error instanceof Error ? error.message : ''}`);
    }
  }

  payload.image = profile;

  await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  const updatedUser = await Profile.findOneAndUpdate(
    { email: isUser?.email },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedUser) {
    throw forbidden('User update filled');
  }
  return updatedUser;
};

// Delete a user
const deleteMe = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw notFound('No user found.');
  }
  return deletedUser;
};

export const AuthServices = {
  loginUser,
  logoutUser,
  changePassword,
  refreshToken,
  verification,
  forgerPassword,
  setNewPassword,
  verificationForgetPassword,
  verificationCodeReSend,
  getMe,
  updateMe,
  deleteMe,
};
