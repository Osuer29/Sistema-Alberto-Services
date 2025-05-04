const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function () {
  const fechaInput = document.getElementById('fecha-filtro');
  const btnFiltrar = document.getElementById('btn-filtrar');
  const btnPDF = document.getElementById('btn-pdf');
  const btnExcel = document.getElementById('btn-excel');

  let datosResumen = { ingresos: [], gastos: [], facturas: [], fecha: "" };

  function cargarDatos(nombreLS) {
    return JSON.parse(localStorage.getItem(nombreLS)) || [];
  }

  function filtrarPorFecha(data, fecha) {
    return data.filter(item => item.fecha === fecha);
  }

  function renderLista(elementId, datos) {
    const lista = document.getElementById(elementId);
    lista.innerHTML = '';
    datos.forEach(d => {
      const li = document.createElement('li');
      li.textContent = `${d.descripcion || d.concepto || 'Registro'} - $${parseFloat(d.monto).toFixed(2)}`;
      lista.appendChild(li);
    });
  }

  function sumarTotales(datos) {
    return datos.reduce((acc, item) => acc + parseFloat(item.monto), 0);
  }

  function actualizarCuadre(fecha) {
    const ingresos = filtrarPorFecha(cargarDatos('ingresos'), fecha);
    const gastos = filtrarPorFecha(cargarDatos('gastos'), fecha);
    const facturas = filtrarPorFecha(cargarDatos('facturas'), fecha);

    renderLista('lista-ingresos', ingresos);
    renderLista('lista-gastos', gastos);
    renderLista('lista-facturas', facturas);

    const totalIngresos = sumarTotales(ingresos);
    const totalGastos = sumarTotales(gastos);
    const totalFacturacion = sumarTotales(facturas);
    const resumenFinal = totalIngresos + totalFacturacion - totalGastos;

    document.getElementById('total-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
    document.getElementById('total-gastos').textContent = `$${totalGastos.toFixed(2)}`;
    document.getElementById('total-facturacion').textContent = `$${totalFacturacion.toFixed(2)}`;
    document.getElementById('resumen-final').textContent = `$${resumenFinal.toFixed(2)}`;

    // Guardar para exportar
    datosResumen = {
      fecha,
      ingresos, gastos, facturas,
      totalIngresos, totalGastos, totalFacturacion, resumenFinal
    };
  }

  // Exportar a PDF
  btnPDF.addEventListener('click', () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text(`Cuadre del Día - ${datosResumen.fecha}`, 14, y); y += 10;

    doc.setFontSize(12);

    doc.text('INGRESOS:', 14, y); y += 8;
    datosResumen.ingresos.forEach(d => {
      doc.text(`- ${d.descripcion}: $${parseFloat(d.monto).toFixed(2)}`, 18, y); y += 6;
    });
    doc.text(`Total Ingresos: $${datosResumen.totalIngresos.toFixed(2)}`, 18, y); y += 10;

    doc.text('GASTOS:', 14, y); y += 8;
    datosResumen.gastos.forEach(d => {
      doc.text(`- ${d.descripcion}: $${parseFloat(d.monto).toFixed(2)}`, 18, y); y += 6;
    });
    doc.text(`Total Gastos: $${datosResumen.totalGastos.toFixed(2)}`, 18, y); y += 10;

    doc.text('FACTURACIÓN:', 14, y); y += 8;
    datosResumen.facturas.forEach(d => {
      doc.text(`- ${d.descripcion}: $${parseFloat(d.monto).toFixed(2)}`, 18, y); y += 6;
    });
    doc.text(`Total Facturación: $${datosResumen.totalFacturacion.toFixed(2)}`, 18, y); y += 10;

    doc.setFontSize(14);
    doc.text(`Resumen Final: $${datosResumen.resumenFinal.toFixed(2)}`, 14, y); y += 10;

    doc.save(`cuadre_${datosResumen.fecha}.pdf`);
  });

  // Exportar a Excel
  btnExcel.addEventListener('click', () => {
    const wb = XLSX.utils.book_new();

    function sheetData(titulo, data) {
      return [[titulo], ['Descripción', 'Monto'], ...data.map(d => [d.descripcion, d.monto])];
    }

    const ingresosWS = XLSX.utils.aoa_to_sheet(sheetData("Ingresos", datosResumen.ingresos));
    const gastosWS = XLSX.utils.aoa_to_sheet(sheetData("Gastos", datosResumen.gastos));
    const facturasWS = XLSX.utils.aoa_to_sheet(sheetData("Facturación", datosResumen.facturas));

    XLSX.utils.book_append_sheet(wb, ingresosWS, "Ingresos");
    XLSX.utils.book_append_sheet(wb, gastosWS, "Gastos");
    XLSX.utils.book_append_sheet(wb, facturasWS, "Facturación");

    XLSX.writeFile(wb, `cuadre_${datosResumen.fecha}.xlsx`);
  });

  // Botón aplicar filtro
  btnFiltrar.addEventListener('click', () => {
    const fechaSeleccionada = fechaInput.value;
    if (fechaSeleccionada) {
      actualizarCuadre(fechaSeleccionada);
    } else {
      alert('Selecciona una fecha para aplicar el filtro.');
    }
  });

  // Al iniciar: cargar fecha de hoy
  const hoy = new Date().toISOString().slice(0, 10);
  fechaInput.value = hoy;
  actualizarCuadre(hoy);
});
