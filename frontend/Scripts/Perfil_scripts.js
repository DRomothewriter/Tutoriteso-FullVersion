document.addEventListener('DOMContentLoaded', async function () {
  // Verifica el token y obtiene el ID del usuario autenticado
  try {
    const res = await fetch(`${API_URL}/verify-token`, {
      credentials: 'include'
    });

    if (!res.ok) {
      window.location.href = 'LogIn.html';
      return;
    }


    const data = await res.json();
    const userId = data.user.userId;

    // Obtiene los datos del usuario
    const userRes = await fetch(`${API_URL}/users/${userId}`, {
      credentials: 'include'
    });
    const user = await userRes.json();

    const userID = document.getElementById('UserIdentifier');


    userID.firstChild.textContent = user.name + '\t';
    // Actualiza el DOM con los datos del usuario
    document.querySelector('.card-title').textContent = user.name || 'Nombre de Usuario';
    //document.querySelector('.card-text').textContent = user.bio || 'Esta es una breve biografía del usuario. Puedes hablar un poco sobre tus intereses o cualquier otra información.';


// Obtiene las asesorías donde el usuario es asesor
    const asesoriasRes = await fetch(`${API_URL}/asesorias/mis-asesorias`, {
    credentials: 'include'
    });
    const asesorias = await asesoriasRes.json();

    // Selecciona el contenedor de cartas
    const cardRow = document.querySelector('.card-row');
    cardRow.innerHTML = ''; // Limpia cartas anteriores

    if (asesorias.length === 0) {
    cardRow.innerHTML = '<div class="text-muted">No tienes asesorías como asesor.</div>';
    } else {
    const fragment = document.createDocumentFragment();
    asesorias.forEach(asesoria => {
        const sesionesFuturas = asesoria.sesiones.filter(s => new Date(s.fecha) >= new Date());
        let sesionMasCercana = sesionesFuturas.reduce((prev, current) =>
        new Date(prev.fecha) < new Date(current.fecha) ? prev : current
      );
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${asesoria.materia.name|| 'Asesoría'}</h5>
            <p class="card-text">${sesionMasCercana || 'descripcion o fecha'}</p>
            <button class="btn btn-danger btn-sm btn-eliminar-asesoria" data-id="${asesoria._id}">Eliminar</button>
      
        </div>
        `;
        fragment.appendChild(card);
    });
    cardRow.appendChild(fragment);
    cardRow.addEventListener('click', async function(e) {
    if (e.target.classList.contains('btn-eliminar-asesoria')) {
      const id = e.target.getAttribute('data-id');
      if (confirm('¿Seguro que deseas eliminar esta asesoría?')) {
        try {
          await fetch(`${API_URL}/asesorias/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          e.target.closest('.card').remove();
        } catch (error) {
          alert('Error al eliminar la asesoría');
        }
      }
    }
    });

    }

  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    window.location.href = 'LogIn.html';
  }
});

document.querySelector('.btn-outline-danger').addEventListener('click', async function (e) {
  e.preventDefault();
    try {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    // Ignora errores para asegurar el logout
  }
  
  window.location.href = '../index.html';
});

