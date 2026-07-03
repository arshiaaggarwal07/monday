// frontend/src/pages/Settings.tsx

import { useState, useEffect } from 'react'
import { useNavigate }  from 'react-router-dom'
import { useAuth }      from '../contexts/AuthContext'
import { useToast }     from '../contexts/ToastContext'
import { Input }        from '../components/ui/Input'
import Button           from '../components/ui/Button'
import ConfirmModal     from '../components/ui/ConfirmModal'
import DashboardLayout  from '../components/layout/DashboardLayout'
import api              from '../api/client'
import styles           from './Settings.module.css'

export default function Settings() {
  const { user, logout }  = useAuth()
  const toast             = useToast()
  const navigate          = useNavigate()

  const [name,         setName]         = useState(user?.name  ?? '')
  const [email,        setEmail]        = useState(user?.email ?? '')
  const [saving,       setSaving]       = useState(false)

  const [currentPw,   setCurrentPw]    = useState('')
  const [newPw,       setNewPw]        = useState('')
  const [confirmPw,   setConfirmPw]    = useState('')
  const [pwSaving,    setPwSaving]     = useState(false)
  const [pwError,     setPwError]      = useState('')

  const [showDelete,  setShowDelete]   = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email) }
  }, [user])

  async function handleProfileSave() {
    if (!name.trim()) { toast('Name cannot be empty', 'error'); return }
    setSaving(true)
    try {
      await api.put('/auth/profile', { name, email })
      toast('Profile updated')
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange() {
    setPwError('')
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('All password fields are required')
      return
    }
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters')
      return
    }
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match')
      return
    }
    setPwSaving(true)
    try {
      await api.put('/auth/password', { currentPassword: currentPw, newPassword: newPw })
      toast('Password updated')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch {
      setPwError('Current password is incorrect')
    } finally {
      setPwSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    try {
      await api.delete('/auth/account')
      await logout()
      navigate('/')
    } catch {
      toast('Failed to delete account', 'error')
      setDeleteLoading(false)
      setShowDelete(false)
    }
  }

  return (
    <DashboardLayout onNewTask={() => {}}>
      <div className={styles.page}>

        {/* Profile */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <p className={styles.sectionDesc}>Update your name and email address.</p>
          <div className={styles.fields}>
            <Input
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleProfileSave} loading={saving} size="sm">
            Save profile
          </Button>
        </section>

        <div className={styles.divider} />

        {/* Password */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Password</h2>
          <p className={styles.sectionDesc}>Use a strong password you don't use elsewhere.</p>
          <div className={styles.fields}>
            <Input
              label="Current password"
              type="password"
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="New password"
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="At least 8 characters"
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="••••••••"
            />
            {pwError && <p className={styles.error}>{pwError}</p>}
          </div>
          <Button onClick={handlePasswordChange} loading={pwSaving} size="sm">
            Update password
          </Button>
        </section>

        <div className={styles.divider} />

        {/* Danger zone */}
        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} ${styles.danger}`}>Danger zone</h2>
          <p className={styles.sectionDesc}>
            Permanently delete your account and all associated data.
            This cannot be undone.
          </p>
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
            Delete account
          </Button>
        </section>

      </div>

      {showDelete && (
        <ConfirmModal
          title="Delete your account?"
          message="All your tasks, commitments, and data will be permanently erased. This cannot be undone."
          confirmLabel="Delete account"
          danger
          loading={deleteLoading}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </DashboardLayout>
  )
}