/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentServices } from './student.service';



// Create a new user
const createStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.createStudent(req.body, req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${req?.body?.email} Check your email and use the 6-digit code.`,
    data: result,
  });
});
 

// Get all users
const getStudents = catchAsync(async (req: any, res) => {
  const result = await StudentServices.getStudents(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users have been successfully loaded.',
    data: result.transformedUsers,
    meta: result.meta,
    exportData: result.exportData,
  });
});


export const StudentControllers = {
  getStudents,
  createStudent,
};
