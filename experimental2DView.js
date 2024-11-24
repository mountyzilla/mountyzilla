class Grid {

    constructor(x, y, n, horizontalRange, verticalRange) {
        this.centerX = x;
        this.centerY = y;
        this.centerN = n;
        this.horizontalRange = horizontalRange;
        this.verticalRange = verticalRange;
        this.gridSize = 1 + 2 * this.horizontalRange;

        this.cells = new Array(this.gridSize);
    }

    convertToHtml() {
        let html = `<div style="display: grid; column-gap: 2px; row-gap: 2px;"> `;
        for (let i = 0; i < this.gridSize; i++) {
            let column = this.cells[i];
            for (let j = 0; j < this.gridSize; j++) {
                if (null == column) {
                    html += this.emptyCell(i, j);
                    continue;
                }
                let cell = column[j];
                if (null == cell) {
                    html += this.emptyCell(i, j);
                    continue;
                }
                html += cell.convertToHtml(i, j, this.centerX, this.centerY);
            }
        }
        html += `</div>`;
        return html;
    }

    emptyCell(i, j) {
        const center = 1 + this.horizontalRange;
        return `<div style="grid-row-start: ${i + 1}; grid-column-start: ${j + 1}" class="${cellStyle(center, center, i+1, j+1)}">&nbsp;</div>`;
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
        if (i > this.gridSize || i < 0
            || j > this.gridSize || j < 0) {
            // outside of the view range
            return null;
        }
        let column = this.cells[i];
        if (null == column) {
            column = new Array(this.gridSize);
            this.cells[i] = column;
        }
        let cell = column[j];
        if (null == cell) {
            cell = new Cell(x, y);
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

function cellStyle(centerX, centerY, x, y) {
    const distX = Math.abs(centerX - x);
    const distY = Math.abs(centerY - y);
    const dist = Math.max(distX, distY);
    console.log(`${centerX}_${centerX}_${x}_${y}_${distX}_${distY}`);
    return 0 === (dist % 2) ? `mh_view_odd` : `mh_view_even`;
}

class Cell {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    convertToHtml(i, j, centerX, centerY) {
        let html = `<div style="grid-row-start: ${i + 1}; grid-column-start: ${j + 1}" class="${cellStyle(centerX, centerY, this.x, this.y)}">`;
        if (null != this.monsters) {
            for (const monster of this.monsters) {
                html += `${monster.name}<br/>`;
            }
        }
        if (null != this.trolls) {
            for (const troll of this.trolls) {
                html += `${troll.name}<br/>`;
            }
        }
        html += "</div>";
        return html;
    }

    addMonster(monster) {
        this.monsters = null == this.monsters ? [] : this.monsters;
        this.monsters.push(monster);
        this.monsters.sort((a, b) => a.n - b.n);
    }

    addTroll(troll) {
        this.trolls = null == this.trolls ? [] : this.trolls;
        this.trolls.push(troll);
        this.trolls.sort((a, b) => a.n - b.n);
    }

    addMushroom(mushroom) {
        this.mushrooms = null == this.mushrooms ? [] : this.mushrooms;
        this.mushrooms.push(mushroom);
        this.mushrooms.sort((a, b) => a.n - b.n);
    }

    addGrave(grave) {
        this.graves = null == this.graves ? [] : this.graves;
        this.graves.push(grave);
        this.graves.sort((a, b) => a.n - b.n);
    }

    addPlace(place) {
        this.places = null == this.places ? [] : this.places;
        this.places.push(place);
        this.places.sort((a, b) => a.n - b.n);
    }

    addTreasure(treasure) {
        this.treasures = null == this.treasures ? [] : this.treasures;
        this.treasures.push(treasure);
        this.treasures.sort((a, b) => a.n - b.n);
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
        this.distance = val.dist;

        switch (this.type) {
            case "monstres" :
                this.name = val.nom.options.sortValue;
                this.groupName = this.toGroupName(this.name);
                this.family = "todo";
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

    toGroupName(name) {
        let i = name.indexOf("[");
        if (i < 0) {
            return name;
        }
        let j = i - 1;
        while (j > 0 && ' ' === name[j]) j--;
        return name.substring(0, j + 1);
    }
}


const style = document.createElement('style');
style.appendChild(document.createTextNode(`
.mh_view_odd { background-color: teal; }
.mh_view_even { background-color: lightgreen; }
`));
document.head.appendChild(style);

g = new Grid(86, 78, -30, 14, 7);
g.indexMap(json_monstres, json_trolls, json_tresors, json_lieux, json_champignons, json_cenotaphes);
html = g.convertToHtml();
$('#infoTab').after(html);
