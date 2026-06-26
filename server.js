import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

app.use(express.json());

// ---------------------------------------------------------------------
// ENDPOINT PARA OBTENER PRODUCTOS DESDE SHOPIFY
// ---------------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    const shopUrl = "71uenf-pc.myshopify.com";
    const apiVersion = "2026-04";
    const accessToken = SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ error: 'Falta configurar SHOPIFY_ADMIN_ACCESS_TOKEN' });
    }

    console.log(`📡 Solicitando productos a Shopify para la tienda: ${shopUrl}`);

    const response = await axios.get(
      `https://${shopUrl}/admin/api/${apiVersion}/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    // Enviar los productos directo al frontend
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error al consultar la API de Shopify:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Error interno al conectar con Shopify', 
      details: error.response?.data || error.message 
    });
  }
});

// ---------------------------------------------------------------------
// ENDPOINT PARA REGISTRAR EMAIL MARKETING (SUBSCRIBE)
// ---------------------------------------------------------------------
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, firstName } = req.body;
    const shopUrl = "71uenf-pc.myshopify.com";
    const apiVersion = "2026-04";
    const accessToken = SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ error: 'Falta configurar SHOPIFY_ADMIN_ACCESS_TOKEN' });
    }

    const customerPayload = {
      customer: {
        first_name: firstName || "Suscrito",
        email: email,
        verified_email: true,
        accepts_marketing: true,
        tags: "newsletter"
      }
    };

    const response = await axios.post(
      `https://${shopUrl}/admin/api/${apiVersion}/customers.json`,
      customerPayload,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ success: true, customer: response.data.customer });
  } catch (error) {
    console.error('❌ Error al suscribir cliente en Shopify:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudo procesar la suscripción' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor intermedio seguro corriendo en http://localhost:${PORT}`);
});
