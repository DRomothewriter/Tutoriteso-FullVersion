const showCart = async () => {
    Cart.innerHTML = '';
    const productosInApi = await cart_api.getAll();
    productosInApi.forEach((producto, index) => {
        Cart.innerHTML += `
            <div class="card mb-3 p-3 itemInCart" id="${producto._id}">
                <h5>${producto.name} <button class="btn btn-danger btn-sm delete ">🗑</button></h5>
                <div class="d-flex justify-content-between">
                    <div>
                        <label>Cantidad:</label>
                        <input type="number" value="${producto.cantidad}" class="form-control d-inline w-auto cantidadCart">
                        <label>Precio:</label>
                        <span class="form-control d-inline w-auto" readonly>${producto.precio}</span> $ m.n.
                    </div>
                    <div class="d-flex align-items-center mx-auto img-fluid" style="height: 200px; width: 200px;">
                    <img src="${producto.img}" alt="${producto.name}" class="img-fluid">
                    </div>
                </div>
                <button class="btn btn-primary w-100 Actualizar" >Actualizar</button>
            </div>`;

    });
}

async function loadAsesorias() {
    try {
        pokedex.innerHTML = ""; // Limpiar contenido al cambiar de página
        const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);
        const data = await response.json();

        for (const pokemon of data.results) {
            await loadPokemonDetails(pokemon.url);
        }
    } catch (error) {
        console.error("Error in loadPokedex: ", error);
    }
}
