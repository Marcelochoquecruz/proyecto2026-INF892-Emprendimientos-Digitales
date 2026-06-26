// shopify_tasks.js
// This script performs the requested Shopify automation using an access token from the environment.
// It lists and deletes manual collections, creates smart collections, creates products, assigns them,
// and finally prints verification summaries.

import axios from 'axios';

// ==== CONFIGURATION ====
const SHOP_URL = 'https://71uenf-pc.myshopify.com'; // store URL (no trailing slash)
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-04'; // adjust as needed
const BASE_URL = `${SHOP_URL}/admin/api/${API_VERSION}`;

if (!ACCESS_TOKEN) {
  throw new Error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN environment variable.');
}

// Helper for request headers
const headers = {
  'X-Shopify-Access-Token': ACCESS_TOKEN,
  'Content-Type': 'application/json',
};

// ------- TASK 1: LIST & DELETE MANUAL (custom) collections -------
async function deleteManualCollections() {
  console.log('🏷️  Fetching manual (custom) collections...');
  const res = await axios.get(`${BASE_URL}/custom_collections.json`, { headers });
  const collections = res.data.custom_collections;
  console.log(`Found ${collections.length} manual collections.`);
  for (const col of collections) {
    console.log(`🗑️  Deleting collection ${col.id} – ${col.title}`);
    await axios.delete(`${BASE_URL}/custom_collections/${col.id}.json`, { headers });
  }
  console.log('✅  Manual collections deleted.');
  return collections.map(c => c.id);
}

// ------- TASK 2: CREATE SMART COLLECTIONS -------
const smartCollectionsData = [
  {
    title: 'Cuadros con Pigmentos Minerales',
    rules: [
      { column: 'type', relation: 'equals', condition: 'Cuadro' },
      { column: 'tag', relation: 'equals', condition: 'pigmento-mineral' },
    ],
    disjunctive: false,
  },
  {
    title: 'Artesanías de Minerales',
    rules: [
      { column: 'type', relation: 'equals', condition: 'Artesanía' },
      { column: 'tag', relation: 'equals', condition: 'artesania-mineral' },
    ],
    disjunctive: true,
  },
  {
    title: 'Piezas de Museo y Edición Limitada',
    rules: [
      { column: 'tag', relation: 'equals', condition: 'edicion-limitada' },
      { column: 'tag', relation: 'equals', condition: 'pieza-museo' },
    ],
    disjunctive: true,
  },
  {
    title: 'Minerales en Bruto y Pigmentos',
    rules: [
      { column: 'type', relation: 'equals', condition: 'Material' },
      { column: 'tag', relation: 'equals', condition: 'pigmento-puro' },
    ],
    disjunctive: true,
  },
  {
    title: 'Pigmentos de Nuestras Tierras',
    rules: [
      { column: 'tag', relation: 'equals', condition: 'origen-local' },
      { column: 'tag', relation: 'equals', condition: 'tierras-region' },
    ],
    disjunctive: true,
  },
];

async function createSmartCollections() {
  const created = [];
  console.log('✨  Creating smart collections...');
  for (const data of smartCollectionsData) {
    const payload = {
      smart_collection: {
        title: data.title,
        rules: data.rules,
        disjunctive: data.disjunctive,
        // Ensure collection is published
        published: true,
      },
    };
    const res = await axios.post(`${BASE_URL}/smart_collections.json`, payload, { headers });
    const col = res.data.smart_collection;
    console.log(`✅  Created smart collection ${col.id}: ${col.title}`);
    created.push(col);
  }
  return created;
}

