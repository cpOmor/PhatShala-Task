import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import path from 'path';
import { AuthenticatedRequest } from './user.types';


export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userInfo: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      userInfo: user.userInfo,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};


export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { name, phone, address } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        userInfo: {
          update: {
            name,
            phone,
            address,
          },
        },
      },
      include: { userInfo: true },
    });
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      userInfo: user.userInfo,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};


export const uploadProfilePicture = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imagePath = path.join('uploads/profile_images/', req.file.filename);
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        userInfo: {
          update: {
            profileImage: imagePath,
          },
        },
      },
      include: { userInfo: true },
    });
    res.json({
      message: 'Profile picture updated',
      profileImage: imagePath,
      userInfo: user.userInfo,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
}; 