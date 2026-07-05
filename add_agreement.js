const token =
    localStorage.getItem("token");

if(!token){
    window.location.href =
        "login.html";
}
document
.getElementById("agreementForm")
.addEventListener(
"submit",
async function(e){

    e.preventDefault();

    const data = {

        emp_id:
            localStorage.getItem("emp_id"),

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

    const response = await fetch(
    `${CONFIG.BASE_URL}/agreements`,
    {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
);
            if (response.status === 401) {

        localStorage.clear();

        window.location.href =
            "login.html";

        return;
    }

    const result = await response.json();
    console.log(result);
    showMessage(
    result.message,
    "success"
);

if (response.ok) {

    showMessage(
        result.message,
        "success"
    );

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1500);

} else {

    showMessage(
        result.detail || "Something went wrong",
        "error"
    );
}
});






function showMessage(message,type){

    const box =
        document.getElementById("messageBox");

    box.innerText = message;

    box.className =
        `message-box ${type} show`;

    setTimeout(() => {
        box.classList.remove("show");
    },3000);
}