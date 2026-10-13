import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Layout from '../components/Layout'
import ProductEditModal from '../components/ProductEditModal'
import { useAdminStore } from '../stores/adminStore'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useDuplicateProduct, useReorderProducts, useUploadImage } from '../services/products'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../services/categories'
import { HomeSection, useHomeSections, useSaveHomeSection } from '../services/homeSections'
import { Category, Product } from '../types'
import './Admin.css'

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'English description is required'),
  descriptionIt: z.string().optional(),
  details: z.string().optional(),
  detailsIt: z.string().optional(),
  dimensions: z.string().optional(),
  dimensionsIt: z.string().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  category: z.string().min(1, 'Choose a category'),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  image: z
    .string()
    .url('Enter a valid image URL or choose a file')
    .or(z.string().regex(/^\/(?!\/)\S*$/, 'Enter a valid image URL or choose a file')),
  additionalImages: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

function CategoryOptions() {
  const { data: categories = [] } = useCategories()
  return (
    <>
      {categories.map((category) => (
        <option key={category.slug} value={category.slug}>{category.name}</option>
      ))}
    </>
  )
}

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

type ReorderControls = {
  onMoveUp?: () => void
  onMoveDown?: () => void
  rowProps: React.HTMLAttributes<HTMLTableRowElement>
}

function AdminProductRow({ product, reorder }: { product: Product; reorder?: ReorderControls }) {
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const duplicateProduct = useDuplicateProduct()
  const { data: categories = [] } = useCategories()
  // The product open in the edit popup: this one, or a copy just made from it
  const [editing, setEditing] = useState<Product | null>(null)

  const handleDuplicate = () => {
    duplicateProduct.mutate(product.id, { onSuccess: (copy) => setEditing(copy) })
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"? This can't be undone.`)) {
      deleteProduct.mutate(product.id)
    }
  }

  const toggleStatus = () => {
    updateProduct.mutate({ id: product.id, status: product.status === 'active' ? 'inactive' : 'active' })
  }

  return (
    <>
      <tr {...reorder?.rowProps}>
        <td className="admin-reorder-cell">
          {reorder && (
            <>
              <span className="admin-drag-handle" aria-hidden="true" title="Drag to reorder">⋮⋮</span>
              <button className="admin-move-btn" onClick={reorder.onMoveUp} disabled={!reorder.onMoveUp} aria-label="Move up">▲</button>
              <button className="admin-move-btn" onClick={reorder.onMoveDown} disabled={!reorder.onMoveDown} aria-label="Move down">▼</button>
            </>
          )}
        </td>
        <td className="admin-cell-name">{product.name}</td>
        <td className="admin-cell-category">
          <select
            className="admin-category-select"
            aria-label={`Move ${product.name} to category`}
            value={product.category}
            onChange={(e) => updateProduct.mutate({ id: product.id, category: e.target.value })}
            disabled={updateProduct.isPending}
          >
            {!categories.some((c) => c.slug === product.category) && (
              <option value={product.category}>{product.category}</option>
            )}
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </td>
        <td className="admin-cell-price">${product.price.toFixed(2)}</td>
        <td className="admin-cell-stock" data-label="Stock">{product.stock}</td>
        <td className="admin-cell-status">
          <span className={`admin-status admin-status-${product.status}`}>{product.status}</span>
        </td>
        <td className="admin-row-actions">
          <button className="btn-secondary" onClick={() => setEditing(product)}>Edit</button>
          <button className="btn-secondary" onClick={handleDuplicate} disabled={duplicateProduct.isPending}>
            {duplicateProduct.isPending ? 'Copying…' : 'Duplicate'}
          </button>
          <button className="btn-secondary" onClick={toggleStatus} disabled={updateProduct.isPending}>
            {product.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <button className="btn-secondary admin-delete-btn" onClick={handleDelete} disabled={deleteProduct.isPending}>
            {deleteProduct.isPending ? 'Deleting…' : 'Delete'}
          </button>
          {deleteProduct.isError && (
            <span className="admin-field-error">
              {deleteProduct.error instanceof Error ? deleteProduct.error.message : 'Delete failed'}
            </span>
          )}
          {duplicateProduct.isError && (
            <span className="admin-field-error">
              {duplicateProduct.error instanceof Error ? duplicateProduct.error.message : 'Duplicate failed'}
            </span>
          )}
          {updateProduct.isError && (
            <span className="admin-field-error">
              {updateProduct.error instanceof Error ? updateProduct.error.message : 'Update failed'}
            </span>
          )}
        </td>
      </tr>
      {editing && <ProductEditModal key={editing.id} product={editing} onClose={() => setEditing(null)} />}
    </>
  )
}

