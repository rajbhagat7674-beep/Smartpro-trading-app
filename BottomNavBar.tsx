import React from 'react';
import { LayoutGrid, BarChart2, Zap, Landmark, Globe, Briefcase, ShieldCheck } from 'lucide-react';

export type MainNavScreen = 'home' | 'detail' | 'signals' | 'fiidii' | 'news' | 'portfolio';

interface BottomNavBarProps {
  currentScreen: MainNavScreen;
  onNavigate: (screen: MainNavScreen) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  onOpenAuth,
  isLoggedIn
}) => {
  const navItems: { id: MainNavScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Watchlist', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'detail', label: 'Chart & SMC', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'signals', label: 'AI Signals', icon: <Zap className="w-5 h-5" /> },
    { id: 'fiidii', label: 'FII / DII', icon: <Landmark className="w-5 h-5" /> },
    { id: 'news', label: 'Global News', icon: <Globe className="w-5 h-5" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5" /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#080c14]/95 backdrop-blur-lg border-t border-slate-800/80 shadow-2xl">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-400 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500" />
              )}
              <span className="relative">{item.icon}</span>
              <span className="text-[10px] font-bold mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* SmartAPI Auth Status Button */}
        <button
          id="nav-btn-auth"
          onClick={onOpenAuth}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <div className="relative">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                isLoggedIn ? 'bg-emerald-400' : 'bg-amber-400'
              } ring-2 ring-slate-900`}
            />
          </div>
          <span className="text-[10px] font-bold mt-1 text-slate-300">
            {isLoggedIn ? 'SmartAPI' : 'Login'}
          </span>
        </button>
      </div>
    </div>
  );
};
