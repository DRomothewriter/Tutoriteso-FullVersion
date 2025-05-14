document.addEventListener('DOMContentLoaded', async function () {
    const API_URL = "http://localhost:5500/api"; 
    const userID = document.getElementById('UserIdentifier');

    let asesorias = [];
    let currentPage = 1;
    const cardsPerPage = 9;
    const cardsWrapper = document.getElementById("cardsWrapper");
    const paginacion = document.getElementById("paginacion");

    try {
        const res = await fetch("http://localhost:5500/api/verify-token", {
            credentials: 'include'
        });

        if (!res.ok) {
            window.location.href = 'login.html';
        } else {
            const data = await res.json();
            const userId = data.user.userId;

            // Obtener datos del usuario
            try {
                const response = await fetch(`${API_URL}/users/${userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });

                const userData = await response.json();
                userID.firstChild.textContent = userData.name + '\t';
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            }

            // Obtener asesorías
            try {
                const AsesoriasResponse = await fetch(`${API_URL}/asesorias`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });

                const allAsesorias = await AsesoriasResponse.json();

                // Filtrar solo las que tienen sesiones futuras
                asesorias = allAsesorias.filter(asesoria =>
                    asesoria.sesiones.some(s => new Date(s.fecha) >= new Date())
                );

                renderPage(currentPage);
                console.log(asesorias);
            } catch (error) {
                console.error("Error al obtener asesorías:", error);
            }
        }
    } catch (error) {
        console.error('Error al verificar el token:', error);
        window.location.href = 'LogIn.html';
    }

    function renderPage(page) {
        cardsWrapper.innerHTML = "";

        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        const asesoriasToShow = asesorias.slice(start, end);

        asesoriasToShow.forEach(asesoria => {
            const sesionesFuturas = asesoria.sesiones.filter(s => new Date(s.fecha) >= new Date());
            let sesionMasCercana = sesionesFuturas.reduce((prev, current) =>
                new Date(prev.fecha) < new Date(current.fecha) ? prev : current
            );

            if (sesionMasCercana) {
                const cardHTML = `
                    <div class="col">
                        <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${asesoria.materia?.name || 'Materia desconocida'}</h5>
                            <p class="card-text">
                            <strong>Asesor:</strong> ${asesoria.asesor?.name}<br>
                            <strong>Plataforma:</strong> ${asesoria.plataforma}<br>
                            <strong>Fecha:</strong> ${new Date(sesionMasCercana.fecha).toLocaleString()}<br>
                            
                            </p>
                            <a href="#" class="btn btn-primary">Ver más</a>
                        </div>
                        </div>
                    </div>`;
                cardsWrapper.insertAdjacentHTML("beforeend", cardHTML);
            }
        });

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(asesorias.length / cardsPerPage);
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
                    renderPage(currentPage);
                }
            });
        });
    }
});