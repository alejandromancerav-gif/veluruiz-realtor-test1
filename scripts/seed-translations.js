const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const TYPE_MAP = {
  'Apartamento':     'Apartment',
  'Casa':            'House',
  'Penthouse':       'Penthouse',
  'Oficina':         'Office',
  'Local Comercial': 'Commercial Space',
};

// Grupo (b) — 1 propiedad con título manual
const MANUAL = {
  '00586b82-1e5c-4c66-8b9a-233abfe4efd8': {
    titleEn:       'Commercial Space in El Limón, Maracay',
    descriptionEn: 'Commercial Space located in El Limón, Maracay. Excellent location with easy access to services.',
  },
};

async function main() {
  const props = await prisma.property.findMany({
    where: { titleEn: null },
    select: { id: true, type: true, zone: true, city: true },
  });

  console.log(`Found ${props.length} properties to update.`);

  let updated = 0;
  for (const p of props) {
    const data = MANUAL[p.id] ?? (() => {
      const typeEn = TYPE_MAP[p.type] ?? p.type;
      return {
        titleEn:       `${typeEn} in ${p.zone}, ${p.city}`,
        descriptionEn: `${typeEn} located in ${p.zone}, ${p.city}. Excellent location with easy access to services.`,
      };
    })();

    await prisma.property.update({ where: { id: p.id }, data });
    updated++;
  }

  console.log(`✅ ${updated} properties updated.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
