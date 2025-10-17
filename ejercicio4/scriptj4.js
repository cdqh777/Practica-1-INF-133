// Nombre: Quispe Huanca Carlos Daniel | C.I.: 12345678

async function buscarDigimon() {
    const tipo = document.getElementById('tipoBusqueda').value;
    const valor = document.getElementById('valorBusqueda').value;
    const resultados = document.getElementById('resultados');
    
    resultados.innerHTML = '<p class="loading">Cargando...</p>';
    
    let url = 'https://digimon-api.vercel.app/api/digimon';
    
    if (tipo === 'nombre' && valor) {
        url = `https://digimon-api.vercel.app/api/digimon/name/${valor}`;
    } else if (tipo === 'nivel' && valor) {
        url = `https://digimon-api.vercel.app/api/digimon/level/${valor}`;
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.length === 0) {
            resultados.innerHTML = '<p class="error">No se encontraron resultados</p>';
            return;
        }
        
        let tabla = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Nivel</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach((digimon, index) => {
            tabla += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${digimon.name}</td>
                    <td>${digimon.level}</td>
                </tr>
            `;
        });
        
        tabla += '</tbody></table>';
        tabla += `<p style="margin-top: 15px; text-align: center;">Total: ${data.length} Digimon encontrados</p>`;
        
        resultados.innerHTML = tabla;
        
    } catch (error) {
        resultados.innerHTML = '<p class="error">Error al buscar: ' + error.message + '</p>';
    }
}

document.getElementById('valorBusqueda').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarDigimon();
    }
});