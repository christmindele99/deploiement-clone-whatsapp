const iconButtonChat = document.getElementById("iconButtonChat");
const pageLoader = document.getElementById("pageLoader");
const buttonChat = document.getElementById("buttonChat");
const profilUser = document.getElementById("profilUser");
const nameUserTitle = document.getElementById("nameUserTitle");
const emailUserTitle = document.getElementById("emailUserTitle");
const yearMember = document.getElementById("yearMember");
const nameUser = document.getElementById("nameUser");
const numberUser = document.getElementById("numberUser");
const languageUser = document.getElementById("languageUser");
const statutUser = document.getElementById("statutUser");
const passwordModal = document.getElementById("passwordModal");
const cancelPasswordButton = document.getElementById("cancelPasswordButton");
const savePasswordButton = document.getElementById("savePasswordButton");
const oldPasswordInput = document.getElementById("oldPasswordInput");
const newPasswordInput = document.getElementById("newPasswordInput");
const errorPasswordUpdate = document.getElementById("erroPasswordUpdate");
const editProfileButton = document.getElementById("editProfilButton");
const editPasswordButton = document.getElementById("editPasswordButton");
const logoutButton = document.getElementById("logoutButton");
const logoutModal = document.getElementById("logoutModal");
const confirmLogoutButton = document.getElementById("confirmLogoutButton");
const cancelLogoutButton = document.getElementById("cancelLogoutButton");
const nameUserInput = document.getElementById("nameUserInput");
const numberUserInput = document.getElementById("numberUserInput");
const languageUserInput = document.getElementById("languageUserInput");
const btnListUsers = document.getElementById("btnListUsers");
let isEditing = false;
let currentUser = null;
let isUpdatingPassword = false;




btnListUsers.addEventListener("click", () => {
    window.location.href = "listUsers.html";
})

iconButtonChat.addEventListener("click", () => {
    window.location.href = "chat.html";
})

async function getCurrentUser() {
    const token = localStorage.getItem("token");
    const response = await fetch(
        "https://kadea-chat-api.onrender.com/auth/me",
        {
            method: "GET",
            headers: {
                "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                "Authorization": `Bearer ${token}`
            }
        }
    );
    return await response.json();
}


function showLoader() {
    pageLoader.classList.remove("hidden");
}

function hideLoader() {
    pageLoader.classList.add("hidden");
}

editPasswordButton.addEventListener("click", () => {
    passwordModal.classList.remove("hidden");
});

cancelPasswordButton.addEventListener("click", () => {
    passwordModal.classList.add("hidden");
    newPasswordInput.value = "";
});


editProfileButton.addEventListener("click", async () => {

    if (!isEditing) {

        nameUserInput.value = nameUser.textContent;
        numberUserInput.value = numberUser.textContent;
        languageUserInput.value = languageUser.textContent;

        nameUser.classList.add("hidden");
        numberUser.classList.add("hidden");
        languageUser.classList.add("hidden");

        nameUserInput.classList.remove("hidden");
        numberUserInput.classList.remove("hidden");
        languageUserInput.classList.remove("hidden");

        nameUserInput.readOnly = false;
        numberUserInput.readOnly = false;
        languageUserInput.readOnly = false;

        editProfileButton.textContent = "Enregistrer les modifications";

        isEditing = true;

    } else {

        editProfileButton.textContent = "Enregistrement...";
        editProfileButton.disabled = true;

        await saveProfile();

        nameUser.textContent = currentUser.fullName;
        nameUserTitle.textContent = currentUser.fullName;
        numberUser.textContent = currentUser.bio || "Non renseigné";
        languageUser.textContent = "Français (FR)";

        nameUser.classList.remove("hidden");
        numberUser.classList.remove("hidden");
        languageUser.classList.remove("hidden");

        nameUserInput.classList.add("hidden");
        numberUserInput.classList.add("hidden");
        languageUserInput.classList.add("hidden");

        editProfileButton.textContent = "Modifier profil";
        editProfileButton.disabled = false;

        isEditing = false;
    }

});


