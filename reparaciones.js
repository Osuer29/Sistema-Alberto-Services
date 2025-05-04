let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];
let reparacionActualId = null;

// DOM
const formReparacion = document.getElementById("formReparacion");
const listaReparaciones = document.getElementById("listaReparaciones");
const modal = document.getElementById("modalTaller");
const closeModal = document.querySelector(".close");
const formTaller = document.getElementById("formTaller");
const productosAgregados = document.getElementById("productosAgregados");

// Guardar nueva reparación
formReparacion.addEventListener("submit", (e) => {
  e.preventDefault();
  const nueva = {
    id: Date.now(),
    cliente: document.getElementById("cliente").value,
    telefono: document.getElementById("telefono").value,
    equipo: document.getElementById("equipo").value,
    falla: document.getElementById("falla").value,
    abono: Number(document.getElementById("abono").value) || 0,
    productos: [],
    estado: "En taller"
  };
  reparaciones.push(nueva);
  localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
  formReparacion.reset();
  renderReparaciones();
});

// Mostrar reparaciones
function renderReparaciones() {
  listaReparaciones.innerHTML = "";
  reparaciones.forEach(rep => {
    const card = document.createElement("div");
    card.className = "reparacion-card";
    card.innerHTML = `
      <h4>${rep.equipo} - ${rep.cliente}</h4>
      <p><strong>Tel:</strong> ${rep.telefono}</p>
      <p><strong>Falla:</strong> ${rep.falla}</p>
      <p><strong>Abono:</strong> $${rep.abono.toFixed(2)}</p>
      <p><strong>Estado:</strong> ${rep.estado}</p>
      <button onclick="abrirTaller(${rep.id})">Agregar Producto</button>
      <button onclick="marcarLista(${rep.id})">Marcar como Lista</button>
    `;
    listaReparaciones.appendChild(card);
  });
}

// Abrir modal Taller
function abrirTaller(id) {
  reparacionActualId = id;
  modal.style.display = "block";
  productosAgregados.innerHTML = "";

  const reparacion = reparaciones.find(r => r.id === id);
  reparacion.productos.forEach((p, i) => {
    const div = document.createElement("div");
    div.innerHTML = `🔧 ${p.nombre} - $${p.costo}`;
    productosAgregados.appendChild(div);
  });
}

// Agregar producto a la reparación
formTaller.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("producto").value;
  const costo = Number(document.getElementById("costoProducto").value);
  const reparacion = reparaciones.find(r => r.id === reparacionActualId);
  reparacion.productos.push({ nombre, costo });
  localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
  document.getElementById("producto").value = "";
  document.getElementById("costoProducto").value = "";
  abrirTaller(reparacionActualId);
});

// Marcar reparación como lista
function marcarLista(id) {
  const reparacion = reparaciones.find(r => r.id === id);
  reparacion.estado = "Lista";
  localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
  renderReparaciones();
}

// Cerrar modal
closeModal.onclick = () => {
  modal.style.display = "none";
};
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

// Inicializar
renderReparaciones();
