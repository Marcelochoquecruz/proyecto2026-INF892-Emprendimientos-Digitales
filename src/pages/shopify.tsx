import { useEffect, useState, useMemo } from 'react';
import { ImageOff, Sparkles, Gem, ArrowRight, Check } from 'lucide-react';
import { SHOPIFY_PROXY_API_BASE, getShopifyProducts } from '../services/shopifyClient';

// Fallback images from current project assets
import pro1 from '../assets/logo.png'; // Fallback base
import pro2 from '../assets/logo.png';

interface ProductUI {
  id: string | number;
  title: string;
  description: string;
  price: string;
  tags: string[];
  imageUrl: string;
  handle: string;
  variantId: string | number | null;
}

export const ShopifyCatalog = () => {
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'arte' | 'resina' | 'decoracion'>('all');
  
  // Newsletter Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Fallback images map
  const fallbackImages = [pro1, pro2];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getShopifyProducts();
        
        // Map Shopify response to UI structure with fallback images
        const mapped: ProductUI[] = data.map((prod, index) => {
          // Parse HTML tags out of description
          const cleanDesc = prod.body_html 
            ? prod.body_html.replace(/<\/?[^>]+(>|$)/g, "") 
            : 'Una exquisita pieza exclusiva inspirada en la historia de Potosí.';
          
          const tagsArray = prod.tags 
            ? prod.tags.split(',').map(t => t.trim().toLowerCase()) 
            : [];

          // Retrieve price and variant info
          const variant = prod.variants && prod.variants[0];
          const price = variant 
            ? `Bs. ${parseFloat(variant.price).toFixed(0)}`
            : 'Consultar';

          return {
            id: prod.id,
            title: prod.title,
            description: cleanDesc,
            price,
            tags: tagsArray,
            imageUrl: prod.images && prod.images[0]?.src 
              ? prod.images[0].src 
              : fallbackImages[index % fallbackImages.length],
            handle: prod.handle,
            variantId: variant ? variant.id : null,
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("No se pudieron conectar los datos de la Casa Museo. Por favor, inicia el servidor Express.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    if (activeTab === 'arte') {
      return products.filter(p => p.tags.includes('arte') || p.tags.includes('cuadro'));
    }
    if (activeTab === 'resina') {
      return products.filter(p => p.tags.includes('resina') || p.tags.includes('llavero') || p.tags.includes('dije') || p.tags.includes('joyero'));
    }
    if (activeTab === 'decoracion') {
      return products.filter(p => p.tags.includes('decoración') || p.tags.includes('decoracion') || p.tags.includes('lámpara') || p.tags.includes('lampara') || p.tags.includes('pisapapeles') || p.tags.includes('escultura'));
    }
    return products;
  }, [products, activeTab]);

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setNewsletterStatus('loading');
      const response = await fetch(`${SHOPIFY_PROXY_API_BASE}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName }),
      });

      const resData = await response.json();

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage('¡Te has suscrito con éxito! Recibirás nuestras novedades minerales.');
        setEmail('');
        setFirstName('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(resData.error || 'Ocurrió un error al suscribirte.');
      }
    } catch (err) {
      console.error(err);
      setNewsletterStatus('error');
      setNewsletterMessage('No se pudo establecer conexión con el servicio de suscripción.');
    }
  };

  return (
    <>
      <style>{`
        .mineral-glow-card {
          position: relative;
          background: linear-gradient(180deg, #12141c 0%, #0c0e14 100%);
          border: 1px solid rgba(139, 92, 246, 0.15); /* Soft purple border */
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mineral-glow-card:hover {
          transform: translateY(-4px);
          border-color: rgba(234, 179, 8, 0.4); /* Gold accent border */
          box-shadow: 0 15px 30px -10px rgba(139, 92, 246, 0.25), 0 0 20px -5px rgba(234, 179, 8, 0.15);
        }
        .glow-title {
          font-family: 'Cinzel', serif;
          text-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
        }
      `}</style>

      <div className="min-h-screen bg-[#07080b] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 uppercase mb-4">
              <Sparkles size={12} className="animate-pulse" /> Casa Museo Potosí Mineral
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wide uppercase glow-title">
              Catálogo de Arte Mineral
            </h1>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Exclusivas piezas esculpidas y pintadas a mano inspiradas en la herencia minera del majestuoso Cerro Rico de Potosí.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 via-yellow-500 to-purple-600 mx-auto mt-6 rounded-full" />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
            {[
              { id: 'all', label: 'Ver Todo' },
              { id: 'arte', label: 'Cuadros con Pigmentos' },
              { id: 'resina', label: 'Artesanías en Resina' },
              { id: 'decoracion', label: 'Adornos de Galería' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all duration-300 border ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-slate-900 border-yellow-500 shadow-lg shadow-yellow-500/10'
                    : 'bg-[#10121a] text-gray-400 border-purple-900/30 hover:text-white hover:border-purple-500/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Catalog Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-yellow-500 rounded-full animate-spin" />
              <p className="text-sm tracking-widest text-yellow-500 uppercase font-medium">Buscando en la mina...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center p-8 bg-[#12141c] border border-purple-900/30 rounded-2xl shadow-xl">
              <ImageOff size={40} className="mx-auto mb-4 text-purple-400/50" />
              <p className="text-white font-semibold mb-2">Error de conexión</p>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{error}</p>
              <div className="p-3 bg-[#07080b] rounded border border-yellow-500/20 text-xs text-yellow-500/90 leading-normal">
                Asegúrate de ejecutar <code>node server.js</code> en el puerto 5000 para habilitar la sincronización.
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No se encontraron piezas en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredProducts.map(product => (
                <article key={product.id} className="mineral-glow-card rounded-2xl overflow-hidden flex flex-col group">
                  
                  {/* Image wrapper */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080b]/80 via-transparent to-transparent" />
                    
                    {/* Tag badge */}
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold bg-[#07080b]/80 border border-purple-500/30 text-purple-300 backdrop-blur-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                        <Gem size={16} className="text-yellow-500/70" />
                        {product.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-purple-900/20 pt-4 mt-auto">
                      <span className="text-2xl font-black text-yellow-500">
                        {product.price}
                      </span>
                      <a 
                        href={
                          product.variantId 
                            ? `https://71uenf-pc.myshopify.com/cart/${product.variantId}:1`
                            : `https://71uenf-pc.myshopify.com/products/${product.handle}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/20 hover:scale-105"
                      >
                        Adquirir <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Newsletter Box (Email Marketing Integration) */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#12141c] to-[#0c0e14] border border-purple-500/20 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay pointer-events-none" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 uppercase tracking-wide">
              Entérate de Próximas Galerías y Novedades
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">
              Sé el primero en enterarte de nuestras expediciones y lanzamientos de réplicas artísticas con geodas exclusivas de Potosí.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Tu Nombre"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#07080b] border border-purple-900/50 rounded-xl focus:outline-none focus:border-yellow-500 text-white text-sm"
              />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-[2] px-4 py-3 bg-[#07080b] border border-purple-900/50 rounded-xl focus:outline-none focus:border-yellow-500 text-white text-sm"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-700 text-slate-900 text-sm font-bold rounded-xl transition-all shadow-md shadow-yellow-500/10 uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                {newsletterStatus === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <>Suscripción</>
                )}
              </button>
            </form>

            {newsletterStatus === 'success' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 py-2.5 px-4 rounded-xl">
                <Check size={16} /> {newsletterMessage}
              </div>
            )}

            {newsletterStatus === 'error' && (
              <div className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl">
                {newsletterMessage}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ShopifyCatalog;
