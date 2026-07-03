// frontend/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ProtectedRoute    from './components/layout/ProtectedRoute'
import Landing   from './pages/Landing'
import Auth      from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Settings  from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/"          element={<Landing />} />
            <Route path="/auth"      element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}