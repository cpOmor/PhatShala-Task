import { Schema, startSession } from 'mongoose'; 
import { USER_ROLE, UserStatus } from '../modules/Auth/auth.utils';
import { hashedPassword } from '../utils/hashedPassword';
import { Profile, User } from '../modules/Auth/auth.model';
import { TProfile, TUser } from '../modules/Auth/auth.interface';

// Create a new user
export const speedAdmin = async () => { 
  const session = await startSession();
  session.startTransaction();
  const email = 'admin@gmail.com';
  try {
    const isExitsUser = await User.findOne({ email, role: USER_ROLE.admin });
    if (isExitsUser) {
      throw new Error('Admin user already exists.');
    }

    const password = await hashedPassword('11111111');

    const newProfile: TProfile = {
      firstName: 'Omar',
      lastName: 'Faruk',
      phone: '01970299035',
      email,
      image: '',
    };

    // Profile creation within the transaction
    const userProfile = await Profile.create([newProfile], { session });

    const newUserInfo: TUser = {
      profileId: userProfile[0]?._id as Schema.Types.ObjectId,
      email,
      alterNumber :"",
      role: USER_ROLE.student,
      password,
      rememberPassword: false,
      status: UserStatus.inProgress,
      verification: { code: '00000', verification: true, expired: new Date() },
    };

    await User.create([newUserInfo], { session });

    await session.commitTransaction();
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
