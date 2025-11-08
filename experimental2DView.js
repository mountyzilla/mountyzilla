// Namespace MZGrid
window.MZGrid = window.MZGrid || {};

(function (MZGrid) {

    const TREASURE_ICONS = {
        "GG": "E_Gold02.png",
        "anneau": "I_Scroll02.png",
        "arme (1 main)": "S_Sword07.png",
        "arme (2 mains)": "W_Axe006_R.png",
        "arme": "S_Sword07.png",
        "armure": "A_Armor05.png",
        "bidouille": "S_Magic02.png",
        "bottes": "A_Shoes02.png",
        "bouclier": "E_Metal02.png",
        "carte": "I_Map.png",
        "casque": "C_Elm03.png",
        "composant": "I_Tentacle.png",
        "minerai": "I_Crystal01.png",
        "materiau": "I_Crystal01.png",
        "outil": "Z_BoneWrench.png",
        "parchemin": "I_Scroll02.png",
        "potion": "P_Medicine05.png",
        "special": "E_Gold01.png",
        "talisman": "Ac_Necklace03.png",
    };

    const TREASURE_TYPES = {
        "armure d'anneaux": "armure",
        "couronne d'obsidienne": "casque",
        "coutelas d'obsidienne": "arme (1 main)",
        "cuirasse d'ossements": "armure",
        "cuirasse d'ecailles": "armure",
        "gros'porte": "bouclier",
        "hache a deux mains d'obsidienne": "arme (2 mains)",
        "haubert d'ecailles": "armure",
        "lame d'obsidienne": "arme (1 main)",
        "masse d'arme": "arme (1 main)",
        "talisman d'obsidienne": "talisman",
        "tunique d'ecailles": "armure",
        'anneau de protection': "anneau",
        'anneau magique': "anneau",
        'armure de bois': "armure",
        'armure de cuir': "armure",
        'armure de peaux': "armure",
        'armure de pierre': "armure",
        'armure de plates': "armure",
        'baton de mage': "arme (1 main)",
        'baton leste': "arme (2 mains)",
        'baton de mage': "arme (2 mains)",
        'bottes': "bottes",
        'bouclier a pointes': "bouclier",
        'boulet et chaîne': "arme (1 main)",
        'bâtons de parade': "arme (2 mains)",
        'cagoule': "casque",
        'casque en cuir': "casque",
        'casque en metal': "casque",
        'casque a cornes': "casque",
        'casque a pointes': "casque",
        'chapeau pointu': "casque",
        'chaîne cloutee': "arme (2 mains)",
        'collier de dents': "talisman",
        'collier de pierre': "talisman",
        'collier a pointes': "talisman",
        'cotte de mailles': "armure",
        'couronne de cristal': "casque",
        'couronne de ronces': "casque",
        'coutelas en os': "arme (1 main)",
        'crochet': "arme (1 main)",
        'cuir bouilli': "armure",
        'culotte en cuir': "armure",
        'dague': "arme (1 main)",
        'epee courte': "arme (1 main)",
        'epee longue': "arme (1 main)",
        'espadon': "arme (2 mains)",
        'filet': "arme (1 main)",
        'fouet': "arme (1 main)",
        'fourrures': "armure",
        'gantelet': "arme (1 main)",
        'gorgeron en cuir': "armure",
        'gorgeron en metal': "armure",
        'gourdin cloute': "arme (1 main)",
        'gourdin': "arme (1 main)",
        'grimoire': "bouclier",
        'grosse racine': "arme (1 main)",
        'grosse stalagmite': "arme (2 mains)",
        'hache de bataille': "arme (2 mains)",
        'hache de guerre en os': "arme (2 mains)",
        'hache de guerre en pierre': "arme (2 mains)",
        'hallebarde': "arme (2 mains)",
        'haubert de mailles': "armure",
        'heaume': "casque",
        'jambieres en cuir': "bottes",
        'jambieres en fourrure': "bottes",
        'jambieres en maille': "bottes",
        'jambieres en metal': "bottes",
        'jambieres en os': "bottes",
        'lame en os': "arme (1 main)",
        'lame en pierre': "arme (1 main)",
        'lorgnons': "casque",
        'machette': "arme (1 main)",
        'menhir': "bouclier",
        'oeil de sang': "talisman",
        'pagne de mailles': "armure",
        'pagne en cuir': "armure",
        'pendentif incandescent': "talisman",
        'robe de mage': "armure",
        'rondache en bois': "bouclier",
        'rondache en metal': "bouclier",
        'sandales': "bottes",
        'souliers dores': "bottes",
        'talisman de pierre': "talisman",
        'targe': "bouclier",
        'torche': "arme (1 main)",
        'torque de pierre': "talisman",
        'tunique': "armure",
        'turban': "casque",
    };

    class Grid {

        constructor(x, y, n, horizontalRange, verticalRange) {
            this.centerX = x;
            this.centerY = y;
            this.centerN = n;
            this.horizontalRange = horizontalRange;
            this.verticalRange = verticalRange;
            this.gridSize = 3 + 2 * this.horizontalRange; // 2 lignes/colonnes en plus pour les cellules de coordonnées

            this.cells = new Array(this.gridSize);
        }

        convertToHtml(id) {
            const borderIndex = this.gridSize - 1;
            let html = `<div id="${id}" class="mz-map-grid-view-wrapper" style="grid-template-columns: repeat(${this.gridSize}, 15rem); grid-template-rows: repeat(${this.gridSize}, 10rem);"> `;
            for (let i = 0; i < this.gridSize; i++) {
                let column = this.cells[i];
                for (let j = 0; j < this.gridSize; j++) {
                    if (0 === i || 0 === j || borderIndex === i || borderIndex === j) {
                        if (i === j || i + j === borderIndex) {
                            html += this.emptyCell(i, j);
                        } else {
                            html += this.borderCell(i, j);
                        }
                        continue;
                    }

                    let cell = this.getCellInternal(i, j);
                    html += cell.convertToHtml(i, j, this.centerX, this.centerY);
                }
            }
            html += `</div>`;
            return html;
        }

        emptyCell(i, j) {
            const center = 1 + this.horizontalRange;
            return `<div style="grid-row-start: ${j + 1}; grid-column-start: ${i + 1}" class="${cellStyle(center, center, i + 1, j + 1)}">&nbsp;</div>`;
        }

        borderCell(i, j) {
            const center = 1 + this.horizontalRange;
            const borderIndex = this.gridSize - 1;
            const index = (0 === i) || borderIndex === i ? this.indexToY(j) : this.indexToX(i);
            let borderClass = 0 === i ? "mz-map-grid-view-border-left" : "";
            borderClass = borderIndex === i ? "mz-map-grid-view-border-right" : borderClass;
            return `<div style="grid-row-start: ${j + 1}; grid-column-start: ${i + 1}" class="${cellStyle(center, center, i + 1, j + 1)}"><span class="mz-map-grid-view-border ${borderClass}">${index}</span></div>`;
        }

        xToIndex(x) {
            return x - this.centerX + this.horizontalRange;
        }

        indexToX(i) {
            return i + this.centerX - this.horizontalRange;
        }

        yToIndex(y) {
            return y - this.centerY + this.horizontalRange;
        }

        indexToY(i) {
            return i + this.centerY - this.horizontalRange;
        }

        getCellMounty(x, y) {
            let i = this.xToIndex(x);
            let j = this.yToIndex(y);
            return this.getCell(i, j, x, y);
        }

        getCellInternal(i, j) {
            let x = this.indexToX(i);
            let y = this.indexToY(j);
            return this.getCell(i, j, x, y);
        }

        getCell(i, j, x, y) {
            if (i >= this.gridSize || i < 0
                || j >= this.gridSize || j < 0) {
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
            let here = this.getCellMounty(this.centerX, this.centerY);
            here.youAreHere = this.centerN;
            for (const element of gridElements) {
                let o = new CellObject(element);
                let cell = this.getCellMounty(o.x, o.y)
                if (null != cell) {
                    addFunction(cell, o);
                }
            }
        }

        /**
         * Centre la grille sur la cellule du joueur.
         */
        gotoPlayer() {
            let gridHolder = $("#mz-map-grid-scroll")[0];
            let gridRect = gridHolder.getBoundingClientRect();
            let playerCell = $("#you-are-here")[0];
            let cellRect = playerCell.getBoundingClientRect();

            let cellLeft = cellRect.left - gridRect.left + gridHolder.scrollLeft;
            let cellTop = cellRect.top - gridRect.top + gridHolder.scrollTop;

            let scrollLeft = cellLeft - (gridHolder.clientWidth / 2) + (cellRect.width / 2);
            let scrollTop = cellTop - (gridHolder.clientHeight / 2) + (cellRect.height / 2);

            gridHolder.scrollTo({left: scrollLeft, top: scrollTop});
        };

    }

    /**
     * Représente la cellule du point de vue DOM
     */
    class Cell {

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        convertToHtml(i, j, centerX, centerY) {

            const id = this.youAreHere ? `id="you-are-here"` : ``;
            let html = `<div ${id} mz-grid-x={this.x} mz-grid-y=${this.y} style="grid-row-start: ${j + 1}; grid-column-start: ${i + 1}" class="mz-map-grid-view-cell ${cellStyle(centerX, centerY, this.x, this.y)}"><div class="mz-map-grid-view-cell-content">`;
            if (null != this.monsters
                || null != this.trolls
                || null != this.treasures
                || null != this.places
                || null != this.mushrooms
                || null != this.graves) {
                html += `<span class="mz-map-grid-view-cell-header">${this.x} ${this.y}</span>`;
            }
            if (null != this.youAreHere) {
                html += `<span class="mz-map-grid-view-here">Vous &ecirc;tes ici (${this.youAreHere})</span>`;
            }
            for (let depth = MZGrid.grid.centerN - MZGrid.grid.verticalRange; depth <= MZGrid.grid.centerN + MZGrid.grid.verticalRange; depth++) {
                let depthHtml = this.groupToHtml(depth, this.trolls, this.trollToHtml)
                    + this.groupToHtml(depth, this.monsters, this.monsterToHtml)
                    + this.groupToHtml(depth, this.places, this.placeToHtml)
                    + this.treasuresToHtml(depth);
                if (depthHtml.length > 0) {
                    html += `<span class="mz-map-grid-view-cell-header">${depth}</span>` + depthHtml;
                }
            }
            html += "</div></div>";
            return html;
        }

        trollToHtml(troll) {
            return `<span class="mz-map-grid-view-troll" mz_id=${troll.id} mz_grid_type="trolls">${troll.name} ${troll.race.substring(0,2)}${troll.level}`;
        }

        monsterToHtml(monster) {
            return `<span class="mz-map-grid-view-monster" mz_id=${monster.id} mz_grid_type="monstres">${monster.groupName}`;
        }

        placeToHtml(place) {
            return `<span class="mz-map-grid-view-place" mz_id=${place.id} mz_grid_type="lieux">${place.name}`;
        }

        treasuresToHtml(depth) {
            if (null == this.treasures) {
                return '';
            }
            let summary = new Map();
            for (const treasure of this.treasures) {
                if (treasure.n !== depth) {
                    continue;
                }
                let treasureName = treasure.name.toLowerCase();
                if (treasureName.indexOf("centaines de") >= 0 || treasureName.indexOf("gigots de") >= 0) {
                    summary.set('GG', (summary.get('GG') ?? 0) + 1);
                    continue;
                }
                let type = TREASURE_TYPES[treasureName];
                type = null == type ? treasureName : type[0];
                summary.set(type, (summary.get(type) ?? 0) + 1);
            }
            if (summary.size === 0) {
                return '';
            }
            let result = '<span className="mz-map-grid-view-treasure" mz_grid_type="treasure">';
            let keys = Array.from(summary.keys()).sort();
            let icons = keys.map(key => {
                return `<img src='../Images/Icones/${TREASURE_ICONS[key]}' title='${key}' height='15'/>:${summary.get(key)}`;
            });
            result += `${icons.join(" ")}</span>`;
            return result;
        }

        groupToHtml(depth, group, itemToSpan) {
            if (null == group) {
                return '';
            }
            let summary = new Map();

            for (const item of group) {
                if (item.n !== depth) {
                    continue;
                }
                let name = item.groupName ?? item.name;
                summary.set(name, summary.get(name) ?? [itemToSpan(item), 0]);
                summary.get(name)[1]++;
            }
            if (summary.size === 0) {
                return '';
            }
            let keys = Array.from(summary.keys()).sort();
            let values = keys.map(key => {
                let value = summary.get(key);
                let text = value[0];
                return value[1] === 1 ? `${text}</span>` : `${text} : ${value[1]}</span>`;
            });
            return values.join(" ");
        }

        sortByDepthAndName(a, b) {
            if (a.n != b.n) {
                return a.n - b.n;
            }
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        };

        addMonster(monster) {
            this.monsters = this.monsters ?? [];
            this.monsters.push(monster);
            this.monsters.sort(this.sortByDepthAndName); // TODO: sort when all add operations are done
        }

        addTroll(troll) {
            this.trolls = this.trolls ?? [];
            this.trolls.push(troll);
            this.trolls.sort(this.sortByDepthAndName);
        }

        addMushroom(mushroom) {
            this.mushrooms = this.mushrooms ?? [];
            this.mushrooms.push(mushroom);
            this.mushrooms.sort(this.sortByDepthAndName);
        }

        addGrave(grave) {
            this.graves = this.graves ?? [];
            this.graves.push(grave);
            this.graves.sort(this.sortByDepthAndName);
        }

        addPlace(place) {
            this.places = this.places ?? [];
            this.places.push(place);
            this.places.sort(this.sortByDepthAndName);
        }

        addTreasure(treasure) {
            this.treasures = this.treasures ?? [];
            this.treasures.push(treasure);
            this.treasures.sort(this.sortByDepthAndName);
        }

    }

    /**
     * Un élément (monstre, troll, trésor,...) que l'on retrouve dans une cellule.
     */
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
                    // this.family = "todo";
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
                    this.name = val.nom.options.sortValue.epure();
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

    /**
     * Renvoie le style approprié pour une cellule de la grille en fonction de ses coordonnées (en référentiel Mountyhall)
     * @param {int} centerX coordonnée X du centre de la grille
     * @param {int} centerY coordonnée Y du centre de la grille
     * @param {int} x coordonnée X de la cellule
     * @param {int} y coordonnée Y de la cellule
     * @returns {string} le style ad hoc
     */
    function cellStyle(centerX, centerY, x, y) {
        const distX = Math.abs(centerX - x);
        const distY = Math.abs(centerY - y);
        const dist = Math.max(distX, distY);
        return 0 === (dist % 2) ? `mz-map-grid-view-odd` : `mz-map-grid-view-even`;
    }

    const css = String.raw;
    const styles = css`
        .mz-map-grid-view-odd {
            background: antiquewhite;
            position: relative;
            display: inline-block;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .mz-map-grid-view-even {
            background: darkseagreen;
            position: relative;
            display: inline-block;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .mz-map-grid-view-cell {
            padding: 0 0.5rem 0 0.5rem;
            position: relative;
            overflow: hidden;
            //border: 2px solid #ddd;
            //border-radius: 3px;
            cursor: pointer;
            transition: border-color 0.2s;
        }

        .mz-map-grid-view-cell:hover {
            border-color: #4CAF50;
        }

        .mz-map-grid-view-cell.expanded {
        }

        .mz-map-grid-view-cell-content {
            height: 100%;
            box-sizing: border-box;
            //transition: height 1s ease, min-height 1s ease;
        }

        .mz-map-grid-view-cell.expanded {
            z-index: 10;
            overflow: visible;
        }

        .mz-map-grid-view-cell.expanded .mz-map-grid-view-cell-content {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background: inherit;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            border: 2px solid #4CAF50;
            width: 15rem;
            height: auto;
            min-height: 10rem;
            box-sizing: border-box;
        }

        .mz-map-grid-view-border {
            font-weight: bold;
            text-align: center;
            display: inline-block;
            position: absolute;
        }

        .mz-map-grid-view-border-left {
            transform: translateX(-50%) translateY(-50%) rotate(-90deg);
            top: 50%;
            left: 50%;
        }

        .mz-map-grid-view-border-right {
            transform: translateX(-50%) translateY(-50%) rotate(90deg);
            top: 50%;
            left: 50%;
        }

        .mz-map-grid-view-here {
            display: block;
            font-weight: bold;
            text-align: center;
        }

        .mz-map-grid-view-troll {
            display: block;
        }

        .mz-map-grid-view-monster {
            display: block;
        }

        .mz-map-grid-view-treasure {
            display: block;
        }

        .mz-map-grid-view-place {
            display: block;
        }

        .mz-map-grid-view-group {
            display: block;
            margin-top: 0.5px;
            margin-bottom: 0.5px
        }

        .mz-map-grid-view-odd .mz-map-grid-view-group {
            border-bottom: 1px solid darkseagreen;
        }

        .mz-map-grid-view-even .mz-map-grid-view-group {
            border-bottom: 1px solid antiquewhite;
        }

        .mz-map-grid-view-cell-header {
            display: block;
            font-weight: bold;
            text-align: center;
        }

        .mz-map-grid-view-wrapper {
            display: grid;
            column-gap: 2px;
            row-gap: 2px;
            font-size: small;
        }
    `;

    MZGrid.injectStyles = function () {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(styles));
        document.head.appendChild(style);
    }

    MZGrid.insertGrid = function () {
        MZGrid.injectStyles();
        let x = parseInt(MY_getValue(`${numTroll}.position.X`));
        let y = parseInt(MY_getValue(`${numTroll}.position.Y`));
        let n = parseInt(MY_getValue(`${numTroll}.position.N`));

        let rangeText = $("#infoTab div ul li")[2].textContent;
        let rangeX = 1;
        let rangeY = 1;
        let rangeMatch = rangeText.match(/([0-9]+) cases.*? et ([0-9]+)/);
        if (rangeMatch) {
            rangeX = parseInt(rangeMatch[1]);
            rangeY = parseInt(rangeMatch[2]);
        }

        MZGrid.grid = new Grid(x, y, n, rangeX, rangeY);
        MZGrid.grid.indexMap(json_monstres, json_trolls, json_tresors, json_lieux, json_champignons, json_cenotaphes);
        html = MZGrid.grid.convertToHtml("mz-map-grid-view");
        $('#infoTab').after(`<div id="mz-map-grid-scroll" style="max-width: 85vw; max-height: 80vh; overflow: auto;">${html}</div>`);

        $('#mz-map-grid-scroll').dragscrollable({dragSelector: 'div', acceptPropagatedEvent: false});
        MZGrid.grid.gotoPlayer();

        document.querySelectorAll('.mz-map-grid-view-cell').forEach(cell => {
            cell.addEventListener('click', function () {
                this.classList.add('expanded');
            });

            cell.addEventListener('mouseleave', function () {
                this.classList.remove('expanded');
            });
        });
    }

    MZGrid.whenViewReady = function () {
        /*
        * jQuery dragscrollable Plugin
        * version: 1.2 (09-Feb-2020)
        * Copyright (c) 2009 Miquel Herrera
        * Modified 2016 by Alexander Steinhöfer
        * Modified 2020 by Bilal Bagdad
        *
        * Dual licensed under the MIT and GPL licenses:
        *   http://www.opensource.org/licenses/mit-license.php
        *   http://www.gnu.org/licenses/gpl.html
        */
        (function ($) { // secure $ jQuery alias

            /**
             * Adds the ability to manage elements scroll by dragging
             * one or more of its descendant elements. Options parameter
             * allow to specifically select which inner elements will
             * respond to the drag events.
             *
             * options properties:
             * ------------------------------------------------------------------------
             *  dragSelector         | jquery selector to apply to each wrapped element
             *                       | to find which will be the dragging elements.
             *                       | Defaults to '>:first' which is the first child of
             *                       | scrollable element
             * ------------------------------------------------------------------------
             *  acceptPropagatedEvent| Will the dragging element accept propagated
             *                      | events? default is yes, a propagated mouse event
             *                      | on a inner element will be accepted and processed.
             *                      | If set to false, only events originated on the
             *                      | draggable elements will be processed.
             * ------------------------------------------------------------------------
             *  preventDefault       | Prevents the event to propagate further effectivey
             *                       | dissabling other default actions. Defaults to true
             * ------------------------------------------------------------------------
             *  which                | Sets the mouse button to scroll
             *                       | 1: left click
             *                       | 2: middle click
             *                       | 3: right click
             *                       | defaults to 1
             * ------------------------------------------------------------------------
             *
             *  usage examples:
             *
             *  To add the scroll by drag to the element id=viewport when dragging its
             *  first child accepting any propagated events
             * $('#viewport').dragscrollable();
             *
             *  To add the scroll by drag ability to any element div of class viewport
             *  when dragging its first descendant of class dragMe responding only to
             *  evcents originated on the '.dragMe' elements.
             * $('div.viewport').dragscrollable({dragSelector:'.dragMe:first',
             *                           acceptPropagatedEvent: false});
             *
             *  Notice that some 'viewports' could be nested within others but events
             *  would not interfere as acceptPropagatedEvent is set to false.
             *
             */
            $.fn.dragscrollable = function (options) {
                var settings = $.extend({
                    dragSelector: '>:first',
                    acceptPropagatedEvent: true,
                    preventDefault: true,
                    which: 1,
                    // Hovav:
                    allowY: true
                }, options || {});

                var dragscroll = {
                    startDrag: function (event, x, y) {
                        // Initial coordinates will be the last when dragging
                        event.data.lastCoord = {left: x, top: y};
                    },
                    doDrag: function (event, x, y) {
// How much did the mouse move?
                        var delta = {
                            left: (x - event.data.lastCoord.left),
                            top: ((settings.allowY) ? y - event.data.lastCoord.top : 0)
                        };

                        // Set the scroll position relative to what ever the scroll is now
                        event.data.scrollable.scrollLeft(event.data.scrollable.scrollLeft() - delta.left);
                        event.data.scrollable.scrollTop(event.data.scrollable.scrollTop() - delta.top);

                        // Save where the cursor is
                        event.data.lastCoord = {left: x, top: y};
                    },
                    /* ==========================================================
                       Touch */
                    touchStartHandler: function (event) {
                        var touch = event.originalEvent.touches[0];
                        dragscroll.startDrag(event, touch.pageX, touch.pageY);

                        $.event.add(document, "touchend", dragscroll.touchEndHandler, event.data);
                        $.event.add(document, "touchmove", dragscroll.touchMoveHandler, event.data);
                    },
                    touchMoveHandler: function (event) {
                        var touch = event.originalEvent.touches[0];
                        dragscroll.doDrag(event, touch.pageX, touch.pageY);
                    },
                    touchEndHandler: function (event) {
                        $.event.remove(document, "touchmove", dragscroll.mouseMoveHandler);
                        $.event.remove(document, "touchend", dragscroll.mouseUpHandler);
                    },
                    /* ==========================================================
                        Mouse */
                    mouseDownHandler: function (event) {
                        // mousedown, selected click, check propagation
                        if (event.which != event.data.which || (!event.data.acceptPropagatedEvent && event.target != this)) {
                            return false;
                        }

                        dragscroll.startDrag(event, event.clientX, event.clientY);

                        $.event.add(document, "mouseup", dragscroll.mouseUpHandler, event.data);
                        $.event.add(document, "mousemove", dragscroll.mouseMoveHandler, event.data);

                        if (event.data.preventDefault) {
                            event.preventDefault();
                            return false;
                        }
                    },
                    mouseMoveHandler: function (event) { // User is dragging
                        dragscroll.doDrag(event, event.clientX, event.clientY);

                        if (event.data.preventDefault) {
                            event.preventDefault();
                            return false;
                        }
                    },
                    mouseUpHandler: function (event) { // Stop scrolling
                        $.event.remove(document, "mousemove", dragscroll.mouseMoveHandler);
                        $.event.remove(document, "mouseup", dragscroll.mouseUpHandler);
                        if (event.data.preventDefault) {
                            event.preventDefault();
                            return false;
                        }
                    }
                }

                // set up the initial events
                this.each(function () {
                    // closure object data for each scrollable element
                    var data = {
                        scrollable: $(this),
                        acceptPropagatedEvent: settings.acceptPropagatedEvent,
                        preventDefault: settings.preventDefault,
                        which: settings.which
                    };
                    // Set mouse initiating event on the desired descendant
                    $(this).find(settings.dragSelector).bind('mousedown', data, dragscroll.mouseDownHandler);
                    $(this).find(settings.dragSelector).bind('touchstart', data, dragscroll.touchStartHandler);
                });
            }; //end plugin dragscrollable


        })(jQuery); // confine scope

        MZGrid.insertGrid();
    }

})(window.MZGrid); // scope confinement

if (window.location.pathname.indexOf(`/mountyhall/MH_Play/Play_vue`) === 0) {
    function waitForMZ(timeout = 3000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (typeof MZ_cVueJSON !== 'undefined' && MZ_cVueJSON !== null) {
                    clearInterval(interval);
                    resolve(MZ_cVueJSON);
                    return;
                }
                console.log("waiting for MZ");
                if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`Timeout waiting for MZ`));
                }
            }, 100); // Check every 100ms
        });
    }

    async function register2DView() {
        await waitForMZ(3000);
        if (document.body.dataset.MZ_Etat === undefined) {
            MZ_cVueJSON.registerCallback(MZGrid.whenViewReady);
        } else {
            MZGrid.whenViewReady();
        }
    }

    register2DView();


}

