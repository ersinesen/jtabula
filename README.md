# JTAbula

Javascript Table with different components using Tabler UI components.

![A sample](jtabula.png)

## Usage

In header
```
<script src="https://cdn.jsdelivr.net/npm/@tabler/core@latest/dist/js/tabler.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

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
<link href="jtabula.css" rel="stylesheet" type="text/css" />
```

In body
```
<div id="jtabula-container"></div>

<script src="jtabula.js"></script>
<script>
  // Create table
    document.addEventListener("DOMContentLoaded", function () {
      const containerId = "jtabula-container";
      const table = new JTabula(containerId, 3);
      table.createTable();
      const cellDataList = [
        {type: "chart"},
        {type: "youtube", data: "https://www.youtube.com/embed/R2DU85qLfJQ"},
        {type: "video", data: "gonul5.mp4"},
        {type: "img", data: "https://via.placeholder.com/120"},
        {type: "img", data: "https://via.placeholder.com/150"},
        {type: "img", data: "https://via.placeholder.com/180"},
        {type: "text", data: "Text Cell 1"},
        {type: "radio", data: ["Option 1", "Option 2", "Option 3"]},
        {type: "checkbox", data: ["Option 1", "Option 2", "Option 3"]},
        {type: "input", data: "Input Cell", disabled: true},
        {type: "input", data: "Input"},
        {type: "select", data: ["Option 1", "Option 2", "Option 3"], hAlign: "right"},
        {type: "html", data: '<a href="#" class="btn btn-ghost-primary active w-100">Button</a>'},
      ];

      table.setCellDimensions("240px", "180px");
      cellDataList.forEach(cell => {
        table.appendCell(cell);
      });
      console.log(table.getCellValue(1, 0));
    });
</script>
  ```

  ## License

  ```
  * MIT License
   *
   * Copyright 2024 Ersin Esen
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```