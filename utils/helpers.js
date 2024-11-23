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