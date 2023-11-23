function fetchData() {
    const selectedEntity = document.getElementById("entitySelect").value;
    const apiUrl = `https://swapi.dev/api/${selectedEntity}/`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => displayData(data.results, selectedEntity))
        .catch(error => console.error(error));
}

function displayData(data, selectedEntity) {
    const dataContainer = document.getElementById("dataContainer");
    dataContainer.innerHTML = "";

    if (data.length === 0) {
        dataContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "mt-3");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach((key) => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.forEach((item) => {
        const row = document.createElement("tr");
        Object.values(item).forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        row.addEventListener("click", async function (event) {
            try {
                const details = await getDetails(selectedEntity, item.url);
                showDetails(selectedEntity, details, event);
            } catch (error) {
                console.error(`Erro na obtenção de detalhes: ${error}`);
            }
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    dataContainer.appendChild(table);
}

async function getDetails(entity, url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    return response.json();
}


function showDetails(entity, details, event) {
    // Verifique se o evento e event.target estão definidos
    if (event && event.target) {
        // Crie uma div para mostrar os detalhes
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("details-container", "mt-3");

        // Adicione o conteúdo dos detalhes à div
        const detailsContent = `
            <h3 class="mb-3">${entity} Details</h3>
            <pre>${JSON.stringify(details, null, 2)}</pre>
        `;
        detailsContainer.innerHTML = detailsContent;

        // Encontre o elemento pai (a linha clicada) e anexe os detalhes abaixo dele
        const clickedRow = event.target.closest("tr");
        if (clickedRow) {
            clickedRow.parentNode.insertBefore(detailsContainer, clickedRow.nextSibling);

            // Adicione um botão para fechar os detalhes
            const closeButton = document.createElement("button");
            closeButton.textContent = "Fechar Detalhes";
            closeButton.classList.add("btn", "btn-secondary", "mt-3");
            closeButton.addEventListener("click", function () {
                // Remova a div de detalhes ao clicar no botão
                detailsContainer.remove();
            });

            // Adicione o botão à div de detalhes
            detailsContainer.appendChild(closeButton);
        } else {
            console.error("Elemento pai não encontrado.");
        }
    } else {
        console.error("Evento ou event.target não definidos.");
    }
}









