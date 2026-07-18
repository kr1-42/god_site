import { z } from 'zod'

export const productInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string().url(),
  images: z.array(z.string().url()).optional(),
  stock: z.number().int().nonnegative(),
  category: z.enum(['bags', 'dogs']),
  status: z.enum(['active', 'inactive']).optional(),
})

export const productUpdateSchema = productInputSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' },
)
