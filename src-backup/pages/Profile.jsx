import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { User, Mail, Calendar, Settings, Save, Edit3, ArrowLeft, Key, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Componente memorizado para cards de estatísticas
const StatCard = memo(({ icon: Icon, title, description, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
    <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
      <Icon size={24} className={bgColor.includes('blue') ? 'text-blue-600' : bgColor.includes('green') ? 'text-green-600' : 'text-purple-600'} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
));

// Componente memorizado para modal de senha
const PasswordModal = memo(({ isOpen, onClose, onSubmit, loading }) => {
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setError(''); // Limpar erro ao digitar
  }, []);

  const handleSubmit = useCallback(() => {
    const { newPassword, confirmPassword } = passwords;
    
    if (!newPassword.trim()) {
      setError('Digite uma nova senha');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    onSubmit(newPassword);
  }, [passwords, onSubmit]);

  const handleClose = useCallback(() => {
    setPasswords({ newPassword: '', confirmPassword: '' });
    setError('');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Key size={24} className="text-blue-600" />
              Alterar Senha
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Digite sua nova senha"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Confirme sua nova senha"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !passwords.newPassword || !passwords.confirmPassword}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Dados do formulário memorizados
  const [formData, setFormData] = useState(() => ({
    full_name: '',
    email: '',
    phone: '',
    bio: ''
  }));

  // Inicializar dados quando user mudar
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || ''
      });
    }
  }, [user?.email, user?.user_metadata?.full_name, user?.user_metadata?.phone, user?.user_metadata?.bio]);

  // Handlers otimizados
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio
      });
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [formData, updateProfile]);

  const handlePasswordUpdate = useCallback(async (newPassword) => {
    setLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        alert('Senha atualizada com sucesso!');
        setShowPasswordModal(false);
      } else {
        alert(result.error || 'Erro ao atualizar senha');
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [updatePassword]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || ''
      });
    }
  }, [user]);

  // Dados formatados memorizados
  const formattedDate = useMemo(() => {
    return user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Não informado';
  }, [user?.created_at]);

  const displayName = useMemo(() => {
    return formData.full_name || 'Usuário';
  }, [formData.full_name]);

  // Cards de estatísticas memorizados
  const statCards = useMemo(() => [
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Gerencie suas preferências',
      bgColor: 'bg-blue-100'
    },
    {
      icon: User,
      title: 'Ativo',
      description: 'Conta verificada e ativa',
      bgColor: 'bg-green-100'
    },
    {
      icon: Calendar,
      title: 'Membro',
      description: `Desde ${formattedDate}`,
      bgColor: 'bg-purple-100'
    }
  ], [formattedDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simplificado */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-gray-600">Gerencie suas informações pessoais</p>
              </div>
            </div>
            
            {!isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit3 size={18} />
                  Editar
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Key size={18} />
                  Senha
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header do Perfil */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{displayName}</h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <Mail size={16} />
                  {formData.email}
                </p>
                <p className="text-blue-100 flex items-center gap-2 mt-1">
                  <Calendar size={16} />
                  Membro desde {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Formulário do Perfil */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Digite seu nome completo"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.full_name || 'Não informado'}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">
                  {formData.email}
                  <span className="text-xs block mt-1">Email não pode ser alterado</span>
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.phone || 'Não informado'}
                  </div>
                )}
              </div>

              {/* ID do Usuário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID do Usuário
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500 font-mono text-sm">
                  {user?.id?.slice(0, 8)}...
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografia
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Conte um pouco sobre você..."
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
                  {formData.bio || 'Nenhuma biografia adicionada ainda.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              bgColor={card.bgColor}
            />
          ))}
        </div>
      </div>

      {/* Modal de Senha */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordUpdate}
        loading={loading}
      />
    </div>
  );
};

export default Profile;