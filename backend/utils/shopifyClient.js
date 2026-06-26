// utils/shopifyClient.js
import axios from 'axios';

export async function getShopifyAccessToken(shop, code) {
  const url = `https://${shop}/admin/oauth/access_token`;
  const payload = {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code
  };
  const response = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data.access_token;
}
