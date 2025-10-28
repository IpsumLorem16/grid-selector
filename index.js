/* Enviroment variables */

// Set dev:true if in development, false when deployed. 
// Do not add any secrets to env!
const env = {
    dev:true
}

if (env.dev === true) {
    document.body.classList.add('dev');
}

/* end of Enviroment variables */
const gridBackgroundEl = document.querySelector('.grid-background');
const gridOverlayEl = document.getElementById('gridOverlay'); //Element Where Overlay box is inserted.

// init

generateNewGrid(10, 10, userTriggered=false);

/* Functions */ 

/**
 * Generate and add grid to page, (must be called on initial page load)
 * 
 * @param {number} columns - single integer, number of columns ↓
 * @param {number} row - single integer, number of rows →
 */
function generateNewGrid(cols=10, rows=10, userTriggered=false) {
    gridBackgroundEl.parentNode.style.background = (userTriggered) ? '#2f4f4f':'white';
    const fragmentEl = new DocumentFragment();

    //loop through rows 
    for (let row = 1; row <= rows; row++) {
        //loop through cols
        for (let col = 1; col <= cols; col++) {
            const delay = col + row;
            //create grid element, and set attributes
            const gridEl = document.createElement('div');
            gridEl.setAttribute('data-row', row);
            gridEl.setAttribute('data-column', col);
            gridEl.className = "grid-background__box";
            //Add numbers along 1st row and 1st column
            if (row === 1) {
                gridEl.innerText = col.toString();
            } else if (col === 1) {
                gridEl.innerText = row.toString();
            }
            gridEl.style.animationDelay = `${delay * 0.01}s`;
            fragmentEl.appendChild(gridEl);
        }
    }
    // clear out old grid
    gridBackgroundEl.innerHTML = ''; 
    deleteAllOverlayBoxes();
    // Update grid size in CSS, for the background
    gridBackgroundEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridBackgroundEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    // Update grid size in CSS, for the overlay
    gridOverlayEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridOverlayEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    gridBackgroundEl.appendChild(fragmentEl);
}

/**
 * Add a box overlay to highlight the selected area.
 * Note: the end-points will be '1' more than the display numbers on the grid, this is NOT a bug. Enable actual grid numbers in devtools > layout > grid overlay.
 * (Reminder: columns = ↓, rows = →)
 * 
 * @param {array} columns - contains 2 numbers, [start point, end point].
 * @param {array} row - contains 2 numbers, [start point, end point].
 * @param {string} name - area name given by user.
 */
const addOverlayBox = (columns, rows, name) => {
    let [columnStart, columnEnd] = columns;
    let [rowStart, rowEnd] = rows;
    const boxEl = document.createElement('div'); // main componenet
    const deleteBtnEl = document.createElement('button'); // delete button
    const nameEl = document.createElement('p'); // display area name

    boxEl.className = 'overlay__box';
    nameEl.innerText = name;
    deleteBtnEl.textContent = 'Delete';
    deleteBtnEl.className = 'overlay__deleteBtn btn btn--red';
    deleteBtnEl.addEventListener('click', handleDeleteBoxClick);
    
    //validate co-ordinates, (user may select start and end square from any direction)
    if (columnStart > columnEnd) {
        columnStart = columns[1]; columnEnd = columns[0]; //Switch start and end values
    }; 
    if (rowStart > rowEnd) {
        rowStart = rows[1]; rowEnd = rows[0]; //Switch start and end values
    }; 


    //set grid position of main component
    boxEl.style.gridColumn = `${columnStart} / ${columnEnd+1}`;
    boxEl.style.gridRow = `${rowStart} / ${rowEnd+1}`;

    //stick it all together
    boxEl.append(deleteBtnEl, nameEl);
    gridOverlayEl.append(boxEl);
    
}

//Delete overlay Box
function handleDeleteBoxClick(event) {
    const overlayBoxEl = event.target.parentElement;
    if (overlayBoxEl?.className === 'overlay__box') {
        overlayBoxEl.remove();
    } 
}

