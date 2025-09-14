import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init.js';
import { config } from '../config.js';
import { createReadStream, statSync } from 'fs';

const router = express.Router();

// Configuração do multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath + '/media');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (config.allowedFileTypes.includes(file.mimetype) || config.allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

// Listar mídias do usuário
router.get('/', async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 50 } = req.query;
    const db = getDatabase();
    const userId = req.user.id;
    
    let query = 'SELECT * FROM media WHERE user_id = ? AND is_deleted = 0';
    const params = [userId];
    
    // Filtros
    if (type) {
      query += ' AND file_type = ?';
      params.push(type);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (original_name LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Ordenação e paginação
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const media = await db.all(query, params);
    
    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM media WHERE user_id = ? AND is_deleted = 0';
    const countParams = [userId];
    
    if (type) {
      countQuery += ' AND file_type = ?';
      countParams.push(type);
    }
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (original_name LIKE ? OR category LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    const { total } = await db.get(countQuery, countParams);
    
    res.json({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar mídias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Upload de mídias
router.post('/upload', upload.array('file', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'Nenhum arquivo enviado',
        code: 'NO_FILES'
      });
    }
    
    const db = getDatabase();
    const userId = req.user.id;
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const fileType = file.mimetype.split('/')[0];
      const fileSize = file.size;
      const filePath = file.path;
      const originalName = file.originalname;
      const filename = file.filename;
      
      // Gerar thumbnail para imagens
      let thumbnailPath = null;
      if (fileType === 'image') {
        try {
          const thumbnailName = 'thumb_' + filename;
          thumbnailPath = path.join(config.uploadPath, 'thumbnails', thumbnailName);
          
          await sharp(filePath)
            .resize(config.thumbnailWidth, config.thumbnailHeight, { fit: 'inside' })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
        } catch (error) {
          console.error('Erro ao gerar thumbnail:', error);
        }
      }
      
      // Salvar no banco
      const result = await db.run(`
        INSERT INTO media (
          user_id, filename, original_name, file_path, thumbnail_path,
          file_size, mime_type, file_type, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, filename, originalName, filePath, thumbnailPath,
        fileSize, file.mimetype, fileType, 'Uploads'
      ]);
      
      uploadedFiles.push({
        id: result.lastID,
        filename,
        originalName,
        fileSize,
        mimeType: file.mimetype,
        fileType,
        category: 'Uploads',
        thumbnail: !!thumbnailPath
      });
    }
    
    res.json({
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`,
      files: uploadedFiles
    });
    
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Obter mídia por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    res.json(media);
    
  } catch (error) {
    console.error('Erro ao obter mídia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Download de mídia
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    const filePath = media.file_path;
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        error: 'Arquivo não encontrado no servidor',
        code: 'FILE_NOT_FOUND'
      });
    }
    
    res.download(filePath, media.original_name);
    
  } catch (error) {
    console.error('Erro no download:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Thumbnail de mídia
router.get('/:id/thumbnail', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    if (!media.thumbnail_path || !await fs.pathExists(media.thumbnail_path)) {
      return res.status(404).json({
        error: 'Thumbnail não encontrado',
        code: 'THUMBNAIL_NOT_FOUND'
      });
    }
    
    res.sendFile(path.resolve(media.thumbnail_path));
    
  } catch (error) {
    console.error('Erro ao obter thumbnail:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Preview de mídia
router.get('/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    const filePath = media.file_path;
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        error: 'Arquivo não encontrado no servidor',
        code: 'FILE_NOT_FOUND'
      });
    }
    
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    console.error('Erro ao obter preview:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Streaming de mídia (vídeo/áudio)
router.get('/:id/stream', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    const filePath = media.file_path;
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        error: 'Arquivo não encontrado no servidor',
        code: 'FILE_NOT_FOUND'
      });
    }
    
    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      // Streaming com range support para vídeos grandes
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': media.mime_type,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Streaming completo
      const head = {
        'Content-Length': fileSize,
        'Content-Type': media.mime_type,
      };
      res.writeHead(200, head);
      createReadStream(filePath).pipe(res);
    }
    
  } catch (error) {
    console.error('Erro no streaming:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Atualizar mídia
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, is_favorite } = req.body;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    await db.run(
      'UPDATE media SET category = ?, is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [category || media.category, is_favorite !== undefined ? is_favorite : media.is_favorite, id]
    );
    
    res.json({
      message: 'Mídia atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar mídia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Deletar mídia (mover para lixeira)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    await db.run(
      'UPDATE media SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    res.json({
      message: 'Mídia movida para a lixeira'
    });
    
  } catch (error) {
    console.error('Erro ao deletar mídia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Compartilhar mídia
router.post('/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const { expires_at, password } = req.body;
    const db = getDatabase();
    const userId = req.user.id;
    
    const media = await db.get(
      'SELECT * FROM media WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Mídia não encontrada',
        code: 'MEDIA_NOT_FOUND'
      });
    }
    
    const shareToken = uuidv4();
    
    await db.run(`
      INSERT INTO shares (media_id, user_id, share_token, expires_at, password)
      VALUES (?, ?, ?, ?, ?)
    `, [id, userId, shareToken, expires_at, password]);
    
    const shareUrl = `${req.protocol}://${req.get('host')}/api/media/share/${shareToken}`;
    
    res.json({
      message: 'Link de compartilhamento criado',
      shareUrl,
      shareToken
    });
    
  } catch (error) {
    console.error('Erro ao compartilhar mídia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