// ------- TASK 3: CREATE PRODUCTS & ASSIGN TO COLLECTIONS -------
// Product definitions (array of objects with collectionTitle reference)
const productsData = [
  // Collection 1 products
  {
    collectionTitle: 'Cuadros con Pigmentos Minerales',
    title: 'Cuadro Amanecer en la Montaña',
    product_type: 'Cuadro',
    price: 450.0,
    compare_at_price: 550.0,
    tags: 'pigmento-mineral, edicion-limitada, paisaje',
    body_html: 'Óleo sobre lienzo utilizando pigmentos naturales de óxido de hierro extraídos de las montañas locales. Pieza única firmada por el artista. Dimensiones: 80x60cm.',
  },
  {
    collectionTitle: 'Cuadros con Pigmentos Minerales',
    title: 'Cuadro Noche Estrellada Mineral',
    product_type: 'Cuadro',
    price: 620.0,
    tags: 'pigmento-mineral, edicion-limitada, abstracto',
    body_html: 'Técnica mixta con lapislázuli molido y pigmentos de malaquita. Inspirado en las noches del desierto. Dimensiones: 100x80cm.',
  },
  {
    collectionTitle: 'Cuadros con Pigmentos Minerales',
    title: 'Cuadro Atardecer en el Valle',
    product_type: 'Cuadro',
    price: 380.0,
    tags: 'pigmento-mineral, paisaje',
    body_html: 'Pintura al óleo con tierras naturales de ocre y sombra. Captura la luz dorada del atardecer. Dimensiones: 70x50cm.',
  },
  {
    collectionTitle: 'Cuadros con Pigmentos Minerales',
    title: 'Cuadro Bosque Ancestral',
    product_type: 'Cuadro',
    price: 520.0,
    compare_at_price: 600.0,
    tags: 'pigmento-mineral, naturaleza',
    body_html: 'Obra elaborada con pigmentos de clorita y óxidos verdes. Representa un bosque milenario. Dimensiones: 90x70cm.',
  },
  {
    collectionTitle: 'Cuadros con Pigmentos Minerales',
    title: 'Cuadro Mar de Lapislázuli',
    product_type: 'Cuadro',
    price: 750.0,
    tags: 'pigmento-mineral, edicion-limitada, marino',
    body_html: 'Pintura exclusiva con lapislázuli afgano molido a mano. Tonos azules profundos y vibrantes. Dimensiones: 120x90cm. Pieza numerada.',
  },
  // Collection 2 products
  {
    collectionTitle: 'Artesanías de Minerales',
    title: 'Escultura Espíritu del Río',
    product_type: 'Artesanía',
    price: 280.0,
    tags: 'artesania-mineral, pieza-museo, escultura',
    body_html: 'Tallada a mano en jade verde extraído de ríos de la región. Cada pieza es única e irrepetible. Altura: 25cm.',
  },
  {
    collectionTitle: 'Artesanías de Minerales',
    title: 'Collar Artesanal de Cuarzo Rosa',
    product_type: 'Artesanía',
    price: 95.0,
    compare_at_price: 120.0,
    tags: 'artesania-mineral, joyeria, cuarzo',
    body_html: 'Collar elaborado con cuentas de cuarzo rosa pulidas a mano y engarce de plata .925. Largo: 45cm ajustable.',
  },
  {
    collectionTitle: 'Artesanías de Minerales',
    title: 'Pulsera de Obsidiana Negra',
    product_type: 'Artesanía',
    price: 65.0,
    tags: 'artesania-mineral, joyeria, obsidiana',
    body_html: 'Pulsera con cuentas de obsidiana volcánica y cierre de plata. Diámetro ajustable. Propiedades protectoras según tradiciones ancestrales.',
  },
  {
    collectionTitle: 'Artesanías de Minerales',
    title: 'Tallado en Madera y Turquesa',
    product_type: 'Artesanía',
    price: 180.0,
    tags: 'artesania-mineral, pieza-museo, tallado',
    body_html: 'Figura decorativa tallada en madera de cedro con incrustaciones de turquesa natural. Altura: 30cm. Pieza de colección.',
  },
  {
    collectionTitle: 'Artesanías de Minerales',
    title: 'Aretes de Malaquita y Plata',
    product_type: 'Artesanía',
    price: 110.0,
    tags: 'artesania-mineral, joyeria, malaquita',
    body_html: 'Aretes artesanales con piedras de malaquita pulida y montura de plata .925. Diseño geométrico único.',
  },
  // Collection 3 products
  {
    collectionTitle: 'Piezas de Museo y Edición Limitada',
    title: "Réplica de Máscara Ceremonial",
    product_type: 'Artesanía',
    price: 890.0,
    tags: 'pieza-museo, edicion-limitada, replica',
    body_html: 'Réplica exacta de máscara ceremonial precolombina. Elaborada con técnicas ancestrales y pigmentos minerales. Solo 10 piezas en el mundo.',
  },
  {
    collectionTitle: 'Piezas de Museo y Edición Limitada',
    title: "Cuadro Histórico 'Fundación'",
    product_type: 'Cuadro',
    price: 1200.0,
    tags: 'edicion-limitada, pieza-museo, historico',
    body_html: "Obra conmemorativa pintada con pigmentos minerales tradicionales. Representa la fundación de la Casa Museo. Pieza única numerada 1/5.",
  },
  {
    collectionTitle: 'Piezas de Museo y Edición Limitada',
    title: 'Estatuilla de Dios Solar',
    product_type: 'Artesanía',
    price: 650.0,
    tags: 'pieza-museo, edicion-limitada, mitologia',
    body_html: 'Estatuilla tallada en piedra volcánica con incrustaciones de oro. Representación del dios solar ancestral. Altura: 40cm.',
  },
  {
    collectionTitle: 'Piezas de Museo y Edición Limitada',
    title: "Cuadro 'Memoria Ancestral'",
    product_type: 'Cuadro',
    price: 980.0,
    tags: 'edicion-limitada, pieza-museo, abstracto',
    body_html: "Técnica mixta con tierras naturales y polvo de minerales preciosos. Obra que honra las raíces culturales. Dimensiones: 150x100cm.",
  },
  {
    collectionTitle: 'Piezas de Museo y Edición Limitada',
    title: 'Vasija Ceremonial Decorativa',
    product_type: 'Artesanía',
    price: 420.0,
    tags: 'pieza-museo, edicion-limitada, ceramica',
    body_html: 'Vasija de cerámica pintada a mano con pigmentos minerales. Réplica de pieza arqueológica. Altura: 35cm. Edición limitada.',
  },
  // Collection 4 products
  {
    collectionTitle: 'Minerales en Bruto y Pigmentos',
    title: 'Kit de Pigmentos Minerales Básico',
    product_type: 'Material',
    price: 85.0,
    compare_at_price: 100.0,
    tags: 'pigmento-puro, bruto, kit, origen-local',
    body_html: 'Set de 6 pigmentos minerales puros molidos a mano: ocre rojo, ocre amarillo, tierra de sombra, lapislázuli, malaquita y carbón vegetal. Frascos de 30g.',
  },
  {
    collectionTitle: 'Minerales en Bruto y Pigmentos',
    title: 'Cuarzo Rosa en Bruto (500g)',
    product_type: 'Material',
    price: 45.0,
    tags: 'bruto, cuarzo, origen-local',
    body_html: 'Cuarzo rosa natural sin pulir, ideal para colecciones o trabajos artesanales. Peso aproximado: 500g.',
  },
  {
    collectionTitle: 'Minerales en Bruto y Pigmentos',
    title: 'Lapislázuli Molido Extra Fino (100g)',
    product_type: 'Material',
    price: 180.0,
    tags: 'pigmento-puro, lapislazuli, premium',
    body_html: 'Pigmento de lapislázuli afgano molido extra fino. Calidad profesional para bellas artes. Frasco de 100g.',
  },
  {
    collectionTitle: 'Minerales en Bruto y Pigmentos',
    title: 'Obsidiana Volcánica en Bruto (1kg)',
    product_type: 'Material',
    price: 35.0,
    tags: 'bruto, obsidiana, origen-local',
    body_html: 'Piedra de obsidiana volcánica natural sin trabajar. Ideal para tallado o colecciones. Peso: 1kg aproximadamente.',
  },
  {
    collectionTitle: 'Minerales en Bruto y Pigmentos',
    title: 'Set de Tierras Naturales (8 colores)',
    product_type: 'Material',
    price: 120.0,
    compare_at_price: 150.0,
    tags: 'pigmento-puro, tierras, kit, origen-local',
    body_html: 'Colección completa de 8 tierras naturales: ocre rojo, ocre amarillo, tierra de sombra, tierra de siena, verde tierra, rojo veneciano, blanco de zinc y negro de humo.',
  },
  // Collection 5 products
  {
    collectionTitle: 'Pigmentos de Nuestras Tierras',
    title: 'Tierra Roja de la Sierra (250g)',
    product_type: 'Material',
    price: 55.0,
    tags: 'origen-local, tierras-region, pigmento-puro',
    body_html: 'Pigmento natural extraído de las montañas de la región norte. Color rojo intenso con matices terrosos. Peso: 250g.',
  },
  {
    collectionTitle: 'Pigmentos de Nuestras Tierras',
    title: 'Ocre Amarillo del Valle (250g)',
    product_type: 'Material',
    price: 50.0,
    tags: 'origen-local, tierras-region, pigmento-puro',
    body_html: 'Tierra ocre amarilla recolectada en los valles centrales. Tono cálido y luminoso. Peso: 250g.',
  },
  {
    collectionTitle: 'Pigmentos de Nuestras Tierras',
    title: 'Arena Volcánica Negra (500g)',
    product_type: 'Material',
    price: 40.0,
    tags: 'origen-local, tierras-region, bruto',
    body_html: 'Arena negra de origen volcánico, ideal para texturas y técnicas mixtas. Peso: 500g.',
  },
  {
    collectionTitle: 'Pigmentos de Nuestras Tierras',
    title: 'Arcilla Blanca Refinada (1kg)',
    product_type: 'Material',
    price: 30.0,
    tags: 'origen-local, tierras-region, arcilla',
    body_html: 'Arcilla blanca purificada de canteras locales. Perfecta para cerámica y escultura. Peso: 1kg.',
  },
  {
    collectionTitle: 'Pigmentos de Nuestras Tierras',
    title: 'Kit Completo de Tierras Regionales',
    product_type: 'Material',
    price: 195.0,
    compare_at_price: 240.0,
    tags: 'origen-local, tierras-region, kit, pigmento-puro',
    body_html: 'Colección exclusiva de 10 pigmentos minerales de nuestras tierras: 5 tierras coloridas, 3 arenas volcánicas, arcilla blanca y ocre premium. Presentación en frascos de vidrio.',
  },
];

