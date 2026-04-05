import React from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">ONETAKE Platformasi</h1>
        <p className="text-white/70 text-lg">Samaradorlik va Gamifikasiyani birlashtiruvchi ekotizim</p>
      </header>

      <div className="glass p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Loyiha haqida</h2>
        <p className="text-white/80 leading-relaxed">
          ONETAKE - bu o'zbek foydalanuvchilari uchun maxsus ishlab chiqilgan, kunlik vazifalar va maqsadlarni gamifikasiya orqali qiziqarli tajribaga aylantiruvchi platforma. 
          Bu yerda bajargan har bir vazifangiz uchun avtomatik tarzda tangalar sovg'a qilinadi va 5-kunlik tahlillar orqali doimiy o'sishingiz kuzatib boriladi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                 <Zap size={24} />
              </div>
              <h3 className="font-bold">Tezkor API</h3>
              <p className="text-sm text-white/50">NestJS va PostgreSQL asosida sinxronizatsiya.</p>
           </div>
           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                 <Sparkles size={24} />
              </div>
              <h3 className="font-bold">Zamonaviy UI</h3>
              <p className="text-sm text-white/50">Next.js 14, Tailwind CSS va Glassmorphism.</p>
           </div>
           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center">
                 <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold">Xavfsiz Auth</h3>
              <p className="text-sm text-white/50">Kuchli JWT tokenlar va parollar shifrlash.</p>
           </div>
        </div>
      </div>
      
      <div className="text-center text-white/40 text-sm mt-12 pb-8">
         &copy; 2026 ONETAKE Platformasi. Barcha huquqlar himoyalangan.
      </div>
    </div>
  );
}
