document.addEventListener('DOMContentLoaded', async function () {

        const API_URL = "http://localhost:5500/api/users"; 
        const userID = document.getElementById('UserIdentifier');


    try {
        const res = await fetch("http://localhost:5500/api/verify-token", {
            credentials: 'include'
        });

        if (!res.ok) {
            // Si el token no es válido o no existe, redirige al login
            window.location.href = 'login.html';
            console.log("Token invalido")
        }
        else
        {
            // Si todo va bien, puedes continuar cargando la página
            console.log("Token válido, usuario autenticado");
                
            const data = await res.json();
            const userId = data.user.userId;
            
try {
    const response = await fetch(`${API_URL}/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // No es necesario agregar el token si usas cookies y `credentials: 'include'`
        },
        credentials: "include"  // Aquí se envían las cookies automáticamente
    });

            if (!response.ok) {
                throw new Error('Error al obtener usuario');  // Asegurarte de que la respuesta sea válida
            }

            const userData = await response.json();  // Convertir la respuesta a JSON

            console.log(userData);  // Ver el contenido del objeto para depurar

            // Asignar el nombre a la variable donde lo necesites (por ejemplo, en un elemento HTML)
            userID.firstChild.textContent = userData.name + '\t';  // Usar \t para tab
        } catch (error) {
            console.error("Error al obtener usuario:", error);
        }

        }
    } catch (error) {
        console.error('Error al verificar el token:', error);
        window.location.href = 'LogIn.html';
    }
});

/*


*/
