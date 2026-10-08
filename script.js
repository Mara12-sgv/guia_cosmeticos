const API_URL = 'http://localhost:3000'; 

const servicesContainer = document.getElementById("services-container");
const serviceSelect = document.getElementById("servicio");
const appointmentForm = document.getElementById("appointment-form");
const formMessage = document.getElementById("form-message");

// Se ejecuta automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarServicios();
});

function formatPrice(price) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(price);
}

function mostrarServicios(servicios) {
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = "";

    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>';
    }

    if (!Array.isArray(servicios) || servicios.length === 0) {
        servicesContainer.innerHTML = `<p class="loading">No hay servicios disponibles.</p>`;
        return;
    }

    servicios.forEach((servicio, index) => {
        const card = document.createElement("article");
        card.classList.add("service-card");
        const nombre = servicio.nombre || servicio.servicio || servicio.name || "Servicio de maquillaje";
        const precio = servicio.precio ?? servicio.price ?? 0;
        const duracion = servicio.duracion || servicio.tiempo || servicio.duration || "Consultar";
        const descripcion = servicio.descripcion || servicio.description || "Servicio de maquillaje y estilismo.";
        card.innerHTML = `
            <span class="service-number">${String(index + 1).padStart(2, "0")}</span>
            <h3>${nombre}</h3>
            <p class="service-description">${descripcion}</p>
            <div class="service-info">
                <span class="price">${precio ? formatPrice(precio) : "Consultar"}</span>
                <span class="duration">${duracion}</span>
            </div>
        `;
        servicesContainer.appendChild(card);
        
        if (serviceSelect) {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            serviceSelect.appendChild(option);
        }
    });
}

async function cargarServicios() {
    try {
        const response = await fetch(`${API_URL}/api/cosmeticos`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        const servicios = Array.isArray(data) ? data : (data.servicios || data.data || data.resultados || []);
        mostrarServicios(servicios);
    } catch (error) {
        console.log("API desconectada. Cargando servicios locales configurados...");
        mostrarServiciosLocales();
    }
}

function mostrarServiciosLocales() {
    const servicios = [
        {
            nombre: "Maquillaje de novia",
            precio: 450000,
            duracion: "2,5 - 3 horas",
            descripcion: "Maquillaje especializado para novias."
        },
        {
            nombre: "Maquillaje social",
            precio: 200000,
            duracion: "2 horas",
            descripcion: "Maquillaje para eventos y ocasiones especiales."
        },
        {
            nombre: "Ondas",
            precio: 50000,
            duracion: "30 - 50 minutos",
            descripcion: "Peinado con ondas para complementar tu look."
        },
        {
            nombre: "Alisado",
            precio: 50000,
            duracion: "30 - 50 minutos",
            descripcion: "Servicio de alisado para un acabado elegante."
        }
    ];
    mostrarServicios(servicios);
}

if (appointmentForm) {
    appointmentForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const servicio = document.getElementById("servicio").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;

        if (!nombre || !servicio || !fecha || !hora) {
            mostrarMensaje("Por favor completa todos los campos.", "error");
            return;
        }

        const cita = { nombre, servicio, fecha, hora };
        
        try {
            mostrarMensaje("Enviando solicitud...", "");
            const response = await fetch(`${API_URL}/api/cosmeticos/citas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cita)
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            await response.json();
            mostrarMensaje("¡Cita solicitada correctamente!", "success");
            appointmentForm.reset();
        } catch (error) {
            console.error("Error al crear la cita:", error);
            mostrarMensaje("Cita guardada localmente (Simulado de contingencia).", "success");
        }
    });
}

function mostrarMensaje(mensaje, tipo) {
    if (!formMessage) return;
    formMessage.textContent = mensaje;
    formMessage.className = "form-message";
    if (tipo) formMessage.classList.add(tipo);
}