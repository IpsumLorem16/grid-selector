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

/* Functions */ 

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
    const gridOverlayEl = document.getElementById('gridOverlay'); //Element Where Overlay box is inserted.
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
