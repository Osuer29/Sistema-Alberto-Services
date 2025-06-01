let productos = JSON.parse(localStorage.getItem("inventario")) || [];
let devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];

const productoSelect = document.getElementById("producto");
const cantidadInput = document.getElementById("cantidad");
const motivoInput = document.getElementById("motivo");
const devolucionForm = document.getElementById("devolucionForm");
const devolucionesBody = document.getElementById("devolucionesBody");

// Cargar productos al <select>
function cargarProductos() {
  productos = JSON.parse(localStorage.getItem("inventario")) || [];
  productoSelect.innerHTML = "<option value=''>Seleccione un producto</option>";

  productos.forEach(producto => {
    const option = document.createElement("option");
    option.value = producto.id;
    option.textContent = `${producto.nombre} - Stock: ${producto.stock}`;
    productoSelect.appendChild(option);
  });
}

// Renderizar historial de devoluciones
function renderizarHistorial() {
  devolucionesBody.innerHTML = "";
  devoluciones.forEach(devolucion => {
    const row = document.createElement("tr");

    const tdProducto = document.createElement("td");
    tdProducto.textContent = devolucion.nombre;

    const tdCantidad = document.createElement("td");
    tdCantidad.textContent = devolucion.cantidad;

    const tdMotivo = document.createElement("td");
    tdMotivo.textContent = devolucion.motivo;

    const tdFecha = document.createElement("td");
    tdFecha.textContent = devolucion.fecha;

    row.appendChild(tdProducto);
    row.appendChild(tdCantidad);
    row.appendChild(tdMotivo);
    row.appendChild(tdFecha);

    devolucionesBody.appendChild(row);
  });
}

// Registrar devolución
devolucionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const productoId = parseInt(productoSelect.value);
  const cantidad = parseInt(cantidadInput.value);
  const motivo = motivoInput.value.trim();

  // Validación mejorada
  if (!productoId) {
    return alert("Selecciona un producto válido.");
  }
  if (!cantidad || cantidad <= 0) {
    return alert("Ingresa una cantidad válida mayor a 0.");
  }
  if (!motivo) {
    return alert("Ingresa un motivo para la devolución.");
  }

  const producto = productos.find(p => p.id === productoId);
  if (!producto) {
    return alert("Producto no encontrado en inventario.");
  }

  // Registrar devolución
  const devolucion = {
    id: Date.now(),
    nombre: producto.nombre,
    cantidad: cantidad,
    motivo: motivo,
    fecha: new Date().toLocaleDateString()
  };

  devoluciones.push(devolucion);
  localStorage.setItem("devoluciones", JSON.stringify(devoluciones));

  // Actualizar inventario (sumar stock)
  producto.stock += cantidad;
  localStorage.setItem("inventario", JSON.stringify(productos));

  // Reset
  devolucionForm.reset();
  cargarProductos();
  renderizarHistorial();

  alert("Devolución registrada correctamente.");
});

// Inicialización al cargar
window.onload = function () {
  cargarProductos();
  renderizarHistorial();
};
