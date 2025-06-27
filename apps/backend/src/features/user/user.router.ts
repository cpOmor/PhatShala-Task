import { Router } from 'express';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from './user.controller';
import multer from 'multer';

const router = Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });


router.get('/profile', getUserProfile);


router.put('/profile', updateUserProfile);


router.post('/profile/picture', upload.single('profileImage'), uploadProfilePicture);

export default router; 