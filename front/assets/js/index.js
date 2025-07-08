

import { redirigirACarrito, cargarCantidadEnHeader } from './carrito.js';


export function obtenerNombreUsuario() {
    return localStorage.getItem("nombreUsuario");
}

// productos.html
function cargarMensaje(mensaje) {
    const label = document.getElementById("mensaje-bienvenida");
    if(label) label.textContent = mensaje;
}

const btnPrev = document.getElementById("pagina-anterior");
const btnNext = document.getElementById("pagina-siguiente");
const spanPagina = document.getElementById("numero-pagina");
const spanTotal = document.getElementById("total-paginas");

let paginaActual = 1;
const limite = 6; // productos por pagina

async function fetchProductos(page = 1) {
    const response = await fetch(`http://localhost:3000/api/productos?page=${page}&limit=${limite}`);
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

async function actualizarListado(page = 1) {
    const data = await fetchProductos(page);
    await cargarProductos(data);

    // actualizar paginación
    paginaActual = data.meta.currentPage;
    spanPagina.textContent = paginaActual;
    spanTotal.textContent = data.meta.totalPages;
    btnPrev.disabled = paginaActual <= 1;
    btnNext.disabled = paginaActual >= data.meta.totalPages;
}

btnPrev?.addEventListener("click", () => {
    if (paginaActual > 1) actualizarListado(paginaActual - 1);
});

btnNext?.addEventListener("click", () => {
    actualizarListado(paginaActual + 1);
});

async function cargarCategorias() {
    const response = await fetch('http://localhost:3000/api/categorias');
    const categorias = await response.json();

    
    const listadoCategorias = document.getElementById('categorias');
    listadoCategorias.innerHTML = `<button class="boton-categoria" id="todos-categoria">TODAS</button>`;

    if (listadoCategorias) {
        // listadoCategorias.innerHTML = "";
        // const categoriaDiv = document.createElement('div');
        // categoriaDiv.classList.add('categoria');

        categorias.payload.forEach(categoria => {
            const categoriaBoton = document.createElement('button');
            categoriaBoton.classList.add('boton-categoria');

            categoriaBoton.id = `categoria-${categoria.id_categoria}`;
            categoriaBoton.textContent = categoria.nombre.toUpperCase();

            listadoCategorias.appendChild(categoriaBoton);
            categoriaBoton.addEventListener("click", () => filtrarPorCategoria(categoria));
        });

        document.getElementById("todos-categoria").addEventListener("click", () => actualizarListado(1));
    }

    let botonTodasCategorias = document.getElementById("todos-categoria");

    if(botonTodasCategorias) botonTodasCategorias.addEventListener("click", () => filtrarPorCategoria("TODOS")); 

}

async function filtrarPorCategoria(categoria) {    
    let data;
    if(categoria === "TODOS") {
        data = await fetchProductos(paginaActual);
    }
    else {
        const res = await fetch(`http://localhost:3000/api/productos/categoria/${categoria.id_categoria}`);
        data = await res.json();
    }

    cargarProductos(data);
}

const switchModo = document.getElementById("modo-switch");
const contenedor = document.getElementById("modo-toggle");

// Cambio de modo al hacer clic en el interruptor
switchModo?.addEventListener("change", () => {
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

// Cambiar los íconos según el modo
const iconoCarrito = document.getElementById("carrito-autopartes");
const iconoSol = document.getElementById("icono-sol");
const iconoLuna = document.getElementById("icono-luna");
const modoSwitch = document.getElementById("modo-switch");


function actualizarIconosModo(modo) {
    if (modo === "oscuro") {
        iconoSol.src = "../assets/images/solBlanco.png"; 
        iconoLuna.src = "../assets/images/lunaBlanca.png";
        iconoCarrito.src = "../assets/images/carritoBlanco-autopartes.png";
    } else {
        iconoSol.src = "../assets/images/sol.png";
        iconoLuna.src = "../assets/images/luna.png";
        iconoCarrito.src = "../assets/images/carrito-autopartes.png";
    }
}

// Si esta en oscuro desde antes 
if (localStorage.getItem("modoProductos") === "oscuro") {
    actualizarIconosModo("oscuro");
    modoSwitch.checked = true;
}


modoSwitch?.addEventListener("change", () => {
    const modoActual = document.documentElement.classList.toggle("modo-oscuro") ? "oscuro" : "claro";
    localStorage.setItem("modoProductos", modoActual);
    actualizarIconosModo(modoActual);
});


async function init() {
    cargarMensaje(`Bienvenido ${obtenerNombreUsuario()}!`);

    let productos = await fetchProductos();
    cargarProductos(productos);
    
    if (window.location.pathname.endsWith('productos.html')) {
        await actualizarListado(1);
        cargarCategorias();
    }
    cargarCantidadEnHeader();
}

init(); 