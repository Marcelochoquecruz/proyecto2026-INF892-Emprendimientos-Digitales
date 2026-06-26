// verify_created.js
import axios from 'axios';

const SHOP_URL = 'https://71uenf-pc.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-04';
const BASE_URL = `${SHOP_URL}/admin/api/${API_VERSION}`;

if (!ACCESS_TOKEN) {
  throw new Error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN environment variable.');
}

const headers = {
  'X-Shopify-Access-Token': ACCESS_TOKEN,
  'Content-Type': 'application/json',
};

const targetCollections = [
  'Cuadros con Pigmentos Minerales',
  'Artesanías de Minerales',
  'Piezas de Museo y Edición Limitada',
  'Minerales en Bruto y Pigmentos',
  'Pigmentos de Nuestras Tierras',
];

async function listCreated() {
  try {
    const scRes = await axios.get(`${BASE_URL}/smart_collections.json`, { headers });
    const smartCols = scRes.data.smart_collections.filter(col => targetCollections.includes(col.title));
    console.log('Created Smart Collections:');
    smartCols.forEach(col => console.log(`- ${col.id}: ${col.title}`));

    const prodRes = await axios.get(`${BASE_URL}/products.json?limit=250`, { headers });
    const prods = prodRes.data.products;
    console.log('\nCreated Products (by title match):');
    prods.forEach(p => {
      if (p.title.includes('Cuadro') || p.title.includes('Escultura') || p.title.includes('Collar') || p.title.includes('Pulsera') || p.title.includes('Tallado') || p.title.includes('Aretes') || p.title.includes('Réplica') || p.title.includes('Estatuilla') || p.title.includes('Vasija') || p.title.includes('Kit') || p.title.includes('Cuarzo') || p.title.includes('Lapislázuli') || p.title.includes('Obsidiana') || p.title.includes('Tierras') || p.title.includes('Arena') || p.title.includes('Arcilla')) {
        console.log(`- ${p.id}: ${p.title}`);
      }
    });
  } catch (err) {
    console.error('Verification error:', err.response?.data || err.message);
  }
}

listCreated();
