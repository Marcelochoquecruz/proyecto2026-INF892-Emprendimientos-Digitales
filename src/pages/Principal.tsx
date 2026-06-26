
import Carrousel from '../components/slider';
import Menu from '../components/menu';
import Footer from '../components/footer';
import CatalogoProductos from './shopify'; // Importamos el nuevo catálogo de Shopify

const Principal = () => {
  return (
    <div>
      {/* 1. Slider interactivo de la Casa Museo */}
      <Carrousel />
      
      {/* 2. Bloque animado con las Salas de Exhibición */}
      <Menu />
      
      {/* 3. Catálogo exclusivo de productos vinculados a Shopify */}
      <CatalogoProductos />
      
      {/* 4. Pie de página institucional */}
      <Footer />
    </div>
  );
};

export default Principal;