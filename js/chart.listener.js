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

  function updateRow(data) {
    rowData.push(data);
    gridOptions.api.setRowData(rowData);
  }

  const initOpenFinParamListener = () => {
    const updateGrid = (options) => {
      console.log("Received the following: " + JSON.stringify(options));
      if (options.ticker !== undefined) {
        let result = {};
        result.name = options.ticker;
        result.id = {
          ticker: options.ticker
        };

        updateRow(result);
      }
    };

    window.fin.desktop.main((userAppConfigArgs) => {
      updateGrid(userAppConfigArgs);
    });

    let app = window.fin.Application.getCurrentSync();
    // If app is already running parameters are passed through the “run-requested” event
    app.addListener("run-requested", function (event) {
      if (event.userAppConfigArgs) {
        updateGrid(event.userAppConfigArgs);
      }
    });
  };

  initOpenFinParamListener();

  if (window.fin && window.fdc3) {
    window.fdc3.addIntentListener("ViewChart", async (ctx) => {
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
