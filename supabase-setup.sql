-- SQL para configurar o banco de dados no Supabase
-- Execute este SQL no SQL Editor do Supabase

-- 1. Criar a tabela media_files
CREATE TABLE media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  google_drive_id TEXT NOT NULL,
  google_drive_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança
-- Política para visualizar arquivos próprios
CREATE POLICY "Users can view own files" ON media_files
  FOR SELECT USING (auth.uid() = user_id);

-- Política para inserir arquivos próprios
CREATE POLICY "Users can insert own files" ON media_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para atualizar arquivos próprios
CREATE POLICY "Users can update own files" ON media_files
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para deletar arquivos próprios
CREATE POLICY "Users can delete own files" ON media_files
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Criar índices para melhor performance
CREATE INDEX idx_media_files_user_id ON media_files(user_id);
CREATE INDEX idx_media_files_created_at ON media_files(created_at DESC);
CREATE INDEX idx_media_files_type ON media_files(type);

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para atualizar updated_at
CREATE TRIGGER update_media_files_updated_at 
    BEFORE UPDATE ON media_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
