document.addEventListener('DOMContentLoaded', function () {

    // Definir la URL de la API como una constante
    const API_URL = "http://localhost:5500/api/users"; 

    const form = document.querySelector('form');
    const userTypeSelect = document.getElementById('user-type');
    const materiasContainer = document.getElementById('materias-container');
    const materiasList = document.getElementById('materias-list');

    // Simulación de obtener materias de una base de datos
    const materias = Array.from({ length: 100 }, (_, i) => ({
        id: `materia${i+1}`,
        name: `Materia ${i+1}`
    }));

    let materiasPorCargar = 10; // Número de materias a cargar por vez
    let materiasCargadas = 0; // Contador de materias cargadas

    // Función para cargar materias en trozos
    function loadMoreMaterias() {
        const fragment = document.createDocumentFragment();
        const end = materiasCargadas + materiasPorCargar;
        const currentMaterias = materias.slice(materiasCargadas, end);

        currentMaterias.forEach(materia => {
            const div = document.createElement('div');
            div.classList.add('form-check');
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${materia.id}" id="${materia.id}">
                <label class="form-check-label" for="${materia.id}">${materia.name}</label>
            `;
            fragment.appendChild(div);
        });

        materiasList.appendChild(fragment);
        materiasCargadas += materiasPorCargar;
    }

    // Mostrar materias si el usuario es "asesor"
    userTypeSelect.addEventListener('change', function () {
        if (this.value === 'asesor') {
            materiasContainer.classList.remove('d-none');
            loadMoreMaterias();
        } else {
            materiasContainer.classList.add('d-none');
        }
    });

    // Verificar el tipo de usuario al cargar la página
    window.onload = function () {
        if (userTypeSelect.value === 'asesor') {
            materiasContainer.classList.remove('d-none');
            loadMoreMaterias();
        } else {
            materiasContainer.classList.add('d-none');
        }
    };

    // Detectar el scroll para cargar más materias
    materiasList.addEventListener('scroll', function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
            loadMoreMaterias();
        }
    });

    // Enviar datos a la API al crear cuenta
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar recarga de página

        // Capturar datos del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = userTypeSelect.value;
        
        // Obtener materias seleccionadas si el usuario es "asesor"
        let materiasSeleccionadas = [];
        if (role === 'asesor') {
            document.querySelectorAll('#materias-list input:checked').forEach(input => {
                materiasSeleccionadas.push(input.value);
            });
        }
        // Construir objeto con los datos
        const userData = {
            name,
            email,
            password,
            role,
            materias: materiasSeleccionadas.length > 0 ? materiasSeleccionadas : undefined
        };

        try {
            // Enviar solicitud POST a la API
            const response = await fetch(API_URL, {
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
