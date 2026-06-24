export const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return 'Consultar';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};