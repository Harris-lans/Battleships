/** 
 * Player Class
 * 
 * @copyright: (C) 2018 in cooperation with Vancouver Film Sdchool. All Right Reserved.
 * @author: Harish Kumar --> {@ link harishsghp@live.com}
 * @ version: 1.0.0
*/

class Player
{
    constructor(name, noOfMissiles)
    {
        this.playerName = name;
        this.fleetOfShips = new Fleet();
        this.playerMap = new Map();
        this.playerMap.map = this.fleetOfShips.PlaceShips(this.playerMap.map);
        this.missiles = noOfMissiles;
        this.fleetHealth = this.fleetOfShips.GetFleetHealth();
        this.score = 0;
        this.scoreStreak = 1;
        this.fleetSize = this.fleetOfShips.GetFleetSize();
    }

    CheckForShipDamage (row, column)
    {
        let shipHit = this.fleetOfShips.CheckIfShipsHit(row,column);
        return shipHit;
    }

    CheckForSunkShips ()
    {
        let shipSunk = this.fleetOfShips.CheckIfShipSunk();
        this.fleetHealth = this.fleetOfShips.GetFleetHealth();
        return shipSunk;
    }

    UpdateMap (row, column)
    {
        this.playerMap.UpdateMapAfterHit(row, column);
    }
    ShotFired()
    {
        this.missiles -= 1;
    }

    // Get values of the players Map and Fleet
    GetCell (row, column)
    {
        let map = this.playerMap.GetMap();
        return map[row][column];
    }

    GetShipHealth(shipIndex)
    {
        return this.fleetOfShips.fleet[shipIndex].size;
    }

    GetFleetHealth()
    {
        return this.fleetHealth;
    }

    GetMissilesLeft()
    {
        return this.missiles;
    }

    GetPlayerScore()
    {
        return this.score;
    }

    GetPlayerName()
    {
        return this.playerName;
    }

    GetScoreStreak()
    {
        return this.scoreStreak;
    }

    GetFleetSize()
    {
        this.fleetSize = this.fleetOfShips.GetFleetSize();
        return this.fleetSize;
    }

    //Setting values of the Player's Map and Fleet

    UpdatePlayerScoreWithScoreStreak(score)
    {
        this.score += score * this.scoreStreak;
    }
    UpdatePlayerScore(score)
    {
        this.score += score;
    }
    IncreaseScoreStreak()
    {
        this.scoreStreak += SCORE_STREAK_INCREASE;
    }
    ResetScoreStreak()
    {
        this.scoreStreak = 1;
    }
}