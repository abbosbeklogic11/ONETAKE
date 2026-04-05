'use client';

import React from 'react';
import { BarChart, Trophy, Activity, Calendar } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function Analytics() {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Analitika va Natijalar</h1>
        <p className="text-white/70">O'z rivojlanishingizni kuzatib boring.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
             <Trophy size={20} />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">Eng yaxshi kun</p>
            <p className="text-xl font-bold">Hali yo'q</p>
          </div>
        </div>

        <div className="glass-card flex items-start gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
             <Activity size={20} />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">O'rtacha Samaradorlik</p>
            <p className="text-xl font-bold">0%</p>
          </div>
        </div>

        <div className="glass-card flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
             <BarChart size={20} />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">Umumiy vazifalar (Tangalar)</p>
            <p className="text-xl font-bold">{user?.coinsBalance || 0}</p>
          </div>
        </div>

        <div className="glass-card flex items-start gap-4">
          <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
             <Calendar size={20} />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">Uzluksiz kunlar</p>
            <p className="text-xl font-bold">0 kun</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
         <div className="glass p-6 rounded-2xl h-80 flex flex-col items-center justify-center relative">
            <h3 className="absolute top-6 left-6 font-semibold">Tarixiy Samaradorlik</h3>
            <div className="flex gap-2 items-end h-3/4 w-full justify-center">
              {[0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                <div key={i} className="flex-1 max-w-[40px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all" style={{ height: `${h || 2}%` }}></div>
              ))}
            </div>
            <div className="w-full h-[1px] bg-white/20 mt-2"></div>
         </div>

         <div className="glass p-6 rounded-2xl flex flex-col">
            <h3 className="font-semibold mb-4">5-kunlik Sikl Qisqacha Sharhi</h3>
            <div className="flex-1 space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border-l-4 border-emerald-400">
                <p className="font-medium">Hali boshlanmadi</p>
                <p className="text-sm text-white/50">Yangi maqsad va 5-kunlik sikl qo'shishdan boshlang!</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
