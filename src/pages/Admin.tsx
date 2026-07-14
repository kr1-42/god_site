import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Layout from '../components/Layout'
import { useAdminStore } from '../stores/adminStore'
import { useProducts, useCreateProduct } from '../services/products'
import './Admin.css'

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  category: z.enum(['bags', 'dogs']),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  image: z.string().url('Enter a valid image URL'),
  additionalImages: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

function AdminLogin() {
  const { login } = useAdminStore()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="admin-section">
      <div className="container">
        <div className="admin-login">
          <h1>Admin Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="admin-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function AdminProductList() {
  const { data: products = [], isLoading } = useProducts()

  if (isLoading) {
    return <p>Loading products…</p>
  }

  return (
    <div className="admin-product-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminAddProductForm() {
  const createProduct = useCreateProduct()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { category: 'bags' },
  })

  const onSubmit = (values: ProductFormValues) => {
    setSuccessMessage(null)
    const additionalImages = (values.additionalImages ?? '')
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)

    createProduct.mutate(
      {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
        stock: values.stock,
        image: values.image,
        images: additionalImages.length > 0 ? [values.image, ...additionalImages] : [values.image],
      },
      {
        onSuccess: () => {
          setSuccessMessage(`"${values.name}" was added.`)
          reset({ category: values.category })
        },
      },
    )
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Add Product</h2>

      <label>
        Name
        <input type="text" {...register('name')} />
        {errors.name && <span className="admin-field-error">{errors.name.message}</span>}
      </label>

      <label>
        Description
        <textarea rows={4} {...register('description')} />
        {errors.description && <span className="admin-field-error">{errors.description.message}</span>}
      </label>

      <div className="admin-form-grid">
        <label>
          Price
          <input type="number" step="0.01" {...register('price')} />
          {errors.price && <span className="admin-field-error">{errors.price.message}</span>}
        </label>

        <label>
          Stock
          <input type="number" {...register('stock')} />
          {errors.stock && <span className="admin-field-error">{errors.stock.message}</span>}
        </label>

        <label>
          Category
          <select {...register('category')}>
            <option value="bags">Bags</option>
            <option value="dogs">Dogs</option>
          </select>
        </label>
      </div>

      <label>
        Primary Image URL
        <input type="text" placeholder="https://…" {...register('image')} />
        {errors.image && <span className="admin-field-error">{errors.image.message}</span>}
      </label>

      <label>
        Additional Image URLs (one per line, optional)
        <textarea rows={3} {...register('additionalImages')} />
      </label>

      {createProduct.isError && (
        <p className="admin-error">{createProduct.error instanceof Error ? createProduct.error.message : 'Failed to add product'}</p>
      )}
      {successMessage && <p className="admin-success">{successMessage}</p>}

      <button type="submit" className="btn-primary" disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Adding…' : 'Add Product'}
      </button>
    </form>
  )
}

export default function AdminPage() {
  const { isAuthenticated, logout } = useAdminStore()

  if (!isAuthenticated) {
    return (
      <Layout>
        <AdminLogin />
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="admin-section">
        <div className="container">
          <div className="admin-header">
            <h1>Admin</h1>
            <button className="btn-secondary" onClick={logout}>Log Out</button>
          </div>

          <div className="admin-layout">
            <AdminAddProductForm />
            <AdminProductList />
          </div>
        </div>
      </section>
    </Layout>
  )
}
