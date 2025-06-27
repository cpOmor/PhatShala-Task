import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { facultyRoutes } from '../modules/Faculty/faculty.route';
import { studentRoutes } from '../modules/Student/student.route';
const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  }, 
  {
    path: '/faculty',
    route: facultyRoutes,
  }, 
  {
    path: '/student',
    route: studentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
