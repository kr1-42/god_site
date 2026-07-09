import { Product } from '../types'
import { BAG_PHOTOS } from './galleryData'

const PRODUCT_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const BAG_PRODUCT_GROUPS = [
  {
    id: '1',
    name: 'Bag Photo 01',
    imageIndexes: [0, 10],
    price: 1450,
    stock: 5,
  },
  {
    id: '2',
    name: 'Bag Photo 02',
    imageIndexes: [1, 2, 9],
    price: 1525,
    stock: 4,
  },
  {
    id: '3',
    name: 'Bag Photo 04',
    imageIndexes: [3, 4],
    price: 1600,
    stock: 6,
  },
  {
    id: '4',
    name: 'Bag Photo 06',
    imageIndexes: [5, 6, 7],
    price: 1675,
    stock: 3,
  },
  {
    id: '5',
    name: 'Bag Photo 12',
    imageIndexes: [11, 12],
    price: 1750,
    stock: 4,
  },
  {
    id: '6',
    name: 'Bag Photo 14',
    imageIndexes: [13, 14],
    price: 1825,
    stock: 5,
  },
]

export const PRODUCTS: Product[] = BAG_PRODUCT_GROUPS.map(group => {
  const images = group.imageIndexes.map(index => BAG_PHOTOS[index].src)

  return {
    id: group.id,
    name: group.name,
    description: PRODUCT_DESCRIPTION,
    price: group.price,
    image: images[0],
    images,
    stock: group.stock,
  }
})

export const DOG_PRODUCTS: Product[] = [
  {
    id: 'dog-1',
    name: 'Dog Carry Tote',
    description: PRODUCT_DESCRIPTION,
    price: 320,
    image: '/attachments/prod1.jpg',
    stock: 6,
  },
  {
    id: 'dog-2',
    name: 'Dog Travel Pack',
    description: PRODUCT_DESCRIPTION,
    price: 285,
    image: '/attachments/prod2.jpg',
    stock: 4,
  },
  {
    id: 'dog-3',
    name: 'Dog Walk Satchel',
    description: PRODUCT_DESCRIPTION,
    price: 245,
    image: '/attachments/prod3.jpg',
    stock: 5,
  },
]

export function getProductById(id: string): Product | undefined {
  return [...PRODUCTS, ...DOG_PRODUCTS].find(p => p.id === id)
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids.map(id => getProductById(id)).filter((p): p is Product => !!p)
}
