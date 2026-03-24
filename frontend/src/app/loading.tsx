import SkeletonCard from '@/components/SkeletonCard';

export default function Loading() {
  // Criamos um array de 6 itens para preencher o grid inicial
  const skeletons = Array.from({ length: 6 });

  return (
    <main className="min-h-screen p-8 bg-[#0a0a0a] text-white">
      <header className="mb-10">
        <div className="h-8 bg-gray-800 rounded w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-900 rounded w-64 animate-pulse" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  );
}