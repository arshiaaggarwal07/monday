// backend/src/routes/auth.routes.ts

import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.post  ('/register', AuthController.register)
router.post  ('/login',    AuthController.login)
router.post  ('/refresh',  AuthController.refresh)
router.post  ('/logout',   AuthController.logout)
router.get   ('/me',       requireAuth, AuthController.getMe)
router.put   ('/profile',  requireAuth, AuthController.updateProfile)
router.put   ('/password', requireAuth, AuthController.updatePassword)
router.delete('/account',  requireAuth, AuthController.deleteAccount)

export default router