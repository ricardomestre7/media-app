import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { config } from '../config.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

// Inicializar banco de dados
export async function initDatabase() {
  try {
    // Criar diretório do banco se não existir
    const dbDir = path.dirname(config.dbPath);
    await fs.ensureDir(dbDir);

    // Conectar ao banco
    db = await open({
      filename: config.dbPath,
      driver: sqlite3.Database
    });

    // Criar tabelas
    await createTables();
    
    // Inserir usuário padrão se não existir
    await createDefaultUser();
    
    console.log('✅ Banco de dados inicializado com sucesso');
    return db;
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

// Criar tabelas
async function createTables() {
  // Tabela de usuários
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de mídias
  await db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      thumbnail_path TEXT,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      file_type TEXT NOT NULL,
      category TEXT,
      is_favorite BOOLEAN DEFAULT 0,
      is_shared BOOLEAN DEFAULT 0,
      is_deleted BOOLEAN DEFAULT 0,
      share_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Tabela de compartilhamentos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shares (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      media_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      share_token TEXT UNIQUE NOT NULL,
      expires_at DATETIME,
      password TEXT,
      download_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (media_id) REFERENCES media (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Índices para performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_media_user_id ON media(user_id);
    CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);
    CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);
    CREATE INDEX IF NOT EXISTS idx_shares_token ON shares(share_token);
  `);
}

// Criar usuário padrão
async function createDefaultUser() {
  const bcrypt = await import('bcryptjs');
  
  // Verificar se já existe usuário
  const existingUser = await db.get('SELECT id FROM users WHERE email = ?', ['admin@midiaazul.com']);
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    
    await db.run(`
      INSERT INTO users (email, password, name, avatar)
      VALUES (?, ?, ?, ?)
    `, [
      'admin@midiaazul.com',
      hashedPassword,
      'Administrador',
      null
    ]);
    
    console.log('✅ Usuário padrão criado: admin@midiaazul.com / admin123');
  }
}

// Obter instância do banco
export function getDatabase() {
  if (!db) {
    throw new Error('Banco de dados não inicializado');
  }
  return db;
}

// Fechar conexão
export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}
