import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Info, 
  Menu, 
  X,
  Gift,
  Home as HomeIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', label: 'Início', icon: HomeIcon },
  { path: '/kits', label: 'Kits Pré-Prontos', icon: Gift },
  { path: '/rituais', label: 'Rituais', icon: Sparkles },
  { path: '/sobre', label: 'Sobre', icon: Info },
  { path: '/quiz', label: 'Criar Ritual', icon: Heart },
];

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm border-[#da2c38] text-[#Da2c38] hover:bg-[#F2cc8f]"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#F2cc8f] to-[#F2cc8f] border-r border-[#da2c38]/20 z-40 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo/Brand */}
          <div className="mb-8 pt-4">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-8 w-8 text-[#da2c38]" />
                <h1 className="text-2xl font-bold text-[#Da2c38] font-serif">
                  Xodózin
                </h1>
              </div>
              <p className="text-sm text-[#ff595e]/70 italic">
                O xodó que conecta gente de verdade
              </p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-white/50 hover:shadow-sm",
                    active
                      ? "bg-white/70 shadow-md text-[#Da2c38] font-medium"
                      : "text-[#ff595e] hover:text-[#Da2c38]"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    active ? "text-[#da2c38]" : "text-[#ff595e]"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-[#da2c38]/20">
            <p className="text-xs text-[#ff595e]/60 text-center">
              Feito com xodó 💜
            </p>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}

