import { createClient } from '@/utils/supabase/server';
import LineStatusCard from '@/components/LineStatusCard';
import TrafficCard from '@/components/TrafficCard';
import WeatherCard from '@/components/WeatherCard';
import RefreshHandler from '@/components/RefreshHandler';
import GeneralStatus from '@/components/GeneralStatus';
import SystemStatus from '@/components/SystemStatus';
import { getMetroStatus } from '@/services/metroApi';

// FORÇA O NEXT.JS A NÃO FAZER CACHE (Essencial para dados que mudam via Python/API)
export const dynamic = 'force-dynamic'; 
export const revalidate = 60; 

export default async function Dashboard() {
  const supabase = await createClient();

  // --- 1. BUSCA DADOS DO METRÔ (API ARTESP) ---
  let metroLines = [];
  try {
    const apiData = await getMetroStatus();
    metroLines = apiData.empresas.flatMap((empresa: any) => 
      empresa.linhas.map((linha: any) => ({
        id: `${empresa.id}-${linha.codigo}`,
        nome_linha: linha.nome,
        status: linha.status.situacao,
        ultima_atualizacao: linha.status.atualizado_em
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar API ARTESP, tentando fallback no Supabase:", error);
    const { data: fallbackData } = await supabase
      .from('linha_status')
      .select('*')
      .order('nome_linha', { ascending: true });
    metroLines = fallbackData || [];
  }

  // --- 2. BUSCA DADOS DE TRÂNSITO (SUPABASE) ---
  const { data: trafficRoads, error: trafficError } = await supabase
    .from('traffic_status')
    .select('*')
    .order('road_name', { ascending: true });

  if (trafficError) console.error("Erro Supabase Trânsito:", trafficError.message);

  // --- 3. BUSCA DADOS DE CLIMA (SUPABASE - CORRIGIDO) ---
  // Usamos .single() para pegar o objeto direto, sem precisar de array[0]
  const { data: weatherData, error: weatherError } = await supabase
    .from('weather_status')
    .select('*')
    .eq('id', 1) 
    .single();

  if (weatherError) console.error("Erro Supabase Clima:", weatherError.message);

  // Define a última sincronização baseada no dado mais recente disponível
  const lastSync = metroLines?.[0]?.ultima_atualizacao || weatherData?.updated_at || new Date().toISOString();

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#050505] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black text-white selection:bg-blue-500/30">
      <RefreshHandler />

      {/* Cabeçalho */}
      <header className="mb-12 flex flex-col items-center text-center md:items-start md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
              Live Monitoring System
            </span>
          </div>
          <SystemStatus lastUpdate={lastSync} />
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          SP MOBILE
        </h1>
        <p className="text-zinc-500 text-sm font-medium tracking-[0.2em] uppercase mt-3">
          Painel Integrado de Mobilidade Urbana
        </p>
      </header>

      {/* Grid Superior: Clima + Status Geral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        <div className="lg:col-span-1">
          {weatherData ? (
            <WeatherCard 
              city={weatherData.city}
              temp={weatherData.temp}
              condition={weatherData.condition}
              icon_code={weatherData.icon_code}
              humidity={weatherData.humidity}
              updated_at={weatherData.updated_at}
            />
          ) : (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-[#0f0f0f] animate-pulse">
               <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Sincronizando clima...</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <GeneralStatus lines={metroLines} />
        </div>
      </div>

      {/* Seção de Trilhos */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] w-12 bg-gradient-to-r from-blue-600 to-transparent" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
            Status dos Trilhos (Live)
          </h2>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {metroLines.length > 0 ? (
            metroLines.map((line: any) => (
              <LineStatusCard
                key={line.id}
                name={line.nome_linha}
                status={line.status}
                updated_at={line.ultima_atualizacao}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-black/20">
              <p className="text-zinc-600 italic font-mono animate-pulse">Buscando dados em tempo real...</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Trânsito e Rodovias */}
      <section className="pb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] w-12 bg-gradient-to-r from-yellow-500 to-transparent" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
            Principais Vias e Rodovias
          </h2>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trafficRoads && trafficRoads.length > 0 ? (
            trafficRoads.map((road) => (
              <TrafficCard
                key={road.id}
                roadName={road.road_name}
                status={road.status}
                direction={road.direction}
                updatedAt={road.updated_at}
              />
            ))
          ) : (
            <div className="col-span-full py-24 text-center border border-dashed border-white/5 rounded-[2rem] bg-[#0a0a0a]">
              <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                Escaneando principais vias...
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}