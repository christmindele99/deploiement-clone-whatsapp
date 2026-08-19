const connectBtn = document.getElementById("connectBtn");
const nameUserXTitle = document.getElementById("nameUserXTitle");
const StatsUserXTitle = document.getElementById("StatsUserXTitle");
const buttonSearchDiscussion = document.getElementById("buttonSearchDiscussion");
const userDiscussionInterface = document.getElementById("userDiscussionInterface");
const avatarUserDiscussion = document.getElementById("avatarUserDiscussion");
const nameUserYDiscussion = document.getElementById("nameUserYDiscussion");
const heureMessageUserDiscussion = document.getElementById("heureMessageUserDiscussion");
const containMessageUser = document.getElementById("containMessageUser");
const numberMessageUserDiscussion = document.getElementById("numberMessageUserDiscussion");
const usersList = document.getElementById("usersList");
const avatarUserDiscussionInterface = document.getElementById("avatarUserDiscussionInterface");
const nameUserDiscussionInterface = document.getElementById("nameUserDiscussionInterface");
const statusUserDiscussionInterface = document.getElementById("statusUserDiscussionInterface");
const dayDiscussion = document.getElementById("dayDiscussion");
const messageUserYdiscussion = document.getElementById("messageUserYdiscussion");
const heureYMessageDIscussion = document.getElementById("heureYMessageDIscussion");
const champSaisieMessage = document.getElementById("champSaisieMessage");
const buttonEnvoyerMessage = document.getElementById("buttonEnvoyerMessage");
const statusUserY = document.getElementById("statusUserY");
const colorGreenStatus = document.getElementById("colorGreenStatus");
const buttonStatusUserX = document.getElementById("buttonStatusUserX");
const avatarUserX = document.getElementById("avatarUserX");
const interfaceConversation = document.getElementById("interfaceConversation");
const messagesContainer = document.getElementById("messagesContainer");
let currentUser = null;
let selectedUser = null;
let currentConversationId = null;
const btnListUsers = document.getElementById("btnListUsers")
const btnChatConversation = document.getElementById("btnChatConversation")
const usersInterface = document.getElementById("usersInterface");
let isConversationOpen = false;
let allUsers = [];



connectBtn.addEventListener("click", () => {
  window.location.href = "profil.html";
});


btnChatConversation.addEventListener("click", () => {
  window.location.href = "chat.html";
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



async function getConversations() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "https://kadea-chat-api.onrender.com/conversations",
        {
            method: "GET",
            headers: {
                "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    console.log("DONNÉES DES CONVERSATIONS :", data);

    return data;
}




function displayCurrentDay() {
    dayDiscussion.textContent = "Aujourd'hui";
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await getCurrentUser();
        currentUser = response.data.user;
        console.log(currentUser);
    } catch (error) {
        console.log(error);
    }
});



async function displayUsers() {

    const response = await getUsers();

    allUsers = response.data.users;

    renderUsers(allUsers);
}

buttonSearchDiscussion.addEventListener(
    "input",
    () => {

        const search =
            buttonSearchDiscussion.value
                .trim()
                .toLowerCase();


        const filteredUsers =
            allUsers.filter(user =>
                user.fullName
                    .toLowerCase()
                    .includes(search)
            );


        renderUsers(filteredUsers);
    }
);




function showUserList() {
    usersInterface.classList.remove("hidden");
    interfaceConversation.classList.add("hidden");
}


function showUserDiscussion() {

    // Cacher toute l'interface des utilisateurs
    usersInterface.classList.add("hidden");

    // Afficher l'interface de discussion
    interfaceConversation.classList.remove("hidden");
}





function renderUsers(users) {

    // Vider la liste actuelle
    usersList.innerHTML = "";

    users.forEach(user => {

        const userClone =
            userDiscussionInterface.cloneNode(true);

        userClone.classList.remove("hidden");


        // Avatar
        const avatar =
            userClone.querySelector("#avatarUserDiscussion");

        avatar.src = "default-avatar.jpg";
        avatar.alt = user.fullName;


        // Nom
        const name =
            userClone.querySelector("#nameUserYDiscussion");

        name.textContent = user.fullName;


        // Quand on clique sur l'utilisateur
        userClone.addEventListener("click", async () => {

        isConversationOpen = true;

        updateInterface();

        selectedUser = user;

    console.log(
        "Utilisateur sélectionné :",
        selectedUser
    );


    // Afficher l'utilisateur dans l'en-tête
    nameUserDiscussionInterface.textContent =
        user.fullName;

    statusUserY.classList.remove("hidden");

    avatarUserDiscussionInterface.classList.remove(
        "hidden"
    );

    statusUserDiscussionInterface.textContent =
        "En ligne";

    avatarUserDiscussionInterface.src =
        "default-avatar.jpg";

    avatarUserDiscussionInterface.alt =
        user.fullName;


    try {

        currentConversationId =
            await getOrCreateConversation(user);

        console.log(
            "Conversation actuelle :",
            currentConversationId
        );


        const messagesResponse =
            await getMessages(
                currentConversationId
            );


        displayMessages(
            messagesResponse.data.messages
        );


    } catch (error) {

        console.error(
            "Erreur conversation :",
            error
        );
    }
        });


        usersList.appendChild(userClone);
    });
}



window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await getCurrentUser();
        const currentUser = response.data.user;
        avatarUserX.src = "default-avatar.jpg";
        nameUserXTitle.textContent = currentUser.fullName;
        buttonStatusUserX.classList.remove("hidden");
        StatsUserXTitle.textContent = "Mon Statut : Actif";
        displayCurrentDay();
        await displayUsers();
    } catch(error) {
        console.log(error);
    }
});



