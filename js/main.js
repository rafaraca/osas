function fetchData() {
    const selectedEntity = document.getElementById("entitySelect").value;
    const apiUrl = `https://swapi.dev/api/${selectedEntity}/`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            displayData(data.results, selectedEntity);
        },
        error: function (error) {
            console.error("Erro na requisição:", error);
        },
    });
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

    // Linhas de dados
    data.forEach((item) => {
        const row = document.createElement("tr");
        Object.values(item).forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        row.addEventListener("click", function () {
            getDetails(selectedEntity, item.url);
        });

        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    dataContainer.appendChild(table);
}

    function getDetails(entity, url) {
        $.ajax({
            url: url,
            method: "GET",
            success: function (details) {
                showModal(entity, details);
            },
            error: function (error) {
                console.error("Erro na obtenção de detalhes:", error);
            },
        });
    }

    function showModal(entity, details) {
        const modalContent = `
            <div class="modal" id="detailsModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${entity} Details</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <pre>${JSON.stringify(details, null, 2)}</pre>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalContent);

        const detailsModal = new bootstrap.Modal(document.getElementById("detailsModal"));
        detailsModal.show();

        detailsModal._element.addEventListener("hidden.bs.modal", function (e) {
            detailsModal._element.remove();
        });
    }
