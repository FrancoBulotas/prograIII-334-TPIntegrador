

function guardarCarritoEnStorage(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));

}
function obtenerCarritoDeStorage() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}


export function cargarProductosEnCarrito(){
    const carrito = obtenerCarritoDeStorage();
    console.log(carrito)    

    const listadoProductosEnCarrito = document.getElementById('listado-productos-en-carrito');
    listadoProductosEnCarrito.innerHTML = "";
    if (listadoProductosEnCarrito) {
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
    }
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
    
    console.log(producto);
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
}



function eliminarDelCarrito(producto) {
    console.log(producto);
}
