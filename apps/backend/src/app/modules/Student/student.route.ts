import express from 'express';
import { StudentControllers } from './student.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = express.Router();

// Create a new user
// This route is typically used for admin to create users
// or for user registration
router.post('/create-student', StudentControllers.createStudent);
 
// Get all users
router.get(
  '/students',
  // auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.teacher),
  StudentControllers.getStudents,
);

export const studentRoutes = router;
