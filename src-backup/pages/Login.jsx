
import React, { useState, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { Loader2, Clapperboard } from 'lucide-react';

const LoginPage = memo(() => {
    const [email, setEmail] = useState('institutodoreikiusuui@gmail.com');
    const [password, setPassword] = useState('teste123');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { handleAuthError, showSuccess } = useErrorHandler();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!email.trim() || !password.trim()) {
            handleAuthError('Email e senha são obrigatórios');
            return;
        }
        
        setIsLoading(true);
        try {
            const result = await login(email.trim(), password);
            if (result.success) {
                showSuccess(
                    "Login bem-sucedido!",
                    "Bem-vindo de volta à sua galeria."
                );
                navigate('/');
            } else {
                handleAuthError(result.error || 'Erro no login');
            }
        } catch (error) {
            handleAuthError(error, 'Erro de Conexão');
        } finally {
            setIsLoading(false);
        }
    }, [email, password, login, navigate, handleAuthError, showSuccess]);

    return (
        <>
            <Helmet>
                <title>Login | MediaHub</title>
                <meta name="description" content="Acesse sua plataforma MediaHub." />
            </Helmet>
            
            {/* Background otimizado */}
            <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
                {/* Padrão de fundo sutil */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}></div>
                </div>
                
                {/* Card de login com animação simples */}
                <div className="relative w-full max-w-md opacity-0 transform translate-y-4 animate-fade-in">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                        <div className="text-center mb-8">
                            {/* Ícone sem animação infinita */}
                            <div className="inline-block mb-4 p-3 bg-blue-500/20 rounded-2xl">
                                <Clapperboard className="h-12 w-12 text-cyan-300" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">MediaHub</h1>
                            <p className="text-blue-200">Acesse sua galeria de mídia profissional</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-blue-200">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-blue-200">
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Entrando...</span>
                                    </>
                                ) : (
                                    <span>Entrar</span>
                                )}
                            </button>
                        </form>
                        
                        <div className="text-center space-y-3 mt-6">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
                            >
                                Esqueci minha senha
                            </Link>
                            <p className="text-xs text-blue-300/70">
                                Entre com suas credenciais do Supabase para acessar a plataforma
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

LoginPage.displayName = 'LoginPage';

export default LoginPage;

