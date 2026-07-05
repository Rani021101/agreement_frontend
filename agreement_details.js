const token =
    localStorage.getItem("token");

if(!token){
    window.location.href =
        "login.html";
}
const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");

async function loadDetails() {

    const response =
    await fetch(
      
        `${CONFIG.BASE_URL}/agreements/${id}`,
        {
            headers: {
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );

    const data =
        await response.json();

  document.getElementById("details").innerHTML = `

<div class="hero-card">

    <div class="hero-top">

        <div>

            <h2>🏢 ${data.building_name}</h2>

            <span class="status-badge">
                ${data.status}
            </span>

        </div>

        <div class="action-icons">

            <button onclick="editAgreement()">
                ✏️
            </button>

            <button onclick="deleteAgreement()">
                🗑️
            </button>

        </div>

    </div>

</div>

<div class="payment-grid">

    <div class="payment-card">
        <label>Total</label>
        <h3>₹${data.total_pay}</h3>
    </div>

    <div class="payment-card">
        <label>Received</label>
        <h3 class="received">
            ₹${data.received}
        </h3>
    </div>

    <div class="payment-card">
        <label>Remaining</label>
        <h3 class="remaining">
            ₹${data.remaining}
        </h3>
    </div>

</div>

<div class="two-column">

    <div class="info-card">

        <h3>Property Info</h3>

        <div class="info-row">
            <span>Token</span>
            <strong>${data.token_no || "-"}</strong>
        </div>

        <div class="info-row">
            <span>Agent</span>
            <strong>${data.agent_name || "-"}</strong>
        </div>

    </div>

    <div class="info-card">

        <h3>Contact Info</h3>

        <div class="info-row">
            <span>Owner Name</span>
            <strong>${data.owner_name || "-"}</strong>
        </div>

        <div class="info-row">
            <span>Owner Contact</span>
            <strong>${data.owner_contact || "-"}</strong>
        </div>

        <div class="info-row">
            <span>Tenant Name</span>
            <strong>${data.tenant_name || "-"}</strong>
        </div>

        <div class="info-row">
            <span>Tenant Contact</span>
            <strong>${data.tenant_no || "-"}</strong>
        </div>

    </div>

</div>

<div class="two-column">

    <div class="info-card">

        <h3>Agreement Info</h3>

        <div class="info-row">
            <span>Status</span>
            <strong>${data.status}</strong>
        </div>

        <div class="info-row">
            <span>Renewal</span>
            <strong>${data.renewal_date || "-"}</strong>
        </div>

    </div>

    <div class="info-card">

        <h3>Remarks</h3>

        <p class="remarks">
            ${data.remarks || "No remarks available"}
        </p>

    </div>

</div>

`;
}


loadDetails();

function editAgreement() {

    window.location.href =
        `edit_agreement.html?id=${id}`;
}

function deleteAgreement() {

    const confirmed =
        confirm(
            "Are you sure you want to delete this agreement?"
        );

    if (!confirmed) {
        return;
    }

    console.log("Delete started");

    const emp_id =
        localStorage.getItem("emp_id");

    fetch(
      
        `${CONFIG.BASE_URL}/agreements/${id}`,
        {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                emp_id: emp_id
            })
        }
    )
    .then(response => {

        console.log("Status:", response.status);

        return response.json();
    })
    .then(data => {

        console.log("Response:", data);

        alert(data.message);

        window.location.href =
            "agreements.html";
    })
    .catch(error => {

        console.error(error);

        alert("Delete failed");
    });
}



