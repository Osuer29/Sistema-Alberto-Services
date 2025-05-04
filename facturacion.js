let productos = JSON.parse(localStorage.getItem("inventario")) || [];
let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];

const productoSelect = document.getElementById("producto");
const reparacionSelect = document.getElementById("reparacion");
const productosSeleccionadosUl = document.getElementById("productosSeleccionados");
const totalFacturaSpan = document.getElementById("totalFactura");
const generarFacturaBtn = document.getElementById("generarFacturaBtn");

let productosSeleccionados = [];
let totalFactura = 0;

// Función para renderizar los productos en el select
function renderizarProductos() {
  productoSelect.innerHTML = "<option value=''>Seleccione un producto</option>";
  productos.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nombre} - $${p.precio}`;
    productoSelect.appendChild(option);
  });
}

// Función para renderizar las reparaciones en el select
function renderizarReparaciones() {
  reparacionSelect.innerHTML = "<option value=''>Seleccione una reparación</option>";
  reparaciones.forEach(r => {
    if (r.estado === "Lista") {
      const option = document.createElement("option");
      option.value = r.id;
      option.textContent = `${r.equipo} (${r.cliente}) - $${r.costoTotal}`;
      reparacionSelect.appendChild(option);
    }
  });
}

// Función para agregar un producto seleccionado a la factura
function agregarProducto() {
  const productoId = productoSelect.value;
  const producto = productos.find(p => p.id === productoId);

  if (producto) {
    productosSeleccionados.push({
      tipo: 'Producto',
      nombre: producto.nombre,
      precio: producto.precio
    });

    totalFactura += producto.precio;
    actualizarFactura();
  }
}


// Función para agregar una reparación seleccionada a la factura
function agregarReparacion() {
  const reparacionId = reparacionSelect.value;
  const reparacion = reparaciones.find(r => r.id === reparacionId);

  if (reparacion) {
    productosSeleccionados.push({
      tipo: 'Reparación',
      nombre: reparacion.equipo,
      precio: reparacion.costoTotal
    });

    totalFactura += reparacion.costoTotal;
    actualizarFactura();
  }
}

// Función para actualizar el total y mostrar los productos seleccionados
function actualizarFactura() {
  productosSeleccionadosUl.innerHTML = "";
  productosSeleccionados.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - $${p.precio}`;
    productosSeleccionadosUl.appendChild(li);
  });

  totalFacturaSpan.textContent = totalFactura.toFixed(2);
}

// Generar la factura en PDF
generarFacturaBtn.addEventListener("click", () => {
    if (productosSeleccionados.length > 0) {
      const fecha = new Date().toISOString().slice(0, 10);
  
      const factura = {
        id: Date.now(),
        productos: productosSeleccionados,
        total: totalFactura,
        fecha: fecha,
        descripcion: productosSeleccionados.map(p => p.nombre).join(", ")
      };
  
      // Guardar en LocalStorage
      const facturasGuardadas = JSON.parse(localStorage.getItem("facturas")) || [];
      facturasGuardadas.push({
        monto: factura.total,
        fecha: factura.fecha,
        descripcion: factura.descripcion
      });
      localStorage.setItem("facturas", JSON.stringify(facturasGuardadas));
  
      // Generar PDF
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Factura de Venta', 14, 20);
  
      let yPosition = 30;
      productosSeleccionados.forEach(p => {
        doc.setFontSize(12);
        doc.text(`${p.tipo}: ${p.nombre} - $${p.precio}`, 14, yPosition);
        yPosition += 10;
      });
  
      doc.text(`Total: $${totalFactura.toFixed(2)}`, 14, yPosition);
  
      doc.save(`Factura_${factura.id}.pdf`);
  
      // Limpiar factura actual
      productosSeleccionados = [];
      totalFactura = 0;
      actualizarFactura();
  
      alert("Factura generada y guardada exitosamente.");
    } else {
      alert("Por favor, agregue productos o reparaciones a la factura.");
    }
  });
  

// Cargar productos y reparaciones cuando se cargue la página
window.onload = () => {
  renderizarProductos();
  renderizarReparaciones();
};

document.getElementById("agregarProductoBtn").addEventListener("click", agregarProducto);
document.getElementById("agregarReparacionBtn").addEventListener("click", agregarReparacion);
