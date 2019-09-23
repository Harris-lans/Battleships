/** 
 * Game Class
 * 
 * @copyright: (C) 2018 in cooperation with Vancouver Film School. All Right Reserved.
 * @author: Harish Kumar --> {@ link harishsghp@live.com}
 * @ version: 1.0.0
*/

class Game
{
    constructor()
    {
        //Variables
        //=========
        this.gameOver = false;
        this.noOfPlayers = 1;
        this.soundMuted = false;
        this.mapSwitched = false;
        this.cellsCanBeClicked = true;
        this.shipsCanBeRevealed = false;
        this.mapToBeAffected = 0;                           // This selects the map that has to be rendered
        this.players = [];
        this.playerTurn = 2;                                //1 means Player 1's turn and 2 means Player2's turn
        //References to some DOM elements
        this.GameScreen = document.querySelector("#GameScreen");
        this.PauseScreen = document.querySelector("#PauseScreen");
        this.Announcer = document.querySelector("#Announcer");
        this.MainMenu = document.querySelector("#MainMenu")

        //Sound Settings
        //==============

        //Sound Settings of the Game
        this.UISound = new buzz.sound("./sounds/SFX_UI_Movement_HK.ogg");
        this.AmbientSound = new buzz.sound("./sounds/AMB_Waves_Water_Gulls_HK.ogg", {loop: true});
        this.GameplayBackgroundMusic = new buzz.sound("./sounds/MUS_Gameplay_Loop_1_HK.ogg",{loop: true});
        this.MissedHit = new buzz.sound("./sounds/SFX_Missed_Misssile_Splash_HK.ogg");
        this.Explosion = new buzz.sound("./sounds/SFX_ExplosionOnCollision_2.ogg");
        this.CommanderSuccessfulHit = new buzz.sound("./sounds/VO_Commander_SuccessfulHit_HK.ogg");
        this.CommanderMissedHit = new buzz.sound("./sounds/VO_Commander_MissedHit_HK.ogg");
        this.CommanderWin = new buzz.sound("./sounds/VO_Commander_Win_HK.ogg");
        this.CommanderLose = new buzz.sound("./sounds/VO_Commander_Lost_HK.ogg");
        this.CommanderShipSunk = new buzz.sound("./sounds/VO_Commander_ShipSunk_HK.ogg");
        
        //Playing the sounds
        this.GameplayBackgroundMusic.play();
        this.GameplayBackgroundMusic.setVolume(10);
        this.AmbientSound.play();
        this.AmbientSound.setVolume(50);
        this.UISound.setVolume(10);


        //Adding UI sounds as events
        let UI_SFX = document.querySelectorAll(".UI_Sounds");
        Object.values(UI_SFX).forEach( element => {
            element.addEventListener("mouseover", (event) => {
                if (this.soundMuted != true)
                {
                    this.UISound.play();
                    this.UISound.setPercent(0);
                }
            });
        });

        //Register Event Handlers
        //=======================

        //Event Handlers for the Pause Button on the Game Screen
        document.querySelector("#PauseButton").addEventListener("click", event =>{
            this.HideGameScreen();
            this.ShowPauseScreen();
        });
        //Event Handlers for the ResumeButton on the PauseScreen
        document.querySelector("#ResumeButton").addEventListener("click", event =>{
            this.HidePauseScreen();
            this.ShowGameScreen();
        });

        //Event Handlers for the QuitButton on the PauseScreen
        document.querySelector("#QuitButton").addEventListener("click", event=> {
            this.HidePauseScreen();
            this.players = [];
            this.ShowMainMenu();
            this.GameplayBackgroundMusic.stop();
            this.AmbientSound.stop();
        });
        //Event Handler for the MuteButton on the Game Screen
        document.querySelector("#MuteButton").addEventListener("click", event =>{
            if (this.soundMuted != true)
            {
                this.GameplayBackgroundMusic.mute();
                this.AmbientSound.mute();
                document.querySelector("#MuteButton").innerHTML = "UNMUTE";
                this.soundMuted = true;
            }
            else
            {
                this.GameplayBackgroundMusic.unmute();
                this.AmbientSound.unmute();
                document.querySelector("#MuteButton").innerHTML = "MUTE";
                this.soundMuted = false;
            }
            
        });
        //EventHandlers for AnnouncerContinueButton
        document.querySelector("#AnnouncerContinueButton").addEventListener("click", event =>{
            if (this.gameOver == false)
            {
                if(this.noOfPlayers == 1)
                {
                    this.playerTurn = 1;
                    this.mapToBeAffected = 0;
                }
                else if (this.playerTurn == 1 && this.noOfPlayers == 2)
                {
                    this.playerTurn = 2;
                    this.mapToBeAffected = 0;
                }
                else if (this.playerTurn == 2 && this.noOfPlayers == 2)
                {
                    this.playerTurn = 1;
                    this.mapToBeAffected = 1;
                }
                document.querySelector("#MapName").innerHTML = `Opponent's Map`;
                this.HideAnnouncer();
                this.PlayGame();
                this.ShowGameScreen();
                this.cellsCanBeClicked = true;
            }
            else
            {
                this.HideAnnouncer();
                this.players = [];
                this.ShowMainMenu();
            }
        });

        //Create the Map viewport
        this.CreateMapView();
        
        
        //Let the Player play

        //Show a results screen / repaly
    }


