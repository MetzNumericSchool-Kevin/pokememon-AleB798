fetch("http://localhost:5500/data/pokemon.json")
  .then(response => response.json()) // Convertit la réponse en JSON
  .then(data => console.log(data)) // Affiche les données récupérées
  .catch(error => console.error("Erreur :", error)); // Capture les erreurs

  