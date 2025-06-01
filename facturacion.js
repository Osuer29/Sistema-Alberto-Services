let productos = JSON.parse(localStorage.getItem("inventario")) || [];
let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];

const productoSelect = document.getElementById("producto");
const reparacionSelect = document.getElementById("reparacion");
const productosSeleccionadosUl = document.getElementById("productosSeleccionados");
const totalFacturaSpan = document.getElementById("totalFactura");
const generarFacturaBtn = document.getElementById("generarFacturaBtn");
const vaciarFacturaBtn = document.getElementById("vaciarFacturaBtn");

let productosSeleccionados = [];
let totalFactura = 0;

// Renderizar productos
function renderizarProductos() {
  productoSelect.innerHTML = "<option value=''>Seleccione un producto</option>";
  productos = JSON.parse(localStorage.getItem("inventario")) || [];

  // Asegurar que cada producto tenga un id único
  productos.forEach((p, i) => {
    if (!p.id) p.id = Date.now() + i;
  });

  productos.forEach(p => {
    if (p.stock > 0) {
      const option = document.createElement("option");
      option.value = String(p.id);
      option.textContent = `${p.nombre} - $${p.precio}`;
      productoSelect.appendChild(option);
    }
  });

  localStorage.setItem("inventario", JSON.stringify(productos)); // guardar los ids si se asignaron
}

// Renderizar reparaciones
function renderizarReparaciones(filtro = "") {
  reparacionSelect.innerHTML = "<option value=''>Seleccione una reparación</option>";
  reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];

  const filtroTexto = filtro.toLowerCase();
  const reparacionesFiltradas = reparaciones.filter(r => {
    const info = `${r.equipo} ${r.cliente} ${r.id}`.toLowerCase();
    return r.estado === "Lista" && info.includes(filtroTexto);
  });

  reparacionesFiltradas.forEach(r => {
    const option = document.createElement("option");
    option.value = String(r.id);
    const total = calcularCostoTotal(r);
    option.textContent = `${r.equipo} (${r.cliente}) - $${total}`;
    reparacionSelect.appendChild(option);
  });
}

// Calcular costo total de una reparación
function calcularCostoTotal(reparacion) {
  return reparacion.productos?.reduce((acc, p) => acc + parseFloat(p.costo || 0), 0) || 0;
}

// Agregar producto con cliente y descripción
function agregarProducto() {
  const productoId = productoSelect.value;
  if (!productoId) return alert("Selecciona un producto válido.");

  const cliente = prompt("Ingrese el nombre del cliente para este producto:");
  if (!cliente || cliente.trim() === "") {
    return alert("El nombre del cliente es obligatorio.");
  }

  const descripcion = prompt("Ingrese una descripción opcional para este producto (puede dejar vacío):");

  const producto = productos.find(p => String(p.id) === productoId);

  if (producto && producto.stock > 0) {
    productosSeleccionados.push({
      tipo: 'Producto',
      nombre: producto.nombre,
      descripcion: descripcion?.trim() || "",
      cliente: cliente.trim(),
      precio: parseFloat(producto.precio)
    });
    actualizarFactura();
  } else {
    alert("Producto no disponible en inventario.");
  }
}

// Agregar reparación
function agregarReparacion() {
  const reparacionId = reparacionSelect.value;
  if (!reparacionId) return alert("Selecciona una reparación válida.");

  const reparacion = reparaciones.find(r => String(r.id) === reparacionId);
  if (reparacion) {
    const total = calcularCostoTotal(reparacion);
    productosSeleccionados.push({
      tipo: 'Reparación',
      equipo: reparacion.equipo,
      cliente: reparacion.cliente,
      telefono: reparacion.telefono,
      falla: reparacion.falla,
      abono: reparacion.abono,
      productos: reparacion.productos,
      precio: total
    });
    actualizarFactura();
  } else {
    alert("Reparación no encontrada.");
  }
}

// Agregar servicio a la factura
document.getElementById("formServicio").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("servicioCliente").value.trim();
  const descripcion = document.getElementById("servicioDescripcion").value.trim();
  const precio = parseFloat(document.getElementById("servicioPrecio").value);

  if (!nombre || !descripcion || isNaN(precio)) {
    return alert("Completa todos los campos del servicio correctamente.");
  }

  productosSeleccionados.push({
    tipo: "Servicio",
    nombre: `${descripcion} (${nombre})`,
    precio: precio
  });

  document.getElementById("formServicio").reset();
  actualizarFactura();
});

// Actualizar factura
function actualizarFactura() {
  productosSeleccionadosUl.innerHTML = "";
  totalFactura = 0;

  productosSeleccionados.forEach((item, index) => {
    const li = document.createElement("li");
    if (item.tipo === "Reparación") {
      li.textContent = `${item.tipo}: ${item.equipo} (${item.cliente}) - $${item.precio.toFixed(2)}`;
    } else if (item.tipo === "Producto") {
      li.textContent = `${item.tipo}: ${item.nombre} (${item.cliente})${item.descripcion ? " - " + item.descripcion : ""} - $${item.precio.toFixed(2)}`;
    } else {
      li.textContent = `${item.tipo}: ${item.nombre} - $${item.precio.toFixed(2)}`;
    }

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "❌";
    eliminarBtn.onclick = () => {
      if (confirm(`¿Quitar este ítem de la factura?`)) {
        productosSeleccionados.splice(index, 1);
        actualizarFactura();
      }
    };

    li.appendChild(eliminarBtn);
    productosSeleccionadosUl.appendChild(li);
    totalFactura += item.precio;
  });

  totalFacturaSpan.textContent = totalFactura.toFixed(2);
}

