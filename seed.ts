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

async function main() {
  console.log('⏳ Insertando propiedad de prueba...');

  try {
    const testProperty = await db.property.create({
      data: {
        title: 'Espectacular Penthouse con Vista al Ávila',
        titleEn: 'Stunning Penthouse with Avila Mountain View',

        description: 'Exclusivo penthouse con acabados de primera.',
        descriptionEn: 'Exclusive penthouse with premium finishes.',

        price: '450000',

        country: 'Venezuela',

        city: 'Caracas',
        zone: 'Los Palos Grandes',

        bedrooms: 4,

        bathrooms: '4.5',

        parkingSpaces: 3,

        squareMeters: 320,

        status: 'AVAILABLE',

        type: 'Penthouse',

        operationType: 'sale',

        images: [
          'https://example.com/1.jpg'
        ],

        amenities: [
          'Terraza',
          'Ascensor Privado'
        ],
      },
    });

    console.log('✅ Propiedad creada con ID:', testProperty.id);

  } catch (error) {
    console.error('❌ Error detallado:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await db.$disconnect());