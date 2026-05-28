'use client';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Users, FileText, Wrench, Settings, BookOpen } from 'lucide-react';

export const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: 'Home', icon: <LayoutGrid className="w-5 h-5" />, href: '/' },
    { name: 'My Groups', icon: <Users className="w-5 h-5" />, href: '/groups' },
    { name: 'Assignments', icon: <FileText className="w-5 h-5" />, href: '/', active: true, badge: '10' },
    { name: 'AI Teacher\'s Toolkit', icon: <Wrench className="w-5 h-5" />, href: '/toolkit' },
    { name: 'My Library', icon: <BookOpen className="w-5 h-5" />, href: '/library' },
  ];

  return (
    <div className="w-64 min-h-screen bg-white shadow-[2px_0_15px_rgba(0,0,0,0.03)] flex flex-col justify-between py-6 px-4 z-10 sticky top-0 h-screen">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-[#cc4522] text-white p-1 rounded-md text-xl font-bold flex items-center justify-center w-8 h-8">
            <svg viewBox="0 0 100 100" fill="none" className="w-6 h-6"><path d="M20 20 L40 80 L60 20 L80 80" stroke="white" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">VedaAI</span>
        </div>

        {/* Create Assignment Button */}
        <button 
          onClick={() => router.push('/create-assignment')}
          className="w-full flex items-center justify-center gap-2 bg-[#1d1e20] text-white font-bold py-3.5 rounded-full hover:bg-black transition-all mb-8 shadow-md border-2 border-orange-500/20"
        >
          <span className="text-sm">✨ Create Assignment</span>
        </button>

        {/* Menu */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <div 
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer font-bold text-sm transition-all ${item.active ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-[#ea580c] text-white text-[10px] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-gray-400 hover:text-gray-700 hover:bg-gray-50 font-bold text-sm transition-all">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </div>

        {/* Profile Card */}
        <div className="mt-4 bg-[#f0f2f5] p-3 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-200 rounded-full overflow-hidden flex-shrink-0">
            <img src={'https://api.dicebear.com/7.x/avataaars/svg?seed=monkey'} alt="avatar" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-gray-900 truncate">Delhi Public School</span>
            <span className="text-xs text-gray-500 font-medium truncate">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </div>
  );
};