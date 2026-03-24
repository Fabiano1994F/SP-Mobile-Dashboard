export default function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Simula a barra lateral ou ícone */}
        <div className="w-1.5 h-12 bg-gray-700 rounded-full" />
        
        <div className="flex-1 space-y-3">
          {/* Simula o título da linha/via */}
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
          
          {/* Simula o status */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gray-700 rounded-full" />
            <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Simula o rodapé de atualização */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between">
        <div className="h-2 bg-gray-800 rounded w-1/4" />
        <div className="h-2 bg-gray-800 rounded w-1/4" />
      </div>
    </div>
  );
}