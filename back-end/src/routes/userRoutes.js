// User routes for authentication and user management
import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  refreshToken,
  getAllUsers,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();


// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);
router.put('/deactivate', authenticateToken, deactivateAccount);

// Admin routes
router.get('/all', authenticateToken, requireAdmin, getAllUsers);

export default router;
