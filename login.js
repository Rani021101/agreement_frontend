document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const empId =
            document.getElementById("emp_id").value;

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");

        try {

            const response = await fetch(
                `${CONFIG.BASE_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        emp_id: empId,
                        password: password
                    })
                }
            );

            const data = await response.json();
            console.log("Response Status:", response.status);
            console.log("Response Data:", data);
            if (response.ok) {

            message.innerHTML =
                "Login Successful";

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "emp_id",
                data.emp_id
            );

            localStorage.setItem(
                "name",
                data.name
            );

            console.log("Redirecting...");

            window.location.href =
                "./dashboard.html";

        } else {

            message.innerHTML =
                data.detail;
        }
        } catch (error) {

            message.innerHTML =
                "Server Error";
        }

    });