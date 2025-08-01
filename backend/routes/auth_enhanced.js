const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { generateToken, verifyToken } = require('../middleware/auth');

const router = express.Router();

// Security questions list
const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What was your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite food?",
  "What was the model of your first car?",
  "What is your favorite movie?",
  "What street did you grow up on?"
];

// Get security questions
router.get('/security-questions', (req, res) => {
  res.json({
    success: true,
    questions: SECURITY_QUESTIONS
  });
});

// Enhanced register with security question
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('securityQuestion').isIn(SECURITY_QUESTIONS).withMessage('Valid security question is required'),
  body('securityAnswer').trim().isLength({ min: 1 }).withMessage('Security answer is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password and security answer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

    // Create user
    const result = await pool.query(`
      INSERT INTO users (name, email, password, security_question, security_answer) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, is_admin, created_at
    `, [name, email, hashedPassword, securityQuestion, hashedSecurityAnswer]);

    const user = result.rows[0];

    // Log activity
    await pool.query(`
      INSERT INTO user_activity_logs (user_id, action, details, ip_address) 
      VALUES ($1, $2, $3, $4)
    `, [user.id, 'user_registered', { name, email }, req.ip]);

    // Generate token
    const token = generateToken({ 
      userId: user.id, 
      email: user.email,
      isAdmin: user.is_admin 
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        joinedDate: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login with activity logging
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, name, email, password, is_admin, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Log failed login attempt
      await pool.query(`
        INSERT INTO user_activity_logs (user_id, action, details, ip_address) 
        VALUES ($1, $2, $3, $4)
      `, [user.id, 'login_failed', { email }, req.ip]);
      
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Log successful login
    await pool.query(`
      INSERT INTO user_activity_logs (user_id, action, details, ip_address) 
      VALUES ($1, $2, $3, $4)
    `, [user.id, 'login_success', { email }, req.ip]);

    // Generate token
    const token = generateToken({ 
      userId: user.id, 
      email: user.email,
      isAdmin: user.is_admin 
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        joinedDate: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Check if email exists and get security question
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const result = await pool.query(
      'SELECT id, security_question FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      securityQuestion: user.security_question,
      message: 'Please answer your security question to reset password'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error processing forgot password request' });
  }
});

// Verify security answer and generate reset token
router.post('/verify-security-answer', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('securityAnswer').trim().notEmpty().withMessage('Security answer is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, securityAnswer } = req.body;

    const result = await pool.query(
      'SELECT id, security_answer FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Check security answer
    const isValidAnswer = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(), 
      user.security_answer
    );

    if (!isValidAnswer) {
      // Log failed attempt
      await pool.query(`
        INSERT INTO user_activity_logs (user_id, action, details, ip_address) 
        VALUES ($1, $2, $3, $4)
      `, [user.id, 'security_answer_failed', { email }, req.ip]);
      
      return res.status(401).json({ error: 'Incorrect security answer' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store reset token
    await pool.query(`
      INSERT INTO password_reset_tokens (user_id, token, expires_at) 
      VALUES ($1, $2, $3)
    `, [user.id, resetToken, expiresAt]);

    // Log successful verification
    await pool.query(`
      INSERT INTO user_activity_logs (user_id, action, details, ip_address) 
      VALUES ($1, $2, $3, $4)
    `, [user.id, 'security_answer_verified', { email }, req.ip]);

    res.json({
      success: true,
      resetToken,
      expiresIn: 30 * 60 * 1000, // 30 minutes in milliseconds
      message: 'Security answer verified. You can now reset your password.'
    });

  } catch (error) {
    console.error('Verify security answer error:', error);
    res.status(500).json({ error: 'Server error verifying security answer' });
  }
});

// Reset password with token
router.post('/reset-password', [
  body('resetToken').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resetToken, newPassword } = req.body;

    // Find valid reset token
    const tokenResult = await pool.query(`
      SELECT prt.user_id, prt.expires_at, u.email
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = $1 AND prt.used = FALSE AND prt.expires_at > NOW()
    `, [resetToken]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const { user_id, email } = tokenResult.rows[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, user_id]
    );

    // Mark token as used
    await pool.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE token = $1',
      [resetToken]
    );

    // Log password reset
    await pool.query(`
      INSERT INTO user_activity_logs (user_id, action, details, ip_address) 
      VALUES ($1, $2, $3, $4)
    `, [user_id, 'password_reset', { email }, req.ip]);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error resetting password' });
  }
});

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, is_admin, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Enhanced profile update
router.put('/profile', verifyToken, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().trim(),
  body('newPassword').optional().isLength({ min: 6 }),
  body('currentPassword').optional(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, newPassword, currentPassword } = req.body;
    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Handle basic info updates
    if (name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }

    // Handle password change
    if (newPassword && currentPassword) {
      // Verify current password
      const userResult = await pool.query(
        'SELECT password FROM users WHERE id = $1',
        [req.user.id]
      );

      const isValidCurrentPassword = await bcrypt.compare(
        currentPassword, 
        userResult.rows[0].password
      );

      if (!isValidCurrentPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      updates.push(`password = $${paramIndex++}`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.id);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, name, email, phone, is_admin, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    // Log profile update
    await pool.query(`
      INSERT INTO user_activity_logs (user_id, action, details, ip_address) 
      VALUES ($1, $2, $3, $4)
    `, [req.user.id, 'profile_updated', { updatedFields: Object.keys(req.body) }, req.ip]);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

module.exports = router;
