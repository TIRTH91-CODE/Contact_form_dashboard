const form = document.getElementById("contactForm");

form.addEventListener("submit", async function(event){

    event.preventDefault();

    const data = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        message: document.getElementById("message").value

    };

    const response = await fetch("/submit", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    });

    const result = await response.text();

    alert(result);

});
