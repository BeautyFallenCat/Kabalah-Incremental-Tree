let modInfo = {
	name: "The Kabalah Incremantal Tree",
	id: "FallenCat20231218",
	author: "nobody",
	pointsName: "essences",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "Ktr.Awaken",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Nothing there forever.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if(hasUpgrade('Ktr','Ktr-1')) gain = gain.add(1)
	if(hasUpgrade('Ktr','Ktr-2')) gain = gain.mul(upgradeEffect('Ktr','Ktr-2'))
	if(hasUpgrade('Ktr','Ktr-3')) gain = gain.mul(upgradeEffect('Ktr','Ktr-3'))
	if(player.Ktr.storyUnlocked >= 3) gain = gain.mul(tmp.Ktr.stallarEff)
	if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[0].start)) gain = gain.mul(tmp.Ktr.memoryBonus[0].effect)
	if(player.Ktr.ark.gte(1)) gain = gain.mul(tmp.Ktr.arkEff)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	'=First Step in a New World='
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

addNode("P",{
    row:999,
    color:'blue',
    onClick(){if(player.devSpeed!=1e-300) player.devSpeed = 1e-300
    else player.devSpeed = 1},
    canClick(){return true}
})