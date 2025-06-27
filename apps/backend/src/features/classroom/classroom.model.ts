// Prisma handles the main model, but for service/controller typing:

export interface Classroom {
  id: string;
  name: string;
  schoolId: string;
  userId: string; // Teacher's userId
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassroomResource {
  id: string;
  classroomId: string;
  type: 'TEXT' | 'FILE';
  content?: string; // For text resources
  fileUrl?: string; // For file resources
  fileName?: string;
  uploadedBy: string; // userId
  createdAt: Date;
}