    PrepareGame(players, player1Name, player2Name)
    {
        // Preparing the Board for a new game
        // The players array stores all the Player Objects
        this.ShowAnnouncer();
        this.noOfPlayers = players;
        if (this.noOfPlayers == 1)
        {
            document.querySelector("#CommentBox").innerHTML = `Welcome to Battleships, ${player1Name} </br> Get ready for a war!`;
            this.players.push(new Player(player1Name, MAX_MISSILES));
        }
        else
        {   
            document.querySelector("#CommentBox").innerHTML = `Welcome to Battleships, ${player1Name} and ${player2Name} </br> Only one of you will emerge Victorius!`;
            this.players.push(new Player(player1Name, MAX_MISSILES));
            this.players.push(new Player(player2Name, MAX_MISSILES));
            //Adding Switch Button only if it is 2Player
            document.querySelector("#SwitchButtonContatiner").innerHTML = '<button type="button" id="SwitchMap" class="Button">SWITCH MAP</button>';
            document.querySelector("#SwitchMap").addEventListener("click", event=>(this.SwitchMap(this.mapSwitched, this.playerTurn)));
        }
    }

    PlayGame()
    {
        this.RefreshStats();
        this.RefreshMap();
    }

    // Handle Event when the player clicks a cell
    HandleMapClick (event)
    {
        let theCell = event.target;
        // Check the game map for the cell

        let cell = {
            row: theCell.dataset.row,
            col: theCell.dataset.col
        };
        if (this.players[this.mapToBeAffected].GetCell(cell.row, cell.col) != MISSED_HIT && this.players[this.mapToBeAffected].GetCell(cell.row, cell.col) != HIT_SHIP)
        {
            if (this.cellsCanBeClicked)
            {                
                let selectedCell = document.querySelector(`#Cell-${cell.row}${cell.col}`);

                // check the game map for a ship
                this.players[this.mapToBeAffected].UpdateMap(cell.row, cell.col);
                let shipHit = this.players[this.mapToBeAffected].CheckForShipDamage(cell.row, cell.col);
                let shipSunk = this.players[this.mapToBeAffected].CheckForSunkShips();

                // Re-Rendering the Screen after making changes to the map
                this.players[this.playerTurn-1].ShotFired();
                this.CalculatePlayerScore(shipHit, shipSunk);
                this.RefreshMap();
                this.RefreshStats();
                this.CheckPlayerLoss();
                if (this.gameOver == false)
                {
                    //Preventing the players from spamming inputs in 2Player
                    //Preventing the player from shooting after sinking a ship in 1Player
                    if (this.noOfPlayers > 1 || (shipSunk != "NONE" && this.noOfPlayers == 1))
                    {
                        this.cellsCanBeClicked = false;
                    }
                    this.Announce(shipHit, shipSunk);
                }

                //Trigerring sounds at the appropriate time
                if (shipHit && this.soundMuted!= true)
                {
                    this.Explosion.play();
                    this.Explosion.setVolume(50);
                    this.Explosion.setPercent(0);                           // Resetting the playback of the sound effect
                }
                else if (!shipHit && this.soundMuted!= true)
                {
                    this.MissedHit.setPercent(0);                           // Resetting the playback of the sound effect
                    this.MissedHit.setVolume(40);
                    this.MissedHit.play();
                }
                

            }
        }
    }


