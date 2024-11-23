
class Grid {

    constructor(x,y,n, horizontalRange, verticalRange) {
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
        if ( i > 1 + 2 * this.horizontalRange || i < 0
            || j > 1 + 2 * this.horizontalRange || j < 0
        ) {
            console.log(`Out of range: ${x} ${y}  => ${i} ${j}`);
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
            //cell = new Cell();
            cell = [];
            column[j] = cell;
        }
        console.log(cell);
        return cell;
    }
}

class Cell {

}

class CellObject {

    constructor(mhValue) {
        let val = mhValue.value;
        this.type = val.type;
        this.family = "todo";
        this.name = val.nom.options.sortValue;
        this.id = val.id;
        this.x = val.x;
        this.y = val.y;
        this.n = val.n;
        this.groupName = "todo";
        this.distance = val.dist; // todo
        this.distanceCost = 0; // todo
    }
}


function indexMap(grid, monstres) {
    for (const mob of monstres) {
        let monstre = new CellObject(mob);
        let cell = grid.getCell(monstre.x, monstre.y)
        if (null == cell) {
        } else {
            cell.push(monstre);
        }
    }
}


g = new Grid(86,78,-30,14,7);
indexMap(g, json_monstres);