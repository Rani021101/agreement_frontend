function goToRenewals() {

    window.location.href =
        "dashboard.html#renewalSection";
}

function logout() {

    const confirmed =
        confirm("Do you want to logout?");

    if(!confirmed){
        return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("emp_id");
    localStorage.removeItem("name");

    window.location.href =
        "login.html";
}