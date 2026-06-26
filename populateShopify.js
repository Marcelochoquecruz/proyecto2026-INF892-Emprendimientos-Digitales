#!/usr/bin/env node
/**
 * populateShopify.js
 *
 * Script de Node.js que crea colecciones y productos de prueba en la tienda de Shopify
 * sin configurar ubicaciones complejas de inventario (asumiendo stock no rastreado).
 * Utiliza axios y la Admin API REST (versión 2026-04).
 */

import axios from "axios";

// Configuración
const SHOP_URL = "71uenf-pc.myshopify.com";
const API_VERSION = "2026-04";
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN environment variable.");
}

const api = axios.create({
  baseURL: `https://${SHOP_URL}/admin/api/${API_VERSION}`,
  headers: {
    "X-Shopify-Access-Token": ACCESS_TOKEN,
    "Content-Type": "application/json",
  },
});

/**
 * Helper genérico para peticiones POST a la API.
 */
async function post(endpoint, payload) {
  const { data } = await api.post(endpoint, payload);
  return data;
}

/**
 * Crea una Custom Collection y devuelve su id.
 */
async function createCollection(title) {
  const payload = {
    custom_collection: {
      title,
      published: true,
    },
  };
  const result = await post("/custom_collections.json", payload);
  console.log(`✅ Colección creada → ${title} (id: ${result.custom_collection.id})`);
  return result.custom_collection.id;
}

/**
 * Crea un Product y lo vincula a una colección sin control de inventario.
 */
async function createProduct({
  title,
  body_html,
  price,
  tags,
  collectionId,
}) {
  const productPayload = {
    product: {
      title,
      body_html,
      vendor: "Potosí Artifacts",
      product_type: "Artesanía",
      tags,
      variants: [
        {
          price: price.toString(),
          sku: `PK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          inventory_management: null, // Desactiva el control de inventario para evitar errores de ubicación
        },
      ],
      published: true,
    },
  };

  const productRes = await post("/products.json", productPayload);
  const productId = productRes.product.id;
  console.log(`   🟢 Producto creado → ${title} (id: ${productId})`);

  // Relación Collect (producto → colección)
  const collectPayload = {
    collect: {
      product_id: productId,
      collection_id: collectionId,
    },
  };
  await post("/collects.json", collectPayload);
  console.log(`   🔗 Vinculado a colección ${collectionId}`);

  return productId;
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log("🚀 Iniciando poblamiento de la tienda Shopify...");

    // ---------- 1️⃣ Crear Colecciones ----------
    const collIds = {
      cuadros: await createCollection("Cuadros con Pigmentos Minerales"),
      resina: await createCollection("Artesanías en Resina y Minerales"),
      adornos: await createCollection("Adornos y Elementos de Galería"),
    };

    // ---------- 2️⃣ Crear y Asociar Productos ----------
    // Colección: Cuadros con Pigmentos Minerales
    await createProduct({
      title: "Cuadro texturizado con fragmentos de pirita y óleo",
      body_html:
        "<p>Obra única que combina la riqueza de la pirita con la suavidad del óleo, creando una textura que evoca las entrañas de la montaña.</p>",
      price: 350,
      tags: "arte, cuadro, pirita, óleo, mineral",
      collectionId: collIds.cuadros,
    });

    await createProduct({
      title: "Lienzo abstracto con azurita y malaquita",
      body_html:
        "<p>Explosión de colores azul y verde que captura la energía mineral de Potosí en forma abstracta.</p>",
      price: 420,
      tags: "arte, lienzo, azurita, malaquita, abstracto",
      collectionId: collIds.cuadros,
    });

    await createProduct({
      title: "Réplica del Cerro Rico con relieves minerales reales",
      body_html:
        "<p>Escultura en relieve que incorpora fragmentos auténticos de mineral, homenaje a la historia minera.</p>",
      price: 780,
      tags: "escultura, cerro rico, relieve, mineral, historia",
      collectionId: collIds.cuadros,
    });

    // Colección: Artesanías en Resina y Minerales
    await createProduct({
      title: "Joyero de resina epóxica con cuarzo y plata",
      body_html:
        "<p>Elegante joyero con incrustaciones de cuarzo puro y detalles en plata, perfectos para piezas preciosas.</p>",
      price: 195,
      tags: "joyero, resina, cuarzo, plata, artesanal",
      collectionId: collIds.resina,
    });

    await createProduct({
      title: "Llaveros geométricos con láminas de cobre nativo",
      body_html:
        "<p>Llaveros de diseño geométrico con finas láminas de cobre nativo, una pieza de historia viva.</p>",
      price: 45,
      tags: "llavero, cobre, geométrico, artesanal",
      collectionId: collIds.resina,
    });

    await createProduct({
      title: "Dijes de lujo encapsulados con cristales locales",
      body_html:
        "<p>Dijes finos que encapsulan cristales de la región, combinando modernidad y tradición.</p>",
      price: 120,
      tags: "dije, cristal, lujo, artesanal",
      collectionId: collIds.resina,
    });

    // Colección: Adornos y Elementos de Galería
    await createProduct({
      title: "Escultura minimalista de resina y base de roca volcánica",
      body_html:
        "<p>Escultura que juega con la simplicidad de la resina y la robustez de una roca volcánica.</p>",
      price: 560,
      tags: "escultura, resina, roca volcánica, minimalista",
      collectionId: collIds.adornos,
    });

    await createProduct({
      title: "Lámpara de noche con pantallas de calcita translúcida",
      body_html:
        "<p>Suave luz nocturna que atraviesa la calcita, creando un ambiente místico inspirado en la mina.</p>",
      price: 310,
      tags: "lámpara, calcita, noche, iluminación",
      collectionId: collIds.adornos,
    });

    await createProduct({
      title: "Pisapapeles artístico con geodas potosinas",
      body_html:
        "<p>Diseño elegante que resalta una geoda natural, protege tu escritorio con estilo mineral.</p>",
      price: 85,
      tags: "pisapapeles, geoda, artesanal, decoración",
      collectionId: collIds.adornos,
    });

    console.log("\n🎉 Todas las colecciones y productos fueron creados exitosamente en tu tienda.");
  } catch (err) {
    console.error("❌ Error al crear recursos:", err.response?.data || err.message);
  }
}

main();
