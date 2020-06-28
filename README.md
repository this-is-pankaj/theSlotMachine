# The SlotMachine
  Among the most exciting games played at Casinos around the world. This app let's you have similar experience on your JS enabled mobile devices.

## Features
  The game starts with a default of 10 coins for every player. Click on "Pay Table" button to view the pay table for the game. The landing screen consists of:
  - A section displaying the number of coins and Pay Table button.
  - 3 Reels with 5symbols - Cherry, Seven, Bar, 2xbar & 3xbar, each. Whenever spinning stops, the reels will display the highest payout combo, as per the configured pay table. Users will be alerted of their victory and the combination will start blinking.
  - A section displaying the winning combination for quick access to pay table.
    - ** 3xAny Symbol **  - The buttons start blinking as soon as a corresponding match is found (as defined in pay table). User may choose to click the button to view the paytable. 
    - ** CxSymbol ** - The button represents combination with the symbol on the button. If a corresponding match is found, it will start blinking in the same way as the other buttons. Click to view the complete pay table.
  - A section with the following game options:
    - ** "Spin" **- Clicking on this button will set the reels in motion and disable this button for next 4secs. Meanwhile, the reels will stop at random positions displaying certain symbols on random win-line (Top, Center or Bottom). Each spin costs a user 1coin and won't spin if a user is out of them.
    - **"Turn On/Off Debug Mode"**  - This button is available to test the spin and user can set symbols to the corresponding win-line and make the spin to see the desired result. In case, a reel has a missing config, it will land up iin a random position. Users will also be able to set the number of coins in the debug mode. ** Note: ** * Keep the debug mode on while making the spin. Turning the debug mode off will reset the desired changes. * 
    - **"Turn Music On/Off"** - Toggle the background music with this button.

  Sound effects have been added to the game to make it more appealing and provide "Casino experience" to the users.

  * Dashboard * 
  ![image](https://user-images.githubusercontent.com/6952221/85942884-f1e09580-b949-11ea-92d4-de52f288c365.png)

  * Dashboard with debugger mode on *
  ![image](https://user-images.githubusercontent.com/6952221/85943001-d6c25580-b94a-11ea-8561-a9f06b93dddf.png)
  
## Developer Guidelines
  This app has been generated using the yeoman web-app generator to speed up the development process. Tech-stack used include:
  - HTML5/CSS3
  - SCSS : to quickly design the pages with minimal repeatation
  - JQuery: Because it involves a lot of DOM manipulation with very less user inputs.
  - Gulp: To compile the scss into css files and minify the app files.

  The app is completely responsive and will work smoothly on any mobile device.

  To start the application on your local system:
  - Clone the repo.
  - Run 'npm i' to install the node dependencies.
  - Run 'npm start' to get the app up and running on your browser 'http://localhost:9000/'.
  - Run 
    ``` 
    npm run build
    ```
    for building the application for prod env.

  The "Turn Music on/off" button has been introduced to mitigate the autoplay issues in chrome browser.
 
