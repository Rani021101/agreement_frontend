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

async function loadAgreement() {

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
     if(response.status === 401){

    localStorage.clear();

    window.location.href =
        "login.html";

    return;
}
    const data =
        await response.json();

    document.getElementById(
        "building_name"
    ).value = data.building_name;

    document.getElementById(
        "token_no"
    ).value = data.token_no;

    document.getElementById(
        "agent_name"
    ).value = data.agent_name;

    document.getElementById(
        "total_pay"
    ).value = data.total_pay;

    document.getElementById(
        "received"
    ).value = data.received;

    document.getElementById(
        "owner_name"
    ).value = data.owner_name;

    document.getElementById(
        "owner_contact"
    ).value = data.owner_contact;

     document.getElementById(
        "tenant_name"
    ).value = data.tenant_name;

    document.getElementById(
        "tenant_no"
    ).value = data.tenant_no;

    document.getElementById(
        "status"
    ).value = data.status;

    document.getElementById(
        "renewal_date"
    ).value = data.renewal_date;

    document.getElementById(
        "remarks"
    ).value = data.remarks;
}

loadAgreement();



document
.getElementById("agreementForm")
.addEventListener(
"submit",
async function(e){

    e.preventDefault();

    const payload = {
        building_name:
            document.getElementById("building_name").value,

        token_no:
            document.getElementById("token_no").value,

        agent_name:
            document.getElementById("agent_name").value,

        total_pay:
            document.getElementById("total_pay").value,

        received:
            document.getElementById("received").value,

        owner_name:
            document.getElementById("owner_name").value,
        
        owner_contact:
            document.getElementById("owner_contact").value,

        tenant_name:
            document.getElementById("tenant_name").value,

        tenant_no:
            document.getElementById("tenant_no").value,

        status:
            document.getElementById("status").value,

        renewal_date:
            document.getElementById("renewal_date").value,

        remarks:
            document.getElementById("remarks").value
    };

    const response =
    await fetch(
        
        `${CONFIG.BASE_URL}/agreements/${id}`,
        {
            method:"PUT",

            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(payload)
        }
    );
    if(response.status === 401){

    localStorage.clear();

    window.location.href =
        "login.html";

    return;
}

    const result =
        await response.json();
        console.log(response.status);
        console.log(result);

    if(response.ok){

        showMessage(
            result.message,
            "success"
        );

        setTimeout(() => {
            window.location.href =
                "agreements.html";
        },1500);
    }
});


function showMessage(message, type){

    const box =
        document.getElementById("messageBox");

    box.innerText = message;

    box.className =
        `message-box ${type} show`;

    setTimeout(() => {
        box.classList.remove("show");
    }, 3000);
}