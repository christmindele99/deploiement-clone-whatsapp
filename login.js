const connexionUser = document.getElementById("connexionUser");

const champEmailConnexion = document.getElementById("champEmailConnexion");
const champPasswordConnexion = document.getElementById("PasswordConnexion");

const errorEmailConnexion = document.getElementById("errorEmailConnexion");
const errorPasswordConnexion = document.getElementById("errorPasswordConnexion");
const loader = document.getElementById("overlayLoader");

function validateLogin(email, password){
    if (email.trim() === "") {
        return {
            field: "email",
            message: "Renseignez votre adresse email"
        };
    }
    if (password.trim() === "") {
        return {
            field: "password",
            message: "Renseignez votre mot de passe"
        };
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        return {
            field: "email",
            message: "Saisissez correctement votre adresse email"
        };
    }
    if (password.length < 8) {
        return {
            field: "password",
            message: "Votre mot de passe doit contenir au moins 8 caractères"
        };
    }
    return {
        email,
        password
    };
}

async function loginUser(user) {
    const response = await fetch("https://kadea-chat-api.onrender.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d"
        },
        body: JSON.stringify({
            email: user.email,
            password: user.password
        })
    });
    return response.json();
}

async function handleLogin(email, password) {
    const result = validateLogin(email, password);
    if (result.message) {
        errorEmailConnexion.textContent = "";
        errorPasswordConnexion.textContent = "";
        if (result.field === "email") {
            errorEmailConnexion.textContent = result.message;
        }
        if (result.field === "password") {
            errorPasswordConnexion.textContent = result.message;
        }
        return;
    }
    errorEmailConnexion.textContent = "";
    errorPasswordConnexion.textContent = "";
    showLoader();
    try {
        const apiResponse = await loginUser(result);
        console.log(apiResponse);
        if (!apiResponse.success) {
            errorPasswordConnexion.textContent =
            "Email ou mot de passe incorrect";
            return;
            }
        if (apiResponse.success) {
        // Enregistrer le token
            localStorage.setItem("token", apiResponse.data.token);
            console.log("Token sauvegardé :", localStorage.getItem("token"));
            // Récupérer les vraies informations du compte connecté
            const profileResponse = await fetch(
            "https://kadea-chat-api.onrender.com/auth/me",
            {
                method: "GET",
                headers: {
                    "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                    "Authorization": `Bearer ${apiResponse.data.token}`
                }
            }
            );
            const profile = await profileResponse.json();
            localStorage.setItem(
                "currentUser",
                JSON.stringify(profile.data.user)
            );
            window.location.href = "chat.html";
            } else {
            errorPasswordConnexion.textContent =
                apiResponse.message || "Email ou mot de passe incorrect";
            }
            return apiResponse;
    } catch (error) {
        console.log("Erreur réseau :", error);
        return {
            error: "Erreur serveur"
        };
    } finally {
        hideLoader();
    }
}

function showLoader(){
    loader.classList.remove("hidden")
}

function hideLoader(){
    loader.classList.add("hidden")
}

connexionUser.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = champEmailConnexion.value;
    const password = champPasswordConnexion.value;
    await handleLogin(email, password);
});

