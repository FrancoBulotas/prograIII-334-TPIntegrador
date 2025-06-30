let botonIngresa = document.getElementById("boton-ingresar").addEventListener('click', () => {
        const nombreUsuario = document.getElementById('nombre-usuario').value;

        if (nombreUsuario.trim() === '') {
            alert('Por favor, ingresa tu nombre.');
        } else {
            window.location.href = './pages/productos.html'; 
        }
    });


