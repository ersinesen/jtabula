class JTabula {
  constructor(containerId, columnsPerRow, tableID = "customTable") {
    this.containerId = containerId;
    this.columnsPerRow = columnsPerRow;
    this.tableID = tableID;
    this.columnData = [];
  }

  setColumnData(columnData) {
    this.columnData = columnData;
  }

  createTable() {
    const container = document.getElementById(this.containerId);
    const table = document.createElement("table");
    table.classList.add("custom-table", "table", "table-borderless");
    table.id = this.tableID;

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    container.appendChild(table);
  }

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
    this.populateCell(newCell, cell);
  }

  populateCell(cell, cellData) {
    cell.type = cellData.type;
    cell.classList.add("jt-cell");
    switch (cellData.type) {
      case "text":
        cell.textContent = cellData.data;
        break;
      case "input":
        const input = document.createElement("input");
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
      default:
        cell.textContent = "Invalid cell type";
    }
  }

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

}