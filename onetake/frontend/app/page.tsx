import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="glass-card max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            ONETAKE Platformasiga Xush Kelibsiz
          </h1>
          <p className="text-lg text-white/70">
            Kunlik vazifalar va maqsadlarni boshqarishning gamifikasiya qilingan yangicha usuli.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/login" className="glass-button w-full sm:w-auto">
            Tizimga kirish
          </Link>
          <Link href="/register" className="glass px-6 py-3 rounded-xl hover:bg-white/20 transition-all w-full sm:w-auto">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </main>
  );
}
