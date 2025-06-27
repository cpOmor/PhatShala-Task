import { Request, Response } from 'express';

export class ClassroomController {
  static async createClassroom(req: Request, res: Response) {
    return res.json({ message: 'createClassroom placeholder' });
  }

  static async getClassroomsBySchool(req: Request, res: Response) {
    return res.json({ message: 'getClassroomsBySchool placeholder' });
  }

  static async updateClassroomTeacher(req: Request, res: Response) {
    return res.json({ message: 'updateClassroomTeacher placeholder' });
  }

  static async addTextResource(req: Request, res: Response) {
    return res.json({ message: 'addTextResource placeholder' });
  }

  static async addFileResource(req: Request, res: Response) {
    return res.json({ message: 'addFileResource placeholder' });
  }
}
