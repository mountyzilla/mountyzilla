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
;(function($){ // secure $ jQuery alias

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
    $.fn.dragscrollable = function( options ){
        var settings = $.extend({
            dragSelector:'>:first',
            acceptPropagatedEvent: true,
            preventDefault: true,
            which: 1,
            // Hovav:
            allowY: true
        }, options || {});

        var dragscroll= {
            startDrag: function(event, x, y) {
                // Initial coordinates will be the last when dragging
                event.data.lastCoord = {left: x, top: y};
            },
            doDrag: function(event, x, y) {
// How much did the mouse move?
                var delta = {
                    left: (x - event.data.lastCoord.left),
                    top: ((settings.allowY) ? y - event.data.lastCoord.top : 0)
                };

                // Set the scroll position relative to what ever the scroll is now
                event.data.scrollable.scrollLeft(event.data.scrollable.scrollLeft() - delta.left);
                event.data.scrollable.scrollTop(event.data.scrollable.scrollTop() - delta.top);

                // Save where the cursor is
                event.data.lastCoord={ left: x, top: y };
            },
            /* ==========================================================
               Touch */
            touchStartHandler: function(event) {
                var touch = event.originalEvent.touches[0];
                dragscroll.startDrag(event, touch.pageX, touch.pageY);

                $.event.add( document, "touchend", dragscroll.touchEndHandler, event.data );
                $.event.add( document, "touchmove",  dragscroll.touchMoveHandler, event.data );
            },
            touchMoveHandler: function(event) {
                var touch = event.originalEvent.touches[0];
                dragscroll.doDrag(event, touch.pageX, touch.pageY);
            },
            touchEndHandler: function(event) {
                $.event.remove( document, "touchmove", dragscroll.mouseMoveHandler);
                $.event.remove( document, "touchend", dragscroll.mouseUpHandler);
            },
            /* ==========================================================
                Mouse */
            mouseDownHandler : function(event) {
                // mousedown, selected click, check propagation
                if (event.which != event.data.which || (!event.data.acceptPropagatedEvent && event.target != this)){
                    return false;
                }

                dragscroll.startDrag(event, event.clientX, event.clientY);

                $.event.add( document, "mouseup", dragscroll.mouseUpHandler, event.data );
                $.event.add( document, "mousemove",  dragscroll.mouseMoveHandler, event.data );

                if (event.data.preventDefault) {
                    event.preventDefault();
                    return false;
                }
            },
            mouseMoveHandler : function(event) { // User is dragging
                dragscroll.doDrag(event, event.clientX, event.clientY);

                if (event.data.preventDefault) {
                    event.preventDefault();
                    return false;
                }
            },
            mouseUpHandler : function(event) { // Stop scrolling
                $.event.remove( document, "mousemove", dragscroll.mouseMoveHandler);
                $.event.remove( document, "mouseup", dragscroll.mouseUpHandler);
                if (event.data.preventDefault) {
                    event.preventDefault();
                    return false;
                }
            }
        }

        // set up the initial events
        this.each(function() {
            // closure object data for each scrollable element
            var data = {
                scrollable : $(this),
                acceptPropagatedEvent : settings.acceptPropagatedEvent,
                preventDefault : settings.preventDefault,
                which: settings.which
            };
            // Set mouse initiating event on the desired descendant
            $(this).find(settings.dragSelector).bind('mousedown',  data, dragscroll.mouseDownHandler);
            $(this).find(settings.dragSelector).bind('touchstart', data, dragscroll.touchStartHandler);
        });
    }; //end plugin dragscrollable


})( jQuery ); // confine scope



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

    convertToHtml(id) {
        let html = `<div id="${id}" style="display: grid; column-gap: 2px; row-gap: 2px; grid-template-columns: repeat(${this.gridSize}, 15rem);"> `;
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
    return 0 === (dist % 2) ? `mz-grid-view-odd` : `mz-grid-view-even`;
}

class Cell {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    convertToHtml(i, j, centerX, centerY) {
        let html = `<div style="grid-row-start: ${i + 1}; grid-column-start: ${j + 1}" class="mz-grid-view-cell ${cellStyle(centerX, centerY, this.x, this.y)}">`;
        if (null != this.monsters) {
            for (const monster of this.monsters) {
                html += `<span class="mz-grid-view-monster">${monster.n} : ${monster.groupName}</span>`;
            }
        }
        if (null != this.trolls) {
            for (const troll of this.trolls) {
                html += `<span class="mz-grid-view-troll">${troll.n} : ${troll.name}</span>`;
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
.mz-grid-view-odd { background-color: teal; }
.mz-grid-view-even { background-color: lightgreen; }
.mz-grid-view-cell { padding: 0 0.5rem 0 0.5rem; }
.mz-grid-view-monster { display:block; }
.mz-grid-view-troll { display:block; }
`));
document.head.appendChild(style);

g = new Grid(-52, -44, -41, 14, 7);
g.indexMap(json_monstres, json_trolls, json_tresors, json_lieux, json_champignons, json_cenotaphes);
html = g.convertToHtml("gridView");
$('#infoTab').after(`<div id="gridScroll" style="max-width: 85vw; max-height: 80vh; overflow: auto;">${html}</div>`);

 $('#gridScroll').dragscrollable({dragSelector:'div', acceptPropagatedEvent: false});