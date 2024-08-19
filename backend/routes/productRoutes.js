const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración del almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Filtros para permitir solo ciertos tipos de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const { updateProduct, addNewProduct, viewAllProducts, viewProducts, viewAllCategorias, viewAllColecciones, getCategoriesAndCollections, checkStock } = require('../controllers/productController');

// Rutas
router.post('/addNewProduct', upload.single('imagen'), addNewProduct);
router.post('/updateProduct', upload.single('imagen'), updateProduct);
router.get('/viewAllProducts', viewAllProducts);
router.get('/viewProducts', viewProducts);
router.get('/viewAllCategorias', viewAllCategorias);
router.get('/viewAllColecciones', viewAllColecciones);
router.get('/categoriesAndCollections', getCategoriesAndCollections); // Ruta añadida para obtener categorías y colecciones
router.get('/checkStock', checkStock); // Ruta añadida para obtener categorías y colecciones

module.exports = router;
