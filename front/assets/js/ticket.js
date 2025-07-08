
import { obtenerCarritoDeStorage, vaciarCarrito } from './carrito.js'; // asume algunas utilidades
import { API_BASE_URL } from './apiConfig.js'; 

export async function generarTicket() {
  // obtenemos datos del carrito y del usuario
  const carrito = obtenerCarritoDeStorage(); 
  if (!carrito.length) {
    alert("El carrito está vacío");
    return;
  }
  const cliente = localStorage.getItem("nombreUsuario");
  const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  try {
    // POST /api/ventas
    const ventaRes = await fetch(`${API_BASE_URL}/api/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente, total })
    });
    
    if (!ventaRes.ok) throw new Error('Error al crear la venta');
    const { payload } = await ventaRes.json();
    const idVenta = payload.id_venta;

    console.log(payload)

    // POST detalle de cada item
    for (const item of carrito) {
      await fetch(`${API_BASE_URL}/api/ventas/detalle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_venta: idVenta,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          nombre: item.nombre,
          precio_unitario: item.precio
        })
      });
    }

    vaciarCarrito();
    window.location.href = `../pages/ticket.html?id=${idVenta}`;
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al procesar la venta');
  }
}

async function cargarTicket() {
  const contenedor = document.getElementById('ticket');
  if (!contenedor) return;

  const params  = new URLSearchParams(window.location.search);
  const idVenta = params.get('id');
  if (!idVenta) {
    contenedor.textContent = 'ID de venta no especificado.';
    return;
  }

  try {
    const [ventaRes, detalleRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/ventas/${idVenta}`),
      fetch(`${API_BASE_URL}/api/ventas/detalle/${idVenta}`)
    ]);
    if (!ventaRes.ok || !detalleRes.ok) throw new Error();

    const { payload: vArr } = await ventaRes.json();
    const venta = Array.isArray(vArr) ? vArr[0] : vArr;
    const { payload: detalle } = await detalleRes.json();

    const fecha = new Date(venta.fecha).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
    console.log(fecha);
    
    contenedor.innerHTML = `
      <div class="ticket-contenedor">
        <h1 class="titulo">Ticket de venta #${venta.id_venta}</h1>
        <p><strong>Cliente:</strong> ${venta.cliente}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <table class="tabla-productos">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio U.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${detalle.map(item => `
              <tr>
                <td>${item.nombre || ''}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio_unitario}</td>
                <td>$${item.cantidad * item.precio_unitario}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h2 class="titulo">Total: $${venta.total}</h2>
        <button class="boton boton-secundario"
          onclick="window.location.href='../index.html'">
          Inicio
        </button>
      </div>
    `;
  } catch {
    contenedor.textContent = 'Error cargando el ticket.';
  }
}

// Ejecutar cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', cargarTicket);