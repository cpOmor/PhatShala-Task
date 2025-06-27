import { Request, Response } from 'express';
import { AuthService } from './service';
import { signupSchema, loginSchema, verifyEmailSchema, verifyPhoneSchema, forgotPasswordSchema, resetPasswordSchema } from './schemas';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      console.log(req.body);
      const validatedData = signupSchema.parse(req.body);
      const result = await AuthService.signup(validatedData);
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData); 
    

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      console.log('verifyEmail called');
      const validatedData = verifyEmailSchema.parse(req.body);
      const result = await AuthService.verifyEmail(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async verifyPhone(req: Request, res: Response) {
    try {
      const validatedData = verifyPhoneSchema.parse(req.body);
      const result = await AuthService.verifyPhone(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async logout(req: Request, res: Response) {
    res.json({ success: true, message: 'Logged out successfully' });
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const result = await AuthService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      const result = await AuthService.resetPassword(token, newPassword);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async resendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required.' });
      }
      const result = await AuthService.resendVerificationEmail(email);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  

  static async resendForgotPasswordEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required.' });
      }
      const result = await AuthService.resendForgotPasswordEmail(email);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 