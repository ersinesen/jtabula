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
  appendCell(cell) {
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
    newCell.style.textAlign = cell.hAlign ? cell.hAlign : "center";
    newCell.style.verticalAlign = cell.vAlign ? cell.vAlign : "middle";
    newCell.classList.add("jt-cell");

    // fill in data
    this.populateCell(newCell, cell);
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
      case "img":
        const img = document.createElement("img");
        img.src = cellData.data;
        img.alt = "Image";
        cell.appendChild(img);
        break;
      case "chart":
        const chartDiv = document.createElement("div");
        chartDiv.id = `chart-${cell.id}`;
        cell.appendChild(chartDiv);
        this.createChart(chartDiv);
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
  createChart(div) {
    // Create a new chart
    if (window.ApexCharts) {
      let myChart = new ApexCharts(div, {
        chart: {
          type: 'bar',
        },
        series: [{
          data: [18, 28, 47, 57, 77]
        }],
        yaxis: {
          opposite: true,
        }
      })
      myChart.render();
    }
  }
}