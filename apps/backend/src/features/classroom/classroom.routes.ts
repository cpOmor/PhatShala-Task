import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { ClassroomController } from './classroom.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', [authenticate, authorize(['ADMIN'])], ClassroomController.createClassroom);
router.get('/school/:schoolId', authenticate, ClassroomController.getClassroomsBySchool);
router.put('/:id/teacher', [authenticate, authorize(['ADMIN'])], ClassroomController.updateClassroomTeacher);
router.post('/:id/resources/text', [authenticate, authorize(['TEACHER'])], ClassroomController.addTextResource);
router.post('/:id/resources/file', [authenticate, authorize(['TEACHER']), upload.single('file')], ClassroomController.addFileResource);

export default router;
