
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");
const botonNueva = document.getElementById("nueva");

const precioEquipo = 35000;

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const servicio = document.getElementById("servicio").value;
    const equipos = Number(document.getElementById("equipos").value);
    const dias = Number(document.getElementById("dias").value);
    const extras = Number(document.getElementById("extras").value);

    const nombreValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre);
    const telefonoValido = /^\d{10}$/.test(telefono) &&
        !/^(\d)\1{9}$/.test(telefono);

    if (!nombreValido) {
        alert("Ingrese un nombre válido.");
        return;
    }

    if (!telefonoValido) {
        alert("El teléfono debe tener 10 números válidos.");
        return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
        alert("Ingrese un correo electrónico válido.");
        return;
    }

    if (equipos < 2 || equipos > 100) {
        alert("La cantidad de equipos debe estar entre 2 y 100.");
        return;
    }

    if (dias < 1 || dias > 30) {
        alert("Los días de alquiler deben estar entre 1 y 30.");
        return;
    }

    if (extras < 0 || extras > 30) {
        alert("Los días adicionales deben estar entre 0 y 30.");
        return;
    }

    let identificacion = localStorage.getItem("alquipc_id");

    if (!identificacion) {
        identificacion = 1000;
    } else {
        identificacion = Number(identificacion) + 1;
    }

    localStorage.setItem("alquipc_id", identificacion);

    const subtotal = equipos * dias * precioEquipo;
    const valorExtras = equipos * extras * precioEquipo;

    let porcentajeServicio = 0;
    let nombreServicio = "Dentro de la ciudad";

    if (servicio === "fuera") {
        porcentajeServicio = 0.05;
        nombreServicio = "Fuera de la ciudad";
    } else if (servicio === "establecimiento") {
        porcentajeServicio = -0.05;
        nombreServicio = "En el establecimiento";
    }

    const descuento = Math.min(extras * 0.02, 0.10);
    const ajusteServicio = (subtotal + valorExtras) * porcentajeServicio;
    const descuentoValor = (subtotal + valorExtras) * descuento;
    const total = subtotal + valorExtras + ajusteServicio - descuentoValor;

    const pesos = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });

    resultado.innerHTML = `
        <h3>FACTURA #${identificacion}</h3>
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <hr>
        <p><strong>Servicio:</strong> ${nombreServicio}</p>
        <p><strong>Equipos:</strong> ${equipos}</p>
        <p><strong>Días de alquiler:</strong> ${dias}</p>
        <p><strong>Días adicionales:</strong> ${extras}</p>
        <hr>
        <p><strong>Alquiler:</strong> ${pesos.format(subtotal)}</p>
        <p><strong>Días adicionales:</strong> ${pesos.format(valorExtras)}</p>
        <p><strong>Ajuste del servicio:</strong> ${pesos.format(ajusteServicio)}</p>
        <p><strong>Descuento:</strong> ${pesos.format(descuentoValor)}</p>
        <hr>
        <p class="total">TOTAL: ${pesos.format(total)}</p>
    `;

    botonNueva.classList.remove("oculto");
});

formulario.addEventListener("reset", function() {
    resultado.innerHTML = '<p class="espera">Esperando datos...</p>';
    botonNueva.classList.add("oculto");
});

botonNueva.addEventListener("click", function() {
    formulario.reset();
    document.getElementById("nombre").focus();
});
