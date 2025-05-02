document.addEventListener('DOMContentLoaded', function() {
    const URL = "http://localhost:5000"

    const chromaForm = document.getElementById('chroma-form');
    const listaResultadosDiv = document.getElementById('listaResultados');
    const categoriaSelect = document.getElementById('categoria');
    const corredorSelect = document.getElementById('corredor');
    
    fillCorredores();

    chromaForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(chromaForm);
        const input= formData.get('input');
        const respuesta = formData.get('respuesta');
        const categoria = formData.get('categoria');
        const corredor = corredorSelect.value
        console.log(corredor)
        const dataToSend = {
            input: input,
            respuesta: respuesta,
            corredor: corredor,
            categoria: categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
        };

        fetch(`${URL}/add_chroma_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Datos enviados correctamente.');
            chromaForm.reset();
            corredorSelect.value = corredor;
        })
        .catch(error => {
            alert('Hubo un error al enviar los datos.');
        });
    });

    document.getElementById('consultarCategoria').addEventListener('click', function() {
        const categoria = categoriaSelect.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const corredor = corredorSelect.value
        if (categoria) {
            fetch(`${URL}/get_documents_by_category/${corredor}/${categoria}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                listaResultadosDiv.innerHTML = '';
                if (data.results && data.results.length > 0) {
                    data.results.forEach(item => {
                        const resultadoItem = document.createElement('div');
                        resultadoItem.classList.add('mt-1', 'p-1', 'border-bottom');
                        resultadoItem.innerHTML = `
                            <p><strong>Input:</strong> ${item.document || 'No disponible'}</p>
                            <p><strong>Respuesta:</strong> ${item.metadata.answer || 'No disponible'}</p>
                        `;
                        listaResultadosDiv.appendChild(resultadoItem);
                    });
                } else {
                    listaResultadosDiv.innerHTML = '<p>No se encontraron documentos para esta categoría.</p>';
                }
            })
            .catch(error => {
                listaResultadosDiv.innerHTML = '<p class="text-danger">Error al obtener los documentos.</p>';
            });
        } else {
            alert('Por favor, seleccione una categoría para consultar.');
        }
    });

    document.getElementById('limpiarTodo').addEventListener('click', function() {
        const corredor = corredorSelect.value;
        chromaForm.reset();
        corredorSelect.value = corredor;
        listaResultadosDiv.innerHTML = ''; 
    });

    function fillCorredores() {
        fetch(`http://149.50.133.40:8080/api/list-corredores`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            corredorSelect.innerHTML = ''; // Limpiar opciones previas si hay
            const optionGeneral = document.createElement('option');
            optionGeneral.value = 0;
            optionGeneral.textContent = "GENERAL";
            optionGeneral.classList.add("text-danger", "fw-bold")
            corredorSelect.appendChild(optionGeneral);
            data.corredores.forEach(corredor => {
                const option = document.createElement('option');
                option.value = corredor.id_corredor;
                option.textContent = corredor.nombre;
                corredorSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.log(error)
            alert('Hubo un error al recibir los datos.');
        });
    }
});