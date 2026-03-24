export const getLineColor = (lineName: string): string => {
  const name = lineName.toLowerCase();

  // Metrô
  if (name.includes('azul')) return '#005596';
  if (name.includes('verde')) return '#007e5e';
  if (name.includes('vermelha')) return '#ee3135';
  if (name.includes('amarela')) return '#fff000';
  if (name.includes('lilás') || name.includes('lilas')) return '#9b3894';
  if (name.includes('prata')) return '#9e9e9e';

  // CPTM
  if (name.includes('rubi')) return '#ca016b';
  if (name.includes('diamante')) return '#b7d333';
  if (name.includes('esmeralda')) return '#009a9b';
  if (name.includes('turquesa')) return '#00a4ad';
  if (name.includes('coral')) return '#f68b1f';
  if (name.includes('safira')) return '#003a8e';
  if (name.includes('jade')) return '#00b052';

  // Cor padrão caso não encontre
  return '#333333';
};