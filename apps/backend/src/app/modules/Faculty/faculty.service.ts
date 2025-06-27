/* eslint-disable @typescript-eslint/no-explicit-any */

import {  notFound } from '../../utils/errorfunc';
import { Schema, startSession } from 'mongoose';
import sendEmail from '../../utils/sendEmail';
import { TEmailInfo } from '../../utils/utils.interface';
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import { IMyRequest } from '../../utils/decoded';
import QueryBuilder from '../../builder/QueryBuilder';
import { hashedPassword } from '../../utils/hashedPassword';
import { USER_ROLE, UserStatus } from '../Auth/auth.utils'; 
import { Profile, User } from '../Auth/auth.model';
import { TProfile, TUser } from '../Auth/auth.interface';



const getFaculties = async (req: IMyRequest) => {
  const queryBuilder = new QueryBuilder(User.find({ role: USER_ROLE.teacher }).populate('profileId'), req.query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const transformedUsers = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  const exportData = transformedUsers.map((user: any) => {
    const { profileId, ...restUserData } = user.toObject();
    return {
      ...profileId,
      ...restUserData,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  });
  return { transformedUsers, meta, exportData };
};

// Create a new user
const createFaculty = async (payload: TUser & TProfile) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const isExitsUser = await User.findOne({ email: payload?.email });
    if (isExitsUser) {
      throw notFound('User already exists.');
    }

    const password = await hashedPassword(payload?.password);
    const code = generateUniqueCode(6);
    const newProfile: TProfile = {
      firstName: payload?.firstName,
      lastName: payload?.lastName,
      phone: payload?.phone,
      email: payload?.email,
      image: payload?.image || '',
    };

    // Profile creation within the transaction
    const userProfile = await Profile.create([newProfile], { session });

    const expired = new Date();
    expired.setMinutes(expired.getMinutes() + 5); // Set expiration to 5 minutes from now

    const newUserInfo: TUser = {
      profileId: userProfile[0]?._id as Schema.Types.ObjectId,
      email: payload.email as string,
      alterNumber: payload.alterNumber as string,
      role: USER_ROLE.teacher,
      password,
      rememberPassword: false,
      status: UserStatus.inProgress,
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
</html>
`,
      subject: 'Verify OTP',
    };

    const mainSended = await sendEmail(emailData);

    if (mainSended) {
      // User creation within the transaction
      await User.create([newUserInfo], { session });

      // Commit the transaction if email was successfully sent
      await session.commitTransaction();
    } else {
      throw new Error('Failed to send email.');
    }
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
 
export const FacultyServices = {
  getFaculties,
  createFaculty,
};
