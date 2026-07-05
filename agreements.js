const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "login.html";
}

const params =
    new URLSearchParams(
        window.location.search
    );

const statusFilter =
    params.get("status");

let allAgreements = [];

function renderAgreements(agreements) {

    const container =
        document.getElementById(
            "agreementList"
        );

    container.innerHTML = "";

    if (agreements.length === 0) {

        container.innerHTML =
            "<p>No agreements found</p>";

        return;
    }

    agreements.forEach(item => {

        container.innerHTML += `

        <div class="agreement-card">

            <div class="card-header">

                <h3>${item.building_name}</h3>

                <div class="card-actions">

                    <button
                        class="icon-btn"
                        onclick="editAgreement(${item.sr_no})">
                        ✏️
                    </button>

                    <button
                        class="icon-btn delete"
                        onclick="deleteAgreement(${item.sr_no})">
                        🗑️
                    </button>

                </div>

            </div>

            <p>Token: ${item.token_no || "-"}</p>

            <p>Status: ${item.status}</p>

            <p>Agent: ${item.agent_name || "-"}</p>

            <button
                class="view-btn"
                onclick="viewAgreement(${item.sr_no})">

                View Details

            </button>

        </div>

        `;
    });
}

async function loadAgreements() {

    const response =
        await fetch(
            `${CONFIG.BASE_URL}/display_agreements`,
         
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

    if (response.status === 401) {

        localStorage.clear();

        window.location.href =
            "login.html";

        return;
    }

    allAgreements =
        await response.json();

    if(statusFilter){

        if(statusFilter === "all"){

            renderAgreements(
                allAgreements
            );

        }else if(
            statusFilter === "renewal"
        ){

            const today =
                new Date();

            const next30 =
                new Date();

            next30.setDate(
                today.getDate() + 30
            );

            const renewals =
                allAgreements.filter(item => {

                    const renewalDate =
                        new Date(
                            item.renewal_date
                        );

                    return (
                        renewalDate >= today &&
                        renewalDate <= next30
                    );
                });

            renderAgreements(
                renewals
            );

        }else{

            const filtered =
                allAgreements.filter(item =>
                    item.status
                        ?.toLowerCase() ===
                    statusFilter
                        .toLowerCase()
                );

            renderAgreements(
                filtered
            );
        }

    }else{

        renderAgreements(
            allAgreements
        );
    }
}

loadAgreements();

function viewAgreement(id) {

    window.location.href =
        `agreement_details.html?id=${id}`;
}

function editAgreement(id) {

    window.location.href =
        `edit_agreement.html?id=${id}`;
}

let selectedAgreementId = null;

function deleteAgreement(id) {

    selectedAgreementId = id;

    document.getElementById(
        "deleteModal"
    ).style.display = "flex";
}

function closeDeleteModal() {

    document.getElementById(
        "deleteModal"
    ).style.display = "none";
}

async function confirmDelete() {

    const emp_id =
        localStorage.getItem("emp_id");

    const response =
        await fetch(
        
            `${CONFIG.BASE_URL}/agreements/${selectedAgreementId}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    emp_id: emp_id
                })
            }
        );

    if(response.status === 401){

        localStorage.clear();

        window.location.href =
            "login.html";

        return;
    }

    const data =
        await response.json();

    closeDeleteModal();

    showMessage(
        data.message,
        "success"
    );

    setTimeout(() => {

        loadAgreements();

    }, 1000);
}

function showMessage(message, type) {

    const box =
        document.getElementById(
            "messageBox"
        );

    box.innerText =
        message;

    box.className =
        `message-box ${type} show`;

    setTimeout(() => {

        box.classList.remove(
            "show"
        );

    }, 3000);
}

document
.getElementById("searchBox")
.addEventListener("input", function(){

    const keyword =
        this.value
            .toLowerCase()
            .trim();

    const filtered =
        allAgreements.filter(item => {

            const building =
                (item.building_name || "")
                    .toLowerCase();

            const token =
                (item.token_no || "")
                    .toLowerCase();

            return (
                building.includes(keyword) ||
                token.includes(keyword)
            );
        });

    renderAgreements(filtered);
});