// Vaciar factura completa
vaciarFacturaBtn.addEventListener("click", () => {
  if (productosSeleccionados.length === 0) return alert("La factura ya está vacía.");
  if (confirm("¿Seguro que deseas vaciar todos los ítems?")) {
    productosSeleccionados = [];
    totalFactura = 0;
    actualizarFactura();
  }
});

// Generar la factura
// Generar la factura
generarFacturaBtn?.addEventListener("click", () => {
  if (productosSeleccionados.length === 0) {
    return alert("Agrega productos, servicios o reparaciones antes de facturar.");
  }

  const fecha = new Date().toISOString().split("T")[0];
  const factura = {
    id: Date.now(),
    fecha: fecha,
    items: productosSeleccionados,
    total: totalFactura,
    descripcion: productosSeleccionados.map(p => p.nombre || p.equipo || "").join(", ")
  };

  const facturasGuardadas = JSON.parse(localStorage.getItem("facturas")) || [];
  facturasGuardadas.push(factura);
  localStorage.setItem("facturas", JSON.stringify(facturasGuardadas));

  // Actualizar inventario, reparaciones y ganancias (sin cambios)...

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Factura de Venta", 105, 20, null, null, "center");
  doc.setFontSize(10);
  doc.text(`Fecha: ${factura.fecha}`, 105, 28, null, null, "center");
  doc.text(`Factura #: ${factura.id}`, 105, 34, null, null, "center");

  // Agrupar productos por cliente
  const productosPorCliente = {};
  factura.items.forEach(item => {
    if (item.tipo === "Producto") {
      const c = item.cliente || "Sin Cliente";
      if (!productosPorCliente[c]) productosPorCliente[c] = [];
      productosPorCliente[c].push(item);
    }
  });

  let y = 45;
  doc.setFontSize(12);
  doc.text("Detalle:", 105, y, null, null, "center");
  y += 10;

  // Mostrar productos agrupados por cliente, centrados
  for (const cliente in productosPorCliente) {
    doc.setFontSize(14);
    doc.text(`Cliente: ${cliente}`, 105, y, null, null, "center");
    y += 10;

    productosPorCliente[cliente].forEach((p) => {
      doc.setFontSize(12);
      doc.text(`Producto: ${p.nombre}`, 105, y, null, null, "center");
      y += 8;
      if (p.descripcion) {
        doc.text(`Descripción: ${p.descripcion}`, 105, y, null, null, "center");
        y += 8;
      }
      doc.text(`Precio: $${p.precio.toFixed(2)}`, 105, y, null, null, "center");
      y += 10;
    });
    y += 5;
  }

  // Mostrar reparaciones centradas
  factura.items.forEach((p) => {
    if (p.tipo === "Reparación") {
      doc.setFontSize(14);
      doc.text(`Reparación: ${p.equipo} (${p.cliente})`, 105, y, null, null, "center");
      y += 10;
      doc.setFontSize(12);
      doc.text(`Falla: ${p.falla}`, 105, y, null, null, "center");
      y += 8;
      doc.text(`Teléfono: ${p.telefono}`, 105, y, null, null, "center");
      y += 8;
      if (p.abono) {
        doc.text(`Abono: $${parseFloat(p.abono).toFixed(2)}`, 105, y, null, null, "center");
        y += 8;
      }
      if (p.productos?.length) {
        doc.text(`Productos utilizados:`, 105, y, null, null, "center");
        y += 8;
        p.productos.forEach(prod => {
          doc.text(`- ${prod.nombre} - $${prod.costo}`, 105, y, null, null, "center");
          y += 8;
        });
      }
      y += 10;
    }
  });

  y += 10;
  doc.line(14, y, 195, y);
  y += 10;

  doc.setFontSize(14);
  doc.text("TOTAL:", 105, y, null, null, "center");
  y += 10;
  doc.text(`$${factura.total.toFixed(2)}`, 105, y, null, null, "center");

  y += 20;
  doc.setFontSize(10);
  doc.text("Gracias por su compra", 105, y, null, null, "center");
  doc.text("Alberto Services", 105, y + 6, null, null, "center");
  doc.text("Tel: 809-555-1234", 105, y + 12, null, null, "center");
  doc.text("Correo: contacto@albertoservices.com", 105, y + 18, null, null, "center");
  doc.text("Dirección: Calle Principal #123", 105, y + 24, null, null, "center");

  window.open(doc.output("bloburl"));

  // Reset factura
  productosSeleccionados = [];
  totalFactura = 0;
  actualizarFactura();
  renderizarProductos();
  renderizarReparaciones();

  alert("Factura generada con éxito.");
});


// Inicializar
window.onload = () => {
  renderizarProductos();
  renderizarReparaciones();
  actualizarFactura();
};

document.getElementById("agregarProductoBtn").addEventListener("click", agregarProducto);
document.getElementById("agregarReparacionBtn").addEventListener("click", agregarReparacion);

// historial de facturacion //

// Referencias del formulario
const form = document.getElementById('facturacionForm');
form.addEventListener('submit', e => e.preventDefault());
