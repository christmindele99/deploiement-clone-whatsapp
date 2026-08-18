const user = JSON.parse(localStorage.getItem("currentUser"));
const titre = document.getElementById("BienvenueText");
titre.textContent = `Félicitations ${user.fullName} !`;
