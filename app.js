const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
const { Sequelize, DataTypes } = require('sequelize');

// ==============================
// 🔌 Conexión a la Base de Datos
// ==============================
const sequelize = new Sequelize('tienda_celulares', 'root', 'TU_CONTRASEÑA', {
  host: 'localhost',
  dialect: 'mysql'
});

// ==============================
// 📦 Modelos
// ==============================
const Inventario = sequelize.define('inventarios', {
  nombre: DataTypes.STRING,
  costo: DataTypes.DECIMAL,
  precio: DataTypes.DECIMAL,
  precioMayor: DataTypes.DECIMAL,
  modelo: DataTypes.STRING,
  marca: DataTypes.STRING,
  imei: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  stock: DataTypes.INTEGER
});

const Reparacion = sequelize.define('reparaciones', {
  cliente: DataTypes.STRING,
  telefono: DataTypes.STRING,
  equipo: DataTypes.STRING,
  falla: DataTypes.TEXT,
  abono: DataTypes.DECIMAL,
  estado: DataTypes.STRING
});

const Factura = sequelize.define('facturas', {
  descripcion: DataTypes.TEXT,
  total: DataTypes.DECIMAL
});

const Movimiento = sequelize.define('movimientos', {
  tipo: DataTypes.ENUM('ingreso', 'gasto'),
  concepto: DataTypes.STRING,
  monto: DataTypes.DECIMAL
});

// ==============================
// 🚀 Sincronización
// ==============================
sequelize.sync().then(() => console.log('Base de datos sincronizada'));

// ==============================
// 📡 Rutas
// ==============================
app.use(cors());
app.use(express.json());

app.get('/inventarios', async (req, res) => {
  const inventarios = await Inventario.findAll();
  res.json(inventarios);
});

app.post('/inventarios', async (req, res) => {
  const nuevoProducto = await Inventario.create(req.body);
  io.emit('productoActualizado', nuevoProducto);  // 🔄 Sincronización en tiempo real
  res.json(nuevoProducto);
});

app.put('/inventarios/:id', async (req, res) => {
  await Inventario.update(req.body, { where: { id: req.params.id } });
  io.emit('productoActualizado', req.body);  // 🔄 Sincronización en tiempo real
  res.sendStatus(200);
});

app.delete('/inventarios/:id', async (req, res) => {
  await Inventario.destroy({ where: { id: req.params.id } });
  io.emit('productoEliminado', req.params.id);  // 🔄 Sincronización en tiempo real
  res.sendStatus(200);
});

// Obtener todas las reparaciones
app.get('/api/reparaciones', async (req, res) => {
    const [rows] = await connection.execute('SELECT * FROM reparaciones');
    res.json(rows);
});

// Agregar una nueva reparación
app.post('/api/reparaciones', async (req, res) => {
    const { equipo, cliente, telefono, falla, abono, estado, productos } = req.body;
    await connection.execute('INSERT INTO reparaciones (equipo, cliente, telefono, falla, abono, estado, productos) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [equipo, cliente, telefono, falla, abono, estado, JSON.stringify(productos)]);
    res.sendStatus(201);
});

// Obtener todas las facturas
app.get('/api/facturacion', async (req, res) => {
    const [rows] = await connection.execute('SELECT * FROM facturacion');
    res.json(rows);
});

// Agregar una nueva factura
app.post('/api/facturacion', async (req, res) => {
    const { cliente, items, total, fecha } = req.body;
    await connection.execute('INSERT INTO facturacion (cliente, items, total, fecha) VALUES (?, ?, ?, ?)', 
    [cliente, JSON.stringify(items), total, fecha]);
    res.sendStatus(201);
});

// Obtener el cuadre general
app.get('/api/cuadre', async (req, res) => {
    const [ingresos] = await connection.execute('SELECT * FROM ingresos');
    const [gastos] = await connection.execute('SELECT * FROM gastos');
    const [facturas] = await connection.execute('SELECT * FROM facturacion');
    res.json({ ingresos, gastos, facturas });
});


// ==============================
// 🔄 Socket.IO
// ==============================
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.on('disconnect', () => console.log('Usuario desconectado'));
});

// ==============================
// 🚀 Servidor
// ==============================
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('productoActualizado', () => {
        io.emit('actualizarInventario');
    });

    socket.on('reparacionActualizada', () => {
        io.emit('actualizarReparaciones');
    });

    socket.on('facturaGenerada', () => {
        io.emit('actualizarFacturacion');
    });
});
