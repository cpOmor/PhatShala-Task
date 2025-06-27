import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { SignupInput, LoginInput, VerifyEmailInput, VerifyPhoneInput } from './schemas';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../utils/email';
import { Response } from 'express';

export class AuthService {
  private static generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '24h' });
  }

  private static generateEmailVerificationToken(userId: string): string {
    return jwt.sign({ userId }, process.env.EMAIL_SECRET!, { expiresIn: '10m' });
  }

  static async signup(data: SignupInput) {
    const { email, password, role, name, phone, address } = data;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        userInfo: {
          create: {
            name,
            phone,
            address,
          },
        },
      },
      include: {
        userInfo: true,
      },
    });

    const token = this.generateToken(user.id);
    const verificationToken = this.generateEmailVerificationToken(user.id);
    
    // Create token record for user
    await prisma.token.create({
      data: {
        userId: user.id,
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, verificationToken);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.userInfo?.name,
      },
      token,
    };
  }

  static async login(data: LoginInput, ) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { userInfo: true },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (!user.emailVerified) {
      const verificationToken = this.generateEmailVerificationToken(user.id);
      // Update or create token record
      await prisma.token.upsert({
        where: { userId: user.id },
        update: {
          verificationToken,
          verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
        create: {
          userId: user.id,
          verificationToken,
          verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
      await sendVerificationEmail(user.email, verificationToken);
      // Assuming you have access to the response object (res) in your controller/route handler,
      // you should set the cookie there, not inside the service.
      // But if you want to show how to set it here for reference:

      res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });

      throw new Error('Please verify your email first. A new verification email has been sent.');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.userInfo?.name,
      },
      token,
    };
  }

  static async verifyEmail(data: VerifyEmailInput) {
    const { token } = data;
    try {
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.EMAIL_SECRET!);
      } catch (err) {
        throw new Error('Invalid or expired verification token');
      }
      const userId = (decoded as any).userId;
      // Find user and include token relation
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { token: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.emailVerified) {
        return {
          success: true,
          message: 'Email already verified',
          user: {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
          }
        };
      }
      // Use the token relation from user
      const tokenRecord = user.token;
      if (!tokenRecord) {
        throw new Error('No verification token found for this user');
      }
      const sentToken = token.trim();
      const dbToken = tokenRecord.verificationToken ? tokenRecord.verificationToken.trim() : null;
      const expiresRaw = tokenRecord.verificationTokenExpires;
      const expires = expiresRaw ? new Date(expiresRaw) : null;
      const now = new Date();
      if (
        !dbToken ||
        dbToken !== sentToken ||
        !expires ||
        expires < now
      ) {
        throw new Error('Invalid or expired verification token');
      }
      // Mark email as verified and clear token
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        });
        await prisma.token.update({
          where: { userId: user.id },
          data: {
            verificationToken: null,
            verificationTokenExpires: null,
          },
        });
      } catch (err) {
        throw new Error('Failed to update verification status. Please try again.');
      }
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          emailVerified: true,
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async verifyPhone(data: VerifyPhoneInput) {
    const { phone, otp } = data;
    
    const user = await prisma.user.findFirst({
      where: {
        userInfo: {
          phone,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // In a real application, verify OTP here
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });

    return { success: true, user: updatedUser };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const resetToken = jwt.sign({ userId: user.id }, process.env.EMAIL_SECRET!, { expiresIn: '10m' });
      // Update or create token record
      await prisma.token.upsert({
        where: { userId: user.id },
        update: {
          resetPasswordToken: resetToken,
          resetPasswordTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
        create: {
          userId: user.id,
          resetPasswordToken: resetToken,
          resetPasswordTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
      await sendPasswordResetEmail(email, resetToken);
    }
    return { success: true, message: 'If that email is registered, a password reset link has been sent.' };
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, process.env.EMAIL_SECRET!) as { userId: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }
      // Get token record
      const tokenRecord = await prisma.token.findUnique({ where: { userId: user.id } });
      if (
        !tokenRecord ||
        tokenRecord.resetPasswordToken !== token ||
        !tokenRecord.resetPasswordTokenExpires ||
        tokenRecord.resetPasswordTokenExpires < new Date()
      ) {
        throw new Error('Invalid or expired reset token');
      }
      const hashedPassword = await hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      });
      await prisma.token.update({
        where: { userId: user.id },
        data: {
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
        },
      });
      return { success: true, message: 'Password has been reset successfully.' };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  static async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.emailVerified) {
      throw new Error('Email is already verified.');
    }
    const verificationToken = this.generateEmailVerificationToken(user.id);
    await prisma.token.upsert({
      where: { userId: user.id },
      update: {
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId: user.id,
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await sendVerificationEmail(user.email, verificationToken);
    return { success: true, message: 'Verification email resent.' };
  }

  static async resendForgotPasswordEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, do not reveal if user does not exist
      return { success: true, message: 'If that email is registered, a password reset link has been sent.' };
    }
    const resetToken = jwt.sign({ userId: user.id }, process.env.EMAIL_SECRET!, { expiresIn: '10m' });
    await prisma.token.upsert({
      where: { userId: user.id },
      update: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId: user.id,
        resetPasswordToken: resetToken,
        resetPasswordTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await sendPasswordResetEmail(email, resetToken);
    return { success: true, message: 'If that email is registered, a password reset link has been sent.' };
  }
} 