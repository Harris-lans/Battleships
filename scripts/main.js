/** 
 * Main Class
 * 
 * @copyright: (C) 2018 in cooperation with Vancouver Film School. All Right Reserved.
 * @author: Harish Kumar --> {@ link harishsghp@live.com}
 * @ version: 1.0.0
*/

"use strict";

//Wait for our Document to load and then...

//Create a new Game

class MainMenu
{
    
    constructor ()
    {   
        //Variables
        //========= 

        this.MainMenu = document.querySelector("#MainMenu");
        this.MainMenuScreen = document.querySelector("#MainMenuScreen");
        this.PlayerSelectScreen = document.querySelector("#PlayerSelectScreen");
        this.PlayerNameScreen = document.querySelector("#PlayerNameScreen");
        this.HelpScreen = document.querySelector("#HelpScreen");
        this.CreditsScreen = document.querySelector("#CreditsScreen");
        this.GameScreen = document.querySelector("#GameScreen");
        
        //Music
        //=====

        //Adding hover music for the buttons
        this.HoverMusic = new buzz.sound("./sounds/SFX_UI_Movement_HK.ogg");
        this.HoverMusic.setVolume(10);
        let UI_SFX = document.querySelectorAll(".UI_Sounds");
        Object.values(UI_SFX).forEach( element => {
            element.addEventListener("mouseover", (event) => {
                this.HoverMusic.play();
                this.HoverMusic.setPercent(0);
            });
        });
        
        // Register Event Handlers
        // =======================

        //Event Handler for PlayButton in the Main Menu
        document.querySelector("#PlayButton").addEventListener("click", (event) => {
            this.HideMainMenuScreen();
            this.ShowPlayerSelectorScreen();
        });

        //Event Handler for HelpButton in the Main Menu
        document.querySelector("#HelpButton").addEventListener("click", (event) => {
            this.HideMainMenuScreen();
            this.ShowHelpScreen();
        });

        //Event Handler for CreditsButton in the Main Menu
        document.querySelector("#CreditsButton").addEventListener("click", (event) => {
            this.HideMainMenuScreen();
            this.ShowCreditScreen();
        });

        //Event Handler for the Back Button in the HelpScreen and PlayerSelectButton
        let backButton = document.querySelectorAll('.BackButton');
        Object.values(backButton).forEach( element => {
            element.addEventListener("click", (event) => {
                if (this.CheckForClass(this.HelpScreen, "ShowScreen"))
                {
                    this.HideHelpScreen();
                }
                else if (this.CheckForClass(this.PlayerSelectScreen, "ShowScreen"))
                {
                    this.HidePlayerSelectorScreen();
                }
                else if (this.CheckForClass(this.CreditsScreen, "ShowScreen"))
                {
                    this.HideCreditsScreen();
                }
                this.ShowMainMenuScreen();
            });
        });

        //Event Handler for the 1Player Button in the PlayerSelectScreen
        document.querySelector("#PVE").addEventListener("click", (event) => {
            this.HidePlayerSelectorScreen();
            this.ShowPlayerNameScreen();
            //Adding a name Form for the player to fill up
            document.querySelector("#PlayerNameForm").innerHTML = `<input id="Player1" class="PlayerName" type="text" value="Player 1"><br>`;
            this.AddEventListenerForSubmitPVE();
        });

        //Event Handler for the 2Players Button in the PlayerSelectScreen
        document.querySelector("#PVP").addEventListener("click", (event) => {
            this.HidePlayerSelectorScreen();
            this.ShowPlayerNameScreen();
            //Adding two name Forms for the players to fill up
            document.querySelector("#PlayerNameForm").innerHTML = `<input id="Player1" class="PlayerName" type="text" value="Player 1"><br><input id="Player2" class="PlayerName" type="text" value="Player 2"><br>`;
            this.AddEventListenerForSubmitPVP();
        });

    }

    AddEventListenerForSubmitPVE()
    {
        document.querySelector("#SubmitButton").addEventListener("click", (event)=>{
            this.HideMainMenu();
            this.HidePlayerNameScreen();
            this.ShowMainMenuScreen();
            this.game = new Game();
            this.game.PrepareGame(1,document.querySelector("#Player1").value);
        });
    }
    AddEventListenerForSubmitPVP()
    {
        document.querySelector("#SubmitButton").addEventListener("click", (event)=>{
            this.HideMainMenu();
            this.HidePlayerNameScreen();
            this.ShowMainMenuScreen();
            this.game = new Game();
            this.game.PrepareGame(2, document.querySelector("#Player1").value, document.querySelector("#Player2").value);
        });
    }

    HideMainMenu()
    {
        this.MainMenu.classList.add("Hide");
        this.MainMenu.classList.remove("ShowScreen");
    }
    ShowMainMenu()
    {
        this.MainMenu.classList.add("ShowScreen");
        this.MainMenu.classList.remove("Hide");
    }

    HideMainMenuScreen()
    {
        this.MainMenuScreen.classList.add("Hide");
        this.MainMenuScreen.classList.remove("ShowScreen");
    }
    ShowMainMenuScreen()
    {
        this.MainMenuScreen.classList.add("ShowScreen");
        this.MainMenuScreen.classList.remove("Hide");
    }

    HidePlayerSelectorScreen()
    {
        this.PlayerSelectScreen.classList.add("Hide");
        this.PlayerSelectScreen.classList.remove("ShowScreen");
    }
    ShowPlayerSelectorScreen()
    {
        this.PlayerSelectScreen.classList.add("ShowScreen");
        this.PlayerSelectScreen.classList.remove("Hide");
    }

    HidePlayerNameScreen()
    {
        this.PlayerNameScreen.classList.add("Hide");
        this.PlayerNameScreen.classList.remove("ShowScreen");
    }
    ShowPlayerNameScreen()
    {
        this.PlayerNameScreen.classList.add("ShowScreen");
        this.PlayerNameScreen.classList.remove("Hide");
    }

    HideHelpScreen()
    {
        this.HelpScreen.classList.add("Hide");
        this.HelpScreen.classList.remove("ShowScreen");
    }
    ShowHelpScreen()
    {
        this.HelpScreen.classList.add("ShowScreen");
        this.HelpScreen.classList.remove("Hide");
    }

    HideCreditsScreen()
    {
        this.CreditsScreen.classList.add("Hide");
        this.CreditsScreen.classList.remove("ShowScreen");
    }
    ShowCreditScreen()
    {
        this.CreditsScreen.classList.add("ShowScreen");
        this.CreditsScreen.classList.remove("Hide");
    }

    CheckForClass(element , checkFor)
    {   
        let hidden = false;
        let listOfClasses = element.classList;
        let l = listOfClasses.length;
        for (let i = 0; i < l; i++)
        {
            if (listOfClasses[i] == checkFor)
            {
                hidden = true;
                break;
            }
        }
        return hidden;
    }

    

}

//Run the Game
document.addEventListener("DOMContentLoaded", event => {
    let main = new MainMenu();
});