import { Navigate } from 'react-router-dom'

export default function DogsPage() {
  return <Navigate to="/catalog?category=dogs" replace />
}
