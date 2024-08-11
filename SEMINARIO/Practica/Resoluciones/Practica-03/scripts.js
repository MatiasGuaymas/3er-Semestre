function showLoading() {
    document.getElementById('cargando').style.display = 'block';
    document.getElementById('containerCharacter').style.display = 'none';
}

function hideLoading() {
    document.getElementById('cargando').style.display = 'none';
    document.getElementById('containerCharacter').style.display = 'flex';
}

function Character(llamada) {
    showLoading();

    fetch(llamada)
        .then(response => response.json())
        .then(data => {

            const div = document.getElementById("containerCharacter");
            div.innerHTML = '';

            const fetchGeneral = data.results.map(char => {
                const card = document.createElement('div');
                card.classList.add('character-card');

                const ul1 = document.createElement('ul');
                const ul2 = document.createElement('ul');
                const ul3 = document.createElement('ul');
                const li1 = document.createElement('li');
                const li2 = document.createElement('li');
                const li3 = document.createElement('li');
                const h2 = document.createElement('h2');
                const planeta = document.createElement('h3');
                const pelis = document.createElement('h3');

                h2.innerHTML = 'Datos';
                li1.innerHTML = `Nombre: ${char.name}`;
                li2.innerHTML = `Altura: ${char.height}`;
                li3.innerHTML = `Género: ${char.gender}`;

                ul1.appendChild(h2);
                ul1.appendChild(li1);
                ul1.appendChild(li2);
                ul1.appendChild(li3);

                card.appendChild(ul1);

                planeta.innerHTML = 'Planeta';
                ul2.appendChild(planeta);

                const homeworldFetch = fetch(char.homeworld)
                    .then(response => response.json())
                    .then(homeworld => {
                        const liPlaneta1 = document.createElement('li');
                        const liPlaneta2 = document.createElement('li');
                        liPlaneta1.innerHTML = `Nombre: ${homeworld.name}`;
                        liPlaneta2.innerHTML = `Terreno: ${homeworld.terrain}`;
                        ul2.appendChild(liPlaneta1);
                        ul2.appendChild(liPlaneta2);
                    });

                card.appendChild(ul2);

                pelis.innerHTML = 'Películas';
                ul3.appendChild(pelis);

                const filmsFetch = char.films.map(peli => {
                    return fetch(peli)
                        .then(response => response.json())
                        .then(film => {
                            const liPelicula = document.createElement('li');
                            liPelicula.innerHTML = film.title;
                            ul3.appendChild(liPelicula);
                        });
                });

                card.appendChild(ul3);

                div.appendChild(card);

                return Promise.all([homeworldFetch, ...filmsFetch]); //Se resuelve cuando todas las Promesas en el array se resuelven, o una falla
            });

            const botonP = document.getElementById('previo');
            botonP.onclick = () => {
                if (data.previous) {
                    Character(data.previous);
                }
            };

            const botonN = document.getElementById('sig');
            botonN.onclick = () => {
                if (data.next) {
                    Character(data.next);
                }
            };

            return Promise.all(fetchGeneral);

        })
        .then(() => {
            hideLoading(); //Mostrar la pantalla despues de que se cumplieron todas las promesas
        })
        .catch(error => {
            console.log("Error: " + error);
            hideLoading();
        });
}

// Inicializar la función
Character('https://swapi.dev/api/people/');