function AdminCategoryRow({ category, count }: { category: Category; count: number }) {
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [nameIt, setNameIt] = useState(category.nameIt ?? '')

  const startEditing = () => {
    setName(category.name)
    setNameIt(category.nameIt ?? '')
    updateCategory.reset()
    setIsEditing(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    updateCategory.mutate(
      { slug: category.slug, name: name.trim(), nameIt: nameIt.trim() },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  const error = updateCategory.error ?? deleteCategory.error

  if (isEditing) {
    return (
      <li>
        <form className="admin-category-edit" onSubmit={handleSave}>
          <input type="text" aria-label="English name" placeholder="English name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" aria-label="Italian name" placeholder="Italian name" value={nameIt} onChange={(e) => setNameIt(e.target.value)} />
          <button type="submit" className="btn-primary" disabled={updateCategory.isPending || !name.trim()}>
            {updateCategory.isPending ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
        {error && <p className="admin-error">{error instanceof Error ? error.message : 'Something went wrong'}</p>}
      </li>
    )
  }

  return (
    <li>
      <span>
        {category.name}
        {category.nameIt ? (
          <span className="admin-category-it"> / {category.nameIt}</span>
        ) : (
          <span className="admin-category-missing"> / no Italian name</span>
        )}{' '}
        <span className="admin-category-count">({count})</span>
      </span>
      <span className="admin-category-actions">
        <button className="btn-secondary" onClick={startEditing}>Edit</button>
        <button
          className="btn-secondary"
          onClick={() => deleteCategory.mutate(category.slug)}
          disabled={count > 0 || deleteCategory.isPending}
          title={count > 0 ? 'Move or remove its products first' : undefined}
        >
          Delete
        </button>
      </span>
      {error && <p className="admin-error">{error instanceof Error ? error.message : 'Something went wrong'}</p>}
    </li>
  )
}

function AdminCategoryManager() {
  const { data: categories = [] } = useCategories()
  const { data: products = [] } = useProducts()
  const createCategory = useCreateCategory()
  const [name, setName] = useState('')
  const [nameIt, setNameIt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createCategory.mutate(
      { name: name.trim(), nameIt: nameIt.trim() },
      {
        onSuccess: () => {
          setName('')
          setNameIt('')
        },
      },
    )
  }

  return (
    <div className="admin-categories">
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <AdminCategoryRow
            key={category.slug}
            category={category}
            count={products.filter((product) => product.category === category.slug).length}
          />
        ))}
      </ul>
      <form className="admin-category-add" onSubmit={handleSubmit}>
        <input
          type="text"
          aria-label="New category English name"
          placeholder="English name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          aria-label="New category Italian name"
          placeholder="Italian name"
          value={nameIt}
          onChange={(e) => setNameIt(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={createCategory.isPending || !name.trim()}>
          {createCategory.isPending ? 'Adding…' : 'Add'}
        </button>
      </form>
      {createCategory.error && (
        <p className="admin-error">
          {createCategory.error instanceof Error ? createCategory.error.message : 'Something went wrong'}
        </p>
      )}
    </div>
  )
}

type SortKey = 'order' | 'name' | 'price' | 'stock' | 'status'

const SORT_COLUMNS: { key: Exclude<SortKey, 'order'>; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Status' },
]

function compareProducts(a: Product, b: Product, key: Exclude<SortKey, 'order'>) {
  const x = a[key]
  const y = b[key]
  return typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))
}

const OPEN_GROUPS_KEY = 'admin-open-groups'

function AdminProductList() {
  const { data: products = [], isLoading } = useProducts()
  const { data: categories = [] } = useCategories()
  const reorderProducts = useReorderProducts()
  const [sortKey, setSortKey] = useState<SortKey>('order')
  const [sortDesc, setSortDesc] = useState(false)
  const [dragged, setDragged] = useState<{ id: string; category: string } | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(OPEN_GROUPS_KEY) ?? '[]')
    } catch {
      return []
    }
  })

  const saveOpenGroups = (next: string[]) => {
    setOpenGroups(next)
    try {
      localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(next))
    } catch {
      // remembering open groups is only a convenience
    }
  }

  const toggleGroup = (slug: string) =>
    saveOpenGroups(openGroups.includes(slug) ? openGroups.filter((s) => s !== slug) : [...openGroups, slug])

  if (isLoading) {
    return <p>Loading products…</p>
  }

  const handleSort = (key: SortKey) => {
    if (key === sortKey && key !== 'order') {
      setSortDesc(!sortDesc)
    } else {
      setSortKey(key)
      setSortDesc(false)
    }
  }

  // Categories in admin order, plus any unknown ones products still reference
  const groupSlugs = [
    ...categories.map((c) => c.slug),
    ...new Set(products.map((p) => p.category).filter((slug) => !categories.some((c) => c.slug === slug))),
  ]
  const groups = groupSlugs
    .map((slug) => {
      const items = products.filter((product) => product.category === slug)
      if (sortKey !== 'order') {
        items.sort((a, b) => compareProducts(a, b, sortKey) * (sortDesc ? -1 : 1))
      }
      return { slug, name: categories.find((c) => c.slug === slug)?.name ?? slug, items }
    })
    .filter((group) => group.items.length > 0)

  // Moves a product within its category, keeping the slots that category occupies in the overall order
  const moveWithinGroup = (groupItems: Product[], from: number, to: number) => {
    if (from === to) return
    const reordered = [...groupItems]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)

    const groupIds = new Set(groupItems.map((product) => product.id))
    const next = [...products]
    let i = 0
    next.forEach((product, slot) => {
      if (groupIds.has(product.id)) next[slot] = reordered[i++]
    })
    reorderProducts.mutate(next.map((product) => product.id))
  }

  const canReorder = sortKey === 'order'
  const allOpen = groups.length > 0 && groups.every((group) => openGroups.includes(group.slug))

  return (
    <div className="admin-product-list">
      <div className="admin-list-toolbar">
        <button
          className={`btn-secondary ${sortKey === 'order' ? 'active' : ''}`}
          onClick={() => handleSort('order')}
        >
          Shop order
        </button>
        <button
          className="btn-secondary"
          onClick={() => saveOpenGroups(allOpen ? [] : groups.map((group) => group.slug))}
        >
          {allOpen ? 'Close all' : 'Open all'}
        </button>
        <span>
          {canReorder ? 'Drag rows or use ▲▼ to change the order on the site.' : 'Switch to Shop order to rearrange.'}
        </span>
      </div>
      {reorderProducts.isError && (
        <p className="admin-error">
          {reorderProducts.error instanceof Error ? reorderProducts.error.message : 'Failed to save order'}
        </p>
      )}
      <table>
        <thead>
          <tr>
            <th aria-label="Reorder" />
            {SORT_COLUMNS.slice(0, 1).map(({ key, label }) => (
              <th key={key}>
                <button className="admin-sort-btn" onClick={() => handleSort(key)}>
                  {label} {sortKey === key && (sortDesc ? '↓' : '↑')}
                </button>
              </th>
            ))}
            <th>Category</th>
            {SORT_COLUMNS.slice(1).map(({ key, label }) => (
              <th key={key}>
                <button className="admin-sort-btn" onClick={() => handleSort(key)}>
                  {label} {sortKey === key && (sortDesc ? '↓' : '↑')}
                </button>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.slug}>
            <tr className="admin-group-row">
              <td colSpan={7}>
                <button
                  className="admin-group-toggle"
                  aria-expanded={openGroups.includes(group.slug)}
                  onClick={() => toggleGroup(group.slug)}
                >
                  <span className="admin-group-chevron" aria-hidden="true">▸</span>
                  {group.name} <span className="admin-category-count">({group.items.length})</span>
                </button>
              </td>
            </tr>
            {openGroups.includes(group.slug) && group.items.map((product, index) => (
              <AdminProductRow
                key={product.id}
                product={product}
                reorder={
                  canReorder
                    ? {
                        onMoveUp: index > 0 ? () => moveWithinGroup(group.items, index, index - 1) : undefined,
                        onMoveDown:
                          index < group.items.length - 1
                            ? () => moveWithinGroup(group.items, index, index + 1)
                            : undefined,
                        rowProps: {
                          draggable: true,
                          className: [
                            dragged?.id === product.id ? 'admin-row-dragging' : '',
                            dropTargetId === product.id ? 'admin-row-drop-target' : '',
                          ].join(' '),
                          onDragStart: (e) => {
                            e.dataTransfer.effectAllowed = 'move'
                            setDragged({ id: product.id, category: group.slug })
                          },
                          onDragOver: (e) => {
                            if (dragged?.category !== group.slug) return
                            e.preventDefault()
                            setDropTargetId(product.id)
                          },
                          onDrop: (e) => {
                            e.preventDefault()
                            if (dragged?.category === group.slug) {
                              const from = group.items.findIndex((p) => p.id === dragged.id)
                              if (from >= 0) moveWithinGroup(group.items, from, index)
                            }
                            setDragged(null)
                            setDropTargetId(null)
                          },
                          onDragEnd: () => {
                            setDragged(null)
                            setDropTargetId(null)
                          },
                        },
                      }
                    : undefined
                }
              />
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

function AdminAddProductForm() {
  const createProduct = useCreateProduct()
  const uploadImage = useUploadImage()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { category: '' },
  })

  const primaryImage = watch('image')
  const primaryFileRef = useRef<HTMLInputElement>(null)
  const additionalFilesRef = useRef<HTMLInputElement>(null)

  const handlePrimaryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const { url } = await uploadImage.mutateAsync(file)
      setValue('image', url, { shouldValidate: true })
    } catch {
      // surfaced through uploadImage.isError
    }
  }

  const handleAdditionalFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage.mutateAsync(file)))
      const existing = (getValues('additionalImages') ?? '').trim()
      const added = uploaded.map(({ url }) => url).join('\n')
      setValue('additionalImages', existing ? `${existing}\n${added}` : added)
    } catch {
      // surfaced through uploadImage.isError
    }
  }

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
        descriptionIt: values.descriptionIt?.trim() ?? '',
        details: values.details?.trim() ?? '',
        detailsIt: values.detailsIt?.trim() ?? '',
        dimensions: values.dimensions?.trim() ?? '',
        dimensionsIt: values.dimensionsIt?.trim() ?? '',
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
        Description (English)
        <textarea rows={4} {...register('description')} />
        {errors.description && <span className="admin-field-error">{errors.description.message}</span>}
      </label>

      <label>
        Description (Italian, optional)
        <textarea rows={4} placeholder="Leave empty to show the English description" {...register('descriptionIt')} />
      </label>

      <fieldset className="admin-list-fields">
        <legend>Details <span>(one per line, optional)</span></legend>
        <label>
          English
          <textarea rows={4} placeholder={'Calf leather\nGold-tone hardware\nMade in Florence'} {...register('details')} />
        </label>
        <label>
          Italian
          <textarea rows={4} placeholder={'Pelle di vitello\nMinuteria dorata\nRealizzata a Firenze'} {...register('detailsIt')} />
        </label>
      </fieldset>

      <fieldset className="admin-list-fields">
        <legend>Dimensions <span>(one per line, optional)</span></legend>
        <label>
          English
          <textarea rows={3} placeholder={'Width: 30 cm\nHeight: 22 cm\nDepth: 10 cm'} {...register('dimensions')} />
        </label>
        <label>
          Italian
          <textarea rows={3} placeholder={'Larghezza: 30 cm\nAltezza: 22 cm\nProfondità: 10 cm'} {...register('dimensionsIt')} />
        </label>
      </fieldset>

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
            <option value="" disabled>Choose…</option>
            <CategoryOptions />
          </select>
          {errors.category && <span className="admin-field-error">{errors.category.message}</span>}
        </label>
      </div>

      <label>
        Primary Image
        <div className="admin-image-input">
          <input type="text" placeholder="https://… or choose a file" {...register('image')} />
          <button type="button" className="btn-secondary" onClick={() => primaryFileRef.current?.click()}>
            Choose File
          </button>
          <input ref={primaryFileRef} type="file" accept="image/*" onChange={handlePrimaryFile} hidden />
        </div>
        {primaryImage && <img className="admin-image-preview" src={primaryImage} alt="" />}
        {errors.image && <span className="admin-field-error">{errors.image.message}</span>}
      </label>

      <label>
        Additional Images (one URL per line, optional)
        <textarea rows={3} {...register('additionalImages')} />
        <button type="button" className="btn-secondary" onClick={() => additionalFilesRef.current?.click()}>
          Choose Files
        </button>
        <input ref={additionalFilesRef} type="file" accept="image/*" multiple onChange={handleAdditionalFiles} hidden />
      </label>

      {uploadImage.isPending && <p>Uploading image…</p>}
      {uploadImage.isError && (
        <p className="admin-error">{uploadImage.error instanceof Error ? uploadImage.error.message : 'Upload failed'}</p>
      )}

      {createProduct.isError && (
        <p className="admin-error">{createProduct.error instanceof Error ? createProduct.error.message : 'Failed to add product'}</p>
      )}
      {successMessage && <p className="admin-success">{successMessage}</p>}

      <button type="submit" className="btn-primary" disabled={createProduct.isPending || uploadImage.isPending}>
        {createProduct.isPending ? 'Adding…' : 'Add Product'}
      </button>
    </form>
  )
}

