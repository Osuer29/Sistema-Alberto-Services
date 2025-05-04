// cuadre-general.js
document.addEventListener('DOMContentLoaded', () => {
    const btnFiltrarCuadre = document.getElementById('filtrar-cuadre');
    const filtroFecha = document.getElementById('filtro-fecha');
    const tablaCuadre = document.getElementById('tabla-cuadre').getElementsByTagName('tbody')[0];
    const totalDiaElement = document.getElementById('total-dia');
  
    // Función para cargar todos los movimientos del día
    function cargarMovimientos(fechaFiltro = null) {
      // Cargar los registros de ventas, ingresos y gastos desde LocalStorage
      const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
      const ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
      const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
      const reparaciones = JSON.parse(localStorage.getItem('reparaciones')) || [];
  
      // Filtrar por fecha si es necesario
      const movimientos = [];
      const fechaHoy = new Date().toISOString().split('T')[0]; // Fecha de hoy (YYYY-MM-DD)
  
      // Filtrar por fecha si el usuario seleccionó una fecha
      if (fechaFiltro) {
        // Filtrar ingresos
        ingresos.filter(ingreso => ingreso.fecha === fechaFiltro).forEach(ingreso => {
          movimientos.push({ descripcion: `Ingreso: ${ingreso.descripcion}`, monto: ingreso.monto });
        });
  
        // Filtrar ventas
        ventas.filter(venta => venta.fecha === fechaFiltro).forEach(venta => {
          movimientos.push({ descripcion: `Venta: ${venta.descripcion}`, monto: venta.monto });
        });
  
        // Filtrar gastos
        gastos.filter(gasto => gasto.fecha === fechaFiltro).forEach(gasto => {
          movimientos.push({ descripcion: `Gasto: ${gasto.descripcion}`, monto: gasto.monto });
        });
  
        // Filtrar reparaciones
        reparaciones.filter(reparacion => reparacion.fecha === fechaFiltro).forEach(reparacion => {
          movimientos.push({ descripcion: `Reparación: ${reparacion.descripcion}`, monto: reparacion.costo });
        });
      } else {
        // Si no hay filtro, mostrar todos los registros de hoy
        ingresos.filter(ingreso => ingreso.fecha === fechaHoy).forEach(ingreso => {
          movimientos.push({ descripcion: `Ingreso: ${ingreso.descripcion}`, monto: ingreso.monto });
        });
  
        ventas.filter(venta => venta.fecha === fechaHoy).forEach(venta => {
          movimientos.push({ descripcion: `Venta: ${venta.descripcion}`, monto: venta.monto });
        });
  
        gastos.filter(gasto => gasto.fecha === fechaHoy).forEach(gasto => {
          movimientos.push({ descripcion: `Gasto: ${gasto.descripcion}`, monto: gasto.monto });
        });
  
        reparaciones.filter(reparacion => reparacion.fecha === fechaHoy).forEach(reparacion => {
          movimientos.push({ descripcion: `Reparación: ${reparacion.descripcion}`, monto: reparacion.costo });
        });
      }
  
      // Actualizar la tabla
      tablaCuadre.innerHTML = '';
      let totalMonto = 0;
      movimientos.forEach(movimiento => {
        const row = tablaCuadre.insertRow();
        row.innerHTML = `
          <td>${movimiento.descripcion}</td>
          <td>${movimiento.monto}</td>
        `;
        totalMonto += parseFloat(movimiento.monto);
      });
  
      // Mostrar el total
      totalDiaElement.textContent = totalMonto.toFixed(2);
    }
  
    // Evento para filtrar los datos
    btnFiltrarCuadre.addEventListener('click', () => {
      const fechaFiltro = filtroFecha.value;
      cargarMovimientos(fechaFiltro);
    });
  
    // Cargar los movimientos al inicio
    cargarMovimientos();
  });
  