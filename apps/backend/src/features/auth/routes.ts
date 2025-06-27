import { Router } from 'express';
import { AuthController } from './controller';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = Router();

const profileImagesDir = path.join(__dirname, '../../../uploads/profile_images');
console.log('[DEBUG] Resolved profileImagesDir:', profileImagesDir);

if (!fs.existsSync(profileImagesDir)) {
  console.log('[DEBUG] Directory does not exist. Creating:', profileImagesDir);
  fs.mkdirSync(profileImagesDir, { recursive: true });
  console.log('[DEBUG] Directory created successfully.');
} else {
  console.log('[DEBUG] Directory already exists:', profileImagesDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('[DEBUG] Upload request received.');
    console.log('[DEBUG] Storing file to directory:', profileImagesDir);
    console.log('[DEBUG] File details:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    cb(null, profileImagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const finalFilename = uniqueSuffix + '-' + file.originalname;
    console.log('[DEBUG] Generating filename for upload...');
    console.log('[DEBUG] Original filename:', file.originalname);
    console.log('[DEBUG] Generated unique filename:', finalFilename);
    cb(null, finalFilename);
  }
});

const upload = multer({ storage });

router.post('/signup', upload.single('profileImage'), AuthController.signup);
router.post('/login', AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/verify-phone', AuthController.verifyPhone);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/resend-verification-email', AuthController.resendVerificationEmail);
router.post('/resend-forgot-password-email', AuthController.resendForgotPasswordEmail);

export default router; 