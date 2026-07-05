const token =
    localStorage.getItem("token");

if(!token){
    window.location.href =
        "login.html";
}
async function loadDashboardStats() {

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
    if(response.status === 401){

    localStorage.clear();

    window.location.href =
        "login.html";

    return;
}

    const data =
        await response.json();

    document.getElementById("totalAgreements")
        .innerText = data.total;

    document.getElementById("pendingCount")
        .innerText = data.pending;

    document.getElementById("registeredCount")
        .innerText = data.registered;

    document.getElementById("cancelledCount")
        .innerText = data.cancelled;
    document.getElementById("renewalCount")
        .innerText = data.renewals;
}



async function loadRenewals() {

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
    if(response.status === 401){

    localStorage.clear();

    window.location.href =
        "login.html";

    return;
}

    const data =
        await response.json();

    const container =
        document.getElementById(
            "renewalList"
        );

    container.innerHTML = "";

    if(data.length === 0){

        container.innerHTML =
            "<p>No upcoming renewals</p>";

        return;
    }

    data.forEach(item => {

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

    activities.forEach(item => {

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

        <div class="activity-content">

            <div class="activity-description">
                ${item.description}
            </div>

            <div class="activity-user">
                👤 ${item.name} (${item.emp_id})
            </div>

            <div class="activity-time">
                🕒 ${new Date(item.created_on).toLocaleString()}
            </div>

        </div>

    </div>

</div>
`;
    });
}



window.onload = () => {

    loadDashboardStats();

    loadRenewals();

    loadActivities();
};


function logout() {

    const confirmed =
        confirm(
            "Do you want to logout?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.clear();

    window.location.href =
        "login.html";
}

function openAgreements(status){

    window.location.href =
        `agreements.html?status=${status}`;
}

function openRenewals(){

    window.location.href =
        "agreements.html?status=renewal";
}