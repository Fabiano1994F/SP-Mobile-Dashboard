import { Train, CheckCircle2, AlertTriangle } from "lucide-react";

interface GeneralStatusProps {
  lines: any[] | null;
}

export default function GeneralStatus({ lines }: GeneralStatusProps) {
  const totalLines = lines?.length || 0;
  const normalOps = lines?.filter(l => l.status.toLowerCase().includes('normal')).length || 0;
  const issues = totalLines - normalOps;

  const stats = [
    { 
      label: "Total de Linhas", 
      value: totalLines, 
      icon: Train, 
      color: "text-blue-400",
      borderColor: "group-hover:border-blue-500/30",
      glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
      bgGradient: "from-blue-500/10"
    },
    { 
      label: "Operação Normal", 
      value: normalOps, 
      icon: CheckCircle2, 
      color: "text-green-400",
      borderColor: "group-hover:border-green-500/30",
      glow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]",
      bgGradient: "from-green-500/10"
    },
    { 
      label: "Atenção / Ocorrências", 
      value: issues, 
      icon: AlertTriangle, 
      color: issues > 0 ? "text-yellow-400" : "text-zinc-600",
      borderColor: issues > 0 ? "group-hover:border-yellow-500/30" : "group-hover:border-zinc-500/30",
      glow: issues > 0 ? "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]" : "",
      bgGradient: issues > 0 ? "from-yellow-500/10" : "from-zinc-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f] p-6 transition-all duration-300 ${stat.borderColor} ${stat.glow}`}
        >
          {/* Efeito de Gradiente no Fundo ao dar Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-white">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-zinc-600">unid</span>
              </div>
            </div>

            <div className={`rounded-2xl p-4 bg-zinc-950 border border-white/5 ${stat.color} shadow-inner`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>

          {/* Linha decorativa inferior com brilho */}
          <div className={`absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-transparent via-current to-transparent ${stat.color.replace('text', 'bg')}`} />
        </div>
      ))}
    </div>
  );
}