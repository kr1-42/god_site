import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Pages
import HomePage from './pages/Home'
import CatalogPage from './pages/Catalog'
import DogsPage from './pages/Dogs'
import ProductPage from './pages/Product'
import CartPage from './pages/Cart'
import CheckoutPage from './pages/checkout'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dogs" element={<DogsPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
