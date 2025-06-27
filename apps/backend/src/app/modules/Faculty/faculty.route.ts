import express from 'express';
import { FacultyControllers } from './faculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = express.Router();
/**
 * This route handles faculty creation.
 * It expects a request body with faculty details (e.g., firstName, lastName, phone, email, image, password).
 * If the faculty is created successfully, it returns the created faculty data.
 */
router.post('/create-faculty', FacultyControllers.createFaculty);
 
/**
 * This route handles finding a faculty member.
 * If the faculty member is found, it returns the faculty data.
 */
router.get(
  '/faculties',
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.teacher),
  FacultyControllers.getFaculties,
);

 
export const facultyRoutes = router;
