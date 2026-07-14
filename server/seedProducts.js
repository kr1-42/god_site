const PRODUCT_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const BAG_PHOTOS = [
  '/attachments/fotoborse/BDB15FAC-1B08-4657-9C82-C5E0D4E1BC52.png',
  '/attachments/fotoborse/9155029A-8BAC-4D24-A482-BF475BCA703B.png',
  '/attachments/fotoborse/AA8C6968-A39E-494C-9045-94ADA8293789.png',
  '/attachments/fotoborse/DFBDD7DF-0EBB-4C6C-A8B9-ED6ABDC64246.png',
  '/attachments/fotoborse/BAEE4ED9-57B0-431C-9FDA-622FEB6A35EB.png',
  '/attachments/fotoborse/IMG_7470E715-BC86-4175-8616-E8166AA5A694.jpeg',
  '/attachments/fotoborse/IMG_EE100D22-7E17-4A10-A0EC-4CE4078838BE.jpeg',
  '/attachments/fotoborse/IMG_E490413A-185D-41D8-8D46-DE6A0F3D0DD8.jpeg',
  '/attachments/fotoborse/44447BE9-FC05-4258-8ABF-33755801C4C1.png',
  '/attachments/fotoborse/IMG_310CE425-5067-4D87-863D-AB59DF72AFDF.jpeg',
  '/attachments/fotoborse/ECF1341E-D197-466B-9779-35BBF9B58C9C.png',
  '/attachments/fotoborse/D74D3A51-230A-40B9-A258-8C0C8F760156.png',
  '/attachments/fotoborse/E458486B-A506-4DE5-BF96-8CEB757BE9E7.png',
  '/attachments/fotoborse/FF366163-D605-43B2-9897-CE5F4245E3D5.png',
  '/attachments/fotoborse/619B774B-ADEA-4DF2-9637-6117E5AE9746.png',
]

const BAG_PRODUCT_GROUPS = [
  { id: '1', name: 'Bag Photo 01', imageIndexes: [0, 10], price: 1450, stock: 5 },
  { id: '2', name: 'Bag Photo 02', imageIndexes: [1, 2, 9], price: 1525, stock: 4 },
  { id: '3', name: 'Bag Photo 04', imageIndexes: [3, 4], price: 1600, stock: 6 },
  { id: '4', name: 'Bag Photo 06', imageIndexes: [5, 6, 7], price: 1675, stock: 3 },
  { id: '5', name: 'Bag Photo 12', imageIndexes: [11, 12], price: 1750, stock: 4 },
  { id: '6', name: 'Bag Photo 14', imageIndexes: [13, 14], price: 1825, stock: 5 },
]

const bagProducts = BAG_PRODUCT_GROUPS.map((group) => {
  const images = group.imageIndexes.map((index) => BAG_PHOTOS[index])
  return {
    id: group.id,
    name: group.name,
    description: PRODUCT_DESCRIPTION,
    price: group.price,
    image: images[0],
    images,
    stock: group.stock,
    category: 'bags',
  }
})

const dogProducts = [
  {
    id: 'dog-1',
    name: 'Dog Carry Tote',
    description: PRODUCT_DESCRIPTION,
    price: 320,
    image: '/attachments/prod1.jpg',
    images: [],
    stock: 6,
    category: 'dogs',
  },
  {
    id: 'dog-2',
    name: 'Dog Travel Pack',
    description: PRODUCT_DESCRIPTION,
    price: 285,
    image: '/attachments/prod2.jpg',
    images: [],
    stock: 4,
    category: 'dogs',
  },
  {
    id: 'dog-3',
    name: 'Dog Walk Satchel',
    description: PRODUCT_DESCRIPTION,
    price: 245,
    image: '/attachments/prod3.jpg',
    images: [],
    stock: 5,
    category: 'dogs',
  },
]

export const SEED_PRODUCTS = [...bagProducts, ...dogProducts]
