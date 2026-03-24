import { Activity, ShieldCheck, ShieldAlert } from 'lucide-react';

interface SystemStatusProps {
  lastUpdate: string | null;
}

export default function SystemStatus({ lastUpdate }: SystemStatusProps) {
  const isOnline = lastUpdate ? (new Date().getTime() - new Date(lastUpdate).getTime()) < 15 * 60 * 1000 : false;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
      {isOnline ? <ShieldCheck size={12} /> : <ShieldAlert size={12} className="animate-pulse" />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        Scraper: {isOnline ? 'Operacional' : 'Offline'}
      </span>
      <Activity size={10} className={isOnline ? 'animate-pulse' : 'opacity-20'} />
    </div>
  );
}