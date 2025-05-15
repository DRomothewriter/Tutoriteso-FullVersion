document.addEventListener('DOMContentLoaded', async function () {
  const userID = document.getElementById('UserIdentifier');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const categoriaSelect = document.getElementById('categoria');
  const paginacion = document.getElementById("paginacion");
  const cardsWrapper = document.getElementById("cardsWrapper");

  let asesorias = [];
  let currentPage = 1;
  const cardsPerPage = 6 ;

  // =================== CARGA DE USUARIO ===================
  try {
    const res = await fetch(`${API_URL}/verify-token`, {
      credentials: 'include'
    });

    if (!res.ok) {
      window.location.href = 'LogIn.html';
    } else {
      const data = await res.json();
      const userId = data.user.userId;

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      const userData = await response.json();
      userID.firstChild.textContent = userData.name + '\t';

      // ================ CARGA DE ASESORÍAS ================
      const AsesoriasResponse = await fetch(`${API_URL}/asesorias`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      const allAsesorias = await AsesoriasResponse.json();
      asesorias = allAsesorias.filter(asesoria =>
        asesoria.sesiones.some(s => new Date(s.fecha) >= new Date())
      );

      renderPageFiltrada(asesorias);
    }
  } catch (error) {
    console.error('Error general:', error);
    window.location.href = 'LogIn.html';
  }

  // ==================== FILTROS ====================
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    aplicarFiltros();
  });

  document.getElementById('btnAplicarFiltros')?.addEventListener('click', aplicarFiltros);

  function aplicarFiltros() {
    const texto = searchInput.value.toLowerCase().trim();
    const materiaSeleccionada = categoriaSelect.value;

    let filtradas = asesorias.filter(a => {
      const nombreMateria = a.materia?.name?.toLowerCase() || '';
      const nombreAsesor = a.asesor?.name?.toLowerCase() || '';

      const coincideTexto = nombreMateria.includes(texto) || nombreAsesor.includes(texto);
      const coincideMateria = materiaSeleccionada === 'todas' || a.materia?._id === materiaSeleccionada;

      return coincideTexto && coincideMateria;
    });

    currentPage = 1;
    renderPageFiltrada(filtradas);
  }

  // ==================== RENDER PAGE ====================
  function renderPageFiltrada(lista) {
    cardsWrapper.innerHTML = "";

    const visibles = lista.filter(a =>
      a.sesiones.some(s => new Date(s.fecha) >= new Date())
    );

    if (visibles.length === 0) {
      cardsWrapper.innerHTML = `
        <div class="col-12 text-center text-muted py-5">
          <p>No se encontraron asesorías disponibles.</p>
        </div>
      `;
      paginacion.innerHTML = '';
      return;
    }

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const asesoriasToShow = visibles.slice(start, end);

    asesoriasToShow.forEach(asesoria => {
      const sesionesFuturas = asesoria.sesiones.filter(s => new Date(s.fecha) >= new Date());
      let sesionMasCercana = sesionesFuturas.reduce((prev, current) =>
        new Date(prev.fecha) < new Date(current.fecha) ? prev : current
      );

      const cardHTML = `
        <div class="col">
          <div class="card shadow-sm border-0">
            <img
              src="${asesoria.materia?.url || 'https://via.placeholder.com/300x150'}"
              class="img-fluid rounded-top"
              alt="Imagen"
              style="aspect-ratio: 16 / 9; object-fit: cover; width: 100%;">
            <div class="card-body">
              <h5 class="card-title">${asesoria.materia?.name || 'Materia desconocida'}</h5>
              <p class="card-text">
                <strong>Asesor:</strong> ${asesoria.asesor?.name || 'Desconocido'}<br>
                <strong>Plataforma:</strong> ${asesoria.plataforma}<br>
                <strong>Fecha:</strong> ${new Date(sesionMasCercana.fecha).toLocaleString()}
              </p>
              <a href="#" class="btn btn-sm btn-primary btn-inscribirse" data-id="${asesoria._id}">Inscribirse</a>
            </div>
          </div>
        </div>
      `;
      cardsWrapper.insertAdjacentHTML("beforeend", cardHTML);
    });

    renderPagination(visibles);
  }

  function renderPagination(lista) {
    const totalPages = Math.ceil(lista.length / cardsPerPage);
    let paginationHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }

    paginacion.innerHTML = `
      <nav aria-label="nav">
        <ul class="pagination justify-content-center">
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
          </li>
          ${paginationHTML}
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
          </li>
        </ul>
      </nav>`;

    paginacion.querySelectorAll("a.page-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const newPage = parseInt(link.getAttribute("data-page"));
        if (newPage >= 1 && newPage <= totalPages) {
          currentPage = newPage;
          renderPageFiltrada(lista);
        }
      });
    });
  }

  // ==================== CARGAR MATERIAS ====================
  cargarMateriasEnFiltro();

  async function cargarMateriasEnFiltro() {
    const select = document.getElementById('categoria');
    try {
      const response = await fetch(`${API_URL}/materias`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const materias = await response.json();
      select.innerHTML = '<option value="todas">Todas</option>';

      materias.forEach(({ _id, name }) => {
        const option = document.createElement('option');
        option.value = _id;
        option.textContent = name;
        select.appendChild(option);
      });

    } catch (error) {
      console.error('Error al cargar materias en el filtro:', error);
      select.innerHTML = '<option disabled>Error al cargar materias</option>';
    }
  }
});

// ==================== INSCRIBIRSE A ASESORÍA ====================
cardsWrapper.addEventListener('click', async function (e) {
  if (e.target.classList.contains('btn-inscribirse')) {
    e.preventDefault();
    const asesoriaId = e.target.getAttribute('data-id');

    try {
      const asInsRes = await fetch(`${API_URL}/asesorias/${asesoriaId}/inscribirse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await asInsRes.json();
      if (asInsRes.ok) {
        alert(' Te has inscrito correctamente a la asesoría');
        e.target.textContent = 'Inscrito';
        e.target.classList.remove('btn-primary');
        e.target.classList.add('btn-outline-secondary');
        e.target.disabled = true;
      } else {
        alert(` ${data.message}`);
      }

    } catch (err) {
      console.error('Error al inscribirse:', err);
      alert(' Error al intentar inscribirte. Intenta más tarde.');
    }
  }
});
