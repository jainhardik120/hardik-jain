import { object, string, array } from 'zod';

export const LoginSchema = object({
  email: string().email({
    message: 'Email is required',
  }),
  password: string().min(1, {
    message: 'Password is required',
  }),
});

export const RegisterSchema = object({
  email: string().email({ message: 'Email is required / Invalid email' }),
  password: string().min(6, { message: 'Minimum 6 characters required' }),
  name: string().min(1, { message: 'Name is required' }),
});

export const ResetSchema = object({
  email: string().email({ message: 'Email is required / Invalid email' }),
});

export const NewPasswordSchema = object({
  password: string().min(6, { message: 'Minimum 6 characters required' }),
});

export const projectSchema = object({
  name: string().min(1, 'Project name is required'),
  githubLink: string(),
  demoLink: string(),
  category: string().min(1, 'Category is required'),
  imageUrl: string(),
  content: string().min(1, 'Content is required'),
  shortDescription: string().min(1, 'Short description is required'),
  techStack: array(string()).nonempty('At least one tech stack item is required'),
});

export const designSchema = object({
  name: string().min(1, 'Name is required').max(50, 'Name is too long'),
  height: string()
    .regex(/^\d+$/, 'Height must be a positive number')
    .transform(Number)
    .refine((val) => val > 0, 'Height must be greater than 0'),
  width: string()
    .regex(/^\d+$/, 'Width must be a positive number')
    .transform(Number)
    .refine((val) => val > 0, 'Width must be greater than 0'),
});

export const ContactSchema = object({
  email: string().email('Enter a valid email address'),
  subject: string().min(1, 'Subject is required'),
  message: string().min(50, 'Message should be minimum 50 characters long'),
});
