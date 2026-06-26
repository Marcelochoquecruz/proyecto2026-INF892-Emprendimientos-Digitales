// routes/shopify.js
import express from 'express';
import { getShopifyAccessToken } from '../utils/shopifyClient.js';

const router = express.Router();

/**
 * GET /auth/shopify?shop=myshop.myshopify.com
 * Redirects the user to Shopify's OAuth authorization screen.
 */
router.get('/shopify', (req, res) => {
  const { shop } = req.query;
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }
  const clientId = process.env.SHOPIFY_API_KEY;
  const redirectUri = `${process.env.SERVER_URL || 'http://localhost:5000'}/auth/shopify/callback`;
  const scopes = 'read_products,write_products'; // adjust as needed
  const state = 'secure_random_state'; // in production generate a real nonce
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  res.redirect(authUrl);
});

/**
 * GET /auth/shopify/callback?shop=...&code=...&state=...
 * Exchanges the temporary code for a permanent access token.
 */
router.get('/shopify/callback', async (req, res) => {
  const { shop, code, state } = req.query;
  if (!shop || !code) {
    return res.status(400).json({ error: 'Missing shop or code' });
  }
  try {
    const token = await getShopifyAccessToken(shop, code);
    // Set short‑lived HTTP‑only cookie
    res.cookie('shopify_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000 // 10 minutes
    });
    // Simple HTML page to inform user of success; React app can later fetch /auth/token
    res.send('<html><body><h2>Autenticación exitosa. Puedes cerrar esta ventana.</h2></body></html>');
  } catch (err) {
    console.error('Token exchange error:', err);
    res.status(500).json({ error: 'Failed to obtain token' });
  }
});

/**
 * GET /auth/token
 * Returns the token stored in the HTTP‑only cookie.
 */
router.get('/token', (req, res) => {
  const token = req.cookies?.shopify_token;
  if (!token) {
    return res.status(401).json({ error: 'No token available' });
  }
  res.json({ token });
});

export default router;
