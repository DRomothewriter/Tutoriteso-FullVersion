document.addEventListener('DOMContentLoaded', async function () {
  const userID = document.getElementById('UserIdentifier');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const categoriaSelect = document.getElementById('categoria');
  const paginacion = document.getElementById("paginacion");
  const cardsWrapper = document.getElementById("cardsWrapper");

  let asesorias = [];
  let currentPage = 1;
  const cardsPerPage = 9;

  // =================== CARGA DE USUARIO ===================
  try {
    const res = await fetch(`${API_URL}/verify-token`, {
      credentials: 'include'
    });

    if (!res.ok) {
      window.location.href = 'Views/LogIn.html';
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

      renderPageFiltrada(asesorias); // mostrar todas al inicio
    }
  } catch (error) {
    console.error('Error general:', error);
    window.location.href = 'Views/LogIn.html';
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

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const asesoriasToShow = lista.slice(start, end);

    asesoriasToShow.forEach(asesoria => {
      const sesionesFuturas = asesoria.sesiones.filter(s => new Date(s.fecha) >= new Date());
      let sesionMasCercana = sesionesFuturas.reduce((prev, current) =>
        new Date(prev.fecha) < new Date(current.fecha) ? prev : current
      );

      if (sesionMasCercana) {
        const cardHTML = `
          <div class="col">
            <div class="card shadow-sm border-0">
                <!-- Imagen de la materia -->
                <img class="card-img-top rounded-top" src="${asesoria.materia?.url || 'https://via.placeholder.com/300x150'}" 
                    class="card-img-top" 
                    alt="Imagen de la materia">

                <!-- Contenido textual -->
                <div class="card-body">
                <h5 class="card-title">${asesoria.materia?.name || 'Materia desconocida'}</h5>
                <p class="card-text">
                    <strong>Asesor:</strong> ${asesoria.asesor?.name || 'Desconocido'}<br>
                    <strong>Plataforma:</strong> ${asesoria.plataforma}<br>
                    <strong>Fecha:</strong> ${new Date(sesionMasCercana.fecha).toLocaleString()}
                </p>
                <a href="#" class="btn btn-sm btn-primary">Ver más</a>
                </div>
            </div>
          </div>
        `;
        cardsWrapper.insertAdjacentHTML("beforeend", cardHTML);
      }
    });

    renderPagination(lista);
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
});

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
