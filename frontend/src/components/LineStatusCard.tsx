'use client';

import { getLineColor } from '@/utils/colors';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Train, Clock, ArrowRight, AlertTriangle, CheckCircle2, StopCircle } from 'lucide-react';

interface LineProps {
  name: string;
  status: string;
  updated_at: string | null; // Ajustado para snake_case como vem do Supabase/Python
}

export default function LineStatusCard({ name, status, updated_at }: LineProps) {
  
  // 1. Mapeamento Robusto de Temas baseado no Status Real do Metrô/CPTM
  const getStatusTheme = (statusText: string) => {
    const s = statusText.toLowerCase();
    
    // Status: OPERAÇÃO NORMAL / BOM
    if (s.includes('normal') || s.includes('bom') || s.includes('liberado')) {
      return {
        dot: 'bg-emerald-500',
        ping: 'bg-emerald-400',
        text: 'text-emerald-400/90',
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      };
    }
    
    // Status: VELOCIDADE REDUZIDA / ATENÇÃO / LENTIDÃO
    if (s.includes('reduzida') || s.includes('atenção') || s.includes('lentidão') || s.includes('maior tempo')) {
      return {
        dot: 'bg-amber-500',
        ping: 'bg-amber-400',
        text: 'text-amber-400',
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
      };
    }

    // Status: PARALISADA / INTERROMPIDA / ENCERRADA
    if (s.includes('paralisada') || s.includes('interrompida') || s.includes('encerrada') || s.includes('parada')) {
      return {
        dot: 'bg-rose-500',
        ping: 'bg-rose-400',
        text: 'text-rose-400',
        icon: <StopCircle className="h-4 w-4 text-rose-500" />
      };
    }

    // Caso padrão (Cinza/Desconhecido)
    return {
      dot: 'bg-zinc-500',
      ping: 'bg-zinc-400',
      text: 'text-zinc-400',
      icon: <Train className="h-4 w-4 text-zinc-500" />
    };
  };

  const theme = getStatusTheme(status);
  const lineColor = getLineColor(name);

  // 2. Tratamento seguro do tempo relativo
  const timeAgo = updated_at 
    ? formatDistanceToNow(parseISO(updated_at), { addSuffix: true, locale: ptBR })
    : 'Atualizando...';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f] p-5 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50">
      
      {/* Efeito de Brilho Interno (Glow) baseado na cor da linha */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ 
          background: `radial-gradient(circle at top left, ${lineColor}, transparent 70%)` 
        }} 
      />

      {/* Barra lateral de cor com Neon Effect */}
      <div 
        className="absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-1.5"
        style={{ 
          backgroundColor: lineColor,
          boxShadow: `2px 0 15px ${lineColor}66` // Aumentei um pouco a intensidade do neon
        }}
      />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-zinc-500 group-hover:text-white transition-colors">
              {name}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                {/* Ping animado (só aparece se o status for crítico ou normal) */}
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.ping}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.dot}`}></span>
              </div>
              
              <p className={`text-[11px] font-bold uppercase tracking-widest ${theme.text}`}>
                {status}
              </p>
            </div>
          </div>
          
          <div className="opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
            {theme.icon}
          </div>
        </div>

        {/* Rodapé do Card */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-zinc-600" />
            <span className="text-[10px] font-medium text-zinc-500 italic">
              {timeAgo}
            </span>
          </div>
          
          <button 
            title="Ver detalhes da linha"
            className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 p-1 hover:bg-white/5 rounded-full"
          >
            <ArrowRight className="h-3.5 w-3.5 text-zinc-400 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}