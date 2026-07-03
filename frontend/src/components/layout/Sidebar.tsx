// frontend/src/components/layout/Sidebar.tsx

import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { NAV_GROUPS } from '../../config/navigation'
import styles from './Sidebar.module.css'

interface SidebarProps {
  collapsed: boolean
  onToggle:  () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()

  // Active state: compare full href including query params
  function isActive(href: string) {
    const current = location.pathname + location.search
    return current === href || (href === '/dashboard' && location.search === '')
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

      {/* ── Top: logo + collapse toggle ── */}
      <div className={styles.header}>
        {!collapsed && (
          <span className={styles.logo}>Monday</span>
        )}
        <button
          className={styles.toggleBtn}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        {NAV_GROUPS.map(group => (
          <div key={group.title} className={styles.group}>
            {!collapsed && (
              <p className={styles.groupTitle}>{group.title}</p>
            )}
            {group.items.map(item => (
              <button
                key={item.id}
                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                onClick={() => navigate(item.href)}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && (
                  <span className={styles.navLabel}>{item.label}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Bottom: user + settings + logout ── */}
      <div className={styles.footer}>
        <button
            className={`${styles.navItem} ${
                location.pathname === '/settings' ? styles.active : ''
            }`}
            onClick={() => navigate('/settings')}
            title={collapsed ? 'Settings' : undefined}
        >
          <span className={styles.navIcon}>⊙</span>
          {!collapsed && <span className={styles.navLabel}>Settings</span>}
        </button>

        <div className={`${styles.userRow} ${collapsed ? styles.userRowCollapsed : ''}`}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          )}
          {!collapsed && (
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              title="Logout"
            >
              →
            </button>
          )}
        </div>
      </div>

    </aside>
  )
}