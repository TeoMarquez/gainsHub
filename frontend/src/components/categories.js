import axios from 'axios';
import BocaCamiseta from '../assets/images/Boca camiseta.jpg';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const loadCategories = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/categoriesAndCollections`);
    const categories = response.data;
    console.log(categories); // Verifica la estructura de los datos recibidos

    if (!Array.isArray(categories)) {
      throw new Error('La respuesta no es un array');
    }

    return categories.map(category => {
      // Inicializa los productos de la categoría
      let products = Array.isArray(category.productos) ? category.productos.map(product => ({
        id: product.productoID,
        name: product.descripcion,
        description: product.descripcion,
        price: product.precioUnitario.toString(),
        imageUrl: product.img || BocaCamiseta, // Usa la imagen por defecto si no hay una URL
        colors: product.color ? product.color.split(',') : [],
        sizes: product.talle ? product.talle.split(',') : [],
        collection: category.coleccionNombre || 'General',
        lo_mejor: !!product.lo_mejor,
        novedad: !!product.novedad,
      })) : [];

      // Procesa los productos dentro de las colecciones
      if (Array.isArray(category.colecciones)) {
        category.colecciones.forEach(coleccion => {
          if (Array.isArray(coleccion.productos)) {
            coleccion.productos.forEach(product => {
              products.push({
                id: product.productoID,
                name: product.descripcion,
                description: product.descripcion,
                price: product.precioUnitario.toString(),
                imageUrl: `${backendUrl}/uploads/${product.img.replace(/\\/g, '/')}`, 
                colors: product.color ? product.color.split(',') : [],
                sizes: product.talle ? product.talle.split(',') : [],
                collection: coleccion.coleccionNombre || 'General',
                lo_mejor: !!product.lo_mejor,
                novedad: !!product.novedad,
              });
            });
          }
        });
      }

      return {
        name: category.categoriaNombre || 'Sin Nombre',
        slug: category.categoriaNombre ? category.categoriaNombre.toLowerCase().replace(/\s+/g, '-') : 'sin-nombre',
        products,
      };
    });
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
    return [];
  }
};

let categories = [];

const initializeCategories = async () => {
  categories = await loadCategories();
  console.log(categories); // Verifica la estructura de los datos procesados
};

await initializeCategories();

export default categories;
