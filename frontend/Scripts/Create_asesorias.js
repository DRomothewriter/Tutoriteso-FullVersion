  
document.getElementById('formAsesoria').addEventListener('submit', async function (e) {

  // Captura los valores del formulario
  const materia = document.getElementById('materia').value;
  const plataforma = document.getElementById('plataforma').value;
  const duracion = parseInt(document.getElementById('duracion').value);
  const fecha = document.getElementById('fecha').value;

  // Validaciones manuales antes del envío
  if (!materia || !plataforma || !fecha || isNaN(duracion)) {
    return alert('Todos los campos son obligatorios.');
  }


  if (duracion < 30 || duracion > 180) {
    return alert('La duración debe estar entre 30 y 180 minutos.');
  }

  // Construye el cuerpo del POST
  const body = {
    materia,
    plataforma,
    duracion,
    sesiones: [{ fecha: new Date(fecha).toISOString() }]
  };

  try {
            const response = await fetch(`${API_URL}/asesorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // Incluir cookies en la solicitud
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      alert('Asesoría creada correctamente');
      document.getElementById('formAsesoria').reset();
      bootstrap.Modal.getInstance(document.getElementById('modalAsesoria')).hide();
    } else {
      console.error('Respuesta del servidor:', data);
      alert(`Error del servidor: ${data.message || 'Solicitud inválida.'}`);
    }

  } catch (error) {
    console.error('Error al enviar la asesoría:', error);
    alert('Ocurrió un error al crear la asesoría.');
  }
});


// Cargar materias dinámicamente
async function cargarMaterias() {
  try {
            const response = await fetch(`${API_URL}/materias`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });

    const materias = await response.json();
    const select = document.getElementById('materia');
    select.innerHTML = '<option selected disabled>Selecciona una materia</option>';

    materias.forEach(materia => {
      const option = document.createElement('option');
      option.value = materia._id;
      option.textContent = materia.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error('Error al cargar materias:', error);
    alert('No se pudieron cargar las materias.');
  }
}

// Cargar materias al abrir el modal
document.getElementById('modalAsesoria').addEventListener('show.bs.modal', function () {
  cargarMaterias();
});



