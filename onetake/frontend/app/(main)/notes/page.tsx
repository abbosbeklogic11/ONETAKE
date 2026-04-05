'use client';

import React, { useState, useEffect } from 'react';
import { Save, Clock, BookOpen, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notes() {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/notes/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.content !== undefined) {
          setContent(data.content);
          setSaveStatus('saved');
        }
      })
      .catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    if (!token || saveStatus === 'saved') return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await fetch('http://localhost:5000/api/notes/my', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content })
        });
        setSaveStatus('saved');
      } catch (e) {
        console.error(e);
        setSaveStatus('unsaved');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, token]);

  return (
    <div className="h-full flex flex-col space-y-6 pb-10">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <p className="text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-blue-400">Shaxsiy Intellekt</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Eslatmalar</h1>
          <p className="text-white/40 text-sm md:text-lg font-medium">Fikrlaringizni tartibga soling va yangi g'oyalarni qayd eting.</p>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 ${saveStatus === 'saved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
           {saveStatus === 'saving' ? (
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full" />
           ) : (
             <Sparkles size={18} className={saveStatus === 'saved' ? 'animate-pulse' : ''} />
           )}
           <span className="text-xs font-black uppercase tracking-widest">
             {saveStatus === 'saved' ? 'Saqlandi' : saveStatus === 'saving' ? 'Saqlanmoqda...' : 'O\'zgartirildi'}
           </span>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.99, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 glass-card p-1 rounded-[32px] overflow-hidden flex flex-col border-white/5 bg-black/20 shadow-2xl"
      >
         <div className="flex items-center gap-3 px-8 py-4 border-b border-white/5 bg-white/[0.02]">
            <BookOpen size={18} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Raqamli kundalik</span>
         </div>
         <textarea 
          className="flex-1 w-full bg-transparent p-8 text-white text-lg md:text-xl font-medium focus:outline-none resize-none custom-scrollbar leading-relaxed"
          placeholder="Bugungi fikrlaringizni yozishni boshlang..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setSaveStatus('unsaved');
          }}
        ></textarea>
        <div className="px-8 py-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
           <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">{content.length} ta belgi</span>
           <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest italic">Avtomatik saqlash yoqilgan</span>
        </div>
      </motion.div>
    </div>
  );
}

