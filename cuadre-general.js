const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function () {
  const fechaInput = document.getElementById('fecha-filtro');
  const btnFiltrar = document.getElementById('btn-filtrar');
  const btnPDF = document.getElementById('btn-pdf');
  const btnExcel = document.getElementById('btn-excel');
  const btnBorrarHistorial = document.getElementById('borrarHistorialFacturacion');

  // NUEVO: Botón para PDF del resumen general
  const btnPDFResumen = document.createElement('button');
  btnPDFResumen.textContent = "📄 Generar PDF del Resumen";
  btnPDFResumen.style.marginTop = "10px";
  document.querySelector(".total-final").appendChild(btnPDFResumen);

  let datosResumen = {
    ingresos: [],
    gastos: [],
    facturas: [],
    ganancias: [],
    fecha: ""
  };

  // ===================== FUNCIONES =====================

  function repararFechas(nombreLS, campoMonto = "monto") {
    let datos = JSON.parse(localStorage.getItem(nombreLS)) || [];
    let reparado = false;
    datos.forEach(d => {
      if (!d.fecha) {
        d.fecha = new Date().toISOString().slice(0, 10);
        reparado = true;
      }
      d[campoMonto] = parseFloat(d[campoMonto]) || 0;
    });
    if (reparado) {
      localStorage.setItem(nombreLS, JSON.stringify(datos));
    }
    return datos;
  }

  function filtrarPorFecha(data, fecha) {
    return data.filter(item => item.fecha === fecha);
  }

  function renderLista(elementId, datos) {
    const lista = document.getElementById(elementId);
    lista.innerHTML = '';
    datos.forEach(d => {
      const texto = d.descripcion || d.concepto || d.id || 'Registro';
      const monto = parseFloat(d.monto || d.total || 0).toFixed(2);
      const li = document.createElement('li');
      li.textContent = `${texto} - $${monto}`;
      lista.appendChild(li);
    });
  }

  function sumarTotales(datos, campo = "monto") {
    return datos.reduce((acc, item) => acc + parseFloat(item[campo] || 0), 0);
  }

  // ===================== ACTUALIZAR CUADRE =====================
  function actualizarCuadre(fecha) {
  const ingresos = filtrarPorFecha(repararFechas('ingresos'), fecha);
  const gastos = filtrarPorFecha(repararFechas('gastos'), fecha);
  const facturas = filtrarPorFecha(repararFechas('facturas', 'total'), fecha);
  const ganancias = filtrarPorFecha(repararFechas('ganancias', 'ganancia'), fecha);

  renderLista('lista-ingresos', ingresos);
  renderLista('lista-gastos', gastos);
  renderLista('lista-facturas', facturas);

  const totalIngresos = sumarTotales(ingresos, "monto");
  const totalGastos = sumarTotales(gastos, "monto");
  const totalFacturacion = sumarTotales(facturas, "total");
  const totalGanancias = sumarTotales(ganancias, "ganancia");
  const resumenFinal = totalIngresos + totalFacturacion - totalGastos;

  document.getElementById('total-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
  document.getElementById('total-gastos').textContent = `$${totalGastos.toFixed(2)}`;
  document.getElementById('total-facturacion').textContent = `$${totalFacturacion.toFixed(2)}`;
  document.getElementById('gananciasValor').textContent = `$${totalGanancias.toFixed(2)}`;
  document.getElementById('resumen-final').textContent = `$${resumenFinal.toFixed(2)}`;

  datosResumen = {
    fecha,
    ingresos,
    gastos,
    facturas,
    ganancias,
    totalIngresos,
    totalGastos,
    totalFacturacion,
    totalGanancias,
    resumenFinal
  };
}


  // ===================== BOTONES =====================
  btnFiltrar.addEventListener('click', () => {
    const fechaSeleccionada = fechaInput.value;
    if (fechaSeleccionada) {
      actualizarCuadre(fechaSeleccionada);
    } else {
      alert('Selecciona una fecha para aplicar el filtro.');
    }
  });

  // Exportar PDF del Resumen General
  btnPDFResumen.addEventListener('click', () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text(`Resumen General del Día - ${datosResumen.fecha}`, 14, y); y += 10;

    doc.setFontSize(12);
    doc.text(`Ingresos: $${datosResumen.totalIngresos.toFixed(2)}`, 14, y); y += 8;
    doc.text(`Gastos: $${datosResumen.totalGastos.toFixed(2)}`, 14, y); y += 8;
    doc.text(`Facturación: $${datosResumen.totalFacturacion.toFixed(2)}`, 14, y); y += 8;
    doc.text(`Ganancias: $${datosResumen.totalGanancias.toFixed(2)}`, 14, y); y += 12;

    doc.setFontSize(14);
    doc.text(`TOTAL: $${datosResumen.resumenFinal.toFixed(2)}`, 14, y);

    doc.save(`Resumen_General_${datosResumen.fecha}.pdf`);
  });

  btnBorrarHistorial.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas borrar todo el historial de facturación?")) {
      ["facturas", "ingresos", "gastos", "ganancias"].forEach(key => localStorage.removeItem(key));
      alert("Historial de facturación y ganancias borrado correctamente.");
      actualizarCuadre(fechaInput.value);
    }
  });

  // ===================== INICIALIZAR =====================
  const hoy = new Date().toISOString().slice(0, 10);
  fechaInput.value = hoy;
  actualizarCuadre(hoy);
});
