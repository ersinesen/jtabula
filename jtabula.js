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

    table.setAttribute('tabindex', '0'); // Allow table to receive focus

    // Event listener for CTRL-Y shortcut within the context of the table
    table.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'y') {
        console.log("Table receives CTRL-Y shortcut");
        // Get the currently selected cell
        const selectedCell = $(document.activeElement).closest('.jt-cell');
        if (selectedCell.length) {
          // Your action for CTRL-Y shortcut with the selected cell here
          console.log('CTRL-Y shortcut pressed with selected cell:', selectedCell.attr('id'));
          selectedCell.addClass('selected-cell');
          const modalElement = this.createModal(selectedCell.attr('id'), `Selected cell: ${selectedCell.attr('id')}`, "lorem ipsum");
          // Append modal to the body
          document.body.appendChild(modalElement);
          // Open the modal
          $(modalElement).modal('show');
        }
      }
    });
  }

  createModal(cellId, title) {
    // Create modal container
    const modal = document.createElement('div');
    modal.classList.add('modal', 'modal-blur', 'fade');
    modal.id = 'modal-simple';
    modal.tabIndex = '-1';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-hidden', 'true');

    // Create modal dialog
    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
    modalDialog.setAttribute('role', 'document');

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    // Create textarea element
    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control');
    textarea.rows = '3'; // Adjust the number of rows as needed

    // Set initial value of textarea
    textarea.value = this.comments && this.comments[cellId] ? this.comments[cellId] : '';

    modalBody.appendChild(textarea);

    // Create modal footer
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const closeButtonFooter = document.createElement('button');
    closeButtonFooter.type = 'button';
    closeButtonFooter.classList.add('btn', 'btn-danger');
    closeButtonFooter.textContent = 'Sil';
    closeButtonFooter.setAttribute('data-bs-dismiss', 'modal');

    // Event listener for "Sil" button
    closeButtonFooter.addEventListener('click', () => {
      const selectedCell = document.getElementById(cellId);
      if (selectedCell) {
        selectedCell.classList.remove('selected-cell');
        if (this.comments)
          this.comments[cellId] = '';
      }
    });

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.classList.add('btn', 'btn-primary');
    saveButton.textContent = 'Kaydet';
    saveButton.setAttribute('data-bs-dismiss', 'modal');

    // Event listener for "Kaydet" button
    saveButton.addEventListener('click', () => {
      const comments = this.comments || {}; // Ensure the comments dictionary exists
      comments[cellId] = textarea.value; // Save the content of the textarea to the comments dictionary
      this.comments = comments; // Update the comments dictionary in JTAbula class
    });

    modalFooter.appendChild(closeButtonFooter);
    modalFooter.appendChild(saveButton);

    // Append modal elements
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);

    modal.appendChild(modalDialog);

    // Return the modal element
    return modal;
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
    this.columnsPerRow = headers.length;
    headers.forEach((headerText, index) => {
      const headerCell = document.createElement("th");
      headerCell.classList.add("jt-header-cell");

      const textarea = document.createElement("textarea");
      textarea.classList.add("jt-header-textarea");
      textarea.value = headerText;
      textarea.setAttribute("disabled", "true");
      // Add event listeners for keystrokes
      this.addKeystrokeHandlers(textarea);

      //headerCell.textContent = headerText;

      // Create button for sorting
      const sortButton = document.createElement("button");
      sortButton.classList.add("jt-header-button", "btn-icon", "btn-sort");
      sortButton.textContent = '▼'; // up: ▲
      sortButton.addEventListener("click", () => {
        this.sortRows(headerCell.cellIndex);
      });

      // Container for buttons with right alignment
      const buttonContainer = document.createElement("div");
      buttonContainer.style.position = "relative"; // Set position to absolute
      buttonContainer.style.top = "100%"; // Position at the top of the cell
      buttonContainer.style.left = "100%"; // Float the container to the right
      buttonContainer.style.transform = "translate(-20px, -0px)";
      //buttonContainer.style.float = "right"; // Float the container to the right
      buttonContainer.appendChild(sortButton);
      const br = document.createElement("br");
      //headerCell.appendChild(br);
      headerCell.appendChild(buttonContainer);

      headerCell.appendChild(textarea);

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
          //const input = cell.querySelector(".jt-input-ss");
          //console.log("Cell content:", input.value);
          //columnContent.push(input.value);
          const input = cell.querySelector(".jt-input-ss");
          const textarea = cell.querySelector(".jt-textarea");
          columnContent.push((input && input.value) || (textarea && textarea.value) || "");
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
   * Set column visibility
   * @param {number} columnIndex - Index of the column.
   * @param {boolean} visible - True to make it visible, False to make it invisible.
   */
  setColumnVisibility(columnIndex, visible) {
    console.log(`setColumnVisibility for column: ${columnIndex}`);
    const table = document.getElementById(this.tableID);
    const rows = table.rows;

    // Adjust header cell visibility
    const headerCell = table.rows[0].cells[columnIndex];
    headerCell.style.display = visible ? "" : "none"; // Show or hide header cell

    // Adjust all cells in the same column in the body of the table
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cell = row.cells[columnIndex];
      if (cell) {
        cell.style.display = visible ? "" : "none"; // Show or hide cell
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

    return newCell.id;

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
        if (cellData.disabled) {
          input_ss.setAttribute("disabled", "disabled");
        }
        cell.appendChild(input);
        break;
      case "input-ss":
        const input_ss = document.createElement("input");
        input_ss.classList.add("jt-input-ss");
        input_ss.type = "text";
        input_ss.value = cellData.data;
        if (cellData.disabled) {
          input_ss.setAttribute("disabled", "disabled");
        }
        // Add event listeners for keystrokes
        this.addKeystrokeHandlers(input_ss);
        cell.appendChild(input_ss);
        break;
      case "textarea":
        const textarea = document.createElement("textarea");
        textarea.classList.add("jt-textarea");
        textarea.value = cellData.data;
        if (cellData.disabled) {
          textarea.setAttribute("disabled", "disabled");
        }
        // Add event listeners for keystrokes
        this.addKeystrokeHandlers(textarea);
        cell.appendChild(textarea);
        break;
      case "select":
        const select = document.createElement("select");
        select.classList.add("form-select", "jt-select");
        cellData.data.forEach(option => {
          const optionElem = document.createElement("option");
          //optionElem.classList.add("jt-multiselect-option");
          optionElem.value = option;
          optionElem.textContent = option;
          select.appendChild(optionElem);
        });
        select.disabled = cellData.disabled || false;
        select.addEventListener("change", () => {
          // Write cell ID and selected option to console
          console.log(`Cell ID: ${cell.id}, Selected Option: ${select.value}`);
        });
        cell.style.verticalAlign = "text-top";
        cell.appendChild(select);
        break;
      case "multiselect":
        const div = document.createElement("div");
        div.id = cell.id.replace("cell", "multiselect");
        const options = cellData.data.map((value, index) => ({
          label: value,
          value: index,
        }));
        console.log(options);
        cell.style.verticalAlign = "text-top";
        cell.appendChild(div);

        VirtualSelect.init({
          ele: `#${div.id}`,
          options: options,
          multiple: true,
          showSelectedOptionsFirst: true,
          popupDropboxBreakpoint: '3000px',
          hideClearButton: true,
        });

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
      // For resizing
      const ta = document.createElement("textarea");
      ta.classList.add("jt-textarea");
      ta.value = "";
      ta.setAttribute("disabled", "true");
      cell.appendChild(ta);
    });
  }

}