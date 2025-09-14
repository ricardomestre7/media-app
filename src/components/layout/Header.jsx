
import React from 'react';
import { Search, Upload, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ onUploadClick, onSearchChange }) => {
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleSearchClick = () => {
    toast({
      title: "Busca Ativada! 🚧",
      description: "A funcionalidade de busca está sendo conectada. Por enquanto, a filtragem funciona pelo sidebar!",
      variant: "default",
    });
  };

  return (
    <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-blue-900/50 z-20">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="relative flex-1 max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300/70" />
          <Input
            type="search"
            placeholder="Pesquisar na sua mídia..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border-blue-800/60 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-blue-300/50"
            onChange={(e) => onSearchChange(e.target.value)}
            onClick={handleSearchClick}
          />
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <Button
            variant="ghost"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-px transition-all"
            onClick={onUploadClick}
          >
            <Upload className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Upload</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-cyan-400/50">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.email} />
                  <AvatarFallback>
                    <User className="text-cyan-300"/>
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-effect" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">Olá, Usuário!</p>
                  <p className="text-xs leading-none text-blue-300/80">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
  