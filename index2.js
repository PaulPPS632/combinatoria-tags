const tags = {
    "Nivel de Responsabilidad en el trabajo": ["Alto", "Medio", "Bajo"],
    "Rango de Edad": ["18-25", "26-35", "36-45", "46-60"],
    "Genero": ["Masculino", "Femenino", "Otro"],
    "Nivel de Estres": ["LEVE", "MODERADO", "ALTO"],
    "Tipo de Tecnica": ["Tecnica de Relajación", "Reestructuración Cognitiva", "Tecnica de Programación Neurolingüística"]
};

const combinaciones = [];

function generarCombinaciones(tags, keys, combinacion = [], index = 0) {
    if (index === keys.length) {
        combinaciones.push(combinacion.map(tag => ({
            nombre: tag,
            tipo: keys[combinacion.indexOf(tag)]
        })));
        return;
    }

    const key = keys[index];
    for (let tag of tags[key]) {
        generarCombinaciones(tags, keys, [...combinacion, tag], index + 1);
    }
}

const keys = Object.keys(tags);
generarCombinaciones(tags, keys);

// Función para hacer la request utilizando fetch
async function hacerRequest(combinacion, contador) {
    const body = {
        cant: 5,
        tags: combinacion
    };
    console.log("enviando request: ", body);
    try {
        const response = await fetch('http://localhost:3000/api/userprograma/generateActivitys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();
        console.log(`Combinación #${contador} - Respuesta recibida:`, data);
        return data;
    } catch (error) {
        console.error(`Combinación #${contador} - Error al hacer la solicitud:`, error);
    }
}

// Función para dividir las combinaciones en bloques de 5, empezando desde un índice específico
async function hacerRequestsEnParalelo(combinaciones, inicio = 0) {
    const batchSize = 5;
    let contador = inicio + 1; // Inicia el contador desde el valor `inicio`
    
    for (let i = inicio; i < combinaciones.length; i += batchSize) {
        const batch = combinaciones.slice(i, i + batchSize);
        // Espera a que todas las solicitudes en el lote actual se completen
        await Promise.all(batch.map(combinacion => hacerRequest(combinacion, contador++)));
        console.log(`Lote de ${batch.length} combinaciones procesado desde la combinación #${inicio + 1}`);
    }
}

// Llamada para iniciar desde un número de combinación específico (por ejemplo, 10)
hacerRequestsEnParalelo(combinaciones, 80);