const HOME_SECTION_LABELS: { section: HomeSection; title: string; hint: string }[] = [
  { section: 'newArrivals', title: 'New arrivals', hint: 'The first one gets the "New" badge.' },
  { section: 'inEvidence', title: 'In evidence', hint: '' },
]

function AdminHomeSections() {
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()
  const { data: sections } = useHomeSections()
  const saveSection = useSaveHomeSection()

  const save = (section: HomeSection, ids: string[]) => saveSection.mutate({ section, ids })

  return (
    <div className="admin-home-sections">
      <h2>Homepage</h2>
      <p className="admin-home-hint">
        Pick the products shown in the two homepage sections. Inactive products are skipped on the site; an empty
        list shows the first products in shop order.
      </p>

      {HOME_SECTION_LABELS.map(({ section, title, hint }) => {
        const ids = sections?.[section] ?? []
        const chosen = ids
          .map((id) => products.find((product) => product.id === id))
          .filter((product): product is Product => Boolean(product))
        const available = products.filter((product) => !ids.includes(product.id))

        const move = (from: number, to: number) => {
          const next = [...ids]
          const [moved] = next.splice(from, 1)
          next.splice(to, 0, moved)
          save(section, next)
        }

        return (
          <div key={section} className="admin-home-section">
            <h3>
              {title} <span className="admin-category-count">({chosen.length})</span>
            </h3>
            {hint && <p className="admin-home-hint">{hint}</p>}

            {chosen.length > 0 ? (
              <ol>
                {chosen.map((product, index) => (
                  <li key={product.id}>
                    <img src={product.image} alt="" />
                    <span className="admin-home-name">
                      {product.name}
                      {product.status === 'inactive' && <span className="admin-home-inactive">inactive</span>}
                    </span>
                    <span className="admin-home-actions">
                      <button
                        className="admin-move-btn"
                        onClick={() => move(index, index - 1)}
                        disabled={index === 0 || saveSection.isPending}
                        aria-label={`Move ${product.name} up`}
                      >
                        ▲
                      </button>
                      <button
                        className="admin-move-btn"
                        onClick={() => move(index, index + 1)}
                        disabled={index === chosen.length - 1 || saveSection.isPending}
                        aria-label={`Move ${product.name} down`}
                      >
                        ▼
                      </button>
                      <button
                        className="admin-move-btn"
                        onClick={() => save(section, ids.filter((id) => id !== product.id))}
                        disabled={saveSection.isPending}
                        aria-label={`Remove ${product.name} from ${title}`}
                      >
                        ✕
                      </button>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="admin-home-empty">Nothing picked yet, so the site picks automatically.</p>
            )}

            <select
              aria-label={`Add a product to ${title}`}
              value=""
              onChange={(e) => e.target.value && save(section, [...ids, e.target.value])}
              disabled={saveSection.isPending || available.length === 0}
            >
              <option value="">+ Add a product…</option>
              {categories.map((category) => {
                const options = available.filter((product) => product.category === category.slug)
                if (options.length === 0) return null
                return (
                  <optgroup key={category.slug} label={category.name}>
                    {options.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                        {product.status === 'inactive' ? ' (inactive)' : ''}
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </div>
        )
      })}

      {saveSection.isError && (
        <p className="admin-error">
          {saveSection.error instanceof Error ? saveSection.error.message : 'Failed to save'}
        </p>
      )}
    </div>
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
            <div className="admin-side">
              <AdminAddProductForm />
              <AdminHomeSections />
            </div>
            <div className="admin-side">
              <AdminCategoryManager />
              <AdminProductList />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
