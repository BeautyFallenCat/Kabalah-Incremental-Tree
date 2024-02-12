var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
					v-bind:style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{tab}}</button>
				</div>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if (shiftDown && options.forceTooltips) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
				front: !tmp.scrolled,
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'Reach ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' to unlock (You have ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
		<div v-if="back"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">←</button></div>
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat">
			<div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
				    <info-thing v-bind:class="player.Ktr.newStory ? 'new':''" v-if='layer == "Ktr"'></info-thing><info-thingb v-bind:class="player.Hkm.newStory ? 'new':''" v-if='layer == "Hkm"'></info-thingb>
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `			
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: {{format(player.devSpeed)}}x<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>
		<br>
		<span v-if="player.points.lt('1e1000')"  class="overlayThing">You have </span>
		<h2  class="overlayThing" id="points" v-bind:style='{color: pointsColor(),"text-shadow":pointsColor()+" 0px 0px 10px"}'>{{format(player.points)}}</h2>
		<span v-if="player.points.lt('1e1e6')"  class="overlayThing"> {{modInfo.pointsName}}</span>
		<br>
		<span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen())}}/sec)</span>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
	</div>
	`
    },

    'info-tab': {
        template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3>
        <span v-if="modInfo.author">
            <br>
            Made by {{modInfo.author}}	
        </span>
        <br>
        The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
        <br>
        The Prestige Tree made by Jacorb and Aarex
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>
		<br><br>
        Time Played: {{ formatTime(player.timePlayed) }}<br><br>
        <h3>Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span></div>
    `
    },

    'options-tab': {
        template: `
        <table>
            <tr>
                <td><button class="opt" onclick="save()">Save</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">Autosave: {{ options.autosave?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="exportSave()">Export to clipboard</button></td>
                <td><button class="opt" onclick="importSave()">Import</button></td>
                <td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Prod: {{ options.offlineProd?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="switchTheme()">Theme: {{ getThemeName() }}</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt" onclick="toggleOpt('hqTree')">High-Quality Tree: {{ options.hqTree?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="toggleOpt('hideChallenges')">Completed Challenges: {{ options.hideChallenges?"HIDDEN":"SHOWN" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">Single-Tab Mode: {{ options.forceOneTab?"ALWAYS":"AUTO" }}</button></td>
				<td><button class="opt" onclick="toggleOpt('forceTooltips'); needsCanvasUpdate = true">Shift-Click to Toggle Tooltips: {{ options.forceTooltips?"ON":"OFF" }}</button></td>
				</tr> 
        </table>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
			<img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
		</div>
		`
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	}

}

function pointsColor(){
	if(player.points.lt(1e200)) return 'white'
	else return 'grey'		
}

function NaNCheck(x, d=false) {
	if (d) {
		x = new Decimal(x);
		if (isNaN(x.sign)||isNaN(x.layer)||isNaN(x.mag)) return new Decimal(0);
		else return x;
	} else {
		if (isNaN(x)) return 0;
		else return x;
	}
}
//所有函数都是输入三个数字，返回一个数组


// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,l为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbtohsl(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;

	let min=Math.min(r,g,b);
	let max=Math.max(r,g,b);
	let l=(min+max)/2;
	let difference = max-min;
	let h,s;
	if(max==min){
		h=0;
		s=0;
	}else{
		s=l>0.5?difference/(2.0-max-min):difference/(max+min);
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	s=Math.round(s*100);//转换成百分比的形式
	l=Math.round(l*100);
	return [h,s,l];
}

// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,v为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbtohsv(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;
	let h,s,v;
	let min=Math.min(r,g,b);
	let max=v=Math.max(r,g,b);
	let l=(min+max)/2;
	let difference = max-min;
	
	if(max==min){
		h=0;
	}else{
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	if(max==0){
		s=0;
	}else{
		s=1-min/max;
	}
	s=Math.round(s*100);
	v=Math.round(v*100);
	return [h,s,v];
}

//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsltorgb(h,s,l){
	h=h/360;
	s=s/100;
	l=l/100;
	let rgb=[];

	if(s==0){
		rgb=[Math.round(l*255),Math.round(l*255),Math.round(l*255)];
	}else{
		let q=l>=0.5?(l+s-l*s):(l*(1+s));
		let p=2*l-q;
		let tr=rgb[0]=h+1/3;
		let tg=rgb[1]=h;
		let tb=rgb[2]=h-1/3;
		for(let i=0; i<rgb.length;i++){
			let tc=rgb[i];
			//console.log(tc);
			if(tc<0){
				tc=tc+1;
			}else if(tc>1){
				tc=tc-1;
			}
			switch(true){
				case (tc<(1/6)):
					tc=p+(q-p)*6*tc;
					break;
				case ((1/6)<=tc && tc<0.5):
					tc=q;
					break;
				case (0.5<=tc && tc<(2/3)):
					tc=p+(q-p)*(4-6*tc);
					break;
				default:
					tc=p;
					break;
			}
			rgb[i]=Math.round(tc*255);
		}
	}
	
	return rgb;
}

//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsvtorgb(h,s,v){
	s=s/100;
	v=v/100;
	let h1=Math.floor(h/60) % 6;
	let f=h/60-h1;
	let p=v*(1-s);
	let q=v*(1-f*s);
	let t=v*(1-(1-f)*s);
	let r,g,b;
	switch(h1){
		case 0:
			r=v;
			g=t;
			b=p;
			break;
		case 1:
			r=q;
			g=v;
			b=p;
			break;
		case 2:
			r=p;
			g=v;
			b=t;
			break;
		case 3:
			r=p;
			g=q;
			b=v;
			break;
		case 4:
			r=t;
			g=p;
			b=v;
			break;
		case 5:
			r=v;
			g=p;
			b=q;
			break;
	}
	return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

function RGBToHexString(RGBinput){
    // RGB颜色值的正则
  let reg = /^(rgb|RGB)/;
  if (reg.test(RGBinput)) {
    let strHex = "#";
    // 把RGB的3个数值变成数组
    let colorArr = RGBinput.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    // 转成16进制
    for (let i = 0; i < colorArr.length; i++) {
      let hex = Number(colorArr[i]).toString(16);
      if (hex === "0") {
        hex += hex;
      }
	  else if (colorArr[i]<16){
		hex = "0"+hex;
	  }
      strHex += hex;
    }
    return strHex;
  } else {
    return String(RGBinput);
  }
}

function HexToRGBString(Hexinput){
    // 16进制颜色值的正则
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  Hexinput = Hexinput.toLowerCase();
  if (reg.test(Hexinput)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (Hexinput.length === 4) {
      let colorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        colorNew += Hexinput.slice(i, i + 1).concat(Hexinput.slice(i, i + 1));
      }
      Hexinput = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    let colorChange = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + Hexinput.slice(i, i + 2)));
    }
    return "RGB(" + colorChange.join(",") + ")";
  } else {
    return Hexinput;
  }
}

function RGBStringToArray(RGBinput){
    let reg = /^(rgb|RGB)/;
    if (reg.test(RGBinput)){
        // 把RGB的3个数值变成数组
        let colorArr = RGBinput.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        for (index in colorArr)
            colorArr[index] = Number(colorArr[index]);
        return colorArr;
    }
    else return [NaN,NaN,NaN];
}

function RGBArrayToString(Arrayinput){
    if (Arrayinput.length!=3) return "RGB(0,0,0)";
    else return ("RGB("+Arrayinput[0]+","+Arrayinput[1]+","+Arrayinput[2]+")");
}

function HexMinLight(Hexinput,minLight){
    //目标：输入16进制颜色，如果颜色亮度低于hsl的数值则增亮至对应数值，输出16进制颜色

    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    Hexinput = Hexinput.toLowerCase();
    if(reg.test(Hexinput)&&minLight<=100){
        let RGBString = HexToRGBString(Hexinput);
        let RGBArray = RGBStringToArray(RGBString);
        let hslArray = rgbtohsl(RGBArray[0],RGBArray[1],RGBArray[2]);

        if (hslArray[2]<minLight) hslArray[2]=minLight;

        RGBArray = hsltorgb(hslArray[0],hslArray[1],hslArray[2]);
        RGBString = RGBArrayToString(RGBArray);

        return RGBToHexString(RGBString);

    }
    else return Hexinput;
}

function HexMaxLight(Hexinput,maxLight){
    //目标：输入16进制颜色，如果颜色亮度高于hsl的数值则减暗至对应数值，输出16进制颜色

    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    Hexinput = Hexinput.toLowerCase();
    if(reg.test(Hexinput)&&maxLight<=100){
        let RGBString = HexToRGBString(Hexinput);
        let RGBArray = RGBStringToArray(RGBString);
        let hslArray = rgbtohsl(RGBArray[0],RGBArray[1],RGBArray[2]);

        if (hslArray[2]>maxLight) hslArray[2]=maxLight;

        RGBArray = hsltorgb(hslArray[0],hslArray[1],hslArray[2]);
        RGBString = RGBArrayToString(RGBArray);

        return RGBToHexString(RGBString);

    }
    else return Hexinput;
}

function GlowingColor(input, timefactor = 1, basecolor = "#000000"){
	//目标：通过正弦函数实现颜色的浮动, 输出16进制, 输入既可以是16进制，也可以是rgb
	let RGBArray = [0,0,0];
	if (typeof(input)==='object') RGBArray = input;
	if (typeof(input)==='string') {
		if (input != HexToRGBString(input)) input = HexToRGBString(input);
		RGBArray = RGBStringToArray(input);
	};

	let basecolorArray = [0,0,0]
	let outputArray = [0,0,0];

	if (typeof(basecolor)==='object') basecolorArray = input;
	if (typeof(basecolor)==='string') {
		if (basecolor != HexToRGBString(basecolor)) basecolor = HexToRGBString(basecolor);
		basecolorArray = RGBStringToArray(basecolor);
	};

	for (index in RGBArray)
	{
		outputArray[index] = Math.min(Math.round((basecolorArray[index]+RGBArray[index])/2+(RGBArray[index]-basecolorArray[index])/2*Math.sin((Date.now()/1000)/timefactor*2*Math.PI)),255);
	}

	return RGBToHexString(RGBArrayToString(outputArray))
}

function GetLuminance(r,g,b) {//from tinycolor.js https://github.com/bgrins/TinyColor
	//http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	var RsRGB, GsRGB, BsRGB, R, G, B;
	RsRGB = r/255;
	GsRGB = g/255;
	BsRGB = b/255;

	if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
	if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
	if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
	return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
}

function Readability(color1, color2) {//可传入RGB数组，不传入16进制与RGB字符串
	//from tinycolor.js https://github.com/bgrins/TinyColor
    return (Math.max(GetLuminance(color1[0],color1[1],color1[2]),GetLuminance(color2[0],color2[1],color2[2]))+0.05) / (Math.min(GetLuminance(color1[0],color1[1],color1[2]),GetLuminance(color2[0],color2[1],color2[2]))+0.05);
};

function MostReadable(modifiedColor=[0,0,0],fixedColor=[255,255,255],targetContrast = 1,mode = 0){
	//mode = 
	//		0: 要修改的颜色应当比不被修改的颜色暗
	//		1: 要修改的颜色应当比不被修改的颜色亮
	//		采用GetLuminance()作为明度的变量

	//目标: 返回与modifiedcolor色相相同，但对比度相较于fixedcolor趋近于目标值的颜色
	let modifiedhsv = rgbtohsv(modifiedColor[0],modifiedColor[1],modifiedColor[2]);
	let fixedLuminance = GetLuminance(fixedColor[0],fixedColor[1],fixedColor[2]);

	if (mode <= 0) {
		while (modifiedhsv[2] > 0 &&//下面那个无需判断是否变成负数，因为短路了。
			(Math.abs(Readability(hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2] - 1), fixedColor) - targetContrast) < Math.abs(Readability(hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2]), fixedColor) - targetContrast) ||
				GetLuminance(hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2])[0], hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2])[1], hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2])[2]) > fixedLuminance)) {
			modifiedhsv[2] -= 1;
		}
	}
	else if (mode >= 1) {
		while (modifiedhsv[2] < 100 &&//同理。
			(Math.abs(Readability(hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2] + 1), fixedColor) - targetContrast) < Math.abs(Readability(hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2]), fixedColor) - targetContrast) ||
				GetLuminance(hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2])[0], hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2])[1], hsvtorgb(modifiedhsv[0], modifiedhsv[1], modifiedhsv[2])[2]) < fixedLuminance)) {
			modifiedhsv[2] += 1;
		}
	}
	return hsvtorgb(modifiedhsv[0],modifiedhsv[1],modifiedhsv[2]);
}