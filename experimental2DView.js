// ==UserScript==
// @author Kalamar
// @description Injection d'une vue 2D dans l'interface de jeu
// @include */mountyhall/mountyhall/MH_Play/Play_vue2.php*
// @exclude *mh2.mh.raistlin.fr*
// @exclude *mzdev.mh.raistlin.fr*
// @name Vue2D
// @version 0.2.2
// @namespace https://greasyfork.org/en/users/1536460
// @downloadURL https://update.greasyfork.org/scripts/555450/Vue2D.user.js
// @updateURL https://update.greasyfork.org/scripts/555450/Vue2D.user.js
// @license MIT
// ==/UserScript==


// Namespace vue2d
window.vue2d = window.vue2d || {};

(function (vue2d) {

    const EXTENSION_ID = 'vue2d';

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
        'recompense': "special",
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
    const MYTHIQUES = ['balrog', 'liche', 'hydre', 'beholder'];

    class Util {
        static getFloatOrDefault(key, defaultValue) {
            let item = localStorage.getItem(key);
            if (null === item) {
                return defaultValue;
            }
            return parseFloat(item);
        }

        static saveIntoMountyhall(value) {
            const url = `${window.location.origin}/mountyhall/MH_PageUtils/Services/json_extension.php?mode=set&ext=${EXTENSION_ID}`;
            let request = new XMLHttpRequest();
            request.open('POST', url);
            request.onreadystatechange = function () {
                if (request.error) {
                    logMZ('erreur sauvegarde config dans MH : ' + request.error);
                }
            };
            let json = JSON.stringify(value);
            json = json.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7F]/g, '');
            request.send(json);
        }

        static showFadingMessage(text, x, y, durationMs = 3000) {
            const div = document.createElement('div');
            div.className = 'mh_tdtitre mz-map-effects-fade';
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
            div.textContent = text;
            document.body.appendChild(div);

            setTimeout(() => {
                div.classList.add('visible');
            }, 10);

            setTimeout(() => {
                div.classList.remove('visible');
                div.classList.add('fade-out');
                setTimeout(() => {
                    div.remove();
                }, 500);
            }, durationMs);
        }

    }

    class Options {
        static MAX_TARGET_COUNT = 5;

        constructor(options = null) {
            if (null == options) {
                this.options = {};
            } else {
                this.options = JSON.parse(options);
            }
        }

        save() {
            Util.saveIntoMountyhall(this.options);
        }

        isTarget(id) {
            const targets = this.options['targets'];
            return null != targets ? null != targets[id] : false;
        }

        addTarget(id, name, cellId) {
            let workTargets = this.getWorkTargets();
            let targets = this.options['targets'];
            if (null != targets[id] || Options.MAX_TARGET_COUNT <= workTargets.length) {
                return;
            }
            targets[id] = name;
            this.options['targets'] = targets;
            this.save();
            workTargets.push([id, name, cellId]);
        }

        removeTarget(id) {
            let workTargets = this.getWorkTargets();
            for (let i = 0; i < workTargets.length; i++) {
                const target = workTargets[i];
                if (target[0] === id) {
                    workTargets.splice(i, 1);
                    delete this.options['targets'][id];
                    this.save();
                    return;
                }
            }
        }

        targetCount() {
            return this.getWorkTargets().length;
        }

        getWorkTargets() {
            this.workTargets ??= Object.entries(this.options['targets'] ??= {});
            return this.workTargets;
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

        convertToDom() {
            const gridCellSize = Util.getFloatOrDefault(KEY_MAP_GRID_CELL_SIZE, DEFAULT_CELL_SIZE);
            const borderIndex = this.gridSize - 1;
            const templateColumns = this.gridTemplate(gridCellSize);
            let wrapperDiv = document.createElement("div");
            wrapperDiv.id = "mz-map-grid";
            wrapperDiv.className = "mz-map-grid-wrapper";
            wrapperDiv.style.gridTemplateColumns = templateColumns;
            wrapperDiv.style.gridTemplateRows = templateColumns;
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {
                    if (0 === i || 0 === j || borderIndex === i || borderIndex === j) {
                        if (i === j || i + j === borderIndex) {
                            wrapperDiv.appendChild(this.emptyCell(i, j));
                        } else {
                            wrapperDiv.appendChild(this.borderCell(i, j));
                        }
                        continue;
                    }

                    let cell = this.getCellInternal(i, j);
                    wrapperDiv.appendChild(cell.convertToDom(i, j, this.centerX, this.centerY));
                }
            }
            return wrapperDiv;
        }

        gridTemplate(size) {
            return `2rem repeat(${this.gridSize - 2}, ${size}rem) 2rem`;
        }

        emptyCell(i, j) {
            const center = 1 + this.horizontalRange;
            const cellDiv = document.createElement("div");

            cellDiv.style.gridRowStart = j + 1;
            cellDiv.style.gridColumnStart = i + 1;
            cellDiv.className = cellClass(center, center, i + 1, j + 1);
            cellDiv.innerHTML = "&nbsp;";
            return cellDiv;
        }

        borderCell(i, j) {
            const center = 1 + this.horizontalRange;
            const borderIndex = this.gridSize - 1;
            const index = (0 === i) || borderIndex === i ? this.indexToY(j) : this.indexToX(i);
            let borderClass = 0 === i ? "mz-map-grid-border-left" : "";
            borderClass = borderIndex === i ? "mz-map-grid-border-right" : borderClass;

            const cellDiv = document.createElement("div");
            cellDiv.style.gridRowStart = j + 1;
            cellDiv.style.gridColumnStart = i + 1;
            cellDiv.className = cellClass(center, center, i + 1, j + 1);

            const span = document.createElement("span");
            span.className = `mz-map-grid-border ${borderClass}`;
            span.textContent = index;

            cellDiv.appendChild(span);
            return cellDiv;
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
            return this.centerY + this.horizontalRange - i + 1;
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
            let gridDom = this.convertToDom();
            let toolbar = this.createToolbar();
            let targetbar = this.createTargetBar();

            let detailsWrapper = document.createElement("div");
            detailsWrapper.id = "mz-map-details-wrapper";
            detailsWrapper.className = "mh_tdtitre";

            let headerSpan = document.createElement("span");
            headerSpan.className = "mz-map-details-header";

            let h2Title = document.createElement("h2");
            h2Title.className = "titre2";
            h2Title.textContent = "Détails"; // TODO fix accent

            let contentWrapper = document.createElement("div");
            contentWrapper.id = "mz-map-details-content-wrapper";
            contentWrapper.textContent = "Pour une vue plus détaillée du contenu d'une caverne, cliquez sur l'indicateur de profondeur";

            headerSpan.appendChild(h2Title);
            detailsWrapper.appendChild(headerSpan);
            detailsWrapper.appendChild(contentWrapper);

            let mapWrapper = document.createElement("div");
            mapWrapper.id = 'mz-map-wrapper';

            let gridScrollDiv = document.createElement("div");
            gridScrollDiv.id = "mz-map-grid-scroll";

            gridScrollDiv.appendChild(gridDom);

            mapWrapper.append(toolbar, targetbar, gridScrollDiv, detailsWrapper);

            let infoTab = document.getElementById('infoTab');
            infoTab.parentNode.insertBefore(mapWrapper, infoTab.nextSibling);

            $('#mz-map-grid-scroll').dragscrollable({dragSelector: 'div', acceptPropagatedEvent: false});
            this.gotoPlayer();
            this.addEventHandlers();
        }

        createToolbar() {
            const storedTextSize = Util.getFloatOrDefault(KEY_MAP_GRID_TEXT_SIZE, DEFAULT_CELL_TEXT_SIZE);
            const initialTextValue = (storedTextSize - MIN_TEXT_SIZE) / RATIO_VALUE_TO_TEXT_SIZE;
            const storedCellSize = Util.getFloatOrDefault(KEY_MAP_GRID_CELL_SIZE, DEFAULT_CELL_SIZE);
            const initialCellValue = (storedCellSize - MIN_CELL_SIZE) / RATIO_VALUE_TO_CELL_SIZE;

            let toolbarDiv = document.createElement("div");
            toolbarDiv.id = 'mz-map-grid-toolbar';
            toolbarDiv.className = 'mz-map-grid-bar';

            let img = document.createElement("img");
            img.id = 'mz-map-goto-player';
            img.src = '../Images/Icones/W_Throw004.png';
            img.height = '15';
            img.alt = 'Recentrer';
            img.title = 'Recentrer la vue';
            toolbarDiv.appendChild(img);

            toolbarDiv.appendChild(document.createTextNode('Taille texte: '));

            let textResize = document.createElement("input");
            textResize.id = "mz-map-toolbar-resize-text";
            textResize.type = "range";
            textResize.min = "0";
            textResize.max = "100";
            textResize.value = initialTextValue;
            textResize.className = "mz-map-toolbar-slider";
            toolbarDiv.appendChild(textResize);

            toolbarDiv.appendChild(document.createTextNode('Taille cellule: '));

            let cellResize = document.createElement("input");
            cellResize.id = "mz-map-toolbar-resize-cell";
            cellResize.type = "range";
            cellResize.min = "0";
            cellResize.max = "100";
            cellResize.value = initialCellValue;
            cellResize.className = "mz-map-toolbar-slider";
            toolbarDiv.appendChild(cellResize);

            return toolbarDiv;
        }

        createTargetBar() {
            let targetBarDiv = document.createElement("div");
            targetBarDiv.id = 'mz-map-grid-targetbar';
            if (0 === this.options.getWorkTargets().length) {
                return targetBarDiv;
            }
            targetBarDiv.className = 'mz-map-grid-bar';

            for (const target of this.options.getWorkTargets()) {
                let targetDiv = document.createElement("div");
                let monsterId = target[0];
                targetDiv.id = `mz-map-grid-target-${monsterId}`;
                if (target.length >= 3) {
                    let img = document.createElement("img");
                    img.src = '../Images/Icones/W_Throw004.png';
                    img.height = '15';
                    img.alt = 'Centrer la vue sur la cible';
                    img.title = 'Centrer la vue sur la cible';
                    targetDiv.appendChild(img);
                    img.onclick = e => this.goToCell(target[2]);
                }
                targetDiv.appendChild(document.createTextNode(target[1]));
                let removeTarget =  document.createElement("span");
                removeTarget.textContent = '×';
                removeTarget.style.color = "red";
                removeTarget.style.setProperty("font-weight", "bold");
                removeTarget.style.setProperty("font-size", "2.5rem");
                removeTarget.style.setProperty("vertical-align", "middle");
                removeTarget.title = 'Supprimer le suivi';
                removeTarget.addEventListener('click', e => {
                    this.options.removeTarget(monsterId);
                    Util.showFadingMessage("Cible supprimée", e.x - 50, e.y - 50);
                    this.replaceTargetBar(targetBarDiv);
                });
                targetDiv.appendChild(removeTarget);

                targetBarDiv.appendChild(targetDiv);
            }
            return targetBarDiv;
        }

        replaceTargetBar(targetBarDiv) {
            if (null == targetBarDiv) {
                targetBarDiv = document.getElementById("mz-map-grid-targetbar");
            }
            let newTargetBar = this.createTargetBar();
            targetBarDiv.parentNode.replaceChild(newTargetBar, targetBarDiv);
        }

        addEventHandlers() {
            // TODO: move the toolbar handlers into the toolbar creation
            document.querySelectorAll('.mz-map-grid-cell').forEach(cell => {
                cell.addEventListener('mouseenter', function () {
                    this.classList.add('expanded');
                });

                cell.addEventListener('mouseleave', function () {
                    this.classList.remove('expanded');
                });
            });
            document.getElementById("mz-map-goto-player").addEventListener('click', e => this.gotoPlayer());
            document.getElementById('mz-map-grid').addEventListener('click', e => this.updateDetailsForDepth(e));
            document.getElementById("mz-map-toolbar-resize-text").oninput = e => this.resizeCellText(e);
            document.getElementById("mz-map-toolbar-resize-cell").oninput = e => this.resizeCellSize(e);

            // Make all cells display a hint if there is more content than what is visible (not that this is not
            // recomputed if cells are resized)
            const allCells = document.getElementsByClassName('mz-map-grid-cell');
            for (const cell of allCells) {
                if (cell.scrollHeight > cell.clientHeight) {
                    cell.querySelector('.mz-map-grid-cell-hint').classList.add('mz-map-grid-cell-hint-visible');
                }
            }
        }

        /**
         * Change the styles linked to cell contents to scale text and icons
         */
        resizeCellText(e) {
            const value = e.target.value;
            const textSize = MIN_TEXT_SIZE + RATIO_VALUE_TO_TEXT_SIZE * value;
            localStorage.setItem(KEY_MAP_GRID_TEXT_SIZE, textSize.toString());
            const imageSize = MIN_ICON_SIZE + RATIO_VALUE_TO_ICON_SIZE * value;
            localStorage.setItem(KEY_MAP_GRID_ICON_SIZE, imageSize.toString());

            const rootSheet = document.getElementById("mz-map-styles");
            const rootStyle = this.findStyle(rootSheet.sheet, ':root');
            rootStyle.style.setProperty("--cell-default-font-size", `${textSize}rem`);
            rootStyle.style.setProperty("--cell-default-image-size", `${imageSize}px`);
        }

        resizeCellSize(e) {
            const value = e.target.value;
            const gridCellSize = MIN_CELL_SIZE + RATIO_VALUE_TO_CELL_SIZE * value;
            localStorage.setItem(KEY_MAP_GRID_CELL_SIZE, gridCellSize.toString());
            const templateColumns = this.gridTemplate(gridCellSize);
            document.getElementById("mz-map-grid").style = `grid-template-columns: ${templateColumns}; grid-template-rows: ${templateColumns};`;

            const rootSheet = document.getElementById("mz-map-styles");
            const rootStyle = this.findStyle(rootSheet.sheet, ':root');
            rootStyle.style.setProperty("--cell-size-min", `${gridCellSize}rem`);
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
            this.goToCell(`mz-map-grid-cell-${this.centerX}-${this.centerY}`);
        };

        goToCell(cellId) {
            let gridHolder = $("#mz-map-grid-scroll")[0];
            let cell = document.getElementById(cellId);
            let gridRect = gridHolder.getBoundingClientRect();
            let cellRect = cell.getBoundingClientRect();

            let cellLeft = cellRect.left - gridRect.left + gridHolder.scrollLeft;
            let cellTop = cellRect.top - gridRect.top + gridHolder.scrollTop;

            let scrollLeft = cellLeft - (gridHolder.clientWidth / 2) + (cellRect.width / 2);
            let scrollTop = cellTop - (gridHolder.clientHeight / 2) + (cellRect.height / 2);

            gridHolder.scrollTo({left: scrollLeft, top: scrollTop, behavior: 'smooth'});
            cell.classList.add('mz-map-effects-flash-attention');
            setTimeout(() => cell.classList.remove('mz-map-effects-flash-attention'), 5000);
        }

        /**
         * Met à jour la boîte avec les détails de la grotte aux coordonnées stockées dans le DOM element.
         * @param e event
         */
        updateDetailsForDepth(e) {
            let target = e.target.closest('[data-mz-grid-n]');

            if (null == target) {
                return;
            }
            const {x, y, n} = this.retrieveCoordinates(target);
            const cell = vue2d.grid.getCellMounty(x, y);
            let detailsDom = cell.detailsDom(n);
            document.getElementById('mz-map-details-content-wrapper').replaceChildren(...detailsDom);
            document.getElementById('mz-map-details-memorize').addEventListener('click', e => this.setMapDestination(e));
        }

        retrieveCoordinates(target) {
            const x = parseInt(target.dataset.mzGridX);
            const y = parseInt(target.dataset.mzGridY);
            const n = parseInt(target.dataset.mzGridN);
            return {x, y, n};
        }

        setMapDestination(e) {
            let target = e.target.closest('[data-mz-grid-n]');
            const {x, y, n} = this.retrieveCoordinates(target);

            let favorites = localStorage.getItem("favori_gow");
            if (null !== favorites) {
                favorites = favorites.split("/");
                // for some reason, the last item is an empty string
                favorites.pop();
                if (0 !== favorites.length % 4) {
                    console.log(`Impossible de parser les favoris: ${favorites}`);
                    return;
                }
                const count = Math.floor(favorites.length / 4);
                let needToAppend = true;
                for (let i = 0; i < count; i++) {
                    if (favorites[i * 4] === "vue2d") {
                        needToAppend = false;
                        favorites[i * 4 + 1] = x;
                        favorites[i * 4 + 2] = y;
                        favorites[i * 4 + 3] = n;
                        break;
                    }
                }
                if (needToAppend) {
                    favorites.push(...["vue2d", x, y, n]);
                }

            } else {
                favorites = ["vue2d", x, y, n];
            }
            favorites.push("");
            localStorage.setItem("favori_gow", favorites.join("/"));
            Util.showFadingMessage('Destination "vue2D" enregistrée', e.x - 50, e.y - 50);
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

        convertToDom(i, j, centerX, centerY) {
            const rowStart = j + 1;
            const colStart = i + 1;

            const cellDiv = document.createElement("div");
            cellDiv.id = this.cellId();

            cellDiv.dataset.mzGridX = this.x;
            cellDiv.dataset.mzGridY = this.y;

            cellDiv.style.gridRowStart = rowStart;
            cellDiv.style.gridColumnStart = colStart;

            cellDiv.className = `mz-map-grid-cell ${cellClass(centerX, centerY, this.x, this.y)}`;

            const contentDiv = document.createElement("div");
            contentDiv.className = "mz-map-grid-cell-content";

            const headerSpan = document.createElement("span");
            headerSpan.className = "mz-map-grid-cell-header";
            headerSpan.textContent = `${this.x} ${this.y}`;
            contentDiv.appendChild(headerSpan);

            if (this.youAreHere) {
                let hereSpan = document.createElement("span");
                hereSpan.className = "mz-map-grid-here";
                hereSpan.textContent = `Vous êtes ici (${this.youAreHere})`;
                contentDiv.appendChild(hereSpan);
            }

            cellDiv.appendChild(contentDiv);

            const hintDiv = document.createElement("div");
            hintDiv.className = "mz-map-grid-cell-hint";
            hintDiv.textContent = String.fromCharCode(8661);
            cellDiv.appendChild(hintDiv);

            for (let depth = vue2d.grid.centerN + vue2d.grid.verticalRange; depth >= vue2d.grid.centerN - vue2d.grid.verticalRange; depth--) {
                let depthContent = [];
                depthContent = depthContent.concat(this.groupToNodes(depth, this.trolls, this.trollToBits),
                    this.groupToNodes(depth, this.monsters, this.monsterToBits),
                    this.groupToNodes(depth, this.places, this.placeToBits),
                    this.treasuresToNodes(depth));

                if (depthContent.length > 0) {
                    const cellDepth = document.createElement("span");
                    cellDepth.className = "mz-map-grid-cell-depth";
                    cellDepth.dataset.mzGridX = this.x;
                    cellDepth.dataset.mzGridY = this.y;
                    cellDepth.dataset.mzGridN = depth;

                    const cellDepthHeader = document.createElement("span");
                    cellDepthHeader.className = "mz-map-grid-cell-depth-header";
                    cellDepthHeader.innerText = depth;
                    cellDepth.appendChild(cellDepthHeader);

                    cellDepth.append(...depthContent);
                    contentDiv.appendChild(cellDepth);
                }
            }
            return cellDiv;
        }

        cellId() {
            return `mz-map-grid-cell-${this.x}-${this.y}`;
        }

        trollToBits(troll) {
            return {
                className: "mz-map-grid-troll",
                gridType: "trolls",
                display: `${troll.name} ${troll.quickInfo()}`
            };
        }

        monsterToBits(monster) {
            let bits = {
                className: "mz-map-grid-monster",
                gridType: "monstres",
                display: monster.groupName,
            };
            let groupName = monster.groupName.toLowerCase();
            for (const mythique of MYTHIQUES) {
                if (groupName.includes(mythique)) {
                    bits.image = `https://www.iktomi.eu/images/${mythique}.png`;
                    bits.className += " dangerous";
                    break;
                }
            }
            return bits;
        }

        placeToBits(place) {
            const extraClass = place.hole ? 'mz-map-grid-hole' : '';
            return {
                className: `mz-map-grid-place ${extraClass}`,
                gridType: "lieux",
                display: place.name
            };
        }

        treasuresToNodes(depth) {
            if (null == this.treasures) {
                return [];
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
                return [];
            }
            let result = document.createElement("span");
            result.className = "mz-map-grid-treasure";
            result.dataset.gridType = "treasure";
            let keys = Array.from(summary.keys()).sort();
            for (const key of keys) {
                const treasureIcon = TREASURE_ICONS[key];
                if (null == treasureIcon) {
                    console.log(`vue2d: Type de tresor sans icone: ${key}`);
                }
                const img = document.createElement("img");
                img.src = `../Images/Icones/${treasureIcon}`;
                img.title = key;
                result.appendChild(img);
                result.appendChild(document.createTextNode(`:${summary.get(key)} `));
            }
            return result;
        }

        groupToNodes(depth, group, itemToBits) {
            if (null == group) {
                return [];
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
                return [];
            }
            let keys = Array.from(summary.keys()).sort();
            let values = keys.map(key => {
                let piecesAndCounts = summary.get(key);
                let pieces = piecesAndCounts[0];
                let span = document.createElement("span");
                span.className = pieces.className;
                span.dataset.gridType = pieces.gridType;
                let text = piecesAndCounts[1] === 1 ? pieces.display : `${piecesAndCounts[1]} × ${pieces.display}`;
                if (pieces.image) {
                    let img = document.createElement("img");
                    img.src = pieces.image;
                    span.appendChild(img);
                }
                span.appendChild(document.createTextNode(text));

                return span;
            });

            return values;
        }

        detailsDom(depth) {
            let elements = [];

            let header = document.createElement("h3");
            header.className = "titre3";
            header.style.textAlign = "center";
            header.dataset.mzGridX = this.x;
            header.dataset.mzGridY = this.y;
            header.dataset.mzGridN = depth;
            header.textContent = `${this.x} ${this.y} ${depth}`;

            let memorizeImg = document.createElement("img");
            memorizeImg.id = "mz-map-details-memorize";
            memorizeImg.src = "../Images/Icones/S_Bow09.png";
            memorizeImg.height = 15;
            memorizeImg.title = "Mémoriser comme destination ";

            header.appendChild(memorizeImg);

            elements.push(header);

            let contentSpan = document.createElement("span");
            contentSpan.id = "mz-map-details-content";
            contentSpan.dataset.mzGridX = this.x;
            contentSpan.dataset.mzGridY = this.y;
            contentSpan.dataset.mzGridN = depth;

            contentSpan.append(...(this.groupToDetails(depth, this.trolls, "mz-map-details-troll")));
            contentSpan.append(...(this.groupToDetails(depth, this.monsters, "mz-map-details-monster", this.monsterInfo)));
            contentSpan.append(...(this.groupToDetails(depth, this.treasures, "mz-map-details-treasure")));
            contentSpan.append(...(this.groupToDetails(depth, this.places, "mz-map-details-place")));
            contentSpan.append(...(this.groupToDetails(depth, this.graves, "mz-map-details-grave")));
            contentSpan.append(...(this.groupToDetails(depth, this.mushrooms, "mz-map-details-mushroom")));

            elements.push(contentSpan);
            return elements;
        }

        groupToDetails(depth, group, groupClass, additionalInfo = null) {
            if (group == null) {
                return [];
            }

            let resultElements = [];

            for (const item of group) {
                if (item.n !== depth) {
                    continue;
                }

                let itemSpan = document.createElement("span");
                itemSpan.className = groupClass;
                itemSpan.innerHTML = `${item.id} ${item.html}`;

                const additionalElement = additionalInfo?.(item);
                if (additionalElement) {
                    itemSpan.append(...additionalElement);
                }

                resultElements.push(itemSpan);
            }
            return resultElements;
        }

        monsterInfo(monster) {
            let result = [];
            const options = vue2d.grid.options;
            if (options.isTarget(monster.id)) {
                let removeTarget = document.createElement("span");
                removeTarget.textContent = '×';
                removeTarget.style.color = "red";
                removeTarget.style.setProperty("font-weight", "bold");
                removeTarget.style.setProperty("font-size", "2.5rem");
                removeTarget.style.setProperty("vertical-align", "middle");
                removeTarget.title = 'Supprimer le suivi';
                removeTarget.addEventListener('click', e => {
                    options.removeTarget(monster.id);
                    removeTarget.remove();
                    Util.showFadingMessage("Cible supprimée", e.x - 50, e.y - 50);
                    vue2d.grid.replaceTargetBar();
                });
                result.push(removeTarget);
            } else {
                if (options.targetCount() < Options.MAX_TARGET_COUNT) {
                    let image = document.createElement('img');
                    image.src = '../Images/Icones/S_Bow10.png';
                    image.title = 'Suivre comme cible';
                    image.height = 15;
                    image.addEventListener('click', e => {
                        image.remove();
                        options.addTarget(monster.id, monster.name, `mz-map-grid-cell-${monster.x}-${monster.y}`);
                        Util.showFadingMessage("Cible ajoutée", e.x - 50, e.y - 50);
                        vue2d.grid.replaceTargetBar();
                    });
                    result.push(image);
                }
            }

            const row = vue2d.grid.monsterRows?.get(monster.id);
            if (!row) {
                return result;
            }

            const cdmCell = row.cells[2];
            if ('' === cdmCell.innerText.trim()) {
                return null;
            }
            let cdmSpan = document.createElement('span');
            cdmSpan.innerText = `CDM:${cdmCell.innerText}`;
            cdmSpan.dataset.indxmz = cdmCell.dataset.indxmz;
            cdmSpan.style.color = cdmCell.style.color;
            cdmSpan.onclick = e => basculeCDM2.apply(e.target, [Side.LEFT]);
            result.push(cdmSpan);
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

            if (vue2d.grid.options.isTarget(monster.id)) {
                const target = vue2d.grid.options.getWorkTargets().find(t => t[0] == monster.id);
                if (null != target) {
                    target.push(this.cellId());
                }
            }
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
     * Un élément (monstre, troll, trésor, ...) que l'on retrouve dans une cellule.
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
                    this.action = val.action;
                    // this.family = "todo";
                    break;
                case "champignons":
                    this.name = val.nom;
                    this.action = val.action;
                    break;
                case "cenotaphes" :
                    // TODO
                    break;
                case "lieux" :
                    this.name = this.extractName(val).epure();
                    if (this.name === 'Trou de Meteorite') {
                        this.hole = true;
                    }
                    break;
                case "tresors" :
                    this.name = this.extractName(val).epure();
                    this.action = val.action;
                    if (this.name.toLowerCase().includes("mimique")) {
                        this.type = 'monstres';
                        this.name = 'mimique';
                    }
                    break;
                case "trolls" :
                    this.name = this.extractName(val);
                    this.race = val.race;
                    this.level = val.niv;
                    this.action = val.action;
                    this.html = `${this.html} ${this.quickInfo()} ${val.guilde?.value ?? ''}`;
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

        quickInfo() {
            return this.race.substring(0, 2) + this.level;
        }
    }

    /**
     * Renvoie la classe appropriée pour une cellule de la grille en fonction de ses coordonnées (en référentiel Mountyhall)
     * @param {int} centerX coordonnée X du centre de la grille
     * @param {int} centerY coordonnée Y du centre de la grille
     * @param {int} x coordonnée X de la cellule
     * @param {int} y coordonnée Y de la cellule
     * @returns {string} la classe ad hoc
     */
    function cellClass(centerX, centerY, x, y) {
        const distX = Math.abs(centerX - x);
        const distY = Math.abs(centerY - y);
        const dist = Math.max(distX, distY);
        return 0 === (dist % 2) ? `mz-map-grid-odd` : `mz-map-grid-even`;
    }

    const KEY_MAP_GRID_TEXT_SIZE = "MZ_vue2d_mz-map-grid-cell-text-size";
    const MIN_TEXT_SIZE = 0.5;
    const RATIO_VALUE_TO_TEXT_SIZE = 0.015;
    const DEFAULT_CELL_ICON_SIZE = 15;

    const KEY_MAP_GRID_ICON_SIZE = "MZ_vue2d_mz-map-grid-cell-icon-size";
    const MIN_ICON_SIZE = 3;
    const RATIO_VALUE_TO_ICON_SIZE = 0.24;
    const DEFAULT_CELL_TEXT_SIZE = 1.2;

    const KEY_MAP_GRID_CELL_SIZE = "MZ_vue2d_mz-map-grid-cell-size";
    const MIN_CELL_SIZE = 3;
    const RATIO_VALUE_TO_CELL_SIZE = 0.24;
    const DEFAULT_CELL_SIZE = 15;


    vue2d.injectStyles = function () {
        const defaultCellFontSize = Util.getFloatOrDefault(KEY_MAP_GRID_TEXT_SIZE, DEFAULT_CELL_TEXT_SIZE);
        const defaultCellIconSize = Util.getFloatOrDefault(KEY_MAP_GRID_ICON_SIZE, DEFAULT_CELL_ICON_SIZE);
        const defaultCellSize = Util.getFloatOrDefault(KEY_MAP_GRID_CELL_SIZE, DEFAULT_CELL_SIZE);
        const css = String.raw;
        const style = document.createElement('style');


        const styles = css`

            :root {
                --color-troll: darkblue;
                --color-monster: darkgreen;
                --color-border: #4CAF50;
                --cell-default-font-size: ${defaultCellFontSize}rem;
                --cell-default-image-size: ${defaultCellIconSize}px;
                --cell-size-min: ${defaultCellSize}rem;
            }

            #mz-map-wrapper {
                margin-top: 1rem;
                position: relative;
                column-gap: 0.5rem;
            }

            .mz-map-grid-wrapper {
                display: grid;
                column-gap: 2px;
                row-gap: 2px;
                font-size: small;
            }

            #mz-map-grid-scroll {
                width: 85%;
                display: inline-block;
                max-height: 70vh;
                overflow: auto;
                border: 2px solid var(--color-border);
                border-radius: 8px;
            }

            #mz-map-details-wrapper {
                border: 2px solid var(--color-border);
                border-radius: 8px;
                display: inline-block;
                width: calc(15% - 1rem);
                margin-left: 1rem;
            }

            .mz-map-grid-bar {
                position: absolute;
                background: white;
                border: 1px solid #999;
                padding: 0.5rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                z-index: 1;
            }

            #mz-map-grid-toolbar {
                top: 2rem;
                left: 2rem;
            }

            #mz-map-grid-targetbar {
                top: 2rem;
                right: calc(15% + 2rem);
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

            .mz-map-grid-cell-hint.mz-map-grid-cell-hint-visible {
                display: block;
            }

            .mz-map-grid-cell-content {
                height: 100%;
                box-sizing: border-box;
                white-space: nowrap;
                font-size: var(--cell-default-font-size);
                line-height: var(--cell-default-font-size);

                img {
                    height: var(--cell-default-image-size);
                }
            }

            .mz-map-grid-cell.expanded {
                z-index: 10;
                overflow: visible;

                .mz-map-grid-cell-header, .mz-map-grid-cell-depth-header, .mz-map-grid-here {
                    display: block;
                    width: 100%;
                }

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
                    min-height: var(--cell-size-min);
                    min-width: var(--cell-size-min);
                    box-sizing: border-box;
                }

                .mz-map-grid-cell-hint.mz-map-grid-cell-hint-visible {
                    display: none;
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

                &.dangerous {
                    color: orangered;
                    font-weight: bolder
                }
            }

            .mz-map-grid-treasure {
                display: block;
            }

            .mz-map-grid-place {
                display: block;
            }

            .mz-map-grid-hole {
                background: black;
                color: orangered;
                font-weight: bolder
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
                display: none;
                font-weight: bold;
                text-align: center;
                padding-top: 2px;
                width: var(--cell-size-min);
            }

            .mz-map-grid-cell-depth {
                display: block;
            }

            .mz-map-grid-cell-depth-header, .mz-map-grid-here {
                display: inline-block;
                font-weight: bold;
                text-align: center;
                padding-top: 2px;
                width: var(--cell-size-min);
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

            .mz-map-effects-fade {
                position: fixed;
                border: 2px solid var(--color-border);
                border-radius: 5px;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transform: translateY(-10px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            .mz-map-effects-fade.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .mz-map-effects-fade.fade-out {
                opacity: 0;
                transform: translateY(10px);
            }

            @keyframes mz-map-effects-flash-bg {
                0%, 100% {
                    background-color: rgba(255, 30, 0, 0.2);
                }
                50% {
                    background-color: rgba(255, 30, 0, 0.6);
                }
            }

            .mz-map-effects-flash-attention {
                animation: mz-map-effects-flash-bg 0.3s ease-in-out 10;
            }
        `;

        style.id = 'mz-map-styles';
        style.appendChild(document.createTextNode(styles));
        document.head.appendChild(style);
    }

    vue2d.insertGrid = function () {
        vue2d.injectStyles();
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

        vue2d.grid = new Grid(x, y, n, rangeX, rangeY);
        vue2d.grid.options = new Options(MH_vue2d_json);
        vue2d.grid.indexMap(json_monstres, json_trolls, json_tresors, json_lieux, json_champignons, json_cenotaphes);
        vue2d.grid.insertIntoDom();
    }

    vue2d.whenViewReady = function () {
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
        vue2d.insertGrid();
        MZ_cVueJSON.registerCallbackMZ(vue2d.whenCdmReady);
    }

    vue2d.whenCdmReady = function () {
        let monsterRows = document.querySelectorAll("#monstres tbody tr");
        monsterRows = new Map([...monsterRows].map(j => [parseInt(j.cells[3].innerText), j]));
        vue2d.grid.monsterRows = monsterRows;
    }

})(window.vue2d); // scope confinement

if (window.location.pathname.indexOf(`/mountyhall/MH_Play/Play_vue`) === 0) {
    MZ_cVueJSON.registerCallback(vue2d.whenViewReady);
}
