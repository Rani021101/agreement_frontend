const token =
    localStorage.getItem("token");

if(!token){

    window.location.href =
        "login.html";
}

document.getElementById("name")
    .innerText =
    localStorage.getItem("name");

document.getElementById("empId")
    .innerText =
    localStorage.getItem("emp_id");

loadProfile();


async function loadProfile(){

    await loadStats();

    await loadRenewals();

    await loadActivities();
}

async function loadStats(){

    const response =
        await fetch(
            `${CONFIG.BASE_URL}/dashboard_stats`,
            {
                headers:{
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

    const data =
        await response.json();

    document.getElementById("total")
        .innerText = data.total;

    document.getElementById("renewals")
        .innerText = data.renewals;
}

async function loadRenewals(){

    const response =
        await fetch(
            `${CONFIG.BASE_URL}/upcoming_renewals`,
            {
                headers:{
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

    const data = await response.json();

    const container =
        document.getElementById("renewalList");

    container.innerHTML = "";

    if(data.length === 0){

        container.innerHTML =
            "<p>No upcoming renewals</p>";

        return;
    }

    data.slice(0,5).forEach(item => {

        container.innerHTML += `
            <div class="renewal-card">

                <div>

                    <strong>
                        ${item.building_name}
                    </strong>

                    <p>
                        ${item.renewal_date}
                    </p>

                </div>

            </div>
        `;
    });

    if(data.length > 5){

        container.innerHTML += `
            <button
                class="report-btn"
                onclick="location.href='dashboard.html#renewalSection'">

                View All (${data.length})

            </button>
        `;
    }

}

function exportAgreements(){
    closeModal();
    window.open(
        `${CONFIG.BASE_URL}/export_agreements`,
    );
}

function logout(){

    const confirmed =
        confirm(
            "Do you want to logout?"
        );

    if(!confirmed){
        return;
    }

    localStorage.clear();

    window.location.href =
        "login.html";
}

async function loadActivities(){

    const response =
        await fetch(
            `${CONFIG.BASE_URL}/recent_activities`,
            {
                headers:{
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

    if(response.status === 401){

        localStorage.clear();

        window.location.href =
            "login.html";

        return;
    }

    const activities =
        await response.json();

    const container =
        document.getElementById(
            "activityList"
        );

    container.innerHTML = "";

    if(activities.length === 0){

        container.innerHTML =
            "<p>No recent activities</p>";

        return;
    }

    activities.slice(0,5).forEach(item => {

        let icon = "📋";

        if(item.type === "ADD"){
            icon = "🟢";
        }

        if(item.type === "EDIT"){
            icon = "🟡";
        }

        if(item.type === "DELETE"){
            icon = "🔴";
        }

        container.innerHTML += `

        <div class="activity-card">

    <div class="activity-top">

        <div class="activity-icon">
            ${icon}
        </div>

        <div>

            <div>
                ${item.description}
            </div>

            <small>
                ${new Date(
                    item.created_on
                ).toLocaleString()}
            </small>

        </div>

    </div>

</div>

        `;
    });
}

function openModal(title, content){

    document.getElementById(
        "modalTitle"
    ).innerHTML = title;

    document.getElementById(
        "modalBody"
    ).innerHTML = content;

    document.getElementById(
        "modal"
    ).style.display = "block";
}

function closeModal(){

    document.getElementById(
        "modal"
    ).style.display = "none";
}

function openUserModal(){

    openModal(
        "👤 User Information",

        `
        <p><b>Name:</b>
        ${localStorage.getItem("name")}</p>

        <p><b>Employee ID:</b>
        ${localStorage.getItem("emp_id")}</p>

        <p><b>Status:</b>
        Active</p>
        `
    );
}
async function openStatsModal(){

    const response =
    await fetch(
        `${CONFIG.BASE_URL}/dashboard_stats`,
        {
            headers:{
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );

    const data =
        await response.json();

    openModal(
        "📊 Statistics",

        `
        <p>Total Agreements:
        <b>${data.total}</b></p>

        <p>Pending:
        <b>${data.pending}</b></p>

        <p>Registered:
        <b>${data.registered}</b></p>

        <p>Cancelled:
        <b>${data.cancelled}</b></p>

        <p>Renewals:
        <b>${data.renewals}</b></p>
        `
    );
}
async function openRenewalModal(){

    const response =
    await fetch(
        `${CONFIG.BASE_URL}/upcoming_renewals`,
        {
            headers:{
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );

    const data =
        await response.json();

    let html = "";

    data.forEach(item=>{

  html += `
<div
    class="renewal-card clickable-card"
    onclick="openAgreementDetails(${item.sr_no})">

    <div>

        <strong>
            ${item.building_name}
        </strong>

        <p>
            📅 ${item.renewal_date}
        </p>

        <small>
            Status:
            ${item.status}
        </small>

    </div>

    <div class="arrow">
        ›
    </div>

</div>
`;
    });

    openModal(
        "🔔 Upcoming Renewals",
        html
    );
}
async function openActivityModal(){

    const empId =
        localStorage.getItem(
            "emp_id"
        );

    const response =
        await fetch(
            `${CONFIG.BASE_URL}/my_activities/${empId}`
        );

    const data =
        await response.json();

    let html = "";

    data.forEach(item=>{

        let icon = "📋";

        if(item.type==="ADD"){
            icon="🟢";
        }

        if(item.type==="EDIT"){
            icon="🟡";
        }

        if(item.type==="DELETE"){
            icon="🔴";
        }

        html += `
        <div class="activity-card">

            ${icon}
            ${item.description}

        </div>
        `;
    });

    openModal(
        "📋 Recent Activities",
        html
    );
}
function openReportModal(){

    openModal(
        "📥 Export Reports",

        `
        <button
            class="export-btn"
            onclick="exportAgreements()">

            📄 Export Agreements

        </button>

        <button
            class="export-btn"
            onclick="exportRenewals()">

            🔔 Export Renewals

        </button>

        `
    );

}

function openAgreementDetails(sr_no){

    closeModal();

    window.location.href =
        `agreement_details.html?id=${sr_no}`;
}