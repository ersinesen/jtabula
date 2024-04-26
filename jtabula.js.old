/**
 * Represents a dynamic table generator.
 * @class
 * @author Ersin Esen
 * @see {@link https://github.com/ersinesen}
 * @since March 24, 2024
 * @license MIT
 *
 * MIT License
 *
 * Copyright 2024 Ersin Esen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class JTabula {
  /**
   * Create a JTabula instance.
   * @constructor
   * @param {string} containerId - The ID of the container where the table will be appended.
   * @param {number} columnsPerRow - The number of columns per row in the table.
   * @param {string} [tableID="jtTable"] - The ID to be assigned to the generated table.
   */
  constructor(containerId, columnsPerRow, tableID = "jtTable") {
    this.containerId = containerId;
    this.columnsPerRow = columnsPerRow;
    this.tableID = tableID;
    this.cellWidth = null;
    this.cellHeight = null;
  }

  /**
   * Creates the table structure within the specified container.
   */
  createTable() {
    const container = document.getElementById(this.containerId);
    const table = document.createElement("table");
    table.id = this.tableID;
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    container.appendChild(table);
  }

  /**
   * Appends a header row to the table.
   * @param {Array<string>} headers - Array of header text for each column.
   */
  appendHeader(headers) {
    const table = document.getElementById(this.tableID);
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    //headerRow.classList.add("sticky-top");
    headers.forEach((headerText, index) => {
      const headerCell = document.createElement("th");
      headerCell.classList.add("jt-header-cell");
      headerCell.textContent = headerText;

      if (index === 0) {
        // Create button for sorting
        const sortButton = document.createElement("button");
        sortButton.classList.add("jt-header-button", "btn-icon", "btn-sort");
        sortButton.textContent = '▼'; // up: ▲
        sortButton.addEventListener("click", () => {
          this.sortRows(headerCell.cellIndex);
        });
        const buttonContainer = document.createElement("div");
        buttonContainer.style.float = "right"; // Float the container to the right
        buttonContainer.appendChild(sortButton);
        headerCell.appendChild(buttonContainer);
      }
      else if (index > 0) {
        // Create button for sorting
        const sortButton = document.createElement("button");
        sortButton.classList.add("jt-header-button", "btn-icon", "btn-sort");
        sortButton.textContent = '▼'; // up: ▲
        sortButton.addEventListener("click", () => {
          this.sortRows(headerCell.cellIndex);
        });

        // Create buttons for increasing and decreasing column width
        const increaseButton = document.createElement("button");
        increaseButton.classList.add("jt-header-button", "btn-icon");
        increaseButton.textContent = '+';
        increaseButton.addEventListener("click", () => {
          this.adjustColumnWidth(headerCell.cellIndex, 10);
        });

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = '-';
        decreaseButton.addEventListener("click", () => {
          this.adjustColumnWidth(headerCell.cellIndex, -10);
        });

        // Container for buttons with right alignment
        const buttonContainer = document.createElement("div");
        buttonContainer.style.float = "right"; // Float the container to the right
        buttonContainer.appendChild(sortButton);
        buttonContainer.appendChild(decreaseButton);
        buttonContainer.appendChild(increaseButton);
        headerCell.appendChild(buttonContainer);
      }
      headerRow.appendChild(headerCell);
    });

  }

  /**
   * Sort rows using a column.
   * @param {number} columnIndex - Index of the column.
   */
  sortRows(columnIndex) {
    console.log("Sorting rows by column:", columnIndex);
    const table = document.getElementById(this.tableID);
    const rows = table.rows;

    // Get column content
    const columnContent = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cellIndex = columnIndex; // Calculate cell index based on column index and row number
      const cell = row.cells[cellIndex];
      if (cell) {
        if (cell.textContent) {
          // for text cells (No column for instance)
          columnContent.push(cell.textContent);
        }
        else {
          const input = cell.querySelector(".jt-input-ss");
          //console.log("Cell content:", input.value);
          columnContent.push(input.value);
        }
      }
    }

    const headerCell = rows[0].cells[columnIndex];
    const sortButton = headerCell.querySelector(".btn-sort");
    const sortDirection = sortButton.textContent === '▼' ? 'desc' : 'asc';
    const { sortedArray, sortedIndices } = this.sortWithIndices(columnContent, sortDirection);
    console.log(sortedArray);
    console.log(sortedIndices);

    // Update the table rows
    this.updateRows(sortedIndices);

    // Change button icon
    sortButton.textContent = sortButton.textContent === '▼' ? '▲' : '▼';

  }

  /**
   * Sort column values and return also the indices. Used by sortRows.
   * @param {Array} toSort - Column values.
   * @param {string} sortDirection - Sort direction (asc or desc).  
   */
  sortWithIndices(toSort, sortDirection) {
    // Create an array of indices [0, 1, 2, ..., n]
    const indices = Array.from(toSort.keys());

    // Sort the indices based on the values in the toSort array
    indices.sort((a, b) => {
      const valueA = isNaN(parseFloat(toSort[a])) ? toSort[a] : parseFloat(toSort[a]);
      const valueB = isNaN(parseFloat(toSort[b])) ? toSort[b] : parseFloat(toSort[b]);
      if (sortDirection === 'asc')
        return valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
      else
        return valueA < valueB ? 1 : (valueA > valueB ? -1 : 0);
    });

    // Return the sorted array and sorted indices as an object
    return {
      sortedArray: indices.map(index => toSort[index]),
      sortedIndices: indices
    };
  }

  /**
   * Update rows of the table by reordering rows according to the sorted indices. Used by sortRows.
   * @param {Array<number>} sortedIndices - Row indices.
   */
  updateRows(sortedIndices) {
    const table = document.getElementById(this.tableID);
    const rows = table.rows;

    // 1. Store rows in sorted fashion: skip header row
    let sortedRows = sortedIndices.map(index => rows[index + 1]);

    // 2. Clear the data rows
    while (table.rows.length > 1) {
      table.deleteRow(1); // Delete all rows from the table
    }

    // 3. Add back the sorted rows to the DOM
    const tbody = table.querySelector('tbody');
    sortedRows.forEach(row => {
      tbody.appendChild(row);
    });

  }


  /**
   * Adjust column withs by increase or decrease via buttons.
   * @param {number} columnIndex - Index of the column.
   * @param {number} delta - Adjustment value.
   */
  adjustColumnWidth(columnIndex, delta) {
    const table = document.getElementById(this.tableID);
    const rows = table.rows;
    const cellsPerRow = this.columnsPerRow;

    // Adjust width of header cell
    const headerCell = table.rows[0].cells[columnIndex];
    const currentHeaderWidth = parseInt(headerCell.style.width) || headerCell.offsetWidth;
    const newHeaderWidth = Math.max(currentHeaderWidth + delta, 0);
    headerCell.style.width = newHeaderWidth + "px";

    // Adjust width of cells in the same column in the body of the table
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cellIndex = columnIndex + (i - 1) * cellsPerRow; // Calculate cell index based on column index and row number
      const cell = row.cells[cellIndex];
      if (cell) {
        const currentCellWidth = parseInt(cell.style.width) || cell.offsetWidth;
        const newCellWidth = Math.max(currentCellWidth + delta, 0);
        cell.style.width = newCellWidth + "px";
      }
    }
  }


  /**
   * Sets custom dimensions for the cells.
   * @param {string} width - The width of the cells.
   * @param {string} height - The height of the cells.
   */
  setCellDimensions(width, height) {
    this.cellWidth = width;
    this.cellHeight = height;
    // Set custom properties for cell width and height
    document.documentElement.style.setProperty('--cell-width', width);
    document.documentElement.style.setProperty('--cell-height', height);
  }

  /**
   * Appends a cell to the table.
   * @param {Object} cell - The cell object to be appended.
   * @param {string} cell.type - The type of the cell (text, input, select, img, chart, youtube).
   * @param {string} [cell.data] - The data to be displayed in the cell (for text, input, img, and youtube types).
   * @param {boolean} [cell.disabled] - Whether the cell is disabled (for input and select types).
   * @param {string} [cell.hAlign] - The horizontal alignment of the cell content.
   * @param {string} [cell.vAlign] - The vertical alignment of the cell content.
   */
  appendCell(cellData) {
    const table = document.getElementById(this.tableID);
    const rows = table.rows;
    const lastRowIndex = rows.length - 1;
    let lastRow = rows[lastRowIndex];
    if (!lastRow || lastRow.cells.length === this.columnsPerRow) {
      lastRow = table.insertRow(lastRowIndex + 1);
    }
    const cellIndex = lastRow.cells.length;
    const newCell = lastRow.insertCell(cellIndex);
    newCell.id = `cell-${rows.length - 1}-${cellIndex}`;
    newCell.style.textAlign = cellData.hAlign ? cellData.hAlign : "center";
    newCell.style.verticalAlign = cellData.vAlign ? cellData.vAlign : "middle";
    newCell.classList.add("jt-cell");

    // fill in data
    this.populateCell(newCell, cellData);

  }

  /**
   * Populates a cell based on its type.
   * @param {HTMLElement} cell - The cell element to be populated.
   * @param {Object} cellData - The data object for the cell.
   * @param {string} cellData.type - The type of the cell (text, input, select, img, chart, youtube).
   * @param {*} [cellData.data] - The data to be displayed in the cell (for text, input, img, and youtube types).
   * @param {boolean} [cellData.disabled] - Whether the cell is disabled (for input and select types).
   */
  populateCell(cell, cellData) {
    cell.type = cellData.type;
    switch (cellData.type) {
      case "html":
        const htmlDiv = document.createElement("div");
        htmlDiv.innerHTML = cellData.data;
        cell.appendChild(htmlDiv);
        break;
      case "text":
        cell.textContent = cellData.data;
        break;
      case "input":
        const input = document.createElement("input");
        input.classList.add("jt-input");
        input.type = "text";
        input.value = cellData.data;
        input.disabled = cellData.disabled || false;
        cell.appendChild(input);
        break;
      case "input-ss":
        const input_ss = document.createElement("input");
        input_ss.classList.add("jt-input-ss");
        input_ss.type = "text";
        input_ss.value = cellData.data;
        input_ss.disabled = cellData.disabled || false;
        // Add event listeners for keystrokes
        this.addKeystrokeHandlers(input_ss);
        cell.appendChild(input_ss);
        break;
      case "select":
        const select = document.createElement("select");
        select.classList.add("jt-select");
        cellData.data.forEach(option => {
          const optionElem = document.createElement("option");
          optionElem.value = option;
          optionElem.textContent = option;
          select.appendChild(optionElem);
        });
        select.disabled = cellData.disabled || false;
        select.addEventListener("change", () => {
          // Write cell ID and selected option to console
          console.log(`Cell ID: ${cell.id}, Selected Option: ${select.value}`);
        });
        cell.appendChild(select);
        break;
      case "multiselect":
        const el = document.createElement("select");
        el.classList.add("form-select", "jt-multiselect");
        el.multiple = true;
        cellData.data.forEach(option => {
          const optionElem = document.createElement("option");
          optionElem.value = option;
          optionElem.textContent = option;
          el.appendChild(optionElem);
        });
        el.addEventListener("change", () => {
          // Write cell ID and selected option to console
          const frameworksArray = Array.from(el.selectedOptions).map((option) => option.value);
          console.log(`Cell ID: ${cell.id}, Selected Option: ${frameworksArray}`);
        });
        cell.appendChild(el);
        // Create tomselect after element is added to document
        let settings = {// Set the dropdownParent to null to allow the dropdown to extend beyond the container cell
          dropdownParent: null
        };
        if (window.TomSelect) {
          const tomSelectInstance = new TomSelect(el, settings);
          tomSelectInstance.control.setAttribute("style", "border: 0px !important; background-color: var(--tblr-body-bg);");
          // Let the dropdown pass cell borders
          cell.setAttribute("style", "overflow: visible !important;");
        }
        break;
      case "radio":
        this.createRadios(cell, cellData);
        break;
      case "checkbox":
        this.createCheckbox(cell, cellData);
        break;
      case "img": const img = document.createElement("img");
        img.src = cellData.data;
        img.alt = "Image";
        cell.appendChild(img);
        break;
      case "video":
        const video = document.createElement("video");
        video.classList.add("jt-video");
        video.src = cellData.data;
        video.controls = true;
        video.type = "video/mp4"
        cell.appendChild(video);
        break;
      case "chart":
        const chartDiv = document.createElement("div");
        chartDiv.id = `chartDiv-${cell.id}`;
        cell.appendChild(chartDiv);
        this.createChart(chartDiv, cellData);
        break;
      case "youtube":
        // Create the iframe element
        const iframe = document.createElement("iframe");
        iframe.classList.add("jt-iframe");
        iframe.src = cellData.data;
        // Set the attributes for the iframe
        //iframe.width = "1619";
        //iframe.height = "911";
        iframe.src = "https://www.youtube.com/embed/R2DU85qLfJQ";
        iframe.title = "Our Planet | Fresh Water | FULL EPISODE | Netflix";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = false;
        cell.appendChild(iframe);
        break;
      default:
        cell.textContent = "Invalid cell type";
    }
  }

  /**
   * Add keystroke handlers to the input element for spreadsheet functionality.
   * @param {HTMLInputElement} input - The input element to add keystroke handlers to.
   */
  addKeystrokeHandlers(inputElement) {
    inputElement.addEventListener('keydown', (event) => {
      const key = event.key;
      const currentCell = event.target.parentNode;
      const currentRow = currentCell.parentNode;
      const currentRowIndex = currentRow.rowIndex;
      const currentCellIndex = currentCell.cellIndex;

      switch (key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentCellIndex > 1) {
            currentRow.cells[currentCellIndex - 1].querySelector('input').focus();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentCellIndex < currentRow.cells.length - 1) {
            currentRow.cells[currentCellIndex + 1].querySelector('input').focus();
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (currentRowIndex > 1) {
            const previousRow = currentRow.previousElementSibling;
            if (previousRow) {
              previousRow.cells[currentCellIndex].querySelector('input').focus();
            }
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (currentRowIndex < currentRow.parentNode.rows.length - 1) {
            const nextRow = currentRow.nextElementSibling;
            nextRow.cells[currentCellIndex].querySelector('input').focus();
          }
          break;
        default:
          break;
      }
    });
  }

  /**
   * Retrieves the value of a cell based on its row and column indices.
   * @param {number} row - The row index of the cell.
   * @param {number} col - The column index of the cell.
   * @returns {*} The value of the cell.
   */
  getCellValue(row, col) {
    const table = document.getElementById(this.tableID);
    if (row >= 0 && row < table.rows.length && col >= 0 && col < this.columnsPerRow) {
      const cell = table.rows[row].cells[col];
      switch (cell.type) {
        case "text":
        case "input":
          return cell.textContent;
        case "select":
          const select = cell.querySelector("select");
          return select.options[select.selectedIndex].value;
        case "img":
          const img = cell.querySelector("img");
          return img.src;
        default:
          return null;
      }
    }
    return null;
  }

  /**
   * Creates a chart within a specified div element.
   * @param {HTMLElement} div - The div element to contain the chart.
   */
  createChart(div, cellData) {
    // Create a new chart
    if (window.ApexCharts) {
      // Default parameters
      const chartType = cellData.chartType ? cellData.chartType : "bar";
      const chartZoom = cellData.chartZoom ? cellData.chartZoom : false;
      const chartTitle = cellData.chartTitle ? cellData.chartTitle : "";
      const chartTitleAlign = cellData.chartTitleAlign ? cellData.chartTitleAlign : "center";
      const chartId = div.id.replace('chartDiv', 'chart');
      console.log(chartId);
      let myChart = new ApexCharts(div, {
        chart: {
          id: chartId,
          type: chartType,
          zoom: {
            enabled: chartZoom
          }
        },
        series: cellData.series,
        yaxis: {
          opposite: true,
        },
        title: {
          text: chartTitle,
          align: chartTitleAlign
        },

      })
      myChart.render();
    }
  }

  /**
   * Creates a radio button within a specified cell.
   * @param {HTMLElement} cell - The cell element to contain the radio button.
   * @param {Object} cellData - The data for the radio button.
   */
  createRadios(cell, cellData) {
    cell.style.textAlign = "left";
    const radioGroup = document.createElement("div");
    const name = cell.id.replace("cell", "radio");
    cellData.data.forEach(option => {
      const label = document.createElement("label");
      label.classList.add("form-check");
      const input = document.createElement("input");
      input.classList.add("form-check-input");
      input.type = "radio";
      input.name = name;
      const span = document.createElement("span");
      span.classList.add("form-check-label");
      span.textContent = option;
      label.appendChild(input);
      label.appendChild(span);
      radioGroup.appendChild(label);
      cell.appendChild(radioGroup);
    });
  }

  /**
   * Creates a checkbox within a specified cell.
   * @param {HTMLElement} cell - The cell element to contain the checkbox.
   * @param {Object} cellData - The data for the checkbox.
   */
  createCheckbox(cell, cellData) {
    cell.style.textAlign = "left";
    const checkGroup = document.createElement("div");
    const name = cell.id.replace("cell", "check");
    cellData.data.forEach(option => {
      const label = document.createElement("label");
      label.classList.add("form-check");
      const input = document.createElement("input");
      input.classList.add("form-check-input");
      input.type = "checkbox";
      input.name = name;
      const span = document.createElement("span");
      span.classList.add("form-check-label");
      span.textContent = option;
      label.appendChild(input);
      label.appendChild(span);
      checkGroup.appendChild(label);
      cell.appendChild(checkGroup);
    });
  }

}