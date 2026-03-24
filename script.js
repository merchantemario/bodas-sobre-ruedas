// 1. CONFIGURACIÓN: Tu número de WhatsApp (34 para España + tu número)
const miTelefono = "34684094105"; 

const contenedor = document.getElementById('contenedor-productos');
let carrito = [];

// 2. CARGAR PRODUCTOS DESDE EL JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        if (!respuesta.ok) throw new Error("No se pudo encontrar productos.json");
        const productos = await respuesta.json();
        pintarProductos(productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// 3. DIBUJAR LAS TARJETAS EN EL HTML
function pintarProductos(productos) {
    if(!contenedor) return;
    contenedor.innerHTML = "";
    
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = "card-container"; 
        div.innerHTML = `
            <div class="card-inner" onclick="this.classList.toggle('is-flipped')">
                <div class="card-face card-front shadow-xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col border border-gray-100">
                    <img src="${producto.imagen}" class="w-full h-3/4 object-cover">
                    <div class="h-1/4 flex flex-col justify-center items-center p-4">
                        <h3 class="font-black text-2xl text-gray-800 uppercase italic tracking-tighter">${producto.nombre}</h3>
                        <span class="text-xs font-bold text-green-600 animate-pulse mt-1 italic uppercase tracking-widest">Toca para info ↻</span>
                    </div>
                </div>
                <div class="card-face card-back shadow-xl rounded-[2.5rem] bg-green-800 p-8 flex flex-col items-center justify-center text-white text-center">
                    <h3 class="font-black text-2xl mb-4 uppercase border-b border-green-400 pb-2 italic tracking-tighter">${producto.nombre}</h3>
                    <p class="text-sm italic mb-8 leading-relaxed font-medium">"${producto.info_detallada}"</p>
                    <button onclick="event.stopPropagation(); seleccionarCoche('${producto.nombre}')" 
                        class="bg-white text-green-800 px-10 py-4 rounded-2xl font-black hover:bg-green-400 hover:text-white transition-all shadow-2xl uppercase text-xs tracking-widest">
                        SELECCIONAR
                    </button>
                </div>
            </div>`;
        contenedor.appendChild(div);
    });
}

// 4. FUNCIÓN AL SELECCIONAR UN COCHE
function seleccionarCoche(nombre) {
    carrito = [nombre]; // Guardamos el coche elegido
    const seccion = document.getElementById('seccion-pedido');
    const display = document.getElementById('lista-seleccionados');
    
    if(seccion && display) {
        seccion.classList.remove('hidden'); // Mostramos el formulario
        display.innerHTML = `Vehículo elegido: <span class="text-green-600 uppercase font-black">${nombre}</span>`;
        seccion.scrollIntoView({ behavior: 'smooth' }); // Scroll suave hasta el formulario
    }
}

// 5. ENVIAR DATOS A WHATSAPP (SIN EMAIL)
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-pedido');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue
            
            // Recogemos los valores de los inputs
            const nombreVal = document.getElementById('nombre').value;
            const telVal = document.getElementById('telefono').value;
            const cocheVal = carrito[0];

            // Verificamos que haya un coche seleccionado por seguridad
            if (!cocheVal) {
                alert("⚠️ Por favor, selecciona un vehículo primero tocando en 'SELECCIONAR'.");
                return;
            }

            // Construcción del mensaje para WhatsApp
            const mensaje = `*BODAS SOBRE RUEDAS* 🚗💨\n\n` +
                            `👤 *Interesado:* ${nombreVal}\n` +
                            `📞 *WhatsApp:* ${telVal}\n` +
                            `✨ *Vehículo:* ${cocheVal}\n\n` +
                            `_Hola! Me gustaría consultar disponibilidad y precios para este coche._`;

            // Codificar el mensaje para la URL y abrir WhatsApp
            const url = `https://wa.me/${miTelefono}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
    } else {
        console.log("Esperando a que el formulario aparezca...");
    }
});

// Lanzar la carga de productos al iniciar
cargarProductos();