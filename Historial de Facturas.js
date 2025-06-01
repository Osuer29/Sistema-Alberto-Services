const facturaBody = document.getElementById('facturaBody');
let facturas = JSON.parse(localStorage.getItem('facturas')) || [];

function renderFacturas() {
  facturaBody.innerHTML = ''; // Limpiar tabla

  facturas.forEach((factura, index) => {
    const row = document.createElement('tr');

    const detalleItems = factura.items.map((item, i) => {
      if (item.tipo === "Reparación") {
        let productosUsados = (item.productos || []).map(prod => `- ${prod.nombre}: $${prod.costo}`).join("<br>");
        return `
          <strong>${i + 1}. Reparación</strong><br>
          Equipo: ${item.equipo}<br>
          Cliente: ${item.cliente}<br>
          Teléfono: ${item.telefono}<br>
          Falla: ${item.falla}<br>
          Abono: $${parseFloat(item.abono || 0).toFixed(2)}<br>
          Productos usados:<br>${productosUsados}<br>
          Total: $${item.precio.toFixed(2)}
        `;
      } else {
        return `
          <strong>${i + 1}. ${item.tipo}</strong><br>
          ${item.cliente ? `Cliente: ${item.cliente}<br>` : ""}
          Nombre: ${item.nombre}<br>
          Precio: $${item.precio.toFixed(2)}
        `;
      }
    }).join("<hr>");

    row.innerHTML = `
      <td style="text-align:center">${factura.id || factura.numero}</td>
      <td style="text-align:center">${factura.fecha}</td>
      <td style="text-align:left">${detalleItems}</td>
      <td style="text-align:center"><strong>$${factura.total.toFixed(2)}</strong></td>
      <td style="text-align:center">
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
      </td>
    `;

    facturaBody.appendChild(row);
  });

  document.querySelectorAll('.btn-eliminar').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      eliminarFactura(index);
    });
  });
}

function eliminarFactura(index) {
  facturas.splice(index, 1);
  localStorage.setItem('facturas', JSON.stringify(facturas));
  renderFacturas();
}

renderFacturas();
