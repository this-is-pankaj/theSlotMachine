'use strict';

$(document).ready(function(){
  const symbols  = [
  {
    type: 'bar3',
    img: '../images/3xBAR.png',
    displayText: '3xBar'
  },{
    type: 'bar',
    img: '../images/BAR.png',
    displayText: 'Bar'
  },
  {
    type: 'bar2',
    img: '../images/2xBAR.png',
    displayText: '2xBar'
  },
  {
    type: 'seven',
    img: '../images/7.png',
    displayText: 'Seven'
  },
  {
    type: 'cherry',
    img: '../images/Cherry.png',
    displayText: 'Cherry'
  }];

  const positions  = {
    top: {
      displayText: 'Top',
      style: 'rotateX(0) translateZ(0) translateY(0)',
      prevElem: 'rotateX(135deg) translateZ(120px)',
      nextElem: 'rotateX(0) translateZ(0) translateY(100%)',
      nextElemClass: 'bottom'
    },
    center: {
      displayText : 'Center',
      style: 'rotateX(0) translateZ(0) translateY(50%)',
      prevElem: 'rotateX(0) translateZ(0) translateY(-50%)',
      nextElem: 'rotateX(0) translateZ(0) translateY(150%)'
    },
    bottom: {
      displayText: 'Bottom',
      style: 'rotateX(0) translateZ(0) translateY(100%)',
      prevElem: 'rotateX(0) translateZ(0) translateY(0)',
      nextElem: 'rotateX(235deg) translateZ(120px)',
      prevElemClass: 'top'
    }
  };

  const numOfReels = 3;
  const startingCoin = 10;

  let isDebugModeOn = false;  // Debug mode is false by default.
  let numOfCoinsLeft = startingCoin;

  let reelPositions  = {

  }

  let methods = {
    onDebugModeUpdate(isDebugModeOn) {
      const buttonTexts = {
        active: 'Turn off Debug Mode',
        inactive: 'Turn on Debug Mode'
      }
      // If the debugMode is on, set the title to inform the user on turning it off..
      if(isDebugModeOn){
        $(".debug-mode").text(buttonTexts.active);
        $(".debug-mode-options").removeClass("d-none");
      }
      else {
        $(".debug-mode").text(buttonTexts.inactive);
        $(".debug-mode-options").addClass("d-none");
        this.resetDebugModeSelections();
      }
      // Allow manual update on the number of coins
      this.manipulateCoins()
    },
    manipulateCoins() {
      if(isDebugModeOn) {
        $(".coins").addClass("d-none");
        $(".debug-coins").removeClass("d-none");
      }
      else {
        $(".coins").removeClass("d-none");
        $(".debug-coins").addClass("d-none");
      }
    },
    resetDebugModeSelections() {
      $(".opt-symbol, .opt-position").removeClass("active");
    },
    setStartingCoins(numOfCoins) {
      if(numOfCoins!==undefined && numOfCoins>-1) {
        numOfCoinsLeft = numOfCoins;
      }
      this.setCoinsLeft(numOfCoinsLeft);
    },
    setCoinsLeft(coinsLeft) {
      // If num of coins left is valid non-negative number, update the coins
      if(coinsLeft!==undefined && coinsLeft>=0) {
        numOfCoinsLeft = coinsLeft;
      }
      $(".debug-coins").val(numOfCoinsLeft);
      $(".coins").text(numOfCoinsLeft);
    },
    updateCoinsLeft(change) {
      let coinsLeft = numOfCoinsLeft;
      if(parseInt(change)) {
        coinsLeft += change;
        // Only if the value post update is a non-negative number, allow the update on coins.
        if(coinsLeft>=0) {
          this.setCoinsLeft(coinsLeft);
        }
      }
    },
    generateReel() {
      let reelTemplate = '',
        debugTemplate  = '';
      // Generate symbols on every reel
      for(let r=0; r<numOfReels; r++) {
        reelTemplate +=  `<div class="reel reel${r+1}">`;
        // Complete  the definition to hold all reel values.
        reelPositions[`reel${r+1}`] = {
          pos: undefined,
          type: undefined
        };
        debugTemplate += `<div class="debug-options reel${r+1}">
          <h4 class="text-center">Reel ${r+1} Config</h4>
          <div class="select-symbol"> <p>Select Symbol: </p>`;
        for(let s=0; s<symbols.length; s++)  {
          reelTemplate += `<div class="${symbols[s].type} symbol" data-symbol="${symbols[s].type}"></div>`;

          debugTemplate += `<div class="opt-symbol" title="${symbols[s].displayText}" data-symbol="${symbols[s].type}">
            <span class="${symbols[s].type} symbol thumbnail" ></span>
          </div>`;
        }
        debugTemplate += '</div>';

        // Generate the debug optiions for selecting the horizontal line
        debugTemplate += `<div class="select-position"><p>Select Position: </p>`;
        for(let  posType in positions) {
          debugTemplate += `<div class="opt-position" title="${positions[posType].displayText}" data-position = "${posType}">
            <p class="position">${positions[posType].displayText}</p>
          </div>`;
        }

        reelTemplate += '</div>';
        debugTemplate += '</div></div>';
      }

      $(".machine").html(reelTemplate);
      $(".machine-options").find(".debug-mode-options").html(debugTemplate);
    },
    positionSymbols(posInfo){
      let timer = 1500,  // 1.5 secs initial timer. Add increment for every reel.
        timerInc = 500; // 0.5secs timer increment for following reels.
      for(let reel in posInfo) {
        let {type, pos} = posInfo[reel];
        timer += timerInc;
        // Only if type and pos are defined, proceed with setting it up on screen
        if(type && pos) {
          this.displayValues(reel, type, pos, timer);
        }
      }
    },
    displayValues(reel, type, pos, timer) {
      setTimeout(function(){
        let chosenSymbol = $(`.reel.${reel}`).find(`.${type}.symbol`),
          prevSymbol = chosenSymbol.prev(),
          nextSymbol = chosenSymbol.next();

        // chosenSymbol.css({
        //   transform: positions[pos].style
        // });
        chosenSymbol.addClass(pos);

        if(!prevSymbol.length) {
          prevSymbol = chosenSymbol.parent().find('.symbol').last();
        }
        if(!nextSymbol.length) {
          nextSymbol = chosenSymbol.parent().find('.symbol').first();
        }

        if(positions[pos].nextElemClass) {
          nextSymbol.addClass(positions[pos].nextElemClass);
        }
        else{
          nextSymbol.css({
            transform: positions[pos].nextElem
          });
        }

        if(positions[pos].prevElemClass) {
          prevSymbol.addClass(positions[pos].prevElemClass);
        }
        else{
          prevSymbol.css({
            transform: positions[pos].prevElem
          });
        }
        

        // Set the type of the symbols and update the other symbols so that they are not displayed.
        let chosenSymbolType = `.symbol.${type}`,
          prevSymbolType = `.${prevSymbol.attr("class").split(" ").join(".")}`,
          nextSymbolType = `.${nextSymbol.attr("class").split(" ").join(".")}`;

        $(`.reel.${reel}`).find(`.symbol:not(${chosenSymbolType}, ${prevSymbolType}, ${nextSymbolType})`).addClass("back");
        // Stop the reel from spinning further 
        methods.rotate(false, reel);

        if(reel === 'reel3') {
          methods.validateResult();
        }
      }, timer);
    },
    generateReelPositionAndSymbol() {
      // If the debug mode is on, the values need to be fetched via the set values..
      for(let reelid in reelPositions) {
        if(isDebugModeOn) {
          reelPositions[reelid].pos = $(`.debug-options.${reelid}`).find('.opt-position.active').data('position');
          reelPositions[reelid].type = $(`.debug-options.${reelid}`).find('.opt-symbol.active').data('symbol');

          if(!reelPositions[reelid].pos) {
            this.generateRandomPosAndSymbol(reelid, 'pos');
          }

          if(!reelPositions[reelid].type) {
            this.generateRandomPosAndSymbol(reelid, 'type');
          }
        }
        else  {
          this.generateRandomPosAndSymbol(reelid);
        }
      }
      this.positionSymbols(reelPositions);
    },
    rotate(isOn, reelid){
      let $reelElem = $(".reel");
      if(reelid) {
        $reelElem = $(`.reel.${reelid}`);
      }
      if(isOn){
        $reelElem.addClass("rotate");
        this.generateReelPositionAndSymbol();
      }
      else{
        $reelElem.removeClass("rotate");
        $("#spinStopTrack")[0].play();
      }
    },
    prepareReels(){
      // prepare reels for rotation by removing back, top, bottom, center classes and transform css style.
      $(".reel").find(".symbol").removeClass('top bottom center back blink').removeAttr('style');
      $(".blink").removeClass("blink");
      this.rotate(true);
    },
    generateRandomPosAndSymbol(reelid, posOrSym){
      let availableSymbols = symbols.map((s)=>{
        return s.type;
      });

      let availablePos = Object.keys(positions);
      let randomSymbolIdx = this.getRandomNum(0,availableSymbols.length-1),
        randomPosIdx = this.getRandomNum(0, availablePos.length-1);
      
      //If the reel ID was valid, add the  symbols and position to the reel. 
      if(reelPositions[reelid]){
        if(!posOrSym) {
          reelPositions[reelid] = {
            pos: availablePos[randomPosIdx],
            type: availableSymbols[randomSymbolIdx]
          }
        }
        else {
          if(posOrSym === 'type') {
            reelPositions[reelid].type = availableSymbols[randomSymbolIdx];
          }
          else if(posOrSym === 'pos') {
            reelPositions[reelid].pos = availablePos[randomPosIdx];
          }
        }
      }
    },
    getRandomNum(min, max){
      return Math.floor((Math.random()*(max-min+1)+min));
    },
    bindEvents()  {
      $(".debug-mode").off().on("click", ()=>{
        isDebugModeOn  = !isDebugModeOn;
        this.onDebugModeUpdate(isDebugModeOn);
      });
      
      $(".debug-coins").off("change").on("keyup", ()=>{
        let newCoins = parseInt($(".debug-coins").val());
        // If the coin is a valid non-negative integer, allow the update
        if(newCoins>=0) {
          this.setCoinsLeft(newCoins);
        }
        else {
          alert("invalid number of coins");
          this.setCoinsLeft(numOfCoinsLeft);  // Set it to the last valid value of coins
        }
      })

      $(".opt-symbol, .opt-position").off().on("click", function(){
        // Proceed with the callback only if the debug mode is active...
        if(isDebugModeOn) {
          $(this).siblings().removeClass("active");
          $(this).addClass("active");
        }
      });

      $(".spin").off("click").on("click", function(){
        // Only if the user has valid number of coins, i.e, greater than 0, allow the spin!
        if(numOfCoinsLeft) {
          let $this = $(this);
          // Take one coin with every spin
          methods.updateCoinsLeft(-1);
          // Attach values for position and symbol for each reel that needs to be rendered.
          // methods.generateReelPositionAndSymbol();
          methods.prepareReels();
          //play the spin sound
          $("#spinTrack")[0].play();
          $(this).attr("disabled", true);
          // Disable the button for 4 secs after it's clicked
          setTimeout(()=>{
            $this.attr("disabled", false);
          }, 4000);
        }
        else{
          alert("You don't have enough coins to make the Spin!");
        }
      })
    },
    populatePayTableInfo() {
      // Generate icons for quick access pay-table
      let str  = '<h5>Pay Table </h5>';
      let modalStr = ``;
      let allMatches = Object.keys(statics.payTable.allSame);
      let combinations = Object.keys(statics.payTable.combination);
      let alreadyCreated = [];
      for(let i=0; i<allMatches.length; i++) {
        let id = `all-${allMatches[i]}`;
        str += `<button class="btn btn-default pay-table-icon-wrapper" data-toggle="modal" data-target="#payTableInfo" data-paytable="${id}">`;
        str += `<span class="symbol thumbnail pay-table-icon ${allMatches[i]}"></span>`;
        alreadyCreated.push(id);
        for(let p in statics.payTable.allSame[allMatches[i]]) {
          modalStr += `<tr>`;
          modalStr += `<td>${positions[p].displayText}</td>`;
          // print in 3 columns for each reel
          for(let x=0; x<3;x++) {
            modalStr += `<td><span class="symbol ${allMatches[i]} thumbnail"></span></td>`;
          }
          modalStr += `<td>${statics.payTable.allSame[allMatches[i]][p]}</td>`
          modalStr += `</tr>`;
        } 
      }
      for(let i=0; i<combinations.length; i++) {
        let combinedWith = statics.payTable.combination[combinations[i]].combineWith;
        // Only if a match is found, save the combination as array
        if(combinedWith) {
          let combination = [combinations[i], combinedWith],
            combinationId =  combination.join("+"),
            reverseCombination = `${combinedWith}+${combinations[i]}`;
          // Check if a button has already been created for this combination 
          if(!alreadyCreated.includes(reverseCombination)) {
            str += `<button class="btn btn-default pay-table-icon-wrapper" data-toggle="modal" data-target="#payTableInfo" data-paytable="comb-${combinationId}">`;
            str += `<span class="symbol thumbnail pay-table-icon combined ${combinations[i]}">C</span>`;
            alreadyCreated.push(combinationId);
          }
          modalStr += `<tr>`;
          modalStr += `<td>Any Combination of Lines/Reels </td>`;
          modalStr += `<td> <span class="symbol thumbnail ${combinations[i]}"></span> </td>`;
          modalStr += `<td colspan="2"> <span class="symbol thumbnail ${combinedWith} pay-table-comb"></span></td>`;
          modalStr += `<td>${statics.payTable.combination[combinations[i]].prize}</td>`;
          modalStr += `</tr>`;
        }
        else {
          let id= `comb-${combinations[i]}`;
          str += `<button class="btn btn-default pay-table-icon-wrapper" data-toggle="modal" data-target="#payTableInfo" data-paytable="${id}">`;
          str += `<span class="symbol thumbnail pay-table-icon combined ${combinations[i]}">C</span>`;
          alreadyCreated.push(id);

          modalStr += `<tr></tr>`;
          modalStr += `<td>Any Combination of Lines/Reels </td>`;
          modalStr += `<td class="text-center" colspan="3"> <span class="symbol thumbnail ${combinations[i]} pay-table-comb"></span></td>`;
          modalStr += `<td>${statics.payTable.combination[combinations[i]].prize}</td>`;
          modalStr += `</tr>`;
        }
        str += `</button>`;
      }
      $(".quick-pay-table").html(str);
      $(".pay-table-body").html(modalStr);
    },
    getSymbolsInPosition(){
      let validPositionedSymbols = {};
      for(let reelid in reelPositions) {
        validPositionedSymbols[reelid] = {};
        for(let posType in positions){
          validPositionedSymbols[reelid][posType] = $(`.${reelid}`).find(`.symbol.${posType}`).data("symbol");
        }
      }

      return validPositionedSymbols;
    },
    validateResult(){
      let validPositionedSymbols = this.getSymbolsInPosition();
      let prizeWon=0,
        winningSymbol,
        isComboWin = false;
      let {reel1, reel2, reel3} = validPositionedSymbols;
      let  checkOtherReels = function(combinationWith, reelValue) {
        // If  value of combinationwith be null or empty array, that  means it has to be same symbol in any line.
        if(!combinationWith) {
          let match = false;
          for(let pos in reel2) {
            if(reel2[pos]===reelValue) {
              match  =  true;
            }
          }

          if(match) {
            match = false;
            for(let pos in reel3) {
              if(reel3[pos]===reelValue) {
                match  =  true;
                winningSymbol = reelValue;
                prizeWon = statics.payTable.combination[reelValue].prize;
              }
            }
          }
        }
        else{
          let  matchingPatterns = matchInOtherReelsForValue(combinationWith, reelValue);
          // Match is found, assign the prize value
          if(matchingPatterns.length) {
            let combinationPrize =  statics.payTable.combination[reelValue].prize;
            if(combinationPrize>prizeWon)  {
              prizeWon = combinationPrize;
              winningSymbol = {
                reel1: reelValue,
                reel2: matchingPatterns[0],
                reel3: matchingPatterns[1]
              };
            }
          }
        }
      }
      let matchInOtherReelsForValue =  function(combinationWith, reelValue){
        let match =  false,
          matchedValues  = [],
          values = [reelValue, combinationWith];
        for(let pos in reel2) {
          if(values.includes(reel2[pos])) {
            match  =  true;
            matchedValues.push(reel2[pos]);
          }
        }

        if(match) {
          match = false;
          // The matching value here should be  different if the earlier value was the same as reelValue,
          // we remove reelValue from values array using which  match is being  made  to ensure the next match is different.
          // Agaiin, the matchedValuees array should have exactly one value at this time,
          // else it will be a case in which we have to  deal with the symbol in the end.
          if(matchedValues.includes(reelValue) && matchedValues.length===1) {
            values.splice(0,1);
          }
          for(let pos in reel3) {
            if(values.includes(reel3[pos])) {
              // If the matched values already has reelvalue from reel2, remove the macthed value from reel2
              if(matchedValues.length>1 && matchedValues.includes(reelValue)) {
                matchedValues.splice(matchedValues.indexOf(reelValue), 1);
              }
              match  =  true;
              matchedValues.push(reel3[pos]);
            }
          }
        }
        // If the match wasnt found in the last  reel, the combination failed so send a blank list.
        if(!match) {
          matchedValues = [];
        }

        // If the macthedValue has more than 2 values, we need to remove the ones which  may cause issues..

        return matchedValues;
      } 
      if((reel1.top === reel2.top) && (reel1.top===reel3.top) && reel1.top) {
        prizeWon= statics.payTable.allSame[reel1.top].top;
        winningSymbol = reel1.top;
        isComboWin = false;
      }

      if((reel1.center === reel2.center) && (reel1.center===reel3.center) && reel1.center) {
        prizeWon= statics.payTable.allSame[reel1.center].center;
        winningSymbol = reel1.center;
        isComboWin = false;
      }

      if((reel1.bottom === reel2.bottom) && (reel1.bottom===reel3.bottom) && reel1.bottom) {
        let prizeWonBottom = statics.payTable.allSame[reel1.bottom].bottom;
        if(prizeWonBottom>prizeWon) {
          prizeWon = prizeWonBottom;
          winningSymbol = reel1.bottom;
          isComboWin = false;
        }
      }
      if(!winningSymbol) {
        isComboWin = true;
        // get the combinations set in the config
        let combinationsApplicableOn  = Object.keys(statics.payTable.combination);
        // If reel1.top has a valid combination config, proceed  with matching top values..
        if(reel1.top && combinationsApplicableOn.includes(reel1.top)) {
          let combinationWith = statics.payTable.combination[reel1.top].combineWith;
          checkOtherReels(combinationWith, reel1.top);
        }

        if(reel1.center && combinationsApplicableOn.includes(reel1.center)) {
          let combinationWith = statics.payTable.combination[reel1.center].combineWith;
          checkOtherReels(combinationWith, reel1.center);
        }

        if(reel1.bottom && combinationsApplicableOn.includes(reel1.bottom)) {
          let combinationWith = statics.payTable.combination[reel1.bottom].combineWith;
          checkOtherReels(combinationWith, reel1.bottom);
        }
      }
      // If winningSymbol is a string, that meeans it was an all match case.
      if(winningSymbol)  {
        if(!isComboWin){
          $(".reel").find(`.symbol.${winningSymbol}`).addClass("blink");
          $(`.pay-table-icon-wrapper[data-paytable="all-${winningSymbol}"]`).addClass("blink");
        }
        else if(isComboWin && !winningSymbol.reel1) {
          $(".reel").find(`.symbol.${winningSymbol}`).addClass("blink");
          $(`.pay-table-icon-wrapper[data-paytable="comb-${winningSymbol}"]`).addClass("blink");
        }
        else{
          // loop over all reels and deesired symbols
          let combination = [];
          for(let reelid in winningSymbol){
            $(`.reel.${reelid}`).find(`.symbol.${winningSymbol[reelid]}`).addClass("blink");
            if(!combination.includes(winningSymbol[reelid])){
              combination.push(winningSymbol[reelid]);
            }
          }
          let combinationId = combination.length>1? combination.join("+"): combination[0],
            reverseCombinationId = combination.reverse().join("+");
          $(`.pay-table-icon-wrapper[data-paytable="comb-${combinationId}"]`).addClass("blink");
          $(`.pay-table-icon-wrapper[data-paytable="comb-${reverseCombinationId}"]`).addClass("blink");
        }
        $("#coinsAddedTrack")[0].play();
        alert(`Congrats! You have won ${prizeWon} in your last spin! Keep spinning to win more!`);
        this.updateCoinsLeft(prizeWon);
      }
    },
    initialize() { 
      this.setStartingCoins();
      this.generateReel();
      this.populatePayTableInfo();
      this.bindEvents();
      $("#bgScore").prop("volume", 0.4);
      $("#bgScore")[0].play();
      $("#spinTrack").prop("volume", 1);
      $("#spinStopTrack").prop("volume", 1);
    }
  };

  methods.initialize();
})