async function createConversation(user) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "https://kadea-chat-api.onrender.com/conversations",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                type: "private",
                name: "Discussion",
                participantIds: [
                    currentUser.id,
                    user.id
                ]
            })
        }
    );

    return await response.json();
}


async function getOrCreateConversation(user) {

    const response = await getConversations();

    const conversations = response.data.conversations;

    console.log("LISTE DES CONVERSATIONS :", conversations);

    conversations.forEach(conversation => {
        console.log("ID conversation :", conversation.id);
        console.log("Participants :", conversation.participants);
    });

    const conversation = conversations.find(conversation => {

    return conversation.participants.some(
        participant => participant.userId === user.id
    );

    });

    if (conversation) {

        console.log("CONVERSATION TROUVÉE :", conversation);

        return conversation.id;
    }

    const newConversation = await createConversation(user);

    console.log("NOUVELLE CONVERSATION :", newConversation);

    return newConversation.data.conversation.id;
}




async function sendMessage() {

    const message = champSaisieMessage.value.trim();

    // Vérifier si le champ est vide
    if (!message) {
        return;
    }

    // Vérifier si une conversation est sélectionnée
    if (!currentConversationId) {
        console.log("Aucune conversation sélectionnée");
        return;
    }

    try {

        const token = localStorage.getItem("token");

        // ENVOYER LE MESSAGE À L'API
        const response = await fetch(
            `https://kadea-chat-api.onrender.com/conversations/${currentConversationId}/messages`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    content: message
                })
            }
        );

        const data = await response.json();

        console.log("RÉPONSE ENVOI MESSAGE :", data);


        // Vérifier si l'envoi a réussi
        if (data.success) {

            // Vider le champ
            champSaisieMessage.value = "";

            // Recharger les messages de la conversation
            const messagesResponse =
                await getMessages(currentConversationId);

            displayMessages(
                messagesResponse.data.messages
            );
        }

    } catch (error) {

        console.error(
            "Erreur lors de l'envoi du message :",
            error
        );
    }
}





async function getMessages(conversationId) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://kadea-chat-api.onrender.com/conversations/${conversationId}/messages`,
        {
            method: "GET",
            headers: {
                "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    console.log("MESSAGES DE LA CONVERSATION :", data);

    return data;
}


function displayMessages(messages) {

    console.log("MESSAGES À AFFICHER :", messages);

    // Vider l'affichage précédent
    messagesContainer.innerHTML = "";

    messages.forEach(message => {

        // Conteneur du message
        const messageWrapper = document.createElement("div");

        // Vérifier si le message vient de l'utilisateur connecté
        const isMyMessage =
            message.senderId === currentUser.id;


        if (isMyMessage) {

            // MESSAGE ENVOYÉ
            messageWrapper.className =
                "flex self-start";

        } else {

            // MESSAGE REÇU
            messageWrapper.className =
                "flex self-end";
        }


        const messageContent =
            document.createElement("div");

        messageContent.className =
            "flex flex-col gap-1";


        // Le texte du message
        const messageText =
            document.createElement("p");

        messageText.textContent =
            message.content;


        if (isMyMessage) {

            messageText.className =
                "px-3 py-2 bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-br-lg";

        } else {

            messageText.className =
                "px-3 py-2 bg-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-lg";
        }


        // L'heure
        const messageTime =
            document.createElement("p");

        const date =
            new Date(message.createdAt);

        messageTime.textContent =
            date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit"
            });

        messageTime.className =
            "text-xs text-gray-500 self-end";


        // Construire le message
        messageContent.appendChild(messageText);

        messageContent.appendChild(messageTime);

        messageWrapper.appendChild(messageContent);

        messagesContainer.appendChild(messageWrapper);
    });
}




function updateInterface() {

    if (isConversationOpen === true) {

        usersInterface.classList.add("hidden");
        interfaceConversation.classList.remove("hidden");

    } else {

        usersInterface.classList.remove("hidden");
        interfaceConversation.classList.add("hidden");

    }
}




buttonEnvoyerMessage.addEventListener("click", sendMessage);


btnListUsers.addEventListener("click", () => {

    isConversationOpen = false;

    updateInterface();

});