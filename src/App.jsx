import React from 'react'

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        Media Center - Teste
      </h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '10px' }}>
        Se você está vendo isso, a aplicação está funcionando!
      </p>
      <p style={{ color: '#888', fontSize: '14px' }}>
        URL: {window.location.href}
      </p>
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2563eb', marginBottom: '15px' }}>
          🎉 Aplicação Funcionando!
        </h2>
        <p style={{ color: '#666' }}>
          A interface está carregando corretamente.
        </p>
      </div>
    </div>
  )
}

export default App