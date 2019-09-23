/** 
 * Fleet Class
 * @copyright: (C) 2018 in cooperation with Vancouver Film School. All Right Reserved.
 * @author: Harish Kumar --> {@ link harishsghp@live.com}
 * @ version: 1.0.0
*/

const HORIZONTAL = 1;
const VERTICAL = 2;
const POSITION_UNDEFINED = -1;
const APP = {
    MAX_HEIGHT: 10
  , MAX_WIDTH: 10
}
const EMPTY = 0;
const MISSED_HIT = 1;
const SHIP = 2;
const HIT_SHIP = 3;
const MAX_MISSILES = 45;
const SCORE_STREAK_INCREASE = 0.5;

class Fleet
{
    constructor()
    {
        let airCraftCarrier = {
            shipType: "AirCraftCarrier",
            size: 5,
            hasBeenSunk: false,
            orientation: 0,
            frontPositionColumn: POSITION_UNDEFINED,
            rearPositionColumn: POSITION_UNDEFINED,
            frontPositionRow: POSITION_UNDEFINED,
            rearPositionRow: POSITION_UNDEFINED
        };
        let battleship = {
            shipType: "Battleship",
            size: 4,
            hasBeenSunk: false,
            orientation: 0,
            frontPositionColumn: POSITION_UNDEFINED,
            rearPositionColumn: POSITION_UNDEFINED,
            frontPositionRow: POSITION_UNDEFINED,
            rearPositionRow: POSITION_UNDEFINED
        };
        let cruiser = {
            shipType: "Cruiser",
            size: 4,
            hasBeenSunk: false,
            orientation: 0,
            frontPositionColumn: POSITION_UNDEFINED,
            rearPositionColumn: POSITION_UNDEFINED,
            frontPositionRow: POSITION_UNDEFINED,
            rearPositionRow: POSITION_UNDEFINED
        };
        let destroyer = {
            shipType: "Destroyer",
            size: 3,
            hasBeenSunk: false,
            orientation: 0,
            frontPositionColumn: POSITION_UNDEFINED,
            rearPositionColumn: POSITION_UNDEFINED,
            frontPositionRow: POSITION_UNDEFINED,
            rearPositionRow: POSITION_UNDEFINED
        };
        let submarine = {
            shipType: "Submarine",
            size: 2,
            hasBeenSunk: false,
            orientation: 0,
            frontPositionColumn: POSITION_UNDEFINED,
            rearPositionColumn: POSITION_UNDEFINED,
            frontPositionRow: POSITION_UNDEFINED,
            rearPositionRow: POSITION_UNDEFINED
        };
        this.fleet = [airCraftCarrier, battleship, cruiser, destroyer, submarine];
    }
    

    PlaceShips(map)
    {
        for (let i = 0; i < this.fleet.length; i++)
        {
            while (true)
            {
                let row = Math.floor((Math.random() * 10));
                let column = Math.floor((Math.random() * 10));
                let orientation = Math.floor((Math.random() * 2)+1);                                        // 1 means horizontal and 2 means vertical
                if (map[row][column] == EMPTY)
                {
                    if (orientation == HORIZONTAL)
                    {
                        // Checking if the ship will fit in the random space it has been assigned
                        if (column + this.fleet[i].size < 10 && this.CheckIfShipInPath(HORIZONTAL, this.fleet[i].size, row, column, map))
                        {   
                            for (let j = column; j < column + this.fleet[i].size; j++)
                            {
                                map[row][j] = SHIP;                                                         // 2 means the area is occupied by a ship
                            }
                            this.fleet[i].orientation = HORIZONTAL;
                            this.fleet[i].frontPositionColumn = column;
                            this.fleet[i].frontPositionRow = row;
                            this.fleet[i].rearPositionRow = row;
                            this.fleet[i].rearPositionColumn = column + this.fleet[i].size -1 ;             // For maintaining the range within 0 to 9
                            break;
                        }
                        else
                        {
                            continue;
                        }
                    }
                    else if (orientation == VERTICAL)
                    {
                        // Checking if the ship will fit in the random space it has been assigned
                        if (row + this.fleet[i].size < 10 && this.CheckIfShipInPath(VERTICAL, this.fleet[i].size, row, column, map))
                        {
                            for (let j = row; j < row + this.fleet[i].size; j++)
                            {
                                map[j][column] = SHIP;                                                      // 2 means the area is occupied by a ship
                            }
                            this.fleet[i].orientation = VERTICAL;
                            this.fleet[i].frontPositionColumn = column;
                            this.fleet[i].frontPositionRow = row;
                            this.fleet[i].rearPositionRow = row + this.fleet[i].size -1;                    // For maintaining the range within 0 to 9
                            this.fleet[i].rearPositionColumn = column ;      
                            break;
                        }
                        else
                        {
                            continue;
                        }
                    }
                }
                else
                {
                    continue;
                }
            }
        }
        return map;
    }

    CheckIfShipInPath(orientation, size, row, column, map)
    {
        let noShipsInPath = true;
        if (orientation == HORIZONTAL)
        {
            for (let j = column; j < (column+size) ; j++)
            {
                if (map[row][j] == SHIP)
                {
                    noShipsInPath = false;
                    break;
                }
            }
        }
        else
        {
            if (orientation == VERTICAL)
            {
                for (let j = row; j < (row+size) ; j++)
                {
                    if (map[j][column] == SHIP)
                    {
                        noShipsInPath = false;
                        break;
                    }
                }
            }
        }
        return noShipsInPath;
    }

    CheckIfShipsHit(row,column)
    {
        let shipHit = false;
        for(let i = 0; i < this.fleet.length; i++)
        {
            if (this.fleet[i].orientation == HORIZONTAL && this.fleet[i].frontPositionRow == row)
            {
                if (column >= this.fleet[i].frontPositionColumn && column <= this.fleet[i].rearPositionColumn)
                {
                    shipHit = true;
                    this.fleet[i].size -= 1;
                    break;
                }
            }
            else if (this.fleet[i].orientation == VERTICAL && this.fleet[i].frontPositionColumn == column)
            {
                if (row >= this.fleet[i].frontPositionRow && row <= this.fleet[i].rearPositionRow)
                {
                    shipHit = true;
                    this.fleet[i].size -= 1;
                    break;
                }
            } 
        }
        return shipHit;
    }

    CheckIfShipSunk()
    {
        for (let i = 0; i < this.fleet.length; i++)
        {
            if (this.fleet[i].size <=0 && this.fleet[i].hasBeenSunk == false)
            {
                let shipType = this.fleet[i].shipType;
                this.fleet[i].hasBeenSunk = true;
                return shipType;
            }
        }
        return "NONE";
    }

    GetFleetHealth()
    {
        let health = 5;
        for (let i=0; i < this.fleet.length; i++)
        {
            if (this.fleet[i].size <= 0)
            {
                health--;
            }
        }
        return health;
    }

    GetFleetSize()
    {
        return this.fleet.length;
    }

}