    //Functions used within the Main Program

    //Refresh the UI elements
    RefreshStats()
    {   
        document.querySelector("#Player").innerHTML = this.players[this.playerTurn-1].playerName;
        document.querySelector("#Missiles").innerHTML = this.players[this.playerTurn-1].missiles;
        document.querySelector("#Score").innerHTML = this.players[this.playerTurn-1].score;
        for(let i = 0; i < this.players[this.playerTurn - 1].GetFleetSize(); i++)
        {
            let selectedShip = `#Ship${i+1}Health`;
            let shipHealth = this.players[this.playerTurn - 1].GetShipHealth(i);
            document.querySelector(selectedShip).innerHTML = shipHealth;
            
            //Changing the color of health if the ship is destroyed
            if (shipHealth <=0)
            {
                document.querySelector(selectedShip).classList.add("ShipDestroyed");
            }
            else
            {
                document.querySelector(selectedShip).classList.remove("ShipDestroyed");
            }
        }
    }
    RefreshMap()
    {
        console.log(this.players);
        for(let i = 0; i < 10; i++)
        {
            for(let j = 0; j < 10; j++)
            {   
                let selectedCell = document.querySelector(`#Cell-${i}${j}`);
                // Clearing out all the classes to draw on a fresh map -> Prevents the positions from being mied up in 2 Player
                selectedCell.classList.remove("EMPTY_CELL","MISSED_HIT","HIT_SHIP","Burning","SHIP")
                if (this.players[this.mapToBeAffected].GetCell(i,j) == EMPTY)
                {
                    selectedCell.classList.add("EMPTY_CELL");
                }
                else if (this.players[this.mapToBeAffected].GetCell(i,j) == SHIP && this.mapSwitched)
                {
                    selectedCell.classList.add("SHIP");
                }
                else if (this.players[this.mapToBeAffected].GetCell(i,j) == MISSED_HIT)
                {
                    selectedCell.classList.add("MISSED_HIT");

                }
                else if (this.players[this.mapToBeAffected].GetCell(i,j) == HIT_SHIP)
                {
                    selectedCell.classList.add("HIT_SHIP");
                }
            }
        }
    }

