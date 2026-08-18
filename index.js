const form = document.getElementById("registerForm");
const nomInput = document.getElementById("champNom");
const emailInput = document.getElementById("champEmail");
const passwordInput = document.getElementById("champPassword");
const confirmInput = document.getElementById("champConfirmPassword");
const messageErreur = document.getElementById("messageErreur");
const loader = document.getElementById("overlayLoader");
const errorNom = document.getElementById("errorNom");
const errorEmail = document.getElementById("errorEmail");
const errorPassword = document.getElementById("errorPassword");
const errorConfirmPassword = document.getElementById("errorConfirmPassword");



form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = nomInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const response = await handleRegister(nom, email, password, confirm);
});

async function handleRegister(nom, email, password, confirm) {
    const result = validateData(nom, email, password, confirm);
    if (result.message) {
         if (result.field === "nom") {
            errorNom.textContent = result.message;
        }
        if (result.field === "email") {
            errorEmail.textContent = result.message;
        }
        if (result.field === "password") {
            errorPassword.textContent = result.message;
        }
        if (result.field === "confirmPassword") {
            errorConfirmPassword.textContent = result.message;
        }
        return;
    }
    errorNom.textContent = "";
    errorEmail.textContent = "";
    errorPassword.textContent = "";
    errorConfirmPassword.textContent = "";
    showLoader()
    try {
        const apiResponse = await registerUser(result);
        if (apiResponse?.success) {
            console.log(apiResponse)
            const users = JSON.parse(localStorage.getItem("users")) || [];
            users.push(result);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(result));
            window.location.href = "create.html";
        } else {
            console.log("Erreur :", apiResponse?.message || "Erreur inconnue");
        }
        return apiResponse;
    } catch (error) {
        console.log("Erreur réseau :", error);
        return { error: "Erreur serveur" };
    }
    finally{
        hideLoader()
    }
}

function validateData(nom, email, password, confirm){
    if(nom.trim() === ""){
        return {
            field: "nom",
            message: "Renseignez votre nom"
        }
    }
    if(!/^[a-zA-Z\s]+$/.test(nom)){
        return {
            field: "nom",
            message: "Votre nom n'est pas valide"
        }
    }
    if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
        return {
            field: "email",
            message: "Saisissez correctement votre adresse email"
        }
    }
    if(password.length < 8){
        return {
            field: "password",
            message: "Votre mot de passe doit contenir au moins 8 caractères"
        }
    }
    if(password !== confirm){
        return {
            field: "confirmPassword",
            message: "Les mot de passe ne correspondent pas"
        }
    }
    return {
        fullName :nom,
        email,
        password,
        language: "Français (FR)",
        avatar: "avatar.png",
        status: "Disponible",
        number : "+243 XXX XXX XXX",
        createdAt: new Date().toISOString()
    }
}

async function registerUser(data) {
    const response = await fetch("https://kadea-chat-api.onrender.com/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

function showLoader(){
    loader.classList.remove("hidden")
}

function hideLoader(){
    loader.classList.add("hidden")
}






