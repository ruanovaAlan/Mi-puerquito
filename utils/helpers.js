import { chartColors } from './colors';


export const formatNumber = (value) => {
  if (value >= 1000 && value < 1000000) {
    return `${(value / 1000).toFixed(1)}k`; // 1000 -> 1k
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`; // 1000000 -> 1M
  }
  return value.toString(); // Si es menor a 1000, retorna el número sin cambios
};

export const categories = {
  Comida: '🍔',
  Transporte: '🚗',
  Diversión: '🎮',
  Salud: '🏥',
  Educación: '📚',
  Ropa: '👗',
  Regalos: '🎁',
  Otros: '💸',
};

export const transformToPieData = (transactions) => {
  const aggregatedData = Object.entries(
    transactions.reduce((acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {})
  );


  const totalAmount = aggregatedData.reduce((sum, [, value]) => sum + value, 0);


  const maxCategory = aggregatedData.reduce(
    (max, [category, value]) => {
      if (value > max.value) {
        return { category, value, percentage: ((value / totalAmount) * 100).toFixed(2) };
      }
      return max;
    },
    { category: null, value: 0, percentage: "0.00" }
  );


  const pieData = aggregatedData.map(([category, value], index) => ({
    value,
    percentage: ((value / totalAmount) * 100).toFixed(1),
    color: chartColors[index % chartColors.length],
    gradientCenterColor: chartColors[index % chartColors.length],
    label: `${category}`,
  }));

  return { pieData, maxCategory };
};

