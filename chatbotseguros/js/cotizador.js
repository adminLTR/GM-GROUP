async function getAutoData(pool, descripcion) {
    let palabrasClave = descripcion
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // elimina puntuación
        .split(/\s+/)
        // .filter(word => word.length > 1);

    // Posible conversión de años abreviados como "25" a "2025"
    palabrasClave = palabrasClave.map(word => {
        if (/^\d{2}$/.test(word)) {
            const num = parseInt(word);
            if (num >= 0 && num <= 49) return '20' + word;
            if (num >= 50 && num <= 99) return '19' + word;
        }
        return word;
    });

    // Generar cláusulas OR para SQL
    const condiciones = [];
    const valores = [];

    for (const palabra of palabrasClave) {
        condiciones.push(`LOWER(MarcaSura) LIKE CONCAT('%', ?, '%')`);
        condiciones.push(`LOWER(ModeloSura) LIKE CONCAT('%', ?, '%')`);
        condiciones.push(`CAST(aaaa_fabrica AS CHAR) LIKE CONCAT('%', ?, '%')`);
        valores.push(palabra, palabra, palabra);
    }

    const whereClause = condiciones.join(" OR ");

    // Obtener todos los candidatos
    const [rows] = await pool.execute(
        `SELECT * FROM auto_data WHERE ${whereClause};`,
        valores
    );

    // Rankear resultados por número de palabras clave que coinciden
    const ranked = rows.map(row => {
        const texto = `${row.MarcaSura} ${row.ModeloSura} ${row.aaaa_fabrica}`.toLowerCase();
        const coincidencias = palabrasClave.reduce((acc, palabra) => {
            if (texto.includes(palabra)) {
                // console.log(texto + " -> " + palabra)
                if (row.MarcaSura.toLowerCase() == (palabra)) {
                    return acc+5;
                }
                if (row.ModeloSura.toLowerCase().includes(palabra)) {
                    return acc+3;
                }
                if (toString(row.aaaa_fabrica).toLowerCase().includes(palabra)) {
                    return acc+4;
                }
                return acc+1;
            }
            return acc;
        }, 0);
        return { ...row, coincidencias };
    });

    // Ordenar por coincidencias descendente
    const ordenados = ranked
        .sort((a, b) => b.coincidencias - a.coincidencias)
        .filter(row => row.coincidencias >= 3);

    // Eliminar duplicados
    const seen = new Set();
    const unicos = ordenados.filter(row => {
        const key = `${row.cod_marca}-${row.cod_modelo}-${row.aaaa_fabrica}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    console.log(ordenados)
    return unicos.slice(0, 5); // top 10
}


module.exports = {
    getAutoData,
}