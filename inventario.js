// ===================== VARIABLES =====================
let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
const formulario = document.getElementById('formularioInventario');
const tabla = document.getElementById('tablaInventario');
const buscador = document.getElementById('buscarInventario');
let editIndex = null;

// ===================== FUNCIONES =====================

function guardarInventario() {
  localStorage.setItem('inventario', JSON.stringify(inventario));
}

function limpiarFormulario() {
  formulario.reset();
  editIndex = null;
  formulario['btnGuardar'].textContent = 'Agregar';
}

function renderizarInventario(data = inventario) {
  tabla.innerHTML = '';
  if (data.length === 0) {
    tabla.innerHTML = '<tr><td colspan="8">No hay artículos registrados.</td></tr>';
    return;
  }

  data.forEach((item, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.marca || '-'}</td>
      <td>${item.modelo || '-'}</td>
      <td>${item.precio}</td>
      <td>${item.precioMayor || '-'}</td>
      <td>${item.imei || '-'}</td>
      <td>${item.descripcion || '-'}</td>
      <td>
        <button onclick="editarArticulo(${index})">✏️</button>
        <button onclick="eliminarArticulo(${index})">🗑️</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

function agregarArticulo(e) {
  e.preventDefault();

  const nuevo = {
    nombre: formulario['nombre'].value.trim(),
    costo: formulario['costo'].value.trim(),
    precio: formulario['precio'].value.trim(),
    precioMayor: formulario['precioMayor'].value.trim(),
    modelo: formulario['modelo'].value.trim(),
    marca: formulario['marca'].value.trim(),
    imei: formulario['imei'].value.trim(),
    descripcion: formulario['descripcion'].value.trim()
  };

  if (!nuevo.nombre || !nuevo.costo || !nuevo.precio) {
    alert('Nombre, Costo y Precio son obligatorios.');
    return;
  }

  if (editIndex !== null) {
    inventario[editIndex] = nuevo;
  } else {
    inventario.push(nuevo);
  }

  guardarInventario();
  limpiarFormulario();
  renderizarInventario();
}

function eliminarArticulo(index) {
  if (confirm('¿Estás seguro de eliminar este artículo?')) {
    inventario.splice(index, 1);
    guardarInventario();
    renderizarInventario();
  }
}

function editarArticulo(index) {
  const item = inventario[index];
  formulario['nombre'].value = item.nombre;
  formulario['costo'].value = item.costo;
  formulario['precio'].value = item.precio;
  formulario['precioMayor'].value = item.precioMayor || '';
  formulario['modelo'].value = item.modelo || '';
  formulario['marca'].value = item.marca || '';
  formulario['imei'].value = item.imei || '';
  formulario['descripcion'].value = item.descripcion || '';
  formulario['btnGuardar'].textContent = 'Actualizar';
  editIndex = index;
}

function buscarInventario() {
  const texto = buscador.value.toLowerCase();
  const resultado = inventario.filter(item =>
    item.nombre.toLowerCase().includes(texto) ||
    item.marca?.toLowerCase().includes(texto) ||
    item.modelo?.toLowerCase().includes(texto)
  );
  renderizarInventario(resultado);
}

// ===================== EVENTOS =====================
formulario.addEventListener('submit', agregarArticulo);
buscador.addEventListener('input', buscarInventario);

// ===================== INICIAL =====================
renderizarInventario();