async function createProductsAndAssign(smartCollections) {
  const collectionMap = {};
  for (const col of smartCollections) {
    collectionMap[col.title] = col.id;
  }
  const createdProducts = [];
  for (const prod of productsData) {
    const payload = {
      product: {
        title: prod.title,
        body_html: prod.body_html,
        product_type: prod.product_type,
        tags: prod.tags,
        variants: [{
          price: prod.price.toString(),
          ...(prod.compare_at_price && { compare_at_price: prod.compare_at_price.toString() }),
        }],
      },
    };
    const res = await axios.post(`${BASE_URL}/products.json`, payload, { headers });
    const created = res.data.product;
    console.log(`✅  Created product ${created.id}: ${created.title}`);
      // Smart collections auto‑include products based on rules; no manual collect needed.

    createdProducts.push(created);
  }
  return createdProducts;
}

async function verify() {
  console.log('\n🔎  Verifying creations...');
  const smartRes = await axios.get(`${BASE_URL}/smart_collections.json`, { headers });
  console.log(`Smart collections count: ${smartRes.data.smart_collections.length}`);
  const prodRes = await axios.get(`${BASE_URL}/products.json?limit=250`, { headers });
  console.log(`Products count: ${prodRes.data.products.length}`);
}

(async () => {
  try {
    await deleteManualCollections();
    const smartCols = await createSmartCollections();
    await createProductsAndAssign(smartCols);
    await verify();
    console.log('\n🎉  All tasks completed successfully!');
  } catch (err) {
    console.error('❌  Error during execution:', err.response?.data || err.message);
  }
})();
