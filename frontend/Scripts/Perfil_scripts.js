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
    document.querySelector('.card-title').textContent = user.name || 'Nombre de Usuario';

    const cardRow = document.querySelector('.card-row');
    cardRow.innerHTML = '';

    // ================== ASESORÍAS COMO ASESOR ==================
    const asesoriasRes = await fetch(`${API_URL}/asesorias/mis-asesorias`, {
      credentials: 'include'
    });
    const asesorias = await asesoriasRes.json();

    const contenedorCreadas = document.createElement('div');
    contenedorCreadas.classList.add('mb-5');

    const tituloCreadas = document.createElement('h4');
    tituloCreadas.textContent = 'Asesorías creadas';
    contenedorCreadas.appendChild(tituloCreadas);

    if (asesorias.length === 0) {
      contenedorCreadas.innerHTML += '<div class="text-muted">No tienes asesorías como asesor.</div>';
    } else {
      asesorias.forEach(asesoria => {
        const sesionesFuturas = asesoria.sesiones.filter(s => new Date(s.fecha) >= new Date());
        let sesionMasCercana = sesionesFuturas.reduce((prev, current) =>
          new Date(prev.fecha) < new Date(current.fecha) ? prev : current
        );

        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${asesoria.materia?.name || 'Asesoría'}</h5>
            <p class="card-text">
              ${sesionMasCercana ? new Date(sesionMasCercana.fecha).toLocaleString() : 'Sin fecha disponible'}<br>
              <strong>Asesor:</strong> ${asesoria.asesor?.name || 'Desconocido'}
            </p>
            <button class="btn btn-danger btn-sm btn-eliminar-asesoria" data-id="${asesoria._id}" data-type="propia">Eliminar</button>
          </div>
        `;
        contenedorCreadas.appendChild(card);
      });
    }
    cardRow.appendChild(contenedorCreadas);

    // ================== ASESORÍAS INSCRITAS ==================
    const inscritasRes = await fetch(`${API_URL}/asesorias`, {
      credentials: 'include'
    });
    const todasAsesorias = await inscritasRes.json();

    const inscritas = todasAsesorias.filter(a =>
      a.sesiones.some(s =>
        s.posiblesAsesorados.some(id => id._id === userId || id === userId)
      )
    );

    const contenedorInscritas = document.createElement('div');
    contenedorInscritas.classList.add('mb-5');

    const tituloInscritas = document.createElement('h4');
    tituloInscritas.textContent = 'Asesorías inscritas';
    contenedorInscritas.appendChild(tituloInscritas);

    if (inscritas.length === 0) {
      contenedorInscritas.innerHTML += '<div class="text-muted">No estás inscrito en ninguna asesoría.</div>';
    } else {
      inscritas.forEach(asesoria => {
        const sesionesFuturas = asesoria.sesiones.filter(s =>
          s.posiblesAsesorados.some(id => id._id === userId || id === userId) &&
          new Date(s.fecha) >= new Date()
        );

        if (sesionesFuturas.length === 0) return;

        let sesionMasCercana = sesionesFuturas.reduce((prev, current) =>
          new Date(prev.fecha) < new Date(current.fecha) ? prev : current
        );

        const card = document.createElement('div');
        card.className = 'card mb-3 border-success';
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${asesoria.materia?.name || 'Asesoría'}</h5>
            <p class="card-text">
              ${new Date(sesionMasCercana.fecha).toLocaleString()}<br>
              <strong>Asesor:</strong> ${asesoria.asesor?.name || 'Desconocido'}
            </p>
            <button class="btn btn-danger btn-sm btn-cancelar-inscripcion" data-id="${asesoria._id}" data-type="inscrita">Eliminar</button>
          </div>
        `;
        contenedorInscritas.appendChild(card);
      });
    }
    cardRow.appendChild(contenedorInscritas);

    // ============= Manejo de botones de eliminar =============
    cardRow.addEventListener('click', async function(e) {
      const id = e.target.getAttribute('data-id');
      const type = e.target.getAttribute('data-type');

      if (e.target.classList.contains('btn-eliminar-asesoria')) {
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
      } else if (e.target.classList.contains('btn-cancelar-inscripcion')) {
        if (confirm('¿Deseas cancelar tu inscripción a esta asesoría?')) {
          try {
            await fetch(`${API_URL}/asesorias/${id}/cancelar-inscripcion`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
            });
            e.target.closest('.card').remove();
          } catch (error) {
            alert('Error al cancelar la inscripción');
          }
        }
      }
    });

  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    window.location.href = 'LogIn.html';
  }
});

document.querySelector('.btn-outline-danger').addEventListener('click', async function (e) {
  e.preventDefault();
  try {
    const res = await fetch(`${API_URL}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Error al cerrar sesión: ${data.message || 'Inténtalo de nuevo más tarde.'}`);
      return;
    }

    // Si todo salió bien, redirigir al inicio
    window.location.href = '../index.html';

  } catch (error) {
    console.error("Error al hacer logout:", error);
    alert("Error al intentar cerrar sesión. Revisa tu conexión o intenta nuevamente.");
  }
});
