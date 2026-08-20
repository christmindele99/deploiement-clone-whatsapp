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
const mobileNavigation = document.getElementById("mobileNavigation");
let deleteMode = false;
let deleteMessageMode = false;
let selectedMessageIds = new Set();
let currentUser = null;
let selectedUser = null;
let currentConversationId = null;
let selectedMessageForEdit = null;

console.log("buttonDelete :", buttonDelete);
console.log("buttonSuppression :", buttonSuppression)


connectBtn.addEventListener("click", () => {
  window.location.href = "profil.html";
});


btnListUsers.addEventListener("click", () => {
    setActiveNavigation(btnListUsers);
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



window.addEventListener("DOMContentLoaded", async () => {
    
    setActiveNavigation(btnChatConversation);

    try {

        const response = await getCurrentUser();

        currentUser = response.data.user;

        avatarUserX.src = "default-avatar.jpg";

        nameUserXTitle.textContent =
            currentUser.fullName;

        buttonStatusUserX.classList.remove("hidden");

        StatsUserXTitle.textContent =
            "Mon Statut : Actif";

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

        // MODE MODIFICATION
        if (selectedMessageForEdit !== null) {

            console.log(
                "MODIFICATION DU MESSAGE :",
                selectedMessageForEdit
            );

            const response = await fetch(
                `https://kadea-chat-api.onrender.com/messages/${selectedMessageForEdit}`,
                {
                    method: "PATCH",

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

            console.log(
                "RÉPONSE MODIFICATION MESSAGE :",
                data
            );


            // Vérifier si la modification a réussi
            if (data.success) {

                // Vider le champ
                champSaisieMessage.value = "";

                // Quitter le mode modification
                selectedMessageForEdit = null;

                // Recharger les messages
                const messagesResponse =
                    await getMessages(
                        currentConversationId
                    );

                displayMessages(
                    messagesResponse.data.messages
                );
            }

            return;
        }


        // MODE NOUVEAU MESSAGE
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

        console.log(
            "RÉPONSE ENVOI MESSAGE :",
            data
        );


        // Vérifier si l'envoi a réussi
        if (data.success) {

            // Vider le champ
            champSaisieMessage.value = "";

            // Recharger les messages
            const messagesResponse =
                await getMessages(
                    currentConversationId
                );

            displayMessages(
                messagesResponse.data.messages
            );
        }

    } catch (error) {

        console.error(
            "Erreur lors de l'envoi ou de la modification du message :",
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




function getDayLabel(dateString) {

    const messageDate = new Date(dateString);
    const today = new Date();

    // Remettre les heures à zéro
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Différence en jours
    const difference =
        (today - messageDate) / (1000 * 60 * 60 * 24);

    if (difference === 0) {
        return "Aujourd'hui";
    }

    if (difference === 1) {
        return "Hier";
    }

    return messageDate.toLocaleDateString("fr-FR");
}


function displayMessages(messages) {

    console.log("MESSAGES À AFFICHER :", messages);

    messagesContainer.innerHTML = "";

    let previousDay = null;

    messages.forEach(message => {

        const currentDay = getDayLabel(message.createdAt);

        if (currentDay !== previousDay) {

            const dayWrapper = document.createElement("div");

            dayWrapper.className =
                "flex justify-center py-3";

            const dayTitle = document.createElement("p");

            dayTitle.textContent = currentDay;

            dayTitle.className =
                "text-gray-700 text-sm px-2 py-1 bg-gray-300 font-semibold rounded-full";

            dayWrapper.appendChild(dayTitle);

            messagesContainer.appendChild(dayWrapper);

            previousDay = currentDay;
        }

        console.log("MESSAGE :", message);
        console.log("ID DU MESSAGE :", message.id);

        const messageWrapper =
            document.createElement("div");

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className =
            "delete-message-checkbox";

        checkbox.dataset.messageId =
            message.id;

        if (!deleteMessageMode) {
            checkbox.classList.add("hidden");
        }

        if (selectedMessageIds.has(message.id)) {
            checkbox.checked = true;
        }


        checkbox.addEventListener("change", () => {

            if (checkbox.checked) {

                selectedMessageIds.add(message.id);

            } else {

                selectedMessageIds.delete(message.id);

            }

        });


        messageWrapper.appendChild(checkbox);


        const isMyMessage =
            message.senderId === currentUser.id;

        if (isMyMessage) {

            messageWrapper.className =
                "flex self-end max-w-[85%] md:max-w-[60%] min-w-0 gap-2";

        } else {

            messageWrapper.className =
                "flex self-start max-w-[85%] md:max-w-[60%] min-w-0 gap-2";

        }


        // ==============================
        // CONTENEUR DU MESSAGE
        // ==============================

        const messageContent =
            document.createElement("div");

        messageContent.className =
            "flex flex-col gap-1 min-w-0";


        // ==============================
        // TEXTE DU MESSAGE
        // ==============================

        const messageText =
            document.createElement("p");

        messageText.textContent =
            message.content;


        if (isMyMessage) {

            messageText.className =
                "px-3 py-2 bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-br-lg break-words whitespace-normal min-w-0 max-w-full break-all cursor-pointer";

        } else {

            messageText.className =
                "px-3 py-2 bg-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-lg break-words whitespace-normal min-w-0 max-w-full break-all";

        }

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

        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Modifier";

        editButton.type =
            "button";

        editButton.className =
            "hidden text-sm text-blue-500 hover:text-blue-700 self-end";
            if (selectedMessageForEdit === message.id) {
                editButton.classList.remove("hidden");
            }

            editButton.addEventListener("click", () => {
                selectedMessageForEdit = message.id;
                champSaisieMessage.value = message.content;
                champSaisieMessage.focus();
            });

        if (isMyMessage) {

            messageText.addEventListener("click", () => {

                editButton.classList.toggle("hidden");

                if (editButton.classList.contains("hidden")) {

                    selectedMessageForEdit = null;

                } else {

                    selectedMessageForEdit = message.id;

                }

            });

        }

        messageContent.appendChild(messageText);

        messageContent.appendChild(messageTime);

        messageContent.appendChild(editButton);

        messageWrapper.appendChild(messageContent);

        messagesContainer.appendChild(messageWrapper);

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




function getSelectedMessages() {

    const selectedCheckboxes =
        document.querySelectorAll(".delete-message-checkbox:checked");

    const messageIds = [];

    selectedCheckboxes.forEach(checkbox => {

        const messageId =
            checkbox.dataset.messageId;

        if (messageId) {
            messageIds.push(messageId);
        }
    });

    console.log("MESSAGES SÉLECTIONNÉS :", messageIds);

    return messageIds;
}




buttonDeleteMessage.addEventListener(
    "click",
    async () => {
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

        const messageIds =
            getSelectedMessages();

        console.log(
            "IDS DES MESSAGES À SUPPRIMER :",
            messageIds
        );

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

        for (const messageId of messageIds) {

            await deleteMessage(messageId);

        }

        console.log(
            "MESSAGES SUPPRIMÉS"
        );

        deleteMessageMode = false;

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

        // Cacher la liste des conversations
        conversationsPanel.classList.add("hidden");

        // Afficher la boîte de discussion
        interfaceConversation.classList.remove("hidden");

        // Cacher la barre de navigation
        mobileNavigation.classList.add("hidden");

        // Ajouter une étape dans l'historique
        history.pushState(
            { conversation: true },
            "",
            "#conversation"
        );
    }
}




window.addEventListener("popstate", () => {

    // Si on est sur mobile
    if (window.innerWidth < 768) {

        // Afficher la liste des conversations
        showConversationsList();
    }
});



function showConversationsList() {

    // Afficher la navigation
    mobileNavigation.classList.remove("hidden");

    // Afficher la liste des conversations
    conversationsPanel.classList.remove("hidden");

    // Cacher la discussion
    interfaceConversation.classList.add("hidden");
}




function setActiveNavigation(activeButton) {

    // Remettre toutes les icônes en gris
    btnChatConversation.classList.remove("text-blue-500");
    btnChatConversation.classList.add("text-gray-700");

    btnListUsers.classList.remove("text-blue-500");
    btnListUsers.classList.add("text-gray-700");


    // Mettre l'icône sélectionnée en bleu
    activeButton.classList.remove("text-gray-700");
    activeButton.classList.add("text-blue-500");
}




btnChatConversation.addEventListener("click", () => {
    // Si une conversation est ouverte
    if (!interfaceConversation.classList.contains("hidden")) {

        showConversationsList();

    }
});









