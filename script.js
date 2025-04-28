//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.


/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/
let puppyPlayers = []
const puppyList = document.querySelector("#playerList")
const addPuppy = document.querySelector("#addPuppy")
////////////////////////////

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. When clicked, should be redirected
 *    to a page with the appropriate hashroute. The page should show
 *    specific details about the player clicked 
 * - Remove from roster. when clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
window.addEventListener("hashchange", () => {
  render()
})

const render = async () => 
{
  const players = puppyPlayers.map((list,idx) => 
    {
      return `
      <div>
        <h1> ${list.name}</h1>
        <p>${list.id}</p>
        <a href =#${list.name}><img src ="${list.imageUrl}" alt=${list.name}/></a>
        </br>
        <button class = "deleteButton" id = ${list.id} data-puppyIndex = ${idx}>Delete Puppy Player</button>
      </div>
      `
    });

    const pupName = window.location.hash.slice(1);

    console.log(pupName);

    if (pupName) {
      const singlePup = puppyPlayers.find((pup) => pup.name === pupName);
      console.log(singlePup);

      if (singlePup) {
        await fetchSinglePlayer(singlePup.id);
      }
    } else {
      puppyList.innerHTML = players.join("");
    }
};

/**
 * Updates html to display a single player.
 * A detailed page about the player is displayed with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The page also contains a "Back to all players" that, when clicked,
 * will redirect to the approriate hashroute to show all players.
 * The detailed page of the single player should no longer be shown.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  puppyList.innerHTML = 
     `<div>
          <h1> ${player.name}</h1>
          <h2>${player.id}</h2>
          <p>${player.breed}</p>
          <img src ="${player.imageUrl}" alt="${player.name}"/>
          <p>${player.teamId ? `Team ID: ${player.teamId} <br/>Assigned` :`No Team <br/> Unassigned`}</p>
          </br>
          <a href ="#">Go Back to list</a>
     </div>`
 };

/**
 * Fetches all players from the API.
 * This function should not be doing any rendering
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => 
{
try 
{
 const response = await fetch("https://fsa-puppy-bowl.herokuapp.com/api/2501am-PUPPIES/players") 
 const json = await response.json()
 puppyPlayers = json.data.players 
 //console.log(puppyPlayers)
 return puppyPlayers
} catch (error) {
  console.error(error)
}

};
/**
 * Fetches a single player from the API.
 * This function should not be doing any rendering
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2501am-PUPPIES/players/${playerId}`);
    const singlePupData = await response.json();
    console.log(singlePupData);
    renderSinglePlayer(singlePupData.data.player);
  } catch (error) {
    console.error("Error fetching single player:", error);
  }
};

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * Do we have a way to do that currently...? 
*/
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */
/**
 * FOR TESTING PURPOSES ONLY PLEASE OBSERVE THIS SECTION
 * @returns {Object} the new player object added to database
 */
addPuppy.addEventListener("submit", async (newPup) => 
{
 newPup.preventDefault();
 const addingPup = {
  name: newPup.target.name.value,
  breed: newPup.target.breed.value,
  status: newPup.target.status.value,
  imageUrl: newPup.target.imageUrl.value,
  teamId: newPup.target.teamId.value
 }; 
 console.log(addingPup);
 await addNewPlayer(addingPup);
});
const addNewPlayer = async (newPlayer) => {
  try {
    const response = await fetch("https://fsa-puppy-bowl.herokuapp.com/api/2501am-PUPPIES/players", {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newPlayer)
    });
    const puppyData = await response.json();
    console.log(puppyData.data);
    puppyPlayers.push(puppyData.data.newPlayer);
    render();
  } catch (error) {
    console.error("Error adding new player:", error);
  }
};

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() some information is required.
 * Unless we get that information, we cannot call removePlayer()....
 */
/**
 * Note#2: Don't be afraid to add parameters to this function if you need to!
 */
puppyList.addEventListener("click", (list) => 
{
  if (list.target.classList.contains("deleteButton"))
  {
    console.log("pressed delete")
    console.log(list.target)
    removePlayer(list.target.id, list.target.dataset.puppyindex)
  }
})
const removePlayer = async (playerId,idx) => {
  try {
    await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2501am-PUPPIES/players/${playerId}`, {
        method: "DELETE"
    })
    puppyPlayers.splice(idx, 1)
    render()
} catch (error) {
    console.error(error)
}
};

/**
 * Initializes the app by calling render
 * HOWEVER....
 */
const init = async () => {
  //Before we render, what do we always need...?
const puppData = await fetchAllPlayers()
console.log(puppData)
puppyPlayers = puppData 
  render();

};

/**THERE IS NO NEED TO EDIT THE CODE BELOW =) **/

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
  };
} else {
  init();
}