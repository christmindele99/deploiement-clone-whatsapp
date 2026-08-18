// ici tu centralises fetch
// // const BASE_URL = "https://kadea-chat-api.onrender.com";
// // const API_KEY = "wksp_xxxxxxx";

// fonction register
// async function registerUser(data) {
//     const response = await fetch(`${BASE_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "x-api-key": API_KEY
//         },
//         body: JSON.stringify(data)
//     });
//     return response.json();
// }

// ici tu connectes validation + API
// async function handleRegister(nom, email, password, confirm) {
//     const result = validateData(nom, email, password, confirm);
//     if (typeof result === "string") {
//         return { error: result };
//     }
//     const apiResponse = await registerUser(result);
//     return apiResponse;
// }

// ici tu touches HTML
// const form = document.getElementById("registerForm");
// form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const nom = document.getElementById("champNom").value;
//     const email = document.getElementById("champEmail").value;
//     const password = document.getElementById("champPassword").value;
//     const confirm = document.getElementById("champConfirmPassword").value;
//     const result = await handleRegister(nom, email, password, confirm);
//     if (result.error) {
//         console.log(result.error);
//     } else {
//         console.log("Compte créé :", result);
//     }
// });

<div id="overlayLoader" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
</div>

// // function authUser(user){
// //     if(typeof user === "string" && /^[a-zA-Z\s]+$/.test(user)){
// //         return user
// //     }else{
// //         return "entrez correctement vos informations"
// //     }
// // }

// function authEmail(email){
//     if(typeof email === "string" && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
//         return email
//     }
//     else{
//         return "Inserer correctement votre adresse gmail"
//     }
// }

// function authPassword(password, confirm){
//     if(typeof password === "string" && /^.+$/.test(password)){
//         if(password.length >= 8){
//             if(password === confirm){
//                 return password
//             }else{
//                 return "Confirmer votre mot de passe"
//             }
//         }else{
//             return "votre mot de passe doit contenir au moins 8 caractères"
//         }
//     }else{
//         return "Entre correctement les informations"
//     }
// }

// function authConnexion(action, ...params){
//     if(action === "authUser"){
//         return authUser(...params)
//     }else if(action === "authEmail"){
//         return authEmail(...params)
//     }else if(action === "authPassword"){
//         return authPassword(...params)
//     }
//     else{
//         return "informations mal saisie"
//     }
// }
// const users = []
// function createUser(nom, email, password, confirm){
//     if(typeof nom === "string" && /^[a-zA-Z\s]+$/.test(nom)){
//         if(typeof email === "string" && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
//             if(typeof password === "string" && /^.+$/.test(password)){
//                 if(password.length >= 8){
//                    if(password === confirm){
//                     users.push({
//                         nom,
//                         email,
//                         password
//                     })
//                    }else{
//                     users.push("Confirmer votre mot de passe")
//                    }
//                 }else{
//                     users.push("Votre mot de passe doit contenir au moins 8 caractères")
//                 }
//             }else{
//                 users.push("Entre correctement votre mot de passe")
//             }
//         }else{
//             users.push("Saisissez correctement votre adresse email")
//         }
//     }else{
//         users.push("Votre nom est mal saisie")
//     }
// }

// createUser("christ mindele", "christmindele99@gmail.com", "00000012", "00000012")
// createUser("Joela mitondo", "joelmitondo56@gmail.com", "1234joelmit", "1234joelmit")
// createUser("Emma ndumba", "jemmanuelmande20@gmail.com", "20202020", "20202020")
// console.log(users)

const fullName = sessionStorage.getItem("fullName");

const titre = document.getElementById("BienvenueText");

titre.textContent = `Félicitations ${fullName} !`;

<p id="messageErreur" class="text-red-500 text-sm text-center"></p>

const message = apiResponse.message;
if (message === "Invalid credentials") {
    errorPasswordConnexion.textContent = "Email ou mot de passe incorrect";
} else {
    errorPasswordConnexion.textContent = message || "Erreur inconnue";
}


eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZGQ3YjcxMC02OWI1LTQ0YzctYTAzZi01YzIxYzQ1YzcwZjciLCJlbWFpbCI6ImZhdmV1cmRpQGdtYWlsLmNvbSIsIndvcmtzcGFjZUtleSI6Indrc3BfYTEwYjgzZTM0MWY1MTYyOTA5NjRhMDhlNjZkYmE1M2QiLCJpYXQiOjE3ODQwNTA0NDUsImV4cCI6MTc4NDY1NTI0NX0.BiflL2gjwfXE92xOPGUO6vAntoLmevs_6v3m42AXcpU
        








