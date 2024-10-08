addLayer("Ktr", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol(){return "Ktr<sup>"+player.Ktr.storyUnlocked}, // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        memory: new Decimal(0),
        stallar: new Decimal(0),
        stallarFreeze: new Decimal(0),
        ark: new Decimal(0),
        fuel: new Decimal(0),
        totalFuel: new Decimal(0),
        storyUnlocked: 0,
        storyShowing: 1,
        newStory: false,
        distant: false,
        remote: false,
        solarLayer: 0,
        solarPower: [n(0),n(0),n(0),n(0),n(0),n(0)],
        universalTime: n(0),
        realTime: n(0),
        timeWrap: n(1),
        memoryCrystal: n(0),
        gateLayer: 0,
        content: '',
        gate1: 0,
        lastCrystal: n(0),
        resetedMemory: false,
        respeced: false,
        posk1: 0,
        posk2: 0,
    }},
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone('Hkm','Hkm-2') && resettingLayer == 'Hkm') keep.push('upgrades')
        if (hasMilestone('Hkm','Hkm-7') && resettingLayer == 'Hkm') keep.push('memoryCrystal')
        if (hasMilestone('Hkm','Hkm-8') && resettingLayer == 'Hkm') keep.push('distant')
        if (hasMilestone('Hkm','Hkm-8') && resettingLayer == 'Hkm') keep.push('remote')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('buyables')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('ark')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('fuel')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('totalFuel')
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    resetsNothing(){
        return player.Ktr.storyUnlocked >= 9
    },
    celestialLevel(){
        let level = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            level[i] = player.Ktr.solarPower[i].add(1).log(tmp.Ktr.celestialRoot[i]).floor()
        }
        if(level[0].gte(100)) level[0] = n(100)
        return level
    },
    arkReq(){
        return [0,200,10000,100000,2e6,1e8,1e10,4e12,4e15,4e17,4e20]
    },
    arkBonusReq(){
        return [2,3,4,5,6,7,8,14,22,31,99999]
    },
    arkFullReq(){
        if(player.Ktr.ark.lt(10)) req = n(tmp.Ktr.arkReq[player.Ktr.ark.add(1)])
        if(player.Ktr.ark.gte(10) && player.Ktr.ark.lt(20)) req = new Decimal(2500).pow(player.Ktr.ark.sub(10)).mul(1e19)
        if(player.Ktr.ark.gte(20) && player.Ktr.ark.lt(30)) req = new Decimal(2.5e6).pow(player.Ktr.ark.sub(19)).mul(1e48)
        if(player.Ktr.ark.gte(30) && player.Ktr.ark.lt(40)) req = new Decimal(7e9).pow(player.Ktr.ark.sub(29)).mul(1e110)
        if(player.Ktr.ark.gte(40) && player.Ktr.ark.lt(80)) req = new Decimal(1e25).pow(player.Ktr.ark.sub(39)).mul(1e210)
        if(player.Ktr.ark.gte(80)) req = new Decimal(1e55).pow(player.Ktr.ark.sub(79)).mul('1e1050')
        if(tmp.Ktr.celestialLevel[1].gte(1)) req = req.div(tmp.Ktr.clickables['Ktr-r-c2'].effect1)
        if(hasAchievement('Ain','Hkm-14')) req = req.div(buyableEffect('Hkm','Hkm-f1'))
        return n(req)
    },
    stallarEff(){
        let eff = player.Ktr.stallar.add(2.7).log(2.7)
        if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[5].start)) eff = eff.pow(4.5)
        if(hasUpgrade('Hkm','Hkm-8')) eff = player.Ktr.stallar.add(1).pow(0.05)
        return eff
    },
    solarLayer(){
        let layer = ["Milky Way System","Local Group of Galaxies","Virgo Supercluster","Observable Universe","Multiverse"]
        return layer
    },
    solarReq(){
        return [1e52,5e67,1e150,1e9999]
    },
    solarBoost(){
        return [1,1000,1e6,1e18]
    },
    solarColor(){
        return ['lavender','#c999ff','#8619ff','#480099']
    },
    celestialGain(){
        return [tmp.Ktr.solarEnergy.root(5).div(10).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(10).div(1300).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(15).div(1e4).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(22).div(1e7).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(30).div(1e8).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(40).div(1e12).mul(tmp.Ktr.celestialBoost)]
    },
    celestialRoot(){
        return [5,9,10,12,25,40]
    },
    celestialBoost(){
        let boost = n(1)
        if(player.Ktr.solarPower[0].gte(1)) boost = boost.mul(tmp.Ktr.clickables['Ktr-r-c1'].effect1)
        if(player.Ktr.solarPower[2].gte(1)) boost = boost.mul(tmp.Ktr.clickables['Ktr-r-c3'].effect1)
        if(player.Ktr.solarPower[4].gte(1)) boost = boost.mul(tmp.Ktr.clickables['Ktr-r-c5'].effect1)
        if(getBuyableAmount('Ktr','Ktr-s-d4').gte(1)) boost = boost.mul(buyableEffect('Ktr','Ktr-s-d4'))
        if(player.Ktr.ark.gte(30)) boost = boost.mul(5).mul(Decimal.pow(1.2,player.Ktr.ark.sub(30)))
        if(tmp.Ktr.memoryLevel.gte(75)) boost = boost.mul(10)
        return boost
    },
    celestialNext(){
        let next = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            next[i] = Decimal.pow(tmp.Ktr.celestialRoot[i],tmp.Ktr.celestialLevel[i].add(1)).sub(1)
        }
        return next
    },
    celestialProgress(){
        let progress = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            progress[i] = Decimal.div(player.Ktr.solarPower[i],tmp.Ktr.celestialNext[i]).mul(100)
        }
        return progress
    },
    celestialPerSec(){
        let persec = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            persec[i] = Decimal.div(tmp.Ktr.celestialGain[i],tmp.Ktr.celestialNext[i]).mul(100)
        }
        return persec
    },
    solarEnergy(){
        let gain = player.Ktr.stallar.pow(0.05).mul(tmp.Ktr.solarBoost[player.Ktr.solarLayer])
        if(player.Ktr.solarPower[0].gte(1))gain = gain.mul(tmp.Ktr.clickables['Ktr-r-c1'].effect1)
        if(player.Ktr.solarPower[2].gte(1))gain = gain.mul(tmp.Ktr.clickables['Ktr-r-c3'].effect1)
        if(player.Ktr.solarPower[4].gte(1))gain = gain.mul(tmp.Ktr.clickables['Ktr-r-c5'].effect1)
        if(getBuyableAmount('Ktr','Ktr-s-d4').gte(1)) gain = gain.mul(buyableEffect('Ktr','Ktr-s-d4'))
        if(getBuyableAmount('Ktr','Ktr-s-d5').gte(1)) gain = gain.mul(buyableEffect('Ktr','Ktr-s-d5'))
        if(player.Ktr.ark.gte(30)) gain = gain.mul(5).mul(Decimal.pow(1.2,player.Ktr.ark.sub(30)))
        if(tmp.Ktr.memoryLevel.gte(42)) gain = gain.mul(100)
        if(tmp.Ktr.memoryLevel.gte(75)) gain = gain.mul(10)
        if(hasAchievement('Ain','Hkm-14')) gain = gain.mul(buyableEffect('Hkm','Hkm-f3'))
        return gain
    },
    solarEff(){
        let eff = tmp.Ktr.solarEnergy.add(1).pow(0.5)
        if(player.Ktr.storyUnlocked >= 9) eff = eff.mul(player.Ktr.memoryCrystal.add(1).pow(2))
        return eff
    },
    arkEff(){
        let eff = Decimal.pow(n(2).add(player.Ktr.ark.gte(5)? buyableEffect('Ktr','Ktr-s-d2'):0),Decimal.pow(player.Ktr.ark,1.2))
        if(player.Ktr.remote) eff = eff.mul(tmp.Ktr.solarEff)
        return eff
    },
    gateEff(){
        let power = n(0.05)
        power = power.mul(player.Ktr.realTime.add(1).log10().min(4))
        if(layers.Ktr.buyables['Ktr-g-h2'].enabled() && player.Ktr.storyUnlocked >= 9) power = power.add(0.05)
        if(layers.Ktr.buyables['Ktr-g-h3'].enabled() && player.Ktr.storyUnlocked >= 9) power = power.mul(2)
        return power
    },
    antimatter(){
        if(hasMilestone('Hkm','Hkm-6')) return n(0)
        let antimatter = Decimal.pow(2,player.Ktr.universalTime.sub(10)).sub(1).max(0)
        return antimatter
    },
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "kether points", // Name of prestige currency
    baseResource: "essences", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    passiveGeneration(){return player.Ktr.ark.gte(2)? 1 : 0},
    ArkDescs: {
        2: "unlock red dwarf and gain 1 extra brown dwarf.",
        3: "gain a half of red dwarf and passive gain 100% kether points on reset.",
        4: "unlock orange dwarf.",
        5: "gain a half of red dwarf.",
        6: "unlock yellow dwarf.",
        7: "every brown dwarf also gives 0.05 extra yellow dwarves.",
        8: "keep brown & yellow dwarf on reset.",
        14: "unlock white dwarf.",
        22: "Unlock a row of new distant space upgrades. Reset for ark won't longer reset your stars.",
        31: "Boost all resource in remote space by ×5, and every ark after this increases this number by ×1.2.",
        99999: "???",
    },
    memoryBonus:{
        0:{
            desc:'Essence gain',
            effect(){return Decimal.pow(2,tmp.Ktr.memoryLevel)},
            start: n(1),
            prev: '×',
            color: "#FFFFFF"
        },
        1:{
            desc:'Kether points gain',
            effect(){
                let eff = Decimal.pow(n(1.6).add(tmp.Ktr.memoryLevel.lt(45) && tmp.Ktr.memoryLevel.gte(15)? 0.2 : 0),tmp.Ktr.memoryLevel.sub(2))
                if(tmp.Ktr.memoryLevel.gte(15)) eff = eff.pow(2)
                if(eff.gte(1e12)) softcap(eff,'root',n(1e12),3)
                return eff
            },
            start: n(3),
            prev: '×',
            color: "#FFFFFF"
        },
        2:{
            desc:'Kether points gain exp',
            effect(){return n(1.03)},
            start: n(7),
            prev: '^',
            color: "#FFFFFF"
        },
        3:{
            desc:'Essences gain exp',
            effect(){return n(1.02)},
            start: n(15),
            prev: '^',
            color: "#FFFFFF"
        },
        4:{
            desc:'Ktr-3 effect',
            effect(){return n(4)},
            start: n(25),
            prev: '^',
            color: "lightyellow"
        },
        5:{
            desc:'Stallar effect',
            effect(){return n(4.5)},
            start: n(50),
            prev: '^',
            color: "lightyellow"
        },
        6:{
            desc:'Base of Ktr-s-d4',
            effect(){return n(0.5)},
            start: n(65),
            prev: '+',
            color: "lavender"
        },
        7:{
            desc:'stallar effect',
            effect(){return n(4.5)},
            start: n(101),
            prev: '^',
            color: "lightyellow"
        },
    },
    storyContent: {
        1:{
            text(){ 
                let text = `<text style='color:#FFFFFF; font-size: 30px; text-shadow: 2px 2px 7px white'>My lifelong pursuit is the ultimate beauty of sensibility and the true knowledge of reason.</text><br>
	        	<text style='color:#FFFFFF; font-size: 30px; text-shadow: 2px 2px 7px white'>I want to stand at the highest point of the city and take another look at the Miracle Continent amidst the starry sky.
                I want to always remember its beautiful appearance.——Kether</text><br><br>
        		<text style='color: #999999'>[Illustration] In the year 680 of the lunar calendar, the Miracle Continent was destroyed. In order to change the fate of its destruction, Ain traveled to the Miracle Continent. Through repeated attempts and cycles, she have come to understand that her destiny is a constant repetition, but it can never change the fate of the Miracle Continent. In order to change this outcome, she pay the price of forgetting her predetermined destiny, summoning some of your consciousness into the spiritual world through the Heart Gate, rebuilding the order of the Kabalah Tree, and attempting to break the trajectory of her predetermined destiny—— Preface to Kabalah Incremental Tree</text><br>
		        <text style='color:magenta'>[Ain] Let me think again... I have traveled through time and space, back to the miraculous continent 680 years ago... I passed through a door, and there I met...</text><br>`
                if(player.Ktr.storyUnlocked < 1) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 1 kether point to continue.(Tips: Press the prestige button in the kether layer to gain kether points. You will lost all your essence you have.)</i>`
                if(player.Ktr.storyUnlocked >= 1) text += `
                <text style='color:magenta'>[Ain] You are the person I met at the Heart Gate, and we are in a state of conscious connection. You can see what happens on the Miracle Continent.</text><br>
                <text style='color:magenta'>[Ain] Perhaps because we all come from the same world, we can...</text><br>`
                return text
            }
        },
        2:{
            text(){ 
                let text = `<text style='color:#999999'>[Illustration] The scene presented to Ain was a strange city.</text><br>
                <text style='color:magenta'>[Ain] Crown Town Hospital, where is this?</text><br>
                <text style='color:magenta'>[Ain] There is a clothing store ahead, let's go and inquire about the situation in this world first.</text><br>
                <text style='color:#999999'>[Illustration] For some reason, Ain's mind suddenly flashed with a scene of a sea of stars.</text><br>
                <text style='color:#999999'>[Illustration] In that moment, she remembered a dream she had had when she was a child.</text><br>
                <text style='color:#999999'>[Illustration] When she was six years old, she once dreamed of a sea of stars.</text><br>
                <text style='color:#999999'>[Illustration] There is a stargazing platform on the sea, and a silent writer between the starry seas.</text><br>
                <text style='color:#999999'>[Illustration] The hood blocked his eyes, and he reached out his pen, pointing towards the starry sky. The stars seemed to be manipulated by him, moving out of their brilliant orbits.</text><br>
                <text style='color:white'>[Kether] This is the only answer, all galaxies are destined to be destroyed.</text><br>`
                if(player.Ktr.storyUnlocked == 1) text += `<br><br>
                <i style='color: #444444'>[Locked] Have at least 1 kether upgrade to continue. "Upgrade" is a tool can be bought by using Kether points, and boost your game production. It can only be bought once to become effective.</i>`
                if(player.Ktr.storyUnlocked >= 2) text += `
                <text style='color:#999999'>[Illustration] He doesn't seem to be talking to anyone, focusing on describing the picture in his heart.</text><br>
                <text style='color:white'>[Kether] I observed the only outcome, but left behind a small unpredictable factor. Will the outcome change as a result?</text><br>
                <text style='color:magenta'>[Ain lv.6] Who are you?</text><br>
                <text style='color:white'>[Kether] It is the person who endows you with destiny.</text><br>
                <text style='color:#999999'>[Illustration] For some reason, the memories in this dream suddenly became particularly clear.</text><br>
                <text style='color:#999999'>[Illustration] Ain had not yet recovered from his previous mood when many people suddenly entered the clothing store.</text><br>
                <text style='color:#999999'>[Illustration] But they were not shopping, they were directly surrounding Ain.</text><br>
                <text style='color:white'>[Kether-9718] This guest, you are...</text><br>
                <text style='color:white'>[Kether-19] The girl with long hair, is you? You looks so featureless... Of course, the one who possesses the power of Saphirah's Shadow.</text><br>
                <text style='color:#999999'>[Illustration] The door of the clothing store was closed, with two people standing at the entrance, not allowing anyone to enter.</text><br>
                <text style='color:#999999'>[Illustration] The sexy girl be numbered as Kether-19 is coming towards the power of Saphirah's shadow.</text><br>`
                return text
            }
        },
        3:{
            text(){ 
                let text = `<text style='color:magenta'>[Ain] I think you may have misunderstood something, I don't have this power.</text><br>
                <text style='color:white'>[Kether-19] Do you have it or not? Let's give it a try and we'll know!</text><br>
                <text style='color:#999999'>[Illustration] Kether-19 suddenly pulled Ain into [Battle of Recollection]!!</text><br>
                <text style='color:#999999'>[Illustration] This time, Ain felt a different state of mind than before, a deeper power was awakened, and a strange voice appeared in her heart.</text><br>
                <text style='color:white'>[Kether] What should you, who has lost your memory, use to fight?</text><br>`
                if(player.Ktr.storyUnlocked == 2) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 200,000 essences to continue. This may require much stronger upgrade effect.</i>`
                if(player.Ktr.storyUnlocked >= 3) text += `
                <text style='color:#999999'>[Illustration] The scene in front of Ain quickly twisted, and Ain found herself appearing among a sea of stars. Ain looked around in confusion, feeling so familiar.</text><br>
                <text style='color:magenta'>[Ain] Where is there?</text><br>
                <text style='color:white'>[Kether] Your mental world, the real battlefield of recollection battle.</text><br>
                <text style='color:white'>[Kether] The true battle of recollection is a competition between memories and emotions placed on essence, and the power of memories from within can influence the outcome of the battle. I am just a memory projection, not your teacher. Now, do you remember? The true power hidden in memory is the key to changing the battlefield.</text><br>
                <text style='color:#999999'>[Illustration] Ain returned to the Battle of Recollection, relying on his powerful memory to defeat the woman. After the Battle of Recollection, the starry sea dissipated and everything returned to tranquility, but the memories hidden in Ain's heart gradually became clear.</text><br>
                <text style='color:white'>[Kether-9718] The powerful power of memory can change a person's spiritual world, can we say Has Kether-19's spiritual world been altered? Is the rumor true?</text><br>
                <text style='color:#999999'>[Illustration] Ain murmured to herself, everything that was once beautiful will disappear into thin air, and civilization is like it has never existed before, leaving no trace. All of this is because...</text><br>
                <text style='color:#999999'>[Illustration] "The story of the Miracle Continent should come to an end." Kether stood in the distance, her silver hair stirred by the wind of the apocalypse, making the final judgment for the destruction of the Miracle Continent.</text><br>`
                return text
            }
        },
        4:{
            text(){ 
                let text = `<text style='color:magenta'>[Ain] No, this is not true. The Miracle Continent has been destroyed I actually witnessed its destruction with my own eyes.</text><br>`
                if(player.Ktr.storyUnlocked == 3) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 200 stallar points to continue. Create a giant gas planet to start collecting it.</i>`
                if(player.Ktr.storyUnlocked >= 4) text += `
                <text style='color:white'>[Kether] This world is plunged into conflict and chaos, and on a memory level, everyone is endowed with the ability to change the memories of others. Your desires are hidden in your heart, your dreams seem so unattainable, all because of your weakness. Come on, let me give you the power to change the situation.</text><br>
                <text style='color:#999999'>[Illustration] Ain's mind flashed with many memories, unwilling to lose more, unable to face fate anymore, and unwilling to accept the predetermined outcome!</text><br>
                <text style='color:#999999'>[Illustration] Kether's stargazing platform was parked in front of Ain, and the seawater seemed to follow Kether's guidance and surge up, blocking the sunlight from the sky.</text><br>
                <text style='color:magenta'>[Ain] It's you, Kether.</text><br>
                <text style='color:white'>[Kether] I told you before that Sephirah's Shadow is just a memory projection.</text><br>
                <text style='color:magenta'>[Ain] Sephirah's Shadow?</text><br>
                <text style='color:white'>[Kether] I exist based on your soul, I am just a memory drifting in an endless ocean of memories.</text><br>
                <text style='color:magenta'>[Ain] Why you selected me?</text><br>
                <text style='color:white'>[Kether] Fate has chosen you, I am just an observer of fate.</text><br>
                <text style='color:magenta'>[Ain] The observer of fate? It is you who manipulated the fate of the Miracle Continent, leading it towards destruction!</text><br>
                <text style='color:white'>[Kether] Why do you consider as that?</text><br>
                <text style='color:magenta'>[Ain] I saw it with my own eyes!</text><br>
                <text style='color:white'>[Kether] What you see is not true, go and search for the answer you want in my memory.</text><br>`
                if(player.Ktr.storyUnlocked == 4) text += `<br><br>
                <i style='color: #444444'>[Locked] Build 3 arks to continue. Everytime you build a ark you will lost all stars as well as stallar points.</i>`
                if(player.Ktr.storyUnlocked >= 5) text += `
                <text style='color:white'>[Kether] Are you saying that my calculation is incorrect?</text><br>
                <text style='color:magenta'>[Ain] I will not question your calculations. I am the insignificance in your mouth, and I cannot see the truth you speak in this starry sky; I am the stupidity in your mouth, and I will never compromise until the destruction is complete.</text><br>`
                return text
            }
        },
        5:{
            text(){ 
                let text = `<text style='color:magenta'>[Ain] You see all living beings as ants, and the joy of each day and the anticipation for tomorrow are short-lived things that all living beings will cherish.</text><br>
                <text style='color:white'>[Kether] But no matter what, destruction will eventually come.</text><br>
                <text style='color:magenta'>[Ain] I will go and change the future you have written about!</text><br>
                <text style='color:#999999'>[Illustration] On the distant skyline, white appears, and the rising stars rise high.</text><br>
                <text style='color:magenta'>[Ain] This is the fate you have chosen for me. You want me to break it, don't you? Teacher, thank you for telling me this. I'm leaving now.</text><br>
                <text style='color:white'>[Kether] In this era, you are like a gravel thrown into boundless seawater. I can't see whether you will stir up a vortex or be silently swallowed up.</text><br>
                <text style='color:#999999'>[Illustration] The ocean and the stars fade away, interweaving into Ain's clothes. Shake off the stars, clothes designed by Kether.</text><br>
                <text style='color:white'>[Kether] Use its power to leave the starry sea.</text><br>
                <text style='color:#999999'>[Illustration] The stars shake off, the tide fades, and the first ray of morning sunlight shines on Ain's sleeping face. Eyelashes twitched slightly, and Ain opened his eyes.</text><br>
                <text style='color:#999999'>[Illustration] In the world of starry seas, the stargazing platform is still floating, and the starry seas have not disappeared, but Ain cannot see this scene anymore.</text><br>
                <text style='color:white'>[Kether] The orbits of stars are independent of each other, and the appearance of interlocking is just an illusion of a certain angle. Each orbit is the fate of a world.</text><br>
                <text style='color:white'>[Kether] Are you looking for her? She has already returned to the real world.</text><br>`
                if(player.Ktr.storyUnlocked == 5) text += `<br><br>
                <i style='color: #444444'>[Locked] Let the ark reach the distant space to continue. Maybe you need more ark fuel.</i>`
                if(player.Ktr.storyUnlocked >= 6) text += `
                <text style='color:#999999'>[Illustration] Kether seems to be talking to herself, but you think this man can feel your presence.</text><br>
                <text style='color:pink'>[You] Are you saying to me?</text><br>
                <text style='color:#999999'>[Illustration] Kether didn't answer you. He put down his pen and countless star tracks slid behind him, silently falling onto the sea of stars.</text><br>
                <text style='color:white'>[Kether] I chose her, she will be the unknown of fate, perhaps able to break the predetermined fate of the Miracle Continent. She chose you to break her destiny. But in order to establish a connection with the Heart Gate, she paid the price and forgot what her fate was.</text><br>`
                return text
            }
        },
        6:{
            text(){ 
                let text = `<text style='color:pink'>[You] What is Ain's fate?</text><br>
                <text style='color:white'>[Kether] No matter how many attempts, no matter the cost, nothing can be changed. This is her fate, but she chose you.</text><br>
                <text style='color:#999999'>[Illustration] Kether reached out her hand as if touching an invisible "wall", causing ripples to form on the wall. Silver white borders gradually appeared around the wall, interspersed with crystals like stars. It was a mirror, and Kether was inside the mirror.</text><br>
                <text style='color:pink'>[You] You haven't told me yet, how can I leave here?</text><br>
                <text style='color:white'>[Kether] Through the mirror, your consciousness can reconnect with her spiritual world.</text><br>
                <text style='color:#999999'>[Illustration] Kether disappeared from the mirror, and the world in the mirror also changed. The sky and ocean still existed, and the stars gradually dimmed until they disappeared.</text><br>
                <text style='color:pink'>[You] Is it me in the mirror, or am I seeing the mirror?</text><br>
                <text style='color:white'>[Kether] Why not have a try?</text><br>
                <text style='color:#999999'>[Illustration] You walked through the mirror, and a brand new world appeared before my eyes.</text><br>`
                if(player.Ktr.storyUnlocked == 6) text += `<br><br>
                <i style='color: #444444'>[Locked] Let the ark reach the remote space to continue. Maybe you need more stallar points.</i>`
                if(player.Ktr.storyUnlocked >= 7) text += `
                <text style='color:#999999'>[Illustration] On the vast and calm sea surface, various magical buildings float: a serene garden, a museum like building, and a clock tower with dials and clocks separated. The tracks of a train connect these buildings like chains.</text><br>
                <text style='color:pink'>[You] Is this what Kether called the ark that carries all the memories of civilization? What's going on? Aren't we in a world of stars? After waking up from that dream in the starry sea, everything returned to normal. I wanted to know what connection Saphirah's Shadow had with Kether, so I went back to the ark first.</text><br>
                <text style='color:magenta'>[Ain] I forgot that you haven't come here yet. This is the sea of memories in the distant and deep sky, the ocean of human memory, connecting different worlds and consciousness. The Ark manages the Sea of Memory, and after the destruction of the Miracle Continent, I came to the Ark. By relying on the ark, I can cross back and thus connect with your consciousness.</text><br>
                <text style='color:white'>[Kether-7] Ain? Fallen_ Cat? You all have returned!</text><br>
                <text style='color:white'>[Kether-7] Wow, Fallen_ Cat, you are still so soft~</text><br>`
                return text
            }
        },
        7:{
            text(){ 
                let text = `<text style='color:#999999'>[Illustration] The little girl hugged you tightly and refused to let go. You are struggling hard.</text><br>
                <text style='color:pink'>[You] Well, Ain, introduce her?</text><br>`
                if(player.Ktr.storyUnlocked == 7) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock all distant space upgrade to continue. That means getting at least 21 arks.</i>`
                if(player.Ktr.storyUnlocked >= 8) text += `
                <text style='color:magenta'>[Ain] Ktr-7, one of the ark administrators, also has an administrator named Ktr-2, who is Ktr-7's brother. The numbers represent the strength ranking of their Saphirah Shadow power in the Kether field.</text><br>
                <text style='color:#999999'>[Illustration] At this moment, a powerful palm lifted the Ktr-7 and it struggled vigorously in the air.</text><br>
                <text style='color:white'>[Kether-2] Don't cause trouble, Ktr-7.</text><br>
                <text style='color:white'>[Kether-7] I didn't cause any trouble! Let me down, brother!</text><br>
                <text style='color:#999999'>[Illustration] You observed the man behind Ktr-7 and it seemed that he was Ktr-7's brother, another administrator of the ark, Ktr-2.</text><br>
                <text style='color:white'>[Kether-2] Ain, I just took you to the Sephirah Shadow Museum, where all Sephirah shadows are stored in a mirror. The power you used in the battle before was the Sephirah Shadow, it seems that you can summon the Sephirah Shadow.</text><br>`
                if(player.Ktr.storyUnlocked == 8) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock The Kether's Heart Gate to unlock. This is the ultimate challenge of Kether layer.</i>`
                if(player.Ktr.storyUnlocked >= 9) text += `
                <text style='color:white'>[Kether-2] I have found some new clues about Kether, and I will let you know once I have sorted them out.</text><br>
                <text style='color:magenta'>[Ain] Thank you, Ktr-2.</text><br>
                <text style='color:white'>[Kether-2] It's okay, I was already looking for something about Kether.</text><br>
                <text style='color:#999999'>[Illustration] Ain had no intention of staying in the ark anymore and decided to leave with you first. Kether-2 then took Ain and you to the Heart Gate to return. The gate of the heart is located in the center of the ark, and the core of the ark's operation, the "Ark's Heart," is located below the gate of the heart.</text><br>
                <text style='color:white'>[Kether-2] Are you ready, Ain?</text><br>
                <text style='color:magenta'>[Ain] I'm ready.</text><br>
                <text style='color:magenta'>[Ain] Let's go, together we can definitely change the future of the world, using our own matching power to cross the door of the heart.</text><br>`
                return text
            }
        },
    },
    infoboxes: {
        'Ktr-i1': {
            title: "Recollection Waves",
            body() { 
                player.Ktr.content = ''
                for(var i = 0; i <= 999; i++){
                    if(tmp.Ktr.memoryLevel.gte(layers.Ktr.memoryBonus[i].start)) player.Ktr.content += "["+i+"]"+layers.Ktr.memoryBonus[i].desc+" "+quickBigColor(layers.Ktr.memoryBonus[i].prev+format(layers.Ktr.memoryBonus[i].effect()),layers.Ktr.memoryBonus[i].color)+"<br>"
                    else {
                        player.Ktr.content += quickColor('Get '+formatWhole(layers.Ktr.memoryBonus[i].start.sub(tmp.Ktr.memoryLevel))+' more recollection dipth to unlock a new wave!','gray')
                        break
                    }
                }
                return player.Ktr.content
            },
        },
    },
    clickables:{
        'Ktr-s1':{
            title() {return "<h4>Absorb Energy<br>"},
            gain() {
                let gain = n(1)
                if(player.Ktr.ark.gte(1)) gain = gain.mul(tmp.Ktr.arkEff)
                gain = gain.mul(buyableEffect('Ktr','Ktr-s1'))
                if(player.Ktr.ark.gte(1)) gain = gain.mul(layers.Ktr.buyables['Ktr','Ktr-s3'].effect())
                if(tmp.Ktr.memoryLevel.lt(42) && tmp.Ktr.memoryLevel.gte(15) && !hasAchievement('Ain','Hkm-4')) gain = gain.div(100)
                if(tmp.Ktr.memoryLevel.gte(42)) gain = gain.mul(100)
                if(tmp.Ktr.memoryLevel.gte(75)) gain = gain.mul(1000)
                if(player.Ktr.activeChallenge == 'Ktr-g1') gain = gain.pow(tmp.Ktr.gateEff)
                if(player.Ktr.storyUnlocked >= 9 || hasMilestone('Hkm','Hkm-6')) gain = gain.mul(player.Ktr.timeWrap)
                if(hasMilestone('Hkm','Hkm-1')) gain = gain.mul(tmp.Hkm.effect)
                if(tmp.Ktr.antimatter.gt(player.Ktr.stallar)) gain = n(0)
                return gain
            },
            display() {return "Absorb some stallar energy from your stallars.<br>+"+formatWhole(this.gain())+' stallar points until '+format(player.Ktr.stallarFreeze)+' sec'},
            canClick() {return player.Ktr.stallarFreeze.lte(0)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px Moccasin', 'background-color':'lightyellow', 'color':'black', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'lightyellow'}
            },
            onClick() {
                player.Ktr.stallarFreeze = tmp.Ktr.stallarFreezeLimit 
                player.Ktr.stallar = player.Ktr.stallar.add(this.gain())
            },
        },
        'Ktr-a1':{
            title() {return "<h4>Build +1 Ark<br>"},
            display() {return "Reset your stars and stallar points, but build a new ark, and gain some fuel as well.<br>"+"in ark "+getBonusDesc()+"<br>"+formatWhole(player.Ktr.ark.add(1))+" fuel"},
            canClick() {return player.Ktr.stallar.gte(tmp.Ktr.arkFullReq)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px white', 'background': `repeating-linear-gradient(90deg, white 0, white 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'white'}
            },
            onClick() {
                player.Ktr.ark = player.Ktr.ark.add(1)
                player.Ktr.fuel = player.Ktr.fuel.add(player.Ktr.ark)
                player.Ktr.totalFuel = player.Ktr.totalFuel.add(player.Ktr.ark)
                if(player.Ktr.ark.lt(21)) for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
            },
        },
        'Ktr-a2':{
            title() {return "Travel into distant space"},
            display() {return "Requires 15 ark fuel. Unlock distant space upgrades."},
            canClick() {return player.Ktr.fuel.gte(15)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender', 'background': `repeating-linear-gradient(90deg, lavender 0, lavender 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                player.Ktr.distant = true
            },
            unlocked(){return !player.Ktr.distant}
        },
        'Ktr-a3':{
            title() {return "Respec"},
            display() {return "Respec distant space upgrades and take back all fuel."},
            canClick() {return true},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender', 'background': `repeating-linear-gradient(90deg, lavender 0, lavender 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s-d'+i,n(0))
                }
                player.Ktr.fuel = player.Ktr.totalFuel
                for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
                player.Ktr.respeced = true
            },
            unlocked(){return player.Ktr.distant}
        },
        'Ktr-a4':{
            title() {return "Travel into remote space"},
            display() {return "Requires 2e42 stallar points. Unlock a new tab."},
            canClick() {return player.Ktr.stallar.gte(2e42)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender', 'background': `repeating-linear-gradient(90deg, lavender 0, lavender 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                player.Ktr.remote = true
            },
            unlocked(){return player.Ktr.distant && !player.Ktr.remote}
        },
        'Ktr-r1':{
            title() {return "Transition to the cosmic level "+tmp.Ktr.solarLayer[player.Ktr.solarLayer+1]},
            display() {return "<br>Requires "+format(tmp.Ktr.solarReq[player.Ktr.solarLayer])+" stallar points. Unlock some new Celestials."},
            canClick() {return player.Ktr.stallar.gte(tmp.Ktr.solarReq[player.Ktr.solarLayer])},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset '+tmp.Ktr.solarColor[player.Ktr.solarLayer+1],'background-color':`black`, 'color':'white', 'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':tmp.Ktr.solarColor[player.Ktr.solarLayer+1]}
                else return {'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                player.Ktr.solarLayer+=1
            },
        },
        'Ktr-r-c1':{
            title() {return "[Ktr-r-c1] Neutron Star Lv."+tmp.Ktr.celestialLevel[0]},
            display() {return format(tmp.Ktr.celestialProgress[0])+'% to next level'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(1.4,tmp.Ktr.celestialLevel[0])
                if(eff.gte(20000)) eff = softcap(eff,'root',n(20000),2.5)
                return eff
            },
            effect2(){
                let eff = Decimal.pow(2,tmp.Ktr.celestialLevel[0].sqrt())
                if(eff.gte(50)) eff = softcap(eff,'root',n(50),1.5)
                return eff
            },
            onHold(){
                player.Ktr.solarPower[0] = player.Ktr.solarPower[0].add(tmp.Ktr.celestialGain[0].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 1},
            tooltip() {return quickBackgColor2("[Mass] 22 Msun<br>[Temp.] 900000K",'#c999ff')+'<br><br>Boost solar energy gain and generate extra red dwarf.<br>Effect1: ×'+format(this.effect1())+"<br>Effect2: +"+format(this.effect2())+"<br>Hold and gain "+format(tmp.Ktr.celestialPerSec[0])+"% neutron energy per second."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #c999ff','background':`linear-gradient(to right,#c999ff ${format(tmp.Ktr.celestialProgress[0].min(100))}%,black ${format(tmp.Ktr.celestialProgress[0].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#c999ff'}
            },
        },
        'Ktr-r-c2':{
            title() {return "[Ktr-r-c2] Electroweak star Lv."+tmp.Ktr.celestialLevel[1]},
            display() {return format(tmp.Ktr.celestialProgress[1])+'% to next level'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(666,tmp.Ktr.celestialLevel[1])
                if(getBuyableAmount('Ktr','Ktr-s-d6').gte(1)) eff = eff.pow(buyableEffect('Ktr','Ktr-s-d6'))
                if(eff.gte(1e20)) eff = softcap(eff,'root',n(1e20),4)
                return eff
            },
            onHold(){
                player.Ktr.solarPower[1] = player.Ktr.solarPower[1].add(tmp.Ktr.celestialGain[1].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 1},
            tooltip() {return quickBackgColor2("[Mass] Undefined Msun<br>[Temp.] 2e16K",'#c999ff')+'<br><br>Lower the requirement of next ark.<br>Effect: /'+format(this.effect1())+"<br>Hold and gain "+format(tmp.Ktr.celestialPerSec[1])+"% electroweak energy per second."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #c999ff','background':`linear-gradient(to right,#c999ff ${format(tmp.Ktr.celestialProgress[1].min(100))}%,black ${format(tmp.Ktr.celestialProgress[1].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#c999ff'}
            },
        },
        'Ktr-r-c3':{
            title() {return "[Ktr-r-c3] Quasi-Star Lv."+tmp.Ktr.celestialLevel[2]},
            display() {return format(tmp.Ktr.celestialProgress[2])+'% to next level'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(1.9,tmp.Ktr.celestialLevel[2])
                if(eff.gte(200)) eff = softcap(eff,'root',n(200),1.5)
                return eff
            },
            effect2(){
                let eff = Decimal.pow(2,tmp.Ktr.celestialLevel[2].root(3))
                return eff
            },
            onHold(){
                player.Ktr.solarPower[2] = player.Ktr.solarPower[2].add(tmp.Ktr.celestialGain[2].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 2},
            tooltip() {return quickBackgColor("[Mass] 1000 Msun<br>[Temp.] 100000K",'#8619ff')+'<br><br>Boost solar energy gain and generate extra orange dwarf.<br>Effect1: ×'+format(this.effect1())+"<br>Effect2: +"+format(this.effect2())+"<br>Hold and gain "+format(tmp.Ktr.celestialPerSec[2])+"% quasi-star energy per second."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #8619ff','background':`linear-gradient(to right,#8619ff ${format(tmp.Ktr.celestialProgress[2].min(100))}%,black ${format(tmp.Ktr.celestialProgress[2].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#8619ff'}
            },
        },
        'Ktr-r-c4':{
            title() {return "[Ktr-r-c4] Preon stars Lv."+tmp.Ktr.celestialLevel[3]},
            display() {return format(tmp.Ktr.celestialProgress[3])+'% to next level'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.mul(5,tmp.Ktr.celestialLevel[3])
                return eff
            },
            onHold(){
                player.Ktr.solarPower[3] = player.Ktr.solarPower[3].add(tmp.Ktr.celestialGain[3].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 2},
            tooltip() {return quickBackgColor("[Mass] Nearly Infinity Msun<br>[Temp.] 1e14K",'#8619ff')+'<br><br>Lower the cost of Ktr-s-d4 and Ktr-s-d5.<br>Effect: -'+format(this.effect1())+"<br>Hold and gain "+format(tmp.Ktr.celestialPerSec[3])+"% preon energy per second."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #8619ff','background':`linear-gradient(to right,#8619ff ${format(tmp.Ktr.celestialProgress[3].min(100))}%,black ${format(tmp.Ktr.celestialProgress[3].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#8619ff'}
            },
        },
        'Ktr-r-c5':{
            title() {return "[Ktr-r-c5] Ton-618 Black Hole Lv."+tmp.Ktr.celestialLevel[4]},
            display() {return format(tmp.Ktr.celestialProgress[4])+'% to next level'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(2.6,tmp.Ktr.celestialLevel[4])
                if(eff.gte(1000)) eff = softcap(eff,'root',n(1000),2)
                return eff
            },
            effect2(){
                let eff = Decimal.pow(2,tmp.Ktr.celestialLevel[4].root(5))
                return eff
            },
            onHold(){
                player.Ktr.solarPower[4] = player.Ktr.solarPower[4].add(tmp.Ktr.celestialGain[4].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 3},
            tooltip() {return quickBackgColor("[Mass] 6e10 Msun<br>[Temp.] -273.15K",'#480099')+'<br><br>Boost solar energy gain and generate extra yellow dwarf.<br>Effect1: ×'+format(this.effect1())+"<br>Effect2: +"+format(this.effect2())+"<br>Hold and gain "+format(tmp.Ktr.celestialPerSec[4])+"% black hole-energy per second."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #480099','background':`linear-gradient(to right,#480099 ${format(tmp.Ktr.celestialProgress[4].min(100))}%,black ${format(tmp.Ktr.celestialProgress[4].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#480099'}
            },
        },
        'Ktr-g1k':{
            title() {return "Time ×1k"},
            canClick() {return player.Ktr.timeWrap != 1000 && player.Ktr.activeChallenge != 'Ktr-g1'},
            style(){
                if(player.Ktr.timeWrap != 1000) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px dodgerblue', 'background-color':'dodgerblue', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'dodgerblue'}
            },
            onClick() {
                player.Ktr.timeWrap = n(1000)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e10)}
        },
        'Ktr-g10':{
            title() {return "Time ×10"},
            canClick() {return player.Ktr.timeWrap != 10 && player.Ktr.activeChallenge != 'Ktr-g1'},
            style(){
                if(player.Ktr.timeWrap != 10) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px deepskyblue', 'background-color':'deepskyblue', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'deepskyblue'}
            },
            onClick() {
                player.Ktr.timeWrap = n(10)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e6)}
        },
        'Ktr-g2':{
            title() {return "Time ×2"},
            canClick() {return player.Ktr.timeWrap != 2 && player.Ktr.activeChallenge != 'Ktr-g1'},
            style(){
                if(player.Ktr.timeWrap != 2) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px skyblue', 'background-color':'skyblue', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'skyblue'}
            },
            onClick() {
                player.Ktr.timeWrap = n(2)
            },
        },
        'Ktr-g1':{
            title() {return "Time ×1"},
            canClick() {return player.Ktr.timeWrap != 1},
            style(){
                if(player.Ktr.timeWrap != 1) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px white', 'background-color':'white', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'white'}
            },
            onClick() {
                player.Ktr.timeWrap = n(1)
            },
        },
        'Ktr-g1/2':{
            title() {return "Time ×1/2"},
            canClick() {return player.Ktr.timeWrap != 0.5},
            style(){
                if(player.Ktr.timeWrap != 0.5) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #ffcece', 'background-color':'#ffcece', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'#ffcece'}
            },
            onClick() {
                player.Ktr.timeWrap = n(0.5)
            },
        },
        'Ktr-g1/4':{
            title() {return "Time ×1/4"},
            canClick() {return player.Ktr.timeWrap != 0.25},
            style(){
                if(player.Ktr.timeWrap != 0.25) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #FA8072', 'background-color':'#FA8072', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'#FA8072'}
            },
            onClick() {
                player.Ktr.timeWrap = n(0.25)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e6)}
        },
        'Ktr-g1/8':{
            title() {return "Time ×1/8"},
            canClick() {return player.Ktr.timeWrap != 0.125},
            style(){
                if(player.Ktr.timeWrap != 0.125) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px red', 'background-color':'red', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'red'}
            },
            onClick() {
                player.Ktr.timeWrap = n(0.125)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e10)}
        },
    },
    buyables:{
        'Ktr-s3': {
            title() {return '<h3>[Ktr-s3] Red Dwarf<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[Mass] 90 Mjupitar<br>[Temp.] 2500K","#FF0000")+'<br><br>Multiply stallar points gain again.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ×"+formatWhole(this.effect())+"<br>Cost: "+format(this.cost())+" Stallar points"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(3, new Decimal(x).pow(1.8)).mul(200).floor() 
		        if(x>10) cost = cost.mul(Decimal.pow(1e3,Decimal.pow(x-10,3)))
                if(getBuyableAmount('Ktr','Ktr-s6').gte(1)) cost = cost.pow(buyableEffect('Ktr','Ktr-s6'))
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(1)},
            effect(x){
                let amount = n(x).add(player.Ktr.ark.gte(2)? 0.5 : 0).add(player.Ktr.ark.gte(5)? 0.5 : 0).add(player.Ktr.ark.gte(5)? buyableEffect('Ktr','Ktr-s-d3'):0).add(hasUpgrade('Ktr','Ktr-12')? 1 : 0).add(player.Ktr.solarPower[0].gte(1)? tmp.Ktr.clickables['Ktr-r-c1'].effect2 : 0)
                let eff = Decimal.pow(n(3).add(player.Ktr.ark.gte(4)?buyableEffect('Ktr','Ktr-s4'):0),amount)
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#CC0000,#EE0000 20px,#CC0000 50px,#EE0000 80px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 2px 2px red' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'red','margin-left':'5px'}
            },
        },
        'Ktr-m1': {
            title() {return '<h3>[Ktr-m1] The Poetry of Time<br>'},
            display() {return 'Add 25 to the progress for the recollection of Kether.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Cost: "+format(this.cost())+" Kether points"},
            canAfford() {return player.Ktr.points.gte(this.cost())&&tmp.Ktr.memoryLevel.lt(100)},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.05))
                return cost
            },
            buy(){
                if(!hasMilestone('Hkm','Hkm-4')) player.Ktr.points = player.Ktr.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'silver', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px #ffffff'}
            }
        },
        'Ktr-m2': {
            title() {return '<h3>[Ktr-m2] The Track of Memory<br>'},
            display() {return 'Add 50 to the progress for the recollection of Kether.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Cost: "+format(this.cost())+" Stallar points"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())&&tmp.Ktr.memoryLevel.lt(100)},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.05))
                return cost
            },
            buy(){
                if(!hasMilestone('Hkm','Hkm-4')) player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'PowderBlue'}}
                else return {'background-color':'PowderBlue ', 'color':'black','border-color':'PowderBlue ','box-shadow':'inset 3px 3px 3px #aabbaa,0px 0px 10px #ffffff'}
            }
        },
        'Ktr-m3': {
            title() {return '<h3>[Ktr-m3] Journey Through Time<br>'},
            display() {return 'Add 200 to the progress for the recollection of Kether.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Cost: "+format(this.cost())+" Arks"},
            canAfford() {return player.Ktr.ark.gte(this.cost())&&tmp.Ktr.memoryLevel.lt(100)},
            cost(x){
                let cost = n(x).add(1)
                if(tmp.Ktr.memoryLevel.gte(42)) cost = cost.sub(10).max(0)
                return cost
            },
            buy(){
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'Moccasin'}}
                else return {'background-color':'Moccasin', 'color':'black','border-color':'Moccasin','box-shadow':'inset 3px 3px 3px #ffffdd,0px 0px 10px #ffffff'}
            }
        },
        'Ktr-sta': {
            title() {if(tmp.Ktr.memoryLevel.lt(15)) return "<h3>Kether's Status: Awaken<br>"
        else if(tmp.Ktr.memoryLevel.lt(42)) return "<h3>Kether's Status: Impression cultivation<br>"
        else if(tmp.Ktr.memoryLevel.lt(75)) return "<h3>Kether's Status: Impression fusion<br>"
        else if(tmp.Ktr.memoryLevel.lt(100)) return "<h3>Kether's Status: True self recovery<br>"
        else return "<h3>Kether's Status: True self sublimation<br>"},
            display() {if(tmp.Ktr.memoryLevel.lt(15)) return '<h2>Nothing special. (Tips: Reach dipth 15, 42, 75 will change the strength of wave effects SIGNIFICANTLY!)'
            else if(tmp.Ktr.memoryLevel.lt(42)) return '<h2>Raise recollection wave 1 to ^2 and improve its formula, but divide stallar gain by /100<br>Click to reset Kether’s memory.'
            else if(tmp.Ktr.memoryLevel.lt(75)) return '<h2>Boost stallar and solar power gain by 100×(Uneffected by the 1st softcap), and lower the requirement of Ktr-m3.<br>Click to reset Kether’s memory.'
            else if(tmp.Ktr.memoryLevel.lt(100)) return '<h2>Boost stallar gain by 1000×, and boost all resource in remote space gain by 10×.<br>Click to reset Kether’s memory.'
            else return '<h2>The passage of the Heart Gate has been opened.<br>It‘s the time to rewrite the story of Miracle Continent.'},
            canAfford() {return tmp.Ktr.memoryLevel.gte(15)},
            buy(){
                setBuyableAmount('Ktr','Ktr-m1',n(0))
                setBuyableAmount('Ktr','Ktr-m2',n(0))
                setBuyableAmount('Ktr','Ktr-m3',n(0))
                player.Ktr.resetedMemory = true
            }
        },
        'Ktr-s1': {
            title() {return '<h3>[Ktr-s1] Giant gas planet<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[Mass] >0.6 Mjupitar<br>[Temp.] 200K","#775500")+'<br><br>Multiply stallar points gain.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ×"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Kether points"},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(3,x)).mul(n(x).add(1))
                return cost
            },
            effect(x){
                if(!hasUpgrade('Ktr','Ktr-13')) eff = n(x).add(hasUpgrade('Ktr','Ktr-11')? 1 : 0)
                if(hasUpgrade('Ktr','Ktr-13')) eff = Decimal.pow(2,Decimal.add(x,1))
                return eff
            },
            buy(){
                player.Ktr.points = player.Ktr.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-linear-gradient(0deg,#663300,#885500 20px,#775500 20px,#663300 40px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#775500','margin-left':'5px'}
            },
        },
        'Ktr-s2': {
            title() {return '<h3>[Ktr-s2] Brown Dwarf<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[Mass] 20 Mjupitar<br>[Temp.] 1000K","#AA5500")+'<br><br>Cut stallar absorbing interval into half.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: /"+formatWhole(this.effect())+"<br>Cost: "+format(this.cost())+" Stallar points"},
            canAfford() {return player.Ktr.stallar.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(200)},
            cost(x){
                let cost = Decimal.pow(n(1.8), new Decimal(x).pow(1.5)).mul(10).floor()
                return cost
            },
            effect(x){
                let eff = Decimal.pow(2,n(x).add(player.Ktr.ark.gte(1)? 1 : 0))
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#995500,#AA5500 20px,#AA5500 50px,#884400 80px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 1px 1px #AA5500' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#AA5500','margin-left':'5px'}
            },
        },
        'Ktr-s4': {
            title() {return '<h3>[Ktr-s4] Orange Dwarf<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[Mass] 0.4 Msun<br>[Temp.] 4000K","#FF8800")+'<br><br>Add to the base of red dwarf.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: +"+formatWhole(this.effect())+"<br>Cost: "+format(this.cost())+" Stallar points"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(6, new Decimal(3).pow(x)).mul(6666).floor()
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(3)},
            effect(x){
                let eff = n(x).add(player.Ktr.solarPower[2].gte(1)? tmp.Ktr.clickables['Ktr-r-c3'].effect2 : 0)
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#CC7700,#EE8800 20px,#CC7700 50px,#EE8800 80px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+3)+'px orange' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'orange','margin-left':'5px'}
            },
        },
        'Ktr-s5': {
            title() {return '<h3>[Ktr-s5] Yellow Dwarf<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor2("[Mass] 0.92 Msun<br>[Temp.] 5500K","#FFFF00")+'<br><br>Automally absorb energy from your stars.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: "+formatWhole(this.effect())+" / sec<br>Cost: "+format(this.cost())+" Stallar points"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(3, new Decimal(3).pow(x)).times(1e7).floor()
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(5)},
            effect(x){
                let eff = Decimal.pow(n(4).add(getBuyableAmount('Ktr','Ktr-s-d1').gte(1)? buyableEffect('Ktr','Ktr-s-d1') : 0), n(x).add(player.Ktr.ark.gte(6)? getBuyableAmount('Ktr','Ktr-s1').mul(0.05):0).add(hasMilestone('Hkm','Hkm-1')? 1 : 0)).sub(1)
                if(hasUpgrade('Ktr','Ktr-15')) eff = eff.pow(3)
                if(player.Ktr.remote) eff = eff.mul(tmp.Ktr.solarEff.sqrt())
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#DDDD00,#EEEE00 20px,#DDDD00 50px,#EEEE00 80px)', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+4)+'px yellow' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'yellow','margin-left':'5px'}
            },
        },
        'Ktr-s6': {
            title() {return '<h3>[Ktr-s6] White Dwarf<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor2("[Mass] 1.6 Msun<br>[Temp.] 7000K","#FFFFFF")+'<br><br>Decrease the cost scale of red dwarf.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ^"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Stallar points"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(2, new Decimal(2.8).pow(x)).mul(1e27).floor()
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(13)},
            effect(x){
                let eff = n(10).sub(new Decimal(x).add(1).log(2)).div(10).min(7)
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#DDDDDD,#EEEEEE 20px,#DDDDDD 50px,#EEEEEE 80px)', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px white' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'white','margin-left':'5px'}
            },
        },
        'Ktr-s-d1': {
            title() {return '<h3>[Ktr-s-d1] Perseus Arm<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return 'Add .3 to the base of yellow dwarf.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: +"+format(this.effect())+"<br>Cost: "+formatWhole(this.cost())+" Ark fuel"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                let cost = n(x).div(2).plus(1).pow(2).floor()
                return cost
            },
            unlocked(){return player.Ktr.distant},
            effect(x){
                let eff = Decimal.mul(0.3,n(x))
                return eff
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'lavender', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'lavender','margin-left':'5px'}
            },
        },
        'Ktr-s-d2': {
            title() {return '<h3>[Ktr-s-d2] Orion arm<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return 'Add .2 to the base of ark effect.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: +"+format(this.effect())+"<br>Cost: "+formatWhole(this.cost())+" Ark fuel"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                let cost = n(x).div(1.2).plus(1).pow(2).floor()
                return cost
            },
            unlocked(){return player.Ktr.distant},
            effect(x){
                let eff = Decimal.mul(0.2,x)
                return eff
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'lavender', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'lavender','margin-left':'5px'}
            },
        },
        'Ktr-s-d3': {
            title() {return '<h3>[Ktr-s-d3] Centaurus arm<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return 'Each brown dwarf provide .03 extra red dwarf.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: +"+format(this.effect())+"<br>Cost: "+formatWhole(this.cost())+" Ark fuel"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                if(x<5) return n(x).mul(2).plus(1).pow(2).floor() 
		        if(x==5) return new Decimal(1e9999)
            },
            unlocked(){return player.Ktr.distant},
            effect(x){
                let eff = Decimal.mul(0.03,x).mul(getBuyableAmount('Ktr','Ktr-s2'))
                return eff
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'lavender', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'lavender','margin-left':'5px'}
            },
        },
        'Ktr-s-d4': {
            title() {return '<h3>[Ktr-s-d4] Andromeda Galaxy<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return 'Boost all resource gain in the tab [Remote Space].<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ×"+format(this.effect())+"<br>Cost: "+formatWhole(this.cost())+" Ark fuel"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                return n(x).mul(1.8).plus(1).pow(2).sub(player.Ktr.solarPower[3].gte(1)? tmp.Ktr.clickables['Ktr-r-c4'].effect1 : 0).floor().max(0)
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.pow(n(1.5).add(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[6].start)? 0.5 : 0),x)
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': '#c999ff', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #c999ff' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#c999ff','margin-left':'5px'}
            },
        },
        'Ktr-s-d5': {
            title() {return '<h3>[Ktr-s-d5] NGC 2068<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return 'Boost solar energy gain.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ×"+format(this.effect())+"<br>Cost: "+formatWhole(this.cost())+" Ark fuel"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                return n(x).mul(1.4).plus(1).pow(2).sub(player.Ktr.solarPower[3].gte(1)? tmp.Ktr.clickables['Ktr-r-c4'].effect1 : 0).floor().max(0)
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.pow(2,x)
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': '#c999ff', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #c999ff' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#c999ff','margin-left':'5px'}
            },
        },
        'Ktr-s-d6': {
            title() {return '<h3>[Ktr-s-d6] NGC 4486<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return 'Raise the effect of electroweak star to a power.<br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ^"+format(this.effect())+"<br>Cost: "+formatWhole(this.cost())+" Ark fuel"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                return n(x).mul(1.8).plus(1).pow(2).floor()
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.add(1,x.add(1).log(4))
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': '#c999ff', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #c999ff' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#c999ff','margin-left':'5px'}
            },
        },
        'Ktr-g-h1': {
            title() {return "<h3>[i] Sea of Mystery "+(this.enabled()? quickColor('(Stable)','green'):quickColor('(Disrupted)','red'))},
            display() {let dis = '<h2>[Kether] The ultimate beauty of truth is achieved through constantly overcoming oneself in every failure and reflection. If every time you enter the Heart Gate, the result is at least 7 times better than the previous one, I think you have achieved this.'
            if(!this.enabled()) {if(player.Ktr.realTime.lt(300)) dis += '<br><br>'+quickColor('Reach 300s of reality time to discover more.','grey')
            else dis += '<br><br>'+quickColor('Every time you exit the Heart Gate, you need to obtain at least 7 times the memory crystal obtained from the last exit for 3 times in a row to stabilize it.','red')}
            else dis += '<br><br>'+quickColor('Memory Crystal gain rate ×20','green')
            return dis
            },
            enabled() {return this.unlocked() && (player.Ktr.gate1 >= 3 || hasMilestone('Hkm','Hkm-1'))},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9}
        },
        'Ktr-g-h2': {
            title() {return "<h3>[ii] Sea of Illusion "+(this.enabled()? quickColor('(Stable)','green'):quickColor('(Disrupted)','red'))},
            display() {let dis = '<h2>[Kether] The law of balance undoubtedly applies to all things in the interstellar world. You can deeply understand this in the fuel usage of the ark.'
            if(!this.enabled()) {if(player.Ktr.realTime.lt(1000)) dis += '<br><br>'+quickColor('Reach 1000s of reality time to discover more.','black')
            else dis += '<br><br>'+quickColor('Let all of your upgrades in remote space go beyond lv.6 ( Except for Ktr-s-d3, it only requires to go beyond lv.4) to stabilize it.','red')}
            else dis += '<br><br>'+quickColor('Heart Gate nerf expontent +^0.05','green')
            return dis
            },
            enabled() {return this.unlocked() && ((getBuyableAmount('Ktr','Ktr-s-d1').gte(7) && getBuyableAmount('Ktr','Ktr-s-d2').gte(7) && getBuyableAmount('Ktr','Ktr-s-d3').gte(5) && getBuyableAmount('Ktr','Ktr-s-d4').gte(7) && getBuyableAmount('Ktr','Ktr-s-d5').gte(7) && getBuyableAmount('Ktr','Ktr-s-d6').gte(7)) || hasMilestone('Hkm','Hkm-1') )},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9 && player.Ktr.memoryCrystal.gte(1e6)}
         },
        'Ktr-g-h3': {
            title() {return "<h3>[iii] Sea of Dream "+(this.enabled()? quickColor('(Stable)','green'):quickColor('(Disrupted)','red'))},
            display() {let dis = '<h2>[Kether] All miracles in the universe are built on the right foundation of time. If you can slow down time around integer moments, then you have the potential to master the time of all things.'
            if(!this.enabled()) {if(player.Ktr.realTime.lt(2000)) dis += '<br><br>'+quickColor('Reach 2000s of reality time to discover more.','black')
            else dis += '<br><br>'+quickColor('Change timespan rate to x1/8 and wait until your universal time can be divisible by 60s(1min) to stabilize it. (120s,180s,240s,etc.)','red')}
            else dis += '<br><br>'+quickColor('Heart Gate nerf expontent x2','green')
            return dis
            },
            enabled() {return this.unlocked() && ((player.Ktr.universalTime.gte(30) && player.Ktr.universalTime.toNumber() % 60 <= 2 && player.Ktr.timeWrap < n(0.2)) || hasMilestone('Hkm','Hkm-1'))},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9 && player.Ktr.memoryCrystal.gte(1e10)}
        },
    },
    challenges:{
        'Ktr-g1':{
            name() {return "Heart Gate "+((this.locked())?'(Locked)':(player.Ktr.activeChallenge == 'Ktr-g1'?("("+formatWhole(this.gain())+")"):("(Inactive)")))},
            text() {return "❂"},
            locked() {return player.Ktr.storyUnlocked < 9},
            exp: "",
            color: '#FFFFFF',
            challengeDescription() {
                let desc = "↑↑Click the symbol of current saphirah to enter the Heart Gate!<br>——————————————————<br>Heart Gate Effect:<br>1) Extremely Decrease the generation of stallar points. But it also gains a raising exponent based on the real time after entrying the gate.<br>2) Antimatter will increase after a short time period. If it go beyond your stallar points, you will gain no stallar points.<br>3)Gains memory crystal after exiting the gate.<br>3) Yellow Dwarf have no effect.<br>——————————————————<br>Reach 1e6 and 1e10 memory crystals to unlock more content.<br>——————————————————Goal: 1e20 memory crystals<br>Reward: Unlock Hokma."
                return desc
            },
            gain(){
                let gain = player.Ktr.stallar.add(1).pow(0.22).floor()
                if(layers.Ktr.buyables['Ktr-g-h1'].enabled()) gain = gain.mul(20)
                if(gain.gte(1e20)) gain = softcap(gain,'root',n(1e20),15)
                if(gain.gte(1e35)) gain = n(1e35)
                return gain
            },
            style() {
                if(player.Ktr.memoryCrystal.gte(1e20)) return {'background-color':'#44FF44','box-shadow':'0px 0px 3px 3px #44FF44'}
                else if(player.Ktr.activeChallenge == 'Ktr-g1') return {'background-color':'#dddddd','box-shadow':'0px 0px 6px 6px #dddddd'}
                else if(!this.locked()) return {'background-color':'#dddddd','box-shadow':'0px 0px 3px 3px #dddddd'}
                else return {'background-color':'#888888'}
            },
            onEnter() {
                player.Ktr.timeWrap = n(1)
                for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
            },
            onExit()
            {
                if(this.gain().gte((player.Ktr.lastCrystal).mul(7))) player.Ktr.gate1 += 1
                else player.Ktr.gate1 = 0;
                player.Ktr.memoryCrystal = player.Ktr.memoryCrystal.add(this.gain())
                player.Ktr.lastCrystal = this.gain()
                player.Ktr.universalTime = n(0)
                player.Ktr.realTime = n(0)
            },
        },
    },
    bars: {
        'Ktr-m1': {
            direction: RIGHT,
            width: 600,
            height: 10,
            progress() { return tmp.Ktr.memoryLevel.div(100) },
            fillStyle() { return {'background-color':'skyblue'}},
            borderStyle() { return {'border-color':'skyblue'}},
        },
        'Ktr-a1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return formatWhole(player.Ktr.stallar)+' / '+formatWhole(tmp.Ktr.arkFullReq)+' stallar points for next ark'},
            progress() { return player.Ktr.stallar.div(tmp.Ktr.arkFullReq) },
            fillStyle() { return {'background-color':'lightyellow'}},
            borderStyle() { return {'border-color':'lightyellow'}},
        },
        'Ktr-g1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return 'Req1: '+format(player.Ktr.stallar)+' / '+format(1e245)+' stallar points'},
            progress() { return player.Ktr.stallar.add(1).log(10).div(245) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            unlocked(){ return player.Ktr.storyUnlocked < 9}
        },
        'Ktr-g2': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return 'Req2: '+formatWhole(tmp.Ktr.memoryLevel)+' / '+formatWhole(100)+' memory dipth'},
            progress() { return tmp.Ktr.memoryLevel.div(100) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            unlocked(){ return player.Ktr.storyUnlocked < 9}
        },
        'Ktr-g3': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return 'Req3: '+formatWhole(player.Ktr.solarLayer)+' / '+formatWhole(3)+' universal layer'},
            progress() { return n(player.Ktr.solarLayer / 3) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            unlocked(){ return player.Ktr.storyUnlocked < 9}
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('Ktr','Ktr-6')) mult = mult.mul(upgradeEffect('Ktr','Ktr-6'))
        if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[1].start)) mult = mult.mul(tmp.Ktr.memoryBonus[1].effect)
        if(player.Ktr.ark.gte(1)) mult = mult.mul(tmp.Ktr.arkEff)
        if(mult.gte(1e100)) mult = softcap(mult,'root',n(1e100),1.8)
        if(hasMilestone('Hkm','Hkm-1')) mult = mult.mul(tmp.Hkm.effect)
        if(hasUpgrade('Hkm','Hkm-5')) mult = mult.mul(1e50)
        if(player.Hkm.storyUnlocked >= 6) mult = mult.mul(tmp.Hkm.foemEff1)
        if(hasUpgrade('Ktr','Ktr-18')) mult = mult.mul(tmp.Hkm.BatteryEff2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[2].start)) exp = exp.mul(1.03)
        return exp
    },
    storyPending() {
        let story = 0;
        if(player.Ktr.points.gte(1)) story = 1;
        if(hasUpgrade('Ktr','Ktr-1') && player.Ktr.storyUnlocked == 1) story = 2;
        if(player.points.gte(200000) && player.Ktr.storyUnlocked == 2) story = 3;
        if(player.Ktr.stallar.gte(200) && player.Ktr.storyUnlocked == 3) story = 4;
        if(player.Ktr.ark.gte(3) && player.Ktr.storyUnlocked == 4) story = 5;
        if(player.Ktr.distant && player.Ktr.storyUnlocked == 5) story = 6;
        if(player.Ktr.remote && player.Ktr.storyUnlocked == 6) story = 7;
        if(player.Ktr.ark.gte(21) && player.Ktr.storyUnlocked == 7) story = 8;
        if(tmp.Ktr.memoryLevel.gte(100) && player.Ktr.stallar.gte(1e245) && player.Ktr.solarLayer >= 3 && player.Ktr.storyUnlocked == 8) story = 9;
        return story
    },
    memoryLevel(){
        if(hasMilestone('Hkm','Hkm-11')) return n(100)
        let memory = getBuyableAmount('Ktr','Ktr-m1').mul(25).add(getBuyableAmount('Ktr','Ktr-m2').mul(50)).add(getBuyableAmount('Ktr','Ktr-m3').mul(200))
        return memory.div(200).floor().min(100)
    },
    memorytoNext(){
        let memory = getBuyableAmount('Ktr','Ktr-m1').mul(25).add(getBuyableAmount('Ktr','Ktr-m2').mul(50)).add(getBuyableAmount('Ktr','Ktr-m3').mul(200))
        return (memory.div(200).sub(memory.div(200).floor())).mul(100).min(100)
    },
    stallarFreezeLimit(){
        return n(2).div(buyableEffect('Ktr','Ktr-s2'))
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades:{
        'Ktr-1': {
            title() {return quickColor('['+this.id+']'+'<h3>Shattered Stars<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Origin of everything. Generate 1 essence per second.'},
            effect() {
                let eff = new Decimal(1)
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            effectDisplay() {return '+'+format(layers.Ktr.upgrades[this.layer,this.id].effect())+"/sec"},
            cost() {return n(1)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
        },
        'Ktr-2': {
            title() {return quickColor('['+this.id+']'+'<h3>Clotho and the Stargazer<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Slightly boost essence gain based on kether points.'},
            effect() {
                let eff = player.Ktr.points.pow(hasUpgrade('Ktr','Ktr-9')? 1.5 : 1).add(1).root(2)
                if(hasUpgrade('Ktr','Ktr-7')) eff = eff.mul(upgradeEffect('Ktr','Ktr-7'))
                if(eff.gte(50)) eff = softcap(eff,'root',n(50),2.5)
                if(eff.gte(1e10)) eff = softcap(eff,'root',n(1e10),15)
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            cost() {return n(3)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-1')
            }
        },
        'Ktr-3': {
            title() {return quickColor('['+this.id+']'+'<h3>Pure white waves<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Boost essences gain based on itself.'},
            effect() {
                let eff = player.points.add(1).pow(hasUpgrade('Ktr','Ktr-4')? 1.5 : 1).pow(hasUpgrade('Ktr','Ktr-5')? 1.5 : 1).log(9).add(1)
                if(hasUpgrade('Ktr','Ktr-7')) eff = eff.mul(upgradeEffect('Ktr','Ktr-7'))
                if(eff.gte(10)) eff = softcap(eff,'root',n(10),n(2).sub(hasUpgrade('Ktr','Ktr-14')? 0.8: 0))
                if(eff.gte(1e20)) eff = softcap(eff,'root',n(1e20),15)
                if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[4].start)) eff = eff.pow(4)
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            cost() {return n(5)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-2')
            }
        },
        'Ktr-4': {
            title() {return quickColor('['+this.id+']'+'<h3>Star River Shuttle<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-3 uses a better formula.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(20)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-3')
            }
        },
        'Ktr-5': {
            title() {return quickColor('['+this.id+']'+'<h3>Star Guide<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-3 uses a even better formula.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(40)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-4')
            }
        },
        'Ktr-6': {
            title() {return quickColor('['+this.id+']'+'<h3>The Ties of the Starry Sea<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Each bought upgrade slightly boost Kether points gain.'},
            color(){return '#ffffff'},
            effect() {
                let eff = n(player.Ktr.upgrades.length).add(hasUpgrade('Ktr','Ktr-10')? 4 : 0).mul(0.15).add(1)
                if(hasUpgrade('Ktr','Ktr-7')) eff = eff.mul(upgradeEffect('Ktr','Ktr-7'))
                if(eff.gte(1e6)) softcap(eff,'root',n(1e6),3)
                if(eff.gte(1e100)) softcap(eff,'root',n(1e100),15)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(60)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-5')
            }
        },
        'Ktr-7': {
            title() {return quickColor('['+this.id+']'+'<h3>Stars twinkle<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Make each upgrades which description includes "boost" better. Things become interesting.'},
            color(){return '#ffffff'},
            effect() {
                let eff = n(1.3)
                if(hasUpgrade('Ktr','Ktr-8')) eff = eff.pow(upgradeEffect('Ktr','Ktr-8'))
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(150)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-6')
            }
        },
        'Ktr-8': {
            title() {return quickColor('['+this.id+']'+'<h3>Starduster<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Make Ktr-7 effects on itself.'},
            color(){return '#ffffff'},
            effect() {
                let eff = n(2)
                return eff
            },
            effectDisplay() {return '^'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(500)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-7')
            }
        },
        'Ktr-9': {
            title() {return quickColor('['+this.id+']'+'<h3>Eternal Starlight<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-2 uses a better formula and weaken its softcap.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-8')
            }
        },
        'Ktr-10': {
            title() {return quickColor('['+this.id+']'+'<h3>9 1/4 Platform<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Nothing but equal to 5 UPGRADES.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(2000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-9')
            }
        },
        'Ktr-11': {
            title() {return quickColor('['+this.id+']'+'<h3>Starshards<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Get 1 extra giant gas planet.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(20000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-10') && player.Ktr.storyUnlocked >= 3
            }
        },
        'Ktr-12': {
            title() {return quickColor('['+this.id+']'+'<h3>Farewell Starlight<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Get 1 extra red dwarf.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1e21)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-11') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-13': {
            title() {return quickColor('['+this.id+']'+'<h3>Deep in the Sea of Memory<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Make the formula of giant gas planet MUCH BETTER.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1e30)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-12') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-14': {
            title() {return quickColor('['+this.id+']'+'<h3>The Footsteps of Parting<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Slightly weaken the softcap of Ktr-3.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1e48)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-13') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-14': {
            title() {return quickColor('['+this.id+']'+'<h3>The Footsteps of Parting<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Slightly weaken the softcap of Ktr-3.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1e48)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-13') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-15': {
            title() {return quickColor('['+this.id+']'+'<h3>Orbit Calculator<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Greatly boost the effect of yellow dwarf.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(2e49)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(3)
                return eff
            },
            effectDisplay() {return '^'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-14') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-16': {
            title() {return quickColor('['+this.id+']'+'<h3>Sendan Life<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Boost global boxes gain based on kether points.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e1050')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = player.Ktr.points.add(1).log10().div(100).sqrt().add(1)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-15') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-17': {
            title() {return quickColor('['+this.id+']'+'<h3>Eternal Snow<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Transfer Ne-box faster based on the effect of Pe-Boxes.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e1250')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = Decimal.log(new Decimal(1).add(tmp.Hkm.PeBoxEff).max(1), 10).add(1)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-16') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-18': {
            title() {return quickColor('['+this.id+']'+'<h3>Startail<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Unlock Eternal Battery and transfer Ne-box 5 times faster.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e1500')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(5)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-17') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-19': {
            title() {return quickColor('['+this.id+']'+'<h3>Don’t Let Me Down<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Global boxes gaining multiplier is based on Ne-boxes.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e2100')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(10).mul(n(1).add(player.Hkm.NeBox).max(1).log(100).add(1))
                if(hasUpgrade('Ktr','Ktr-20')) eff = eff.pow(2)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-18') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-20': {
            title() {return quickColor('['+this.id+']'+'<h3>Into the Night<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Square Ktr-19.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e2333')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(2)
                return eff
            },
            effectDisplay() {return '^'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-19') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-21': {
            title() {return quickColor('['+this.id+']'+'<h3>Shade of Remorse<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'The global box gain rate is based on total fuel battery level and unlock SE-box.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e2800')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = player.Hkm.batteryThroem.add(1)
                if(hasUpgrade('Ktr','Ktr-22')) eff = eff.pow(upgradeEffect('Ktr','Ktr-22'))
                if(hasAchievement('Ain','Hkm-24')) eff = eff.mul(Decimal.pow(1.5,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3'))))
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-20') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-22': {
            title() {return quickColor('['+this.id+']'+'<h3>The dusk of existance<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Square the 2nd effect of previous upgrade... Not really square.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e3033')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(1.9)
                return eff
            },
            effectDisplay() {return '^'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-21') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-23': {
            title() {return quickColor('['+this.id+']'+'<h3>Glass world<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Divide 1e3000 from the Y-axis time compressor cost.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('3.33e3333')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-22') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-24': {
            title() {return quickColor('['+this.id+']'+'<h3>Light Tachyon<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Each time foem slightly boosts Pe-box transfer rate.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e3550')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = Decimal.pow(1.3,player.Hkm.foems).mul(100)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-23') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-25': {
            title() {return quickColor('['+this.id+']'+'<h3>Universal Harmony<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Gain another alchemy battery.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e4025')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-24') && hasAchievement('Ain','Hkm-16')
            }
        },
    },
    layerShown(){return true},
    tabFormat:{
            "The Sea of Floating Memory":{
                content:[
                "main-display",
                "prestige-button",
                "blank",
                ["row",[["upgrade","Ktr-1"],["upgrade","Ktr-2"],["upgrade","Ktr-3"],["upgrade","Ktr-4"],["upgrade","Ktr-5"]]],
                ["row",[["upgrade","Ktr-6"],["upgrade","Ktr-7"],["upgrade","Ktr-8"],["upgrade","Ktr-9"],["upgrade","Ktr-10"]]],
                ["row",[["upgrade","Ktr-11"],["upgrade","Ktr-12"],["upgrade","Ktr-13"],["upgrade","Ktr-14"],["upgrade","Ktr-15"]]],
                ["row",[["upgrade","Ktr-16"],["upgrade","Ktr-17"],["upgrade","Ktr-18"],["upgrade","Ktr-19"],["upgrade","Ktr-20"]]],
                ["row",[["upgrade","Ktr-21"],["upgrade","Ktr-22"],["upgrade","Ktr-23"],["upgrade","Ktr-24"],["upgrade","Ktr-25"]]],
                'blank',
                ['display-text',function(){if(player.Ktr.storyUnlocked < 3) return '<h4>'+quickColor("[Hints] Click the button on the top to reset essence, but gain kether points.<br>Kether points can buy permerant upgrades and they can boost resources gain.<br><br>Reach 200,000 essence to continue the journey.",'grey')}],
                ]
            },
            "Star Observation Platform":{
                content:[
                    ['display-text',function(){return '<h4>You have '+quickBigColor(formatWhole(player.Ktr.stallar),'Moccasin') +' Stallar points, boosting essence gain by '+quickBigColor('×'+format(tmp.Ktr.stallarEff),'moccasin')+' .'}],
                    "blank",
                    ['clickable','Ktr-s1'],
                    "blank",
                    ['row',[['buyable','Ktr-s1'],['buyable','Ktr-s2'],['buyable','Ktr-s3'],['buyable','Ktr-s4']]],
                    ['row',[['buyable','Ktr-s5'],['buyable','Ktr-s6']]],
                    'blank',
                    ['display-text',function(){return '<h4>'+quickColor("[Hints] Always care about story is a good strategy.<br>You can always check the story to see when the next feature will be unlocked.",'grey')}],
                ],
                unlocked(){return player.Ktr.storyUnlocked >= 3},
                buttonStyle(){return {'background':'linear-gradient(to right,white 11%, lightyellow 40%)','color':'black','box-shadow':'2px 2px 2px white'}},
                style(){
                    return {
                        "background-image":
                        "linear-gradient(#000 30px,transparent 0),linear-gradient(90deg,white 1px,transparent 0)",
                        "background-size":"31px 31px,31px 31px",
                        "background-position":""+(player.timePlayed)%100+"%"+" "+(player.timePlayed%100)+"%"
                    }
                }
            },
            "Atmospheric Ark":{
                content:[
                ['display-text',function(){return '<h4>You have built a total of   '+quickBigColor(formatWhole(player.Ktr.ark),'white') +' arks. This boosts most of previous resource by '+quickBigColor('×'+format(tmp.Ktr.arkEff),'white')}],
                ['bar','Ktr-a1'],
                "blank",
                ['row',[['clickable','Ktr-a1'],['clickable','Ktr-a2'],['clickable','Ktr-a3'],['clickable','Ktr-a4']]],
                "blank",
                ['display-text',function(){return '<h4>Your arks have a total of '+quickBigColor(formatWhole(player.Ktr.fuel),'lavender') +' fuel.'}],
                "blank",
                ["row",[["buyable","Ktr-s-d1"],["buyable","Ktr-s-d2"],["buyable","Ktr-s-d3"]]],
                ["row",[["buyable","Ktr-s-d4"],["buyable","Ktr-s-d5"],["buyable","Ktr-s-d6"]]],
            ],
                unlocked(){return player.Ktr.storyUnlocked >= 4},
                buttonStyle(){return {'background':'white','color':'black','box-shadow':'2px 2px 2px grey'}}
            },
            "Remote Space":{
                content:[
                ['display-text',function(){return '<h4>Your ark has received   '+quickBigColor(formatWhole(tmp.Ktr.solarEnergy),'lavender') +' solar Energy. which boosts to ark effect and yellow dwarf effect '+quickBigColor('×'+format(tmp.Ktr.solarEff),'lavender')}],
                ['display-text',function(){return quickBigColor('[Universal layer:'+tmp.Ktr.solarLayer[player.Ktr.solarLayer]+']',tmp.Ktr.solarColor[player.Ktr.solarLayer])}],
                ['clickable','Ktr-r1'],
                'blank',
                ['clickable','Ktr-r-c1'],
                ['clickable','Ktr-r-c2'],
                ['clickable','Ktr-r-c3'],
                ['clickable','Ktr-r-c4'],
                ['clickable','Ktr-r-c5'],
            ],
                unlocked(){return player.Ktr.remote},
                buttonStyle(){return {'background':'lavender','color':'black','box-shadow':'2px 2px 2px grey'}},
                style(){
                    return {
                        'background': 'linear-gradient(135deg, #000000 22px, #111133 22px, #111133 24px, transparent 24px, transparent 67px, #111133 67px, #111133 69px, transparent 69px),linear-gradient(225deg, #000000 22px, #111133 22px, #111133 24px, transparent 24px, transparent 67px, #111133 67px, #111133 69px, transparent 69px)0 64px',
                        'background-color':'black',
                        'background-size':'64px 128px',
                        "background-position":"100%"+" "+(player.timePlayed%100)+"%"
                    }
                }
            },
            "Moments Watch Shop":{
                content:[
                ['display-text',function(){return '<h4>The recollection of kether is in dipth '+quickBigColor(formatWhole(tmp.Ktr.memoryLevel),'white') +', providing the following bonuses'}],
                ['display-text',function(){return '<h4>'+quickBigColor(formatWhole(tmp.Ktr.memorytoNext)+'%','white') +' to next'}],
                "blank",
                ['infobox','Ktr-i1'],
                "blank",
                ["row",[["buyable","Ktr-m1"],["buyable","Ktr-m2"],["buyable","Ktr-m3"]]],
                ['buyable','Ktr-sta'],
                ['bar','Ktr-m1'],
                ],
                unlocked(){return player.Ktr.storyUnlocked >= 3},
                buttonStyle(){return {'background':'linear-gradient(to right,white 11%, skyblue 92%)','color':'black','box-shadow':'2px 2px 2px white'}}
            },
            "Heart Gate":{
                content:[
                    ['bar','Ktr-g1'],
                    ['bar','Ktr-g2'],
                    ['bar','Ktr-g3'],
                    "blank",
                    ['display-text',function(){if(player.Ktr.storyUnlocked >= 9)return '<h4>You have collected a total of   '+quickBigColor(formatWhole(player.Ktr.memoryCrystal),'white') +' memory crystal. Itself boosts the effect of solar energy.(Unaffected by the nerf of heart gate)'}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>Universal timespan: '+quickBigColor(formatTime(player.Ktr.universalTime),'white')}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>Reality timespan: '+quickBigColor(formatTime(player.Ktr.realTime),'white')+', translated to a stallar nerf of '+quickBigColor('^'+format(tmp.Ktr.gateEff),'white')}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>You have '+quickBigColor(formatWhole(tmp.Ktr.antimatter),'white')+' antimatter.'}],
                    "blank",
                    ['row',[['challenge','Ktr-g1'],["column", [["raw-html", function() {}],
                    "blank",['display-text',function(){return '<h3>[Black Hole controller]<br>Change the stallar and universal timespan rate.'}],
                   ['column',["blank",["clickable",'Ktr-g1k'],["clickable",'Ktr-g10'],["clickable",'Ktr-g2'],["clickable",'Ktr-g1'],["clickable",'Ktr-g1/2'],["clickable",'Ktr-g1/4'],["clickable",'Ktr-g1/8']]],
                   "blank",
                   ],
                   {
                       "color":"white",
                       "width":"300px",
                       "height":"700px",
                       "border-color":"#FFFFFF",
                       "border-width":"3px",
                       "background-color":"black",
                   },
                ]]],
                'blank',
                ['display-text',function(){return '<h4>'+quickColor("[Hints] Kether's Memory Gate has three unique but unstable memory channels that only become stable and provide bonuses when certain specific conditions are met. If the stable conditions of the memory channel cannot be determined based on existing clues, it can be unlocked by leaving it idle in the Heart Gate for a period of time.",'grey')}],
                'blank',
                ['buyable','Ktr-g-h1'],
                ['buyable','Ktr-g-h2'],
                ['buyable','Ktr-g-h3'],
                ],
                unlocked(){return tmp.Ktr.memoryLevel.gte(100) || player.Ktr.storyUnlocked >= 9},
                buttonStyle(){return {'background':'linear-gradient(to right,white 11%, grey 92%)','color':'black','box-shadow':'2px 2px 2px grey'}}
            },
    },
    update(diff){
        if(document.getElementById('Ktr') != null) player.Ktr.posk1 = document.getElementById('Ktr').getBoundingClientRect().left-225
        if(document.getElementById('Ktr') != null) player.Ktr.posk2 = document.getElementById('Ktr').getBoundingClientRect().top-150
        if(player.Ktr.stallarFreeze.gt(0)) player.Ktr.stallarFreeze = player.Ktr.stallarFreeze.sub(diff).max(0)
        if(tmp.Ktr.storyPending > player[this.layer].storyUnlocked) {
            player[this.layer].storyUnlocked = tmp.Ktr.storyPending;
            player[this.layer].newStory = true
            if(!hasMilestone('Hkm','Hkm-9')) doPopup(type = "none", text = "New Kether story unlocked!<br>(No. "+formatWhole(player[this.layer].storyUnlocked)+")", title = "Ancient Universal Memory Awaken...", timer = 5, color = "white")
        }
        if(getBuyableAmount('Ktr','Ktr-s5').gte(1) || hasMilestone('Hkm','Hkm-1')) player.Ktr.stallar = player.Ktr.stallar.add((player.Ktr.activeChallenge == 'Ktr-g1'? n(0) : buyableEffect('Ktr','Ktr-s5')).mul(tmp.Ktr.clickables['Ktr-s1'].gain).mul(diff))
        if(player.Ktr.activeChallenge == 'Ktr-g1'){
            player.Ktr.realTime = player.Ktr.realTime.add(n(diff).mul(player.Hkm.unlocked? tmp.Hkm.effect : 1))
            player.Ktr.universalTime = player.Ktr.universalTime.add(n(diff).mul(player.Ktr.timeWrap))
        }
        if(hasMilestone('Hkm','Hkm-1') && player.Ktr.storyUnlocked >= 3){
            for(var i = 1; i <= 6; i++){
                if(layers.Ktr.buyables['Ktr-s'+i].unlocked) buyBuyable('Ktr','Ktr-s'+i)
            }
        }
        if(hasAchievement('Ain','Hkm-5') && player.Ktr.remote){
            for(var i = 1; i <= 5; i++){
                if(tmp.Ktr.celestialPerSec[i-1].gte(1) && tmp.Ktr.clickables['Ktr-r-c'+i].unlocked) player.Ktr.solarPower[i-1] = player.Ktr.solarPower[i-1].add(layers.Ktr.celestialGain()[i-1].mul(diff).mul(10))
            }
        }
        if(hasMilestone('Hkm','Hkm-3')){
            if(player.Ktr.stallar.gte(tmp.Ktr.arkFullReq)){
                player.Ktr.ark = player.Ktr.ark.add(1)
                player.Ktr.fuel = player.Ktr.fuel.add(player.Ktr.ark)
                player.Ktr.totalFuel = player.Ktr.totalFuel.add(player.Ktr.ark)
                if(player.Ktr.ark.lt(21)) for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
            }
        }
        if(hasMilestone('Hkm','Hkm-4')){
            buyBuyable('Ktr','Ktr-m1')
            buyBuyable('Ktr','Ktr-m2')
            buyBuyable('Ktr','Ktr-m3')
        }
        if(hasMilestone('Hkm','Hkm-5') && player.Ktr.stallar.gte(tmp.Ktr.solarReq[player.Ktr.solarLayer])) player.Ktr.solarLayer++
        if(hasMilestone('Hkm','Hkm-6')) player.Ktr.timeWrap = n(1000)
        if(hasMilestone('Hkm','Hkm-9')) {buyBuyable('Ktr','Ktr-s-d2'),buyBuyable('Ktr','Ktr-s-d3')}
        if(hasMilestone('Hkm','Hkm-10')) {buyBuyable('Ktr','Ktr-s-d1'),buyBuyable('Ktr','Ktr-s-d4'),buyBuyable('Ktr','Ktr-s-d5'),buyBuyable('Ktr','Ktr-s-d6')}
    },
})
addLayer("Hkm", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        storyUnlocked: 0,
        storyShowing: 1,
        newStory: false,
        resetTimes: 0,
        timeEnergy: new Decimal(0),
        timeThroem: new Decimal(0),
        totalTimeThroem: new Decimal(0),
        batteryThroem: new Decimal(0),
        gridTime: new Decimal(0),
        foems: new Decimal(0),
        PeBox: new Decimal(0),
        NeBox: new Decimal(0),
        maxBet: new Decimal(0),
                     // "points" is the internal name for the main resource of the layer.
    }},
    symbol(){return "Hkm<sup>"+player.Hkm.storyUnlocked},
    color: "grey",                       // The color for this layer, which affects many elements.
    resource: "hokma points",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    passiveGeneration(){return hasAchievement('Ain','Hkm-7')? 10 : 0},
    baseResource: "kether points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.Ktr.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e200),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 1e-300,
    branches: ['Ktr'],
    resetsNothing() {return false},                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
        if(hasAchievement('Ain','Hkm-3')) {
            bonus = Decimal.pow(2,player.Ktr.ark.sub(46)).max(1)
            if(bonus.gte(10)) bonus = softcap(bonus,'root',n(10),5)
            mult = mult.mul(bonus)
        }
        if(hasAchievement('Ain','Hkm-2')) mult = mult.mul(n(15).div(player.Ain.bestReset+0.2).add(1).min(30))
        if(hasUpgrade('Hkm','Hkm-1')) mult = mult.mul(upgradeEffect('Hkm','Hkm-1'))
        if(hasUpgrade('Hkm','Hkm-2')) mult = mult.mul(upgradeEffect('Hkm','Hkm-2'))
        if(hasGrid('Hkm',101)) mult = mult.mul(getEffect('',101))
        if(hasGrid('Hkm',201)) mult = mult.mul(getEffect('',201))
        if(hasGrid('Hkm',301)) mult = mult.mul(getEffect('',301))
        if(hasGrid('Hkm',401)) mult = mult.mul(getEffect('',401))
        if(hasGrid('Hkm',501)) mult = mult.mul(getEffect('',501))
        if(player.Hkm.storyUnlocked >= 6) mult = mult.mul(tmp.Hkm.PeBoxEff)
        if(mult.gte(1e150)) mult = softcap(mult,'root',n(1e150),2.2)
        return mult              // Factor in any bonuses multiplying gain here.
    },
    effectDescription(){
        return "boosting your essence gain, kether points gain, reality time gain and stallar gain by " + quickBigColor(' ×'+format(tmp.Hkm.effect),'grey')
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    canReset(){
        return player.Ktr.memoryCrystal.gte(1e20) && player.Ktr.stallar.gte('1e330')
    },
    storyPending() {
        let story = 0;
        if(player.Hkm.points.gte(1)) story = 1;
        if(player.Ain.achievements.length >= 7 && player.Hkm.storyUnlocked == 1) story = 2;
        if(hasMilestone('Hkm','Hkm-13') && player.Hkm.storyUnlocked == 2) story = 3;
        if(hasMilestone('Hkm','Hkm-14') && player.Hkm.storyUnlocked == 3) story = 4;
        if(hasMilestone('Hkm','Hkm-15') && player.Hkm.storyUnlocked == 4) story = 5;
        if(hasMilestone('Hkm','Hkm-16') && player.Hkm.storyUnlocked == 5) story = 6;
        if(hasAchievement('Ain','Hkm-14') && player.Hkm.storyUnlocked == 6) story = 7;
        if(hasAchievement('Ain','Hkm-16') && player.Hkm.storyUnlocked == 7) story = 8;
        if(hasMilestone('Hkm','Hkm-17') && player.Hkm.storyUnlocked == 8) story = 9;
        if(hasUpgrade('Ktr','Ktr-18') && player.Hkm.storyUnlocked == 9) story = 10;
        if(hasMilestone('Hkm','Hkm-18') && player.Hkm.storyUnlocked == 10) story = 11;
        if(hasMilestone('Hkm','Hkm-19') && player.Hkm.storyUnlocked == 11) story = 12;
        if(hasAchievement('Ain','Hkm-21') && player.Hkm.storyUnlocked == 12) story = 13;
        if(hasAchievement('Ain','Hkm-24') && player.Hkm.storyUnlocked == 13) story = 14;
        if(hasAchievement('Ain','Hkm-28') && player.Hkm.storyUnlocked == 14) story = 15;
        return story
    },
    totalCompressor(){
        return getBuyableAmount('Hkm','Hkm-t1').add(getBuyableAmount('Hkm','Hkm-t2')).add(getBuyableAmount('Hkm','Hkm-t3'))
    },
    nextTimeThroem()
    {
        let lim = new Decimal(1).mul(new Decimal(10).pow(player.Hkm.totalTimeThroem.add(1)))
        if (player.Hkm.totalTimeThroem.gte(29)) lim = lim.mul(new Decimal(2).pow(player.Hkm.totalTimeThroem.sub(29)))
        if(hasGrid('Hkm',104)) lim = lim.div(getEffect('',104))
        return lim
    },
    timeThroemEff()
    {
        let eff = Decimal.pow(n(25),player.Hkm.totalTimeThroem)
        return eff
    },
    gridStrength(){
        let strength = n(1)
        if(player.Hkm.gridTime.lt(100)) strength = strength.sub(n(100).sub(player.Hkm.gridTime).div(100).mul(0.1))
        if(hasUpgrade('Hkm','Hkm-9')) strength = strength.add(0.05)
        if(hasUpgrade('Hkm','Hkm-9') && player.Hkm.gridTime.gte(100)) strength = strength.add(player.Hkm.gridTime.add(1).log(10).sub(2).div(100))
        for (var i = 103; i <= 1300; i += 100){
            if(hasGrid('Hkm',i)) strength = strength.add(getEffect('',i))
        }
        if(hasAchievement('Ain','Hkm-14')) strength = strength.add(buyableEffect('Hkm','Hkm-f2'))
        return strength
    },
    compressorEff(){
        let eff = Decimal.pow(n(3).add(hasUpgrade('Hkm','Hkm-6')? 2 : 0),tmp.Hkm.totalCompressor).sub(1)
        if(hasAchievement('Ain','Hkm-8')) eff = eff.mul(tmp.Ain.effect)
        if(hasUpgrade('Hkm','Hkm-7')) eff = eff.mul(tmp.Hkm.gridStrength.mul(1000))
        if(hasGrid('Hkm',204)) eff = eff.mul(getEffect('',204))
        if(hasGrid('Hkm',304)) eff = eff.mul(getEffect('',304))
        if(hasGrid('Hkm',504)) eff = eff.mul(getEffect('',504))
        if(hasAchievement('Ain','Hkm-27')) eff = eff.mul(upgradeEffect('Ktr','Ktr-19')).mul(upgradeEffect('Ktr','Ktr-24'))
        return eff
    },
    gridSize(){
        if(!hasMilestone('Hkm','Hkm-13')) return 0
        else if(!hasMilestone('Hkm','Hkm-14')) return 1
        else if(!hasMilestone('Hkm','Hkm-15')) return 2
        else if(!hasMilestone('Hkm','Hkm-17')) return 3
        else if(!hasMilestone('Hkm','Hkm-19')) return 4
        else return 5
    },
    foemReq(){
        let req = n(0)
        if(player.Hkm.foems.lt(20)) req = new Decimal(2.5e4).pow(player.Hkm.foems).mul(1e24)
        if(player.Hkm.foems.gte(20)) req = new Decimal(2.5e4).pow(player.Hkm.foems).mul(1e24).mul(new Decimal(5e4).pow(player.Hkm.foems.sub(19)))
        if(hasMilestone('Hkm','Hkm-20')) req = req.div(1e20)
        return req
    },
    foemEff1(){
        let eff = Decimal.pow(1e40,player.Hkm.foems).mul(player.Hkm.foems.pow(7)).add(1)
        if(hasUpgrade('Ktr','Ktr-21')) eff = eff.mul(tmp.Hkm.Sebox)
        return eff
    },
    foemEff2(){
        let eff = Decimal.pow(3,player.Hkm.foems).sub(1).pow(hasUpgrade('Ktr','Ktr-18')? buyableEffect('Hkm','Hkm-b1').add(1) : 1)
        if(hasUpgrade('Ktr','Ktr-16')) eff = eff.mul(upgradeEffect('Ktr','Ktr-16'))
        if(hasUpgrade('Ktr','Ktr-19')) eff = eff.mul(upgradeEffect('Ktr','Ktr-19'))
        if(hasUpgrade('Ktr','Ktr-21')) eff = eff.mul(upgradeEffect('Ktr','Ktr-21'))
        return eff
    },
    boxGain(){
        let gain = getBuyableAmount('Hkm','Hkm-t1').add(getBuyableAmount('Hkm','Hkm-t2')).add(getBuyableAmount('Hkm','Hkm-t3'))
        if(hasAchievement('Ain','Hkm-14')) gain = gain.mul(buyableEffect('Hkm','Hkm-f4'))
        if(hasUpgrade('Ktr','Ktr-16')) gain = gain.mul(upgradeEffect('Ktr','Ktr-16'))
        if(hasUpgrade('Ktr','Ktr-17')) gain = gain.mul(upgradeEffect('Ktr','Ktr-17'))
        if(hasUpgrade('Ktr','Ktr-18')) gain = gain.mul(upgradeEffect('Ktr','Ktr-18'))
        if(hasUpgrade('Ktr','Ktr-19')) gain = gain.mul(upgradeEffect('Ktr','Ktr-19'))
        if(hasUpgrade('Ktr','Ktr-21')) gain = gain.mul(upgradeEffect('Ktr','Ktr-21'))
        if(hasUpgrade('Ktr','Ktr-24')) gain = gain.mul(upgradeEffect('Ktr','Ktr-24'))
        return gain
    },
    NeBoxStroage(){
        let str = n(1000)
        if(hasUpgrade('Ktr','Ktr-18')) str = str.pow(buyableEffect('Hkm','Hkm-b2'))
        return str
    },
    NeBoxEff(){
        let eff = player.Hkm.NeBox.div(buyableEffect('Hkm','Hkm-b3')).add(1).log(1e10).add(1).cbrt().recip()
        eff = eff.pow(buyableEffect('Hkm','Hkm-f6'))
        if(hasUpgrade('Ktr','Ktr-21')) eff = eff.root(20)
        return eff
    },
    NeBoxGain(){
        return tmp.Hkm.foemEff2.sub(tmp.Hkm.boxGain)
    },
    PeBoxExp(){
        let exp = n(1.4).add(hasUpgrade('Ktr','Ktr-18')? buyableEffect('Hkm','Hkm-b1') : 0)
        return exp
    },
    PeBoxEff(){
        let eff = player.Hkm.PeBox.add(1).pow(tmp.Hkm.PeBoxExp).pow(tmp.Hkm.NeBoxEff)
        if(hasAchievement('Ain','Hkm-14')) eff = eff.pow(buyableEffect('Hkm','Hkm-f5'))
        return eff
    },
    PeBoxGain(){
        if(tmp.Hkm.NeBoxGain.lte(0)) return tmp.Hkm.foemEff2
        else return tmp.Hkm.boxGain
    },
    Sebox(){
        let box = player.Hkm.PeBox.add(1).mul(player.Hkm.NeBox.add(1))
        if(hasMilestone('Hkm','Hkm-19')) box = box.pow(1.5+(hasMilestone('Hkm','Hkm-20')? 0.5 : 0))
        return box
    },
    BatteryEff1(){
        let eff = Decimal.pow(413,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).max(2).sub(2))
        let exp = n(1)
        for (var i = 105; i <= 1300; i += 100){
            if(hasGrid('Hkm',i)) exp = exp.add(0.05)
        }
        return eff.pow(exp)
    },
    BatteryEff2(){
        let eff = Decimal.pow(1e100,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).pow(0.85)).mul(getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).pow(4)).add(1)
        let exp = n(1)
        for (var i = 105; i <= 1300; i += 100){
            if(hasGrid('Hkm',i)) exp = exp.add(0.05)
        }
        return eff.pow(exp)
    },
    totalGrid(){
        let total = 0
        for(var i = 101; i <= 1299; i++){
            if(hasGrid('Hkm',i)) total++
        }
        return total
    },
    update(diff){
        if(tmp.Hkm.storyPending > player[this.layer].storyUnlocked) {
            player[this.layer].storyUnlocked = tmp.Hkm.storyPending;
            player[this.layer].newStory = true
            doPopup(type = "none", text = "New Hokma story unlocked!<br>(No. "+formatWhole(player[this.layer].storyUnlocked)+")", title = "The gears of time quietly rotate...", timer = 5, color = "gray")
        }
        if(player.Hkm.storyUnlocked >= 2) player.Hkm.timeEnergy = player.Hkm.timeEnergy.add(tmp.Hkm.compressorEff.mul(diff))
        if(player.Hkm.timeEnergy.gte(tmp.Hkm.nextTimeThroem)){
            player.Hkm.timeThroem = player.Hkm.timeThroem.add(1)
            player.Hkm.totalTimeThroem = player.Hkm.totalTimeThroem.add(1)
        }
        player.Hkm.gridTime = player.Hkm.gridTime.add(diff)
        if(player.Hkm.storyUnlocked >= 6){
            player.Hkm.PeBox = player.Hkm.PeBox.add(tmp.Hkm.PeBoxGain.mul(diff))
            player.Hkm.NeBox = player.Hkm.NeBox.add(tmp.Hkm.NeBoxGain.mul(diff)).max(0)
        }
        if(player.Hkm.NeBox.gte(tmp.Hkm.NeBoxStroage)){
            player.Hkm.PeBox = n(0)
            player.Hkm.foems = player.Hkm.foems.div(2).floor()
            setBuyableAmount('Hkm','Hkm-f4',n(0))
            player.Hkm.NeBox = n(0)
        }
        if(hasAchievement('Ain','Hkm-17')) HokmaGridC[204] = 11
        if(hasAchievement('Ain','Hkm-25')) HokmaGridC[504] = 90
        if(hasAchievement('Ain','Hkm-26')) HokmaGridC[304] = 18
        if(getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).gt(player.Hkm.maxBet)) player.Hkm.maxBet = getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3'))
    },
    resetsNothing(){
        return player.Hkm.storyUnlocked >= 15
    },
    upgrades: {
        'Hkm-1': {
            title() {return quickColor('['+this.id+']'+'<h3>Soft moonlight<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Essences above 1e300 boosts hokma points gain.'},
            effect() {
                let eff = Decimal.pow(1.1,player.points.add(1).log(10).sub(300))
                if(eff.gte(1e5)) eff = softcap(eff,'root',n(1e5),2)
                if(eff.gte(1e10)) eff = softcap(eff,'root',n(1e10),25)
                return eff
            },
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Hkm.upgrades[this.layer,this.id].effect())},
            cost() {return n(3e6)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return true}
        },
        'Hkm-2': {
            title() {return quickColor('['+this.id+']'+'<h3>Indulge in the starry sky<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Kether points above 1e300 boosts hokma points gain.'},
            effect() {
                let eff = Decimal.pow(1.03,player.Ktr.points.add(1).log(10).sub(300))
                if(eff.gte(1e5)) eff = softcap(eff,'root',n(1e5),2)
                if(eff.gte(1e10)) eff = softcap(eff,'root',n(1e10),25)
                return eff
            },
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Hkm.upgrades[this.layer,this.id].effect())},
            cost() {return n(1e8)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-3': {
            title() {return quickColor('['+this.id+']'+'<h3>Unleashed World<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Significantly improve Hokma points’ effect.'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e9)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-4': {
            title() {return quickColor('['+this.id+']'+'<h3>Imagined Ripples<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Essence gain ×1e50'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e10)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-5': {
            title() {return quickColor('['+this.id+']'+'<h3>Infinity Heaven<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Kether points gain ×1e50'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e19)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-6': {
            title() {return quickColor('['+this.id+']'+'<h3>Star Feather<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Make the formula of time compressors better.'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e23)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-7': {
            title() {return quickColor('['+this.id+']'+'<h3>Star Float<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Time-speed strength boost itself energy gain.'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(1e24)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-8': {
            title() {return quickColor('['+this.id+']'+'<h3>Heart meteor<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Greatly boost the formula of stallar points.'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(1e30)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-9': {
            title() {return quickColor('['+this.id+']'+'<h3>A distant agreement<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'The Growth of Time Space-grid have no limit, and slightly make it better.'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e31)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-10': {
            title() {return quickColor('['+this.id+']'+'<h3>Destruction 123<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'divide 10,000 from the cost of z-axis time compressor.'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(1e38)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-9')}
        },
    },
    storyContent: {
        1:{
            text(){ 
                let text = `<text style='color:gray; font-size: 30px; text-shadow: 2px 2px 7px gray'>When the meteor falls, the star feathers stop and fall in the lake.</text><br>
                <text style='color:gray; font-size: 30px; text-shadow: 2px 2px 7px gray'>I have never hated the seemingly approachable starry sky, the sinking illusion, like the meteor that people eagerly hope for. The meteor will not come, and my tomorrow is a deep darkness.——Hokma</text><br><br>
        		<text style='color: #999999'>[Illustration] Ain had a dream about Kether, in which she mentioned that she had buried a key in Wonderland.</text><br>
		        <text style='color: #999999'>[Illustration] When Ain woke up from her dream, she and I were riding on a wooden boat on the lake. I asked Ain where to go first, and Ain said that the clues provided by Ktr-2 pointed to Starfeather Town in the Kingdom of Niniel.</text><br>`
                if(player.Hkm.storyUnlocked < 1) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 1 hokma point to continue.(Tips: Press the prestige button in the hokma layer to gain kether points. The requirement is 1e20 memory crystals and 1e330 stallar points. You will LOSE ALL PROGRESS IN THE KETHER LAYER!!)</i>`
                if(player.Hkm.storyUnlocked >= 1) text += `
                <text style='color: #999999'>[Illustration] On the way by boat, the girl rowing the boat chatted with Ain, introducing that the Kingdom of Niniel is a romantic fantasy land woven from fairy tales, and each city is a place where Niniel's different fairy tales take place. Ain was curious about the fairy tale of Star Feather Town, and the boating girl replied that it was a Star Feather Swan.</text><br>
                <text style='color:magenta'>[Ain] Legend has it that Silver Moon Lake is a mirror left by the great designer Kether in the forest, which can reflect the beautiful starry sky. The true beauty is that it can summon a grand meteor shower, and the wishes made under the meteor shower will definitely come true.</text><br>
                <text style='color: #777777'>[Hokma-46] Come on, girl, come to Silver Moon Lake. Ripples are the stage, starry nights are the curtain~Dance, spread your wings, dreams come true, please let me accompany you~When swans dance, their wings fall into shooting stars...</text><br>
                <text style='color:magenta'>[Ain] Oh, may this be related to the design brochure that Kether-2 gave us?</text><br>
                `
                return text
            }
        },
        2:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] There is a rule in the design brochure that if creating a set of records, it requires the designer's inspiration to echo. Now Ain has the design inspiration for "Meteor Feather" in the album. You suggest going to the design workshop in Star Feather Town to make it. Hokma-46, a boat girl, took Ain to the shore with you and introduced her name as Ah Huan. Welcome to Star Feather Town in the future and take her boat frequently.</text><br>
                <text style='color: #999999'>[Illustration] In the design workshop, Ain held the newly made bag and longed for the power of the Sephirah Shadow summoned after the design drawings of Meteor Feather were completed. He also longed to create more design drawings in the future and have stronger Sephirah power.</text><br>
                `
                if(player.Hkm.storyUnlocked < 2) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock at least 7 achievements to continue. The more milestones you have, the faster the next Hokma run will be.</i>`
                if(player.Hkm.storyUnlocked >= 2) text += `
                <text style='color: #999999'>[Illustration] Ain was pulling out his wallet to pay for the production fee when a handsome young man in gorgeous attire approached the shop owner. He made a delicate glove, but the shop owner offered it for free. The young man repeatedly thanked him, but Ain was very puzzled as to why it was free and whether there were any activities?</text><br>
                <text style='color: #999999'>[Illustration] The handsome young man blinked at Ain and left. The shop owner explained to Ain that beauty is everything in Star Feather Town, and as a member of Star Feather Town, it is natural to give preferential treatment to beautiful people. Ain found this approach unbelievable. The shop owner said that people always think that Star Feather Town is a town that places too much emphasis on beauty, and there is no need to reject human nature. Instead, it is better to give more happiness to beautiful people like Star Feather Town, as unattractive people are not suitable to be born in Star Feather Town.</text><br>
                <text style='color:magenta'>[Ain] Absurdly absurd, treating people differently based on their appearance?</text><br>
                <text style='color: #999999'>[Illustration] Ain said that no one has a way to determine their natural beauty or ugliness. The shop owner An An said that you are already very beautiful and there is no need to underestimate yourself. Ain knew the shopkeeper had misunderstood him and explained that the evaluation system of Star Feather Town was just unreasonable.</text><br>
                <text style='color: #999999'>[Illustration] Ain, who walked out of the store, looked at the fairy tale like street view of Feather Town again and had a different feeling. She found that the people walking on the street were all very beautiful. In the Feather Town of the Stars, beauty is everything. So, where have people who are not good-looking gone?</text><br>
                `
                return text
            }
        },
        3:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] Perhaps in the eyes of outsiders, Star Feather Town is pleasing and beautiful, but it makes Ain feel uncomfortable.</text><br>
                <text style='color: #999999'>[Illustration] Thinking of coming to Star Feather Town to find clues about Kether, Ain decided to first search for news about the nursery rhyme sung by Ah Huan. As for the clues about this nursery rhyme, the people in the town coincidentally mentioned a person - an old fairy tale musician who lived in the town hospital for two years.</text><br>
                <text style='color: #999999'>[Illustration] Ain arrived outside the old musician's ward, and before Ain could knock on the door, the old musician's voice had already come from inside.</text><br>
                <text style='color: #777777'>[Hokma-3] Are you Hokma-9? Come in, please.</text><br>
                `
                if(player.Hkm.storyUnlocked < 3) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your Time-Space grid to 1×1 to continue.</i>`
                if(player.Hkm.storyUnlocked >= 3) text += `
                <text style='color: #777777'>[Hokma-3] Grey Grass, came over so early today. Did you finish the housework ahead of schedule? (Grey Grass=Hokma-9, Old Musician=Hokma-3)</text><br>
                <text style='color:magenta'>[Ain] Hello Mr. Musician, I'm not Grey Grass, I'm Ain. Today is our first time visiting.</text><br>
                <text style='color: #999999'>[Illustration] The old musician still muttered to himself, seemingly immersed in the world of two people chatting with "Grey Grass". As he spoke, the old musician stood up trembling from his wheelchair, and Ain quickly stepped forward to help him.</text><br>
                <text style='color: #777777'>[Hokma-3] Meteor falling in the eye...</text><br>
                <text style='color: #999999'>[Illustration] The sound of the piano is shattered, and the singing is hoarse.</text><br>
                <text style='color: #999999'>[Illustration] The once legendary musician is now playing old songs in the hospital ward.</text><br>
                <text style='color: #999999'>[Illustration] As Ain watched the old musician immerse himself in his performance, he decided to first ask his attending physician.</text><br>
                <text style='color: #999999'>[Illustration] In the office, the attending doctor stated that the old musician has been living in the hospital since the fire at the Star Feather Swan Selection Competition two years ago.</text><br>
                <text style='color: #777777'>[Hokma-768] After the fire, he became somewhat disoriented and seemed to have no memory of what happened that day. Afterwards, he gradually developed Alzheimer's disease and his heart has been struggling.</text><br>
                `
                return text
            }
        },
        4:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] For the gray gray grass that the old musician often talks about, no one in the hospital knows who she is. Ain wondered why gray grass had not visited the old musician. The doctor didn't say anything, but only said that the old musician didn't have many relatives, and the medical expenses were always paid by the town band.</text><br>
                <text style='color: #999999'>[Illustration] The clue seems to have broken, "I" suggested going back to the ark to ask Kether-2, perhaps there is some way. But a phone call suddenly ringing!</text><br>
                <text style='color:white'>[Kether-9718] Hello, Ain? Do you remember what I told you about my friend who was collecting designer information? Her name is Vivian and she is a journalist. She is doing a column interview about design and needs help. Are you interested?</text><br>
                <text style='color:white'>[Kether-9718] This column is called the Designer Intelligence Room, which allows you to get in touch with different designers through interviews, and you can also get a lot of non circulating design collectibles on the market.</text><br>
                <text style='color:magenta'>[Ain] That's settled then.</text><br>
                <text style='color: #999999'>[Illustration] Returning to the Sea of Memory, Ain found Kether-2, indicating the situation where the nursery rhyme clues were broken.</text><br>
                <text style='color: #999999'>[Illustration] Kether-2 opened his portable notebook and retrieved Ain's experience in the Miracle Continent. Ain was very surprised by his abilities in this notebook.</text><br>
                <text style='color:white'>[Kether-2] The clue to nursery rhymes was found in the information of a Sephirah Shadow, and you may be interested in its name.</text><br>
                <text style='color:magenta'>[Ain] The name is?</text><br>
                <text style='color:white'>[Kether-2] Hokma-9!</text><br>
                <text style='color:white'>[Kether-2] In each mirror of the ark, there is a Sephirah, and during battles, you use the power of the Sephirah Shadow in the mirror.</text><br>
                `
                if(player.Hkm.storyUnlocked < 4) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your Time-Space grid to 2×2 to continue.</i>`
                if(player.Hkm.storyUnlocked >= 4) text += `
                <text style='color:white'>[Kether-2] This mirror is the Sephirah Shadow of Grey Grass and Meteor Feather, and due to incomplete production, the mirror is not complete.</text><br>
                <text style='color: #999999'>[Illustration] On the incomplete mirror, the sharp gaze of Grey Grass was revealed, which was a suppressed desire under the gaze.</text><br>
                <text style='color: #999999'>[Illustration] Facing the gaze of Grey Grass, some images suddenly flashed in Ain's mind, and the real feeling made Ain grip his hands tightly.</text><br>
                `
                return text
            }
        },
        5:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] When Ain came to his senses, he was already in a sea of fire. In the midst of the sea of fire, there stood an indistinct gray figure in the distance.</text><br>
                <text style='color:magenta'>[Ain] Who are you? Where is this?</text><br>
                <text style='color: #777777'>[Hokma-9] Meteor falling in the eye...</text><br>
                <text style='color: #777777'>[Hokma-9] It's the person you awakened.</text><br>
                <text style='color:magenta'>[Ain] Grey grass?</text><br>
                <text style='color:white'>[?????] Grey grass has already died, and next, it's you!</text><br>
                <text style='color:pink'>[You] Use the power of Sephirah's Shadow quickly!</text><br>
                <text style='color: #999999'>[Illustration] The power of Sephirah's shadow emerged in the warm heart, and the sea of fire gradually faded away, leaving Ain alone on the empty lakeshore.</text><br>
                <text style='color:magenta'>[Ain] Where is that mysterious girl?</text><br>
                <text style='color:magenta'>[Ain] What about that mysterious girl? So what I just saw was the designer's memory when designing this outfit?</text><br>
                <text style='color:white'>[Kether-2] Every piece of clothing is a condensation of designer emotions and memories, which give birth to Sephirah's shadow in the reflection of the sea of memories.</text><br>
                <text style='color:white'>[Kether-2] Sephirah Shadow only possesses the emotions and memories of the designer at the time, as these emotions are too intense. When using the power of Sephirah Shadow, be careful not to be backfired.</text><br>
                <text style='color: #999999'>[Illustration] Ain thought for a moment, and only by summoning the Sephirah Shadow of Grey Grass can he know the truth about that memory. Only in this way can we know the relationship between nursery rhymes and Kether.</text><br>
                `
                if(player.Hkm.storyUnlocked < 5) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your Time-Space grid to 3×3 to continue.</i>`
                if(player.Hkm.storyUnlocked >= 5) text += `
                <text style='color: #999999'>[Illustration] Ain and his group met Ah Huan by chance, and Ah Huan invited them to experience a ferry tour around the lake. Ain politely declined, citing that he had something else to do.</text><br>
                <text style='color: #999999'>[Illustration] Ah Huan was a bit curious, so Ain asked her if she had seen the Meteor Feather outfit before and showed her the picture.</text><br>
                `
                return text
            }
        },
        6:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] Ahuan recognized Meteor Feather at a glance and said that even if I were to die, I wouldn't forget this outfit because the story about Meteor Feather couldn't be finished for a while. So Ahuan invited Ain and his team to board the ship and slowly told the story behind Meteor Feather.</text><br>
                <text style='color: #999999'>[Illustration] Regarding the memory of Meteor Feather, Ah Huan said that she saw it during the promotion competition of the previous Star Feather Swan Selection Competition, shining brilliantly between the starry sky and the reflection.</text><br>
                <text style='color: #999999'>[Illustration] Ain heard Ah Huan mention the Star Feather Swan Selection Competition, and it seems to have been heard somewhere in his memory. At this point, Ah Huan and Ain had already arrived at the stage of Star Feather Swan Selection, as there were no activities tonight and the stage was quiet.</text><br>
                <text style='color: #777777'>[Hokma-768] This is the biennial election competition in the town, where the most beautiful girl is awarded the title of "Star Feather Swan". Although Xingyu Town is small, the selection of Xingyu Swan is a grand event that attracts nationwide attention.</text><br>
                <text style='color: #777777'>[Hokma-768] The queen of Niniel, the queen whom I will always respect and aspire to, Lilith, left two years ago after winning the championship.</text><br>
                <text style='color:magenta'>[Ain] What, isn't the queen hereditary?</text><br>
                <text style='color: #777777'>[Hokma-768] The monarch of Niniel was elected - the person believed by the people of the whole country to best fit Niniel's temperament.</text><br>
                <text style='color:magenta'>[Ain] So the queen is the most beautiful girl chosen by everyone in the country?</text><br>
                <text style='color: #777777'>[Hokma-768] Yes, tomorrow is the selection of the Star Feather Swan, and this year's competition will be even more grand.</text><br>
                <text style='color:magenta'>[Ain] The values of this country are truly extreme and terrifying.</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, I also want to sign up to participate. Can you accompany me to compete on stage once? The theme is my favorite "Nick of time"!</text><br>
                `
                if(player.Hkm.storyUnlocked < 6) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock Time foem to continue.</i>`
                if(player.Hkm.storyUnlocked >= 6) text += `
                <text style='color: #999999'>[Illustration] Ain awakened Sephirah's power and put on the headgear of Meteor Feather - Star Feather.</text><br>
                <text style='color: #999999'>[Illustration] At this moment, Ah Huan was not aware of the seriousness of the problem, and the all-out Ain made Ah Huan feel the power of matching and was rubbed against the ground.</text><br>
                `
                return text
            }
        },
        7:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] After the match, Ah Huan suggested that Ain participate in the Star Feather Swan selection tomorrow, thinking that this competition should be able to see different matching artists and designers, especially since Meteor Feather's outfit has shone on stage, she readily agreed.</text><br>
                <text style='color: #777777'>[Hokma-768] After the players of Meteor Feather left, thick smoke drifted from the backstage.</text><br>
                <text style='color:magenta'>[Ain] Is it the fire where the old musician was injured?</text><br>
                <text style='color: #777777'>[Hokma-768] That fire was indeed quite bizarre. Everyone thought that the girl wearing Meteor Feather would win the championship, but unfortunately.</text><br>
                <text style='color:magenta'>[Ain] How...?</text><br>
                <text style='color: #777777'>[Hokma-768] Disfigured by the fire.</text><br>
                <text style='color:magenta'>[Ain] Is it gray grass?</text><br>
                <text style='color: #777777'>[Hokma-768] It doesn't seem like that name, but many girls participate in competitions to enter the entertainment and fashion circles, perhaps using stage names.</text><br>
                <text style='color:magenta'>[Ain] So what happened to her afterwards?</text><br>
                <text style='color: #777777'>[Hokma-768] Having suffered a great blow, living an ugly life in the small town is a terrible ending. I have seen a girl who always wears a mask when going out, has no friends, and is often bullied. I always felt sorry for her until I accidentally saw her face. I understood the reason why she was treated this way, and I was scared.</text><br>
                <text style='color:pink'>[You] Why can't we have more sympathy for that girl? She must be in a lot of pain.</text><br>
                <text style='color:magenta'>[Ain] Is beauty and ugliness really important? Isn't the meaning of pairing existence to enable all those who aspire to shine to realize themselves?</text><br>
                `
                if(player.Hkm.storyUnlocked < 7) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock Time foem constructor to continue.</i>`
                if(player.Hkm.storyUnlocked >= 7) text += `
                <text style='color: #777777'>[Hokma-768] If you are so interested in that fire, you can go to the police station to inquire, maybe the case record is still kept.</text><br>
                <text style='color:magenta'>[Ain] Let's go now!</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, it's too late now. The police station cannot accept your request.</text><br>
                <text style='color:magenta'>[Ain] I forgot it...</text><br>
                `
                return text
            }
        },
        8:{
            text(){ 
                let text = `
                <text style='color: #777777'>[Hokma-768] Let's take you to the hotel first and ask tomorrow morning?</text><br>
                <text style='color:magenta'>[Ain] Thank you.</text><br>
                <text style='color: #777777'>[Hokma-768] It's not a big deal. Competing with your memory has helped me find a direction for improvement and allowed me to experience the shadow of Sephirah. Tomorrow, I will confidently participate in the competition.</text><br>
                <text style='color: #999999'>[Illustration] The second day.</text><br>
                <text style='color: #999999'>[Illustration] Ain came to the police station as a fan of Meteor Feather to learn about the aftermath of the fire and the current situation of Grey Grass.</text><br>
                <text style='color: #777777'>[Hokma-3200] Grey Grass is an arsonist, but how do you know about her? When reporting, she used an alias.</text><br>
                <text style='color: #999999'>[Illustration] Ain is scared.</text><br>
                <text style='color: #777777'>[Hokma-3200] I personally participated in the investigation, and I remember correctly that Grey Grey Grass was the arsonist who died in the fire. I want to know now, what is your relationship with her?</text><br>
                <text style='color:magenta'>[Ain] How could it be? The Meteor Feather is clearly designed by Grey Grass.</text><br>
                <text style='color: #777777'>[Hokma-3200] Don't you believe it? Come into the archives, I can show you something.</text><br>
                <text style='color: #999999'>[Illustration] The police (Hokma-3200) showed them a video of Pepe dancing screaming while covering her disfigured face.</text><br>
                <text style='color: #999999'>[Illustration] The warmth and big cat in front of the TV were stunned. No matter who the arsonist was, such a crime was terrifying. At this moment, the police handed over another photo.</text><br>
                `
                if(player.Hkm.storyUnlocked < 8) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock the second pack of Kether upgrades to continue.</i>`
                if(player.Hkm.storyUnlocked >= 8) text += `
                <text style='color:magenta'>[Ain] Perhaps because she was too ugly, she was abandoned by her biological parents and became an adopted daughter. Because she was jealous of her sister's beauty, she committed such a crime.</text><br>
                <text style='color: #777777'>[Hokma-3200] Many people say that dying in this fire was really cheap for her. That's not what I said, don't go out and talk nonsense.</text><br>
                <text style='color:magenta'>[Ain] Thanks, I got it.</text><br>
                <text style='color:magenta'>[Ain] Perhaps the whole thing is not so simple. Let's go to the hospital again to see the old musician.</text><br>
                `
                return text
            }
        },
        9:{
            text(){ 
                let text = `
                <text style='color:magenta'>[Ain] Old musician, are you okay?</text><br>
                <text style='color: #777777'>[Hokma-3] Grey grass, you come there again!</text><br>
                <text style='color:magenta'>[Ain] I go there to see you. Old musician, do you still remember the outfit I designed?</text><br>
                <text style='color: #777777'>[Hokma-3] Remember, how did the beautiful clothes go?</text><br>
                <text style='color:magenta'>[Ain] We still need some materials, it's almost finished.</text><br>
                <text style='color: #777777'>[Hokma-3] Well, when standing on stage, I will accompany you.</text><br>
                <text style='color:magenta'>[Ain] Thank you Do I sing well?</text><br>
                <text style='color: #777777'>[Hokma-3] It sounds great, you need to be confident. True beauty is not just about appearance, but also about sticking to your heart. No matter what others say, in my eyes you are very cute. Stand on that stage, put on the clothes you designed yourself, sing that song, and summon that meteor shower.</text><br>
                <text style='color: #999999'>[Illustration] The words of the old musician seem so out of place in Xingyu Town, where beauty is everything.</text><br>
                <text style='color: #777777'>[Hokma-3] Go ahead! Meteor showers will definitely fall!</text><br>
                <text style='color:pink'>[You] Ain, let's go back to the ark and see the gray grass. She must be very lonely.</text><br>
                `
                if(player.Hkm.storyUnlocked < 9) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your time-space grid to 4×4 to unlock.</i>`
                if(player.Hkm.storyUnlocked >= 9) text += `
                <text style='color:magenta'>[Ain] Go back to the ark and see the gray grass? The mirror hasn't been assembled yet, has it?</text><br>
                <text style='color:pink'>[You] Well, let's go back. I do have something I want to say to Grey Grass.</text><br>
                <text style='color: #999999'>[Illustration] The Ark of the Sea of Memory, in front of the Sephirah Shadow of Grey Grass</text><br>
                <text style='color:magenta'>[Ain] Grey Grass, perhaps you have indeed committed an unforgivable mistake. I can feel your emotions and see those vague memory fragments, but is this ending what you want now?</text><br>
                <text style='color: #777777'>[Hokma-9] Those who mock you will not change, and your pain will not end.</text><br>
                <text style='color: #999999'>[Illustration] Ain reached out and lightly touched the mirror, causing ripples to spread on the surface without a cold touch. It was like a flame burning and jumping.</text><br>
                `
                return text
            }
        },
        10:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] A figure intertwined with anger and sadness appeared in the dimly lit mirror, rushing towards Ain with a roaring flames and rolling her inside.</text><br>
                <text style='color:pink'>[You] Ain!</text><br>
                <text style='color:magenta'>[Ain] Grey Grass, you...</text><br>
                <text style='color:pink'>[You] Ain! Don't be devoured by the power of Sephirah's shadow, engage in a memory war with her!</text><br>
                <text style='color:magenta'>[Ain] Grey grass, your pain cannot dominate me!!</text><br>
                `
                if(player.Hkm.storyUnlocked < 10) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock eternal battery to continue.</i>`
                if(player.Hkm.storyUnlocked >= 10) text += `
                <text style='color: #999999'>[Illustration] The stage that Grey Grass once dreamed of was burning with blazing flames, people scattered and fled, and Pepe stood trembling in fear in the sea of fire.</text><br>
                <text style='color: #999999'>[Illustration] Grey grass held its head high, naked in the flames, like a queen patrolling her own territory.</text><br>
                <text style='color: #777777'>[Hokma-9] If evil is beautiful, why don't I become a demon?</text><br>
                <text style='color:magenta'>[Ain] Pain cannot be burned.</text><br>
                <text style='color: #777777'>[Hokma-9] Don't think you can understand me, leave my memories!</text><br>
                <text style='color: #999999'>[Illustration] The gray grass was infuriated, and the flames were swept by the strong wind towards Ain.</text><br>
                <text style='color: #999999'>[Illustration] The firelight drifted away, and Ain returned to the ark.</text><br>
                <text style='color: #999999'>[Illustration] Ain looked at the quiet mirror, knowing that the raging fire had been burning in the heart of Grey Grass.</text><br>
                <text style='color:pink'>[You] Grey grass seems to have enclosed itself in the fire, refusing everyone's approach.</text><br>
                <text style='color:magenta'>[Ain] The flame will eventually go out, as long as the meteor shower falls.</text><br>
                <text style='color:pink'>[You] If a true meteor shower were summoned in front of the gray grass, perhaps it could extinguish the flame in her heart?</text><br>
                <text style='color:magenta'>[Ain] Well, I think so too. I have to give it a try no matter what. I have all the inspiration, let's go call for the meteor shower together.</text><br>
                <text style='color: #999999'>[Illustration] On site registration.</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, you come here!</text><br>
                `
                return text
            }
        },
        11:{
            text(){ 
                let text = `
                <text style='color:magenta'>[Ain] Congratulations, Ah Huan!</text><br>
                <text style='color: #777777'>[Hokma-768] The selection competition is still easy to pass, and I'm worried if you won't come.</text><br>
                <text style='color:magenta'>[Ain] Sorry, it was delayed by some things.</text><br>
                <text style='color:pink'>[You] A lot of things happened today, it's almost dark in the blink of an eye.</text><br>
                <text style='color: #999999'>[Illustration] At this moment, the broadcast on the square announced that the Star Feather Swan selection qualification competition was about to end. Ain panicked and went to register, but was refused by the judges on the grounds that the selection competition had already ended.</text><br>
                <text style='color:magenta'>[Ain] But the registration will only end in 5 minutes.</text><br>
                `
                if(player.Hkm.storyUnlocked < 11) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock fuel battery to continue.</i>`
                if(player.Hkm.storyUnlocked >= 11) text += `
                <text style='color: #777777'>[Hokma-768] Give us a chance, this game is very important to us.</text><br>
                <text style='color: #777777'>[Hokma] Why didn't you come earlier? Is it okay to take responsibility for oneself? Do you want me to set an alarm for you? Go back!</text><br>
                <text style='color: #777777'>[Hokma-768] But in previous years, there were additional spots added after the selection competition ended? Even the queen who participated in the last competition was only after the semi-finals——</text><br>
                <text style='color: #777777'>[Hokma] What is the queen and who are you? The special channel is only open to beautiful people. You, like those girls on the street, have an ordinary appearance. It's not wrong to be ordinary, but it's your fault to have privileges despite your ordinary appearance!</text><br>
                <text style='color:magenta'>[Ain] Are the judges of Star Feather Swan using this standard of evaluation?</text><br>
                <text style='color: #777777'>[Hokma] What, do you have any objections?</text><br>
                <text style='color:magenta'>[Ain] The standard of beauty is not absolute.</text><br>
                <text style='color: #777777'>[Hokma] You actually insulted the judges and slandered the competition at the scene.</text><br>
                <text style='color:magenta'>[Ain] Didn't you just say that the game has ended?</text><br>
                <text style='color: #777777'>[Hokma] The shameless little girl, let me teach you a lesson. You can decide the theme of the memory competition.</text><br>
                <text style='color: #999999'>[Illustration] Ah Huan panicked and quickly told Ain that this judge is a well-known senior matchmaker in the Sephirah Alliance, specifically responsible for commenting on the matching of contestants in the competition.</text><br>
                `
                return text
            }
        },
        12:{
            text(){ 
                let text = `
                <text style='color:magenta'>[Ain] It's okay, I don't believe that someone with such a superficial understanding of Sephirah would have such strong memory power.</text><br>
                <text style='color:magenta'>[Ain] So, let's set the theme as "highly respected judges".</text><br>
                <text style='color: #777777'>[Hokma] Oh, I actually set a theme that I'm good at, arrogant!</text><br>
                `
                if(player.Hkm.storyUnlocked < 12) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach the first softcap of hokma points gain to unlock.</i>`
                if(player.Hkm.storyUnlocked >= 12) text += `
                <text style='color: #999999'>[Illustration] At this point, the judges had not yet realized the seriousness of the problem, and the battle had already ended at the beginning. He was rubbed against the ground by Ain's force.</text><br>
                <text style='color: #999999'>[The Judge] I actually lost? impossible!</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, you're so powerful!</text><br>
                <text style='color: magenta'>[Ain] The stage of the Star Feather Swan is a place where every girl shines, even if she hasn't become a 'Star Feather Swan', she can show everyone her shining points. Even so, my understanding of beauty is still shallow, but it cannot bring hope and beauty to people, and cannot be called true beauty.</text><br>
                <text style='color: #999999'>[Illustration] The judge looked at the suddenly serious Ain, speechless. At this moment, Ain's phone suddenly rang.</text><br>
                <text style='color: #999999'>[Illustration] "Hello, um, it was me who went to visit the old musician this afternoon. What? I'll be right there! "Ain was surprised, and the other end of the phone told her that the old musician had a sudden heart attack and was currently receiving emergency treatment!</text><br>
                `
                if(player.Hkm.storyUnlocked < 13) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock all sorts of fuel batteries to continue.</i>`
                if(player.Hkm.storyUnlocked >= 13) text += `
                <text style='color: #999999'>[Illustration] The door to the emergency room opened, and the attending doctor walked out.</text><br>
                <text style='color: magenta'>[Ain] Hello doctor, how is the old musician doing?</text><br>
                <text style='color: #999999'>[The Doctor] Now wake up, but .... There are probably only two days left. Are you gray grass?</text><br>
                <text style='color: magenta'>[Ain] Why do you ask?</text><br>
                <text style='color: #999999'>[The Doctor] Spend more time with him.</text><br>
                <text style='color: magenta'>[Ain] I think what the old musician wants to see is not gray grass, but that she can overcome prejudice and regain hope.</text><br>
                <text style='color: #777777'>[Hokma-3] You... Come... How is it going...(Struggling to say out words)</text><br>
                <text style='color: magenta'>[Ain] Don't be in a hurry to talk, the registration went smoothly, I went in the Meteor Feather, and everyone complimented me on my design.</text><br>
                `
                return text
            }
        },
        13:{
            text(){ 
                let text = `
                <text style='color: #777777'>[Hokma-3] Emm... Great.</text><br>
                <text style='color: magenta'>[Ain] After a while, I will stand on the stage and sing, the meteor shower will fall, you must keep your eyes open!</text><br>
                <text style='color: #999999'>[Illustration] The old musician looked out the window and nodded, his eyes shining with starlight, and they became a little brighter.</text><br>
                `
                if(player.Hkm.storyUnlocked < 14) text += `<br><br>
                <i style='color: #444444'>[Locked] Enable the leaf battery to continue.</i>`
                if(player.Hkm.storyUnlocked >= 14) text += `
                <text style='color:pink'>[You] We didn't register, so we couldn't participate in the competition. What's more, the hospital is so far away from the stage that the old musicians can't see it...</text><br>
                <text style='color: magenta'>[Ain] We don't need that stage, let's go make the rest of the Meteor Feather, the gray grass is waiting for us.</text><br>
                <text style='color: #999999'>[Illustration] When came out of the hospital, the night was already deep.</text><br>
                <text style='color: #999999'>[Illustration] "Grey Grass, it's time for us to take the stage, " Ain held the necklace. At this moment, the Star Feather Swan competition should be underway, it must be very lively. The Gate of the Heart appeared, but the opposite side of the door was quiet and there was no echo.</text><br>
                <text style='color:pink'>[You] She seemed like... She don't want to come out.</text><br>
                <text style='color: #999999'>[Illustration] "Grey grass, the stage and costumes are ready for you. It's time to go on stage. Are you scared?</text><br>
                <text style='color: #999999'>[Illustration] "What do you think you know? "Grey Grass rushed from the Heart Gate to Ain, then lowered her head a moment later, her bangs blocking her eyes.</text><br>
                <text style='color:pink'>[You] You can no longer hurt Ain!</text><br>
                <text style='color: #777777'>[Hokma-9] Mocking, trampling, mocking, clothes taken away, violin broken...</text><br>
                <text style='color: #999999'>[Illustration] Some moments filled with resentment and angry.</text><br>
                <text style='color: magenta'>[Ain] The fire did not burn away your pain, your hope is gone, the hope you want is a grand meteor shower. Come on, the old musician has been waiting for you to take the stage.</text><br>
                <text style='color: #777777'>[Hokma-9] Don't be arrogant anymore, you don't even understand my feelings, you don't even know how powerful my heart is.</text><br>
                <text style='color: #999999'>[Illustration] Ain suddenly be pulled into the battle of collection! But she beat grey grass after moments.</text><br>
                <text style='color: #999999'>[Illustration] The tattered clothes on the gray grass transformed into meteor feathers dotted with stars.</text><br>
                `
                return text
            }
        },
        14:{
            text(){ 
                let text = `
                <text style='color:pink'>[You] Wearing the meteor feather on the gray grass is really beautiful!</text><br>
                <text style='color: magenta'>[Ain] Yeah, we did it. Meteor shower beautiful!</text><br>
                <text style='color: #999999'>[Illustration] In the surveillance ward, the old musician looked in surprise at the meteor shower pouring out of the window, and the bright starry sky illuminated the entire Silver Moon Lake. Grey grass wearing meteor feathers appeared in front of him, and she gently hugged him.</text><br>
                <text style='color: magenta'>[Ain] The flames of the world in the mirror have extinguished, and I should not be consumed by the memories of Grey Grass.</text><br>
                <text style='color:pink'>[You] Although I haven't received any further clues related to nursery rhymes, it's still worth letting go of the past for Grey Grass.Although I haven't received any further clues related to nursery rhymes, it's still worth letting go of the past for Grey Grass.</text><br>
                <text style='color: #999999'>[Illustration] A sparkling diamond, resembling a shooting star, landed on the warm palm of my hand, with a faint swan like shape.</text><br>
                <text style='color: magenta'>[Ain] Will this be left by Kether?</text><br>
                `
                if(player.Hkm.storyUnlocked < 15) text += `<br><br>
                <i style='color: #444444'>[Locked] Unlock Backward Clock to continue. It's the ultimate challenge of Hokma layer.</i>`
                if(player.Hkm.storyUnlocked >= 15) text += `
                <text style='color: #999999'>[Illustration] ......</text><br>
                <text style='color: magenta'>[Ain] Goodbye, old musician. Death is also the beginning of an unknown journey. Goodbye, old musician.</text><br>
                <text style='color: #999999'>[Illustration] Ain heard a familiar voice and turned to see Binah in the crowd.</text><br>
                <text style='color: magenta'>[Ain] Binah？ Last time at the bar...</text><br>
                <text style='color: #3a3a3a'>[Binah] We meet again, Ain and FallenCat.</text><br>
                <text style='color: magenta'>[Ain] Thank you... I misunderstood you before.</text><br>
                <text style='color: #3a3a3a'>[Binah] It's my fault for not explaining clearly. Are you also attending the funeral of the old musician?</text><br>
                <text style='color: magenta'>[Ain] Sure.</text><br>
                <text style='color: #999999'>[Illustration] Ain's heart stirred as she stood in front of Binah and took out the Star Feather Diamond.</text><br>
                <text style='color: #3a3a3a'>[Binah] Where did this come from? Hmm... I think the radiance of this diamond may point to another timeline parallel to our time and space, and we need to use the power of the clock of backtracking to help us complete the transition. Do you want to come together?</text><br>
                `
                return text
            }
        },
    },
    bars: {
        'Hkm-t1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return formatWhole(player.Hkm.timeEnergy)+' / '+formatWhole(tmp.Hkm.nextTimeThroem)+' time energy for next time throem'},
            progress() { return player.Hkm.timeEnergy.div(tmp.Hkm.nextTimeThroem) },
            borderStyle() { return {'border-color':'grey'}},
            fillStyle() { return {'background-color':'grey'}},
            style() {return {'color':'white'}},
        },
        'Hkm-f1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return formatWhole(player.Hkm.NeBox)+' / '+formatWhole(tmp.Hkm.NeBoxStroage)+' until destruction'},
            progress() { return player.Hkm.NeBox.div(tmp.Hkm.NeBoxStroage) },
            borderStyle() { return {'border-color':'salmon'}},
            fillStyle() { return {'background-color':'salmon'}},
            style() {return {'color':'white'}},
        },
        'Hkm-bk1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return 'Req1: '+format(player.points)+' / '+format('1e4050')+' essences'},
            progress() { return player.points.add(1).log(10).div(4050) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            style() {return {'color':'white'}},
            unlocked(){ return true}
        },
        'Hkm-bk2': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return 'Req2: '+formatWhole(player.Hkm.points)+' / '+format('1e225')+' hokma points'},
            progress() { return player.Hkm.points.add(1).log(10).div(225) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            style() {return {'color':'white'}},
            unlocked(){ return true}
        },
        'Hkm-bk3': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return 'Req3: '+formatWhole(player.Hkm.timeEnergy)+' / '+formatWhole('1e167')+' time energy'},
            progress() { return player.Hkm.timeEnergy.add(1).log(10).div(167) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            style() {return {'color':'white'}},
            unlocked(){ return true}
        },
    },
    milestones: {
        'Hkm-1': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Autobuy every basic stars when affordable and gain 1 extra yellow dwarf.<br>2.All memory channels are always stable after unlocking them.<br>`+quickColor("3.Unlock Ain (Achievements).",'pink')},
            req: n(1),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return true}
        },
        'Hkm-2': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Keep all Kether upgrades on Hokma reset.`},
            req: n(2),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-3': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Autobuy ark if possible.`},
            req: n(3),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-4': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Autobuy things in Moments Watch Shop and they costs nothing.`},
            req: n(4),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-5': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Auto Transition when possible.`},
            req: n(6),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-6': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.The black hole speed is always at 1000× and you cannot longer gain antimatter.`},
            req: n(9),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-7': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Keep memory crystal through Hokma reset.`},
            req: n(18),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-8': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.The ark is in remote space instantly after Hokma reset.`},
            req: n(100),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-9': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Autobuy Ktr-s-d2 and Ktr-s-d3.<br>2.Unlocking new Kether story won’t longer force a pupop.`},
            req: n(500),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-10': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Autobuy the rest of buyables.`},
            req: n(1000),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-9')}
        },
        'Hkm-11': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.The memory dipth of Kether is always 100.`},
            req: n(2500),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-12': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Keep all buyable and arks after Hokma reset.`},
            req: n(5000),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-13': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Expend time-space grid.(0×0 → 1×1)`},
            req: n(1e13),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-14': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Expend time-space grid.(1×1 → 2×2)`},
            req: n(1e20),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-15': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Expend time-space grid.(2×2 → 3×3)`},
            req: n(1e32),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-16': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Unlock Time foem.`},
            req: n(1e42),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-17': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Expend time-space grid.(3×3 → 4×4)`},
            req: n(1e63),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-18': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Unlock fuel battery.(Under the eternal battery tab.)`},
            req: n(1e136),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-19': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Expend time-space grid.(4×4 → 5×5)<br>2.Divide 1e20 from the cost of time foem.<br>3.The gain of hokma points is softcapped.`},
            req: n(1e150),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-20': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Gain a free leaf battery.<br>2.The gain of Se-box is raised to 133%.<br>3.Double the effect of Hkm-b1.`},
            req: n(1e203),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-19')}
        },
        'Hkm-21': {
            requirementDescription() {return quickColor("Get "+formatWhole(this.req)+" Hokma Points ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.All batteries are twice as strong per level.<br>2.Gain a free aqua battery.`},
            req: n(1e218),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-2'+Number(this.id[5]-1))}
        },
    },

    layerShown() { return player.Ktr.memoryCrystal.gte(1e20) || player.Hkm.storyUnlocked >= 1 },          // Returns a bool for if this layer's node should be visible in the tree.
    grid: {
        rows(){return tmp.Hkm.gridSize}, // If these are dynamic make sure to have a max value as well!
        cols(){return tmp.Hkm.gridSize}, 
        maxRows: 12,
        maxCols: 12,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return player.Hkm.timeThroem.gte(HokmaGridC[id]) && data != 1
        },
        getTooltip(data, id){
            let color = HokmaColor[id % 100]
            return "<h4 style='color:"+color+";text-shadow:0px 0px 10px;'>["+HokmaGridFullProfix[id % 100]+(Math.floor(id / 100))+"]<h4><h4>Effect: "+HokmaGridDesc[id]+"<br>Currently: "+getProfix(data, id)+format(getEffect(data, id))
        },
        onClick(data, id) {
            player.Hkm.timeThroem = player.Hkm.timeThroem.sub(HokmaGridC[id])
            player[this.layer].grid[id]++
        },
        getDisplay(data, id) {
            return '<h1 style="font-size:25px">'+HokmaGridProfix[id % 100]+(Math.floor(id / 100))+"<h3><br><br>Cost: "+HokmaGridC[id]+' Time Threoms'
        },
        getStyle(data, id){
            let color = HokmaColor[id % 100]
            if (data <= 0) return {'background-color': "#000000",   color: "white", 'border-color': color,'border-radius': "5px", height: "100px", width: "100px"}
            else return {'background-color': color,   color: "white", 'border-color': color,'border-radius': "5px", height: "100px", width: "100px"}
        },
    },
    buyables:{
        'Hkm-t1': {
            title() {return '<h3>[Hkm-t1] X-axis Time Compressor<br>'},
            display() {return 'Create a new time compressor.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Cost: "+format(this.cost())+" Hokma points"},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(100),Decimal.pow(x,1.2)).mul(10000)
                return cost
            },
            buy(){
                player.Hkm.points = player.Hkm.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'grey', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px grey'}
            }
        },
        'Hkm-t2': {
            title() {return '<h3>[Hkm-t2] Y-axis Time Compressor<br>'},
            display() {return 'Create a new time compressor.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Cost: "+format(this.cost())+" Kether points"},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(1e8),Decimal.pow(4,x)).mul('1e340')
                if(hasAchievement('Ain','Hkm-15')) cost = Decimal.pow(n(1e10),Decimal.pow(x,2)).mul('1e340')
                if(hasUpgrade('Ktr','Ktr-23')) cost = cost.div('1e3000')
                if(cost.gte('1e3200')) cost = cost.mul(cost.div('1e3200').pow(4))
                return cost
            },
            buy(){
                player.Ktr.points = player.Ktr.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'grey', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px grey'}
            }
        },
        'Hkm-t3': {
            title() {return '<h3>[Hkm-t3] Z-axis Time Compressor<br>'},
            display() {return 'Create a new time compressor.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Cost: "+format(this.cost())+" Memory crystals"},
            canAfford() {return player.Ktr.memoryCrystal.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.1)).mul(1e24)
                if(hasUpgrade('Hkm','Hkm-10')) cost = cost.div(10000)
                return cost
            },
            buy(){
                player.Ktr.memoryCrystal = player.Ktr.memoryCrystal.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'grey', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px grey'}
            }
        },
        'Hkm-f1': {
            title() {return '<h3>[Hkm-f1] Milli-foem<br>'},
            display() {return 'Reduce the requirement of the next ark.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: /"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Pe-boxes"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.pow(1e85,Decimal.pow(x,0.8))
                return eff
            },
            cost(x){
                if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(100)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
                return cost
            },
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px #00dddd','height':'150px'}
            }
        },
        'Hkm-f2': {
            title() {return '<h3>[Hkm-f2] Micro-foem<br>'},
            display() {return 'Strengthen the time-space grid.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: +"+format(this.effect().mul(100))+"%<br>Cost: "+format(this.cost())+" Pe-boxes"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.div(x,100)
                return eff
            },
            cost(x){
                if (x.gte(20)) x = x.pow(x.div(20))
				let cost = Decimal.pow(15, x).mul(200)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
                return cost
            },
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px #00dddd','height':'150px'}
            }
        },
        'Hkm-f3': {
            title() {return '<h3>[Hkm-f3] Nano-foem<br>'},
            display() {return 'Multiply solar energy gain.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ×"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Pe-boxes"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.pow(6e8,Decimal.pow(x,0.95))
                return eff
            },
            cost(x){
                if (x.gte(20)) x = x.pow(x.div(20))
				let cost = Decimal.pow(150, x).mul(1000)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
                return cost
            },
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px #00dddd','height':'150px'}
            }
        },
        'Hkm-f4': {
            title() {return '<h3>[Hkm-f4] Pico-foem<br>'},
            display() {return 'Make the Pe-box transformation speed faster.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ×"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Pe-boxes"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.pow(1.35,x)
                return eff
            },
            cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(1000)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
				return cost.floor()
			},
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px #00dddd','height':'150px'}
            }
        },
        'Hkm-f5': {
            title() {return '<h3>[Hkm-f5] Femto-foem<br>'},
            display() {return 'Make the effect of Pe-box massively better.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ^"+format(this.effect())+"<br>Cost: "+format(this.cost())+" time energy"},
            canAfford() {return player.Hkm.timeEnergy.gte(this.cost())},
            cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e6, x).mul(1e29)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
				return cost.floor()
			},
            effect(x) {
				let eff = x.mul(0.4).add(1).cbrt().min(1.60)
				return eff;
			},
            buy(){
                player.Hkm.timeEnergy = player.Hkm.timeEnergy.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,gold 0px,gold 40px,yellow 40px,yellow 80px)', 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow','height':'150px'}
            }
        },
        'Hkm-f6': {
            title() {return '<h3>[Hkm-f6] Atto-foem<br>'},
            display() {return 'Decrease the negative effect of Ne-boxes.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ^"+format(this.effect())+"<br>Cost: "+format(this.cost())+" time energy"},
            canAfford() {return player.Hkm.timeEnergy.gte(this.cost())},
            cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e10, x).mul(1e40)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
				return cost.floor()
			},
			effect(x) {
				let eff = x.mul(0.02).add(1).recip()
				return eff;
			},
            buy(){
                player.Hkm.timeEnergy = player.Hkm.timeEnergy.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,gold 0px,gold 40px,yellow 40px,yellow 80px)', 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow','height':'150px'}
            }
        },
        'Hkm-b1': {
            title() {return '<h3>[Hkm-b1] Battery Mk.1EZ<br>'},
            display() {return 'Add 0.1 to exp of Pe-box effect and time foem effect.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: +"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Pe-box"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            cost(x) {
				return Decimal.pow(1e4,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).sub(2).max(0).pow(1.05)).mul(1e7).max(1e7).div(buyableEffect('Hkm','Hkm-fb-1-4')).div(buyableEffect('Hkm','Hkm-fb-2-4')).div(buyableEffect('Hkm','Hkm-fb-3-4')).div(buyableEffect('Hkm','Hkm-fb-4-4'))
			},
			effect(x) {
                if(x.gte(3)) x = softcap(x,'root',n(3),3)
				let eff = x.mul(0.1)
                if(hasMilestone('Hkm','Hkm-20')) eff = eff.mul(2)
                return eff
			},
            buy(){
                batteryReset()
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold'}}
                else return {'background': GlowingColor('#ffaa00',10,'#ffdd00'), 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow'}
            }
        },
        'Hkm-b2': {
            title() {return '<h3>[Hkm-b2] Battery Mk.2HD<br>'},
            display() {return 'Sqaure the time destruction threshold.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: ^"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Pe-box"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            cost(x) {
				return Decimal.pow(1e4,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).sub(2).max(0).pow(1.05)).mul(1e7).max(1e7).div(buyableEffect('Hkm','Hkm-fb-1-4')).div(buyableEffect('Hkm','Hkm-fb-2-4')).div(buyableEffect('Hkm','Hkm-fb-3-4')).div(buyableEffect('Hkm','Hkm-fb-4-4'))
			},
			effect(x) {
				let eff = Decimal.pow(2,x)
                if(hasAchievement('Ain','Hkm-20')) eff = eff.mul(2)
                return eff
			},
            buy(){
                batteryReset()
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold'}}
                else return {'background': GlowingColor('#ffaa00',10,'#ffdd00'), 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow'}
            }
        },
        'Hkm-b3': {
            title() {return '<h3>[Hkm-b3] Battery Mk.3IN<br>'},
            display() {return 'Divide the base in the formula of Ne-box effect.<br><br>Amount: '+getBuyableAmount(this.layer,this.id)+"<br>Effect: /"+format(this.effect())+"<br>Cost: "+format(this.cost())+" Pe-box"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            cost(x) {
				return Decimal.pow(1e4,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).sub(2).max(0).pow(1.05)).mul(1e7).max(1e7).div(buyableEffect('Hkm','Hkm-fb-1-4')).div(buyableEffect('Hkm','Hkm-fb-2-4')).div(buyableEffect('Hkm','Hkm-fb-3-4')).div(buyableEffect('Hkm','Hkm-fb-4-4'))
			},
			effect(x) {
				let eff = Decimal.pow(1e3,Decimal.pow(3,x)).div(1000)
                return eff
			},
            buy(){
                batteryReset()
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold'}}
                else return {'background': GlowingColor('#ffaa00',10,'#ffdd00'), 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow'}
            }
        },
        'Hkm-fb-1-4': {
            title() {return 'Coal Battery Ft.Pst1<br>'},
            display() {return "Reduce the cost of next eternal battery by /"+format(this.effect())+''},
            canAfford() {return false},
            cost(x) {
				return Decimal.pow(2,x).mul(10)
			},
			effect(x) {
				let eff = Decimal.pow(9*(hasMilestone('Hkm','Hkm-21')? 2 : 1),x)
                return eff
			},
            buy(){
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                return {'background': GlowingColor('#444444',10,'#666666'),'height':'80px','width':'200px','color':'white','border-color':GlowingColor('#444444',10,'#666666'),'font-size':'10px','border-radius':'0px'}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            },
        },
        'Hkm-fb-2-4': {
            title() {return 'Alchemy Battery Ft.Prs2<br>'},
            display() {return "Reduce the cost of next eternal battery by /"+format(this.effect())+''},
            canAfford() {return false},
            cost(x) {
				return Decimal.pow(3,x).mul(10)
			},
			effect(x) {
				let eff = Decimal.pow(81*(hasMilestone('Hkm','Hkm-21')? 2 : 1),x)
                if(hasAchievement('Ain','Hkm-22')) eff = eff.mul(81)
                if(hasUpgrade('Ktr','Ktr-25')) eff = eff.mul(400)
                return eff
			},
            buy(){
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                return {'background': GlowingColor('#660000',7,'#aa0000'),'height':'80px','width':'200px','color':'white','border-color':GlowingColor('#770000',7,'#bb0000'),'font-size':'10px','border-radius':'0px'}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(2)
            },
        },
        'Hkm-fb-3-4': {
            title() {return 'Leaf Battery Ft.Ftr3<br>'},
            display() {return "Reduce the cost of next eternal battery by /"+format(this.effect())+''},
            canAfford() {return false},
            cost(x) {
				return Decimal.pow(4,x).mul(10)
			},
			effect(x) {
				let eff = Decimal.pow(729*(hasMilestone('Hkm','Hkm-21')? 2 : 1),x)
                if(hasAchievement('Ain','Hkm-24')) eff = eff.mul(729)
                if(hasMilestone('Hkm','Hkm-20')) eff = eff.mul(729)
                return eff
			},
            buy(){
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                return {'background': GlowingColor('#006600',5,'#00aa00'),'height':'80px','width':'200px','color':'white','border-color':GlowingColor('#007700',5,'#00bb00'),'font-size':'10px','border-radius':'0px'}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(3)
            },
        },
        'Hkm-fb-4-4': {
            title() {return 'Aqua Battery Ft.Byd4<br>'},
            display() {return "Reduce the cost of next eternal battery by /"+format(this.effect())+''},
            canAfford() {return false},
            cost(x) {
				return Decimal.pow(5,x).mul(10)
			},
			effect(x) {
				let eff = Decimal.pow(6561*(hasMilestone('Hkm','Hkm-21')? 2 : 1),x)
                if(hasAchievement('Ain','Hkm-26')) eff = eff.mul(6561)
                if(hasMilestone('Hkm','Hkm-21')) eff = eff.mul(6561)
                return eff
			},
            buy(){
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                return {'background': GlowingColor('#222266',3,'#3333aa'),'height':'80px','width':'200px','color':'white','border-color':GlowingColor('#222277',3,'#3333bb'),'font-size':'10px','border-radius':'0px'}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(4)
            },
        },
    },
    clickables:{
        'Hkm-tr1':{
            title() {return "Respec"},
            display() {return "Respec all gridables in Space-Time grid and take back all time throems."},
            canClick() {return true},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px grey', 'background': `repeating-linear-gradient(90deg, grey 0, grey 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'150px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'150px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                for (id in player.Hkm.grid){
                    player.Hkm.grid[id] = 0
                }
                player.Hkm.timeThroem = player.Hkm.totalTimeThroem.sub(player.Hkm.batteryThroem)
                player.Hkm.gridTime = n(0)
            },
            unlocked(){return hasMilestone('Hkm','Hkm-13')}
        },
        'Hkm-f1':{
            title() {return "Get +1 time foem"},
            display() {return "<br>Requires "+format(tmp.Hkm.foemReq)+" time energy. <br>Resetting this to get time foem resets all your time throems and energy."},
            canClick() {return player.Hkm.timeEnergy.gte(tmp.Hkm.foemReq)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #444','background-color':`black`, 'color':'white', 'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#444'}
                else return {'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'#444','margin-left':'5px'}
            },
            onClick() {
                player.Hkm.foems = player.Hkm.foems.add(1)
                player.Hkm.timeEnergy = n(0)
            },
        },
        'Hkm-b1':{
            title() {return "Sell One"},
            canClick() {return getBuyableAmount('Hkm','Hkm-b1').gte(1)},
            style(){
                if(this.canClick()) return {'background': `gold`, 'color':'black', 'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','border-color':'yellow'}
                else return {'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'yellow'}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b1',getBuyableAmount('Hkm','Hkm-b1').sub(1))
            },
        },
        'Hkm-b2':{
            title() {return "Sell One"},
            canClick() {return getBuyableAmount('Hkm','Hkm-b2').gte(1)},
            style(){
                if(this.canClick()) return {'background': `gold`, 'color':'black', 'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','border-color':'yellow'}
                else return {'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'yellow'}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b2',getBuyableAmount('Hkm','Hkm-b2').sub(1))
            },
        },
        'Hkm-b3':{
            title() {return "Sell One"},
            canClick() {return getBuyableAmount('Hkm','Hkm-b3').gte(1)},
            style(){
                if(this.canClick()) return {'background': `gold`, 'color':'black', 'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','border-color':'yellow'}
                else return {'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'yellow'}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b3',getBuyableAmount('Hkm','Hkm-b3').sub(1))
            },
        },
        'Hkm-fb-1-1':{
            title() {return "▼"},
            canClick() {return getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').gte(1)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#444444',10,'#666666'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#333333',10,'#555555')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#444444',10,'#666666'),'border-color':GlowingColor('#333333',10,'#555555')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').sub(1))
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            }
        },
        'Hkm-fb-1-2':{
            title() {return "Generation "+getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1)+"<br>Gen up cost: "+formatWhole(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost)+" time threoms"},
            canClick() {return false},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#444444',10,'#666666'), 'color':'white', 'min-height':'80px', 'width':'200px','border-radius':'0px','font-size':'10px','border-color':GlowingColor('#333333',10,'#555555')}
                else return {'min-height':'80px', 'width':'200px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#444444',10,'#666666'),'border-color':GlowingColor('#333333',10,'#555555')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b3',getBuyableAmount('Hkm','Hkm-b3').sub(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            }
        },
        'Hkm-fb-1-3':{
            title() {return "▲"},
            canClick() {return player.Hkm.timeThroem.gte(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#444444',10,'#666666'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#333333',10,'#555555')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#444444',10,'#666666'),'border-color':GlowingColor('#333333',10,'#555555')}
            },
            onClick() {
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            }
        },
        'Hkm-fbl-2':{
            title() {return "[!!! Low Voltage !!!] Alchemy Battery Ft.Prs2<br><br>Let your weakest eternal battery reach Lv.2 to enable this."},
            canClick() {return false},
            style(){
                return {'min-height':'80px', 'width':'560px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#000000',7,'#bb0000'),'border':'3px dotted '+GlowingColor('#000000',7,'#aa0000')}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().lt(2)
            }
        },
        'Hkm-fb-2-1':{
            title() {return "▼"},
            canClick() {return getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').gte(1)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#660000',7,'#aa0000'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#770000',7,'#bb0000')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#660000',7,'#aa0000'),'border-color':GlowingColor('#770000',7,'#bb0000')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').sub(1))
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(2)
            }
        },
        'Hkm-fb-2-2':{
            title() {return "Generation "+getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1)+" / 8<br>Gen up cost: "+formatWhole(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost)+" time threoms"},
            canClick() {return false},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#660000',7,'#aa0000'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'10px','border-color':GlowingColor('#770000',7,'#bb0000')}
                else return {'min-height':'80px', 'width':'200px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#660000',7,'#aa0000'),'border-color':GlowingColor('#770000',7,'#bb0000')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b3',getBuyableAmount('Hkm','Hkm-b3').sub(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(2)
            }
        },
        'Hkm-fb-2-3':{
            title() {return "▲"},
            canClick() {return player.Hkm.timeThroem.gte(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost) && getBuyableAmount('Hkm','Hkm-fb-2-4').lt(7)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#660000',7,'#aa0000'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#770000',7,'#bb0000')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#660000',7,'#aa0000'),'border-color':GlowingColor('#770000',7,'#bb0000')}
            },
            onClick() {
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(2)
            }
        },
        'Hkm-fbl-3':{
            title() {return "[!!! Low Voltage !!!] Leaf Battery Ft.Ftr3<br><br>Let your weakest eternal battery reach Lv.3 to enable this."},
            canClick() {return false},
            style(){
                return {'min-height':'80px', 'width':'560px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#000000',5,'#00bb00'),'border':'3px dotted '+GlowingColor('#000000',5,'#00aa00')}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().lt(3) && minBatteryLevel().gte(2)
            }
        },
        'Hkm-fb-3-1':{
            title() {return "▼"},
            canClick() {return getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').gte(1)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#006600',5,'#006600'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#007700',5,'#00bb00')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#006600',5,'#006600'),'border-color':GlowingColor('#007700',5,'#00bb00')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').sub(1))
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(3)
            }
        },
        'Hkm-fb-3-2':{
            title() {return "Generation "+getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1)+" / 8<br>Gen up cost: "+formatWhole(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost)+" time threoms"},
            canClick() {return false},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#006600',5,'#006600'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'10px','border-color':GlowingColor('#007700',5,'#00bb00')}
                else return {'min-height':'80px', 'width':'200px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#006600',5,'#006600'),'border-color':GlowingColor('#007700',5,'#00bb00')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b3',getBuyableAmount('Hkm','Hkm-b3').sub(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(3)
            }
        },
        'Hkm-fb-3-3':{
            title() {return "▲"},
            canClick() {return player.Hkm.timeThroem.gte(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost) && getBuyableAmount('Hkm','Hkm-fb-2-4').lt(7)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#006600',5,'#006600'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#007700',5,'#00bb00')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#006600',5,'#006600'),'border-color':GlowingColor('#007700',5,'#00bb00')}
            },
            onClick() {
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(3)
            }
        },
        'Hkm-fbl-4':{
            title() {return "[!!! Low Voltage !!!] Aqua Battery Ft.Byd4<br><br>Let your weakest eternal battery reach Lv.4 to enable this."},
            canClick() {return false},
            style(){
                return {'min-height':'80px', 'width':'560px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#000000',3,'#3333aa'),'border':'3px dotted '+GlowingColor('#000000',3,'#3333bb')}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().lt(4) && minBatteryLevel().gte(3)
            }
        },
        'Hkm-fb-4-1':{
            title() {return "▼"},
            canClick() {return getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').gte(1)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#222266',3,'#3333aa'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#222277',3,'#3333bb')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#222266',3,'#3333aa'),'border-color':GlowingColor('#222277',3,'#3333bb')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').sub(1))
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(4)
            }
        },
        'Hkm-fb-4-2':{
            title() {return "Generation "+getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1)+" / 8<br>Gen up cost: "+formatWhole(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost)+" time threoms"},
            canClick() {return false},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#222266',3,'#3333aa'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'10px','border-color':GlowingColor('#222277',3,'#3333bb')}
                else return {'min-height':'80px', 'width':'200px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#222266',3,'#3333aa'),'border-color':GlowingColor('#222277',3,'#3333bb')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b3',getBuyableAmount('Hkm','Hkm-b3').sub(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(4)
            }
        },
        'Hkm-fb-4-3':{
            title() {return "▲"},
            canClick() {return player.Hkm.timeThroem.gte(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost) && getBuyableAmount('Hkm','Hkm-fb-2-4').lt(7)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#222266',3,'#3333aa'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#222277',3,'#3333bb')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#222266',3,'#3333aa'),'border-color':GlowingColor('#222277',3,'#3333bb')}
            },
            onClick() {
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(4)
            }
        },
        'Hkm-bk1':{
            title() {return "[Common] Unknown blueprint"},
            display() {return "<h3>Collect 3× wood.(1s)"},
            canClick() {return false},
            style(){
                return {'background-color': '#b1b1b1',
                    'opacity': '1',
                    'background-image':  'linear-gradient(#9c9c9c 2px, transparent 2px), linear-gradient(90deg, #9c9c9c 2px, transparent 2px), linear-gradient(#9c9c9c 1px, transparent 1px), linear-gradient(90deg, #9c9c9c 1px, #b1b1b1 1px)',
                    'background-size': '50px 50px, 50px 50px, 10px 10px, 10px 10px',
                    'background-position': '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
                    'height':'100px',
                    'width':'300px',
                    'border-radius':'5px',
                    'font-size':'13px',
                    'border-width':'4px'
            }},
            unlocked(){return true}
        },
        'Hkm-bk2':{
            title() {return "[Common] Unknown blueprint"},
            display() {return "<h3>Collect 3× wood.(1s)"},
            canClick() {return false},
            style(){
                return {'background-color': '#b1b1b1',
                    'opacity': '1',
                    'background-image':  'linear-gradient(#9c9c9c 2px, transparent 2px), linear-gradient(90deg, #9c9c9c 2px, transparent 2px), linear-gradient(#9c9c9c 1px, transparent 1px), linear-gradient(90deg, #9c9c9c 1px, #b1b1b1 1px)',
                    'background-size': '50px 50px, 50px 50px, 10px 10px, 10px 10px',
                    'background-position': '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
                    'height':'100px',
                    'width':'300px',
                    'border-radius':'5px',
                    'font-size':'13px',
                    'border-width':'4px'
            }},
            unlocked(){return true}
        },
        'Hkm-bk3':{
            title() {return "[Transcendent] Unknown blueprint"},
            display() {return "<h3>Collect 10,000× cobalt.(1s)"},
            canClick() {return false},
            style(){
                return {'background-color': 'cyan',
                    'opacity': '1',
                    'background-image':  'linear-gradient(#00dddd 2px, transparent 2px), linear-gradient(90deg, #00dddd 2px, transparent 2px), linear-gradient(#00dddd 1px, transparent 1px), linear-gradient(90deg, #00dddd 1px, #00eeee 1px)',
                    'background-size': '50px 50px, 50px 50px, 10px 10px, 10px 10px',
                    'background-position': '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
                    'height':'100px',
                    'width':'300px',
                    'border-radius':'5px',
                    'font-size':'13px',
                    'border-width':'4px'
            }},
            unlocked(){return true}
        },
    },
    effect(){
        if(!hasMilestone('Hkm','Hkm-1')) return n(1)
        let eff = n(2).mul(player.Hkm.points.root(hasUpgrade('Hkm','Hkm-2')? 1 : 2))
        if(hasMilestone('Hkm','Hkm-1')) eff = eff.mul(tmp.Ain.effect)
        if(player.Hkm.storyUnlocked >= 2) eff = eff.mul(tmp.Hkm.timeThroemEff)
        if(hasGrid('Hkm',102)) eff = eff.mul(getEffect('',102))
        if(hasGrid('Hkm',202)) eff = eff.mul(getEffect('',202))
        if(hasGrid('Hkm',302)) eff = eff.mul(getEffect('',302))
        if(hasGrid('Hkm',402)) eff = eff.mul(getEffect('',402))
        if(hasGrid('Hkm',502)) eff = eff.mul(getEffect('',502))
        return eff
    },
    challenges:{
        'Hkm-bk1':{
            name() {return "Backward Clock "+((this.locked())?'(Locked)':"(Inactive)")},
            text() {return "♀"},
            locked() {return player.Hkm.points.lt('1e225') || player.points.lt('1e4050') || player.Hkm.timeEnergy.lt('1e167')},
            exp: "",
            color: 'grey',
            challengeDescription() {
                let desc = "↑↑Click the symbol of current saphirah to start rebuilding the backward clock!<br>——————————————————<br>Coming soon."
                return desc
            },
            style() {
                if(!this.locked()) return {'background-color':'#888888','box-shadow':'0px 0px 3px 3px #888888','height':'400px'}
                else return {'background-color':'#444444','height':'400px'}
            },
            onEnter() {
                player.Hkm.activeChallenge = ''
            },
        },
    },
    tabFormat:{
        'Time Machine':{
            content:[
                'main-display',
                'prestige-button',
                'blank',
                ['display-text',function(){if(player.Hkm.points.lt(10)) return '<h4>'+quickColor("[Hints] Reach 1e20 memory crystals and 1e330 stallar points to reset for 1 hokma point. You will LOSE ALL PROGRESS IN THE KETHER LAYER!!",'grey')}],
                'blank',
                'milestones',
            ]
        },
        'Silver Moon Lake':{
            content:[
                'main-display',
                ["row",[["upgrade","Hkm-1"],["upgrade","Hkm-2"],["upgrade","Hkm-3"],["upgrade","Hkm-4"],["upgrade","Hkm-5"]]],
                ["row",[["upgrade","Hkm-6"],["upgrade","Hkm-7"],["upgrade","Hkm-8"],["upgrade","Hkm-9"],["upgrade","Hkm-10"]]],
                ["row",[["upgrade","Hkm-11"],["upgrade","Hkm-12"],["upgrade","Hkm-13"],["upgrade","Hkm-14"],["upgrade","Hkm-15"]]],
            ],
            unlocked(){return player.Hkm.storyUnlocked >= 2},
        },
        "Time-Space Grid":{
            content:[
                ["row",[["buyable","Hkm-t1"],["buyable","Hkm-t2"],["buyable","Hkm-t3"]]],
                'blank',
                ['display-text',function(){return '<h4>Total compressors: '+quickBigColor(formatWhole(tmp.Hkm.totalCompressor),'grey') +' , They are generating '+quickBigColor('+'+format(tmp.Hkm.compressorEff),'grey')+' time energy per second.'}],
                ['bar','Hkm-t1'],
                ['display-text',function(){return '<h4>Unused time throems: '+quickBigColor(formatWhole(player.Hkm.timeThroem),'grey') +' , This provides a '+quickBigColor('×'+format(tmp.Hkm.timeThroemEff),'grey')+' effect to Hokma’s effect.'}],
                ['display-text',function(){return '<h4>Time-Space grid strength: '+quickBigColor(format(tmp.Hkm.gridStrength.mul(100))+"%",'grey') +' , Influence all gridable effect and increases over time after respec.'}],
                'blank',
                ['clickable','Hkm-tr1'],
                'blank',
                'grid',
        ],
            unlocked(){return player.Hkm.storyUnlocked >= 2},
            buttonStyle(){return {'background':'grey','color':'black','box-shadow':'2px 2px 2px grey'}}
        },
        "Time Foem":{
            content:[
                ['display-text',function(){return '<h4>You have '+quickBigColor(formatWhole(player.Hkm.foems),'#555') +' time foems. This provides a '+quickBigColor('×'+format(tmp.Hkm.foemEff1),'#555')+' to essence and kether points gain, as well as giving '+quickBigColor('+'+formatWhole(tmp.Hkm.foemEff2)+"/sec",'#f00')+' Ne-box per second.(Can be transfered to Pe-Box by time compressors)'}],
                ['display-text',function(){return '<h4>Your time compressors are transfering '+quickBigColor('+'+formatWhole(tmp.Hkm.boxGain)+'/sec','turquoise') +' Pe-Boxes from Ne-Boxes per second.'}],
                "blank",
                ['clickable','Hkm-f1'],
                "blank",
                ['display-text',function(){return '<h4>You have '+quickBigColor(formatWhole(player.Hkm.PeBox),'turquoise') +' Pe-Boxes. Raised to a power of '+quickBigColor(format(tmp.Hkm.PeBoxExp),'turquoise')+', translated to a '+quickBigColor('×'+format(tmp.Hkm.PeBoxEff),'turquoise')+' boost to hokma points gain.'}],
                ['display-text',function(){return '<h4>You have '+quickBigColor(formatWhole(player.Hkm.NeBox),'red') +' Ne-Boxes, nerf the effect of Pe-Box to '+quickBigColor(format(tmp.Hkm.NeBoxEff.mul(100))+'%','red')}],
                ['display-text',function(){if(hasUpgrade('Ktr','Ktr-21')) return '<h4>You have '+quickBigColor(formatWhole(tmp.Hkm.Sebox),'yellow') +' Se-Boxes, itself multiplies the 1st effect of foem and reduce the negative effect of Ne-box.'}],
                ['bar','Hkm-f1'],
                ["row",[["buyable","Hkm-f1"],["buyable","Hkm-f2"],["buyable","Hkm-f3"]]],
                ["row",[["buyable","Hkm-f4"],["buyable","Hkm-f5"],["buyable","Hkm-f6"]]],
        ],
            unlocked(){return player.Hkm.storyUnlocked >= 6},
            buttonStyle(){return {'background':'#666666','color':'black','box-shadow':'2px 2px 2px #666666'}}
        },
        "Eternal Battery":{
            content:[
            ['display-text',function(){return '<h4>You have '+quickBigColor(formatWhole(getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3'))),GlowingColor('#ffaa00',10,'#ffdd00')) +' eternal batteries. Divides the cost of all foems by '+quickBigColor('/'+format(tmp.Hkm.BatteryEff1),GlowingColor('#ff8800',10,'#ffaa00'))+', as well as giving '+quickBigColor('×'+formatWhole(tmp.Hkm.BatteryEff2),GlowingColor('#ff6600',10,'#ff8800'))+' to essence and kether points gain.'}],
            ["row",[["buyable","Hkm-b1"],["buyable","Hkm-b2"],["buyable","Hkm-b3"]]],
            ["row",[["clickable","Hkm-b1"],["clickable","Hkm-b2"],["clickable","Hkm-b3"]]],
            'blank',
            ["row",[["clickable","Hkm-fb-1-1"],["clickable","Hkm-fb-1-2"],["clickable","Hkm-fb-1-3"],["buyable","Hkm-fb-1-4"]]],
            ["clickable","Hkm-fbl-2"],
            ["row",[["clickable","Hkm-fb-2-1"],["clickable","Hkm-fb-2-2"],["clickable","Hkm-fb-2-3"],["buyable","Hkm-fb-2-4"]]],
            ["clickable","Hkm-fbl-3"],
            ["row",[["clickable","Hkm-fb-3-1"],["clickable","Hkm-fb-3-2"],["clickable","Hkm-fb-3-3"],["buyable","Hkm-fb-3-4"]]],
            ["clickable","Hkm-fbl-4"],
            ["row",[["clickable","Hkm-fb-4-1"],["clickable","Hkm-fb-4-2"],["clickable","Hkm-fb-4-3"],["buyable","Hkm-fb-4-4"]]],
        ],
            unlocked(){return player.Hkm.storyUnlocked >= 10},
            buttonStyle(){return {'background':GlowingColor('#ffaa00',10,'#ffdd00'),'color':'black','box-shadow':'2px 2px 2px orange','border-color':'orange'}}
        },
        "Backward Clock":{
            content:[
                ['bar','Hkm-bk1'],
                ['bar','Hkm-bk2'],
                ['bar','Hkm-bk3'],
                ['row',[["column", [["raw-html", function() {}],
                "blank",['display-text',function(){return '<h3>'}],
               ['column',["blank",["clickable",'Hkm-bk1'],["clickable",'Hkm-bk2'],["clickable",'Hkm-bk3'],["clickable",'Hkm-bk4']]],
               "blank",
               ],
               {
                   "color":"white",
                   "width":"300px",
                   "height":"400px",
                   "border-color":"#FFFFFF",
                   "border-width":"3px",
               },
            ],['challenge','Hkm-bk1']]],
            ],
            unlocked(){return player.Hkm.storyUnlocked >= 15},
            buttonStyle(){return {'background-color': '#b1b1b1', 'opacity': '1', 'background-image':  'linear-gradient(30deg, #9e9e9e 12%, transparent 12.5%, transparent 87%, #9e9e9e 87.5%, #9e9e9e), linear-gradient(150deg, #9e9e9e 12%, transparent 12.5%, transparent 87%, #9e9e9e 87.5%, #9e9e9e), linear-gradient(30deg, #9e9e9e 12%, transparent 12.5%, transparent 87%, #9e9e9e 87.5%, #9e9e9e), linear-gradient(150deg, #9e9e9e 12%, transparent 12.5%, transparent 87%, #9e9e9e 87.5%, #9e9e9e), linear-gradient(60deg, #9e9e9e77 25%, transparent 25.5%, transparent 75%, #9e9e9e77 75%, #9e9e9e77), linear-gradient(60deg, #9e9e9e77 25%, transparent 25.5%, transparent 75%, #9e9e9e77 75%, #9e9e9e77)', 'background-size': '20px 35px',
            'background-position': '0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px','box-shadow':'2px 2px grey','border-color':'grey','color':'black'}},
            style(){
                return {'background-color': '#111111', 'opacity': '1', 'background-image':  'linear-gradient(30deg, #212121 12%, transparent 12.5%, transparent 87%, #212121 87.5%, #212121), linear-gradient(150deg, #212121 12%, transparent 12.5%, transparent 87%, #212121 87.5%, #212121), linear-gradient(30deg, #212121 12%, transparent 12.5%, transparent 87%, #212121 87.5%, #212121), linear-gradient(150deg, #212121 12%, transparent 12.5%, transparent 87%, #212121 87.5%, #212121), linear-gradient(60deg, #21212177 25%, transparent 25.5%, transparent 75%, #21212177 75%, #21212177), linear-gradient(60deg, #21212177 25%, transparent 25.5%, transparent 75%, #21212177 75%, #21212177)', 'background-size': '20px 35px',
                    'background-position': '0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px','color':'black'}}
        },
    }
})

function ketherStory(){
    player.Ktr.newStory = false
    Modal.show({
		color: 'white',
		title() {if(player.Ktr.storyShowing < 100) return `<text style='color:#FFFFFF'>Kether's Quotes > Story `+player.Ktr.storyShowing+`</text>`
        else if(player.Ktr.storyShowing == 100) return `<text style='color:#FFFFFF'>Kether's Quotes > Mega Softcaps</text>`},
		text() {return tmp.Ktr.storyContent[player.Ktr.storyShowing].text},
		buttons:{
			1:{
				text:`01`,
                onClick(){
                    player.Ktr.storyShowing = 1
                },
                unlocked(){return true}
			},
            2:{
				text:`02`,
                onClick(){
                    player.Ktr.storyShowing = 2
                },
                unlocked(){return player.Ktr.storyUnlocked >= 1}
			},
            3:{
				text:`03`,
                onClick(){
                    player.Ktr.storyShowing = 3
                },
                unlocked(){return player.Ktr.storyUnlocked >= 2}
			},
            4:{
				text:`04`,
                onClick(){
                    player.Ktr.storyShowing = 4
                },
                unlocked(){return player.Ktr.storyUnlocked >= 3}
			},
            5:{
				text:`05`,
                onClick(){
                    player.Ktr.storyShowing = 5
                },
                unlocked(){return player.Ktr.storyUnlocked >= 5}
			},
            6:{
				text:`06`,
                onClick(){
                    player.Ktr.storyShowing = 6
                },
                unlocked(){return player.Ktr.storyUnlocked >= 6}
			},
            7:{
				text:`07`,
                onClick(){
                    player.Ktr.storyShowing = 7
                },
                unlocked(){return player.Ktr.storyUnlocked >= 7}
			},
		}
	})
}

function hokmaStory(){
    player.Hkm.newStory = false
    Modal.show({
		color: 'gray',
		title() {return `<text style='color:gray'>Hokma's Quotes > Story `+player.Hkm.storyShowing+`</text>`},
		text() {return tmp.Hkm.storyContent[player.Hkm.storyShowing].text},
		buttons:{
			1:{
				text:`01`,
                onClick(){
                    player.Hkm.storyShowing = 1
                },
                unlocked(){return true}
			},
            2:{
				text:`02`,
                onClick(){
                    player.Hkm.storyShowing = 2
                },
                unlocked(){return player.Hkm.storyUnlocked >= 1}
			},
            3:{
				text:`03`,
                onClick(){
                    player.Hkm.storyShowing = 3
                },
                unlocked(){return player.Hkm.storyUnlocked >= 2}
			},
            4:{
				text:`04`,
                onClick(){
                    player.Hkm.storyShowing = 4
                },
                unlocked(){return player.Hkm.storyUnlocked >= 3}
			},
            5:{
				text:`05`,
                onClick(){
                    player.Hkm.storyShowing = 5
                },
                unlocked(){return player.Hkm.storyUnlocked >= 4}
			},
            6:{
				text:`06`,
                onClick(){
                    player.Hkm.storyShowing = 6
                },
                unlocked(){return player.Hkm.storyUnlocked >= 5}
			},
            7:{
				text:`07`,
                onClick(){
                    player.Hkm.storyShowing = 7
                },
                unlocked(){return player.Hkm.storyUnlocked >= 6}
			},
            8:{
				text:`08`,
                onClick(){
                    player.Hkm.storyShowing = 8
                },
                unlocked(){return player.Hkm.storyUnlocked >= 7}
			},
            9:{
				text:`09`,
                onClick(){
                    player.Hkm.storyShowing = 9
                },
                unlocked(){return player.Hkm.storyUnlocked >= 8}
			},
            10:{
				text:`10`,
                onClick(){
                    player.Hkm.storyShowing = 10
                },
                unlocked(){return player.Hkm.storyUnlocked >= 9}
			},
            11:{
				text:`11`,
                onClick(){
                    player.Hkm.storyShowing = 11
                },
                unlocked(){return player.Hkm.storyUnlocked >= 10}
			},
            12:{
				text:`12`,
                onClick(){
                    player.Hkm.storyShowing = 12
                },
                unlocked(){return player.Hkm.storyUnlocked >= 11}
			},
            13:{
				text:`13`,
                onClick(){
                    player.Hkm.storyShowing = 13
                },
                unlocked(){return player.Hkm.storyUnlocked >= 13}
			},
            14:{
				text:`14`,
                onClick(){
                    player.Hkm.storyShowing = 14
                },
                unlocked(){return player.Hkm.storyUnlocked >= 14}
			},
		}
	})
}
addLayer("Ain", {
    name: "Ain", // This is optional, only used in a few places, If absent it just uses the layer id.
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        feature: 0,
        hkm4unlocked: false,
        hkm5unlocked: false,
        hkm6unlocked: false,
        bestReset: 999999,
    }},
    color: "pink",
    resource: "ain points",
    symbol(){return "Ain<sup>"+player.Ain.achievements.length},
    effect() {
        return Decimal.pow(n(2),player.Ain.points)
    },
    effectDescription() {
        return "Boosts Hokma's effect by "+quickBigColor(format(tmp.Ain.effect.mul(100))+"%","pink")
    },
    nodeStyle(){
        return {
            "border-color":"pink",
            "border-width":"3px",
            "background": "linear-gradient(135deg,pink 6%, white 99%)",
            "height": "70px",
            "width": "70px",
			"border-radius": "5px"
        }
    },
    achievements: {
        'Hkm-1':{
            name() {return "dB doll"},
            tooltip() { return 'Get a 2nd Hokma point.(+1 AP)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Hkm.points.gte(2)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-2':{
            name() {return "bid farewell to the outgoing year"},
            tooltip() { return 'Stay in Heart gate for a whole day.(Reality Time) +1 AP, best reset time of Hokma boosts itself gain.<br>Currently: ×'+format(n(15).div(player.Ain.bestReset+0.2).add(1).min(30))},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ktr.realTime.gte(86400)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-3':{
            name() {return "mopemope"},
            tooltip() { return 'Have 48 arks. (+1 AP, each ark after 46 multiplys hokma points gain by 2×.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ktr.ark.gte(48)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-4':{
            name() {return "Initialie"},
            tooltip() { return 'Do a hokma reset without reseting Kether‘s memory. (+1 AP, Bonus: Kether’s memory no longer have negative effects.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.hkm4unlocked}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-5':{
            name() {return "Dash"},
            tooltip() { return 'Do a hokma reset with at least one resource in Remote space is at lv0. (+1 AP, Bonus: Get 100% resource on hold when they’re getting >1%/s normally.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.hkm5unlocked}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-6':{
            name() {return "Demiurge"},
            tooltip() { return 'Do a hokma reset without respecing distant space upgrades. (+1 AP, Bonus: All distant upgrades costs nothing.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.hkm6unlocked}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-7':{
            name() {return "Arkhei"},
            tooltip() { return 'Do a hokma reset within 400ms. (+1 AP, Bonus: Gain 1000% Hokma points on reset per second.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.bestReset <= 0.4}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-8':{
            name() {return "Glaciaxion"},
            tooltip() { return 'Have 5 time throems. (+1 AP, Bonus: Ain effect also appeals to time energy gain.)'},
            done() { return player.Hkm.totalTimeThroem.gte(5)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-9':{
            name() {return "Sparkle New Life"},
            tooltip() { return 'Have your first gridable in time-space grid. (+1 AP)'},
            done() { return hasGrid('Hkm',101)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-10':{
            name() {return "Sultan Rage"},
            tooltip() { return 'Have two gridables in time-space grid in a single row. (+2 AP)'},
            done() { return hasGrid('Hkm',101) && hasGrid('Hkm',102)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-11':{
            name() {return "Cloud Girl"},
            tooltip() { return 'Have 3 gridables in time-space grid in a single row. (+2 AP)'},
            done() { return hasGrid('Hkm',101) && hasGrid('Hkm',102) && hasGrid('Hkm',103)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-12':{
            name() {return "Next Time"},
            tooltip() { return 'Get over 120% grid effect. (+2 AP)'},
            done() { return tmp.Hkm.gridStrength.gte(1.2)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-13':{
            name() {return "HumaN"},
            tooltip() { return 'Unlock time foem. (+2 AP)'},
            done() { return player.Hkm.storyUnlocked >= 6}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-14':{
            name() {return "Clock Paradox"},
            tooltip() { return 'Get over 1e1,000 stallar points. (+2 AP)'},
            done() { return player.Ktr.stallar.gte('1e1000')}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-15':{
            name() {return "Leave all behind"},
            tooltip() { return 'Get over 1e1,000^(99%) kether points. (+2 AP, make the Hkm-t2’s formula better.)'},
            done() { return player.Ktr.points.gte('1e990')}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-16':{
            name() {return "Eradication Catastrophe"},
            tooltip() { return 'Get 5 gridables in time-space grid in a row. (+2 AP, unlock some new kether upgrades.)'},
            done() { return tmp.Hkm.totalGrid >= 5}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-17':{
            name() {return "Colorful Days"},
            tooltip() { return 'Puchease Te4 in time-space grid. (+3 AP, Te2’s cost is reduced to 50%.)'},
            done() { return hasGrid('Hkm',404)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-18':{
            name() {return "Light"},
            tooltip() { return 'Have a eternity battery. (+3 AP)'},
            done() { return tmp.Hkm.BatteryEff2.gte(1e50)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-19':{
            name() {return "Rainy Heart"},
            tooltip() { return 'Have a coal battery. (+3 AP)'},
            done() { return getBuyableAmount('Hkm','Hkm-fb-1-4').gte(1)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-20':{
            name() {return "Khalid"},
            tooltip() { return 'Have 100 time throems. (+3 AP, get an extra eternal battery Mk.2HD and the foem constructors will never be reseted before Binah layer.)'},
            done() { return player.Hkm.timeThroem.gte(100)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-21':{
            name() {return "NYA!!!"},
            tooltip() { return 'Have 7 eternal batteries. (+3 AP)'},
            done() { return getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).gte(7)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-22':{
            name() {return "Aphasia"},
            tooltip() { return 'Enable the alchemy battery. (+3 AP, gain a free alchemy battery.)'},
            done() { return player.Hkm.storyUnlocked >= 13 && minBatteryLevel().gte(2)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-23':{
            name() {return "The hatred of the fireflies"},
            tooltip() { return 'Unlock all of Kether upgrades.(25 upgrades) (+4 AP)'},
            done() { return hasUpgrade('Ktr','Ktr-25')}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(4)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-24':{
            name() {return "Playground"},
            tooltip() { return 'Enable the leaf battery. (+4 AP, gain a free leaf battery and the amount of eternal batteries affects Ktr-21.)'},
            done() { return minBatteryLevel().gte(3)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(4)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-25':{
            name() {return "Broken Sky"},
            tooltip() { return 'Have 2<sup>7</sup> time throems. (+4 AP, sutract 20 from the cost of Te5.)'},
            done() { return player.Hkm.timeThroem.gte(128)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(4)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-26':{
            name() {return "Rubbish Sorting"},
            tooltip() { return 'Enable the aqua battery. (+4 AP, sutract 20 from the cost of Te3 again and gain a free aqua battery.)'},
            done() { return minBatteryLevel().gte(4)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(4)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-27':{
            name() {return "Dreamland"},
            tooltip() { return 'Have 15 eternal batteries. (+4 AP, the effect of Ktr-19 and Ktr-24 are also appealed to time energy gain.)'},
            done() { return getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).gte(15)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(4)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-28':{
            name() {return "Electron"},
            tooltip() { return 'Have 10×2<sup>4</sup> time throems. (+4 AP)'},
            done() { return player.Hkm.timeThroem.gte(160)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(4)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasMilestone('Hkm','Hkm-1')},
    tabFormat:{
        "Achievements":{
                content:[
                    "main-display",
                    "blank",
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[Stage 2-1] First Encounter of Star Feather Town<br>Unlock all achievement in this row to unlock Time Compressor (in Hokma layer).'}],
                    ['row',[["achievement",'Hkm-1'],["achievement",'Hkm-2'],["achievement",'Hkm-3'],["achievement",'Hkm-4'],["achievement",'Hkm-5'],["achievement",'Hkm-6'],["achievement",'Hkm-7']]],
                    "blank",
                    ],
                    {
                        "color":"black",
                        "width":"700px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#AAAAAA",
                    }],
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[Stage 2-2] The Cruelty Behind the Gate<br>Unlock all achievement in this row to unlock foem constructor!'}],
                    ['row',[["achievement",'Hkm-8'],["achievement",'Hkm-9'],["achievement",'Hkm-10'],["achievement",'Hkm-11'],["achievement",'Hkm-12'],["achievement",'Hkm-13'],["achievement",'Hkm-14']]],
                    "blank",
                    ],
                    {
                        "color":"black",
                        "width":"700px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#AAAAAA",
                    }],
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[Stage 2-3] Scar of the emptiness<br>Unlock all achievement in this row to unlock all sorts of fuel batteries!'}],
                    ['row',[["achievement",'Hkm-15'],["achievement",'Hkm-16'],["achievement",'Hkm-17'],["achievement",'Hkm-18'],["achievement",'Hkm-19'],["achievement",'Hkm-20'],["achievement",'Hkm-21']]],
                    "blank",
                    ],
                    {
                        "color":"black",
                        "width":"700px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#AAAAAA",
                    }],
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[Stage 2-4] Unstable timeline<br>Unlock all achievement in this row to unlock the ultimate challenge of Hokma!'}],
                    ['row',[["achievement",'Hkm-22'],["achievement",'Hkm-23'],["achievement",'Hkm-24'],["achievement",'Hkm-25'],["achievement",'Hkm-26'],["achievement",'Hkm-27'],["achievement",'Hkm-28']]],
                    "blank",
                    ],
                    {
                        'color':'black',
                        'background-color': '#c2c2c2',
                        'opacity': '1',
                        'background': 'linear-gradient(135deg, #afafaf55 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(225deg, #afafaf 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(315deg, #afafaf55 25%, transparent 25%) 0px 0/ 20px 20px, linear-gradient(45deg, #afafaf 25%, #c2c2c2 25%) 0px 0/ 20px 20px',          
                    }],
                ],
                buttonStyle() {return {"color":"#FFFFFF",
                "border-radius":"5px",
                "border-color":"#FFFFFF",
                "border-width":"2px",
                "background":"#000000",
                "background-image":
                "linear-gradient(#000 15px,transparent 0),linear-gradient(90deg,white 1px,transparent 0)",
                "background-size":"16px 16px,16px 16px",
                "box-shadow":"2px 2px 2px white"
                }}
            },
        },
})

function onReset(layer){
    if(layer == 'Hkm' && player.Hkm.resetTime < player.Ain.bestReset) player.Ain.bestReset = player.Hkm.resetTime
    if(layer == 'Hkm' && player.Ktr.resetedMemory == false) player.Ain.hkm4unlocked = true
    if(layer == 'Hkm' && player.Ktr.respeced == false) player.Ain.hkm6unlocked = true
    if(layer == 'Hkm' && (tmp.Ktr.celestialLevel[0].lt(1)||tmp.Ktr.celestialLevel[1].lt(1)||tmp.Ktr.celestialLevel[2].lt(1)||tmp.Ktr.celestialLevel[3].lt(1)||tmp.Ktr.celestialLevel[4].lt(1))) player.Ain.hkm5unlocked = true
}

function getEffect(data, id){
    let effect = n(0)
    if(id == 101) effect = tmp.Ktr.celestialLevel[4].add(1).pow(4)
    if(id == 201) effect = tmp.Ktr.celestialLevel[1].add(1).pow(5)
    if(id == 301) effect = n(1e12)
    if(id == 401) effect = Decimal.pow(25,player.Ktr.upgrades.length)
    if(id == 501) effect = n(1e52)
    if(id == 102) effect = tmp.Ktr.celestialLevel[3].add(1).pow(4)
    if(id == 202) effect = tmp.Ktr.celestialLevel[0].add(1).pow(5)
    if(id == 302) effect = n(1e14)
    if(id == 402) effect = Decimal.pow(60,player.Ktr.upgrades.length)
    if(id == 502) effect = n(1e68)
    if(id == 103) effect = n(0.03)
    if(id == 203) effect = n(0.05)
    if(id == 303) effect = n(0.075)
    if(id == 403) effect = n(0.09)
    if(id == 503) effect = n(0.11)
    if(id == 104) effect = n(1e4).pow(hasGrid('Hkm',404)? getEffect('',404):1)
    if(id == 204) effect = Decimal.pow(7,tmp.Hkm.totalGrid).min(1e9)
    if(id == 304) effect = player.points.add(1).log10().pow(3)
    if(id == 404) effect = n(3)
    if(id == 504) effect = Decimal.pow(12,player.Ktr.upgrades.length)
    if((id % 100 != 3) && (id % 100 != 5)) effect = effect.pow(tmp.Hkm.gridStrength)
    if(id % 100 == 5) effect = n(1.05)
    if(id == 404) effect = effect.min(6)
    return effect
}

function hasGrid(layer,id){
    return player[layer].grid[id] >= 1
}

function getProfix(data, id){
    let profix = '×'
    if(id % 100 == 3) profix = '+'
    if(id == 104) profix = '/'
    if(id == 404 || (id % 100 == 5)) profix = '^'
    return profix
}

function batteryReset(){
    if(hasAchievement('Ain','Hkm-20')) return
    for(var i = 1; i <= 6; i++){
        setBuyableAmount('Hkm','Hkm-f'+i,n(0))
    }
    player.Hkm.foems = n(0)
    player.Hkm.PeBox = n(0)
    player.Hkm.NeBox = n(0)
    player.Hkm.timeEnergy = n(0)
}

function minBatteryLevel(){
    return getBuyableAmount('Hkm','Hkm-b1').min(getBuyableAmount('Hkm','Hkm-b2')).min(getBuyableAmount('Hkm','Hkm-b3'))
}