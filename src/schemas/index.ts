import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email is required / Invalid email' }),
  password: z.string().min(6, { message: 'Minimum 6 characters required' }),
  name: z.string().min(1, { message: 'Name is required' }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required / Invalid email' }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Minimum 6 characters required' }),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  githubLink: z.string(),
  demoLink: z.string(),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string(),
  content: z.string().min(1, 'Content is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  techStack: z.array(z.string()).nonempty('At least one tech stack item is required'),
});
