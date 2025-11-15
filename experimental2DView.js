// ==UserScript==
// @author Kalamar
// @description Injection d'une vue 2D dans l'interface de jeu
// @include */mountyhall/mountyhall/MH_Play/Play_vue2.php*
// @exclude *mh2.mh.raistlin.fr*
// @exclude *mzdev.mh.raistlin.fr*
// @name Vue2D
// @version 0.2.1
// @namespace https://greasyfork.org/en/users/1536460
// @downloadURL https://update.greasyfork.org/scripts/555450/Vue2D.user.js
// @updateURL https://update.greasyfork.org/scripts/555450/Vue2D.user.js
// @license MIT
// ==/UserScript==


// Namespace MountyzillaGrid
window.MountyzillaGrid = window.MountyzillaGrid || {};

(function (MountyzillaGrid) {

    const TREASURE_ICONS = {
        "GG": "E_Gold02.png",
        "anneau": "Ac_Ring02.png",
        "apocryphe": "W_Book03.png",
        "arme (1 main)": "S_Sword07.png",
        "arme (2 mains)": "W_Axe006_R.png",
        "arme": "S_Sword07.png",
        "armure": "A_Armor05.png",
        "bidouille": "S_Magic02.png",
        "bottes": "A_Shoes02.png",
        "bouclier": "E_Metal02.png",
        "carte": "I_Map.png",
        "casque": "C_Elm03.png",
        "champignon": "I_C_Mushroom.png",
        "champignon inconnu": "I_C_Mushroom.png",
        "composant": "I_Tentacle.png",
        "conteneur": "Z_Backpack.png",
        "mimique": "I_Chest02.png",
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
        'boulet et chaine': "arme (1 main)",
        'batons de parade': "arme (2 mains)",
        'cagoule': "casque",
        'casque en cuir': "casque",
        'casque en metal': "casque",
        'casque a cornes': "casque",
        'casque a pointes': "casque",
        'chapeau pointu': "casque",
        'chaine cloutee': "arme (2 mains)",
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
        'poiscaille d\'avril': "special",
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

    class Util {
        static getFloatOrDefault(key, defaultValue) {
            let item = localStorage.getItem(key);
            if (null === item) {
                return defaultValue;
            }
            return parseFloat(item);
        }
    }

    class Grid {

        constructor(x, y, n, horizontalRange, verticalRange) {
            this.centerX = x;
            this.centerY = y;
            this.centerN = n;
            this.horizontalRange = horizontalRange;
            this.verticalRange = verticalRange;
            this.gridSize = 1 + 2 * this.horizontalRange + 2; // 2 lignes/colonnes en plus pour les cellules de coordonnées

            this.cells = new Array(this.gridSize);
        }

        convertToHtml() {
            const gridCellWidth = Util.getFloatOrDefault(KEY_MAP_GRID_CELL_SIZE, DEFAULT_CELL_SIZE);
            const gridCellHeight = gridCellWidth * CELL_WIDTH_HEIGHT_RATIO;
            const borderIndex = this.gridSize - 1;
            const templateColumns = this.gridTemplate(gridCellWidth);
            const templateRows = this.gridTemplate(gridCellHeight);
            let html = `<div id="mz-map-grid" class="mz-map-grid-wrapper" style="grid-template-columns: ${templateColumns}; grid-template-rows: ${templateRows};"> `;
            for (let i = 0; i < this.gridSize; i++) {
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

        gridTemplate(size) {
            return `2rem repeat(${this.gridSize - 2}, ${size}rem) 2rem`;
        }

        emptyCell(i, j) {
            const center = 1 + this.horizontalRange;
            return `<div style="grid-row-start: ${j + 1}; grid-column-start: ${i + 1}" class="${cellStyle(center, center, i + 1, j + 1)}">&nbsp;</div>`;
        }

        borderCell(i, j) {
            const center = 1 + this.horizontalRange;
            const borderIndex = this.gridSize - 1;
            const index = (0 === i) || borderIndex === i ? this.indexToY(j) : this.indexToX(i);
            let borderClass = 0 === i ? "mz-map-grid-border-left" : "";
            borderClass = borderIndex === i ? "mz-map-grid-border-right" : borderClass;
            return `<div style="grid-row-start: ${j + 1}; grid-column-start: ${i + 1}" class="${cellStyle(center, center, i + 1, j + 1)}"><span class="mz-map-grid-border ${borderClass}">${index}</span></div>`;
        }

        xToIndex(x) {
            return -this.centerX + this.horizontalRange + x + 1;
        }

        indexToX(i) {
            return this.centerX - this.horizontalRange + i - 1;
        }

        yToIndex(y) {
            return this.centerY + this.horizontalRange - y + 1;
        }

        indexToY(i) {
            return this.centerY + this.horizontalRange - i + 1 ;
        }

        /**
         * Récupère une cellule sur base de ses coordonnées Mountyhall
         * @param x coordonnée Mountyhall X
         * @param y  coordonnée Mountyhall X
         * @returns {Cell}
         */
        getCellMounty(x, y) {
            let i = this.xToIndex(x);
            let j = this.yToIndex(y);
            return this.getCell(i, j, x, y);
        }

        /**
         * Récupère une cellule sur base de ses index internes
         * @returns {Cell}
         */
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

        /**
         * Indexe l'ensemble des données "json" fournies par Mountyhall afin de le stocker dans un structure bidimensionnelle
         * qui correspond à la grille de la vue 2D
         */
        indexMap(monsters, trolls, treasures, places, mushrooms, graves) {
            let here = this.getCellMounty(this.centerX, this.centerY);
            here.youAreHere = this.centerN;

            this.indexCategory(monsters, (cell, o) => cell.addMonster(o));
            this.indexCategory(trolls, (cell, o) => cell.addTroll(o));
            this.indexCategory(treasures, (cell, o) => cell.addTreasure(o));
            this.indexCategory(places, (cell, o) => cell.addPlace(o));
            this.indexCategory(mushrooms, (cell, o) => cell.addMushroom(o));
            this.indexCategory(graves, (cell, o) => cell.addGrave(o));

            for (let i = 0; i < this.cells.length; i++) {
                if (null == this.cells[i]) {
                    continue;
                }
                for (let j = 0; j < this.cells[i].length; j++) {
                    let cell = this.cells[i][j];
                    if (null != cell) {
                        cell.sortContents();
                    }
                }
            }
        }

        /**
         * Indexe une catégorie particulière
         * @param mhElements éléments Mountyhall d'un type donné
         * @param addFunction fonction spécifique à appeler pour indexer les infos d'un élément donné
         */
        indexCategory(mhElements, addFunction) {
            if (null == mhElements) {
                return;
            }
            for (const element of mhElements) {
                let o = new HallEntity(element);
                let cell = this.getCellMounty(o.x, o.y)
                if (null != cell) {
                    addFunction(cell, o);
                }
            }
        }

        /**
         * Insère la vue 2D dans le Dom et ajoute les eventListeners nécessaire pour agrandir une cellule ou en
         * avoir les détails
         */
        insertIntoDom() {
            let html = this.convertToHtml();
            let toolbar = this.createToolbar();
            let details = '<div id="mz-map-details-wrapper" class="mh_tdtitre"><span class="mz-map-details-header"><h2 class="titre2">D&eacute;tails</h2></span><div id="mz-map-details-content">Pour une vue plus d&eacute;taill&eacute;e du contenu d\'une caverne, cliquez sur l\'indicateur de profondeur</div></div>';
            $('#infoTab').after(`<div id='mz-map-wrapper'>${toolbar}<div id="mz-map-grid-scroll">${html}</div>${details}</div>`);

            $('#mz-map-grid-scroll').dragscrollable({dragSelector: 'div', acceptPropagatedEvent: false});
            this.gotoPlayer();

            this.addEventHandlers();
        }

        createToolbar() {
            const storedTextSize = Util.getFloatOrDefault(KEY_MAP_GRID_TEXT_SIZE, DEFAULT_CELL_TEXT_SIZE);
            const initialTextValue = (storedTextSize - MIN_TEXT_SIZE) / RATIO_VALUE_TO_TEXT_SIZE ;
            const storedCellSize = Util.getFloatOrDefault(KEY_MAP_GRID_CELL_SIZE, DEFAULT_CELL_SIZE);
            const initialCellValue = (storedCellSize - MIN_CELL_SIZE) / RATIO_VALUE_TO_CELL_SIZE ;

            return `<div id='mz-map-grid-toolbar'>
        <img id='mz-map-goto-player' src='../Images/Icones/W_Throw004.png' height='15' alt='Recentrer' title='Recentrer la vue'></img>
         Taille texte: <input id="mz-map-toolbar-resize-text" type="range" min="0" max="100" value="${initialTextValue}" class="mz-map-toolbar-slider" >
         Taille cellule: <input id="mz-map-toolbar-resize-cell" type="range" min="0" max="100" value="${initialCellValue}" class="mz-map-toolbar-slider" >
</div>`;
        }

        addEventHandlers() {
            document.querySelectorAll('.mz-map-grid-cell').forEach(cell => {
                cell.addEventListener('mouseenter', function () {
                    this.classList.add('expanded');
                });

                cell.addEventListener('mouseleave', function () {
                    this.classList.remove('expanded');
                });
            });
            document.getElementById("mz-map-goto-player").addEventListener('click', this.gotoPlayer);
            document.getElementById('mz-map-grid').addEventListener('click', this.updateDetailsForDepth);
            document.getElementById("mz-map-toolbar-resize-text").oninput = e => this.resizeCellText(e);
            document.getElementById("mz-map-toolbar-resize-cell").oninput = e => this.resizeCellSize(e);

            // Make all cells display a hint if there is more content than what is visible (not that this is not
            // recomputed if cells are resized)
            const allCells = document.getElementsByClassName('mz-map-grid-cell');
            for (const cell of allCells) {
                if (cell.scrollHeight > cell.clientHeight) {
                    cell.querySelector('.mz-map-grid-cell-hint').style.display = 'block';
                }
            }
        }

        /**
         * Change the styles linked to cell contents to scale text and icons
         */
        resizeCellText(e) {
            const value = e.target.value;
            const rootSheet = document.getElementById("mz-map-styles");
            const textSize = MIN_TEXT_SIZE + RATIO_VALUE_TO_TEXT_SIZE * value;
            localStorage.setItem(KEY_MAP_GRID_TEXT_SIZE, textSize);
            const imageSize = MIN_ICON_SIZE + RATIO_VALUE_TO_ICON_SIZE * value;
            localStorage.setItem(KEY_MAP_GRID_ICON_SIZE, imageSize);

            const style = this.findStyle(rootSheet.sheet, '.mz-map-grid-cell-content');
            style.style.setProperty("line-height", `${textSize}rem`);
            style.style.setProperty("font-size", `${textSize}rem`);

            const imgStyle = this.findStyle(style, "& img");
            imgStyle.style.setProperty("height", `${imageSize}px`);
        }

        resizeCellSize(e) {
            const value = e.target.value;
            const gridCellWidth = MIN_CELL_SIZE + RATIO_VALUE_TO_CELL_SIZE * value;
            localStorage.setItem(KEY_MAP_GRID_CELL_SIZE, gridCellWidth);
            const gridCellHeight = gridCellWidth * CELL_WIDTH_HEIGHT_RATIO;
            const templateColumns = this.gridTemplate(gridCellWidth);
            const templateRows = this.gridTemplate(gridCellHeight);
            document.getElementById("mz-map-grid").style = `grid-template-columns: ${templateColumns}; grid-template-rows: ${templateRows};`;
        }

        findStyle(styleSheet, styleName) {
            for (const cssRule of styleSheet.cssRules) {
                if (cssRule.selectorText === styleName) {
                    return cssRule;
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

            gridHolder.scrollTo({left: scrollLeft, top: scrollTop, behavior: 'smooth'});
        };

        /**
         * Met à jour la boîte avec les détails de la grotte aux coordonnées stockées dans le DOM element.
         * @param e event
         */
        updateDetailsForDepth(e) {
            let target = e.target.closest('[data-mz-grid-n]');

            if (null == target) {
                return;
            }
            const x = parseInt(target.dataset.mzGridX);
            const y = parseInt(target.dataset.mzGridY);
            const n = parseInt(target.dataset.mzGridN);
            const cell = MountyzillaGrid.grid.getCellMounty(x, y);
            let detailsHtml = cell.detailsHtml(n);
            document.getElementById('mz-map-details-content').innerHTML = detailsHtml;
        }

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
            let html = `<div ${id} data-mz-grid-x=${this.x} data-mz-grid-y=${this.y} 
style="grid-row-start: ${j + 1}; grid-column-start: ${i + 1}" 
class="mz-map-grid-cell ${cellStyle(centerX, centerY, this.x, this.y)}">
<div class="mz-map-grid-cell-hint">&#8661;</div>
<div class="mz-map-grid-cell-content">`;
            if (null != this.monsters
                || null != this.trolls
                || null != this.treasures
                || null != this.places
                || null != this.mushrooms
                || null != this.graves) {
                html += `<span class="mz-map-grid-cell-header">${this.x} ${this.y}</span>`;
            }
            if (null != this.youAreHere) {
                html += `<span class="mz-map-grid-here">Vous &ecirc;tes ici (${this.youAreHere})</span>`;
            }
            for (let depth = MountyzillaGrid.grid.centerN + MountyzillaGrid.grid.verticalRange; depth >= MountyzillaGrid.grid.centerN - MountyzillaGrid.grid.verticalRange; depth--) {
                let depthHtml = this.groupToHtml(depth, this.trolls, this.trollToHtmlBits)
                    + this.groupToHtml(depth, this.monsters, this.monsterToHtmlBits)
                    + this.groupToHtml(depth, this.places, this.placeToHtmlBits)
                    + this.treasuresToHtml(depth);
                if (depthHtml.length > 0) {
                    html += `<span class="mz-map-grid-cell-depth" data-mz-grid-x=${this.x} data-mz-grid-y=${this.y} data-mz-grid-n=${depth}><span class="mz-map-grid-cell-header">${depth}</span>${depthHtml}</span>`;
                }
            }
            html += "</div></div>";
            return html;
        }

        trollToHtmlBits(troll) {
            return ['class="mz-map-grid-troll" mz_grid_type="trolls"', `${troll.name} ${troll.race.substring(0, 2)}${troll.level}`];
        }

        monsterToHtmlBits(monster) {
            return ['class="mz-map-grid-monster" mz_grid_type="monstres"', monster.groupName];
        }

        placeToHtmlBits(place) {
            return ['class="mz-map-grid-place" mz_grid_type="lieux"', place.name];
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
                type = null == type ? treasureName : type;
                summary.set(type, (summary.get(type) ?? 0) + 1);
            }
            if (summary.size === 0) {
                return '';
            }
            let result = '<span class="mz-map-grid-treasure" mz_grid_type="treasure">';
            let keys = Array.from(summary.keys()).sort();
            let icons = keys.map(key => {
                let treasureicon = TREASURE_ICONS[key];
                if (null == treasureicon) { console.log(`vue2d: Type de tresor sans icone: ${key}`); }
                return `<img src='../Images/Icones/${treasureicon}' title='${key}' height='15'/>:${summary.get(key)}`;
            });
            result += `${icons.join(" ")}</span>`;
            return result;
        }

        groupToHtml(depth, group, itemToBits) {
            if (null == group) {
                return '';
            }
            let summary = new Map();

            for (const item of group) {
                if (item.n !== depth) {
                    continue;
                }
                let name = item.groupName ?? item.name;
                summary.set(name, summary.get(name) ?? [itemToBits(item), 0]);
                summary.get(name)[1]++;
            }
            if (summary.size === 0) {
                return '';
            }
            let keys = Array.from(summary.keys()).sort();
            let values = keys.map(key => {
                let nameAndCount = summary.get(key);
                let attributesAndText = nameAndCount[0];
                return nameAndCount[1] === 1 ? `<span ${attributesAndText[0]}>${attributesAndText[1]}</span>` : `<span ${attributesAndText[0]}>${nameAndCount[1]} x ${attributesAndText[1]}</span>`;
            });
            return values.join(" ");
        }

        detailsHtml(depth) {
            return `<h3 class="titre3" style="text-align:center">${this.x} ${this.y} ${depth}</h3>`
                + this.groupToDetailsHtml(depth, this.trolls, "mz-map-details-troll")
                + this.groupToDetailsHtml(depth, this.monsters, "mz-map-details-monster")
                + this.groupToDetailsHtml(depth, this.treasures, "mz-map-details-treasure")
                + this.groupToDetailsHtml(depth, this.places, "mz-map-details-place")
                + this.groupToDetailsHtml(depth, this.graves, "mz-map-details-grave")
                + this.groupToDetailsHtml(depth, this.mushrooms, "mz-map-details-mushroom");
        }

        groupToDetailsHtml(depth, group, groupClass) {
            if (null == group) {
                return '';
            }
            let result = '';
            for (const item of group) {
                if (item.n !== depth) {
                    continue;
                }
                result += `<span class="${groupClass}">${item.id} ${item.html}</span>`;
            }
            return result;
        }

        sortByDepthAndName(a, b) {
            if (a.n !== b.n) {
                return a.n - b.n;
            }
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        };

        sortContents() {
            this.monsters?.sort(this.sortByDepthAndName);
            this.trolls?.sort(this.sortByDepthAndName);
            this.mushrooms?.sort(this.sortByDepthAndName);
            this.graves?.sort(this.sortByDepthAndName);
            this.places?.sort(this.sortByDepthAndName);
            this.treasures?.sort(this.sortByDepthAndName);

        }

        addMonster(monster) {
            this.monsters = this.monsters ?? [];
            this.monsters.push(monster);
        }

        addTroll(troll) {
            this.trolls = this.trolls ?? [];
            this.trolls.push(troll);
        }

        addMushroom(mushroom) {
            this.mushrooms = this.mushrooms ?? [];
            this.mushrooms.push(mushroom);
        }

        addGrave(grave) {
            this.graves = this.graves ?? [];
            this.graves.push(grave);
        }

        addPlace(place) {
            this.places = this.places ?? [];
            this.places.push(place);
        }

        addTreasure(treasure) {
            this.treasures = this.treasures ?? [];
            this.treasures.push(treasure);
        }

    }

    /**
     * Un élément (monstre, troll, trésor,...) que l'on retrouve dans une cellule.
     */
    class HallEntity {

        constructor(mhValue) {
            let val = mhValue.value;
            this.type = val.type;
            this.id = val.id;
            this.x = val.x;
            this.y = val.y;
            this.n = val.n;
            this.distance = val.dist;
            this.html = val.nom.value;

            switch (this.type) {
                case "monstres" :
                    this.name = this.extractName(val);
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
                    this.name = this.extractName(val);
                    break;
                case "tresors" :
                    this.name = this.extractName(val).epure();
                    if (this.name.startsWith("mimique")) {
                        this.name = this.toGroupName(this.name);
                    }
                    break;
                case "trolls" :
                    this.name = this.extractName(val);
                    this.race = val.race;
                    this.level = val.niv;
                    break;
            }
        }

        extractName(val) {
            let options = val.nom.options;
            if (options == null) { // == is intended to force type coercion
                return val.nom.value || val.nom;
            }
            return options.sortValue;
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
        return 0 === (dist % 2) ? `mz-map-grid-odd` : `mz-map-grid-even`;
    }

    const KEY_MAP_GRID_TEXT_SIZE = "MZ_vue2d_mz-map-grid-cell-text-size";
    const MIN_TEXT_SIZE = 0.5;
    const RATIO_VALUE_TO_TEXT_SIZE = 0.015 ;
    const DEFAULT_CELL_ICON_SIZE = 15;

    const KEY_MAP_GRID_ICON_SIZE = "MZ_vue2d_mz-map-grid-cell-icon-size";
    const MIN_ICON_SIZE = 3;
    const RATIO_VALUE_TO_ICON_SIZE = 0.24;
    const DEFAULT_CELL_TEXT_SIZE = 1.2;

    const KEY_MAP_GRID_CELL_SIZE = "MZ_vue2d_mz-map-grid-cell-size";
    const MIN_CELL_SIZE = 3;
    const RATIO_VALUE_TO_CELL_SIZE = 0.24;
    const DEFAULT_CELL_SIZE = 15;
    const CELL_WIDTH_HEIGHT_RATIO = 2/3;


    MountyzillaGrid.injectStyles = function () {
        const defaultCellFontSize = Util.getFloatOrDefault(KEY_MAP_GRID_TEXT_SIZE, DEFAULT_CELL_TEXT_SIZE);
        const defaultImageFontSize = Util.getFloatOrDefault(KEY_MAP_GRID_ICON_SIZE, DEFAULT_CELL_ICON_SIZE);
        const css = String.raw;
        const styles = css`

            :root {
                --color-troll: darkblue;
                --color-monster: darkgreen;
                --color-border: #4CAF50;
            }

            #mz-map-wrapper {
                margin-top: 1rem;
                position: relative;
                display: flex;
                column-gap: 0.5rem;
            }

            .mz-map-grid-wrapper {
                display: grid;
                column-gap: 2px;
                row-gap: 2px;
                font-size: small;
            }

            #mz-map-grid-scroll {
                max-width: 85%;
                max-height: 70vh;
                overflow: auto;
                border: 2px solid var(--color-border);
                border-radius: 8px;
            }

            #mz-map-details-wrapper {
                border: 2px solid var(--color-border);
                border-radius: 8px;
                flex-grow: 4;
            }

            #mz-map-grid-toolbar {
                position: absolute;
                top: 2rem;
                left: 2rem;
                background: white;
                border: 1px solid #999;
                padding: 0.5rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                z-index: 50;
            }

            input[type="range"].mz-map-toolbar-slider {
                display: inline-block;
                width: 10rem;
                vertical-align: middle;
                height: 0.7rem;
                appearance: none;
                background: transparent;
                cursor: pointer;

                &::-webkit-slider-runnable-track {
                    background: darkgrey;
                    height: 0.5rem;
                    border-radius: 3px;
                }

                &::-moz-range-track {
                    background: darkgrey;
                    height: 0.5rem;
                    border-radius: 3px;
                }

                &::-webkit-slider-thumb {
                    appearance: none;
                    background: white;
                    border: 2px solid darkgrey;
                    width: 0.8rem;
                    height: 1.4rem;
                    border-radius: 50%;
                    margin-top: -0.45rem;
                }

                &::-moz-range-thumb {
                    appearance: none;
                    background: white;
                    border: 2px solid darkgrey;
                    width: 0.8rem;
                    height: 1.4rem;
                    border-radius: 50%;
                }

            }

            .mz-map-grid-odd {
                background: antiquewhite;
                position: relative;
                display: grid;
                place-items: center;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
            }

            .mz-map-grid-even {
                background: darkseagreen;
                position: relative;
                display: grid;
                place-items: center;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
            }

            .mz-map-grid-cell {
                padding: 0 0.5rem 0 0.5rem;
                position: relative;
                overflow: hidden;
                //border: 2px solid #ddd;
                //border-radius: 3px;
                cursor: pointer;
                transition: border-color 0.2s;

                &:hover {
                    border-color: var(--color-border);
                }

            }

            .mz-map-grid-cell-hint {
                display: none;
                position: absolute;
                bottom: 0.5rem;
                right: 0.5rem;
                font-weight: bold;
                color: red;
            }

            .mz-map-grid-cell-content {
                height: 100%;
                box-sizing: border-box;
                white-space: nowrap;
                font-size: ${defaultCellFontSize}rem;
                line-height: ${defaultCellFontSize}rem;

                img {
                    height: ${defaultImageFontSize}px;
                }
            }

            .mz-map-grid-cell.expanded {
                z-index: 10;
                overflow: visible;

                .mz-map-grid-cell-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                    transform: translateY(-50%) translateX(-50%);
                    background: inherit;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    border-radius: 5px;
                    outline: 2px solid var(--color-border);
                    width: auto;
                    height: auto;
                    min-height: 10rem;
                    min-width: 15rem;
                    box-sizing: border-box;
                }
            }

            .mz-map-grid-border {
                display: block;
                font-weight: bold;
                text-align: center;
            }

            .mz-map-grid-border-left {
                transform: rotate(-90deg);
            }

            .mz-map-grid-border-right {
                transform: rotate(90deg);
            }

            .mz-map-grid-here {
                display: block;
                font-weight: bold;
                text-align: center;
            }

            .mz-map-grid-troll {
                display: block;
                color: var(--color-troll);
            }

            .mz-map-grid-monster {
                display: block;
                color: var(--color-monster);
            }

            .mz-map-grid-treasure {
                display: block;
            }

            .mz-map-grid-place {
                display: block;
            }

            .mz-map-grid-group {
                display: block;
                margin-top: 0.5px;
                margin-bottom: 0.5px
            }

            .mz-map-grid-odd .mz-map-grid-group {
                border-bottom: 1px solid darkseagreen;
            }

            .mz-map-grid-even .mz-map-grid-group {
                border-bottom: 1px solid antiquewhite;
            }

            .mz-map-grid-cell-header {
                display: block;
                font-weight: bold;
                text-align: center;
                padding-top: 2px;
            }

            .mz-map-grid-cell-depth {
                border-top: 1px dotted darkgreen;
                display: block;
                margin-top: 4px;
                padding-top: 2px;
            }

            .mz-map-details-header {
                display: block;
                font-weight: bold;
                text-align: center;
            }

            .mz-map-details-troll {
                display: block;
                color: var(--color-troll);
            }

            .mz-map-details-monster {
                display: block;
                color: var(--color-monster);
            }

            .mz-map-details-treasure {
                display: block;
            }

            .mz-map-details-place {
                display: block;
            }

        `;


        const style = document.createElement('style');
        style.id = 'mz-map-styles';
        style.appendChild(document.createTextNode(styles));
        document.head.appendChild(style);
    }

    MountyzillaGrid.insertGrid = function () {
        MountyzillaGrid.injectStyles();
        let x = 0;
        let y = 0;
        let n = 0;

        let positionText = document.getElementsByClassName('position')[0].textContent;
        let positionMatch = positionText.match(/(-?\d+).*?= (-?\d+).*?= (-?\d+)/, positionText);
        if (positionMatch) {
            x = parseInt(positionMatch[1]);
            y = parseInt(positionMatch[2]);
            n = parseInt(positionMatch[3]);
        }
        let infoTabValues = $("#infoTab div ul li");
        let rangeText = infoTabValues[2].textContent;
        let rangeX = 1;
        let rangeY = 1;
        let rangeMatch = rangeText.match(/(\d+) cases.*? et (\d+)/);
        if (rangeMatch) {
            rangeX = parseInt(rangeMatch[1]);
            rangeY = parseInt(rangeMatch[2]);
        }

        MountyzillaGrid.grid = new Grid(x, y, n, rangeX, rangeY);
        MountyzillaGrid.grid.indexMap(json_monstres, json_trolls, json_tresors, json_lieux, json_champignons, json_cenotaphes);
        MountyzillaGrid.grid.insertIntoDom();
    }

    MountyzillaGrid.whenViewReady = function () {
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

        MountyzillaGrid.insertGrid();
    }

})(window.MountyzillaGrid); // scope confinement

if (window.location.pathname.indexOf(`/mountyhall/MH_Play/Play_vue`) === 0) {
    MZ_cVueJSON.registerCallback(MountyzillaGrid.whenViewReady);
}
