// frontend/src/components/layout/DashboardLayout.tsx

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar  from './TopBar'
import styles  from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children:  ReactNode
  onNewTask: () => void
}

export default function DashboardLayout({ children, onNewTask }: DashboardLayoutProps) {
  const [collapsed,      setCollapsed]      = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className={styles.layout}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless mobileOpen */}
      <div className={`${styles.sidebarWrapper} ${mobileOpen ? styles.sidebarVisible : ''}`}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(prev => !prev)}
        />
      </div>

      <div className={styles.main}>
        <TopBar
          onNewTask={onNewTask}
          onMenuToggle={() => setMobileOpen(prev => !prev)}
        />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}