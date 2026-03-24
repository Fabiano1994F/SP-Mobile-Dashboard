export async function getMetroStatus() {
  const response = await fetch('https://ccm.artesp.sp.gov.br/metroferroviario/api/status/', {
    next: { revalidate: 300 } // Atualiza os dados a cada 5 minutos (300 segundos)
  });

  if (!response.ok) {
    throw new Error('Falha ao buscar dados do metrô');
  }

  return response.json();
}