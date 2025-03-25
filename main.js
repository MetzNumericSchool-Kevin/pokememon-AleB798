
//création d'une fonction qui prend en paramètre un url et un nb : elle permettra de récupérer les données, de trier aléatoirement les données et de récupérer un nouveau tableau avec x données (ce nombre dépendra du choix de l'utilisateur)
async function getRandomPokemons(url, nbOfITems) {
    try {
        const response = await fetch(url); //on fetch et on attend de récupérer les données
        const data = await response.json(); //quand on a un retour on transforme la réponse en json pour être exploitable

        //utilisation de if dans le cas où l'on ne récupère pas un tableau de données
        if(!Array.isArray(data)) {
            throw new Error("Les données ne sont pas au bon format");
        }

        //on utilise la méthode .sort() pur uun trie aléatoire des données
        const pokemonsAléatoire = data.sort(()=> 0.5 -Math.random());

        //on va retourner x éléments du tableau (pour pouvoir ajuster le nombre de carte par partie)
        
        return pokemonsAléatoire.slice(0,nbOfITems);

    } catch(error) {
        console.error('Problème de récupération des données :',error);
    }
}

//création d'une fonction qui va initaliser le jeu et prendre en compte le choix du nb de carte par l'utilisateur
async function initGame() {
    const url = 'http://127.0.0.1:5500/pokememon-AleB798/data/pokemon.json'; // URL des données des Pokémons
    const nbCartes = parseInt(document.getElementById("selectCartes").value); // Récupère la valeur du select et on parseInt pour avoir un nb entier
    const pokemons = await getRandomPokemons(url, nbCartes); //variable qui stocke nos pokémons

    if(pokemons) {
        //si on récupère des pokemons on crée un nouveau tableau avec des pairs
        const pokemonsList = [...pokemons,...pokemons]
        console.log(pokemonsList)
    }
}

//ajout d'un écouteur d'événement pour prendre compte le choix de l'utilisateur
document.getElementById("selectCartes").addEventListener("change", initGame);

initGame();
