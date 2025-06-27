import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './auth.utils';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();



/**
 * This route handles user login.
 * It expects a request body with user credentials (e.g., email and password).
 * If the credentials are valid, it returns an access token.
 */
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

/**
 * This route handles user logout.
 * It typically clears the user's session or access token.
 * It does not require any request body.
 */
router.post('/logout', AuthControllers.logoutUser); 


/**
 * This route handles refresh token.
 * It expects a request body with a valid refresh token.
 * If the refresh token is valid, it generates a new access token.
 */
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);


/**
 * This route handles user email verification.
 * It expects a request body with a verification code sent to the user's email.
 * If the code is valid, it verifies the user's account.
 */

router.post(
  '/verification',
  AuthControllers.verification,
);


/**
 * This route handles forget password.
 * It expects a request body with the user's email.
 * If the email is registered, it sends a password reset code to the user's email.
 */
router.post(
  '/forget-password',
  AuthControllers.forgerPassword,
);


/**
 * This route handles the verification of the forget password code.
 * It expects a request body with the reset password code sent to the user's email.
 * If the code is valid, it allows the user to set a new password.
 * This route is typically used after the user has requested a password reset.
 */
router.put(
  '/forget-password-verification',
  AuthControllers.verificationForgetPassword, // Controller verifies the reset password code
);

/**
 * This route allows the user to set a new password.
 * It expects a request body with the new password and set cookies validation.
 * If the request is valid, it updates the user's password.
 * This route is typically used after the user has verified their forget password code.
 */
router.post(
  '/set-new-password',
  AuthControllers.setNewPassword,
);

// Route: Resend the account verification code
// This is useful if the user did not receive the initial verification code
// or if it has expired
router.put(
  '/resend-verification-code',
  AuthControllers.verificationCodeReSend,
);

/**
 * This route allows authenticated users to change their password.
 * It requires the user to be authenticated and have a valid role (admin, student, or teacher).
 * It expects a request body with the current password and the new password.
 * If the current password is correct, it updates the user's password.
 * This route is typically used by users who want to change their password after logging in.
 */
router.put(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.teacher ),
  AuthControllers.changePassword,
);



/**
 * This route handles getting the current user's information.
 * It requires authentication with admin, student, or teacher roles.
 * It returns the user's profile information, excluding sensitive data like verification status.
 * The user data is restructured to include profile information directly in the response.
 */
router.get('/get-me', 
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.teacher), 
  AuthControllers.getMe);


/**
 * This route allows authenticated users to update their profile information.
 * It requires the user to be authenticated and have a valid role (admin, student, or teacher).
 * It expects a request body with the updated user data, including profile information.
 */
router.put(
  '/update-me',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.teacher),
  AuthControllers.updateMe,
);


/**
 * This route allows the delete of a user.
 * It requires the user to be authenticated and have a valid role (admin, student, or teacher).
 * It expects a request parameter with the user's ID to be deleted.
 */
router.delete('/delete-me', 
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.teacher), 
AuthControllers.deleteMe);



export const AuthRoutes = router;
