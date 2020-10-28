const init = async () => {
  // specify the columns
  var columnDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Ticker", field: "ticker" },
    { headerName: "CUSIP", field: "cusip" }
  ];

  // specify the data
  var rowData = [
    { name: "Tesla", ticker: "TSLA", cusip: "88160R101" },
    { name: "Microsoft", ticker: "MSFT", cusip: "594918104" },
    { name: "Coca-Cola", ticker: "KO", cusip: "191216100" }
  ];

  async function onSelectionChanged() {
    var selectedRows = gridOptions.api.getSelectedRows();
    if (selectedRows.length === 1) {
      console.log(
        "Selected: " +
          selectedRows[0].name +
          " ticker: " +
          selectedRows[0].ticker +
          " cusip: " +
          selectedRows[0].cusip
      );
      let result = await window.fdc3.raiseIntent("ViewNews", {
        id: { ticker: selectedRows[0].ticker, CUSIP: selectedRows[0].cusip },
        instrumentCode: selectedRows[0].ticker,
        type: "fdc3.instrument",
        name: selectedRows[0].name
      });
    }
  }

  // let the grid know which columns and what data to use
  var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    rowSelection: "single",
    onSelectionChanged: onSelectionChanged
  };

  // lookup the container we want the Grid to use
  var eGridDiv = document.querySelector("#myGrid");

  // create the grid passing in the div to use together with the columns & data we want to use
  new window.agGrid.Grid(eGridDiv, gridOptions);

  if (window.fin) {
  } else {
  }
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
