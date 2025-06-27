export const USER_ROLE = {
  teacher: 'teacher',
  student: 'student',
  admin: 'admin',
} as const;


export const UserStatus = { inProgress: 'in-progress', blocked: 'blocked' } as const;
export type TUserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export type TUserRole = keyof typeof USER_ROLE;