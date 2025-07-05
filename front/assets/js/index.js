

import { redirigirACarrito, cargarProductosEnCarrito, cargarCantidadEnHeader } from './carrito.js';


// index.html
// pantalla de inicio
document.getElementById("boton-ingresar")?.addEventListener('click', () => {
    const nombreUsuario = document.getElementById('nombre-usuario').value;

    if (nombreUsuario.trim() === '') {
        alert('Por favor, ingresa tu nombre.');
    } else {
        localStorage.setItem('nombreUsuario', nombreUsuario);
        window.location.href = '/front/pages/productos.html'; 
    }
});


// productos.html

async function cargarProductos() {
    const response = await fetch('http://localhost:3000/api/productos');
    const productos = await response.json();

    const listadoProductos = document.getElementById('listado-productos');

    if (listadoProductos) {
        productos.payload.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');

            if(producto.active) {
                productoDiv.innerHTML = `
                <div class="producto-item">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                    <h3>${producto.nombre}</h3>
                    <p class="p-precio">$ ${producto.precio}</p>
                    <p class="p-descripcion">${producto.descripcion}</p>
                    <button class="boton-agregar-carrito agregar-carrito" id="${producto.id_producto}">Agregar</button>
                </div>
            `;
            }
            listadoProductos.appendChild(productoDiv);
        });

        productos.payload.forEach(producto => {
            let btnAgregar = document.getElementById(`${producto.id_producto}`);
            btnAgregar.addEventListener("click", () => redirigirACarrito(producto));
        });
    }
}

function init() {
    cargarProductos();
    cargarProductosEnCarrito();
    cargarCantidadEnHeader();
}

init(); 