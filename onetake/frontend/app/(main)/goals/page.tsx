'use client';

import React, { useState, useEffect } from 'react';
import { Target, PlusCircle, X, ChevronRight, Calendar as CalIcon, CheckCircle, CheckSquare, ArrowRight, Flame, Clock } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../../../store/api';

export default function Goals() {
  const [goals, setGoals] = useState<any[]>([]);
  const { token } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });

  // Detailed view states
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'cycles' | 'tasks'>('cycles');
  const [isAddingCycle, setIsAddingCycle] = useState(false);
  const [cycleData, setCycleData] = useState({ description: '', startDate: '', endDate: '' });
  
  const [selectedCycle, setSelectedCycle] = useState<any>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskData, setTaskData] = useState({ title: '' });

  useEffect(() => {
    fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
        
        // Refresh selected goal if it's open
        if (selectedGoal) {
          const updated = data.find((g: any) => g.id === selectedGoal.id);
          if (updated) setSelectedGoal(updated);
          
          if (selectedCycle && updated) {
            const updatedCycle = updated.fiveDayCycles?.find((c: any) => c.id === selectedCycle.id);
            if (updatedCycle) setSelectedCycle(updatedCycle);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', deadline: '' });
        fetchGoals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedGoal) return;
    try {
      const res = await fetch(`${API_URL}/goals/${selectedGoal.id}/five-day-cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cycleData)
      });
      if (res.ok) {
        setIsAddingCycle(false);
        setCycleData({ description: '', startDate: '', endDate: '' });
        fetchGoals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTaskToCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedGoal || !selectedCycle) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: taskData.title,
          fiveDayCycleId: selectedCycle.id,
          goalId: selectedGoal.id
        })
      });
      if (res.ok) {
        setIsAddingTask(false);
        setTaskData({ title: '' });
        fetchGoals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchGoals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getDaysRemaining = (dateString: string) => {
    if (!dateString) return 0;
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6 md:space-y-10 relative pb-10">
      <header 
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <p className="text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-blue-400">Strategiya</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Yirik Maqsadlar</h1>
          <p className="text-white/40 text-sm md:text-lg font-medium max-w-xl">Katta maqsadlarni kichik 5-kunlik qadamlarga bo'ling.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="glass-button w-full md:w-auto px-8 py-4 shadow-xl"
        >
          <PlusCircle size={20} /> Yangi Maqsad
        </button>
      </header>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {goals.map((goal, idx) => {
            const daysLeft = getDaysRemaining(goal.deadline);
            return (
              <div 
                key={goal.id} 
                onClick={() => {
                  setSelectedGoal(goal);
                  setSelectedCycle(null);
                }}
                className="glass-card flex flex-col p-6 md:p-8 rounded-[40px] border border-white/5 bg-white/[0.03] backdrop-blur-3xl relative overflow-hidden group cursor-pointer h-full transition-all hover:bg-white/[0.06] hover:border-blue-500/30"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Target size={80} className="text-white transform rotate-12" />
                </div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl text-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-blue-500/20">
                    <Target size={24} />
                  </div>
                     <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                           <CalIcon size={12} className="text-white/40"/>
                           <span className="text-[10px] font-black text-white/60 tracking-wider"> Muddat: {goal.deadline}</span>
                        </div>
                        {daysLeft > 0 ? (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-lg ${daysLeft <= 5 ? 'bg-orange-500/20 border-orange-500/30 text-orange-400 animate-pulse' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                             <Flame size={14} className={daysLeft <= 5 ? 'text-orange-500' : 'text-blue-400'} />
                             <span className="text-[11px] font-black uppercase tracking-widest">{daysLeft} kun qoldi</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-500">
                             <Clock size={14} />
                             <span className="text-[11px] font-black uppercase tracking-widest text-red-400">Muddat o'tdi</span>
                          </div>
                        )}
                     </div>
                </div>
                
                <div className="text-left relative z-10 flex-1">
                  <h2 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {goal.title}
                  </h2>
                  <p className="text-sm text-white/40 font-medium line-clamp-2">
                    {goal.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-5 flex justify-between items-center relative z-10 border-t border-white/5">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        {goal.fiveDayCycles?.length || 0} ta qadam
                      </span>
                   </div>
                   <div 
                     className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"
                   >
                     <ArrowRight size={18} />
                   </div>
                </div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Goal Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3 }}
              className="glass-card w-full max-w-md border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tight">Yangi Maqsad</h3>
                  <button onClick={() => setIsModalOpen(false)} className="bg-white/5 p-2 rounded-xl text-white/50 hover:text-white transition-all">
                    <X size={24} />
                  </button>
               </div>
               
               <form onSubmit={handleAddGoal} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Nomi</label>
                    <input 
                      type="text" 
                      placeholder="M: IELTS dan 7.5 olish" 
                      className="glass-input w-full"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Tafsilotlar</label>
                    <textarea 
                      placeholder="Ushbu maqsadga erishish nega muhim?" 
                      className="glass-input w-full resize-none h-28"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Tugash Sanasi</label>
                    <input 
                      type="date" 
                      className="glass-input w-full"
                      value={formData.deadline}
                      onChange={e => setFormData({...formData, deadline: e.target.value})}
                      required
                    />
                  </div>
                  
                  <button type="submit" className="glass-button w-full mt-6 h-14 text-lg font-black uppercase tracking-widest">Hozir boshlash</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hierarchical Goal View Modal */}
       <AnimatePresence>
        {selectedGoal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black overflow-hidden p-0"
          >
            <div 
              className="w-full h-full flex flex-col md:flex-row gap-0 overflow-hidden relative bg-black/95"
            >
                {/* Mobile Header with X and Tabs */}
                <div className="md:hidden flex flex-col pt-6 px-6 pb-2 space-y-4 border-b border-white/5 bg-black/40 backdrop-blur-lg sticky top-0 z-[1200]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight">{selectedGoal?.title}</h3>
                    <button 
                      onClick={() => { setSelectedGoal(null); setSelectedCycle(null); }} 
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white/50"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                    <button 
                      onClick={() => setActiveTab('cycles')}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'cycles' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/30'}`}
                    >
                      Bosqichlar
                    </button>
                    <button 
                      onClick={() => setActiveTab('tasks')}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'tasks' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/30'}`}
                    >
                      Vazifalar
                    </button>
                  </div>
                </div>

                 {/* Desktop X Button */}
                 <button 
                  onClick={() => { setSelectedGoal(null); setSelectedCycle(null); }} 
                  className="hidden md:flex absolute top-10 right-10 z-[1100] w-16 h-16 items-center justify-center bg-white/10 backdrop-blur-3xl border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all shadow-3xl active:scale-90"
                >
                  <X size={32} />
                </button>

                 {/* Panel 1: Cycles List */}
                <div className={`flex-1 h-full md:flex flex-col overflow-hidden relative border-r border-white/5 bg-white/[0.01] p-6 md:p-12 ${activeTab !== 'cycles' && 'hidden md:flex'}`}>
                   <div className="mb-8 pr-12">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-1 md:w-16 md:h-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                        <span className="text-xs text-blue-400 font-black uppercase tracking-[0.4em]">Strategik Reja</span>
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black text-white mb-4 break-words tracking-tighter leading-none">{selectedGoal.title}</h2>
                     <p className="text-white/30 text-base md:text-xl font-medium max-w-2xl leading-relaxed">{selectedGoal.description}</p>
                   </div>
                                      <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5 mt-12">
                     <h3 className="font-black text-xl md:text-2xl tracking-tighter flex items-center gap-3">
                        <Flame size={24} className="text-orange-500" /> Bosqichlar
                     </h3>
                     <button 
                       onClick={() => setIsAddingCycle(true)} 
                       className="text-[10px] bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-2 font-black uppercase tracking-widest shadow-2xl"
                     >
                       <PlusCircle size={16}/> Yangi Bosqich
                     </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-6 elastic-scroll">
                      {selectedGoal.fiveDayCycles?.map((cycle: any, cidx: number) => (
                        <div 
                          key={cycle.id}
                          onClick={() => { setSelectedCycle(cycle); setActiveTab('tasks'); }}
                          className={`p-5 rounded-[24px] border cursor-pointer transition-all ${selectedCycle?.id === cycle.id ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.01]' : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'}`}
                        >
                           <div className="flex justify-between items-center mb-3">
                             <span className="font-black text-base md:text-lg tracking-tight">{cycle.description}</span>
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedCycle?.id === cycle.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-white/20'}`}>
                                <ChevronRight size={18} />
                             </div>
                           </div>
                           <div className="text-[10px] font-black text-white/30 flex flex-wrap gap-3 items-center">
                              <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{cycle.startDate}</span> 
                              <span className="opacity-20 uppercase tracking-[0.3em]">To</span>
                              <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{cycle.endDate}</span> 
                           </div>
                           <div className="mt-4 flex items-center gap-3">
                             <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  style={{ width: `${(cycle.tasks?.filter((t:any) => t.isCompleted).length / (cycle.tasks?.length || 1)) * 100}%` }}
                                  className="h-full bg-blue-500 rounded-full" 
                                />
                             </div>
                             <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">{cycle.tasks?.length || 0} Vazifa</span>
                           </div>
                        </div>
                      ))}
                      
                      {selectedGoal.fiveDayCycles?.length === 0 && !isAddingCycle && (
                        <div className="text-center py-16 text-white/20 border border-dashed border-white/10 rounded-[32px] bg-white/[0.02]">
                          <Target size={48} className="mx-auto mb-4 opacity-10" />
                          <p className="font-black uppercase tracking-widest text-[10px]">Hali hech qanday qadam yo'q</p>
                        </div>
                      )}
                      
                    <AnimatePresence>
                      {isAddingCycle && (
                        <div 
                          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                          onClick={() => setIsAddingCycle(false)}
                        >
                          <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 p-5 md:p-10 rounded-[32px] w-full max-w-[94%] md:max-w-lg shadow-2xl relative overflow-hidden"
                          >
                             <form onSubmit={handleAddCycle} className="space-y-6">
                               <div className="flex justify-between items-center mb-2">
                                  <h3 className="text-2xl font-black text-white tracking-tight">Yangi Bosqich</h3>
                                  <button type="button" onClick={() => setIsAddingCycle(false)} className="text-white/30 hover:text-white"><X size={24} /></button>
                               </div>

                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Qadam nomi va vazifasi</label>
                                  <input type="text" placeholder="Masalan: Kursning 1-modulini yakunlash" required className="glass-input w-full text-lg h-14 md:h-16 px-6" value={cycleData.description} onChange={e => setCycleData({...cycleData, description: e.target.value})} />
                               </div>
                               <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                 <div className="flex-1 space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Boshlanish</label>
                                   <input type="date" required className="glass-input w-full h-14 md:h-16 px-6" value={cycleData.startDate} onChange={e => setCycleData({...cycleData, startDate: e.target.value})} />
                                 </div>
                                 <div className="flex-1 space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Tugash</label>
                                   <input type="date" required className="glass-input w-full h-14 md:h-16 px-6" value={cycleData.endDate} onChange={e => setCycleData({...cycleData, endDate: e.target.value})} />
                                 </div>
                               </div>
                               <div className="flex gap-4 pt-4">
                                 <button type="button" onClick={() => setIsAddingCycle(false)} className="flex-1 py-4 md:py-5 rounded-2xl bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest transition-all text-xs">Bekor qilish</button>
                                 <button type="submit" className="flex-[2] py-4 md:py-5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all text-xs">Saqlash</button>
                               </div>
                             </form>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                   </div>
                </div>
                
                {/* Panel 2: Tasks List */}
                <div className={`flex-[1.2] h-full md:flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-lg p-6 md:p-12 ${activeTab !== 'tasks' && 'hidden md:flex'}`}>
                   <AnimatePresence mode="wait">
                    {!selectedCycle ? (
                      <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-20"
                      >
                         <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center mb-6">
                           <Target size={48} className="text-white" />
                         </div>
                         <h3 className="text-2xl font-black mb-2 tracking-tight">Qadamni tanlang</h3>
                         <p className="text-base font-medium">Vazifalarni ko'rish uchun <br /> chapdan biror bosqichni tanlang.</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="content"
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col h-full"
                      >
                         <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em]">Operatsion</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 break-words tracking-tight leading-tight">{selectedCycle.description}</h2>
                            <div className="flex items-center gap-3">
                               <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-white/50 uppercase tracking-widest">
                                  {selectedCycle.startDate} — {selectedCycle.endDate}
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                           <h3 className="font-black text-lg tracking-tight flex items-center gap-3">
                              <CheckSquare size={22} className="text-emerald-400"/> Vazifalar
                           </h3>
                           <motion.button 
                             whileTap={{ scale: 0.98 }}
                             onClick={() => setIsAddingTask(!isAddingTask)} 
                             className="text-[10px] bg-emerald-500 px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2 font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20"
                           >
                             <PlusCircle size={14}/> Qo'shish
                           </motion.button>
                         </div>
                         
                         <AnimatePresence>
                          {isAddingTask && (
                            <motion.form 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                              onSubmit={handleAddTaskToCycle} 
                              className="mb-6 flex gap-3"
                            >
                               <input type="text" placeholder="Yangi vazifa matni..." required className="glass-input flex-1 text-base h-14 px-6" value={taskData.title} onChange={e => setTaskData({title: e.target.value})} autoFocus/>
                               <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 px-6 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95">
                                 <CheckCircle size={24} />
                               </button>
                            </motion.form>
                          )}
                         </AnimatePresence>
                         
                         <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-8 elastic-scroll">
                            {(!selectedCycle.tasks || selectedCycle.tasks.length === 0) && !isAddingTask && (
                              <div className="flex flex-col items-center justify-center py-20 text-white/10 border border-dashed border-white/5 rounded-[32px] bg-white/[0.01]">
                                <CheckSquare size={56} className="mb-4 opacity-5" />
                                <p className="font-black uppercase tracking-[0.2em] text-[10px]">Hali vazifalar mavjud emas</p>
                              </div>
                            )}
                            
                            {selectedCycle.tasks?.map((task: any, tidx: number) => (
                               <motion.div 
                                key={task.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: tidx * 0.03, duration: 0.3 }}
                                onClick={() => handleToggleTask(task.id)}
                                className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-[24px] group hover:border-emerald-500/30 hover:bg-white/[0.06] transition-all cursor-pointer"
                              >
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${task.isCompleted ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/10 group-hover:border-emerald-500/50 shadow-inner'}`}>
                                   {task.isCompleted && <CheckCircle size={18} className="text-white" />}
                                </div>
                                <span className={`text-base md:text-lg font-black tracking-tight flex-1 ${task.isCompleted ? 'text-white/20 line-through' : 'text-white/90'}`}>
                                  {task.title}
                                </span>
                              </motion.div>
                            ))}
                            
                            {selectedCycle.tasks?.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-10 p-5 bg-blue-500/5 border border-blue-500/10 rounded-[24px] text-[10px] text-blue-400/50 text-center uppercase font-black tracking-[0.4em]"
                              >
                                Intizom — natija kalitidir
                              </motion.div>
                            )}
                         </div>
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
