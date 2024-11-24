class Grid {

    constructor(x, y, n, horizontalRange, verticalRange) {
        this.centerX = x;
        this.centerY = y;
        this.centerN = n;
        this.horizontalRange = horizontalRange;
        this.verticalRange = verticalRange;

        this.cells = new Array(1 + 2 * horizontalRange);
    }

    xToIndex(x) {
        return x - this.centerX + this.horizontalRange;
    }

    yToIndex(y) {
        return y - this.centerY + this.horizontalRange;
    }

    getCell(x, y) {
        let i = this.xToIndex(x);
        let j = this.yToIndex(y);
        if (i > 1 + 2 * this.horizontalRange || i < 0
            || j > 1 + 2 * this.horizontalRange || j < 0) {
            // outside of the view range
            return null;
        }
        let column = this.cells[i];
        if (null == column) {
            column = new Array(1 + 2 * this.horizontalRange);
            this.cells[i] = column;
        }
        let cell = column[j];
        if (null == cell) {
            cell = new Cell(x,y);
            column[j] = cell;
        }
        return cell;
    }

    indexMap(monsters, trolls, treasures, places, mushrooms, graves) {
        this.indexCategory(monsters, (cell, o) => cell.addMonster(o));
        this.indexCategory(trolls, (cell, o) => cell.addTroll(o));
        this.indexCategory(treasures, (cell, o) => cell.addTreasure(o));
        this.indexCategory(places, (cell, o) => cell.addPlace(o));
        this.indexCategory(mushrooms, (cell, o) => cell.addMushroom(o));
        this.indexCategory(graves, (cell, o) => cell.addGrave(o));
    }

    indexCategory(gridElements, addFunction) {
        if (null == gridElements) {
            return;
        }
        for (const element of gridElements) {
            let o = new CellObject(element);
            let cell = this.getCell(o.x, o.y)
            if (null != cell) {
                addFunction(cell, o);
            }
        }
    }

}

class Cell {

    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    addMonster(monster) {
        this.monsters = null == this.monsters ? [] : this.monsters;
        this.monsters.push(monster);
    }

    addTroll(troll) {
        this.trolls = null == this.trolls ? [] : this.trolls;
        this.trolls.push(troll);
    }

    addMushroom(mushroom) {
        this.mushrooms = null == this.mushrooms ? [] : this.mushrooms;
        this.mushrooms.push(mushroom);
    }

    addGrave(grave) {
        this.graves = null == this.graves ? [] : this.graves;
        this.graves.push(grave);
    }

    addPlace(place) {
        this.places = null == this.places ? [] : this.places;
        this.places.push(place);
    }

    addTreasure(treasure) {
        this.treasures = null == this.treasures ? [] : this.treasures;
        this.treasures.push(treasure);
    }

}

class CellObject {

    constructor(mhValue) {
        let val = mhValue.value;
        this.type = val.type;
        this.id = val.id;
        this.x = val.x;
        this.y = val.y;
        this.n = val.n;
        this.distance = val.dist; // todo
        this.distanceCost = 0; // todo

        switch (this.type) {
            case "monstres" :
                this.groupName = "todo";
                this.family = "todo";
                this.name = val.nom.options.sortValue;
                break;
            case "champignons":
                this.name = val.nom;
                break;
            case "cenotaphes" :
                // TODO
                break;
            case "lieux" :
                this.name = val.nom.options.sortValue;
                break;
            case "tresors" :
                this.name = val.nom.options.sortValue;
                break;
            case "trolls" :
                this.name = val.nom.options.sortValue;
                this.race = val.race;
                this.level = val.niv;
                break;


        }
    }
}


g = new Grid(86, 78, -30, 14, 7);
g.indexMap(json_monstres, json_trolls, json_tresors, json_lieux, json_champignons, json_cenotaphes);