import express from 'express';
import { getDatabase } from '../database/init.js';

const router = express.Router();

// Buscar mídias
router.get('/', async (req, res) => {
  try {
    const { q, type, category, date_from, date_to, size_min, size_max, page = 1, limit = 50 } = req.query;
    const db = getDatabase();
    const userId = req.user.id;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Termo de busca deve ter pelo menos 2 caracteres',
        code: 'INVALID_SEARCH_TERM'
      });
    }
    
    let query = `
      SELECT * FROM media 
      WHERE user_id = ? AND is_deleted = 0
      AND (
        original_name LIKE ? OR 
        category LIKE ? OR
        mime_type LIKE ?
      )
    `;
    
    const params = [userId, `%${q}%`, `%${q}%`, `%${q}%`];
    
    // Filtros adicionais
    if (type) {
      query += ' AND file_type = ?';
      params.push(type);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (date_from) {
      query += ' AND created_at >= ?';
      params.push(date_from);
    }
    
    if (date_to) {
      query += ' AND created_at <= ?';
      params.push(date_to);
    }
    
    if (size_min) {
      query += ' AND file_size >= ?';
      params.push(parseInt(size_min));
    }
    
    if (size_max) {
      query += ' AND file_size <= ?';
      params.push(parseInt(size_max));
    }
    
    // Ordenação e paginação
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const results = await db.all(query, params);
    
    // Contar total de resultados
    let countQuery = `
      SELECT COUNT(*) as total FROM media 
      WHERE user_id = ? AND is_deleted = 0
      AND (
        original_name LIKE ? OR 
        category LIKE ? OR
        mime_type LIKE ?
      )
    `;
    
    const countParams = [userId, `%${q}%`, `%${q}%`, `%${q}%`];
    
    if (type) {
      countQuery += ' AND file_type = ?';
      countParams.push(type);
    }
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    if (date_from) {
      countQuery += ' AND created_at >= ?';
      countParams.push(date_from);
    }
    
    if (date_to) {
      countQuery += ' AND created_at <= ?';
      countParams.push(date_to);
    }
    
    if (size_min) {
      countQuery += ' AND file_size >= ?';
      countParams.push(parseInt(size_min));
    }
    
    if (size_max) {
      countQuery += ' AND file_size <= ?';
      countParams.push(parseInt(size_max));
    }
    
    const { total } = await db.get(countQuery, countParams);
    
    res.json({
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      query: {
        term: q,
        filters: {
          type,
          category,
          date_from,
          date_to,
          size_min,
          size_max
        }
      }
    });
    
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Busca avançada
router.post('/advanced', async (req, res) => {
  try {
    const { 
      query, 
      filters = {}, 
      sort = { field: 'created_at', order: 'DESC' },
      pagination = { page: 1, limit: 50 }
    } = req.body;
    
    const db = getDatabase();
    const userId = req.user.id;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Termo de busca deve ter pelo menos 2 caracteres',
        code: 'INVALID_SEARCH_TERM'
      });
    }
    
    let sqlQuery = `
      SELECT * FROM media 
      WHERE user_id = ? AND is_deleted = 0
      AND (
        original_name LIKE ? OR 
        category LIKE ? OR
        mime_type LIKE ?
      )
    `;
    
    const params = [userId, `%${query}%`, `%${query}%`, `%${query}%`];
    
    // Aplicar filtros
    if (filters.type) {
      sqlQuery += ' AND file_type = ?';
      params.push(filters.type);
    }
    
    if (filters.category) {
      sqlQuery += ' AND category = ?';
      params.push(filters.category);
    }
    
    if (filters.date_from) {
      sqlQuery += ' AND created_at >= ?';
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      sqlQuery += ' AND created_at <= ?';
      params.push(filters.date_to);
    }
    
    if (filters.size_min) {
      sqlQuery += ' AND file_size >= ?';
      params.push(parseInt(filters.size_min));
    }
    
    if (filters.size_max) {
      sqlQuery += ' AND file_size <= ?';
      params.push(parseInt(filters.size_max));
    }
    
    if (filters.is_favorite !== undefined) {
      sqlQuery += ' AND is_favorite = ?';
      params.push(filters.is_favorite ? 1 : 0);
    }
    
    if (filters.is_shared !== undefined) {
      sqlQuery += ' AND is_shared = ?';
      params.push(filters.is_shared ? 1 : 0);
    }
    
    // Ordenação
    const validSortFields = ['created_at', 'original_name', 'file_size', 'file_type'];
    const sortField = validSortFields.includes(sort.field) ? sort.field : 'created_at';
    const sortOrder = sort.order === 'ASC' ? 'ASC' : 'DESC';
    
    sqlQuery += ` ORDER BY ${sortField} ${sortOrder}`;
    
    // Paginação
    const limit = Math.min(parseInt(pagination.limit) || 50, 100);
    const offset = ((parseInt(pagination.page) || 1) - 1) * limit;
    
    sqlQuery += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const results = await db.all(sqlQuery, params);
    
    // Contar total
    let countQuery = sqlQuery.replace('SELECT *', 'SELECT COUNT(*) as total').replace('ORDER BY ' + sortField + ' ' + sortOrder, '').replace('LIMIT ? OFFSET ?', '');
    const countParams = params.slice(0, -2); // Remove limit e offset
    
    const { total } = await db.get(countQuery, countParams);
    
    res.json({
      results,
      pagination: {
        page: parseInt(pagination.page) || 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      sort: {
        field: sortField,
        order: sortOrder
      },
      filters
    });
    
  } catch (error) {
    console.error('Erro na busca avançada:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Sugestões de busca
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    const db = getDatabase();
    const userId = req.user.id;
    
    if (!q || q.trim().length < 1) {
      return res.json({
        suggestions: []
      });
    }
    
    // Sugestões de nomes de arquivos
    const fileSuggestions = await db.all(`
      SELECT DISTINCT original_name
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      AND original_name LIKE ?
      ORDER BY original_name
      LIMIT 5
    `, [userId, `%${q}%`]);
    
    // Sugestões de categorias
    const categorySuggestions = await db.all(`
      SELECT DISTINCT category
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      AND category LIKE ?
      ORDER BY category
      LIMIT 5
    `, [userId, `%${q}%`]);
    
    // Sugestões de tipos de arquivo
    const typeSuggestions = await db.all(`
      SELECT DISTINCT file_type
      FROM media 
      WHERE user_id = ? AND is_deleted = 0
      AND file_type LIKE ?
      ORDER BY file_type
      LIMIT 5
    `, [userId, `%${q}%`]);
    
    res.json({
      suggestions: {
        files: fileSuggestions.map(item => item.original_name),
        categories: categorySuggestions.map(item => item.category),
        types: typeSuggestions.map(item => item.file_type)
      }
    });
    
  } catch (error) {
    console.error('Erro ao obter sugestões:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;


