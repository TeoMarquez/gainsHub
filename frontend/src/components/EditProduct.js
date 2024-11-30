import React, { useState, useEffect } from 'react';
import './styles/EditProduct.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditProduct = ({ product, onClose }) => {
    const [productoID, setProductoID] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [masinfo, setMasinfo] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [stock, setStock] = useState('');
    const [categoriaID, setCategoriaID] = useState('');
    const [talle, setTalle] = useState('');
    const [color, setColor] = useState('');
    const [coleccionID, setColeccionID] = useState('');
    const [lo_mejor, setLoMejor] = useState('No');
    const [novedad, setNovedad] = useState('No');
    const [imagenFile, setImagenFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [colecciones, setColecciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Añadido: Estado para manejar la carga
    const [callout, setCallout] = useState({ show: false, title: '', message: '', styleClass: '' }); // Añadido: Estado para el callout

    useEffect(() => {
        if (product) {
            setProductoID(String(product.productoID) || '');
            setDescripcion(product.descripcion || '');
            setMasinfo(product.masinfo || '');
            setPrecioUnitario(String(product.precioUnitario) || '');
            setStock(String(product.stock) || '');
            setCategoriaID(String(product.categoriaID) || '');
            setTalle(product.talle || '');
            setColor(product.color || '');
            setColeccionID(String(product.coleccionID) || '');
            setLoMejor(product.lo_mejor ? 'Sí' : 'No');
            setNovedad(product.novedad ? 'Sí' : 'No');
            setImagePreview(product.img ? `${backendUrl}/uploads/${product.img}` : '');
        }
    }, [product]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/viewAllCategorias`);
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        const fetchColecciones = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/viewAllColecciones`);
                const data = await response.json();
                setColecciones(data);
            } catch (error) {
                console.error('Error al obtener las colecciones:', error);
            }
        };

        fetchCategorias();
        fetchColecciones();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'id':
                setProductoID(value);
                break;
            case 'descripcion':
                setDescripcion(value);
                break;
            case 'masinfo':
                setMasinfo(value);
                break;
            case 'precio':
                setPrecioUnitario(value);
                break;
            case 'stock':
                setStock(value);
                break;
            case 'categoria':
                setCategoriaID(value);
                break;
            case 'talle':
                setTalle(value);
                break;
            case 'color':
                setColor(value);
                break;
            case 'coleccion':
                setColeccionID(value);
                break;
            case 'lo_mejor':
                setLoMejor(value);
                break;
            case 'novedad':
                setNovedad(value);
                break;
            default:
                break;
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setImagenFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagenFile(null);
            setImagePreview('');
        }
    };

    const handleSave = async () => {
        const productoIDString = String(productoID).trim();
        const descripcionString = descripcion.trim();
        const masinfoString = masinfo.trim();
        const precioUnitarioString = precioUnitario.trim();
        const stockString = String(stock).trim();
        const categoriaIDString = String(categoriaID).trim();
        const talleString = talle.trim();
        const colorString = color.trim();
        const coleccionIDString = String(coleccionID).trim();
        const lo_mejorNumber = lo_mejor === 'Sí' ? 1 : 0;
        const novedadNumber = novedad === 'Sí' ? 1 : 0;

        if (!productoIDString) {
            alert('El ID del producto es requerido');
            return;
        }

        if (!descripcionString || !masinfoString || !precioUnitarioString || !stockString || !categoriaIDString || !talleString || !colorString || !coleccionIDString) {
            alert('Todos los campos son requeridos');
            return;
        }

        if (window.confirm('¿Estás seguro de que deseas guardar los cambios?')) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('productoID', productoIDString);
            formData.append('descripcion', descripcionString);
            formData.append('masinfo', masinfoString);
            formData.append('precioUnitario', precioUnitarioString);
            formData.append('stock', stockString);
            formData.append('categoriaID', categoriaIDString);
            formData.append('talle', talleString);
            formData.append('color', colorString);
            formData.append('coleccionID', coleccionIDString);
            formData.append('lo_mejor', lo_mejorNumber);
            formData.append('novedad', novedadNumber);
            if (imagenFile) {
                formData.append('imagen', imagenFile);
            }
            try {
                const response = await fetch(`${backendUrl}/api/updateProduct`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error al editar el producto: ${errorData.message}`);
                }

                setCallout({
                    show: true,
                    title: 'Éxito',
                    message: 'Producto editado con éxito.',
                    styleClass: 'callout-success',
                });

                setTimeout(() => {
                    setCallout({ show: false, title: '', message: '', styleClass: '' });
                    onClose(); // Cerrar el modal
                }, 3000);

            } catch (error) {
                console.error('Error al editar el producto:', error);
                alert(`Hubo un error al editar el producto: ${error.message}`);
            } finally {
                setIsLoading(false); // Desactivar el estado de carga
            }
        }
    };

    return (
        <div className="container">
            <h2 className="header">Editar Producto</h2>

            {callout.show && (
                <div className={`fixed-callout ${callout.styleClass}`}>
                    <div className="callout-title">{callout.title}</div>
                    <div className="callout-message">{callout.message}</div>
                </div>
            )}

            <form className="formContainer" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="imageContainer">
                    <input 
                        type="file" 
                        name="imagen" 
                        className="imageInput" 
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                       <div style={{ marginTop: '15px' }}>
                       <img
                           src={imagePreview}
                           alt="Vista previa"
                           style={{
                               maxWidth: '200px',
                               maxHeight: '190px',
                               objectFit: 'cover',
                               borderRadius: '5px',
                           }}
                       />
                        </div>
                    )}
                </div>
                <div className="form">
                    <div className="inputGroup">
                        <label>ID del producto</label>
                        <input type="text" name="id" className="input" value={productoID} onChange={handleInputChange} required />
                    </div>
                    <div className="inputGroup">
                        <label>Nombre del producto</label>
                        <input type="text" name="descripcion" className="input" value={descripcion} onChange={handleInputChange} required />
                    </div>
                    <div className="inputGroup">
                        <label>Información adicional</label>
                        <textarea name="masinfo" className="textarea" value={masinfo} onChange={handleInputChange} required />
                    </div>
                    <div className="inputGroup">
                        <label>Precio:</label>
                        <input type="text" name="precio" className="input" value={precioUnitario} onChange={handleInputChange} required />
                    </div>
                    <div className="inputGroup">
                        <label>Categoría:</label>
                        <select name="categoria" className="select" value={categoriaID} onChange={handleInputChange} required>
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.categoriaID} value={categoria.categoriaID}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="inputGroup">
                        <label>Colección:</label>
                        <select name="coleccion" className="select" value={coleccionID} onChange={handleInputChange} required>
                            <option value="">Selecciona una colección</option>
                            {colecciones.map((coleccion) => (
                                <option key={coleccion.coleccionID} value={coleccion.coleccionID}>
                                    {coleccion.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="inputGroup">
                        <label>Stock:</label>
                        <input type="text" name="stock" className="input" value={stock} onChange={handleInputChange} required />
                    </div>
                    <div className="inputGroup">
                        <label>Talle:</label>
                        <input type="text" name="talle" className="input" value={talle} onChange={handleInputChange} required />
                    </div>
                    <div className="inputGroup">
                        <label>Color:</label>
                        <input type="text" name="color" className="input" value={color} onChange={handleInputChange} required />
                    </div>
                    <div className="inputGroup">
                        <label>¿Es lo mejor?</label>
                        <select name="lo_mejor" className="select" value={lo_mejor} onChange={handleInputChange} required>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="inputGroup">
                        <label>¿Es novedad?</label>
                        <select name="novedad" className="select" value={novedad} onChange={handleInputChange} required>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
                <div className="buttonGroup">
                    <button type="button" className="buttonCancel" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="buttonSave" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
