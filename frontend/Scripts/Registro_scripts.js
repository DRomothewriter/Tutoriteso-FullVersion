document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    const userTypeSelect = document.getElementById('user-type');
    const materiasContainer = document.getElementById('materias-container');
    const materiasList = document.getElementById('materias-list');

    // Enviar datos a la API al crear cuenta
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar recarga de página

        // Capturar datos del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = "user"
        
        // Construir objeto con los datos
        const userData = {
            name,
            email,
            password
        };

        try {
            // Enviar solicitud POST a la API
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"                },
                body: JSON.stringify(userData) // Convertir el objeto a JSON
            });

            console.log('Respuesta completa del servidor:', response);

            const data = await response.json(); // Obtener la respuesta del servidor

            if (response.ok) {
                alert('Cuenta creada exitosamente');
                window.location.href = 'LogIn.html'; // Redirigir al login
            } else {
                // Mostrar el mensaje de error del backend
                alert(`Error: ${data.message || 'No se pudo crear la cuenta'}`);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema al conectar con el servidor.');
        }
    });
});
