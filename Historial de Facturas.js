// Referencia al cuerpo de la tabla
const facturaBody = document.getElementById('facturaBody');

// Cargar datos desde LocalStorage
let facturas = JSON.parse(localStorage.getItem('facturas')) || [];

// Función para renderizar las facturas
function renderFacturas() {
    facturaBody.innerHTML = ''; // Limpiar la tabla
    facturas.forEach((factura, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${factura.numero}</td>
            <td>${factura.cliente}</td>
            <td>${factura.fecha}</td>
            <td>${factura.monto}</td>
            <td>${factura.estado}</td>
            <td>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </td>
        `;

        facturaBody.appendChild(row);
    });

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            eliminarFactura(index);
        });
    });
}

// Función para eliminar una factura
function eliminarFactura(index) {
    // Eliminar del array
    facturas.splice(index, 1);

    // Actualizar LocalStorage
    localStorage.setItem('facturas', JSON.stringify(facturas));

    // Recargar la tabla
    renderFacturas();
}

// Renderizar la tabla al cargar
renderFacturas();
