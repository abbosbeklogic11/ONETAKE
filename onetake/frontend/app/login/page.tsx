'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        // Zustand store ga saqlash!
        login(data.user, data.access_token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError("Serverga ulanishda xatolik");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="glass-card w-full max-w-md animate-in fade-in zoom-in-95 duration-700 relative z-10 border-white/20">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center font-bold text-3xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.6)] border border-blue-400/50 transform rotate-12 hover:rotate-0 transition-transform duration-500">
            O
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-md">Tizimga kirish</h1>
          <p className="text-white/60">ONETAKE liquid maqsadlar olami</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-2xl mb-6 text-sm text-center shadow-[inset_0_1px_3px_rgba(239,68,68,0.5)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <input 
              type="email" 
              className="glass-input w-full"
              placeholder="Pochta manzilingiz"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-1">
            <input 
              type="password" 
              className="glass-input w-full"
              placeholder="Maxfiy parol"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="glass-button w-full mt-8 h-12 text-lg">
            Kirish
          </button>
        </form>

        <p className="text-center text-white/60 mt-8 text-sm">
          Hali akkauntingiz yo'qmi?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold drop-shadow-sm transition-all hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
}
