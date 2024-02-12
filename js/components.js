var app;

function loadVue() {
	// data = a function returning the content (actually HTML)
	Vue.component('display-text', {
		props: ['layer', 'data'],
		template: `
			<span class="instant" v-html="data"></span>
		`
	})

// data = a function returning the content (actually HTML)
	Vue.component('raw-html', {
			props: ['layer', 'data'],
			template: `
				<span class="instant"  v-html="data"></span>
			`
		})

	// Blank space, data = optional height in px or pair with width and height in px
	Vue.component('blank', {
		props: ['layer', 'data'],
		template: `
			<div class = "instant">
			<div class = "instant" v-if="!data" v-bind:style="{'width': '8px', 'height': '17px'}"></div>
			<div class = "instant" v-else-if="Array.isArray(data)" v-bind:style="{'width': data[0], 'height': data[1]}"></div>
			<div class = "instant" v-else v-bind:style="{'width': '8px', 'height': data}"><br></div>
			</div>
		`
	})

	// Displays an image, data is the URL
	Vue.component('display-image', {
		props: ['layer', 'data'],
		template: `
			<img class="instant" v-bind:src= "data" v-bind:alt= "data">
		`
	})
		
	// data = an array of Components to be displayed in a row
	Vue.component('row', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgRow">
				<div v-for="(item, index) in data">
				<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==3" v-bind:style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	})

	// data = an array of Components to be displayed in a column
	Vue.component('column', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgCol">
				<div v-for="(item, index) in data">
					<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==3" v-bind:style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	})

	// data [other layer, tabformat for within proxy]
	Vue.component('layer-proxy', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div>
			<column :layer="data[0]" :data="data[1]" :key="key + 'col'"></column>
		</div>
		`
	})
	Vue.component('infobox', {
		props: ['layer', 'data'],
		template: `
		<div class="story instant" v-if="tmp[layer].infoboxes && tmp[layer].infoboxes[data]!== undefined && tmp[layer].infoboxes[data].unlocked" v-bind:style="[{'border-color': tmp[layer].color, 'border-radius': player.infoboxes[layer][data] ? 0 : '8px'}, tmp[layer].infoboxes[data].style]">
			<button class="story-title" v-bind:style="[{'background-color': tmp[layer].color}, tmp[layer].infoboxes[data].titleStyle]"
				v-on:click="player.infoboxes[layer][data] = !player.infoboxes[layer][data]">
				<span class="story-toggle">{{player.infoboxes[layer][data] ? "+" : "-"}}</span>
				<span v-html="tmp[layer].infoboxes[data].title ? tmp[layer].infoboxes[data].title : (tmp[layer].name)"></span>
			</button>
			<div v-if="!player.infoboxes[layer][data]" class="story-text" v-bind:style="tmp[layer].infoboxes[data].bodyStyle">
				<span v-html="tmp[layer].infoboxes[data].body ? tmp[layer].infoboxes[data].body : 'Blah'"></span>
			</div>
		</div>
		`
	})


	// Data = width in px, by default fills the full area
	Vue.component('h-line', {
		props: ['layer', 'data'],
			template:`
				<hr class="instant" v-bind:style="data ? {'width': data} : {}" class="hl">
			`
		})

	// Data = height in px, by default is bad
	Vue.component('v-line', {
		props: ['layer', 'data'],
		template: `
			<div class="instant" v-bind:style="data ? {'height': data} : {}" class="vl2"></div>
		`
	})

	Vue.component('challenges', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].challenges" class="upgTable">
		<div v-for="row in (data === undefined ? tmp[layer].challenges.rows : data)" class="upgRow">
		<div v-for="col in tmp[layer].challenges.cols">
					<challenge v-if="tmp[layer].challenges[row*10+col]!== undefined && tmp[layer].challenges[row*10+col].unlocked" :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.challenge"></challenge>
				</div>
			</div>
		</div>
		`
	})

	// data = id
	Vue.component('challenge', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].challenges && tmp[layer].challenges[data]!== undefined && tmp[layer].challenges[data].unlocked && !(options.hideChallenges && maxedChallenge(layer, [data]) && !inChallenge(layer, [data]))"
			v-bind:class="['challenge', challengeStyle(layer, data), player[layer].activeChallenge === data ? 'resetNotify' : '']" v-bind:style="tmp[layer].challenges[data].style">
			<br><h3 v-html="tmp[layer].challenges[data].name"></h3><br><br>
			<button v-bind:class="{ longUpg: true, can: true, [layer]: true }" v-bind:style="{'border-radius':'50%', 'background-color':(player[layer].activeChallenge == tmp[layer].challenges[data].id)?'white':'black', 'width':'200px','height':'200px','border-color': tmp[layer].challenges[data].locked? '#444444':tmp[layer].challenges[data].color,'font-size':'100px','color': tmp[layer].challenges[data].locked? '#444444':((player[layer].activeChallenge == tmp[layer].challenges[data].id)?'black':tmp[layer].challenges[data].color),'box-shadow':'0px 0px 10px 10px inset '+(tmp[layer].challenges[data].locked? '':tmp[layer].challenges[data].color),'transform': (player[layer].activeChallenge == tmp[layer].challenges[data].id)?('rotate('+player.timePlayed%10*36+'deg)'):('rotate(0deg)'),'text-decoration':tmp[layer].challenges[data].locked? 'line-through':'none'}" v-on:click="if(!tmp[layer].challenges[data].locked)startChallenge(layer, data)">{{tmp[layer].challenges[data].text}}<sub>{{tmp[layer].challenges[data].exp}}</sub></button><br><br>
			<span v-if="layers[layer].challenges[data].fullDisplay" v-html="run(layers[layer].challenges[data].fullDisplay, layers[layer].challenges[data])"></span>
			<span v-else>
				<span v-html="tmp[layer].challenges[data].challengeDescription"></span><br>
				<span v-if="layers[layer].challenges[data].rewardDisplay!==undefined">Currently: <span v-html="(tmp[layer].challenges[data].rewardDisplay) ? (run(layers[layer].challenges[data].rewardDisplay, layers[layer].challenges[data])) : format(tmp[layer].challenges[data].rewardEffect)"></span></span>
			</span>
			<node-mark :layer='layer' :data='tmp[layer].challenges[data].marked' :offset="20" :scale="1.5"></node-mark></span>

		</div>
		`
	})

	Vue.component('upgrades', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].upgrades" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].upgrades.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].upgrades.cols"><div v-if="tmp[layer].upgrades[row*10+col]!== undefined && tmp[layer].upgrades[row*10+col].unlocked" class="upgAlign">
					<upgrade :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.upgrade"></upgrade>
				</div></div>
			</div>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('upgrade', {
		props: ['layer', 'data'],
		template: `
		<button v-if="tmp[layer].upgrades && tmp[layer].upgrades[data]!== undefined && tmp[layer].upgrades[data].unlocked" :id='"upgrade-" + layer + "-" + data' v-on:click="buyUpg(layer, data)" v-bind:class="{ [layer]: true, tooltipBox: true, upg: true, bought: hasUpgrade(layer, data), locked: (!(canAffordUpgrade(layer, data))&&!hasUpgrade(layer, data)), can: (canAffordUpgrade(layer, data)&&!hasUpgrade(layer, data))}"
			v-bind:style="[((!hasUpgrade(layer, data) && canAffordUpgrade(layer, data)) ? {'background-color': tmp[layer].color} : {}), tmp[layer].upgrades[data].style]">
			<span v-if="layers[layer].upgrades[data].fullDisplay" v-html="run(layers[layer].upgrades[data].fullDisplay, layers[layer].upgrades[data])"></span>
			<span v-else>
				<span v-if= "tmp[layer].upgrades[data].title"><h3 v-html="tmp[layer].upgrades[data].title"></h3><br></span>
				<span v-html="tmp[layer].upgrades[data].description"></span>
				<span v-if="layers[layer].upgrades[data].effectDisplay"><br>Currently: <span v-html="run(layers[layer].upgrades[data].effectDisplay, layers[layer].upgrades[data])"></span></span>
				<br><br>Cost: {{ formatWhole(tmp[layer].upgrades[data].cost) }} {{(tmp[layer].upgrades[data].currencyDisplayName ? tmp[layer].upgrades[data].currencyDisplayName : tmp[layer].resource)}}
			</span>
			<tooltip v-if="tmp[layer].upgrades[data].tooltip" :text="tmp[layer].upgrades[data].tooltip"></tooltip>

			</button>
		`
	})

	Vue.component('milestones', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].milestones">
			<table>
				<tr v-for="id in (data === undefined ? Object.keys(tmp[layer].milestones) : data)" v-if="tmp[layer].milestones[id]!== undefined && tmp[layer].milestones[id].unlocked && milestoneShown(layer, id)">
					<milestone :layer = "layer" :data = "id" v-bind:style="tmp[layer].componentStyles.milestone"></milestone>
				</tr>
			</table>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('milestone', {
		props: ['layer', 'data'],
		template: `
		<td v-if="tmp[layer].milestones && tmp[layer].milestones[data]!== undefined && milestoneShown(layer, data) && tmp[layer].milestones[data].unlocked" v-bind:style="[tmp[layer].milestones[data].style]" v-bind:class="{milestone: !hasMilestone(layer, data), tooltipBox: true, milestoneDone: hasMilestone(layer, data)}">
			<h3 v-html="tmp[layer].milestones[data].requirementDescription"></h3><br>
			<span v-html="run(layers[layer].milestones[data].effectDescription, layers[layer].milestones[data])"></span><br>
			<tooltip v-if="tmp[layer].milestones[data].tooltip" :text="tmp[layer].milestones[data].tooltip"></tooltip>

		<span v-if="(tmp[layer].milestones[data].toggles)&&(hasMilestone(layer, data))" v-for="toggle in tmp[layer].milestones[data].toggles"><toggle :layer= "layer" :data= "toggle" v-bind:style="tmp[layer].componentStyles.toggle"></toggle>&nbsp;</span></td></tr>
		`
	})

	Vue.component('toggle', {
		props: ['layer', 'data'],
		template: `
		<button class="smallUpg can" v-bind:style="{'background-color': tmp[data[0]].color}" v-on:click="toggleAuto(data)">{{player[data[0]][data[1]]?"ON":"OFF"}}</button>
		`
	})

	Vue.component('prestige-button', {
		props: ['layer', 'data'],
		template: `
		<button v-if="(tmp[layer].type !== 'none')" v-bind:class="{ [layer]: true, reset: true, locked: !tmp[layer].canReset, can: tmp[layer].canReset}"
			v-bind:style="[tmp[layer].canReset ? {'background-color': '#000000'} : {'background-color': ''},tmp[layer].canReset ? {'box-shadow': 'inset 0px 0px 10px '+(player.timePlayed%5+10)+'px ' +tmp[layer].color} : {'box-shadow':''},tmp[layer].canReset ? {'color':'white'} : {'color':'black'},tmp[layer].canReset ? {'border-color':tmp[layer].color} : {'border-color':''}, tmp[layer].componentStyles['prestige-button']]"
			v-html="prestigeButtonText(layer)" v-on:click="if(tmp[layer].canReset) {onReset(layer),doReset(layer)}">
		</button><br>
		`
	
	})

	// Displays the main resource for the layer
	Vue.component('main-display', {
		props: ['layer', 'data'],
		template: `
		<div><span v-if="player[layer].points.lt('1e1000')">You have </span><h2 v-bind:style="{'color': tmp[layer].color, 'text-shadow': '0px 0px 10px ' + tmp[layer].color}">{{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}</h2> {{tmp[layer].resource}}<span v-if="layers[layer].effectDescription">, <span v-html="run(layers[layer].effectDescription, layers[layer])"></span></span><br><br></div>
		</span><br><br></div>
		`
	})

	// Displays the base resource for the layer, as well as the best and total values for the layer's currency, if tracked
	Vue.component('resource-display', {
		props: ['layer'],
		template: `
		<div style="margin-top: -13px">
			<span v-if="tmp[layer].baseAmount"><br>You have {{formatWhole(tmp[layer].baseAmount)}} {{tmp[layer].baseResource}}</span>
			<span v-if="tmp[layer].passiveGeneration"><br>You are gaining {{format(tmp[layer].resetGain.times(tmp[layer].passiveGeneration))}} {{tmp[layer].resource}} per second</span>
			<br><br>
			<span v-if="tmp[layer].showBest">Your best {{tmp[layer].resource}} is {{formatWhole(player[layer].best)}}<br></span>
			<span v-if="tmp[layer].showTotal">You have made a total of {{formatWhole(player[layer].total)}} {{tmp[layer].resource}}<br></span>
		</div>
		`
	})

	Vue.component('buyables', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].buyables" class="upgTable">
			<respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['respec-button']]"></respec-button>
			<div v-for="row in (data === undefined ? tmp[layer].buyables.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].buyables.cols"><div v-if="tmp[layer].buyables[row*10+col]!== undefined && tmp[layer].buyables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
					<buyable :layer = "layer" :data = "row*10+col"></buyable>
				</div></div>
				<br>
			</div>
		</div>
	`
	})

	Vue.component('buyable', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].buyables && tmp[layer].buyables[data]!== undefined && tmp[layer].buyables[data].unlocked" style="display: grid">
			<button v-bind:class="{ buyable: true, tooltipBox: true, can: tmp[layer].buyables[data].canBuy, locked: !tmp[layer].buyables[data].canBuy, bought: player[layer].buyables[data].gte(tmp[layer].buyables[data].purchaseLimit)}"
			v-bind:style="[tmp[layer].buyables[data].canBuy ? {'background-color': tmp[layer].color} : {}, tmp[layer].componentStyles.buyable, tmp[layer].buyables[data].style]"
			v-on:click="if(!interval) buyBuyable(layer, data)" :id='"buyable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
				<span v-if= "tmp[layer].buyables[data].title"><h2 v-html="tmp[layer].buyables[data].title"></h2><br></span>
				<span v-bind:style="{'white-space': 'pre-line'}" v-html="run(layers[layer].buyables[data].display, layers[layer].buyables[data])"></span>
				<node-mark :layer='layer' :data='tmp[layer].buyables[data].marked'></node-mark>
				<tooltip v-if="tmp[layer].buyables[data].tooltip" :text="tmp[layer].buyables[data].tooltip"></tooltip>

			</button>
			<br v-if="(tmp[layer].buyables[data].sellOne !== undefined && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)) || (tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false))">
			<sell-one :layer="layer" :data="data" v-bind:style="tmp[layer].componentStyles['sell-one']" v-if="(tmp[layer].buyables[data].sellOne)&& !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)"></sell-one>
			<sell-all :layer="layer" :data="data" v-bind:style="tmp[layer].componentStyles['sell-all']" v-if="(tmp[layer].buyables[data].sellAll)&& !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)"></sell-all>
		</div>
		`,
		data() { return { interval: false, time: 0,}},
		methods: {
			start() {
				if (!this.interval) {
					this.interval = setInterval((function() {
						if(this.time >= 5)
							buyBuyable(this.layer, this.data)
						this.time = this.time+1
					}).bind(this), 50)}
			},
			stop() {
				clearInterval(this.interval)
				this.interval = false
			  	this.time = 0
			}
		},
	})

	Vue.component('respec-button', {
		props: ['layer', 'data'],
		template: `
			<div v-if="tmp[layer].buyables && tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)">
				<div class="tooltipBox respecCheckbox"><input type="checkbox" v-model="player[layer].noRespecConfirm" ><tooltip v-bind:text="'Disable respec confirmation'"></tooltip></div>
				<button v-on:click="respecBuyables(layer)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }" style="margin-right: 18px">{{tmp[layer].buyables.respecText ? tmp[layer].buyables.respecText : "Respec"}}</button>
			</div>
			`
	})
	
	Vue.component('clickables', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].clickables" class="upgTable">
			<master-button v-if="tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['master-button']]"></master-button>
			<div v-for="row in (data === undefined ? tmp[layer].clickables.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].clickables.cols"><div v-if="tmp[layer].clickables[row*10+col]!== undefined && tmp[layer].clickables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
					<clickable :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.clickable"></clickable>
				</div></div>
				<br>
			</div>
		</div>
	`
	})

	// data = id of clickable
	Vue.component('clickable', {
		props: ['layer', 'data'],
		template: `
		<button 
			v-if="tmp[layer].clickables && tmp[layer].clickables[data]!== undefined && tmp[layer].clickables[data].unlocked" 
			v-bind:class="{ upg: true, tooltipBox: true, can: tmp[layer].clickables[data].canClick, locked: !tmp[layer].clickables[data].canClick}"
			v-bind:style="[tmp[layer].clickables[data].canClick ? {'background-color': tmp[layer].color} : {}, tmp[layer].clickables[data].style]"
			v-on:click="if(!interval) clickClickable(layer, data)" :id='"clickable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-if= "tmp[layer].clickables[data].title"><h2 v-html="tmp[layer].clickables[data].title"></h2><br></span>
			<span v-bind:style="{'white-space': 'pre-line'}" v-html="run(layers[layer].clickables[data].display, layers[layer].clickables[data])"></span>
			<node-mark :layer='layer' :data='tmp[layer].clickables[data].marked'></node-mark>
			<tooltip v-if="tmp[layer].clickables[data].tooltip" :text="tmp[layer].clickables[data].tooltip"></tooltip>

		</button>
		`,
		data() { return { interval: false, time: 0,}},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].clickables[this.data].onHold) {
					this.interval = setInterval((function() {
						let c = layers[this.layer].clickables[this.data]
						if(this.time >= 5 && run(c.canClick, c)) {
							run(c.onHold, c)
						}	
						this.time = this.time+1
					}).bind(this), 50)}
			},
			stop() {
				clearInterval(this.interval)
				this.interval = false
			  	this.time = 0
			}
		},
	})

	Vue.component('master-button', {
		props: ['layer', 'data'],
		template: `
		<button v-if="tmp[layer].clickables && tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)"
			v-on:click="run(tmp[layer].clickables.masterButtonPress, tmp[layer].clickables)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].clickables.masterButtonText ? tmp[layer].clickables.masterButtonText : "Click me!"}}</button>
	`
	})


	// data = optionally, array of rows for the grid to show
	Vue.component('grid', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].grid" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].grid.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].grid.cols"><div v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row*100+col)"
					class="upgAlign" v-bind:style="{'margin': '1px',  'height': 'inherit',}">
					<gridable :layer = "layer" :data = "row*100+col" v-bind:style="tmp[layer].componentStyles.gridable"></gridable>
				</div></div>
				<br>
			</div>
		</div>
	`
	})

	Vue.component('gridable', {
		props: ['layer', 'data'],
		template: `
		<button 
		v-if="tmp[layer].grid && player[layer].grid[data]!== undefined && run(layers[layer].grid.getUnlocked, layers[layer].grid, data)" 
		v-bind:class="{ tile: true, can: canClick, locked: !canClick, tooltipBox: true,}"
		v-bind:style="[canClick ? {'background-color': tmp[layer].color} : {}, gridRun(layer, 'getStyle', player[this.layer].grid[this.data], this.data)]"
		v-on:click="clickGrid(layer, data)"  @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-if= "layers[layer].grid.getTitle"><h3 v-html="gridRun(this.layer, 'getTitle', player[this.layer].grid[this.data], this.data)"></h3><br></span>
			<span v-bind:style="{'white-space': 'pre-line'}" v-html="gridRun(this.layer, 'getDisplay', player[this.layer].grid[this.data], this.data)"></span>
			<tooltip v-if="layers[layer].grid.getTooltip" :text="gridRun(this.layer, 'getTooltip', player[this.layer].grid[this.data], this.data)"></tooltip>

		</button>
		`,
		data() { return { interval: false, time: 0,}},
		computed: {
			canClick() {
				return gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data)}
		},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].grid.onHold) {
					this.interval = setInterval((function() {
						if(this.time >= 5 && gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data)) {
							gridRun(this.layer, 'onHold', player[this.layer].grid[this.data], this.data)						}	
						this.time = this.time+1
					}).bind(this), 50)}
			},
			stop() {
				clearInterval(this.interval)
				this.interval = false
			  	this.time = 0
			}
		},
	})

	// data = id of microtab family
	Vue.component('microtabs', {
		props: ['layer', 'data'],
		computed: {
			currentTab() {return player.subtabs[layer][data]}
		},
		template: `
		<div v-if="tmp[layer].microtabs" :style="{'border-style': 'solid'}">
			<div class="upgTable instant">
				<tab-buttons :layer="layer" :data="tmp[layer].microtabs[data]" :name="data" v-bind:style="tmp[layer].componentStyles['tab-buttons']"></tab-buttons>
			</div>
			<layer-tab v-if="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :layer="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :embedded="true"></layer-tab>

			<column v-else v-bind:style="tmp[layer].microtabs[data][player.subtabs[layer][data]].style" :layer="layer" :data="tmp[layer].microtabs[data][player.subtabs[layer][data]].content"></column>
		</div>
		`
	})

	// data = id of the bar
	Vue.component('bar', {
		props: ['layer', 'data'],
		computed: {
			style() {return constructBarStyle(this.layer, this.data)}
		},
		template: `
		<div v-if="tmp[layer].bars && tmp[layer].bars[data].unlocked" v-bind:style="{'position': 'relative'}"><div v-bind:style="[tmp[layer].bars[data].style, style.dims, {'display': 'table'}]">
			<div class = "overlayTextContainer barBorder" v-bind:style="[tmp[layer].bars[data].borderStyle, style.dims]">
				<span class = "overlayText" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].textStyle]" v-html="run(layers[layer].bars[data].display, layers[layer].bars[data])"></span>
			</div>
			<div class ="barBG barBorder" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].baseStyle, tmp[layer].bars[data].borderStyle,  style.dims]">
				<div class ="fill" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].fillStyle, style.fillDims]"></div>
			</div>
		</div></div>
		`
	})


	Vue.component('achievements', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].achievements" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].achievements.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].achievements.cols"><div v-if="tmp[layer].achievements[row*10+col]!== undefined && tmp[layer].achievements[row*10+col].unlocked" class="upgAlign">
					<achievement :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.achievement"></achievement>
				</div></div>
			</div>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('achievement', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].achievements && tmp[layer].achievements[data]!== undefined && tmp[layer].achievements[data].unlocked" v-bind:class="{ [layer]: true, achievement: true, tooltipBox:true, locked: !hasAchievement(layer, data), bought: hasAchievement(layer, data)}"
			v-bind:style="achievementStyle(layer, data)">
			<tooltip :text="
			(tmp[layer].achievements[data].tooltip == '') ? false : hasAchievement(layer, data) ? (tmp[layer].achievements[data].doneTooltip ? tmp[layer].achievements[data].doneTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'You did it!'))
			: (tmp[layer].achievements[data].goalTooltip ? tmp[layer].achievements[data].goalTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'LOCKED'))
		"></tooltip>
			<span v-if= "tmp[layer].achievements[data].name"><br><h3 v-bind:style="tmp[layer].achievements[data].textStyle" v-html="tmp[layer].achievements[data].name"></h3><br></span>
		</div>
		`
	})

	// Data is an array with the structure of the tree
	Vue.component('tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<div>
		<span class="upgRow" v-for="(row, r) in data"><table>
			<span v-for="(node, id) in row" style = "{width: 0px}">
				<tree-node :layer='node' :prev='layer' :abb='tmp[node].symbol' :key="key + '-' + r + '-' + id"></tree-node>
			</span>
			<tr><table><button class="treeNode hidden"></button></table></tr>
		</span></div>

	`
	})

	// Data is an array with the structure of the tree
	Vue.component('upgrade-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'upgrade'"></thing-tree>`
	})

	// Data is an array with the structure of the tree
	Vue.component('buyable-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'buyable'"></thing-tree>`
	})

	// Data is an array with the structure of the tree
	Vue.component('clickable-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'clickable'"></thing-tree>`
	})

	Vue.component('thing-tree', {
		props: ['layer', 'data', 'type'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<div>
		<span class="upgRow" v-for="(row, r) in data"><table>
			<span v-for="id in row" style = "{width: 0px; height: 0px;}" v-if="tmp[layer][type+'s'][id]!== undefined && tmp[layer][type+'s'][id].unlocked" class="upgAlign">
				<div v-bind:is="type" :layer = "layer" :data = "id" v-bind:style="tmp[layer].componentStyles[type]" class = "treeThing"></div>
			</span>
			<tr><table><button class="treeNode hidden"></button></table></tr>
		</span></div>
	`
	})


	// Updates the value in player[layer][data]
	Vue.component('text-input', {
		props: ['layer', 'data'],
		template: `
			<input class="instant" :id="'input-' + layer + '-' + data" :value="player[layer][data].toString()" v-on:focus="focused(true)" v-on:blur="focused(false)"
			v-on:change="player[layer][data] = toValue(document.getElementById('input-' + layer + '-' + data).value, player[layer][data])">
		`
	})

	// Updates the value in player[layer][data][0]
	Vue.component('slider', {
		props: ['layer', 'data'],
		template: `
			<div class="tooltipBox">
			<tooltip :text="player[layer][data[0]]"></tooltip><input type="range" v-model="player[layer][data[0]]" :min="data[1]" :max="data[2]"></div>
		`
	})

	// Updates the value in player[layer][data[0]], options are an array in data[1]
	Vue.component('drop-down', {
		props: ['layer', 'data'],
		template: `
			<select v-model="player[layer][data[0]]">
				<option v-for="item in data[1]" v-bind:value="item">{{item}}</option>
			</select>
		`
	})
	// These are for buyables, data is the id of the corresponding buyable
	Vue.component('sell-one', {
		props: ['layer', 'data'],
		template: `
			<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellOne && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)" v-on:click="run(tmp[layer].buyables[data].sellOne, tmp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellOneText ? tmp[layer].buyables.sellOneText : "Sell One"}}</button>
	`
	})
	Vue.component('sell-all', {
		props: ['layer', 'data'],
		template: `
			<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)" v-on:click="run(tmp[layer].buyables[data].sellAll, tmp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellAllText ? tmp[layer].buyables.sellAllText : "Sell All"}}</button>
	`
	})
	Vue.component('info-thing', {
		props: ['layer'],
		template: `<button class="info kether" @click="ketherStory()">Story {{player.Ktr.newStory?"(New!!)":""}}</button>`
	})
	Vue.component('info-thingb', {
		props: ['layer'],
		template: `<button class="info hokma" @click="hokmaStory()">Story {{player.Hkm.newStory?"(New!!)":""}}</button>`
	})

	// SYSTEM COMPONENTS
	Vue.component('node-mark', systemComponents['node-mark'])
	Vue.component('tab-buttons', systemComponents['tab-buttons'])
	Vue.component('tree-node', systemComponents['tree-node'])
	Vue.component('layer-tab', systemComponents['layer-tab'])
	Vue.component('overlay-head', systemComponents['overlay-head'])
	Vue.component('info-tab', systemComponents['info-tab'])
	Vue.component('options-tab', systemComponents['options-tab'])
	Vue.component('tooltip', systemComponents['tooltip'])
	Vue.component('particle', systemComponents['particle'])
	Vue.component('bg', systemComponents['bg'])
	Modal.load();


	app = new Vue({
		el: "#app",
		data: {
			player,
			tmp,
			options,
			Decimal,
			format,
			formatWhole,
			formatTime,
			formatSmall,
			focused,
			getThemeName,
			layerunlocked,
			doReset,
			buyUpg,
			buyUpgrade,
			startChallenge,
			milestoneShown,
			keepGoing,
			hasUpgrade,
			hasMilestone,
			hasAchievement,
			hasChallenge,
			maxedChallenge,
			getBuyableAmount,
			getClickableState,
			inChallenge,
			canAffordUpgrade,
			canBuyBuyable,
			canCompleteChallenge,
			subtabShouldNotify,
			subtabResetNotify,
			challengeStyle,
			challengeButtonText,
			constructBarStyle,
			constructParticleStyle,
			VERSION,
			LAYERS,
			hotkeys,
			activePopups,
			particles,
			mouseX,
			mouseY,
			shiftDown,
			ctrlDown,
			run,
			gridRun,
			Modal
		},
	})
}

const Modal = {
	load() {
		Vue.component('modal', {
			data: () => {
				return {
					Modal
				};
			},
			template: `<div class="modal" v-if="Modal.showing" style='Modal.data.style' v-bind:style='[{"border-color": Modal.data.color}]'>
				<div class="modal-top" v-bind:style='[{"border-color": Modal.data.color}]'>
					<span v-html="Modal.data.title()" style="padding-left: 7px; font-size: 20px"></span>
				</div>
				<div v-if="Modal.data.bind" :is="Modal.data.bind" :data="Modal.data.bindData"></div>
				<div v-html="Modal.data.text()" style="text-align: left; padding: 10px"></div>
				<div style="position: absolute; bottom: 120px; left: 47%; width:100%; transform: translateX(-50%); text-align: center">
					<button class='tabButton' v-for="(btn,i) in Modal.data.buttons" @click="btn.onClick" style="min-width: 5px; margin: 0 5px" v-bind:style='[{"border-color": Modal.data.color,"opacity": btn.unlocked()? "1":"0","visibility": btn.unlocked()? "visible":"hidden"}]'>{{btn.text}}</button>
				</div>
				<div v-bind:style='[{"border-color": Modal.data.color}]' style="border: 2px solid white;border-radius:5px; height: 25px; position: absolute; bottom: 50px; left: 44%; width: 100px; font-size:20px; padding:10px"
					onclick="Modal.closeFunc()">Confirm
				</div>
			</div>`
		});
	},
	show({title, text="", bind="",color="white", bindData={}, style={}, buttons=[], close=function () {Modal.close();}}) {
		Modal.data.title = title;
		Modal.data.color = color;
		Modal.data.text = text;
		Modal.data.bind = bind;
		Modal.data.bindData = bindData;
		Modal.data.buttons = buttons;
		Modal.data.style = style;
		Modal.closeFunc = close;
		Modal.showing = true;
	},
	close() {
		Modal.showing = false;
	},
	closeFunc() {
		Modal.close();
	},
	showing: false,
	data: {
		title: "",
		text: "",
		bind: "",
		buttons: [],
		style: {}
	}
};

//快捷调用+提高运算速度
var zero = new Decimal(0)
var one = new Decimal(1)
var two = new Decimal(2)
var three = new Decimal(3)
var four = new Decimal(4)
var five = new Decimal(5)
var six = new Decimal(6)
var seven = new Decimal(7)
var eight = new Decimal(8)
var nine = new Decimal(9)
var ten = new Decimal(10)
//快捷定义
function n(num){
    return new Decimal(num)
}
//检测旁边的升级是否被购买
function checkAroundUpg(UPGlayer,place){
    place = Number(place)
    return hasUpgrade(UPGlayer,place-1)||hasUpgrade(UPGlayer,place+1)||hasUpgrade(UPGlayer,place-10)||hasUpgrade(UPGlayer,place+10)
}
//指数软上限
function powsoftcap(num,start,power){
	if(num.gt(start)){
		num = num.root(power).mul(start.pow(one.sub(one.div(power))))
	}
    return num
}
//e后数字开根
function expRoot(num,root){
    return ten.pow(num.log10().root(root))
}
//e后数字乘方
function expPow(num,pow){
    return ten.pow(num.log10().pow(pow))
}
//e后数字指数软上限
function expRootSoftcap(num,start,power){
    if(num.lte(start)) return num;
    num = num.log10();start = start.log10()
    return ten.pow(num.root(power).mul(start.pow(one.sub(one.div(power)))))
}
//修改class属性
function setClass(id,toClass = []){
    var classes = ""
    for(i in toClass) classes += " "+toClass[i]
    if(classes != "") classes = classes.substr(1)
    document.getElementById(id).className = classes
}
//快速创建sub元素
function quickSUB(str){
    return `<sub>${str}</sub>`
}
//快速创建sup元素
function quickSUP(str){
    return `<sup>${str}</sup>`
}
//快速给文字上色
function quickBackgColor(str,color){
    return `<text style='background-color:${color};color:white'>${str}</text>`
}
function quickBackgColor2(str,color){
    return `<text style='background-color:${color};color:black'>${str}</text>`
}
function quickColor(str,color){
    return `<text style='color:${color}'>${str}</text>`
}
function quickBigColor(str,color){
    return `<text style='color:${color}; font-size: 25px; text-shadow: 0px 0px 10px ${color}'>${str}</text>`
}
function quickDoubleColor(str,colora,colorb){
    return `<text style='background-image:linear-gradient(to right, ${colora}, ${colorb}); -webkit-background-clip:text; color: transparent; font-size: 25px; text-shadow: 0px 0px 10px ${colorb}'>${str}</text>`
}
function getBonusDesc()
{
	var nextBonus = 0
	for(let i = 0; i < 99999999; i++)
	{
        if(player.Ktr.ark.add(1).lt(tmp.Ktr.arkBonusReq[i])) nextBonus = tmp.Ktr.arkBonusReq[i]
		if(player.Ktr.ark.add(1).lt(tmp.Ktr.arkBonusReq[i])) break
	}
	return formatWhole(nextBonus-1)+" ,"+tmp.Ktr.ArkDescs[nextBonus]   
}

var texts =
    [
		"0''''1''''2''''3''''3.5''''4''''4.4''''4.7''''5 Here is a ruler but SOFTCAPPED",
        "Hello world",
        "Why can't you reach next sephirah? Because the ranking of last sephirah haven't reach S (920,000 pts).",
        "See You Next Time",
        "Let's get HIGHER!",
        "72788433374733678633778263464",
        "One Two Three Fire!",
        "Guess how many times you need to reload to see this news again ￣︶￣",
        "This is a news belonging to the Heart Gate update version!",
        "Let's guess how much useful information there is here",
        "Ah. What news should I show you",
        "Have you ever counted how many times you've seen this news?",
        "WHAT DO YOU KNOW WHAT DO YOU PLAY WHAT DO YOU REMEMBER WHAT DO YOU LOVE",
        "Yooooooooooooooooooo",
        "This update adds your total game time to your global time speed, is it impressive?",
        "Confusing News",
        "Redemption",
        "This is the story for one character of misery",
        "Hit me with the HARDCORE!!!",
        "5.555555555 hours until the update",
        "Be careful not to be discovered",
		"This news bar is at 50fps while the game is at 20fps, so you should give 2.5x respect to this bar, isn't it?",
		"The instability of Fallen_Cat's Method is 100-e^ipi%. If this number go beyond 100%, the game will be broken.",
		"F1.8e308 is the limit of game number, not the limit of Fallen_Cat's idea.",
		"Breaking news! A Memory Crystal mine is collapsed and 114 miners lost their lives.",
		"Legend has it that within the delicate and fragile butterfly body, there is also the power to trigger hurricanes. This butterfly, composed of pure wind, is undoubtedly waiting for the day when another storm is summoned",
		"KarbalOS is loading",
		"Playing click games for a long time can pose a risk of tenosynovitis. Pay attention to rest.",
		"After playing for a long time, remember to close your eyes and rest for a while~",
		"As is well known, the author's year has 377 days",
		"Dev Haste x2. Next version will come out much sooner.",
		"Where is te 6th stage?",
		"I swear on the darkest night I'll end it all and... Sorry, I forgot what's next.",
		"We must distort the fate of destruction through retribution, scramble into the chariot of revival, and enjoy the luminescence of the crave wave.",
		"Oo0.o0.oO",
    ]
var p = 50 + (document.body.clientWidth / 2.4)
var l = -50 - (newsText.innerText.length * 20)
var newsTimer = setInterval(function () {
    p -= 1
    if (p <= l) {
        newsText.innerText = texts[Math.floor(Math.random() * texts.length)]
        newsText.style.width = (newsText.innerText.length * 16).toString() + "px"
        l = -50 - (newsText.innerText.length * 16)
        p = 50 + (document.body.clientWidth / 2.4)
    }
    newsText.style.left = p.toFixed(1) + "px"
}, 10)