import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// 1. Creamos el pool de conexión de Postgres
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 2. Creamos el adaptador
const adapter = new PrismaPg(pool);

// 3. Pasamos el adaptador al constructor
const db = new PrismaClient({ adapter });

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randBath = (min: number, max: number) =>
  (Math.round((Math.random() * (max - min) + min) * 2) / 2).toFixed(1);
const pickSome = <T>(arr: T[], min: number, max: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, randInt(min, max));
};

const CITIES: Record<string, string[]> = {
  Caracas:   ['Las Mercedes', 'Los Palos Grandes', 'Altamira', 'La Castellana', 'El Rosal'],
  Valencia:  ['Las Acacias', 'El Viñedo', 'La Trigaleña', 'Prebo'],
  Maracaibo: ['Las Delicias', 'El Milagro', 'Bella Vista'],
  Maracay:   ['Las Delicias', 'El Limón', 'San Isidro'],
};

const TYPES = ['Penthouse', 'Casa', 'Apartamento', 'Oficina', 'Local Comercial'];

const AMENITIES = ['Piscina', 'Gimnasio', 'Terraza', 'Portero 24h', 'Ascensor', 'Área Social', 'Jardín', 'Generador'];

const STATUS_POOL = ['SOLD', 'RENTED', 'RENTED', 'PENDING'];

async function main() {
  console.log('⏳ Generando 75 propiedades de prueba...');

  try {
    const properties = Array.from({ length: 75 }, () => {
      const city = pick(Object.keys(CITIES));
      const zone = pick(CITIES[city]);
      const type = pick(TYPES);
      const operationType = Math.random() < 0.55 ? 'buy' : 'rent';
      const status = Math.random() < 0.87 ? 'AVAILABLE' : pick(STATUS_POOL);

      let price: string;
      let bedrooms: number;
      let bathrooms: string;
      let parkingSpaces: number;
      let squareMeters: number;

      if (type === 'Penthouse') {
        price = operationType === 'buy'
          ? String(randInt(300000, 600000))
          : String(randInt(2500, 4500));
        bedrooms = randInt(3, 5);
        bathrooms = randBath(3, 5);
        parkingSpaces = randInt(2, 4);
        squareMeters = randInt(200, 400);
      } else if (type === 'Casa') {
        price = operationType === 'buy'
          ? String(randInt(150000, 400000))
          : String(randInt(1200, 3000));
        bedrooms = randInt(3, 6);
        bathrooms = randBath(2, 4);
        parkingSpaces = randInt(2, 4);
        squareMeters = randInt(150, 500);
      } else if (type === 'Apartamento') {
        price = operationType === 'buy'
          ? String(randInt(80000, 200000))
          : String(randInt(700, 1800));
        bedrooms = randInt(1, 4);
        bathrooms = randBath(1, 3);
        parkingSpaces = randInt(1, 2);
        squareMeters = randInt(60, 200);
      } else if (type === 'Oficina') {
        price = operationType === 'buy'
          ? String(randInt(100000, 350000))
          : String(randInt(1000, 2500));
        bedrooms = 0;
        bathrooms = randBath(1, 2);
        parkingSpaces = randInt(1, 3);
        squareMeters = randInt(80, 300);
      } else {
        // Local Comercial
        price = operationType === 'buy'
          ? String(randInt(80000, 280000))
          : String(randInt(800, 2000));
        bedrooms = 0;
        bathrooms = randBath(1, 2);
        parkingSpaces = randInt(1, 2);
        squareMeters = randInt(50, 250);
      }

      return {
        title: `${type} en ${zone}, ${city}`,
        description: `${type} ubicado en ${zone}, ${city}. Excelente ubicación con fácil acceso a servicios.`,
        price,
        country: 'Venezuela',
        city,
        zone,
        bedrooms,
        bathrooms,
        parkingSpaces,
        squareMeters,
        status,
        type,
        operationType,
        images: ['https://example.com/1.jpg'],
        amenities: pickSome(AMENITIES, 2, 4),
      };
    });

    await db.property.createMany({ data: properties });
    console.log('✅ 75 propiedades creadas correctamente.');

  } catch (error) {
    console.error('❌ Error detallado:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await db.$disconnect());
