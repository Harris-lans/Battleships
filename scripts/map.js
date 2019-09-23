/** 
 * Map Class
 * 
 * @copyright: (C) 2018 in cooperation with Vancouver Film School. All Right Reserved.
 * @author: Harish Kumar --> {@ link harishsghp@live.com}
 * @ version: 1.0.0
*/

class Map
{
    constructor()
    {
        this.map = [ [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0] ]; 
    }

    GetMap()
    {
        return this.map;
    }

    UpdateMap(updatedMap)
    {
        this.map = updatedMap;
    }

    UpdateMapAfterHit(row, column)
    {
        if (this.map[row][column] == EMPTY)
        {
            this.map[row][column] = MISSED_HIT;
        }
        else if (this.map[row][column] == SHIP)
        {
            this.map[row][column] = HIT_SHIP;
        }
    }
}