// find and delete all overlay boxes
function deleteAllOverlayBoxes() {
    const overlayBoxEls = document.querySelectorAll('.overlay__box');
    overlayBoxEls.forEach(box => box.remove());
}

// Check if clicked area is a valid 'grid box element'
const isGridBox = element => {

    if (element.hasAttribute('data-row') && element.hasAttribute('data-column')) {
        return true 
    } else {
        return false
    }
}

const selectArea = (e) => {
    let column;
    let row;
    let firstCoords;
    let secondCoords;
    const reset = () => { 
        gridBackgroundEl.addEventListener('click', selectArea, { once: true }); //re-adds a single-fire event listener, that calls this function.
    } 

    if (isGridBox(e.target)) {
        //get first co-ordinate
        column = Number(e.target.dataset.column);
        row = Number(e.target.dataset.row);
        firstCoords = [column, row];      
        
        highlightBox([column, (column)], [row, (row)]);//highlight first selected square

        //get second co-ordinate
        gridBackgroundEl.addEventListener('click', e => {
            if (isGridBox(e.target)) {
                deleteHighlightBox()
                column = Number(e.target.dataset.column);
                row = Number(e.target.dataset.row);
                secondCoords = [column,row];
                addOverlayBox(([firstCoords[0], secondCoords[0]]), ([firstCoords[1], secondCoords[1]]), 'SELECTED')
                reset();
            } else {
                reset();
            }
        }, { once: true });

    } else {
        reset();
    }

}


/**
 * HighlightBox  
 * For highlighting select start box only.  
 * Note: the end-points will be '1' more than the display numbers on the grid, this is NOT a bug. Enable actual grid numbers in devtools > layout > grid overlay.
 
 * 
 * @param {array} columns - (↓) contains 2 numbers, [start point, end point].
 * @param {array} rows - (→) contains 2 numbers, [start point, end point].
 */
function highlightBox(columns, rows) {
    const [columnStart, columnEnd] = columns;
    const [rowStart, rowEnd] = rows;
    
    deleteHighlightBox()

    const gridOverlayEl = document.getElementById('gridOverlay'); //Element Where Overlay box is inserted.
    const highlightEl = document.createElement('div'); // main componenet
    
    highlightEl.className = 'overlay__highlight';

    //set grid position of main component
    highlightEl.style.gridColumn = `${columnStart} / ${columnEnd+1}`;
    highlightEl.style.gridRow = `${rowStart} / ${rowEnd+1}`;

    //stick it all together
    gridOverlayEl.append(highlightEl);

}

function deleteHighlightBox() {
    const highlightBoxes = document.querySelectorAll('.overlay__highlight');
    highlightBoxes?.forEach(element => element.remove())
}

gridBackgroundEl.addEventListener('click', selectArea, {once:true})

/* Side control panel */

GridControls = {
    elements: {
        panel: document.getElementById('sidePanel'),
        toggleButton: document.getElementById('togglePanel'),
        toggleButtonText: document.querySelector('.toggle-panel .sr-only'),
        columnsInput: document.getElementById('columnsInput'),
        rowsInput: document.getElementById('rowsInput'),
    },
    togglePanel() {
        const panel = this.elements.panel;
        const toggleButton = this.elements.toggleButton;
        const expanded = toggleButton.getAttribute('aria-expanded') === 'true';

        
        toggleButton.setAttribute('aria-expanded', !expanded);
        panel.setAttribute('data-expanded', !expanded);

        this.elements.toggleButtonText.innerText = (!expanded) ?  'Hide Panel' : 'Show Panel';

    },
    handleGridInput() {
        const cols = this.elements.columnsInput.value;
        const rows = this.elements.rowsInput.value;

        generateNewGrid(cols, rows, true);

    },
    init() {
        this.elements.toggleButton.addEventListener('click', ()=>this.togglePanel());
        this.elements.columnsInput.addEventListener('change', ()=>this.handleGridInput());
        this.elements.rowsInput.addEventListener('change', ()=>this.handleGridInput());
    },

}

GridControls.init();