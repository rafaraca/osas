async function fetchData() {
    const selectedEntity = document.getElementById("entitySelect").value;
    const apiUrl = `https://swapi.dev/api/${selectedEntity}/`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        displayData(data.results, selectedEntity);
    } catch (error) {
        console.error(`Erro na requisição: ${error}`);
    }
}

function displayData(data, selectedEntity) {
    const dataContainer = document.getElementById("dataContainer");
    dataContainer.innerHTML = "";

    if (data.length === 0) {
        dataContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "mt-3", "table-dark");
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
    if (event && event.target) {
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("card", "mt-3", "text-white", "bg-dark");

        const cardContent = `
            <div class="card-header">
                <h3 class="mb-0">${entity} Details</h3>
            </div>
            <div class="card-body">
                ${formatDetails(details)}
            </div>
            <div class="card-footer">
                <button class="btn btn-secondary" onclick="closeDetails(this)">Fechar Detalhes</button>
            </div>
        `;
        detailsContainer.innerHTML = cardContent;

        const clickedRow = event.target.closest("tr");
        if (clickedRow) {
            clickedRow.parentNode.insertBefore(detailsContainer, clickedRow.nextSibling);
        } else {
            console.error("Elemento pai não encontrado.");
            return;
        }
    } else {
        console.error("Evento ou event.target não definidos.");
    }
}

function formatDetails(details) {
    let formattedDetails = "";

    for (const key in details) {
        if (details.hasOwnProperty(key)) {
            if (typeof details[key] !== "object") {
                formattedDetails += `<p><strong>${key}:</strong> ${details[key]}</p>`;
            } else {
                formattedDetails += `<p><strong>${key}:</strong></p>`;
                for (const subKey in details[key]) {
                    if (details[key].hasOwnProperty(subKey)) {
                        formattedDetails += `<p class="ml-3"><strong>${subKey}:</strong> ${details[key][subKey]}</p>`;
                    }
                }
            }
        }
    }

    return formattedDetails;
}

function closeDetails(button) {
    const detailsContainer = button.closest(".card");
    if (detailsContainer) {
        detailsContainer.remove();
    }
}
