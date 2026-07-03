// frontend/src/components/layout/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', color: '#444'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}