import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter as Router } from 'react-router-dom'; 
import App from '@/App'; 
import { AuthProvider } from '@/contexts/AuthContext'; 
import '@/index.css'; 

console.log('main.jsx: Iniciando aplicação...');
console.log('main.jsx: React:', React);
console.log('main.jsx: ReactDOM:', ReactDOM);
console.log('main.jsx: App:', App);
console.log('main.jsx: AuthProvider:', AuthProvider);

const rootElement = document.getElementById('root');
console.log('main.jsx: Root element:', rootElement);

if (!rootElement) {
  console.error('main.jsx: Elemento root não encontrado!');
} else {
  console.log('main.jsx: Criando root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('main.jsx: Root criado:', root);
  
  console.log('main.jsx: Renderizando aplicação...');
  root.render( 
    <React.StrictMode> 
      <Router> 
        <AuthProvider> 
          <App /> 
        </AuthProvider> 
      </Router> 
    </React.StrictMode> 
  );
  console.log('main.jsx: Aplicação renderizada!');
}