window.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    try {
        const token = localStorage.getItem("token");
        console.log(token)
        const response = await fetch(
            "https://kadea-chat-api.onrender.com/auth/me",
            {
                method: "GET",
                headers: {
                    "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        const profileResponse = await response.json();
        console.log("Réponse de /auth/me :", profileResponse);
        console.log(profileResponse)
        currentUser = profileResponse.data.user;
        console.log("ID :", currentUser.id);
        console.log("Nom :", currentUser.fullName);
        console.log("Email :", currentUser.email);
        profilUser.src = currentUser.avatarUrl || "default-avatar.jpg";
        nameUserTitle.textContent = currentUser.fullName;
        emailUserTitle.textContent = currentUser.email;
        const dateCreation = new Date(currentUser.createdAt);
        yearMember.textContent = dateCreation.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric"
        });
        nameUser.textContent = currentUser.fullName;
        // Le téléphone est stocké dans bio
        numberUser.textContent = currentUser.bio || "Non renseigné";
        languageUser.textContent = "Français (FR)";
        if (currentUser.status === "Disponible") {
            statutUser.classList.remove("hidden");
        } else {
            statutUser.classList.add("hidden");
        }
    } catch(error) {
        console.log("Erreur chargement profil :", error);
    } finally {
        hideLoader();
    }
});


async function saveProfile() {
    const userX = {
        fullName: nameUserInput.value,
        bio: numberUserInput.value
    };
    console.log(userX);
    showLoader();
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            "https://kadea-chat-api.onrender.com/users/me",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(userX)
            }
        );
        const result = await response.json();
        console.log("Réponse API :", result);
        const updatedUser = await getCurrentUser();
        currentUser = updatedUser.data.user;
        return updatedUser;
    } catch(error) {
        console.log("Erreur sauvegarde :", error);
    } finally {
        hideLoader();
    }
}


savePasswordButton.addEventListener("click", async () => {
    errorPasswordUpdate.textContent = "";
    if (
        oldPasswordInput.value.trim() === "" ||
        newPasswordInput.value.trim() === ""
    ) {
        errorPasswordUpdate.textContent =
            "Veuillez remplir tous les champs.";
        return;
    }
    // Changement du bouton pendant l'envoi
    savePasswordButton.textContent = "Enregistrement...";
    savePasswordButton.disabled = true;
    savePasswordButton.classList.add("opacity-50", "cursor-not-allowed");
    const passwordData = {
        oldPassword: oldPasswordInput.value,
        newPassword: newPasswordInput.value
    };
    try {
        const response = await updatePassword(passwordData);
        console.log(passwordData);
        console.log(response)
        if (response.success) {
            console.log("Mot de passe modifié avec succès");
            passwordModal.classList.add("hidden");
            oldPasswordInput.value = "";
            newPasswordInput.value = "";
        } else {
            errorPasswordUpdate.textContent =
                "Ancien mot de passe incorrect.";
        }
    } catch (error) {
        console.log("Erreur :", error);
        errorPasswordUpdate.textContent =
            "Une erreur est survenue.";
    } finally {
        // Retour du bouton à son état normal
        savePasswordButton.textContent = "Enregistrer";
        savePasswordButton.disabled = false;
        savePasswordButton.classList.remove(
            "opacity-50",
            "cursor-not-allowed"
        );
    }
});


async function updatePassword(data) {
    const token = localStorage.getItem("token");
    console.log("Token envoyé :", token);
    const response = await fetch(
        "https://kadea-chat-api.onrender.com/auth/change-password",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    console.log("Status :", response.status);
    console.log("Réponse :", result);
    if (result.errors) {
        result.errors.forEach(error => {
            console.log(error);
        });
    }
    return result;
}

iconButtonChat.addEventListener("click", () => {
  window.location.href = "chat.html";
});

logoutButton.addEventListener("click", () => {
    logoutModal.classList.remove("hidden");
});

cancelLogoutButton.addEventListener("click", () => {
    logoutModal.classList.add("hidden");
});

confirmLogoutButton.addEventListener("click", () => {
    // Suppression des informations de connexion
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    // Redirection vers login
    window.location.href = "login.html";
});

