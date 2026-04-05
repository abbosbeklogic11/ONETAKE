'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, PlusCircle, X, CheckSquare, Target, Calendar, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const { token, fetchUserData } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: '', dueDate: '' });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', type: '', dueDate: '' });
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTask = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTasks();
        fetchUserData(); 
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6 md:space-y-10 relative pb-10">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <p className="text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-blue-400">Operatsion boshqaruv</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight leading-tight">Bugungi Vazifalar</h1>
          <p className="text-white/40 text-sm md:text-lg font-medium">Kichik qadamlar katta maqsadlar sari elitar.</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)} 
          className="glass-button w-full md:w-auto px-8 py-4 shadow-xl"
        >
          <PlusCircle size={20} /> Yangi Vazifa
        </motion.button>
      </motion.header>

      {/* Filter Tabs - Digital Pill Style */}
      <div className="flex bg-white/5 p-1.5 rounded-2xl w-fit border border-white/5 self-center md:self-start">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-white/30 hover:text-white/60'}`}
          >
            {f === 'all' ? 'Barchasi' : f === 'active' ? 'Faol' : 'Yakunlangan'}
          </button>
        ))}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, idx) => (
            <motion.div 
              key={task.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.98 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className={`glass-card p-0 flex items-center md:gap-4 overflow-hidden border-white/5 transition-all group ${task.isCompleted ? 'bg-white/[0.01] opacity-60' : 'bg-white/[0.03]'}`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center transition-all border-r border-white/5 ${task.isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'text-white/20 hover:text-blue-400 hover:bg-blue-500/5'}`}
              >
                {task.isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} className="group-hover:scale-105 transition-transform"/>}
              </button>
              
              <div className="flex-1 min-w-0 px-6 py-4">
                <p className={`text-lg md:text-xl font-black truncate transition-all duration-300 tracking-tight ${task.isCompleted ? 'text-white/30 line-through' : 'text-white/90'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${task.isCompleted ? 'bg-white/5 border-white/5 text-white/20' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    <CheckSquare size={12}/> {task.type || 'Umumiy'}
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-widest">
                      <Clock size={12} />
                      {task.dueDate}
                    </div>
                  )}
                  {task.goalId && (
                     <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[9px] font-black uppercase text-purple-400 tracking-widest">
                        <Target size={12}/> Maqsadli
                     </div>
                  )}
                </div>
              </div>

              <div className="px-6 hidden md:block">
                 <ArrowRight size={20} className={`transition-all ${task.isCompleted ? 'text-white/10' : 'text-white/20 group-hover:text-blue-400 group-hover:translate-x-1'}`} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 text-center glass-card border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center gap-6"
          >
             <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center opacity-20">
                <CheckSquare size={40} className="text-white" />
             </div>
             <div>
                <h3 className="text-xl font-black text-white/40 mb-1 tracking-tight">Ruhlaning!</h3>
                <p className="text-xs font-medium text-white/20 font-mono tracking-widest uppercase italic">Vazifalar ro'yxati hozircha bo'sh</p>
             </div>
          </motion.div>
        )}
      </motion.div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3 }}
              className="glass-card w-full max-w-md border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tight">Yangi Vazifa</h3>
                  <button onClick={() => setIsModalOpen(false)} className="bg-white/5 p-2 rounded-xl text-white/50 hover:text-white transition-all">
                    <X size={24} />
                  </button>
               </div>
               
               <form onSubmit={handleAddTask} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Nima qilish kerak?</label>
                    <input 
                      type="text" 
                      placeholder="M: Ertalabki mashg'ulot" 
                      className="glass-input w-full"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Turi</label>
                      <input 
                        type="text" 
                        placeholder="M: Sport" 
                        className="glass-input w-full"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Sana</label>
                      <input 
                        type="date" 
                        className="glass-input w-full text-white/80"
                        value={formData.dueDate}
                        onChange={e => setFormData({...formData, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="glass-button w-full mt-6 h-14 text-lg font-black uppercase tracking-widest">Qo'shish</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}

