import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ProductCard from './ProductCard'
import { useUpdateProduct, useUploadImage } from '../services/products'
import { useCategories } from '../services/categories'
import { toListItems } from '../stores/languageStore'
import { Product } from '../types'
import './ProductEditModal.css'

function initialImages(product: Product) {
  const rest = (product.images ?? []).filter((url) => url !== product.image)
  return [product.image, ...rest].filter(Boolean)
}

function isImageUrl(value: string) {
  if (/^\/(?!\/)\S*$/.test(value) && !value.includes('..')) return true
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export default function ProductEditModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const updateProduct = useUpdateProduct()
  const uploadImage = useUploadImage()
  const { data: categories = [] } = useCategories()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [descriptionIt, setDescriptionIt] = useState(product.descriptionIt ?? '')
  const [lists, setLists] = useState({
    details: product.details ?? '',
    detailsIt: product.detailsIt ?? '',
    dimensions: product.dimensions ?? '',
    dimensionsIt: product.dimensionsIt ?? '',
  })
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'it'>('en')
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stock))
  const [category, setCategory] = useState(product.category)
  const [status, setStatus] = useState(product.status)
  const [images, setImages] = useState(() => initialImages(product))
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Close on Escape and keep the page behind from scrolling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const moveImage = (from: number, to: number) => {
    setImages((current) => {
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const removeImage = (index: number) => setImages((current) => current.filter((_, i) => i !== index))

  const addUrl = () => {
    const url = newUrl.trim()
    if (!isImageUrl(url)) {
      setError('Enter a valid image URL')
      return
    }
    setError(null)
    setImages((current) => (current.includes(url) ? current : [...current, url]))
    setNewUrl('')
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage.mutateAsync(file)))
      setImages((current) => [...current, ...uploaded.map(({ url }) => url)])
    } catch {
      // surfaced through uploadImage.isError
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const priceValue = Number(price)
    const stockValue = Number(stock)

    if (!name.trim()) return setError('Name is required')
    if (!description.trim()) return setError('English description is required')
    if (!Number.isFinite(priceValue) || priceValue <= 0) return setError('Price must be greater than 0')
    if (!Number.isInteger(stockValue) || stockValue < 0) return setError('Stock must be a non-negative whole number')
    if (images.length === 0) return setError('Add at least one image')

    setError(null)
    updateProduct.mutate(
      {
        id: product.id,
        name: name.trim(),
        description: description.trim(),
        descriptionIt: descriptionIt.trim(),
        details: lists.details.trim(),
        detailsIt: lists.detailsIt.trim(),
        dimensions: lists.dimensions.trim(),
        dimensionsIt: lists.dimensionsIt.trim(),
        price: priceValue,
        stock: stockValue,
        category,
        status,
        image: images[0],
        images,
      },
      { onSuccess: onClose },
    )
  }

  const previewPrice = Number(price)
  const saveError = error ?? (updateProduct.error instanceof Error ? updateProduct.error.message : null)
  const busy = updateProduct.isPending || uploadImage.isPending

  return createPortal(
    <div className="edit-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title" onSubmit={handleSave}>
        <header className="edit-modal-header">
          <h2 id="edit-modal-title">Edit Product</h2>
          <button type="button" className="edit-modal-close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="edit-modal-body">
          <aside className="edit-modal-preview">
            <div className="edit-modal-preview-label">
              Preview
              <div className="edit-modal-lang-toggle" role="group" aria-label="Preview language">
                {(['en', 'it'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={previewLanguage === lang ? 'active' : undefined}
                    aria-pressed={previewLanguage === lang}
                    onClick={() => setPreviewLanguage(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="edit-modal-preview-card" aria-hidden="true">
              <ProductCard
                id={product.id}
                name={name || 'Product name'}
                price={Number.isFinite(previewPrice) ? previewPrice : 0}
                image={images[0] ?? ''}
                images={images}
              />
            </div>
            <p className="edit-modal-preview-description">
              {previewLanguage === 'it' && descriptionIt.trim() ? descriptionIt : description}
            </p>
            {previewLanguage === 'it' && !descriptionIt.trim() && (
              <p className="edit-modal-preview-note">No Italian description, so the English one is shown</p>
            )}
            {(['details', 'dimensions'] as const).map((field) => {
              const italian = lists[field === 'details' ? 'detailsIt' : 'dimensionsIt']
              const items = toListItems(previewLanguage === 'it' && italian.trim() ? italian : lists[field])
              if (items.length === 0) return null
              const heading = field === 'details'
                ? (previewLanguage === 'it' ? 'Dettagli' : 'Details')
                : (previewLanguage === 'it' ? 'Dimensioni' : 'Dimensions')
              return (
                <div key={field} className="edit-modal-preview-list">
                  <p>{heading}</p>
                  <ul>
                    {items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
            {status === 'inactive' && <p className="edit-modal-preview-note">Hidden from the shop (inactive)</p>}
          </aside>

          <div className="edit-modal-fields">
            <label>
              Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <label>
              Description (English)
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setPreviewLanguage('en')}
              />
            </label>

            <label>
              Description (Italian)
              <textarea
                rows={4}
                value={descriptionIt}
                placeholder="Leave empty to show the English description"
                onChange={(e) => setDescriptionIt(e.target.value)}
                onFocus={() => setPreviewLanguage('it')}
              />
            </label>

            {([
              ['details', 'Details', 'Calf leather\nGold-tone hardware', 'Pelle di vitello\nMinuteria dorata'],
              ['dimensions', 'Dimensions', 'Width: 30 cm\nHeight: 22 cm', 'Larghezza: 30 cm\nAltezza: 22 cm'],
            ] as const).map(([field, label, enPlaceholder, itPlaceholder]) => {
              const itField = field === 'details' ? 'detailsIt' : 'dimensionsIt'
              return (
                <fieldset key={field} className="edit-modal-list-fields">
                  <legend>{label} <span>(one per line)</span></legend>
                  <label>
                    English
                    <textarea
                      rows={3}
                      value={lists[field]}
                      placeholder={enPlaceholder}
                      onChange={(e) => setLists({ ...lists, [field]: e.target.value })}
                      onFocus={() => setPreviewLanguage('en')}
                    />
                  </label>
                  <label>
                    Italian
                    <textarea
                      rows={3}
                      value={lists[itField]}
                      placeholder={itPlaceholder}
                      onChange={(e) => setLists({ ...lists, [itField]: e.target.value })}
                      onFocus={() => setPreviewLanguage('it')}
                    />
                  </label>
                </fieldset>
              )
            })}

            <div className="edit-modal-grid">
              <label>
                Price
                <input type="number" step="0.01" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
              </label>
              <label>
                Stock
                <input type="number" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
              </label>
              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value as Product['status'])}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div className="edit-modal-images">
              <p className="edit-modal-section-label">Images <span>(first one is the primary)</span></p>
              <ul>
                {images.map((url, index) => (
                  <li key={url} className={index === 0 ? 'is-primary' : undefined}>
                    <img src={url} alt="" />
                    {index === 0 && <span className="edit-modal-primary-badge">Primary</span>}
                    <div className="edit-modal-image-actions">
                      {index > 0 && (
                        <button type="button" onClick={() => moveImage(index, 0)} title="Make primary" aria-label="Make primary">★</button>
                      )}
                      {index > 0 && (
                        <button type="button" onClick={() => moveImage(index, index - 1)} title="Move left" aria-label="Move left">←</button>
                      )}
                      {index < images.length - 1 && (
                        <button type="button" onClick={() => moveImage(index, index + 1)} title="Move right" aria-label="Move right">→</button>
                      )}
                      <button type="button" onClick={() => removeImage(index)} title="Remove" aria-label="Remove">✕</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="edit-modal-add-image">
                <input
                  type="text"
                  placeholder="Paste image URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addUrl()
                    }
                  }}
                />
                <button type="button" className="btn-secondary" onClick={addUrl} disabled={!newUrl.trim()}>Add</button>
                <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>Choose Files</button>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} hidden />
              </div>
              {uploadImage.isPending && <p className="edit-modal-hint">Uploading…</p>}
              {uploadImage.isError && (
                <p className="admin-error">{uploadImage.error instanceof Error ? uploadImage.error.message : 'Upload failed'}</p>
              )}
            </div>
          </div>
        </div>

        <footer className="edit-modal-footer">
          {saveError && <p className="admin-error">{saveError}</p>}
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {updateProduct.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </footer>
      </form>
    </div>,
    document.body,
  )
}