    Announce(shipHasBeenHit, shipSunk)
    {
        // Announcing
        //The announcer has to come out for every turn only in TWO Player
        //For a 1 player game the the announcer is activated only when the player sinks a ship

        if (shipHasBeenHit && shipSunk != "NONE")
        {
            if (this.noOfPlayers > 1)
            {
                document.querySelector("#AnnouncerContinueButton").innerHTML = `Let's make ${(this.players[this.playerTurn-1].GetPlayerName())} pay!`;
                document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} has sunk the ${shipSunk}!!`;
                window.setTimeout(this.HideGameScreen, 2000);
                window.setTimeout(this.ShowAnnouncer, 2000);
                this.PlaySoundByChance(100, this.CommanderShipSunk);
            }
            else
            {
                document.querySelector("#AnnouncerContinueButton").innerHTML = "Let's Destroy the other ships!";
                document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} has sunk the ${shipSunk}!!`;
                window.setTimeout(this.HideGameScreen, 1500);
                window.setTimeout(this.ShowAnnouncer, 1500);
                this.PlaySoundByChance(70, this.CommanderShipSunk);
            }
        }
        else if (shipHasBeenHit && shipSunk == "NONE" && this.noOfPlayers >1)
        {
            document.querySelector("#AnnouncerContinueButton").innerHTML = `Let's make ${(this.players[this.playerTurn-1].GetPlayerName())} pay!`;
            document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} has landed a successful hit!!`;
            window.setTimeout(this.HideGameScreen, 2000);
            window.setTimeout(this.ShowAnnouncer, 2000);
            this.PlaySoundByChance(50, this.CommanderSuccessfulHit);
        }
        else if (!shipHasBeenHit && this.noOfPlayers > 1)
        {
            document.querySelector("#AnnouncerContinueButton").innerHTML = `Let's finish this!`;
            document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} missed!! Make it Count next time, Sailor!!`;
            window.setTimeout(this.HideGameScreen, 2000);
            window.setTimeout(this.ShowAnnouncer, 2000);
            this.PlaySoundByChance(70, this.CommanderMissedHit);
        }
    }

    CheckPlayerLoss()
    {   
        if(this.players[this.mapToBeAffected].GetFleetHealth() <= 0)
        {
            //Giving an appropriate Announcement
            document.querySelector("#AnnouncerContinueButton").innerHTML = `Main Menu`;
            document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} has won the War.</br>Congratulations Sailor`;
            window.setTimeout(this.HideGameScreen, 2000);
            window.setTimeout(this.ShowAnnouncer, 2000);
            this.gameOver = true;

            if (this.noOfPlayers <=1)
            {
                this.PlaySoundByChance(100, this.CommanderWin);
            }
            
        }
        else if (this.players[this.playerTurn-1].GetMissilesLeft() <=0 && this.noOfPlayers > 1)
        {
            //Declaring a winner based on score
            document.querySelector("#AnnouncerContinueButton").innerHTML = `Main Menu`;
            if (this.players[0].GetPlayerScore() > this.players[1].GetPlayerScore())
            {
                document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} has run out of missiles.</br>${(this.players[0].GetPlayerName())} has won the War has he has the higher score of ${this.players[0].GetPlayerScore()}.</br>Congratulations Sailor`;
            }
            else if (this.players[1].GetPlayerScore() > this.players[0].GetPlayerScore())
            {
                document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} has run out of missiles.</br>${(this.players[1].GetPlayerName())} has won the War has he has the higher score of ${this.players[1].GetPlayerScore()}.</br>Congratulations Sailor`;
            }
            else
            {
                document.querySelector("#CommentBox").innerHTML = `${(this.players[this.playerTurn-1].GetPlayerName())} has run out of missiles and both of you have an equal score of ${this.players[1].GetPlayerScore()}.</br>${(this.players[this.mapToBeAffected].GetPlayerName())} has won the War.</br>Congratulations Sailor`;
            }
            window.setTimeout(this.HideGameScreen, 2000);
            window.setTimeout(this.ShowAnnouncer, 2000);
            this.gameOver = true;
        }
        else if (this.players[this.playerTurn-1].GetMissilesLeft() <=0 && this.noOfPlayers <= 1)
        {
            //Making sure people don't shoot after their missiles are over
            this.cellsCanBeClicked = false;

            //Giving an appropriate Announcement
            document.querySelector("#AnnouncerContinueButton").innerHTML = `Main Menu`;
            document.querySelector("#CommentBox").innerHTML = `You ran out of missiles. Back to your desk job rookie!!`;
            window.setTimeout(this.HideGameScreen, 1500);
            window.setTimeout(this.ShowAnnouncer, 1500);
            this.gameOver = true;
            this.PlaySoundByChance(100, this.CommanderLose);
        }
    }

    CalculatePlayerScore(shipHit, shipSunk)
    {
        //Calculating Player Score based on score and
        if(shipHit == true)
        {
            this.players[this.playerTurn-1].UpdatePlayerScoreWithScoreStreak(1000);
            this.players[this.playerTurn-1].IncreaseScoreStreak();
        }
        else
        {
            this.players[this.playerTurn-1].ResetScoreStreak();
        }

        if (shipSunk == "AirCraftCarrier")
        {
            this.players[this.playerTurn-1].UpdatePlayerScore(4000);
        }
        else if (shipSunk == "Battleship")
        {
            this.players[this.playerTurn-1].UpdatePlayerScore(3000);
        }
        else if (shipSunk == "Cruiser")
        {
            this.players[this.playerTurn-1].UpdatePlayerScore(3000);
        }
        else if (shipSunk == "Destroyer")
        {
            this.players[this.playerTurn-1].UpdatePlayerScore(2000);
        }
        else if (shipSunk == "Submarine")
        {
            this.players[this.playerTurn-1].UpdatePlayerScore(1000);
        }
    }

    //Switch the Map to allow each player to view their Map before attacking their
    SwitchMap(mapSwitched, playerTurn)
    {
        // Prevents the player from clicking the switch button after he shoots a square
        if (this.cellsCanBeClicked == false && this.mapSwitched == false)
        {
            return;
        }

        if (!mapSwitched)
        {
            this.mapSwitched = true;
            this.cellsCanBeClicked = false;
            if (playerTurn == 1)
            {
                this.mapToBeAffected = 0;
            }
            else if (playerTurn == 2)
            {
                this.mapToBeAffected = 1;
            }
            this.RefreshMap();
            document.querySelector("#MapName").innerHTML = `Your Map`;
        }
        else
        {
            this.mapSwitched = false;
            this.cellsCanBeClicked = true;
            if (playerTurn == 1)
            {
                this.mapToBeAffected = 1;
            }
            else if (playerTurn == 2)
            {
                this.mapToBeAffected = 0;
            }
            this.RefreshMap();
            document.querySelector("#MapName").innerHTML = `Opponent's Map`;
        }
    }

    // Creating the Map
    CreateMapView(h = APP.MAX_HEIGHT, w = APP.MAX_WIDTH)
    {
        let markUp = "<table>";
        for (let row = 0; row < w; row++)
        {
            markUp += "<tr>";
            for (let col = 0; col < h; col++)
            {
                let cellId = `Cell-${row}${col}`;
                markUp += `<td id="${cellId}" data-row="${row}" data-col="${col}" class="Cell"></td>`;
            }
            markUp += "</tr>";
        }
        markUp += "</table>";
        document.querySelector("#GameBoard").innerHTML = markUp;

        //Add event Listeners
        for(let i = 0; i < 10; i++)
        {
            for(let j = 0; j < 10; j++)
            {   
                let selectedCell = document.querySelector(`#Cell-${i}${j}`);
                selectedCell.addEventListener("click", event => this.HandleMapClick(event));
                selectedCell.addEventListener("mouseover", event => {
                    if (this.soundMuted != true)
                    {
                        this.UISound.play();
                        this.UISound.setPercent(0);
                    }
                });
            }
        }
    }


    //SoundFile being played depending on the chance
    PlaySoundByChance(percentageChance, soundFile)
    {
        let chance = Math.floor((Math.random() * 10)+1);
        if (chance <= (10- (10*percentageChance/100)) && this.soundMuted!=true)
        {
            soundFile.play();
            soundFile.setVolume(80);
        }
    }

    //Hiding and showing elements
    ShowMainMenu()
    {
        this.MainMenu.classList.add("ShowScreen");
        this.MainMenu.classList.remove("Hide");
    }
    ShowAnnouncer()
    {
        this.Announcer.classList.add("ShowScreen");
        this.Announcer.classList.remove("Hide");
    }
    HideAnnouncer()
    {
        this.Announcer.classList.add("Hide");
        this.Announcer.classList.remove("ShowScreen");
    }

    ShowGameScreen()
    {
        this.GameScreen.classList.remove("Hide");
        this.GameScreen.classList.add("ShowScreen");
    }
    HideGameScreen()
    {
        this.GameScreen.classList.remove("ShowScreen");
        this.GameScreen.classList.add("Hide");
    }

    ShowPauseScreen()
    {
        this.PauseScreen.classList.remove("Hide");
        this.PauseScreen.classList.add("ShowScreen");
    }
    HidePauseScreen()
    {
        this.PauseScreen.classList.remove("ShowScreen");
        this.PauseScreen.classList.add("Hide");
    }
}
