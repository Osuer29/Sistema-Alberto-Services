document.addEventListener('DOMContentLoaded', function () {
    // Referencias a los botones
    const nuevoProductoBtn = document.querySelector('.btn:nth-child(1)');
    const nuevaVentaBtn = document.querySelector('.btn:nth-child(2)');
    const nuevaReparacionBtn = document.querySelector('.btn:nth-child(3)');
    const facturarBtn = document.querySelector('.btn:nth-child(4)');
    const registrarGastoBtn = document.querySelector('.btn:nth-child(5)');
    const registrarIngresoBtn = document.querySelector('.btn:nth-child(6)');
    const verCuadreBtn = document.querySelector('.btn:nth-child(7)');

    // Definir acciones para cada botón
    nuevoProductoBtn.addEventListener('click', function () {
        window.location.href = 'inventario.html'; // Redirige al módulo de inventario
    });

    nuevaVentaBtn.addEventListener('click', function () {
        window.location.href = 'ventas.html'; // Redirige al módulo de ventas
    });

    nuevaReparacionBtn.addEventListener('click', function () {
        window.location.href = 'reparaciones.html'; // Redirige al módulo de reparaciones
    });

    facturarBtn.addEventListener('click', function () {
        window.location.href = 'facturacion.html'; // Redirige al módulo de facturación
    });

    registrarGastoBtn.addEventListener('click', function () {
        window.location.href = 'gastos.html'; // Redirige al módulo de gastos
    });

    registrarIngresoBtn.addEventListener('click', function () {
        window.location.href = 'ingresos.html'; // Redirige al módulo de ingresos
    });

    verCuadreBtn.addEventListener('click', function () {
        window.location.href = 'cuadre_general.html'; // Redirige al módulo de cuadre general
    });
});
