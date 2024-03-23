# JTAbula

Javascript Table with different components using Tabler UI components.

## Usage

In header
```
<script src="https://cdn.jsdelivr.net/npm/@tabler/core@latest/dist/js/tabler.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@latest/dist/css/tabler.min.css">

<style>
  @import url("https://rsms.me/inter/inter.css");

  :root {
    --tblr-font-sans-serif: "Inter Var", -apple-system, BlinkMacSystemFont,
      San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
  }

  body {
    font-feature-settings: "cv03", "cv04", "cv11";
  }
</style>
<link href="style.css" rel="stylesheet" type="text/css" />
```

In body
```
<div id=jtabula-container></div>

<script src="jtabula.js"></script>
<script>
  // Our table
  const containerId = "jtabula-container";
  const table = new JTabula(containerId, 3);
  table.createTable();
  const cellDataList = [
    {type: "text", data: "Text Cell 1", disabled: false},
    {type: "input", data: "Input Cell", disabled: true},
    {type: "select", data: ["Option 1", "Option 2", "Option 3"], disabled: false},
    {type: "img", data: "https://via.placeholder.com/120", disabled: false},
    {type: "select", data: ["Option 11", "Option 21", "Option 31"], disabled: false},
  ];

  cellDataList.forEach(cell => {
    table.appendCell(cell);
  });
  console.log(table.getCellValue(0, 2));
  console.log(table.getCellValue(1, 0)); 
  </script>
  ```