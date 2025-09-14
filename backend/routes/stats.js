import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { getDatabase } from '../database/init.js';
import { config } from '../config.js';

const router = express.Router();

// Estatísticas de armazenamento
router.get('/storage', async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    
    // Calcular espaço usado pelo usuário
    const result = await db.get(`
      SELECT 
        COUNT(*) as file_count,
        SUM(file_size) as used_bytes
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
    `, [userId]);
    
    const usedBytes = result.used_bytes || 0;
    const fileCount = result.file_count || 0;
    
    // Calcular espaço total disponível (1TB = 1,099,511,627,776 bytes)
    const totalBytes = 1099511627776; // 1TB
    const usedPercentage = Math.round((usedBytes / totalBytes) * 100);
    
    // Calcular espaço por tipo de arquivo
    const typeStats = await db.all(`
      SELECT 
        file_type,
        COUNT(*) as count,
        SUM(file_size) as size_bytes
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      GROUP BY file_type
      ORDER BY size_bytes DESC
    `, [userId]);
    
    // Calcular espaço por categoria
    const categoryStats = await db.all(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(file_size) as size_bytes
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      GROUP BY category
      ORDER BY size_bytes DESC
    `, [userId]);
    
    // Calcular arquivos recentes (últimos 30 dias)
    const recentFiles = await db.get(`
      SELECT COUNT(*) as count
      FROM media 
      WHERE user_id = ? AND is_deleted = 0 
      AND created_at >= datetime('now', '-30 days')
    `, [userId]);
    
    // Calcular arquivos favoritos
    const favoriteFiles = await db.get(`
      SELECT COUNT(*) as count
      FROM media 
      WHERE user_id = ? AND is_deleted = 0 AND is_favorite = 1
    `, [userId]);
    
    // Calcular arquivos compartilhados
    const sharedFiles = await db.get(`
      SELECT COUNT(*) as count
      FROM media 
      WHERE user_id = ? AND is_deleted = 0 AND is_shared = 1
    `, [userId]);
    
    res.json({
      storage: {
        used: usedBytes,
        total: totalBytes,
        available: totalBytes - usedBytes,
        percentage: usedPercentage
      },
      files: {
        total: fileCount,
        recent: recentFiles.count,
        favorites: favoriteFiles.count,
        shared: sharedFiles.count
      },
      breakdown: {
        byType: typeStats,
        byCategory: categoryStats
      }
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas de armazenamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Estatísticas de mídia
router.get('/media', async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    
    // Estatísticas gerais
    const generalStats = await db.get(`
      SELECT 
        COUNT(*) as total_files,
        SUM(file_size) as total_size,
        AVG(file_size) as avg_file_size,
        MIN(created_at) as first_upload,
        MAX(created_at) as last_upload
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
    `, [userId]);
    
    // Estatísticas por tipo
    const typeStats = await db.all(`
      SELECT 
        file_type,
        COUNT(*) as count,
        SUM(file_size) as total_size,
        AVG(file_size) as avg_size,
        MIN(file_size) as min_size,
        MAX(file_size) as max_size
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      GROUP BY file_type
      ORDER BY count DESC
    `, [userId]);
    
    // Estatísticas por mês (últimos 12 meses)
    const monthlyStats = await db.all(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count,
        SUM(file_size) as total_size
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      AND created_at >= datetime('now', '-12 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
    `, [userId]);
    
    // Estatísticas por categoria
    const categoryStats = await db.all(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(file_size) as total_size
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      GROUP BY category
      ORDER BY count DESC
    `, [userId]);
    
    // Arquivos maiores
    const largestFiles = await db.all(`
      SELECT 
        id,
        original_name,
        file_type,
        file_size,
        created_at
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      ORDER BY file_size DESC
      LIMIT 10
    `, [userId]);
    
    res.json({
      general: generalStats,
      byType: typeStats,
      byMonth: monthlyStats,
      byCategory: categoryStats,
      largestFiles: largestFiles
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas de mídia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Estatísticas do sistema (apenas para admin)
router.get('/system', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Verificar se é admin (usuário ID 1)
    if (req.user.id !== 1) {
      return res.status(403).json({
        error: 'Acesso negado',
        code: 'ACCESS_DENIED'
      });
    }
    
    // Estatísticas gerais do sistema
    const systemStats = await db.get(`
      SELECT 
        COUNT(DISTINCT user_id) as total_users,
        COUNT(*) as total_files,
        SUM(file_size) as total_storage_used
      FROM media 
      WHERE is_deleted = 0
    `);
    
    // Usuários mais ativos
    const activeUsers = await db.all(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(m.id) as file_count,
        SUM(m.file_size) as storage_used
      FROM users u
      LEFT JOIN media m ON u.id = m.user_id AND m.is_deleted = 0
      GROUP BY u.id, u.name, u.email
      ORDER BY file_count DESC
      LIMIT 10
    `);
    
    // Estatísticas de upload por dia (últimos 30 dias)
    const dailyUploads = await db.all(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as uploads,
        SUM(file_size) as size_uploaded
      FROM media 
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    res.json({
      system: systemStats,
      activeUsers: activeUsers,
      dailyUploads: dailyUploads
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas do sistema:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
