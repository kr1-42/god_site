import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Layout from '../components/Layout'
import { useAdminStore } from '../stores/adminStore'
import { useProducts, useCreateProduct, useUpdateProduct } from '../services/products'
import { Product } from '../types'
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

type EditableFields = {
  name: string
  price: string
  stock: string
  category: Product['category']
}

function AdminProductRow({ product }: { product: Product }) {
  const updateProduct = useUpdateProduct()
  const [isEditing, setIsEditing] = useState(false)
  const [fields, setFields] = useState<EditableFields>({
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    category: product.category,
  })
  const [error, setError] = useState<string | null>(null)

  const startEditing = () => {
    setFields({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
    })
    setError(null)
    setIsEditing(true)
  }

  const handleSave = () => {
    const price = Number(fields.price)
    const stock = Number(fields.stock)

    if (!fields.name.trim()) {
      setError('Name is required')
      return
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError('Price must be greater than 0')
      return
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError('Stock must be a non-negative whole number')
      return
    }

    setError(null)
    updateProduct.mutate(
      { id: product.id, name: fields.name.trim(), price, stock, category: fields.category },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  const toggleStatus = () => {
    updateProduct.mutate({ id: product.id, status: product.status === 'active' ? 'inactive' : 'active' })
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input
            type="text"
            value={fields.name}
            onChange={(e) => setFields({ ...fields, name: e.target.value })}
          />
        </td>
        <td>
          <select
            value={fields.category}
            onChange={(e) => setFields({ ...fields, category: e.target.value as Product['category'] })}
          >
            <option value="bags">Bags</option>
            <option value="dogs">Dogs</option>
          </select>
        </td>
        <td>
          <input
            type="number"
            step="0.01"
            value={fields.price}
            onChange={(e) => setFields({ ...fields, price: e.target.value })}
          />
        </td>
        <td>
          <input
            type="number"
            value={fields.stock}
            onChange={(e) => setFields({ ...fields, stock: e.target.value })}
          />
        </td>
        <td>
          <span className={`admin-status admin-status-${product.status}`}>{product.status}</span>
        </td>
        <td className="admin-row-actions">
          {error && <span className="admin-field-error">{error}</span>}
          <button className="btn-secondary" onClick={handleSave} disabled={updateProduct.isPending}>
            {updateProduct.isPending ? 'Saving…' : 'Save'}
          </button>
          <button className="btn-secondary" onClick={() => setIsEditing(false)} disabled={updateProduct.isPending}>
            Cancel
          </button>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>{product.stock}</td>
      <td>
        <span className={`admin-status admin-status-${product.status}`}>{product.status}</span>
      </td>
      <td className="admin-row-actions">
        <button className="btn-secondary" onClick={startEditing}>Edit</button>
        <button className="btn-secondary" onClick={toggleStatus} disabled={updateProduct.isPending}>
          {product.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    </tr>
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <AdminProductRow key={product.id} product={product} />
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
        status: 'active',
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
