import { Car, ArrowRightLeft, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrafficProps {
  roadName: string;
  status: string;
  direction: string;
  updatedAt: string | null;
}

export default function TrafficCard({ roadName, status, direction, updatedAt }: TrafficProps) {
  // Lógica para definir a cor baseada na gravidade do trânsito
  const isCritical = status.toLowerCase().includes('parado') ||
    status.toLowerCase().includes('interrompido') ||
    status.toLowerCase().includes('congestionado');

  const isSlow = status.toLowerCase().includes('lento') ||
    status.toLowerCase().includes('intensidade') ||
    status.toLowerCase().includes('lentidão');

  const statusColor = isCritical ? '#ef4444' : isSlow ? '#f59e0b' : '#10b981';
  const textColor = isCritical ? 'text-red-400' : isSlow ? 'text-yellow-400' : 'text-emerald-400';

  const timeAgo = updatedAt
    ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true, locale: ptBR })
    : 'Sem dados';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f] p-5 transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_25px_rgba(0,0,0,0.5)]">

      {/* Efeito de iluminação interna no topo */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${statusColor}, transparent 50%)`
        }}
      />

      {/* Indicador de status no topo (Barra de Progresso Visual) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5">
        <div
          className="h-full transition-all duration-700 w-0 group-hover:w-full"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        {/* Cabeçalho do Card */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5 max-w-[80%]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
              Via / Rodovia
            </h3>
            <p className="text-sm font-bold text-white truncate leading-tight">
              {roadName}
            </p>
          </div>
          <div className={`rounded-lg p-2 bg-zinc-950 border border-white/5 ${textColor}`}>
            <Car className="h-4 w-4" />
          </div>
        </div>

        {/* Sentido e Direção */}
        <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5">
          <ArrowRightLeft className="h-3 w-3 text-zinc-600" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase text-zinc-600 tracking-wider">Sentido</span>
            <span className="text-[10px] font-semibold text-zinc-300 truncate">{direction}</span>
          </div>
        </div>

        {/* Status em Destaque */}
        <div className="flex items-center gap-2 mt-1">
          {isCritical && <AlertCircle className="h-3 w-3 text-red-500 animate-pulse" />}
          <span className={`text-xs font-black uppercase tracking-widest ${textColor}`}>
            {status}
          </span>
        </div>

        {/* Rodapé com Timestamp */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-white/5">
          <Clock className="h-3 w-3 text-zinc-700" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase">
            Atualizado {timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}