import React, { useState, useEffect } from 'react';
import './styles/AddProducts.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddProducts = () => {
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
    const [callout, setCallout] = useState({ show: false, title: '', message: '', styleClass: '' });

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/viewAllCategorias`);
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                console.error('Error fetching categorias:', error);
            }
        };

        const fetchColecciones = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/viewAllColecciones`);
                const data = await response.json();
                setColecciones(data);
            } catch (error) {
                console.error('Error fetching colecciones:', error);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        const formData = new FormData();
        formData.append('productoID', productoID);
        formData.append('descripcion', descripcion);
        formData.append('masinfo', masinfo);
        formData.append('precioUnitario', precioUnitario);
        formData.append('stock', stock);
        formData.append('categoriaID', categoriaID);
        formData.append('talle', talle);
        formData.append('color', color);
        formData.append('coleccionID', coleccionID);
        formData.append('lo_mejor', lo_mejor === 'Sí' ? 1 : 0);
        formData.append('novedad', novedad === 'Sí' ? 1 : 0);
        if (imagenFile) {
            formData.append('imagen', imagenFile);
        }
      
        try {
            const response = await fetch(`${backendUrl}/api/addNewProduct`, {
                method: 'POST',
                body: formData,
            });
      
            if (!response.ok) {
                throw new Error(`Error al añadir el producto: ${response.statusText}`);
            }
      
            const result = await response.json();
            console.log('Producto añadido:', result);
            setCallout({
                show: true,
                title: 'Éxito',
                message: 'Producto añadido con éxito.',
                styleClass: 'callout-success',
            });
        } catch (error) {
            console.error('Error al añadir el producto:', error);
            setCallout({
                show: true,
                title: 'Error',
                message: 'Hubo un error al añadir el producto.',
                styleClass: 'callout-error',
            });
        }

        setTimeout(() => {
            setCallout({ show: false, title: '', message: '', styleClass: '' });
        }, 3000);
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

    return (
        <div className="container">
            <h2 className="header">Añadir Producto</h2>
            <p className="subHeader">Rellena los campos para añadir un nuevo producto.</p>
            <form className="formContainer" onSubmit={handleSubmit}>
                <div className={`imageContainer ${imagePreview ? 'withImage' : ''}`}>
                    {!imagePreview && <label className="imageLabel">Agrega una imagen del producto</label>}
                    <input 
                        type="file" 
                        name="imagen" 
                        className="imageInput" 
                        onChange={handleImageChange}
                        required 
                    />
                    {imagePreview ? (
                        <div className="imagePreviewContainer">
                            <img src={imagePreview} alt="Vista previa" className="imagePreview" />
                        </div>
                    ) : (
                        <div className="imagePlaceholder"></div>
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
                        <input type="text" name="color" className="input" value={color} onChange={handleInputChange} />
                    </div>
                    <div className="inputGroup">
                        <label>¿Es lo mejor?</label>
                        <select name="lo_mejor" className="select" value={lo_mejor} onChange={handleInputChange} required>
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                        </select>
                    </div>
                    <div className="inputGroup">
                        <label>¿Es novedad?</label>
                        <select name="novedad" className="select" value={novedad} onChange={handleInputChange} required>
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                        </select>
                    </div>
                    <button type="submit" className="button">Añadir Producto</button>
                </div>
            </form>

            {callout.show && (
                <div className={`fixed-callout ${callout.styleClass}`}>
                    <div className="callout-title">{callout.title}</div>
                    <div className="callout-message">{callout.message}</div>
                </div>
            )}
        </div>
    );
};

export default AddProducts;
