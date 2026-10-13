import { z } from 'zod'

// Absolute http(s) URL, or a path on this site such as /attachments/... or /api/uploads/...
const sitePath = z.string().regex(/^\/(?!\/)\S*$/).refine((path) => !path.includes('..'))
const imageUrl = z.string().url().refine((url) => /^https?:/.test(url)).or(sitePath)

export const productInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  descriptionIt: z.string().optional(),
  details: z.string().optional(),
  detailsIt: z.string().optional(),
  dimensions: z.string().optional(),
  dimensionsIt: z.string().optional(),
  price: z.number().positive(),
  image: imageUrl,
  images: z.array(imageUrl).optional(),
  stock: z.number().int().nonnegative(),
  category: z.string().min(1),
  status: z.enum(['active', 'inactive']).optional(),
})

export const productUpdateSchema = productInputSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' },
)

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1).max(50),
  nameIt: z.string().trim().max(50).optional(),
})

export const categoryUpdateSchema = categoryInputSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' },
)

export const homeSectionSchema = z.object({
  ids: z.array(z.string().min(1)).max(24),
})

export const productOrderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
})
