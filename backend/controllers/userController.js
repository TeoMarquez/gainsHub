const db = require('../config/db.js');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de salt para el hash

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia esto si usas otro servicio
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para generar un token de verificación
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sendVerificationEmail = (to, verificationToken) => {
  const verificationLink = `${process.env.BACKEND_URL}/api/verify-email?token=${verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Verifica tu correo electrónico',
    text: `Gracias por registrarte. Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace: ${verificationLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo de verificación:', error);
    } else {
      console.log('Correo de verificación enviado:', info.response);
    }
  });
};

const register = (req, res) => {
  const { nombre, email, contraseña, direccion, telefono, rol } = req.body;

  console.log('Datos recibidos:', req.body);

  if (!nombre || !email || !contraseña || !direccion || !telefono || !rol) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const checkEmailQuery = 'SELECT email FROM Usuarios WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Cifrar la contraseña antes de almacenarla
    bcrypt.hash(contraseña, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Error al cifrar la contraseña:', err);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }

      const token = generateVerificationToken();

      const insertQuery = `
        INSERT INTO Usuarios (nombre, email, contraseña, direccion, telefono, fechaRegistro, rol, verificado, verificationToken) 
        VALUES (?, ?, ?, ?, ?, NOW(), ?, 0, ?)
      `;
      const values = [nombre, email, hashedPassword, direccion, telefono, rol, token];

      db.query(insertQuery, values, (err, results) => {
        if (err) {
          console.error('Error al insertar en la base de datos:', err);
          return res.status(500).json({ message: 'Error al registrar el usuario' });
        }

        sendVerificationEmail(email, token);

        res.status(201).json({ message: `Usuario registrado exitosamente como ${rol}. Revisa tu correo para verificar la cuenta.` });
      });
    });
  });
};

const login = (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  const checkUserQuery = 'SELECT usuarioID, email, rol, verificado, contraseña FROM Usuarios WHERE email = ?';
  const values = [email];

  db.query(checkUserQuery, values, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al iniciar sesión' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    const { usuarioID, rol, verificado, contraseña: hashedPassword } = results[0];

    // Verificar la contraseña
    bcrypt.compare(contraseña, hashedPassword, (err, result) => {
      if (err) {
        console.error('Error al comparar la contraseña:', err);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
      }

      if (!result) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos' });
      }

      if (verificado === 0) {
        return res.status(400).json({ message: 'La cuenta no ha sido verificada. Revisa tu correo para verificarla.' });
      }

      res.status(200).json({ 
        message: `Inicio de sesión exitoso como ${rol}`, 
        rol, 
        id: usuarioID 
      });
    });
  });
};


const verifyAccount = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token de verificación no proporcionado' });
  }

  const verifyQuery = 'UPDATE Usuarios SET verificado = 1 WHERE verificationToken = ?';
  
  db.query(verifyQuery, [token], (err, results) => {
    if (err) {
      console.error('Error al verificar la cuenta:', err);
      return res.status(500).json({ message: 'Error al verificar la cuenta' });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({ message: 'Token de verificación inválido o la cuenta ya está verificada' });
    }

    res.status(200).json({ message: 'Cuenta verificada exitosamente' });
  });
};

const getAccount = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario requerido' });
  }

  const query = 'SELECT nombre AS name, email, direccion AS address FROM usuarios WHERE usuarioID = ?'; // Updated query
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al recuperar la información del usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(results[0]);
  });
};


const updateUser = (req, res) => {
  const userId = req.params.userId;
  const { name, address } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario requerido' });
  }

  if (!name || !address) {
    return res.status(400).json({ message: 'Nombre y dirección son requeridos' });
  }

  const query = 'UPDATE usuarios SET nombre = ?, direccion = ? WHERE usuarioID = ?';

  db.query(query, [name, address, userId], (err, results) => {
    if (err) {
      console.error('Error al actualizar la información del usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar la información del usuario' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Información actualizada correctamente' });
  });
};

module.exports = { register, login, verifyAccount, getAccount, updateUser };
