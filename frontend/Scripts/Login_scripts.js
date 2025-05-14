document.addEventListener('DOMContentLoaded', function () {


    const form = document.querySelector('form');

    // Enviar datos a la API al hacer login
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar recarga de página

        // Capturar datos del formulario
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Construir objeto con los datos
        const userData = {
            email,
            password
        };

        try {
            // Enviar solicitud POST a la API
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"                
                },
                body: JSON.stringify(userData), // Convertir el objeto a JSON
                credentials: 'include' // Incluir cookies en la solicitud
            });

            console.log('Respuesta completa del servidor:', response);
            const data = await response.json(); // Convertir la respuesta a JSON

            if (response.ok) {
                alert('Log in exitoso');
                // Aquí puedes redirigir a la página de inicio o a otro lugar
                 window.location.href = '../index.html'; // Redirigir al home
            } else {
                // Mostrar el mensaje de error del backend
                alert(`Error: ${data.message || 'No se pudo hacer log in'}`);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema al conectar con el servidor.');
        }
    });
});
