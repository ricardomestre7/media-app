
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Clapperboard } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('demo@midiaap.com');
    const [password, setPassword] = useState('password');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast({
                title: "Login bem-sucedido! 🎉",
                description: "Bem-vindo de volta à sua galeria.",
            });
            navigate('/');
        } catch (error) {
            toast({
                title: "Erro de Login",
                description: "Houve um problema ao tentar fazer login. Tente novamente.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | MIDIAAP</title>
                <meta name="description" content="Acesse sua plataforma MIDIAAP." />
            </Helmet>
            <div className="flex items-center justify-center min-h-screen p-4 bg-grid">
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    <div className="glass-effect rounded-2xl p-8 shadow-2xl shadow-blue-900/20">
                        <div className="text-center mb-8">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 1.5, repeat: Infinity, repeatType: 'loop' } }}
                                className="inline-block mb-4"
                            >
                                <Clapperboard className="h-16 w-16 text-cyan-400" />
                            </motion.div>
                            <h1 className="text-3xl font-bold gradient-text">MIDIAAP</h1>
                            <p className="text-blue-300/80 mt-2">Acesse sua galeria de mídia profissional.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-blue-200">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-blue-200">Senha</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-lg" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    'Entrar'
                                )}
                            </Button>
                        </form>
                         <p className="text-xs text-center text-blue-400/50 mt-6">
                            Use as credenciais de demonstração ou qualquer outra. O login é simulado.
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default LoginPage;

