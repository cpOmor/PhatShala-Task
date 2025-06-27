import { z } from 'zod';

// Define Zod schema for notification creation and update
const createNotificationSchema = z.object({
  body: z.object({
    message: z.string({
      required_error: 'Please provide the message.',
    }),
    status: z.enum(['read', 'unread']).optional().default('read'),
  }),
});

export const NotificationValidation = {
  createNotificationSchema,
};
