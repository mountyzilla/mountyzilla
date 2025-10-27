// Namespace MZGrid
window.MZGrid = window.MZGrid || {};

(function (MZGrid) {

    // TODO: use this only and not mh_caracs
    const TREASURE_ICONS = {
        "anneau" : "I_Scroll02.png",
        "armure" : "A_Armor05.png",
        "arme" : "S_Sword07.png",
        "arme (1 main)" : "S_Sword07.png",
        "arme (2 mains)" : "W_Axe006_R.png",
        "bottes" : "A_Shoes02.png ",
        "bouclier" : "E_Metal02.png",
        "casque" : "C_Elm03.png",
        "talisman" : "Ac_Necklace03.png",
        "parchemin" : "I_Scroll02.png",
        "carte" : "I_Map.png",
        "outil" : "Z_BoneWrench.png",
        "composant" : "I_Tentacle.png",
        "potion" : "P_Medicine05.png",
        "GG" : "E_Gold02.png",
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
            let html = `<div id="${id}" style="display: grid; column-gap: 2px; row-gap: 2px; grid-template-columns: repeat(${this.gridSize}, 15rem);"> `;
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
            let html = `<div ${id} mz-grid-x={this.x} mz-grid-y=${this.y} style="grid-row-start: ${j + 1}; grid-column-start: ${i + 1}" class="mz-map-grid-view-cell ${cellStyle(centerX, centerY, this.x, this.y)}">`;
            if (null != this.monsters
                || null != this.trolls
                || null != this.treasures
                || null != this.places
                || null != this.mushrooms
                || null != this.graves) {
                html += `<span class="mz-map-cell-header">${this.x} ${this.y}</span>`;
            }
            if (null != this.youAreHere) {
                html += `<span class="mz-map-grid-view-here">${this.youAreHere} : Vous &ecirc;tes ici</span>`;
            }
            html += this.groupToHtml(this.trolls, this.trollToHtml);
            html += this.groupToHtml(this.monsters, this.monsterToHtml);
            html += this.treasuresToHtml();
            html += "</div>";
            return html;
        }

        trollToHtml(troll) {
            return `<span class="mz-map-grid-view-troll" mz_id=${troll.id} mz_grid_type="trolls">${troll.n} : ${troll.name}</span>`;
        }

        monsterToHtml(monster) {
            return `<span class="mz-map-grid-view-monster" mz_id=${monster.id} mz_grid_type="monstres">${monster.n} : ${monster.groupName}</span>`;
        }


        treasuresToHtml() {
            if (null == this.treasures) {
                return '';
            }
            let summaries = [[this.treasures[0].n, {}]];
            for (const treasure of this.treasures) {
                let line = summaries.at(-1);
                if (line[0] != treasure.n) {
                    let line = [treasure.n, {}];
                    summaries.push(line);
                }
                let summary = line[1];
                let treasureName = treasure.name.toLowerCase();
                if (treasureName.indexOf("centaines de") >= 0 || treasureName.indexOf("gigots de") >= 0) {
                    summary.GG = (summary.GG ?? 0) + 1;
                    continue;
                }
                let type = mh_caracs[treasureName];
                if (null == type) {
                    type = treasureName;
                } else {
                    type = type[0];
                }
                summary[type] = (summary[type] ?? 0) + 1;
            }
            let result = "";
            for (const s of summaries) {
                let summary = s[1];
                result += `<span className="mz-map-grid-view-treasure" mz_grid_type="treasure">${s[0]} : `;
                let keys = Object.keys(summary).sort();
                let icons = keys.map(key => {
                    return `<img src='../Images/Icones/${TREASURE_ICONS[key]}' alt='${key}' height='15'/>:${summary[key]}`;
                });
                result += `${icons.join(" ")}</span>`;
            }
            return result;
        }


        groupToHtml(group, itemToSpan) {
            if (null == group) {
                return '';
            }
            var previousLevel = -1000;
            var blockStarted = false;

            var html = '';
            for (const item of group) {
                if (item.n !== previousLevel) {
                    previousLevel = item.n;
                    if (blockStarted) {
                        html += '</span>';
                    }
                    blockStarted = true;
                    html += '<span class="mz-map-grid-view-group">';
                }
                html += itemToSpan(item);
            }
            html += '</span>';
            return html;
        }

        sortByDepth(a, b) {return a.n - b.n};

        addMonster(monster) {
            this.monsters = this.monsters ?? [];
            this.monsters.push(monster);
            this.monsters.sort(this.sortByDepth);
        }

        addTroll(troll) {
            this.trolls = this.trolls ?? [];
            this.trolls.push(troll);
            this.trolls.sort(this.sortByDepth);
        }

        addMushroom(mushroom) {
            this.mushrooms = this.mushrooms ?? [];
            this.mushrooms.push(mushroom);
            this.mushrooms.sort(this.sortByDepth);
        }

        addGrave(grave) {
            this.graves = this.graves ?? [];
            this.graves.push(grave);
            this.graves.sort(this.sortByDepth);
        }

        addPlace(place) {
            this.places = this.places ?? [];
            this.places.push(place);
            this.places.sort(this.sortByDepth);
        }

        addTreasure(treasure) {
            this.treasures = this.treasures ?? [];
            this.treasures.push(treasure);
            this.treasures.sort(this.sortByDepth);
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


    MZGrid.injectStyles = function () {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(`
.mz-map-grid-view-odd { background-color: antiquewhite; position: relative; display: inline-block; padding-top: 0.5rem; padding-bottom: 0.5rem;}
.mz-map-grid-view-even { background-color: darkseagreen; position: relative; display: inline-block; padding-top: 0.5rem; padding-bottom: 0.5rem;}
.mz-map-grid-view-cell { padding: 0 0.5rem 0 0.5rem; }
.mz-map-grid-view-border { display: block; font-weight: bold; text-align: center;}
.mz-map-grid-view-border-left { translateY(-50%) rotate(-90deg); top: 50%; left: 50%;}
.mz-map-grid-view-border-right { display: inline-block; position: absolute; transform: translateX(-50%) translateY(-50%) rotate(90deg); top: 50%; left: 50%;}
.mz-map-grid-view-here { display: block; font-weight: bold;}
.mz-map-grid-view-troll { display: block; }
.mz-map-grid-view-monster { display: block; }
.mz-map-grid-view-treasure { display: block; }
.mz-map-grid-view-group { display: block; margin-top: 0.5px; margin-bottom: 0.5px}
.mz-map-grid-view-odd .mz-map-grid-view-group { border-bottom:1px solid darkseagreen; }
.mz-map-grid-view-even .mz-map-grid-view-group { border-bottom:1px solid antiquewhite; }
.mz-map-cell-header { display: block; font-weight: bold; text-align: center;}
`));
        document.head.appendChild(style);
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

        MZGrid.injectStyles();
        let x = parseInt(MY_getValue(`${numTroll}.position.X`));
        let y = parseInt(MY_getValue(`${numTroll}.position.Y`));
        let n = parseInt(MY_getValue(`${numTroll}.position.N`));
        let g = new Grid(x, y, n, 14, 7);
        g.indexMap(json_monstres, json_trolls, json_tresors, json_lieux, json_champignons, json_cenotaphes);
        html = g.convertToHtml("mz-map-grid-view");
        $('#infoTab').after(`<div id="mz-map-grid-scroll" style="max-width: 85vw; max-height: 80vh; overflow: auto;">${html}</div>`);

        $('#mz-map-grid-scroll').dragscrollable({dragSelector: 'div', acceptPropagatedEvent: false});
        g.gotoPlayer();
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

