// Nombre: Quispe Huanca Carlos Daniel | C.I.: 12345678

let paginaActual = 0;
let todosPokemon = [];
let pokemonFiltrados = [];
let filtroActivo = false;

async function cargarPokemon() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = '<p class="loading">Cargando Pokémon...</p>';
    
    const offset = paginaActual * 20;
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        const data = await response.json();
        const promesas = data.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        
        todosPokemon = await Promise.all(promesas);
        
        if (filtroActivo) {
            const filtro = document.getElementById('filtroNombre').value.toLowerCase().trim();
            pokemonFiltrados = todosPokemon.filter(pokemon => 
                pokemon.name.toLowerCase().includes(filtro)
            );
            mostrarPokemon(pokemonFiltrados);
        } else {
            pokemonFiltrados = todosPokemon;
            mostrarPokemon(todosPokemon);
        }
        
        actualizarBotones();
        
    } catch (error) {
        galeria.innerHTML = '<p class="error">Error al cargar Pokémon: ' + error.message + '</p>';
    }
}

function mostrarPokemon(listaPokemon) {
    const galeria = document.getElementById('galeria');
    
    if (listaPokemon.length === 0) {
        galeria.innerHTML = '<p class="error">No se encontraron Pokémon con ese nombre</p>';
        return;
    }
    
    galeria.innerHTML = '';
    
    listaPokemon.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <div class="nombre">${pokemon.name}</div>
            <div class="id">#${pokemon.id}</div>
        `;
        galeria.appendChild(card);
    });
}

function cambiarPagina(direccion) {
    paginaActual += direccion;
    if (paginaActual < 0) paginaActual = 0;
    
    cargarPokemon();
}

function actualizarBotones() {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    
    btnAnterior.disabled = paginaActual === 0;
    btnSiguiente.disabled = false;
    
    document.getElementById('infoPagina').textContent = `Página ${paginaActual + 1}`;
}

function aplicarFiltro() {
    const filtro = document.getElementById('filtroNombre').value.toLowerCase().trim();
    
    if (!filtro) {
        mostrarPokemon(todosPokemon);
        filtroActivo = false;
        return;
    }
    
    filtroActivo = true;
    pokemonFiltrados = todosPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filtro)
    );
    
    mostrarPokemon(pokemonFiltrados);
}

function limpiarFiltro() {
    document.getElementById('filtroNombre').value = '';
    filtroActivo = false;
    mostrarPokemon(todosPokemon);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filtroNombre').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            aplicarFiltro();
        }
    });
    
    actualizarBotones();
});

cargarPokemon();