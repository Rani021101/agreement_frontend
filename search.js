const token =
    localStorage.getItem("token");

if(!token){
    window.location.href =
        "login.html";
}
async function searchAgreements(){

    const q =
        document.getElementById(
            "searchText"
        ).value;

    const response =
        await fetch(
            `${CONFIG.BASE_URL}/search_agreements?q=${q}`
        );

    const data =
        await response.json();

    const results =
        document.getElementById(
            "results"
        );

    results.innerHTML = "";

    if(data.length === 0){

        results.innerHTML =
            "<p>No agreements found</p>";

        return;
    }

    data.forEach(item => {

        results.innerHTML += `
            <div class="agreement-card">

                <h3>${item.building_name}</h3>

                <p>
                    Token:
                    ${item.token_no || "-"}
                </p>

                <p>
                    Agent:
                    ${item.agent_name || "-"}
                </p>

                <p>
                    Status:
                    ${item.status}
                </p>

                <button
                    class="view-btn"
                    onclick="location.href='agreement_details.html?id=${item.sr_no}'">
                    View
                </button>

            </div>
        `;
    });
}


document
.getElementById("searchText")
.addEventListener(
    "input",
    searchAgreements
);