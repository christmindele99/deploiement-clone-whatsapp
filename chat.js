const connectBtn = document.getElementById("connectBtn");
const btnListUsers = document.getElementById("btnListUsers");
const nameUserXTitle = document.getElementById("nameUserXTitle");
const StatsUserXTitle = document.getElementById("StatsUserXTitle");
const interfaceConversation = document.getElementById("interfaceConversation");
const userDiscussionInterface = document.getElementById("userDiscussionInterface");
const usersList = document.getElementById("usersList");
const avatarUserX = document.getElementById("avatarUserX");
const buttonStatusUserX = document.getElementById("buttonStatusUserX");
let currentUser = null;

connectBtn.addEventListener("click", () => {
    window.location.href = "profil.html";
});


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


async function getUsers() {
    const token = localStorage.getItem("token");
    const response = await fetch(
        "https://kadea-chat-api.onrender.com/users",
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



window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await getCurrentUser();
        currentUser = response.data.user;
        console.log(currentUser);
    } catch(error) {
        console.log(error);
    }
});


async function displayUsers() {
    usersList.innerHTML = "";
    const response = await getUsers();
    const users = response.data.users;
    users.forEach(user => {
        const userClone = userDiscussionInterface.cloneNode(true);
        userClone.classList.remove("hidden");
        const avatar = userClone.querySelector("#avatarUserDiscussion");
        avatar.src = "default-avatar.jpg";
        avatar.alt = user.fullName;
        const name = userClone.querySelector("#nameUserYDiscussion");
        name.textContent = user.fullName;
        usersList.appendChild(userClone);
    });
}


btnListUsers.addEventListener("click", async () => {
    interfaceConversation.classList.add("hidden");
    usersList.classList.remove("hidden");
    try {
        if(!currentUser){
            const response = await getCurrentUser();
            currentUser = response.data.user;
        }
        avatarUserX.src = "default-avatar.jpg";
        avatarUserX.alt = currentUser.fullName;
        nameUserXTitle.textContent = currentUser.fullName;
        buttonStatusUserX.classList.remove("hidden");
        StatsUserXTitle.textContent = "Mon Statut : Actif";
        await displayUsers();
    } catch(error){
        console.log(error);
    }
});