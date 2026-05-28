'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ArrowLeft } from 'lucide-react';

export function TopNavbar() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-full px-6 py-3 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-4 text-gray-500">
        <ArrowLeft 
          className="w-5 h-5 cursor-pointer hover:text-gray-900 transition" 
          onClick={() => router.push('/')} 
        />
        <div className="flex items-center gap-2 font-bold text-gray-400">
            <LayoutGridIcon className="w-4 h-4" /> Assignment 
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white -mt-0.5 -mr-0.5"></div>
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-orange-100 rounded-full overflow-hidden">
            <img src={'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe'} alt="User" />
          </div>
          <span className="text-sm font-bold text-gray-800">John Doe</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

function LayoutGridIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="14" rx="1"/>
      <rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  );
}
