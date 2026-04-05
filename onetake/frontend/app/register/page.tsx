'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (avatar) data.append('avatar', avatar);

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        // FormData sends boundary automatically, don't set Content-Type manually
        body: data
      });
      const resData = await res.json();
      if (res.ok) {
        login(resData.user, resData.access_token);
        router.push('/dashboard');
      } else {
        setError(resData.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError("Serverga ulanishda xatolik");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Mesh is handled globally in layout */}
      <div className="glass-card w-full max-w-md animate-in fade-in zoom-in-95 duration-700 relative z-10 border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-md">Ro'yxatdan o'tish</h1>
          <p className="text-white/60">ONETAKE 3D olamiga qadam bosing</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-2xl mb-6 text-sm text-center shadow-[inset_0_1px_3px_rgba(239,68,68,0.5)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col items-center justify-center mb-6">
            <label htmlFor="avatar-upload" className="cursor-pointer group relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300 ${preview ? 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-dashed border-white/30 group-hover:border-white/60 bg-white/5'}`}>
                 {preview ? (
                   <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex flex-col items-center text-white/50 group-hover:text-white/80 transition-colors">
                     <Upload size={24} className="mb-1" />
                     <span className="text-[10px] font-medium text-center leading-tight">Rasm yuklash<br/>(ixtiyoriy)</span>
                   </div>
                 )}
              </div>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange} 
              />
            </label>
          </div>

          <div className="space-y-1">
            <input 
              type="text" 
              className="glass-input w-full"
              placeholder="Foydalanuvchi nomi"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-1">
            <input 
              type="email" 
              className="glass-input w-full"
              placeholder="Pochta manzili"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-1">
            <input 
              type="password" 
              className="glass-input w-full"
              placeholder="Parol (kamida 6 belgi)"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="glass-button w-full mt-8 h-12 text-lg">
            Ro'yxatdan o'tish
          </button>
        </form>

        <p className="text-center text-white/60 mt-8 text-sm">
          Akkauntingiz bormi?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold drop-shadow-sm transition-all hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]">
            Tizimga kiring
          </Link>
        </p>
      </div>
    </div>
  );
}
