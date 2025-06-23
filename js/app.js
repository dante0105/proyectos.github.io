document.addEventListener('DOMContentLoaded', function () {
    const carrito = document.querySelector('#carrito');
    const listaCursos = document.querySelector('#lista-cursos');
    const contenedorCarrito = document.querySelector('#lista-carrito tbody');
    const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    const input = document.getElementById('buscador');
    const botonBuscar = document.getElementById('btn-buscar');

    let articulosCarrito = [];

    // Listeners
    cargarEventListeners();

    function cargarEventListeners() {
        listaCursos.addEventListener('click', agregarCurso);
        carrito.addEventListener('click', eliminarCurso);
        vaciarCarritoBtn.addEventListener('click', () => {
            articulosCarrito = [];
            limpiarHTML();
        });

        if (input && botonBuscar) {
            input.addEventListener('input', filtrarProductos);
            botonBuscar.addEventListener('click', filtrarProductos);
        }

        // Cargar carrito desde localStorage
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    }

    function agregarCurso(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const curso = e.target.closest('.card');
            leerDatosCurso(curso);
            productoAgregado(curso);
        }
    }

    function productoAgregado(curso) {
        const alert = document.createElement("H4");
        alert.style.cssText = "background-color: red; color: white; text-align: center; margin: 5px 20px;";
        alert.textContent = 'Añadido al carrito';
        curso.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }

    function eliminarCurso(e) {
        if (e.target.classList.contains('borrar-curso')) {
            const cursoId = e.target.getAttribute("data-id");
            articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
            carritoHTML();
        }
    }

    function leerDatosCurso(curso) {
        const infoCurso = {
            imagen: curso.querySelector('img').src,
            titulo: curso.querySelector('h4').textContent,
            precio: curso.querySelector('.precio').childNodes[0].textContent.trim(),
            id: curso.querySelector('a.agregar-carrito').getAttribute('data-id'),
            cantidad: 1
        };

        const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
        if (existe) {
            articulosCarrito = articulosCarrito.map(curso => {
                if (curso.id === infoCurso.id) {
                    curso.cantidad++;
                }
                return curso;
            });
        } else {
            articulosCarrito = [...articulosCarrito, infoCurso];
        }

        carritoHTML();
    }

    function carritoHTML() {
        limpiarHTML();
        articulosCarrito.forEach(curso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${curso.imagen}" width="100"></td>
                <td>${curso.titulo}</td>
                <td>${curso.precio}</td>
                <td>${curso.cantidad}</td>
                <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
            `;
            contenedorCarrito.appendChild(row);
        });
        sincronizarStorage();
    }

    function sincronizarStorage() {
        localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
    }

    function limpiarHTML() {
        while (contenedorCarrito.firstChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        }
    }

    function filtrarProductos() {
        const filtro = input.value.toLowerCase();
        const tarjetas = document.querySelectorAll('.card');

        tarjetas.forEach(function (card) {
            const texto = card.innerText.toLowerCase();
            card.style.display = texto.includes(filtro) ? '' : 'none';
        });
    }
});
