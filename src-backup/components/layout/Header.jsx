
import React from 'react';
import { Search, User, LogOut } from 'lucide-react';
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

const Header = ({ onSearchChange }) => {
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
    <div className="flex justify-between items-center mb-6">
      <input
        type="text"
        placeholder="Pesquisar na sua mídia..."
        className="bg-[#2a2a40] text-white px-4 py-2 rounded-lg w-full max-w-md"
        onChange={(e) => onSearchChange(e.target.value)}
        onClick={handleSearchClick}
      />
      <div className="flex items-center gap-4 ml-4">
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
  );
};

export default Header;
  