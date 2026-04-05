'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, CheckSquare, Target, BarChart2, BookOpen, Info, LogOut, X, Save, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../store/api';

export function GlassLayout({ children }: { children: React.ReactNode }) {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'edit' | 'notes' | 'ranking'>('info');
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [ranking, setRanking] = useState<any[]>([]);
  
  // Profile edit states
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Fetch note when profile opens
  useEffect(() => {
    if (isProfileOpen && token) {
      // Fetch Note
      fetch(`${API_URL}/notes/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.content !== undefined) {
          setNoteContent(data.content);
          setSaveStatus('saved');
        }
      })
      .catch(console.error);

      // Fetch Ranking
      fetch(`${API_URL}/auth/ranking`)
      .then(res => res.json())
      .then(data => setRanking(Array.isArray(data) ? data : []))
      .catch(console.error);
      
      setEditUsername(user?.username || '');
      setEditEmail(user?.email || '');
    }
  }, [isProfileOpen, token, user]);

  // Auto-save logic (Debounce)
  useEffect(() => {
    if (!isProfileOpen || !token) return;
    if (saveStatus === 'saved') return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await fetch(`${API_URL}/notes/my`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content: noteContent })
        });
        setSaveStatus('saved');
      } catch (e) {
        console.error(e);
        setSaveStatus('unsaved');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [noteContent, token, isProfileOpen]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsUpdatingProfile(true);

    const formData = new FormData();
    formData.append('username', editUsername);
    formData.append('email', editEmail);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const updatedUser = await res.json();
        // Update local authStore state
        if (updatedUser && updatedUser.id) {
           useAuthStore.setState({ user: { ...user, ...updatedUser } });
        }
        setActiveProfileTab('info');
        alert('Profil muvaffaqiyatli yangilandi!');
      } else {
        const errorData = await res.json();
        alert(`Xatolik: ${errorData.message || 'Profilni yangilab bo\'lmadi'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Tarmoq xatosi yoki server bilan muammo yuzaga keldi.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { href: '/dashboard', icon: <Home size={22} />, label: 'Bosh' },
    { href: '/tasks', icon: <CheckSquare size={22} />, label: 'Vazifalar' },
    { href: '/goals', icon: <Target size={22} />, label: 'Maqsadlar' },
    { href: '/analytics', icon: <BarChart2 size={22} />, label: 'Analitika' },
    { href: '/notes', icon: <BookOpen size={22} />, label: 'Notes' },
  ];

  const profileTabs = [
    { id: 'info', label: 'Profil' },
    { id: 'edit', label: 'Tahrirlash' },
    { id: 'notes', label: 'Eslatmalar' },
    { id: 'ranking', label: 'Reyting' },
  ];

  return (
    <div className="flex h-screen md:h-screen overflow-hidden text-white relative">
      <div className="bg-mesh" />
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 liquid-glass-3d border-r border-white/10 p-6 z-10 transition-all rounded-r-3xl my-4 ml-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/50 transform rotate-12">
            O
          </div>
          <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">ONETAKE</span>
        </div>
        
        <nav className="flex-1 space-y-3">
          {menuItems.map(item => (
            <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} active={pathname === item.href} />
          ))}
          <NavItem href="/about" icon={<Info size={22} />} label="Loyiha" active={pathname === '/about'} />
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-all w-full p-3 rounded-2xl hover:bg-white/5 active:scale-95 text-left font-bold">
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden z-10">
        {/* Mobile Premium Header */}
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 transition-all">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-sm border border-white/5">O</div>
            <span className="font-black text-lg tracking-tight text-white/90">ONETAKE</span>
          </div>
          
          <div className="ml-auto flex items-center gap-3 md:gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/5 backdrop-blur-xl text-yellow-400 px-3 md:px-5 py-2 md:py-2.5 rounded-2xl border border-white/10 shadow-xl"
            >
              <span className="font-black text-sm md:text-lg">{user?.coinsBalance || 0}</span>
              <span className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Gold</span>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setIsProfileOpen(true); setActiveProfileTab('info'); }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 border-blue-400/50 p-0.5 bg-gradient-to-b from-blue-400 to-indigo-600 shadow-2xl cursor-pointer"
            >
               <img 
                 src={user?.avatarUrl ? user.avatarUrl : "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                 alt="avatar" 
                 className="w-full h-full object-cover rounded-[14px]" 
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
                 }}
               />
            </motion.button>
          </div>
        </header>

        {/* Content Area */}
        <motion.div 
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-10 custom-scrollbar elastic-scroll"
        >
          {children}
        </motion.div>

        {/* Profile Overhaul Modal */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { if (e.target === e.currentTarget) setIsProfileOpen(false); }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card w-full max-w-2xl h-[85vh] flex flex-col border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden p-0 cursor-default"
              >
                {/* Tabs Header */}
                <div className="flex border-b border-white/5 bg-white/5 overflow-x-auto no-scrollbar flex-shrink-0">
                   {profileTabs.map(tab => (
                     <button 
                       key={tab.id}
                       onClick={() => setActiveProfileTab(tab.id as any)}
                       className={`flex-1 min-w-[100px] py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeProfileTab === tab.id ? 'text-blue-400 bg-blue-500/5' : 'text-white/30 hover:text-white/50'}`}
                     >
                       {tab.label}
                       {activeProfileTab === tab.id && (
                         <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                       )}
                     </button>
                   ))}
                   <button onClick={() => setIsProfileOpen(false)} className="px-6 text-white/30 hover:text-white transition-all sticky right-0 bg-inherit border-l border-white/5">
                      <X size={20} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                  <AnimatePresence mode="wait">
                    {activeProfileTab === 'info' && (
                      <motion.div key="info" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-4 border-blue-500/30 p-1.5 bg-white/5 shadow-2xl mb-6 transform rotate-3 transition-transform group-hover:rotate-0 duration-500">
                             <img 
                               src={user?.avatarUrl ? user.avatarUrl : "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                               alt="avatar" 
                               className="w-full h-full object-cover rounded-[32px]" 
                               onError={(e) => {
                                 (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
                               }}
                             />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-3 rounded-2xl shadow-xl border border-white/20 transform -rotate-6">
                             <Sparkles size={20} />
                          </div>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{user?.username}</h2>
                        <p className="text-white/40 font-medium mb-10">{user?.email}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                           <StatBox label="Balance" value={user?.coinsBalance || 0} color="text-yellow-400" />
                           <StatBox label="Vazifalar" value={user?.totalTasksCompleted || 0} color="text-blue-400" />
                           <StatBox label="Daraja" value="Elite" color="text-emerald-400" />
                        </div>

                        <div className="mt-12 w-full space-y-4">
                           <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                              <div>
                                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">A'zo bo'lingan sana</p>
                                 <p className="font-bold text-white/80">{new Date(user?.createdAt).toLocaleDateString('uz-UZ')}</p>
                              </div>
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400">
                                 <Target size={24} />
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}

                    {activeProfileTab === 'edit' && (
                      <motion.div key="edit" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-md mx-auto w-full">
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                           <div className="flex flex-col items-center mb-10">
                              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/10 mb-4 bg-white/5 relative group cursor-pointer">
                                 <img src={avatarFile ? URL.createObjectURL(avatarFile) : (user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")} alt="preview" className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                                    <Save size={24} className="text-white" />
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Rasm almashtirish</p>
                           </div>

                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Foydalanuvchi nomi</label>
                                 <input 
                                   type="text" 
                                   className="glass-input w-full p-5 rounded-2xl bg-white/5" 
                                   value={editUsername} 
                                   onChange={(e) => setEditUsername(e.target.value)} 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Email manzil</label>
                                 <input 
                                   type="email" 
                                   className="glass-input w-full p-5 rounded-2xl bg-white/5" 
                                   value={editEmail} 
                                   onChange={(e) => setEditEmail(e.target.value)} 
                                 />
                              </div>
                           </div>

                           <button 
                             disabled={isUpdatingProfile}
                             className="glass-button w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl relative overflow-hidden"
                           >
                              {isUpdatingProfile ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                              {isUpdatingProfile && (
                                <motion.div className="absolute inset-0 bg-blue-500/20" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                              )}
                           </button>
                        </form>
                      </motion.div>
                    )}

                    {activeProfileTab === 'notes' && (
                      <motion.div key="notes" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-5 rounded-3xl border border-white/5">
                           <div className="flex items-center gap-3">
                              <BookOpen size={20} className="text-blue-400"/>
                              <span className="font-bold text-sm tracking-tight text-white/80">Raqamli Kundalik</span>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                              {saveStatus === 'saving' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full" />}
                              <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">
                                {saveStatus === 'saved' ? 'Saqlandi' : saveStatus === 'saving' ? 'Saqlanmoqda...' : 'O\'zgartirildi'}
                              </span>
                           </div>
                        </div>
                        
                        <textarea
                          autoFocus
                          className="flex-1 w-full min-h-[400px] glass-input border-none focus:ring-0 bg-white/[0.02] p-8 rounded-[40px] text-lg leading-relaxed custom-scrollbar font-medium"
                          placeholder="Bugungi g'oyalaringizni yozing..."
                          value={noteContent}
                          onChange={(e) => {
                            setNoteContent(e.target.value);
                            setSaveStatus('unsaved');
                          }}
                        />
                        <p className="text-[10px] text-white/10 text-center font-bold uppercase tracking-widest italic">Ma'lumotlar avtomatik ravishda saqlanadi</p>
                      </motion.div>
                    )}

                    {activeProfileTab === 'ranking' && (
                      <motion.div key="ranking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-6">
                         <div className="text-center mb-10">
                            <h3 className="text-2xl font-black text-white mb-2">Global Reyting</h3>
                            <p className="text-white/30 text-xs font-medium uppercase tracking-[0.2em]">Eng kuchli foydalanuvchilar top-10 taligi</p>
                         </div>

                         <div className="space-y-3">
                            {ranking.length > 0 ? ranking.map((entry, index) => (
                              <div key={entry.id} className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${entry.id === user?.id ? 'bg-blue-500/10 border-blue-500/30 scale-[1.02] shadow-xl' : 'bg-white/5 border-white/5'}`}>
                                 <div className={`w-10 h-10 flex items-center justify-center font-black text-lg ${index < 3 ? 'text-yellow-400' : 'text-white/20'}`}>
                                    {index + 1}
                                 </div>
                                 <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10">
                                    <img src={entry.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`} alt="avatar" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{entry.username}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{entry.totalTasksCompleted || 0} ta vazifa</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-lg font-black text-yellow-400">{entry.coinsBalance}</p>
                                    <p className="text-[8px] font-black text-yellow-500/50 uppercase tracking-widest">Gold</p>
                                 </div>
                              </div>
                            )) : (
                              <div className="text-center py-20 text-white/20 font-black uppercase tracking-widest">Ma'lumotlar yuklanmoqda...</div>
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


        {/* Mobile App-like Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 md:h-20 z-50 flex items-center justify-around px-4 pb-safe">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-lg border-t border-white/5 shadow-2xl" />
           {menuItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center w-full h-full z-10 py-2">
                  <motion.div
                    animate={{ 
                      y: isActive ? -4 : 0,
                      scale: isActive ? 1.1 : 1,
                      color: isActive ? '#60a5fa' : '#9ca3af'
                    }}
                    className="relative"
                  >
                    {item.icon}
                    {isActive && (
                      <motion.div 
                        layoutId="navPill"
                        className="absolute -inset-3 bg-blue-500/10 rounded-2xl -z-10 blur-sm"
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-black mt-1 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
               </Link>
             )
           })}
        </nav>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all relative overflow-hidden group ${active ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      <span className={`${active ? 'text-blue-400' : 'group-hover:text-white'}`}>{icon}</span>
      <span className={`font-black tracking-tight ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebarActive"
          className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
        />
      )}
    </Link>
  );
}

function StatBox({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <div className="bg-white/5 p-6 rounded-[30px] border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/10 hover:scale-105 group">
      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 group-hover:text-white/40 transition-colors">{label}</p>
      <p className={`text-2xl md:text-3xl font-black ${color} drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>{value}</p>
    </div>
  );
}

