'use client';

import React, { useEffect, useState } from 'react';
import { Target, CheckSquare, Coins, ArrowRight, Activity, Zap } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const { user, token, fetchUserData } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchTasks();
      fetchGoals();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setTasks(await res.json());
    } catch(e) {}
  };

  const fetchGoals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/goals', { headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setGoals(await res.json());
    } catch(e) {}
  };

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 md:space-y-10 relative pb-10"
    >
      <motion.header variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <p className="text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-blue-400 opacity-80">Asosiy Panel</p>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight leading-tight">
          Xush kelibsiz, <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-sm">
            {user?.username || 'Foydalanuvchi'}
          </span>
        </h1>
        <p className="text-white/40 text-sm md:text-lg font-medium">Rejalaringizni amalga oshirish vaqti keldi.</p>
      </motion.header>

      {/* Main Stats Summary Card - App Style */}
      <motion.div variants={itemVariants} className="glass-card bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-blue-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
         <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
               <motion.circle 
                  cx="50%" cy="50%" r="45%" 
                  stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * progress / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
               />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl md:text-4xl font-black text-white">{Math.round(progress)}%</span>
               <span className="text-[10px] uppercase font-black text-white/40 tracking-wider">Bajarildi</span>
            </div>
         </div>
         <div className="flex-1 text-center md:text-left space-y-4">
            <div>
               <h3 className="text-xl md:text-2xl font-black text-white mb-1">Kunlik Progress</h3>
               <p className="text-sm text-white/50 font-medium">Bugungi vazifalaringizning {completedTasks} tasi yakunlandi.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                  <CheckSquare size={16} className="text-blue-400" />
                  <span className="text-xs font-black">{tasks.length} Vazifa</span>
               </div>
               <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                  <Coins size={16} className="text-yellow-400" />
                  <span className="text-xs font-black">{user?.coinsBalance || 0} Gold</span>
               </div>
            </div>
         </div>
         <Link href="/tasks" className="w-full md:w-auto">
            <motion.button whileTap={{ scale: 0.95 }} className="glass-button w-full md:px-8 py-4 shadow-xl">
               Boshlash <ArrowRight size={18} />
            </motion.button>
         </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <motion.div variants={itemVariants} className="glass-card p-5 border-white/5 bg-white/[0.02] flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/20">
                 <Zap size={20} />
              </div>
              <div>
                 <p className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Aktivlik</p>
                 <p className="text-2xl font-black text-white">Yaxshi</p>
              </div>
           </motion.div>
           
           <motion.div variants={itemVariants} className="glass-card p-5 border-white/5 bg-white/[0.02] flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg border border-purple-500/20">
                 <Target size={20} />
              </div>
              <div>
                 <p className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Maqsadlar</p>
                 <p className="text-2xl font-black text-white">{goals.length}</p>
              </div>
           </motion.div>
        </div>

        <motion.div variants={itemVariants} className="glass-card p-6 border-white/5 bg-white/[0.02] relative overflow-hidden">
           <div className="flex justify-between items-center mb-6 relative z-10">
             <h2 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
                <Activity size={20} className="text-blue-400" /> Haftalik Aktivlik
             </h2>
           </div>
           <div className="h-24 w-full flex items-end justify-between gap-1.5 relative z-10">
              {[40, 70, 45, 90, 60, 20, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    className="w-full max-w-[12px] bg-gradient-to-t from-blue-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] relative group-hover:from-blue-400 group-hover:to-white transition-all"
                  >
                     <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <span className="text-[8px] font-black text-white/30">{['D', 'S', 'C', 'P', 'J', 'S', 'Y'][i]}</span>
                </div>
              ))}
           </div>
        </motion.div>
      </div>

      {/* Modern Task List */}
      <motion.div variants={itemVariants} className="glass-card p-6 md:p-8 border-white/5 pb-4">
         <div className="flex justify-between items-center mb-8">
           <h2 className="text-xl md:text-2xl font-black tracking-tight">So'nggi Vazifalar</h2>
           <Link href="/tasks" className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-4 py-2 rounded-xl border border-blue-400/20 hover:bg-blue-400/20 transition-all">Barchasi</Link>
         </div>
         
         <div className="space-y-4">
            {tasks.slice(0, 3).map((task, idx) => (
              <motion.div 
                key={task.id} 
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 bg-white/[0.03] p-5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group"
              >
                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${task.isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}>
                    <CheckSquare size={20} />
                 </div>
                 <div className="flex-1">
                   <p className={`font-black text-base md:text-lg tracking-tight ${task.isCompleted ? 'text-white/30 line-through' : 'text-white/90'}`}>{task.title}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-black tracking-widest text-white/30 flex items-center gap-1">
                         <div className="w-1 h-1 rounded-full bg-blue-500" /> {task.type}
                      </span>
                   </div>
                 </div>
                 <ArrowRight size={18} className="text-white/20 group-hover:text-blue-400 transition-colors" />
              </motion.div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-10 opacity-30">
                 <CheckSquare size={48} className="mx-auto mb-4" />
                 <p className="font-black uppercase tracking-widest text-xs">Vazifalar yo'q</p>
              </div>
            )}
         </div>
      </motion.div>
    </motion.div>
  );
}

