const db = require('../config/db.js');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// Función para enviar el correo de verificación
const sendVerificationEmail = (to, verificationToken) => {
  const verificationLink = `http://localhost:5000/api/verify-email?token=${verificationToken}`;
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

// Función para manejar registro
const register = (req, res) => {
  const { nombre, email, contraseña, direccion, telefono, rol } = req.body;

  // Agregar un console.log para depurar
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

    const token = generateVerificationToken();

    const insertQuery = `
      INSERT INTO Usuarios (nombre, email, contraseña, direccion, telefono, fechaRegistro, rol, verificado, verificationToken) 
      VALUES (?, ?, ?, ?, ?, NOW(), ?, 0, ?)
    `;
    const values = [nombre, email, contraseña, direccion, telefono, rol, token];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }

      sendVerificationEmail(email, token);

      res.status(201).json({ message: `Usuario registrado exitosamente como ${rol}. Revisa tu correo para verificar la cuenta.` });
    });
  });
};

// Función para manejar inicio de sesión
const login = (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  const checkUserQuery = 'SELECT email, rol, verificado FROM Usuarios WHERE email = ? AND contraseña = ?';
  const values = [email, contraseña];

  db.query(checkUserQuery, values, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al iniciar sesión' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    const { rol, verificado } = results[0];

    if (verificado === 0) {
      return res.status(400).json({ message: 'La cuenta no ha sido verificada. Revisa tu correo para verificarla.' });
    }

    res.status(200).json({ message: `Inicio de sesión exitoso como ${rol}`, rol });
  });
};

// Función para verificar el token de verificación
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

module.exports = { register, login, verifyAccount };
