

import { redirigirACarrito, cargarCantidadEnHeader } from './carrito.js';


export function obtenerNombreUsuario() {
    return localStorage.getItem("nombreUsuario");
}

// productos.html
function cargarMensaje(mensaje) {
    const label = document.getElementById("mensaje-bienvenida");
    if(label) label.textContent = mensaje;
}

async function fetchProductos() {
    const response = await fetch('http://localhost:3000/api/productos');
    return await response.json();
}

async function cargarProductos(productos) {
    const listadoProductos = document.getElementById('listado-productos');

    if (listadoProductos) {
        listadoProductos.innerHTML = "";
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

async function cargarCategorias() {
    const response = await fetch('http://localhost:3000/api/categorias');
    const categorias = await response.json();

    
    const listadoCategorias = document.getElementById('categorias');

    if (listadoCategorias) {
        // listadoCategorias.innerHTML = "";
        // const categoriaDiv = document.createElement('div');
        // categoriaDiv.classList.add('categoria');

        categorias.payload.forEach(categoria => {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.classList.add('categoria');

            categoriaDiv.innerHTML += `
                <div class="categoria-item">
                    <button class="boton-categoria" id="categoria-${categoria.id_categoria}">${categoria.nombre.toUpperCase()}</button>
                </div>
            `;

            listadoCategorias.appendChild(categoriaDiv);
        });

        categorias.payload.forEach(categoria => {
            let botonCategoria = document.getElementById(`categoria-${categoria.id_categoria}`);
            botonCategoria.addEventListener("click", () => filtrarPorCategoria(categoria));
        });
    }

    let botonTodasCategorias = document.getElementById("todos-categoria");

    if(botonTodasCategorias) botonTodasCategorias.addEventListener("click", () => filtrarPorCategoria("TODOS"));

}

async function filtrarPorCategoria(categoria){
    const productos = await fetchProductos();
    
    let productosActualizados = [...productos.payload];

    if(categoria != "TODOS") productosActualizados = productosActualizados.filter(item => item.id_categoria === categoria.id_categoria);

    cargarProductos({ payload: productosActualizados });
}

async function init() {
    cargarMensaje(`Bienvenido ${obtenerNombreUsuario()}!`);

    let productos = await fetchProductos();
    cargarProductos(productos);
    
    cargarCategorias();
    cargarCantidadEnHeader();
}

const switchModo = document.getElementById("modo-switch");
const contenedor = document.getElementById("modo-toggle");

// Cambio de modo al hacer clic en el interruptor
switchModo.addEventListener("change", () => {
    const oscuro = switchModo.checked; // El estado del interruptor

    // Cambiar el modo oscuro
    document.body.classList.toggle("modo-oscuro", oscuro);
    contenedor.classList.toggle("dark", oscuro);

    // 
    localStorage.setItem("modoProductos", oscuro ? "oscuro" : "claro");
});

// Aplicar el modo oscuro si está guardado en el navegador
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("modoProductos") === "oscuro") {
        document.body.classList.add("modo-oscuro");
        contenedor.classList.add("dark");
        switchModo.checked = true; 
    }
});

init(); 