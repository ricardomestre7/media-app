import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../database/init.js';

const router = express.Router();

// Obter perfil do usuário
router.get('/profile', async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    
    const user = await db.get(
      'SELECT id, email, name, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json(user);
    
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Atualizar perfil do usuário
router.put('/profile', [
  body('name').optional().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }
    
    const { name, email, avatar } = req.body;
    const db = getDatabase();
    const userId = req.user.id;
    
    // Verificar se email já existe (se estiver sendo alterado)
    if (email) {
      const existingUser = await db.get(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      
      if (existingUser) {
        return res.status(409).json({
          error: 'Email já está em uso',
          code: 'EMAIL_IN_USE'
        });
      }
    }
    
    // Atualizar usuário
    const updateFields = [];
    const updateValues = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (avatar !== undefined) {
      updateFields.push('avatar = ?');
      updateValues.push(avatar);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'Nenhum campo para atualizar',
        code: 'NO_FIELDS_TO_UPDATE'
      });
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(userId);
    
    await db.run(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Buscar usuário atualizado
    const updatedUser = await db.get(
      'SELECT id, email, name, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Alterar senha
router.put('/password', [
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }
    
    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();
    const userId = req.user.id;
    
    // Buscar usuário atual
    const user = await db.get(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Verificar senha atual
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({
        error: 'Senha atual incorreta',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }
    
    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualizar senha
    await db.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId]
    );
    
    res.json({
      message: 'Senha alterada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Deletar conta
router.delete('/account', async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    
    // Marcar todas as mídias como deletadas
    await db.run(
      'UPDATE media SET is_deleted = 1 WHERE user_id = ?',
      [userId]
    );
    
    // Deletar compartilhamentos
    await db.run(
      'DELETE FROM shares WHERE user_id = ?',
      [userId]
    );
    
    // Deletar usuário
    await db.run(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );
    
    res.json({
      message: 'Conta deletada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;

