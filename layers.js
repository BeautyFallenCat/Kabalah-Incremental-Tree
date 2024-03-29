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
    }},
    resetsNothing(){
        return player.Ktr.storyUnlocked >= 9
    },
    celestialLevel(){
        let level = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            level[i] = player.Ktr.solarPower[i].add(1).log(tmp.Ktr.celestialRoot[i]).floor()
        }
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
        if(player.Ktr.ark.gte(40) && player.Ktr.ark.lt(70)) req = new Decimal(1e25).pow(player.Ktr.ark.sub(39)).mul(1e210)
        if(tmp.Ktr.celestialLevel[1].gte(1)) req = req.div(tmp.Ktr.clickables['Ktr-r-c2'].effect1)
        return n(req)
    },
    stallarEff(){
        let eff = player.Ktr.stallar.add(2.7).log(2.7)
        if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[5].start)) eff = eff.pow(4.5)
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
        let antimatter = Decimal.pow(2,player.Ktr.universalTime.sub(10)).sub(1).max(0)
        return antimatter
    },
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "kether points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
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
        14: "unlock white dwarf, and auto buy every star.",
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
            desc:'Points gain exp',
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
                <i style='color: #444444'>[Locked] Reach 200,000 essences to continue.(No exaggeration, it is indeed 200 thousand) This may require much stronger upgrade effect.</i>`
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
                <text style='color:#999999'>[Illustration] Kether's stargazing platform was parked in front of Nuannuan, and the seawater seemed to follow Kether's guidance and surge up, blocking the sunlight from the sky.</text><br>
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
            title() {return "Ascorb Energy<br>"},
            gain() {
                let gain = n(1)
                if(player.Ktr.ark.gte(1)) gain = gain.mul(tmp.Ktr.arkEff)
                gain = gain.mul(buyableEffect('Ktr','Ktr-s1'))
                if(player.Ktr.ark.gte(1)) gain = gain.mul(layers.Ktr.buyables['Ktr','Ktr-s3'].effect())
                if(tmp.Ktr.memoryLevel.lt(42) && tmp.Ktr.memoryLevel.gte(15)) gain = gain.div(100)
                if(tmp.Ktr.memoryLevel.gte(42)) gain = gain.mul(100)
                if(tmp.Ktr.memoryLevel.gte(75)) gain = gain.mul(1000)
                if(player.Ktr.activeChallenge == 'Ktr-g1') gain = gain.pow(tmp.Ktr.gateEff)
                if(player.Ktr.storyUnlocked >= 9) gain = gain.mul(player.Ktr.timeWrap)
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
            title() {return "Build +1 Ark<br>"},
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
            display() {return "<br>Requires "+format(tmp.Ktr.solarReq[player.Ktr.solarLayer])+" stallar points. Unlock 2 new Celestials."},
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
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #c999ff','background':`linear-gradient(to right,#c999ff ${format(tmp.Ktr.celestialProgress[0])}%,black ${format(tmp.Ktr.celestialProgress[0].add(0.25))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#c999ff'}
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
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #c999ff','background':`linear-gradient(to right,#c999ff ${format(tmp.Ktr.celestialProgress[1])}%,black ${format(tmp.Ktr.celestialProgress[1].add(0.25))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#c999ff'}
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
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #8619ff','background':`linear-gradient(to right,#8619ff ${format(tmp.Ktr.celestialProgress[2])}%,black ${format(tmp.Ktr.celestialProgress[2].add(0.25))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#8619ff'}
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
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #8619ff','background':`linear-gradient(to right,#8619ff ${format(tmp.Ktr.celestialProgress[3])}%,black ${format(tmp.Ktr.celestialProgress[3].add(0.25))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#8619ff'}
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
            tooltip() {return quickBackgColor("[Mass] 6e10 Msun<br>[Temp.] -273.15K",'#480099')+'<br><br>Boost solar energy gain and generate extra yellow dwarf.<br>Effect1: ×'+format(this.effect1())+"<br>Effect2: +"+format(this.effect2())+"<br>Hold and gain "+format(tmp.Ktr.celestialPerSec[4])+"% quasi-star energy per second."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #480099','background':`linear-gradient(to right,#480099 ${format(tmp.Ktr.celestialProgress[4])}%,black ${format(tmp.Ktr.celestialProgress[4].add(0.25))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#480099'}
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
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.05))
                return cost
            },
            buy(){
                player.Ktr.points = player.Ktr.points.sub(this.cost())
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
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.05))
                return cost
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
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
            canAfford() {return player.Ktr.ark.gte(this.cost())},
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
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
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
                let eff = Decimal.pow(n(4).add(getBuyableAmount('Ktr','Ktr-s-d1').gte(1)? buyableEffect('Ktr','Ktr-s-d1') : 0), n(x).add(player.Ktr.ark.gte(6)? getBuyableAmount('Ktr','Ktr-s1').mul(0.05):0)).sub(1)
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
            canAfford() {return player.Ktr.fuel.gte(this.cost())},
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
                player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
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
            canAfford() {return player.Ktr.fuel.gte(this.cost())},
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
                player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
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
            canAfford() {return player.Ktr.fuel.gte(this.cost())},
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
                player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
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
            canAfford() {return player.Ktr.fuel.gte(this.cost())},
            cost(x){
                return n(x).mul(1.8).plus(1).pow(2).sub(player.Ktr.solarPower[3].gte(1)? tmp.Ktr.clickables['Ktr-r-c4'].effect1 : 0).floor().max(0)
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.pow(n(1.5).add(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[6].start)? 0.5 : 0),x)
            },
            buy(){
                player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
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
            canAfford() {return player.Ktr.fuel.gte(this.cost())},
            cost(x){
                return n(x).mul(1.4).plus(1).pow(2).sub(player.Ktr.solarPower[3].gte(1)? tmp.Ktr.clickables['Ktr-r-c4'].effect1 : 0).floor().max(0)
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.pow(2,x)
            },
            buy(){
                player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
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
            canAfford() {return player.Ktr.fuel.gte(this.cost())},
            cost(x){
                return n(x).mul(1.8).plus(1).pow(2).floor()
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.add(1,x.add(1).log(4))
            },
            buy(){
                player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
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
            enabled() {return player.Ktr.gate1 >= 3},
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
            enabled() {return getBuyableAmount('Ktr','Ktr-s-d1').gte(7) && getBuyableAmount('Ktr','Ktr-s-d2').gte(7) && getBuyableAmount('Ktr','Ktr-s-d3').gte(5) && getBuyableAmount('Ktr','Ktr-s-d4').gte(7) && getBuyableAmount('Ktr','Ktr-s-d5').gte(7) && getBuyableAmount('Ktr','Ktr-s-d6').gte(7)},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9 && player.Ktr.memoryCrystal.gte(1e6)}
        },
        'Ktr-g-h3': {
            title() {return "<h3>[iii] Sea of Dream "+(this.enabled()? quickColor('(Stable)','green'):quickColor('(Disrupted)','red'))},
            display() {let dis = '<h2>[Kether] All miracles in the universe are built on the right foundation of time. If you can freeze time around integer moments, then you have the potential to master the time of all things.'
        if(!this.enabled()) {if(player.Ktr.realTime.lt(2000)) dis += '<br><br>'+quickColor('Reach 2000s of reality time to discover more.','black')
        else dis += '<br><br>'+quickColor('Change timespan rate to x1/8 and wait until your universal time can be divisible by 60s(1min) to stabilize it.','red')}
        else dis += '<br><br>'+quickColor('Heart Gate nerf expontent x2','green')
        return dis
        },
            enabled() {return player.Ktr.universalTime.gte(30) && player.Ktr.universalTime.toNumber() % 60 <= 2 && player.Ktr.timeWrap < n(0.2)},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9 && player.Ktr.memoryCrystal.gte(1e10)}
        },
    },
    challenges:{
        'Ktr-g1':{
            name() {return "Heart Gate "+((this.locked())?'(Locked)':(player.Ktr.activeChallenge == 'Ktr-g1'?("("+formatWhole(this.gain())+")"):("(Inactive)")))},
            text() {return "☭"},
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
            description() {return 'Boost points gain based on itself.'},
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
                ]
            },
            "Star Observation Platform":{
                content:[
                    ['display-text',function(){return '<h4>You have '+quickBigColor(formatWhole(player.Ktr.stallar),'Moccasin') +' Stallar points, boost essence gain by '+quickBigColor('×'+format(tmp.Ktr.stallarEff),'moccasin')+' .'}],
                    "blank",
                    ['clickable','Ktr-s1'],
                    "blank",
                    ['row',[['buyable','Ktr-s1'],['buyable','Ktr-s2'],['buyable','Ktr-s3'],['buyable','Ktr-s4']]],
                    ['row',[['buyable','Ktr-s5'],['buyable','Ktr-s6']]],
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
                ['display-text',function(){return '<h4>Your ark has received   '+quickBigColor(formatWhole(tmp.Ktr.solarEnergy),'lavender') +' solar Energy. that boosts to ark effect and yellow dwarf effect '+quickBigColor('×'+format(tmp.Ktr.solarEff),'lavender')}],
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
                ['display-text',function(){return '<h4>The recollection of kether is in dipth '+quickBigColor(formatWhole(tmp.Ktr.memoryLevel),'white') +', provides the following bonuses'}],
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
                    ['display-text',function(){if(player.Ktr.storyUnlocked >= 9)return '<h4>You have collected a total of   '+quickBigColor(formatWhole(player.Ktr.memoryCrystal),'white') +' memory crystal. Itself boosts the effect of solar energy.(Uneffected by the nerf of heart gate)'}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>Universal timespan: '+quickBigColor(formatTime(player.Ktr.universalTime),'white')}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>Reality timespan: '+quickBigColor(formatTime(player.Ktr.realTime),'white')+', translated to a stallar nerf of '+quickBigColor('^'+format(tmp.Ktr.gateEff),'white')}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>You have '+quickBigColor(formatWhole(tmp.Ktr.antimatter),'white')+' antimetter.'}],
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
                unlocked(){return tmp.Ktr.memoryLevel.gte(100)},
                buttonStyle(){return {'background':'linear-gradient(to right,white 11%, grey 92%)','color':'black','box-shadow':'2px 2px 2px grey'}}
            },
    },
    update(diff){
        if(player.Ktr.stallarFreeze.gt(0)) player.Ktr.stallarFreeze = player.Ktr.stallarFreeze.sub(diff).max(0)
        if(tmp.Ktr.storyPending > player[this.layer].storyUnlocked) {
            player[this.layer].storyUnlocked = tmp.Ktr.storyPending;
            player[this.layer].newStory = true
            doPopup(type = "none", text = "New Kether story unlocked!<br>(No. "+formatWhole(player[this.layer].storyUnlocked)+")", title = "Ancient Universal Memory Awaken...", timer = 5, color = "white")
        }
        if(getBuyableAmount('Ktr','Ktr-s5').gte(1)) player.Ktr.stallar = player.Ktr.stallar.add((player.Ktr.activeChallenge == 'Ktr-g1'? n(0) : buyableEffect('Ktr','Ktr-s5')).mul(tmp.Ktr.clickables['Ktr-s1'].gain).mul(diff))
        if(player.Ktr.activeChallenge == 'Ktr-g1'){
            player.Ktr.realTime = player.Ktr.realTime.add(diff)
            player.Ktr.universalTime = player.Ktr.universalTime.add(n(diff).mul(player.Ktr.timeWrap))
        }
    },
})
addLayer("Hkm", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        storyUnlocked: 0,
        newStory: false,             // "points" is the internal name for the main resource of the layer.
    }},
    symbol(){return "Hkm<sup>"+player.Hkm.storyUnlocked},
    color: "grey",                       // The color for this layer, which affects many elements.
    resource: "hokma points",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(9e9999),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,
    branches: ['Ktr'],                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player.Ktr.memoryCrystal.gte(1e20) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    tabFormat:{
        'Time Machine':{
            content:[
                // ['display-text','<button class="info Hokma" onClick="ketherStory()">Story</button>'],
                'main-display',
                'prestige-button'
            ]
        }
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
				text:`Story 01`,
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
