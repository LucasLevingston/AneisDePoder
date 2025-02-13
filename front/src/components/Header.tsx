import { Link } from 'react-router-dom';
import { LogOut, User, Settings, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useUser } from '@/hooks/use-user';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Header() {
  const { clearUser, user } = useUser();

  const handleLogout = () => {
    clearUser();
    toast.warning('Saiu da conta.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <header className="bg-mainColor/90">
      <div className="flex h-20 items-center px-20 ">
        <div className="mr-4">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-saira-stencil text-3xl font-bold">
              Anéis de <span className="text-primary">Poder</span>
            </span>
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="default"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navegue pelo aplicativo Anéis de Poder</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-lg font-medium">
                Início
              </Link>
              <Link to={`/${user?.user.id}`} className="text-lg font-medium">
                Meu Perfil
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Sair da conta
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="md:flex flex-1 items-center justify-between space-x-2 md:justify-end hidden">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hidden md:block">
              Início
            </Link>
          </nav>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to={`/${user.user.id}`}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair da conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
