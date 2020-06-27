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
        debugTemplate += `<div class="col-4 debug-options reel${r+1}">
          <div class="select-symbol">`;
        for(let s=0; s<symbols.length; s++)  {
          reelTemplate += `<div class="${symbols[s].type} symbol"></div>`;

          debugTemplate += `<div class="opt-symbol" title="${symbols[s].displayText}" data-symbol="${symbols[s].type}">
            <span class="${symbols[s].type} symbol thumbnail" ></span>
          </div>`;
        }
        debugTemplate += '</div>';

        // Generate the debug optiions for selecting the horizontal line
        debugTemplate += `<div class="select-position">`;
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
      }, timer);
    },
    generateReelPositionAndSymbol() {
      // If the debug mode is on, the values need to be fetched via the set values..
      if(isDebugModeOn) {
        for(let reelid in reelPositions) {
          reelPositions[reelid].pos = $(`.debug-options.${reelid}`).find('.opt-position.active').data('position');
          reelPositions[reelid].type = $(`.debug-options.${reelid}`).find('.opt-symbol.active').data('symbol');
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
      }
    },
    prepareReels(){
      // prepare reels for rotation by removing back, top, bottom, center classes and transform css style.
      $(".reel").find(".symbol").removeClass('top bottom center back').attr('style', '');
      this.rotate(true);
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
    initialize() { 
      this.setStartingCoins();
      this.generateReel();
      this.bindEvents();
    }
  };

  methods.initialize();
})