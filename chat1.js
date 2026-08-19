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
const btnListUsers = document.getElementById("btnListUsers")
const buttonDelete = document.getElementById("buttonDelete");
const buttonSuppression = document.getElementById("buttonSuppression");
const deleteWarning = document.getElementById("deleteWarning");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const buttonDeleteMessage = document.getElementById("buttonDeleteMessage");
const conversationsPanel = document.getElementById("conversationsPanel");
const btnChatConversation = document.getElementById("btnChatConversation");
let deleteMode = false;
let deleteMessageMode = false;
let currentUser = null;
let selectedUser = null;
let currentConversationId = null;

console.log("buttonDelete :", buttonDelete);
console.log("buttonSuppression :", buttonSuppression)


connectBtn.addEventListener("click", () => {
  window.location.href = "profil.html";
});


btnListUsers.addEventListener("click", () => {
  window.location.href = "listUsers.html";
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




async function displayConversations() {

    const response = await getConversations();

    const conversations = response.data.conversations;

    console.log("MES CONVERSATIONS :", conversations);

    for (const conversation of conversations) {

        // Récupérer les messages de cette conversation
        const messagesResponse =
            await getMessages(conversation.id);

        const messages =
            messagesResponse.data.messages;

        console.log(
            "Messages de la conversation",
            conversation.id,
            messages
        );


        // Vérifier s'il existe au moins un message
        if (messages.length === 0) {

            console.log(
                "Conversation vide, on ne l'affiche pas :",
                conversation.id
            );

            continue;
        }


        // Trouver l'autre participant
        const otherParticipant =
            conversation.participants.find(
                participant =>
                    participant.userId !== currentUser.id
            );


        if (!otherParticipant) {
            continue;
        }


        const user =
            otherParticipant.user;


        // Créer l'élément dans la liste
        const userClone =
            userDiscussionInterface.cloneNode(true);

        userClone.classList.remove("hidden");
        userClone.dataset.conversationId = conversation.id;


        // Avatar
        const avatar =
            userClone.querySelector(
                "#avatarUserDiscussion"
            );

        avatar.src =
            user.avatarUrl || "default-avatar.jpg";

        avatar.alt =
            user.fullName;


        // Nom
        const name =
            userClone.querySelector(
                "#nameUserYDiscussion"
            );

        name.textContent =
            user.fullName;


        // Dernier message
        const lastMessage =
            messages[messages.length - 1];


        const messageElement =
            userClone.querySelector(
                "#containMessageUser"
            );

        if (messageElement) {

            messageElement.textContent =
                lastMessage.content;
        }


        // Heure du dernier message
        const date =
            new Date(lastMessage.createdAt);


        const timeElement =
            userClone.querySelector(
                "#heureMessageUserDiscussion"
            );


        if (timeElement) {

            timeElement.textContent =
                date.toLocaleTimeString(
                    "fr-FR",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );
        }


        // Clic sur la conversation
        userClone.addEventListener(
            "click",
            async () => {

                if (deleteMode) {
                    return;
                }

                selectedUser = user;

                currentConversationId =
                    conversation.id;

                startMessagesAutoRefresh();

                showConversationOnMobile();


                console.log(
                    "Conversation sélectionnée :",
                    currentConversationId
                );


                // Afficher l'utilisateur
                nameUserDiscussionInterface.textContent =
                    user.fullName;


                avatarUserDiscussionInterface.src =
                    user.avatarUrl ||
                    "default-avatar.jpg";


                avatarUserDiscussionInterface.alt =
                    user.fullName;


                avatarUserDiscussionInterface.classList.remove(
                    "hidden"
                );


                statusUserY.classList.remove(
                    "hidden"
                );


                statusUserDiscussionInterface.textContent =
                    "En ligne";


                // Afficher la conversation
                interfaceConversation.classList.remove(
                    "hidden"
                );


                // Charger les messages
                const messagesResponse =
                    await getMessages(
                        currentConversationId
                    );


                displayMessages(
                    messagesResponse.data.messages
                );
            }
        );


        // Ajouter dans la liste
        usersList.appendChild(userClone);
    }
}




function displayCurrentDay() {
    dayDiscussion.textContent = "Aujourd'hui";
}

window.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await getCurrentUser();

        currentUser = response.data.user;

        avatarUserX.src = "default-avatar.jpg";

        nameUserXTitle.textContent =
            currentUser.fullName;

        buttonStatusUserX.classList.remove("hidden");

        StatsUserXTitle.textContent =
            "Mon Statut : Actif";

        displayCurrentDay();

        //  Charger uniquement les conversations existantes
        await displayConversations();

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



let messagesRefreshInterval = null;

function startMessagesAutoRefresh() {

    // Éviter de créer plusieurs intervalles
    if (messagesRefreshInterval) {
        clearInterval(messagesRefreshInterval);
    }

    messagesRefreshInterval = setInterval(async () => {

        // S'il n'y a aucune conversation ouverte
        if (!currentConversationId) {
            return;
        }

        try {

            const messagesResponse =
                await getMessages(currentConversationId);

            const messages =
                messagesResponse.data.messages;

            displayMessages(messages);

        } catch (error) {

            console.error(
                "Erreur lors de l'actualisation des messages :",
                error
            );
        }

    }, 2000);
}



function displayMessages(messages) {

    console.log("MESSAGES À AFFICHER :", messages);

    messagesContainer.innerHTML = "";

    messages.forEach(message => {

        console.log("MESSAGE :", message);
        console.log("ID DU MESSAGE :", message.id);

        const messageWrapper =
            document.createElement("div");

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className =
            "delete-message-checkbox";

        // Afficher ou cacher selon le mode actuel
        if (!deleteMessageMode) {
            checkbox.classList.add("hidden");
        }

        checkbox.dataset.messageId =
            message.id;

        messageWrapper.appendChild(checkbox);


        // Vérifier si le message appartient à l'utilisateur connecté
        const isMyMessage =
            message.senderId === currentUser.id;


        // Position du message
        if (isMyMessage) {

            messageWrapper.className =
                "flex self-end max-w-[85%] md:max-w-[60%] min-w-0 gap-2";

        } else {

            messageWrapper.className =
                "flex self-start max-w-[85%] md:max-w-[60%] min-w-0 gap-2";

        }


        // Contenu du message
        const messageContent =
            document.createElement("div");

        messageContent.className =
            "flex flex-col gap-1 min-w-0";


        // Texte du message
        const messageText =
            document.createElement("p");

        messageText.textContent =
            message.content;


        if (isMyMessage) {

            messageText.className =
                "px-3 py-2 bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-br-lg break-words whitespace-normal min-w-0 max-w-full break-all";

        } else {

            messageText.className =
                "px-3 py-2 bg-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-lg break-words whitespace-normal min-w-0 max-w-full break-all";

        }


        // Heure
        const messageTime =
            document.createElement("p");

        const date =
            new Date(message.createdAt);


        messageTime.textContent =
            date.toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        messageTime.className =
            "text-xs text-gray-500 self-end";


        // Ajouter texte + heure
        messageContent.appendChild(
            messageText
        );

        messageContent.appendChild(
            messageTime
        );


        // Ajouter contenu au wrapper
        messageWrapper.appendChild(
            messageContent
        );


        // Ajouter le message à l'interface
        messagesContainer.appendChild(
            messageWrapper
        );

    });
}


buttonEnvoyerMessage.addEventListener("click", sendMessage);




function toggleDeleteMode() {

    deleteMode = !deleteMode;

    const checkboxes =
        document.querySelectorAll(".delete-checkbox");

    checkboxes.forEach(checkbox => {

        if (deleteMode) {

            checkbox.classList.remove("hidden");

        } else {

            checkbox.classList.add("hidden");

            checkbox.checked = false;
        }
    });


    if (deleteMode) {

        buttonSuppression.classList.remove("hidden");

    } else {

        buttonSuppression.classList.add("hidden");
    }
}




buttonDelete.addEventListener(
    "click",
    toggleDeleteMode
);




function getSelectedConversations() {

    const selectedCheckboxes =
        document.querySelectorAll(".delete-checkbox:checked");

    const conversationIds = [];

    selectedCheckboxes.forEach(checkbox => {

        const userElement = checkbox.closest(".userMessage");

        if (userElement) {

            const conversationId =
                userElement.dataset.conversationId;

            conversationIds.push(conversationId);
        }
    });

    console.log(
        "CONVERSATIONS SÉLECTIONNÉES :",
        conversationIds
    );

    return conversationIds;
}


async function deleteConversation(conversationId) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `https://kadea-chat-api.onrender.com/conversations/${conversationId}`,
        {
            method: "DELETE",

            headers: {
                "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    console.log(
        "RÉPONSE SUPPRESSION :",
        data
    );

    return data;
}






confirmDelete.addEventListener("click", async () => {

    const conversationIds = getSelectedConversations();

    if (conversationIds.length === 0) {
        console.log("Aucune conversation sélectionnée.");
        return;
    }

    try {

        // 1. Supprimer les conversations de l'API
        for (const conversationId of conversationIds) {

            await deleteConversation(conversationId);
        }

        console.log("Conversations supprimées avec succès");


        // 2. Supprimer les discussions de l'interface
        const selectedCheckboxes =
            document.querySelectorAll(".delete-checkbox:checked");

        selectedCheckboxes.forEach(checkbox => {

            const userElement =
                checkbox.closest(".userMessage");

            if (userElement) {
                userElement.remove();
            }
        });


        // 3. Désactiver le mode suppression
        deleteMode = false;


        // 4. Réinitialiser TOUS les checkboxes
        const checkboxes =
            document.querySelectorAll(".delete-checkbox");

        checkboxes.forEach(checkbox => {

            checkbox.checked = false;
            checkbox.classList.add("hidden");

        });


        // 5. Cacher le bouton "Supprimer"
        buttonSuppression.classList.add("hidden");


        // 6. Fermer la fenêtre de confirmation
        deleteWarning.classList.add("hidden");


        console.log("Interface revenue à son état initial");


    } catch (error) {

        console.error(
            "Erreur lors de la suppression :",
            error
        );
    }
});





cancelDelete.addEventListener("click", () => {

    // Fermer la fenêtre de confirmation
    deleteWarning.classList.add("hidden");

    // Quitter le mode suppression
    deleteMode = false;

    // Réinitialiser les checkboxes
    const checkboxes =
        document.querySelectorAll(".delete-checkbox");

    checkboxes.forEach(checkbox => {

        checkbox.checked = false;
        checkbox.classList.add("hidden");

    });

    // Cacher le bouton "Supprimer"
    buttonSuppression.classList.add("hidden");

    console.log("Suppression annulée");
});





buttonSuppression.addEventListener("click", () => {

    console.log("BOUTON SUPPRESSION CLIQUÉ");

    const conversationIds = getSelectedConversations();

    console.log("IDS :", conversationIds);

    if (conversationIds.length === 0) {
        console.log("AUCUNE CONVERSATION SÉLECTIONNÉE");
        return;
    }

    console.log("OUVERTURE DE LA CONFIRMATION");

    deleteWarning.classList.remove("hidden");
});




async function deleteMessage(messageId) {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `https://kadea-chat-api.onrender.com/messages/${messageId}`,
            {
                method: "DELETE",

                headers: {
                    "x-api-key": "wksp_a10b83e341f516290964a08e66dba53d",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log("RÉPONSE SUPPRESSION MESSAGE :", data);

        return data;

    } catch (error) {

        console.error(
            "ERREUR SUPPRESSION MESSAGE :",
            error
        );
    }
}


buttonDeleteMessage.addEventListener(
    "click",
    async () => {

        // =====================================
        // PREMIER CLIC : ACTIVER LE MODE
        // =====================================

        if (!deleteMessageMode) {

            deleteMessageMode = true;

            const checkboxes =
                document.querySelectorAll(
                    ".delete-message-checkbox"
                );

            checkboxes.forEach(checkbox => {

                checkbox.classList.remove("hidden");

            });

            console.log(
                "MODE SUPPRESSION ACTIVÉ"
            );

            return;
        }


        // =====================================
        // DEUXIÈME CLIC : RÉCUPÉRER LES MESSAGES
        // =====================================

        const messageIds =
            getSelectedMessages();

        console.log(
            "IDS DES MESSAGES À SUPPRIMER :",
            messageIds
        );


        // =====================================
        // AUCUN MESSAGE SÉLECTIONNÉ
        // → SIMPLEMENT QUITTER LE MODE
        // =====================================

        if (messageIds.length === 0) {

            deleteMessageMode = false;

            const checkboxes =
                document.querySelectorAll(
                    ".delete-message-checkbox"
                );

            checkboxes.forEach(checkbox => {

                checkbox.checked = false;

                checkbox.classList.add("hidden");

            });

            console.log(
                "MODE SUPPRESSION DÉSACTIVÉ"
            );

            return;
        }


        // =====================================
        // DES MESSAGES SONT SÉLECTIONNÉS
        // → SUPPRIMER
        // =====================================

        for (const messageId of messageIds) {

            await deleteMessage(messageId);

        }

        console.log(
            "MESSAGES SUPPRIMÉS"
        );


        // =====================================
        // QUITTER LE MODE SUPPRESSION
        // =====================================

        deleteMessageMode = false;


        // =====================================
        // RECHARGER LES MESSAGES
        // =====================================

        const messagesResponse =
            await getMessages(
                currentConversationId
            );

        displayMessages(
            messagesResponse.data.messages
        );

    }
);


function showConversationOnMobile() {

    if (window.innerWidth < 768) {

        conversationsPanel.classList.add("hidden");

        interfaceConversation.classList.remove("hidden");
    }
}




function showConversationsList() {

    // Afficher la liste des conversations
    conversationsPanel.classList.remove("hidden");

    // Cacher l'interface de discussion
    interfaceConversation.classList.add("hidden");
}

btnChatConversation.addEventListener("click", () => {

    // Si une conversation est ouverte
    if (!interfaceConversation.classList.contains("hidden")) {

        showConversationsList();

    }
});





function startMessagesAutoRefresh() {

    if (messagesRefreshInterval) {
        clearInterval(messagesRefreshInterval);
    }

    messagesRefreshInterval = setInterval(async () => {

        if (!currentConversationId) {
            return;
        }

        try {

            const messagesResponse =
                await getMessages(currentConversationId);

            const messages =
                messagesResponse.data.messages;

            displayMessages(messages);

        } catch (error) {

            console.error(
                "Erreur lors de l'actualisation des messages :",
                error
            );
        }

    }, 2000);
}



