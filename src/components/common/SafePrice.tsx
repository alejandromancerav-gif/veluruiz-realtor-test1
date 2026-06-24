import { formatPrice } from '../../utils/format';

interface SafePriceProps {
  price?: number;
}

export default function SafePrice({ price }: SafePriceProps) {
  // Aquí usamos la función que definimos arriba
  return <>{formatPrice(price)}</>;
}