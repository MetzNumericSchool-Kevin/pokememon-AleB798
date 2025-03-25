
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
        const pokemonsAléatoire = data.sort(()=> 0.5 - Math.random());

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
        // console.log(pokemonsSelection)
        createGameGrid(pokemons)
    }
}

//ajout d'un écouteur d'événement pour prendre compte le choix de l'utilisateur
document.getElementById("selectCartes").addEventListener("change", initGame);

//déclaration des variables pour la logique du jeu
const defaultImage = "./assets/bush.webp"; // Image par défaut (buisson)
const pokeballImage = "./assets/pokeball.png"; //image si checkCards
let firstCard = null; //null car en attente de valeur
let secondCard = null;
let lockBoard = false; //empêche de cliquer pendant la vérification
const capturedPokemonBox = document.querySelector('.liste_pokemons_captures');
let capturedPokemons = []
const replayBtn = document.querySelector('#rejouer')

//fonction qui nous permettra de créer dynamiquement les cartes (par pairs et mélangées)
function createGameGrid(pokemons) {

    //créer les pairs et les mélanger
    const pokemonsPairs = [...pokemons,...pokemons];
    pokemonsPairs.sort(()=> 0.5 - Math.random());
    //console.log(pokemonsPairs)

    //récupération du conteneur de la grille de jeu qui contiendra nos cartes
    const gameGrid = document.querySelector('#grille_de_jeu');
    // Réinitialisation de la grille (pour éviter lor de la sélection du nb de carte l'ajout à la suite)
    gameGrid.innerHTML = ""; 

    //création dynamique des cartes
    pokemonsPairs.forEach(pokemon=> {

        //création des éléments des cartes
        let card = document.createElement("div")
        card.classList.add("col", "box")

        let image = document.createElement("img");
        image.classList.add("bush");
        image.setAttribute("src", defaultImage);
        image.setAttribute("alt", pokemon.name);
        //on crée un attribut data-url pour garder l'url du pokemon
        image.setAttribute("data-url", pokemon.sprite);

        //on rattache les éléments aux parents
        card.appendChild(image)
        gameGrid.appendChild(card)

        //ajout d"un écouteur d'événement sur chaque carte
        card.addEventListener("click", flippedCard);
    })
}

//création de la fonction qui va retourner la carte pour afficher le pokémon caché (cette fonction prend en argument l'event)
function flippedCard(event) {
    if (lockBoard) return;

    //on récupère la cible du click
    const target = event.target;

    //vérifie si la carte est déjà retournée pour empêcher de prendre en compte deux fois la même carte
    if (target === firstCard) return;

    //change l'image pour afficher le Pokémon
    target.src = target.getAttribute("data-url");

    //avec une condition on indique que si la valeur de firstCard est toujours null alors = target sinon cela veut dire que l'on a déjà attribué une valeur à FirstCard et donc c'est secondCard = target
    if (firstCard === null) {
        //première carte retournée = cible
        firstCard = target;
    } else {
        //deuxième carte retournée = cible
        secondCard = target;
        lockBoard = true; // Empêche de cliquer sur d'autres cartes

        //vérifie si les cartes correspondent
        checkCards();
    }
}

//création de la fonction qui va vérifier si les cartes correspondent
function checkCards() {
    if (firstCard.getAttribute("data-url") === secondCard.getAttribute("data-url")) {
        setTimeout(() => {
            //quand identique on affiche à la place du pokémon une pokeball
            firstCard.src = pokeballImage; 
            secondCard.src = pokeballImage;

            //ajout du pokémon capturé dans le tableau
            capturedPokemons.push(firstCard.getAttribute("data-url"));
            
            //crée l'élément à ajouter au container des pokémons capturés
            const capturedPokemon = document.createElement("div");
            capturedPokemon.classList.add(".liste_pokemons_captures");
            
            const capturedImage = document.createElement("img");
            capturedImage.setAttribute("src", firstCard.getAttribute("data-url"));
            capturedImage.setAttribute("alt", "Pokémon capturé");
            capturedPokemon.appendChild(capturedImage);
            
            //ajout du pokémon capturé dans le container
            capturedPokemonBox.appendChild(capturedPokemon);

            resetCards();

            //vérifie si tous les pokémons ont été capturés
            if (capturedPokemons.length === (document.querySelectorAll('.box').length / 2)) {
                //affichage du bouton pour rejouer
                replayBtn.style.display = "block";
            }
        }, 1000);
    } else {
        setTimeout(() => {
            firstCard.src = defaultImage;
            secondCard.src = defaultImage;
            resetCards();
        }, 1000);
    }
}

//création de la fonction qui va permettre de reset les cartes
function resetCards() {
    firstCard = null; //null car en attente de valeur
    secondCard = null;
    lockBoard = false; //empêche de cliquer pendant la vérification
}

initGame();
