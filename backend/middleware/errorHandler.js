// Middleware de tratamento de erros
export const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }

  // Erro de token expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Erro de arquivo muito grande
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Arquivo muito grande',
      code: 'FILE_TOO_LARGE'
    });
  }

  // Erro de tipo de arquivo não permitido
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      error: 'Tipo de arquivo não permitido',
      code: 'INVALID_FILE_TYPE'
    });
  }

  // Erro de banco de dados
  if (err.code === 'SQLITE_ERROR') {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'DATABASE_ERROR'
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    code: err.code || 'INTERNAL_ERROR'
  });
};


