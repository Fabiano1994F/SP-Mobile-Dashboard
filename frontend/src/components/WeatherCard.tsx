'use client';

import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CloudRain, Sun, Cloud, CloudSun, CloudLightning, Thermometer, Droplets, Clock } from 'lucide-react';

// 1. Tipagem (Interface) baseada no que o Python vai enviar
interface WeatherProps {
  city: string;
  temp: number;
  condition: string;
  icon_code: string; // Ex: '01d', '09n' (do OpenWeatherMap)
  humidity: number;
  updated_at: string | null;
}

export default function WeatherCard({ city, temp, condition, icon_code, humidity, updated_at }: WeatherProps) {
  
  // 2. Mapeamento de Cores e Ícones Dinâmicos baseado no Clima
  const getWeatherTheme = (iconCode: string) => {
    // Pegamos apenas os primeiros dois números (ex: '01d' -> '01')
    const code = iconCode.substring(0, 2); 
    
    // Sol Limpo (Dia)
    if (code === '01') {
      return {
        icon: <Sun className="h-10 w-10 text-amber-400" />,
        color: '#fbbf24', // Amber
        bgGradient: 'radial-gradient(circle at top left, #fbbf24, transparent 70%)'
      };
    }
    
    // Algumas Nuvens / Céu Parcial
    if (code === '02' || code === '03') {
      return {
        icon: <CloudSun className="h-10 w-10 text-zinc-300" />,
        color: '#d4d4d8', // Zinc
        bgGradient: 'radial-gradient(circle at top left, #d4d4d8, transparent 70%)'
      };
    }

    // Nublado
    if (code === '04') {
      return {
        icon: <Cloud className="h-10 w-10 text-zinc-500" />,
        color: '#71717a', // Zinc darker
        bgGradient: 'radial-gradient(circle at top left, #71717a, transparent 70%)'
      };
    }

    // Chuva / Chuvisco
    if (code === '09' || code === '10') {
      return {
        icon: <CloudRain className="h-10 w-10 text-blue-400" />,
        color: '#60a5fa', // Blue
        bgGradient: 'radial-gradient(circle at top left, #60a5fa, transparent 70%)'
      };
    }

    // Tempestade / Raios
    if (code === '11') {
      return {
        icon: <CloudLightning className="h-10 w-10 text-purple-400" />,
        color: '#a78bfa', // Purple
        bgGradient: 'radial-gradient(circle at top left, #a78bfa, transparent 70%)'
      };
    }

    // Fallback (Névoa ou Desconhecido)
    return {
      icon: <Thermometer className="h-10 w-10 text-zinc-600" />,
      color: '#52525b', 
      bgGradient: 'radial-gradient(circle at top left, #52525b, transparent 70%)'
    };
  };

  const theme = getWeatherTheme(icon_code);

  // 3. Tratamento do tempo relativo (reutilizando lógica do LineStatusCard)
  const timeAgo = updated_at 
    ? formatDistanceToNow(parseISO(updated_at), { addSuffix: true, locale: ptBR })
    : 'Atualizando...';

  // Arredonda a temperatura para um número inteiro
  const tempRounded = Math.round(temp);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f] p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50">
      
      {/* Efeito de Brilho Dinâmico no Hover (Glow) */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: theme.bgGradient }} 
      />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Cabeçalho do Card */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-zinc-400 group-hover:text-white transition-colors">
              Clima Atual
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              {city}, SP
            </p>
          </div>
          
          {/* Ícone Grande Dinâmico (Cloud/Sun/Rain) */}
          <div className="opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
            {theme.icon}
          </div>
        </div>

        {/* Bloco de Temperatura Principal */}
        <div className="flex items-end gap-3 justify-center py-3">
          <p className="text-7xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform">
            {tempRounded}°
          </p>
          <div className="flex flex-col gap-0.5 pb-2">
            <p className="text-base font-bold text-white/90">
              Célsius
            </p>
            <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 group-hover:text-amber-400 transition-colors">
              {condition}
            </p>
          </div>
        </div>

        {/* Bloco de Detalhes Adicionais (Umidade) */}
        <div className="flex items-center gap-6 justify-center border-t border-white/5 pt-5 pb-1">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider">
                Umidade
              </span>
              <span className="text-sm font-bold text-zinc-300">
                {humidity}%
              </span>
            </div>
          </div>
          
          {/* Placeholder para Sete-Dias (Opcional Futuro) */}
          <div className="flex items-center gap-2 opacity-30">
            <Clock className="h-4 w-4 text-zinc-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider">
                Previsão
              </span>
              <span className="text-sm font-bold text-zinc-500">
                10:00h
              </span>
            </div>
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
        </div>
      </div>
    </div>
  );
}