const init = async () => {
  // specify the columns
  var columnDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Ticker", field: "ticker" },
    { headerName: "CUSIP", field: "cusip" }
  ];

  // specify the data
  var rowData = [];

  // let the grid know which columns and what data to use
  var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData
  };

  // lookup the container we want the Grid to use
  var eGridDiv = document.querySelector("#myGrid");

  // create the grid passing in the div to use together with the columns & data we want to use
  new window.agGrid.Grid(eGridDiv, gridOptions);

  if (window.fin && window.fdc3) {
    window.fdc3.addIntentListener("ViewNews", async (ctx) => {
      console.log("Received fdc3 context: " + JSON.stringify(ctx));
      if (ctx.type === "fdc3.instrument") {
        rowData.push({
          name: ctx.name,
          ticker: ctx.id.ticker,
          cusip: ctx.id.CUSIP
        });
        gridOptions.api.setRowData(rowData);
      }
    });
  } else {
  }
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
