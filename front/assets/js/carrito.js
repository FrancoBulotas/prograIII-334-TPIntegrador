
function guardarCarritoEnStorage(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));

}
function obtenerCarritoDeStorage() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

let botonContinuarCompra = document.getElementById('continuar-comprando');
let botonFinalizarCompra = document.getElementById('finalizar-compra');
botonContinuarCompra?.addEventListener('click', () => window.location.href = "/front/pages/productos.html");
// botonFinalizarCompra?.addEventListener('click', () => window.location.href = "/front/pages/ticket.html");

export function cargarProductosEnCarrito(){
    const carrito = obtenerCarritoDeStorage();

    const listadoProductosEnCarrito = document.getElementById('listado-productos-en-carrito');

    if (listadoProductosEnCarrito) {
        listadoProductosEnCarrito.innerHTML = "";
        if(carrito.length === 0) {
            listadoProductosEnCarrito.innerHTML = `
                <div class="container-sin-prods">
                    <p>No tenes productos en el carrito.</p>
                    <a href="/front/pages/productos.html" class="boton-agregar-carrito">Ver Productos</a>
                </div>
            `;

            botonContinuarCompra.style.display = "none";
            botonFinalizarCompra.style.display = "none";
        } else {
            carrito.forEach(producto => {
                const productoDiv = document.createElement('div');
                productoDiv.classList.add('producto');

                if(producto.active) {
                    productoDiv.innerHTML = `
                    <div class="producto-item">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                        <h3>${producto.nombre}</h3>
                        <p class="p-precio">$ ${producto.precio}</p>
                        <p class="p-descripcion">${producto.descripcion}</p>
                        <div class="item-carrito">
                            <button class="boton-carrito eliminar" id="eliminar-${producto.id_producto}">-</button>
                            <span class="cantidad-producto">${producto.cantidad}</span>
                            <button class="boton-carrito agregar" id="agregar-${producto.id_producto}">+</button>

                        </div>
                    </div>
                `;
                }
                listadoProductosEnCarrito.appendChild(productoDiv);
            });

            carrito.forEach(producto => {
                let btnEliminar = document.getElementById(`eliminar-${producto.id_producto}`);
                btnEliminar.addEventListener("click", () => eliminarDelCarrito(producto));
            });

            carrito.forEach(producto => {
                let btnAgregar = document.getElementById(`agregar-${producto.id_producto}`);
                btnAgregar.addEventListener("click", () => agregarAlCarrito(producto));
            });

            
            botonContinuarCompra.style.display = "block";
            botonFinalizarCompra.style.display = "block";
        }
    }

    cargarTotalDelCarrito();
}

export function cargarCantidadEnHeader() {
    const carrito = obtenerCarritoDeStorage();
    
    const contadorCarrito = document.getElementById("carrito-count");

    let contador = 0;
    carrito.forEach(prod => {
        contador += prod.cantidad;
    });

    contadorCarrito.textContent = contador;
}

export function redirigirACarrito(producto) {
    window.location.href = '/front/pages/carrito.html'; 
    agregarAlCarrito(producto);
}

function agregarAlCarrito(producto) {
    const carrito = obtenerCarritoDeStorage();

    const index = carrito.findIndex(item => item.id_producto === producto.id_producto);
    if (index !== -1) {
        // si existe, sumo 1 a la cantidad
        carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    } else {
        // si no existe, lo agrego con cantidad 1
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarritoEnStorage(carrito);
    cargarProductosEnCarrito();
    cargarCantidadEnHeader();
}


function eliminarDelCarrito(producto) {
    const carrito = obtenerCarritoDeStorage();
    let carritoActualizado = [...carrito];

    const index = carritoActualizado.findIndex(item => item.id_producto === producto.id_producto);
    if (index !== -1) { 
        if(carritoActualizado[index].cantidad > 1){
            carritoActualizado[index].cantidad -= 1;
        } else { 
            carritoActualizado = carritoActualizado.filter(item => item.id_producto !== producto.id_producto);
        }
    }
    guardarCarritoEnStorage(carritoActualizado);
    cargarProductosEnCarrito();
    cargarCantidadEnHeader();
}

function cargarTotalDelCarrito() {
    const carrito = obtenerCarritoDeStorage();

    const labelTotalCarrito = document.getElementById("total-en-carrrito");
 
    if(labelTotalCarrito){
        labelTotalCarrito.textContent = '';

        let cont = 0;
        carrito.forEach(item => {
            cont += (item.cantidad * item.precio);
        });

        labelTotalCarrito.textContent = `$${cont}`;
    }

}
// window.addEventListener("DOMContentLoaded", () => {
//     const modoGuardado = localStorage.getItem("modoProductos");
//     if (modoGuardado === "oscuro") {
//         document.body.classList.add("modo-oscuro");
//     }
//     });

cargarProductosEnCarrito();
window.addEventListener("DOMContentLoaded", () => {
  try {
    const modo = localStorage.getItem("modoProductos");
    if (modo === "oscuro") {
      document.body.classList.add("modo-oscuro");
      document.documentElement.classList.remove("modo-oscuro-temporal");
    }
  } catch (error) {
    console.error("Error aplicando modo oscuro:", error);
  }
});
