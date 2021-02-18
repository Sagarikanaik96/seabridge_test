proposalTable = {
  initdataTable: function () {
    let elementArray = [
      {
        id: "open-proposal_title",
        title: "Buyer",
        number: 4,
        className: "col-md-2 open-proposal_select",
      },
      {
        id: "open-proposal_property",
        title: "Property Type",
        number: 5,
        className: "col-md-2 open-proposal_select",
      },
      {
        id: "open-proposal_locality",
        title: "Cluster",
        number: 6,
        className: "col-md-2 open-proposal_select",
      },
      {
        id: "open-proposal_pending",
        title: "Pending With",
        number: 8,
        className: "col-md-2 open-proposal_select",
      },
    ];

    let dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "propnewproposal",
      },
      columns: [
        {
          data: "prop",
        },
        {
          data: "rfp",
        },
        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [7],
    };
    buttonElements = {
      id: "open-proposal_reset",
      filterId: "#open-proposal_filter",
      className: "open-proposal_reset",
      select: "open-proposal_select",
    };

    createDataTables.createTable(
      "#open-proposal",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "closed-proposal_title",
        title: "Buyer",
        number: 4,
        className: "col-md-2 closed-proposal_select",
      },
      {
        id: "closed-proposal_property",
        title: "Property Type",
        number: 5,
        className: "col-md-2 closed-proposal_select",
      },
      {
        id: "closed-proposal_locality",
        title: "Cluster",
        number: 6,
        className: "col-md-2 closed-proposal_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "propacceptedproposal",
      },
      columns: [
        {
          data: "prop",
        },
        {
          data: "rfp",
        },
        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "po",
        },

        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [7],
    };
    buttonElements = {
      id: "closed-proposal_reset",
      filterId: "#closed-proposal_filter",
      className: "closed-proposal_reset",
      select: "closed-proposal_select",
    };

    createDataTables.createTable(
      "#closed-proposal",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "rejected-proposal_title",
        title: "Buyer",
        number: 4,
        className: "col-md-2 rejected-proposal_select",
      },
      {
        id: "rejected-proposal_property",
        title: "Property Type",
        number: 5,
        className: "col-md-2 rejected-proposal_select",
      },
      {
        id: "rejected-proposal_locality",
        title: "Cluster",
        number: 6,
        className: "col-md-2 rejected-proposal_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "proprejectedproposal",
      },
      columns: [
        {
          data: "prop",
        },
        {
          data: "rfp",
        },
        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
            class="btn btn-simple btn-warning btn-icon edit"><i
                class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [7],
    };
    buttonElements = {
      id: "rejected-proposal_reset",
      filterId: "#rejected-proposal_filter",
      className: "rejected-proposal_reset",
      select: "rejected-proposal_select",
    };

    createDataTables.createTable(
      "#rejected-proposal",
      dataSet,
      elementArray,
      buttonElements
    );
  },
};

agencydashboard = {
  initSelect: function () {
    var initChart = this.initChart;
    $("#change_category").change(function () {
      //$('#buyer_performence').show()
      $("#changeTitle").html(this.value);
    });
  },

  initdataTable: function () {
    buttonElements = {
      id: "analysis_table_reset",
      filterId: "#analysis_table_filter",
      className: "analysis_table_reset",
      select: "analysis_table_select",
    };
    let elementArray = [
      {
        id: "analysis_table_title",
        title: "Seller",
        number: 0,
        className: "col-md-3 analysis_table_select",
      },
      {
        id: "analysis_table_property",
        title: "Property",
        number: 1,
        className: "col-md-3 analysis_table_select",
      },
    ];
    let dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "vendoranalysis",
      },
      rowsGroup: [0],
      columnDefs: [
        {
          targets: ["_all"],
          className: "text-center",
        },
        {
          targets: [3, 4],
          className: "text-right",
        },
      ],
      columns: [
        {
          data: "seller",
        },
        {
          data: "buyer",
        },
        {
          data: "unit",
        },
        {
          data: "contractvalue",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "perunit",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
      ],
      valueRow: [3, 4],
    };

    // $('#analysis_table').DataTable({
    //     //sDom: 'lrtip',
    //     "pagingType": "full_numbers",
    //     "lengthMenu": [
    //         [10, 25, 50, -1],
    //         [10, 25, 50, "All"]
    //     ],
    //     language: {
    //         search: "_INPUT_",
    //         searchPlaceholder: "Search records",
    //         sLengthMenu: "Number of entries _MENU_",
    //     },
    //     responsive: true,
    //     rowsGroup: [0],

    //     order: [
    //         [4, 'desc']
    //     ],

    //     initComplete: function () {
    //         api = this.api()

    //         createDataTables.createFilters(buttonElements.filterId, filterObject)
    //         createDataTables.createResetButton(buttonElements)
    //         createDataTables.createFiltersOptions(filterObject, api);
    //         createDataTables.createResetButtonAction(buttonElements.className, buttonElements.select, filterObject, api)

    //     }

    // });
    createDataTables.createTable(
      "#analysis_table",
      dataSet,
      elementArray,
      buttonElements
    );
    elementArray = [
      {
        id: "invoicestable_title",
        title: "Property",
        number: 0,
        className: "col-md-3 invoicestable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "buyerinvoice",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: null,
          render: function (data, type, row) {
            return (
              data["wip"] +
              data["pendinginv"] +
              data["pendingapproval"] +
              data["pendingpay"]
            );
          },
        },
        {
          data: "wip",
        },
        {
          data: "pendinginv",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },
        {
          data: "pendingapproval",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },

        {
          data: "pendingpay",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="/dashboard/agency/proposal.php#${row["buyer"]}" target='_blank'
            class="btn btn-warning btn-icon edit">View Details</a>`;
          },
        },
      ],

      valueRow: [0],
      colorCol: [3, 4, 5],
    };
    buttonElements = {
      id: "invoicestable_reset",
      filterId: "#invoicestable_filter",
      className: "invoicestable_reset",
      select: "invoicestable_select",
    };

    createDataTables.createTable(
      "#invoicestable",
      dataSet,
      elementArray,
      buttonElements
    );
    elementArray = [
      {
        id: "invoicevaluetable_title",
        title: "Property",
        number: 0,
        className: "col-md-3 invoicevaluetable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "buyerinvoicevalue",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: null,
          render: function (data, type, row) {
            return (
              data["wip"] +
              data["pendinginv"] +
              data["pendingapproval"] +
              data["pendingpay"]
            )
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "wip",
          render: function (data, typedata) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pendinginv",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pendingapproval",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },

        {
          data: "pendingpay",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="/dashboard/agency/proposal.php#${row["buyer"]}" target='_blank'
            class="btn btn-warning btn-icon edit">View Details</a>`;
          },
        },
      ],
      valueRow: [1, 2, 3, 4, 5],
    };
    buttonElements = {
      id: "invoicevaluetable_reset",
      filterId: "#invoicevaluetable_filter",
      className: "invoicevaluetable_reset",
      select: "invoicevaluetable_select",
    };

    createDataTables.createTable(
      "#invoicevaluetable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "invoicedaystable_title",
        title: "Seller",
        number: 0,
        className: "col-md-3 invoicedaystable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "buyerinvoicedays",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: "inv",
        },
        {
          data: "amount",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "wip",
        },
        {
          data: "pendinginv",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },
        {
          data: "pendingapproval",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },

        {
          data: "pendingpay",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },
      ],
      valueRow: [2],
    };
    buttonElements = {
      id: "invoicedaystable_reset",
      filterId: "#invoicedaystable_filter",
      className: "invoicedaystable_reset",
      select: "invoicedaystable_select",
    };

    table = createDataTables.createTable(
      "#invoicedaystable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "propertytable_title",
        title: "Property",
        number: 0,
        className: "col-md-3 propertytable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "buyerproperty",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: "cw",
        },
        {
          data: "amount",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },

        {
          data: "renewal",
          render: function (data, type, row) {
            if (data) {
              return moment(data, "DD-MM-YY").format("DD-MMM-YY");
            } else return data;
          },
        },

        {
          data: null,
          render: function (data, type, row) {
            // init();
            return `<button 
            class="btn btn-warning btn-icon spend_Analysis" data-title='${row["buyer"]}'>View Spend Analysis</button>`;
          },
        },
      ],
      valueRow: [2],
      fun: init(),
    };
    buttonElements = {
      id: "propertytable_reset",
      filterId: "#propertytable_filter",
      className: "propertytable_reset",
      select: "propertytable_select",
    };

    createDataTables.createTable(
      "#propertytable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "saleTable_title",
        title: "Property",
        number: 0,
        className: "col-md-2 saleTable_select",
      },
      {
        id: "saleTable_property",
        title: "Property Type",
        number: 1,
        className: "col-md-2 saleTable_select",
      },
      {
        id: "saleTable_locality",
        title: "Cluster",
        number: 2,
        className: "col-md-2 saleTable_select",
      },
      {
        id: "saleTable_seller",
        title: "Seller",
        number: 3,
        className: "col-md-2 saleTable_select",
      },
      {
        id: "saleTable_pending",
        title: "Pending With",
        number: 8,
        className: "col-md-2 saleTable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "agencysellerpurchase",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "seller",
        },
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },

        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-primary btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                            class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [7],
    };
    buttonElements = {
      id: "saleTable_reset",
      filterId: "#saleTable_filter",
      className: "saleTable_reset",
      select: "saleTable_select",
    };

    createDataTables.createTable(
      "#saleTable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "proposalTable_title",
        title: "Property",
        number: 0,
        className: "col-md-2 proposalTable_select",
      },
      {
        id: "proposalTable_property",
        title: "Property Type",
        number: 1,
        className: "col-md-2 proposalTable_select",
      },
      {
        id: "proposalTable_locality",
        title: "Cluster",
        number: 2,
        className: "col-md-2 proposalTable_select",
      },
      {
        id: "proposalTable_seller",
        title: "Seller",
        number: 3,
        className: "col-md-2 proposalTable_select",
      },
      {
        id: "proposalTable_pending",
        title: "Pending With",
        number: 8,
        className: "col-md-2 proposalTable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "agencysellerrfps",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "seller",
        },
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },

        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            cls = "";
            if (data === "Approved") cls = "btn-primary";
            else cls = "btn-warning";
            return `<button
                class="btn ${cls} btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                        class="btn btn-simple btn-warning btn-icon edit"><i
                class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [7],
    };
    buttonElements = {
      id: "proposalTable_reset",
      filterId: "#proposalTable_filter",
      className: "proposalTable_reset",
      select: "proposalTable_select",
    };

    createDataTables.createTable(
      "#proposalTable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "salecontactTable_title",
        title: "Property",
        number: 0,
        className: "col-md-2 salecontactTable_select",
      },
      {
        id: "salecontactTable_property",
        title: "Property Type",
        number: 1,
        className: "col-md-2 salecontactTable_select",
      },
      {
        id: "salecontactTable_locality",
        title: "Cluster",
        number: 2,
        className: "col-md-2 salecontactTable_select",
      },
      {
        id: "salecontactTable_seller",
        title: "Seller",
        number: 3,
        className: "col-md-2 salecontactTable_select",
      },
      {
        id: "salecontactTable_pending",
        title: "Pending With",
        number: 8,
        className: "col-md-2 salecontactTable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "agencysellercontract",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "seller",
        },
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },

        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
            class="btn btn-warning btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                    class="btn btn-simple btn-warning btn-icon edit"><i
            class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [7],
    };
    buttonElements = {
      id: "salecontactTable_reset",
      filterId: "#salecontactTable_filter",
      className: "salecontactTable_reset",
      select: "salecontactTable_select",
    };

    createDataTables.createTable(
      "#salecontactTable",
      dataSet,
      elementArray,
      buttonElements
    );

    var salepurchase = $("#salepurchasingTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],

      columnDefs: [
        {
          className: "text-right",
          targets: [4, 7],
        },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      initComplete: function () {
        var elementArray = [
          {
            id: "salepurchasingTable_title",
            title: "Property",
          },
          {
            id: "salepurchasingTable_property",
            title: "Property Type",
          },
          {
            id: "salepurchasingTable_locality",
            title: "Cluster",
          },
          {
            id: "salepurchasingTable_seller",
            title: "Seller",
          },
          {
            id: "salepurchasingTable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "salepurchasingTable_reset",
          filterId: "#salepurchasingTable_filter",
        }),
          addFilters(
            "#salepurchasingTable_filter",
            "salepurchasingTable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#salepurchasingTable_title");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#salepurchasingTable_property");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#salepurchasingTable_locality");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#salepurchasingTable_seller");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 8) {
              addFilterData(column, "#salepurchasingTable_pending");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
          });
      },
    });

    var saleinvoice = $("#saleinvoicetable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      columnDefs: [
        {
          className: "text-right",
          targets: [6],
        },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      initComplete: function () {
        var elementArray = [
          {
            id: "saleinvoicetable_title",
            title: "Property",
          },
          {
            id: "saleinvoicetable_property",
            title: "Property Type",
          },
          {
            id: "saleinvoicetable_locality",
            title: "Cluster",
          },
          {
            id: "saleinvoicetable_seller",
            title: "Seller",
          },
          {
            id: "saleinvoicetable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "saleinvoicetable_reset",
          filterId: "#saleinvoicetable_filter",
        }),
          addFilters(
            "#saleinvoicetable_filter",
            "saleinvoicetable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#saleinvoicetable_title");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#saleinvoicetable_property");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#saleinvoicetable_locality");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#saleinvoicetable_seller");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 7) {
              addFilterData(column, "#saleinvoicetable_pending");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
          });
      },
    });
  },

  initChart: function () {
    let efficiencyChartDetails = {
      graphId: "#efficiencychart",
      numberOfBars: 3,
      barLabels: ["Invoice", "Approval", "Payment"],
      chartType: "horizontalBar",
      labelsType: "month",
      dataLabels: [
        "Meadows Condo",
        "Highland Condo",
        "Parkland Condo",
        "Horizon Condo",
        "East Condo",
        "Gems Condo",
        "EC Condo",
        "Amber Condo",
        "Napier Condo",
      ],
      colorcode: ["yellow", "#F3BB45", "#7AC29A"],
      data: [
        [2, 1, 3, 5, 4, 2, 5, 4, 2],
        [2, 1, 3, 3, 4, 5, 3, 4, 5],
        [5, 1, 1, 2, 3, 5, 2, 3, 5],
      ],
      range: {
        max: 10,
        min: 0,
      },
      //stack:[1,1,1]
    };
    efficiencyChartOptions = {
      onClick: (evt, item) => {
        if (!$.isEmptyObject(item)) {
          let index = item[0]["_index"];
          let name = item[0]["_chart"].data.labels[index];
          window.open(`/dashboard/agency/proposal.php#${name}`, "_blank");
          //     $('#table_drill').fadeOut("slow");
          //
          //
          //
          //
          //
          //     let name = item[0]["_chart"].data.labels[index];
          //     let inv = item[0]["_chart"].data.datasets[0].data[index]
          //     let app = item[0]["_chart"].data.datasets[1].data[index]
          //     let pay = item[0]["_chart"].data.datasets[2].data[index]
          //     invarr = tableData(inv * 3)
          //     apparr = tableData(app * 3)
          //     payarr = tableData(pay * 3)
          //     $('.inv').each(function (d) {
          //         $(this).html(invarr[d])
          //     })
          //     $('.app').each(function (d) {
          //         $(this).html(apparr[d])
          //     })
          //     $('.pay').each(function (d) {
          //         $(this).html(payarr[d])
          //     })
          //     $('#vendor_id').html("Efficiency Analysis  For " + name)
          //     $('#table_drill').fadeIn("slow");
          //     $('html,body').animate({
          //             scrollTop: $("#table_drill").offset().top
          //         },
          //         'slow');
        }
      },

      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },

            ticks: {},
          },
        ],
        xAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },
            ticks: {
              min: 0,
              max: 60,
            },
          },
        ],
      },
      tooltips: {
        enabled: true,
        mode: "label",
        callbacks: {
          title: function (tooltipItems, data) {
            var idx = tooltipItems[0].index;
            return "Title:" + data.labels[idx]; //do something with title
          },
          afterTitle: function () {
            window.total = 0;
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var valor =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            window.total += valor;
            var total = 0;
            return label + ":" + valor;
          },
          footer: function () {
            return "TOTAL: " + window.total + "\n click on bar to get details";
          },
        },
      },
      plugins: {
        datalabels: {
          display: true,

          formatter: (value, ctx) => {
            let datasets = ctx.chart.data.datasets.filter((ds) => {
              return !ds._meta[0].hidden;
            });

            if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
              let sum = 0;
              obj = {};
              datasets.map((dataset) => {
                sum += dataset.data[ctx.dataIndex];
              });
              return "Total:" + sum;
            } else {
              return "";
            }
          },
          anchor: "end",
          align: "end",
        },
      },
    };

    let efficiencyChart = createChartObject.createGraph(
      efficiencyChartDetails,
      efficiencyChartOptions
    );

    let spendVendorChartDetails = {
      graphId: "#spendsellerchart",
      numberOfBars: 3,
      barLabels: ["Current Period", "Last Period", "Last Year Current Month"],
      chartType: "horizontalBar",
      labelsType: "month",
      dataLabels: [
        "Supersafe Security",
        "Teck Seng Landscaping",
        "JM Cleaning Services",
        "CT Contractors",
        "PT Technician",
      ],
    };

    spendChartOptions = {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                if (value.length > 10) {
                  return value.substr(0, 10) + "..."; //truncate
                } else {
                  return value;
                }
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
          },
        ],
      },
      tooltips: {
        enabled: true,
        mode: "label",
        callbacks: {
          title: function (tooltipItems, data) {
            var idx = tooltipItems[0].index;
            return "Title:" + data.labels[idx]; //do something with title
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    };
    let spendByVendor = createChartObject.createGraph(
      spendVendorChartDetails,
      spendChartOptions
    );

    $(".spendSellerChangeGraph").click(function (e) {
      spendVendorChartDetails.labelsType = $(this).data("type");
      (spendVendorChartDetails.barLabels = [
        $(this).data("label"),
        "Last Period",
        "Last Year " + $(this).data("label"),
      ]),
        (spendByVendor = createChartObject.updateChart(
          e,
          this,
          spendByVendor,
          ".spendSellerChangeGraph",
          spendVendorChartDetails,
          spendChartOptions
        ));
    });

    spendChartCatelogyOptions = {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                if (value.length > 10) {
                  return value.substr(0, 10) + "..."; //truncate
                } else {
                  return value;
                }
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
          },
        ],
      },
      tooltips: {
        enabled: true,
        mode: "label",
        callbacks: {
          title: function (tooltipItems, data) {
            var idx = tooltipItems[0].index;
            return "Title:" + data.labels[idx]; //do something with title
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    };

    let spendCategoryChartDetails = {
      graphId: "#spendCategoryChart",
      numberOfBars: 3,
      barLabels: ["Current Period", "Last Period", "Last Year Current Month"],
      chartType: "horizontalBar",
      labelsType: "month",
      dataLabels: [
        "Security Maintenance",
        "Landscaping",
        "Cleaning Maintenance",
        "Pool Maintenance",
        "Lift Maintenance",
      ],
    };

    let spendByCategory = createChartObject.createGraph(
      spendCategoryChartDetails,
      spendChartCatelogyOptions
    );

    $(".spendCategoryChangeGraph").click(function (e) {
      spendCategoryChartDetails.labelsType = $(this).data("type");
      (spendCategoryChartDetails.barLabels = [
        $(this).data("label"),
        "Last Period",
        "Last Year " + $(this).data("label"),
      ]),
        (spendByCategory = createChartObject.updateChart(
          e,
          this,
          spendByCategory,
          ".spendCategoryChangeGraph",
          spendCategoryChartDetails,
          spendChartCatelogyOptions
        ));
    });
  },
};
// $("#changedisplay").change(function () {
//     $('#vendor_id').html("Efficiency Analysis of " +this.value)
//             $('#table_drill').show();
//     $('html,body').animate({
//                     scrollTop: $("#table_drill").offset().top},
//                     'slow');

// })
init = function () {
  $(".spend_Analysis").click(function (e) {
    e.preventDefault();
    $("#spendsection").fadeOut("slow");
    $("#spendtitle").html("Spend Analysis For " + $(this).data("title"));
    $("#spendsection").fadeIn("slow");
    $(this).blur();
    $("html,body").animate(
      {
        scrollTop: $("#spendsection").offset().top,
      },
      "slow"
    );
  });
};

agencydashboard_backup = {
  initSelect: function () {
    var initChart = this.initChart;
    $("#choose_buyer").change(function () {
      $("#buyer_performence").show();
      buyerdashboard.initChart();
    });
    $("#choose_seller").change(function () {
      $("#seller_performance").show();
      initChart();
    });
  },

  initdataTable: function () {
    var paymenttable = $("#paymenttable").DataTable({
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        // search: "_INPUT_",
        //searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      columnDefs: [
        {
          className: "text-right",
          targets: [7],
        },
      ],
      initComplete: function () {
        var elementArray = [
          {
            id: "payment_title",
            title: "Buyer",
          },
          {
            id: "payment_property",
            title: "Property",
          },
          {
            id: "payment_locality",
            title: "Cluster",
          },
          {
            id: "payment_seller",
            title: "Seller",
          },
          {
            id: "payment_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "payment_reset",
          filterId: "#paymenttable_filter",
        }),
          addFilters("#paymenttable_filter", "payment_select", elementArray);

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#payment_title");
              addResetFunction(column, "#payment_reset", ".payment_select");
            }
            if (val === 1) {
              addFilterData(column, "#payment_property");
              addResetFunction(column, "#payment_reset", ".payment_select");
            }
            if (val === 2) {
              addFilterData(column, "#payment_locality");
              addResetFunction(column, "#payment_reset", ".payment_select");
            }
            if (val === 3) {
              addFilterData(column, "#payment_seller");
              addResetFunction(column, "#payment_reset", ".payment_select");
            }
            if (val === 8) {
              addFilterData(column, "#payment_pending");
              addResetFunction(column, "#payment_reset", ".payment_select");
            }
          });
      },
    });
    // $("#payment_reset").click(function () {

    //     paymenttable.search('').draw();
    //     $(this).blur();

    // });

    var purchase = $("#rfpTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      columnDefs: [
        {
          className: "text-right",
          targets: [7],
        },
      ],

      initComplete: function () {
        var elementArray = [
          {
            id: "rfpTable_title",
            title: "Buyer",
          },
          {
            id: "rfpTable_property",
            title: "Property",
          },
          {
            id: "rfpTable_locality",
            title: "Cluster",
          },
          {
            id: "rfpTable_seller",
            title: "Seller",
          },
          {
            id: "rfpTable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "rfpTable_reset",
          filterId: "#rfpTable_filter",
        }),
          addFilters("#rfpTable_filter", "rfpTable_select", elementArray);

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#rfpTable_title");
              addResetFunction(column, "#rfpTable_reset", ".rfpTable_select");
            }
            if (val === 1) {
              addFilterData(column, "#rfpTable_property");
              addResetFunction(column, "#rfpTable_reset", ".rfpTable_select");
            }
            if (val === 2) {
              addFilterData(column, "#rfpTable_locality");
              addResetFunction(column, "#rfpTable_reset", ".rfpTable_select");
            }
            if (val === 3) {
              addFilterData(column, "#rfpTable_seller");
              addResetFunction(column, "#rfpTable_reset", ".rfpTable_select");
            }
            if (val === 8) {
              addFilterData(column, "#rfpTable_pending");
              addResetFunction(column, "#rfpTable_reset", ".rfpTable_select");
            }
          });
      },
    });

    var invoice = $("#invoicetable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      columnDefs: [
        {
          className: "text-right",
          targets: [7],
        },
      ],
      initComplete: function () {
        var elementArray = [
          {
            id: "invoicetable_title",
            title: "Buyer",
          },
          {
            id: "invoicetable_property",
            title: "Property",
          },
          {
            id: "invoicetable_locality",
            title: "Cluster",
          },
          {
            id: "invoicetable_seller",
            title: "Seller",
          },
          {
            id: "invoicetable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "invoicetable_reset",
          filterId: "#invoicetable_filter",
        }),
          addFilters(
            "#invoicetable_filter",
            "invoicetable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#invoicetable_title");
              addResetFunction(
                column,
                "#invoicetable_reset",
                ".invoicetable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#invoicetable_property");
              addResetFunction(
                column,
                "#invoicetable_reset",
                ".invoicetable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#invoicetable_locality");
              addResetFunction(
                column,
                "#invoicetable_reset",
                ".invoicetable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#invoicetable_seller");
              addResetFunction(
                column,
                "#invoicetable_reset",
                ".invoicetable_select"
              );
            }
            if (val === 8) {
              addFilterData(column, "#invoicetable_pending");
              addResetFunction(
                column,
                "#invoicetable_reset",
                ".invoicetable_select"
              );
            }
          });
      },
    });
    // $("#invoicetable_reset").click(function () {

    //     invoice.search('').draw();
    //     $(this).blur();

    // });

    var saleinvoice = $("#saleinvoicetable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      columnDefs: [
        {
          className: "text-right",
          targets: [6],
        },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      initComplete: function () {
        var elementArray = [
          {
            id: "saleinvoicetable_title",
            title: "Buyer",
          },
          {
            id: "saleinvoicetable_property",
            title: "Property",
          },
          {
            id: "saleinvoicetable_locality",
            title: "Cluster",
          },
          {
            id: "saleinvoicetable_seller",
            title: "Seller",
          },
          {
            id: "saleinvoicetable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "saleinvoicetable_reset",
          filterId: "#saleinvoicetable_filter",
        }),
          addFilters(
            "#saleinvoicetable_filter",
            "saleinvoicetable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#saleinvoicetable_title");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#saleinvoicetable_property");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#saleinvoicetable_locality");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#saleinvoicetable_seller");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
            if (val === 8) {
              addFilterData(column, "#saleinvoicetable_pending");
              addResetFunction(
                column,
                "#saleinvoicetable_reset",
                ".saleinvoicetable_select"
              );
            }
          });
      },
    });
    // $("#saleinvoicetable_reset").click(function () {

    //     saleinvoice.search('').draw();
    //     $(this).blur();

    // });
    var purchase = $("#purchasingTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      columnDefs: [
        {
          className: "text-right",
          targets: [4, 7],
        },
      ],

      initComplete: function () {
        var elementArray = [
          {
            id: "purchasingTable_title",
            title: "Buyer",
          },
          {
            id: "purchasingTable_property",
            title: "Property",
          },
          {
            id: "purchasingTable_locality",
            title: "Cluster",
          },
          {
            id: "purchasingTable_seller",
            title: "Seller",
          },
          {
            id: "purchasingTable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "purchasingTable_reset",
          filterId: "#purchasingTable_filter",
        }),
          addFilters(
            "#purchasingTable_filter",
            "purchasingTable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#purchasingTable_title");
              addResetFunction(
                column,
                "#purchasingTable_reset",
                ".purchasingTable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#purchasingTable_property");
              addResetFunction(
                column,
                "#purchasingTable_reset",
                ".purchasingTable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#purchasingTable_locality");
              addResetFunction(
                column,
                "#purchasingTable_reset",
                ".purchasingTable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#purchasingTable_seller");
              addResetFunction(
                column,
                "#purchasingTable_reset",
                ".purchasingTable_select"
              );
            }
            if (val === 8) {
              addFilterData(column, "#purchasingTable_pending");
              addResetFunction(
                column,
                "#purchasingTable_reset",
                ".purchasingTable_select"
              );
            }
          });
      },
    });
    $("#purchasingTable_reset").click(function () {
      purchase.search("").draw();
      $(this).blur();
    });

    var salepurchase = $("#salepurchasingTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],

      columnDefs: [
        {
          className: "text-right",
          targets: [4, 7],
        },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      initComplete: function () {
        var elementArray = [
          {
            id: "salepurchasingTable_title",
            title: "Buyer",
          },
          {
            id: "salepurchasingTable_property",
            title: "Property",
          },
          {
            id: "salepurchasingTable_locality",
            title: "Cluster",
          },
          {
            id: "salepurchasingTable_seller",
            title: "Seller",
          },
          {
            id: "salepurchasingTable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "salepurchasingTable_reset",
          filterId: "#salepurchasingTable_filter",
        }),
          addFilters(
            "#salepurchasingTable_filter",
            "salepurchasingTable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#salepurchasingTable_title");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#salepurchasingTable_property");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#salepurchasingTable_locality");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#salepurchasingTable_seller");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
            if (val === 8) {
              addFilterData(column, "#salepurchasingTable_pending");
              addResetFunction(
                column,
                "#salepurchasingTable_reset",
                ".salepurchasingTable_select"
              );
            }
          });
      },
    });
    $("#salepurchasingTable_reset").click(function () {
      salepurchase.search("").draw();
      $(this).blur();
    });

    var contract = $("#contactTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      columnDefs: [
        {
          className: "text-right",
          targets: [8],
        },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },

      initComplete: function () {
        var elementArray = [
          {
            id: "contactTable_title",
            title: "Buyer",
          },
          {
            id: "contactTable_property",
            title: "Property",
          },
          {
            id: "contactTable_locality",
            title: "Cluster",
          },
          {
            id: "contactTable_seller",
            title: "Seller",
          },
          {
            id: "contactTable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "contactTable_reset",
          filterId: "#contactTable_filter",
        }),
          addFilters(
            "#contactTable_filter",
            "contactTable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#contactTable_title");
              addResetFunction(
                column,
                "#contactTable_reset",
                ".contactTable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#contactTable_property");
              addResetFunction(
                column,
                "#contactTable_reset",
                ".contactTable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#contactTable_locality");
              addResetFunction(
                column,
                "#contactTable_reset",
                ".contactTable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#contactTable_seller");
              addResetFunction(
                column,
                "#contactTable_reset",
                ".contactTable_select"
              );
            }
            if (val === 9) {
              addFilterData(column, "#contactTable_pending");
              addResetFunction(
                column,
                "#contactTable_reset",
                ".contactTable_select"
              );
            }
          });
      },
    });

    $("#contactTable_reset").click(function () {
      contract.search("").draw();
      $(this).blur();
    });

    var salecontact = $("#salecontactTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      columnDefs: [
        {
          className: "text-right",
          targets: [7],
        },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },

      initComplete: function () {
        var elementArray = [
          {
            id: "salecontactTable_title",
            title: "Buyer",
          },
          {
            id: "salecontactTable_property",
            title: "Property",
          },
          {
            id: "salecontactTable_locality",
            title: "Cluster",
          },
          {
            id: "salecontactTable_seller",
            title: "Seller",
          },
          {
            id: "salecontactTable_pending",
            title: "Pending",
          },
        ];
        (buttonElements = {
          id: "salecontactTable_reset",
          filterId: "#salecontactTable_filter",
        }),
          addFilters(
            "#salecontactTable_filter",
            "salecontactTable_select",
            elementArray
          );

        addReset(buttonElements);
        this.api()
          .columns()
          .every(function (val) {
            var column = this;

            if (val === 0) {
              addFilterData(column, "#salecontactTable_title");
              addResetFunction(
                column,
                "#salecontactTable_reset",
                ".salecontactTable_select"
              );
            }
            if (val === 1) {
              addFilterData(column, "#salecontactTable_property");
              addResetFunction(
                column,
                "#salecontactTable_reset",
                ".salecontactTable_select"
              );
            }
            if (val === 2) {
              addFilterData(column, "#salecontactTable_locality");
              addResetFunction(
                column,
                "#salecontactTable_reset",
                ".salecontactTable_select"
              );
            }
            if (val === 3) {
              addFilterData(column, "#salecontactTable_seller");
              addResetFunction(
                column,
                "#salecontactTable_reset",
                ".salecontactTable_select"
              );
            }
            if (val === 8) {
              addFilterData(column, "#salecontactTable_pending");
              addResetFunction(
                column,
                "#salecontactTable_reset",
                ".salecontactTable_select"
              );
            }
          });
      },
    });

    $("#salecontactTable_reset").click(function () {
      salecontact.search("").draw();
      $(this).blur();
    });

    var requist = $("#requisitingTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      columnDefs: [
        {
          className: "text-right",
          targets: [6],
        },
      ],

      initComplete: function () {
        $("#requisitingTable_filter").append(
          '<select id="requisitingTable_buyer" class="col-md-2 selectpicker requisitingTable_select"' +
            'data-live-search="true" title="Buyer"></select>' +
            '<select id="requisitingTable_property" class="col-md-2 selectpicker requisitingTable_select"' +
            'data-live-search="true" title="Property Type" ></select>' +
            '<select id="requisitingTable_locality" class="col-md-2 selectpicker requisitingTable_select"' +
            'data-live-search="true" title="Cluster"></select>' +
            '<select class="col-md-2 selectpicker requisitingTable_select"' +
            'id="requisitingTable_pending" title="Pending With"></select>' +
            '<button type="button" id="requisitingTable_reset" class="btn btn-warning reset">' +
            '<span class="btn-label" data-table="paymenttable">' +
            "</span>Reset</button>"
        ),
          {
            data: status,
          };

        this.api()
          .columns()
          .every(function (val) {
            var column = this;
            if (val === 0) {
              $("#requisitingTable_buyer").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requisitingTable_buyer").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requisitingTable_buyer").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requisitingTable_buyer").selectpicker("refresh");
            }
            if (val === 1) {
              $("#requisitingTable_property").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requisitingTable_property").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requisitingTable_property").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requisitingTable_property").selectpicker("refresh");
            }
            if (val === 2) {
              $("#requisitingTable_locality").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requisitingTable_locality").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requisitingTable_locality").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requisitingTable_locality").selectpicker("refresh");
            }
            if (val === 7) {
              $("#requisitingTable_pending").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requisitingTable_pending").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requisitingTable_pending").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requisitingTable_pending").selectpicker("refresh");
            }

            $("#requisitingTable_reset").click(function () {
              $(".requisitingTable_select").val("");
              $(".requisitingTable_select").selectpicker("refresh");
              column.search("").draw();
            });
          });
      },
    });

    $("#requisitingTable_reset").click(function () {
      requist.search("").draw();
      $(this).blur();
    });

    var re = $("#requestingTable").DataTable({
      // sDom: 'flrtip',
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      columnDefs: [
        {
          className: "text-right",
          targets: [6],
        },
      ],
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },

      initComplete: function () {
        $("#requestingTable_filter").append(
          '<select id="requestingTable_buyer" class="col-md-2 selectpicker requestingTable_select"' +
            'data-live-search="true" title="Buyer"></select>' +
            '<select id="requestingTable_property" class="col-md-2 selectpicker requestingTable_select"' +
            'data-live-search="true" title="Property Type" ></select>' +
            '<select id="requestingTable_locality" class="col-md-2 selectpicker requestingTable_select"' +
            'data-live-search="true" title="Cluster"></select>' +
            '<select class="col-md-2 selectpicker requestingTable_select"' +
            'id="requestingTable_pending"  data-live-search="true" title="Pending With"></select>' +
            '<button type="button"  id="requestingTable_reset" class="btn btn-warning reset">' +
            '<span class="btn-label">' +
            "</span>Reset</button>"
        );

        this.api()
          .columns()
          .every(function (val) {
            var column = this;
            $("#requestingTable_reset").click(function () {
              $(".requestingTable_select").val("");
              $(".requestingTable_select").selectpicker("refresh");
              column.search("").draw();
            });
            if (val === 0) {
              $("#requestingTable_buyer").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requestingTable_buyer").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requestingTable_buyer").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requestingTable_buyer").selectpicker("refresh");
            }
            if (val === 1) {
              $("#requestingTable_property").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requestingTable_property").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requestingTable_property").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requestingTable_property").selectpicker("refresh");
            }
            if (val === 2) {
              $("#requestingTable_locality").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requestingTable_locality").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requestingTable_locality").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requestingTable_locality").selectpicker("refresh");
            }

            if (val === 7) {
              $("#requestingTable_pending").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#requestingTable_pending").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#requestingTable_pending").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#requestingTable_pending").selectpicker("refresh");
            }
          });
      },
    });
    $("#requestingTable_reset").click(function () {
      re.search("").draw();
      $(this).blur();
    });

    var proposalTable = $("#proposalTable").DataTable({
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },
      columnDefs: [
        {
          className: "text-right",
          targets: [7],
        },
      ],

      initComplete: function () {
        $("#proposalTable_filter").append(
          '<select id="proposalTable_buyer" class="col-md-2 selectpicker proposalTable_select"' +
            'data-live-search="true" title="Buyer"></select>' +
            '<select id="proposalTable_property" class="col-md-2 selectpicker proposalTable_select"' +
            'data-live-search="true" title="Property Type" ></select>' +
            '<select id="proposalTable_locality" class="col-md-2 selectpicker proposalTable_select"' +
            'data-live-search="true" title="Cluster"></select>' +
            '<select id="proposalTable_title" class="col-md-2 selectpicker proposalTable_select"' +
            'data-live-search="true" title="Seller"></select>' +
            '<select class="col-md-2 selectpicker proposalTable_select"' +
            'data-live-search="true" id="proposalTable_pending" title="Pending With"></select>' +
            '<button type="button" id="proposalTable_reset" class="btn btn-warning reset">' +
            '<span class="btn-label" data-table="proposalTable">' +
            "</span>Reset</button>"
        );

        this.api()
          .columns()
          .every(function (val) {
            var column = this;
            if (val === 0) {
              $("#proposalTable_buyer").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#proposalTable_buyer").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#proposalTable_buyer").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#proposalTable_buyer").selectpicker("refresh");
            }
            if (val === 1) {
              $("#proposalTable_property").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#proposalTable_property").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#proposalTable_property").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#proposalTable_property").selectpicker("refresh");
            }
            if (val === 2) {
              $("#proposalTable_locality").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#proposalTable_locality").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#proposalTable_locality").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#proposalTable_locality").selectpicker("refresh");
            }
            if (val === 3) {
              $("#proposalTable_title").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#proposalTable_title").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#proposalTable_title").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#proposalTable_title").selectpicker("refresh");
            }
            if (val === 9) {
              $("#proposalTable_pending").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#proposalTable_pending").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#proposalTable_pending").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#proposalTable_pending").selectpicker("refresh");
            }

            $("#proposalTable_reset").click(function () {
              $(".proposalTable_select").val("");
              $(".proposalTable_select").selectpicker("refresh");
              column.search("").draw();
            });
          });
        // $('#proposalTable_length').append(

        //     '<button type="button" id="reset" class="btn btn-warning btn-rotate">'+
        //     '<span class="btn-label">'+
        //         '<i class="fa fa-repeat"></i>'+
        //     '</span>Reset</button>'
        // )
      },
    });
    $("#proposalTable_reset").click(function () {
      proposalTable.search("").draw();
      $(this).blur();
    });

    var saleTable = $("#saleTable").DataTable({
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      columnDefs: [
        {
          className: "text-right",
          targets: [7],
        },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        sLengthMenu: "Number of entries _MENU_",
      },

      initComplete: function () {
        $("#saleTable_filter").append(
          '<select id="saleTable_buyer" class="col-md-2 selectpicker saleTable_select"' +
            'data-live-search="true" title="Buyer"></select>' +
            '<select id="saleTable_property" class="col-md-2 selectpicker saleTable_select"' +
            'data-live-search="true" title="Property Type" ></select>' +
            '<select id="saleTable_locality" class="col-md-2 selectpicker saleTable_select"' +
            'data-live-search="true" title="Cluster"></select>' +
            '<select id="saleTable_title" class="col-md-2 selectpicker saleTable_select"' +
            'data-live-search="true" title="Seller"></select>' +
            '<select class="col-md-2 selectpicker saleTable_select"' +
            'data-live-search="true" id="saleTable_pending" title="Pending With"></select>' +
            '<button type="button" id="saleTable_reset" class="btn btn-warning reset">' +
            '<span class="btn-label" data-table="saleTable">' +
            "</span>Reset</button>"
        );

        this.api()
          .columns()
          .every(function (val) {
            var column = this;
            if (val === 0) {
              $("#saleTable_buyer").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#saleTable_buyer").append('<option value="">Reset</option>');
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#saleTable_buyer").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#saleTable_buyer").selectpicker("refresh");
            }
            if (val === 1) {
              $("#saleTable_property").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#saleTable_property").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#saleTable_property").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#saleTable_property").selectpicker("refresh");
            }
            if (val === 2) {
              $("#saleTable_locality").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#saleTable_locality").append(
                '<option value="">Reset</option>'
              );
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#saleTable_locality").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#saleTable_locality").selectpicker("refresh");
            }
            if (val === 3) {
              $("#saleTable_title").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#saleTable_title").append('<option value="">Reset</option>');
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#saleTable_title").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#saleTable_title").selectpicker("refresh");
            }
            if (val === 9) {
              $("#saleTable_pending").on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });
              $("#saleTable_pending").append('<option value="">Reset</option>');
              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  $("#saleTable_pending").append(
                    '<option value="' + d + '">' + d + "</option>"
                  );
                });
              //select.val(1);
              $("#saleTable_pending").selectpicker("refresh");
            }

            $("#saleTable_reset").click(function () {
              $(".saleTable_select").val("");
              $(".saleTable_select").selectpicker("refresh");
              column.search("").draw();
            });
          });
        // $('#saleTable_length').append(

        //     '<button type="button" id="reset" class="btn btn-warning btn-rotate">'+
        //     '<span class="btn-label">'+
        //         '<i class="fa fa-repeat"></i>'+
        //     '</span>Reset</button>'
        // )
      },
    });
    $("#saleTable_reset").click(function () {
      saleTable.search("").draw();
      $(this).blur();
    });
  },

  initChart: function () {
    let sellerChartDetails = {
      graphId: "#agencysellerchart",
      numberOfBars: 2,
      barLabels: ["Invoice", "Payment"],
      chartType: "bar",
      labelsType: "month",
      dataLabels: [],
      line: {
        label: "Avg. Payment Days",
        borderColor: "#8e5ea2",
        fill: false,
        order: 2,
        yAxisID: "line",
        // Changes this dataset to become a line
        type: "line",
      },
    };
    var sellerOptions = {
      legend: {
        // fullWidth:true,
        position: "top",
        align: "end",
        reverse: true,
      },
      scales: {
        xAxes: [
          {
            barPercentage: 1,
            categoryPercentage: 0.6,
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 1000,
              max: 10000,
            },
            type: "linear",
            position: "left",
          },
          {
            id: "line",
            type: "linear",
            position: "right",
            ticks: {
              min: 10,
              max: 60,
            },
          },
        ],
      },
    };
    let sellerInvoiceChart = createChartObject.createGraph(
      sellerChartDetails,
      sellerOptions
    );

    $(".seller_changeGraph").click(function (e) {
      sellerChartDetails.labelsType = $(this).data("type");
      sellerInvoiceChart = createChartObject.updateChart(
        e,
        this,
        sellerInvoiceChart,
        ".seller_changeGraph",
        sellerChartDetails,
        sellerOptions
      );
    });
  },
};
condomanagerdashboard = {
  initdataTable: function () {
    let elementArray = [
      {
        id: "condo-Inv",
        title: "Invoice",
        number: 0,
        className: "col-md-3 condo-select",
      },
      {
        id: "condo-title",
        title: "Vendor",
        number: 1,
        className: "col-md-3 condo-select",
      },

      {
        id: "condo-pending",
        title: "Pending With",
        number: 8,
        className: "col-md-3 condo-select",
      },
    ];

    let dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "condomanager",
      },
      // columnDefs: [
      //     { width: "2%", targets: 0 }
      //   ],
      columns: [
        // {
        //   data: null,
        //   width: "4%",
        //   class: "text-break text-center bs-checkbox",
        //   render: function (data, row) {
        //     return '<input data-index="0" name="btSelectItem" type="checkbox"></input>';
        //   },
          
        // },
        {
          data: null,
          width: "1%",
          class: "text-break text-center",
          render: function (data, row) {
            return '<input name="product" class="checkbox" type="checkbox">';
          },
          
        },
        
        {
          data: "invoice",
          width: "14%",
          class: "text-break text-center",
          render: function (data, row) {
            return '<a href="../../assets/pdf/invoice.pdf" target="_blank">' + data + '</a>';
          },
          
        },
        {
          data: "vendor",
          width: "13%",
          class: "text-break text-center",
        },
        {
          data: "poamount",
          width: "10%",
          class: "text-break text-right",
        },
        {
          data: "purchaseorderdate",
          width: "12%",
          class: "text-break text-center",
        },
        {
          data: "invamount",
          width: "8%",
          class: "text-break text-right",
        },
        {
          data: "allocatedbudget",
          width: "8%",
          class: "text-break text-right",
        },
       
        {
          data: "invoiceduedate",
          width: "9%",
          class: "text-break text-center",
        },

        // {
        //     "class":          "details-control",
        //     "orderable":      false,
        //     "data":           null,
        //     "defaultContent": ""
        // },
        {
          data: "match",
          class: "text-break text-center",
        },
        // {
        //     data: "propdate",
        //     render: function (data, type, row) {
        //         return moment(data, 'DD-MM-YY').format('DD-MMM-YY')
        //     }

        // },
        // {
        //     data: "duedate",
        //     render: function (data, type, row) {
        //         return moment(data, 'DD-MM-YY').format('DD-MMM-YY')
        //     }
        // },

        // {
        //     data: "value",
        //     render: function (data, type, row) {
        //         return data.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //     }
        // },
        {
          data: "pendingwith",
          width: "8%",
          class: "text-break text-center",
          render: function (data, row) {
            let test = data;
            return data;
            return '<a href="' + data + '" target="_blank">' + row.linkName+ '</a>';
          },
        },
        {
          data: "status",
          width: "8%",
          class: "text-break text-center",

          render: function (data, row) {
            if (data == "Paid") {
              return `<button
                        class="btn btn-primary btn-success btn-sm btn-fill condo-btn details-control">${data}</button>`;
            } else if (data == "Pending") {
              return `<button
                        class="btn btn-primary btn-warning btn-sm btn-fill condo-btn">${data}</button>`;
            } else {
              return `<button
                        class="btn btn-primary btn-sm btn-fill condo-btn">${data}</button>`;
            }
            // return `<button
            // class="btn btn-primary btn-sm btn-fill condo-btn">${data}</button>`
          },
        },
        // {
        //   data: null,
        //   width: "10%",
        //   class: "text-break text-center",
        //   render: function (data, type, row) {
        //     console.log(row.vendor);
        //     if (row.status == "Paid") {
        //       return `
        //                 <div class="details-control btn btn-sm btn-primary btn-warning condo-btn btn-icon edit"><i class="ti-eye"></i> Invoice</div>`;
        //     } else {
        //       return `<button
        //                 class="btn btn-primary btn-success btn-sm btn-fill condo-btn">Approve</button>
        //                 <button
        //                 class="btn btn-primary btn-danger btn-sm btn-fill condo-btn reject-btn">Reject</button>
        //                 `;
        //     }
        //   },
        // },

        // {
        //     data: null,
        //     render: function (data, type, row) {
        //         return `<a href="#"
        //     class="btn btn-simple btn-warning btn-icon edit"><i
        //         class="ti-eye"></i></a>`
        //     }
        // }
      ],
      valueRow: [2],
    };
    buttonElements = {
      id: "condo-reset",
      filterId: "#condotable_filter",
      className: "condo-reset",
      select: "condo-select",
    };

    var table = createDataTables.createTable(
      "#condotable",
      dataSet,
      elementArray,
      buttonElements
    );
    table.columns.adjust().draw();

    $("#condotable tbody").on("change", "td input.checkbox",function(){ //".checkbox" change 
    if($('.checkbox:checked').length == 0){
    
      $(".multiselectbtn").css("display", "none");
    }
    else{
         $(".multiselectbtn").css("display", "block");
        }
        if($('.checkbox:checked').length == $('.checkbox').length){
         
                     $('.checked_all').prop('checked',true);
                   
              }else{
                 
                     $('.checked_all').prop('checked',false);
                
              }
       
  })

    $("#condotable tbody").on("click", "td button.details-control", function () {
      $("tr").removeClass("shown");
      $("#detailcondo_wrapper").remove();
      var tr = $(this).closest("tr");

      // var table=  $(this).closest('table');
      var row = table.row(tr);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass("shown");
      } else {
        // Open this row

        row.child(format(row.data())).show();
        tr.addClass("shown");
        $(".shown").next().css("background-color", "#f5f5f5");
      }
      elementArray = [
        {
          id: "condodetail-title",
          title: "Inv",
          number: 0,
          className: "col-md-3 condodetail-select",
        },
        // {
        //   id: "condodetail-pending",
        //   title: "Pending With",
        //   number: 2,
        //   className: "col-md-3 condodetail-select",
        // },
      ];
      dataSet = {
        ajax: {
          url: "../../data/tabledata.php",
          dataSrc: "detailcondomanager",
        },
        
        columns: [

          {
            data: "invoice",
          },
          {
            data: "poamount",
          },
          {
            data: "invamount",
          },
          {
            data: "purchaseorderdate",
          },
          {
            data: "invoiceduedate",
          },
          {
            data: "paiddate",
          },
        ],
        valueRow: [5],
      };
      buttonElements = {
        id: "condodetail-reset",
        filterId: "#detailcondo_filter",
        className: "condodetail-reset",
        select: "condodetail-select",
      };

      // console.log(dataSet1,'testing')
      createDataTables.createTable(
        "#detailcondo",
        dataSet,
        elementArray,
        buttonElements
      );
    });

    function format(d) {
      // `d` is the original data object for the row
      return (
        '<table id="detailcondo" class="table table-no-bordered table-hover" cellspacing="0" width="100%" style="width:100%">' +
        "<thead>" +
        "<tr>" +
        "<td>Invoice#</td>" +
        "<td>PO Amount</td>" +
        "<td>Invoice Amount</td>" +
        "<td>Purchase Order Date</td>" +
        "<td>Invoice Due Date</td>" +
        "<td>Paid Date</td>" +
        "</tr>" +
        "</thead>" +
        "</table>"
      );
    }
    
    //
  },
  
};

buyerdashboard = {
  initdataTable: function () {
    let elementArray = [
      {
        id: "open-proposal_title",
        title: "Seller",
        number: 0,
        className: "col-md-3 open-proposal_select",
      },
      {
        id: "open-proposal_rfp",
        title: "RFPs #",
        number: 2,
        className: "col-md-2 open-proposal_select",
      },
      {
        id: "open-proposal_pending",
        title: "Pending With",
        number: 6,
        className: "col-md-3 open-proposal_select",
      },
    ];

    let dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "newproposal",
      },
      columns: [
        {
          data: "Seller",
        },
        {
          data: "prop",
        },
        {
          data: "rfp",
        },
        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },

        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                    class="btn btn-simple btn-warning btn-icon edit"><i
                        class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [5],
    };
    buttonElements = {
      id: "open-proposal_reset",
      filterId: "#open-proposal_filter",
      className: "open-proposal_reset",
      select: "open-proposal_select",
    };

    createDataTables.createTable(
      "#open-proposal",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "paymenttable_title",
        title: "Seller",
        number: 0,
        className: "col-md-3 paymenttable_select",
      },
      {
        id: "paymenttable_pending",
        title: "Pending With",
        number: 6,
        className: "col-md-3 paymenttable_select",
      },
    ];

    buttonElements = {
      id: "paymenttable_reset",
      filterId: "#paymenttable_filter",
      className: "paymenttable_reset",
      select: "paymenttable_select",
    };
    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "pendingpayments",
      },
      columns: [
        {
          data: "Seller",
        },
        {
          data: "inv",
        },

        {
          data: "invdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "po",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                        class="btn btn-primary btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                    class="btn btn-simple btn-warning btn-icon edit"><i
                        class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [5],
    };
    createDataTables.createTable(
      "#paymenttable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "requisitingTable_pending",
        title: "Pending With",
        number: 4,
        className: "col-md-3 requisitingTable_select",
      },
    ];

    buttonElements = {
      id: "requisitingTable_reset",
      filterId: "#requisitingTable_filter",
      className: "requisitingTable_reset",
      select: "requisitingTable_select",
    };
    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "Requisitions",
      },
      columns: [
        {
          data: "req",
        },

        {
          data: "reqdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },

        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-warning btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [3],
    };
    createDataTables.createTable(
      "#requisitingTable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "requestingTable_pending",
        title: "Pending With",
        number: 4,
        className: "col-md-3 requestingTable_select",
      },
    ];

    buttonElements = {
      id: "requestingTable_reset",
      filterId: "#requestingTable_filter",
      className: "requestingTable_reset",
      select: "requestingTable_select",
    };
    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "Requestions",
      },
      columns: [
        {
          data: "req",
        },

        {
          data: "reqdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },

        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-warning btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [3],
    };
    createDataTables.createTable(
      "#requestingTable",
      dataSet,
      elementArray,
      buttonElements
    );
  },

  initChart: function () {
    let invoiceChartDetails = {
      graphId: "#invoices_chart",
      numberOfBars: 2,
      barLabels: ["No. of Invoices", "No. of Credit Notes"],
      chartType: "bar",
      labelsType: "upto-date",
      dataLabels: [],
      invoice: true,
      range: {
        max: 100,
        min: 0,
      },
      line: {
        label: "Percentage of Credit Notes",
        borderColor: "#8e5ea2",
        backgroundColor: "#8e5ea2",
        fill: false,
        yAxisID: "line",
        type: "line",
      },
    };
    var inoviceOptions = {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      tooltips: {
        mode: "index",
      },
      legend: {},
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 100,
            },
            type: "linear",
            position: "left",
          },
          {
            id: "line",
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
              max: 100,
            },
          },
        ],
      },
    };

    let invoiceChart = createChartObject.createGraph(
      invoiceChartDetails,
      inoviceOptions
    );

    $(".invoices_changeGraph").click(function (e) {
      invoiceChartDetails.labelsType = $(this).data("type");
      invoiceChart = createChartObject.updateChart(
        e,
        $(this),
        invoiceChart,
        ".invoices_changeGraph",
        invoiceChartDetails,
        inoviceOptions
      );
    });

    let invoiceValueChartDetails = {
      graphId: "#invoicevalue_chartActivity",
      numberOfBars: 2,
      barLabels: ["Invoices Value", "Credit Notes Value"],
      chartType: "bar",
      labelsType: "upto-date",
      dataLabels: [],
      range: {
        max: 10000,
        min: 1000,
      },
      invoice: true,
      line: {
        label: "Percentage of Credit Notes",
        borderColor: "#8e5ea2",
        backgroundColor: "#8e5ea2",
        fill: false,
        yAxisID: "line",
        type: "line",
      },
    };
    var inoviceValueOptions = {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      tooltips: {
        mode: "index",
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            return `${label}: ${value.toLocaleString()}`;
          },
        }, // end callbacks:
      },
      legend: {},
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 10000,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
            type: "linear",
            position: "left",
          },
          {
            id: "line",
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
              max: 100,
            },
          },
        ],
      },
    };

    let invoiceValueChart = createChartObject.createGraph(
      invoiceValueChartDetails,
      inoviceValueOptions
    );

    $(".invoicevalue_changeGraph").click(function (e) {
      invoiceValueChartDetails.labelsType = $(this).data("type");
      invoiceValueChart = createChartObject.updateChart(
        e,
        $(this),
        invoiceValueChart,
        ".invoicevalue_changeGraph",
        invoiceValueChartDetails,
        inoviceValueOptions
      );
    });

    let paymentChartDetails = {
      graphId: "#payment_chartActivity",
      numberOfBars: 3,
      barLabels: ["Net Invoices Value", "Net Payments", "Savings"],
      chartType: "bar",
      labelsType: "upto-date",
      dataLabels: [],
      stack: [1, 2, 2],
      combine: true,
      line: {
        label: "Percentage Savings per Annum",
        borderColor: "#8e5ea2",
        backgroundColor: "#8e5ea2",
        fill: false,
        yAxisID: "line",
        type: "line",
      },
    };
    var paymentOptions = {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      tooltips: {
        mode: "index",
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            return `${label}: ${value.toLocaleString()}`;
          },
        }, // end callbacks:
      },
      legend: {},
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 1000,
              max: 10000,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
            type: "linear",
            position: "left",
          },
          {
            id: "line",
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
              max: 100,
            },
          },
        ],
      },
    };
    let paymentChart = createChartObject.createGraph(
      paymentChartDetails,
      paymentOptions
    );

    $(".payment_changeGraph").click(function (e) {
      paymentChartDetails.labelsType = $(this).data("type");
      paymentChart = createChartObject.updateChart(
        e,
        this,
        paymentChart,
        ".payment_changeGraph",
        paymentChartDetails,
        paymentOptions
      );
    });

    let spendVendorChartDetails = {
      graphId: "#spendsellerchart",
      numberOfBars: 3,
      barLabels: ["Current Period", "Last Period", "Last Year Current Month"],
      chartType: "horizontalBar",
      labelsType: "month",
      dataLabels: [
        "Best Guard Security Services",
        "GCM Safety & Security",
        "Henderson Security",
        "Ken Landscape Services",
        "MR Elevator Singapore B.V.",
      ],
    };
    spendChartOptions = {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                if (value.length > 10) {
                  return value.substr(0, 10) + "..."; //truncate
                } else {
                  return value;
                }
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
          },
        ],
      },
      tooltips: {
        enabled: true,
        mode: "label",
        callbacks: {
          title: function (tooltipItems, data) {
            var idx = tooltipItems[0].index;
            return "Title:" + data.labels[idx]; //do something with title
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    };
    let spendByVendor = createChartObject.createGraph(
      spendVendorChartDetails,
      spendChartOptions
    );

    $(".spendSellerChangeGraph").click(function (e) {
      spendVendorChartDetails.labelsType = $(this).data("type");
      (spendVendorChartDetails.barLabels = [
        $(this).data("label"),
        "Last Period",
        "Last Year " + $(this).data("label"),
      ]),
        (spendByVendor = createChartObject.updateChart(
          e,
          this,
          spendByVendor,
          ".spendSellerChangeGraph",
          spendVendorChartDetails,
          spendChartOptions
        ));
    });

    spendChartCatelogyOptions = {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                if (value.length > 10) {
                  return value.substr(0, 10) + "..."; //truncate
                } else {
                  return value;
                }
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
          },
        ],
      },
      tooltips: {
        enabled: true,
        mode: "index",
        callbacks: {
          title: function (tooltipItems, data) {
            var idx = tooltipItems[0].index;
            return "Title:" + data.labels[idx]; //do something with title
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    };

    let spendCategoryChartDetails = {
      graphId: "#spendCategoryChart",
      numberOfBars: 3,
      barLabels: ["Current Period", "Last Period", "Last Year Current Month"],
      chartType: "horizontalBar",
      labelsType: "month",
      dataLabels: [
        "Security Maintenance",
        "Landscaping",
        "Cleaning Maintenance",
        "Pool Maintenance",
        "Lift Maintenance",
      ],
    };

    let spendByCategory = createChartObject.createGraph(
      spendCategoryChartDetails,
      spendChartCatelogyOptions
    );

    $(".spendCategoryChangeGraph").click(function (e) {
      spendCategoryChartDetails.labelsType = $(this).data("type");
      (spendCategoryChartDetails.barLabels = [
        $(this).data("label"),
        "Last Period",
        "Last Year " + $(this).data("label"),
      ]),
        (spendByCategory = createChartObject.updateChart(
          e,
          this,
          spendByCategory,
          ".spendCategoryChangeGraph",
          spendCategoryChartDetails,
          spendChartCatelogyOptions
        ));
    });
  },
};

sellerdashboard = {
  initdataTable: function () {
    let elementArray = [
      {
        id: "paymentduetable_title",
        title: "Buyer",
        number: 3,
        className: "col-md-2 paymentduetable_select",
      },
      {
        id: "paymentduetable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 paymentduetable_select",
      },
      {
        id: "paymentduetable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 paymentduetable_select",
      },
      {
        id: "paymentduetable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 paymentduetable_select",
      },
    ];

    let dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "sellerpaymentoverdue",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                                class="btn btn-simple btn-warning btn-icon edit"><i
                        class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    buttonElements = {
      id: "paymentduetable_reset",
      filterId: "#paymentduetable_filter",
      className: "paymentduetable_reset",
      select: "paymentduetable_select",
    };

    createDataTables.createTable(
      "#paymentduetable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "invoiceduetable_title",
        title: "Buyer",
        number: 3,
        className: "col-md-2 invoiceduetable_select",
      },
      {
        id: "invoiceduetable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 invoiceduetable_select",
      },
      {
        id: "invoiceduetable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 invoiceduetable_select",
      },
      {
        id: "invoiceduetable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 invoiceduetable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "sellerinvoiceoverdue",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
        class="btn btn-simple btn-warning btn-icon edit"><i
            class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    buttonElements = {
      id: "invoiceduetable_reset",
      filterId: "#invoiceduetable_filter",
      className: "invoiceduetable_reset",
      select: "invoiceduetable_select",
    };

    createDataTables.createTable(
      "#invoiceduetable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "opentable_title",
        title: "Seller",
        number: 3,
        className: "col-md-2 opentable_select",
      },
      {
        id: "opentable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 opentable_select",
      },
      {
        id: "opentable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 opentable_select",
      },
      {
        id: "opentable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 opentable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "sellerinvoiceoverdue",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
    class="btn btn-simple btn-warning btn-icon edit"><i
        class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    buttonElements = {
      id: "opentable_reset",
      filterId: "#opentable_filter",
      className: "opentable_reset",
      select: "opentable_select",
    };

    createDataTables.createTable(
      "#opentable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "paytable_title",
        title: "Seller",
        number: 4,
        className: "col-md-2 paytable_select",
      },
      {
        id: "paytable_property",
        title: "Property Type",
        number: 5,
        className: "col-md-2 paytable_select",
      },
      {
        id: "paytable_locality",
        title: "Cluster",
        number: 6,
        className: "col-md-2 paytable_select",
      },
      {
        id: "paytable_pending",
        title: "Pending With",
        number: 8,
        className: "col-md-2 paytable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "sellerproposaloverdue",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                                    class="btn btn-simple btn-warning btn-icon edit"><i
                                 class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    buttonElements = {
      id: "paytable_reset",
      filterId: "#paytable_filter",
      className: "paytable_reset",
      select: "paytable_select",
    };

    createDataTables.createTable(
      "#paytable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "openpaytable_title",
        title: "Seller",
        number: 4,
        className: "col-md-2 openpaytable_select",
      },
      {
        id: "openpaytable_property",
        title: "Property Type",
        number: 5,
        className: "col-md-2 openpaytable_select",
      },
      {
        id: "openpaytable_locality",
        title: "Cluster",
        number: 6,
        className: "col-md-2 openpaytable_select",
      },
      {
        id: "openpaytable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 openpaytable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "sellerrfps",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "propdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "buyer",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                                class="btn btn-simple btn-warning btn-icon edit"><i
                             class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    buttonElements = {
      id: "openpaytable_reset",
      filterId: "#openpaytable_filter",
      className: "openpaytable_reset",
      select: "openpaytable_select",
    };

    createDataTables.createTable(
      "#openpaytable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "sellerinvoicedaystable_title",
        title: "Buyer",
        number: 0,
        className: "col-md-3 sellerinvoicedaystable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "sellerinvoicedays",
      },
      columns: [
        {
          data: "buyer",
        },
        {
          data: "inv",
        },
        {
          data: "amount",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "wip",
        },
        {
          data: "pendinginv",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },
        {
          data: "pendingapproval",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },

        {
          data: "pendingpay",
          render: function (data, type, row) {
            if (data >= 5 && data <= 10)
              return '<div class="btn btn-warning btn-fill">' + data + "</div>";
            else if (data > 10)
              return '<div class="btn btn-danger btn-fill">' + data + "</div>";
            else return data;
          },
        },
      ],
      valueRow: [2],
    };
    buttonElements = {
      id: "sellerinvoicedaystable_reset",
      filterId: "#sellerinvoicedaystable_filter",
      className: "sellerinvoicedaystable_reset",
      select: "sellerinvoicedaystable_select",
    };

    table = createDataTables.createTable(
      "#sellerinvoicedaystable",
      dataSet,
      elementArray,
      buttonElements
    );
    sellerinvoicedaystable;
  },

  initChart: function () {
    let sellerChartDetails = {
      graphId: "#sellerchart",
      numberOfBars: 2,
      barLabels: ["Invoice", "Payment"],
      chartType: "bar",
      labelsType: "upto-date",
      dataLabels: [],
      line: {
        label: "Avg. Payment Days",
        borderColor: "#8e5ea2",
        fill: false,
        yAxisID: "line",
        // Changes this dataset to become a line
        type: "line",
      },
    };
    var sellerOptions = {
      tooltips: {
        mode: "index",
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            var value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            return `${label}: ${value.toLocaleString()}`;
          },
        }, // end callbacks:
      },
      scales: {
        xAxes: [
          {
            barPercentage: 1,
            categoryPercentage: 0.6,
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 1000,
              max: 10000,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
            type: "linear",
            position: "left",
          },
          {
            id: "line",
            type: "linear",
            position: "right",
            ticks: {
              min: 10,
              max: 60,
            },
          },
        ],
      },
    };
    let sellerInvoiceChart = createChartObject.createGraph(
      sellerChartDetails,
      sellerOptions
    );

    $(".seller_changeGraph").click(function (e) {
      sellerChartDetails.labelsType = $(this).data("type");
      sellerInvoiceChart = createChartObject.updateChart(
        e,
        this,
        sellerInvoiceChart,
        ".seller_changeGraph",
        sellerChartDetails,
        sellerOptions
      );
    });
  },
};

invoiceTables = {
  initdataTable: function (person) {
    let elementArray = [
      {
        id: "paymenttable_title",
        title: person,
        number: 3,
        className: "col-md-3 paymenttable_select",
      },
      {
        id: "paymenttable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 paymenttable_select",
      },
      {
        id: "paymenttable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 paymenttable_select",
      },
      {
        id: "paymenttable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 paymenttable_select",
      },
    ];

    let dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "invoicependingpayments",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "invdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "Seller",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-primary btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    (buttonElements = {
      id: "paymenttable_reset",
      filterId: "#paymenttable_filter",
      className: "paymenttable_reset",
      select: "paymenttable_select",
    }),
      createDataTables.createTable(
        "#paymenttable",
        dataSet,
        elementArray,
        buttonElements
      );

    elementArray = [
      {
        id: "invoiceTable_title",
        title: person,
        number: 3,
        className: "col-md-3 invoiceTable_select",
      },
      {
        id: "invoiceTable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 invoiceTable_select",
      },
      {
        id: "invoiceTable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 invoiceTable_select",
      },
      {
        id: "invoiceTable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 invoiceTable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "invoicepaidpayment",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "invdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "Seller",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "dso",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-primary btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    buttonElements = {
      id: "invoiceTable_reset",
      filterId: "#invoiceTable_filter",
      className: "invoiceTable_reset",
      select: "invoiceTable_select",
    };

    createDataTables.createTable(
      "#invoiceTable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "paytable_title",
        title: person,
        number: 3,
        className: "col-md-3 paytable_select",
      },
      {
        id: "paytable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 paytable_select",
      },
      {
        id: "paytable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 paytable_select",
      },
      {
        id: "paytable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 paytable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "invoicependingapproval",
      },
      columns: [
        {
          data: "inv",
        },
        {
          data: "invdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "Seller",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },

        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-warning btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    (buttonElements = {
      id: "paytable_reset",
      filterId: "#paytable_filter",
      className: "paytable_reset",
      select: "paytable_select",
    }),
      createDataTables.createTable(
        "#paytable",
        dataSet,
        elementArray,
        buttonElements
      );
  },
};

buyerinvoiceTables = {
  initdataTable: function (person) {
    let elementArray = [
      {
        id: "buyerpaymenttable_title",
        title: person,
        number: 3,
        className: "col-md-3 paymenttable_select",
      },
      {
        id: "buyerpaymenttable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 paymenttable_select",
      },
      {
        id: "buyerpaymenttable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 paymenttable_select",
      },
      {
        id: "buyerpaymenttable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 paymenttable_select",
      },
    ];

    let dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "buyerinvoicependingpayments",
      },
      columns: [
        {
          data: "inv",
        },
        {
          data: "invdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "Seller",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-primary btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    (buttonElements = {
      id: "buyerpaymenttable_reset",
      filterId: "#buyerpaymenttable_filter",
      className: "buyerpaymenttable_reset",
      select: "buyerpaymenttable_select",
    }),
      createDataTables.createTable(
        "#buyerpaymenttable",
        dataSet,
        elementArray,
        buttonElements
      );

    elementArray = [
      {
        id: "buyerinvoiceTable_title",
        title: person,
        number: 3,
        className: "col-md-3 buyerinvoiceTable_select",
      },
      {
        id: "buyerinvoiceTable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 buyerinvoiceTable_select",
      },
      {
        id: "buyerinvoiceTable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 buyerinvoiceTable_select",
      },
      {
        id: "buyerinvoiceTable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 buyerinvoiceTable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "buyerinvoicepaidpayment",
      },
      columns: [
        {
          data: "inv",
        },

        {
          data: "invdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "Seller",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },
        {
          data: "dso",
        },
        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-primary btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    buttonElements = {
      id: "buyerinvoiceTable_reset",
      filterId: "#buyerinvoiceTable_filter",
      className: "buyerinvoiceTable_reset",
      select: "buyerinvoiceTable_select",
    };

    createDataTables.createTable(
      "#buyerinvoiceTable",
      dataSet,
      elementArray,
      buttonElements
    );

    elementArray = [
      {
        id: "buyerpaytable_title",
        title: person,
        number: 3,
        className: "col-md-3 buyerpaytable_select",
      },
      {
        id: "buyerpaytable_property",
        title: "Property Type",
        number: 4,
        className: "col-md-2 buyerpaytable_select",
      },
      {
        id: "buyerpaytable_locality",
        title: "Cluster",
        number: 5,
        className: "col-md-2 buyerpaytable_select",
      },
      {
        id: "buyerpaytable_pending",
        title: "Pending With",
        number: 7,
        className: "col-md-2 buyerpaytable_select",
      },
    ];

    dataSet = {
      ajax: {
        url: "../../data/tabledata.php",
        dataSrc: "buyerinvoicependingapproval",
      },
      columns: [
        {
          data: "inv",
        },
        {
          data: "invdate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "duedate",
          render: function (data, type, row) {
            return moment(data, "DD-MM-YY").format("DD-MMM-YY");
          },
        },
        {
          data: "Seller",
        },
        {
          data: "property",
        },
        {
          data: "locality",
        },
        {
          data: "value",
          render: function (data, type, row) {
            return data
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        {
          data: "pending",
        },

        {
          data: "status",
          render: function (data) {
            return `<button
                    class="btn btn-warning btn-sm btn-fill">${data}</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#"
                class="btn btn-simple btn-warning btn-icon edit"><i
                    class="ti-eye"></i></a>`;
          },
        },
      ],
      valueRow: [6],
    };
    (buttonElements = {
      id: "buyerpaytable_reset",
      filterId: "#buyerpaytable_filter",
      className: "buyerpaytable_reset",
      select: "buyerpaytable_select",
    }),
      createDataTables.createTable(
        "#buyerpaytable",
        dataSet,
        elementArray,
        buttonElements
      );
  },
};

$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
  $($.fn.dataTable.tables(true))
    .DataTable()
    .columns.adjust()
    .responsive.recalc();
});

function addFilters(filterId, classname, filterObject) {
  filterObject.forEach((element) => {
    $(filterId).append(
      '<select id="' +
        element.id +
        '" class="col-md-2 selectpicker ' +
        classname +
        '"' +
        'data-live-search="true" title="' +
        element.title +
        '"></select>'
    );
  });
}

function addFilterData(table, id) {
  $(id).on("change", function () {
    var val = $.fn.dataTable.util.escapeRegex($(this).val());
    table.search(val ? "^" + val + "$" : "", true, false).draw();
  });
  $(id).append('<option value="">Reset</option>');
  table
    .data()
    .unique()
    .sort()
    .each(function (d, j) {
      $(id).append('<option value="' + d + '">' + d + "</option>");
    });
  $(id).selectpicker("refresh");
}

function addReset(element) {
  $(element.filterId).append(
    '<button type="button"  id="' +
      element.id +
      '" class="btn btn-warning reset">' +
      "Reset</button>"
  );
}

function addResetFunction(column, id, className) {
  $(id).click(function () {
    $(className).val("");
    $(className).selectpicker("refresh");
    column.search("").draw();
    $(this).blur();
  });
}

//Chart calculation
let createChartObject = {
  randomizeBarData: function (previousDate, format, type, range, t) {
    label = [];
    data = [];
    bar1 = [];
    bar2 = [];
    bar3 = [];
    for (var m = moment(previousDate); m.isBefore(new Date()); m.add(1, type)) {
      label.push(m.format(format));
      var p = Math.floor(Math.random() * (20 - 10) + 10);
      data.push(p);
      var tempbar1 = Math.floor(
        Math.random() * (range.max - range.min) + range.min
      );
      var tempbar2 = Math.floor(tempbar1 - (tempbar1 * p) / 100);
      var tempbar3 = Math.floor((tempbar1 * p) / 100);

      bar1.push(tempbar1);
      bar2.push(tempbar2);
      bar3.push(tempbar3);
    }
    return {
      label: label,
      data: data,
      bars: [bar1, bar2, bar3],
    };
  },

  randomizeData: function (range, length) {
    label = [];
    data = [];
    bar1 = [];
    bar2 = [];
    bar3 = [];
    max = range.max;
    for (let index = 0; index < length; index++) {
      var p = Math.floor(Math.random() * (20 - 10) + 10);
      data.push(p);
      var tempbar1 = Math.floor(Math.random() * (max - range.min) + range.min);
      max = tempbar1;
      var tempbar2 = Math.floor(
        Math.random() * (tempbar1 - range.min) + range.min
      );
      var tempbar3 = Math.floor(
        Math.random() * (tempbar2 - range.min) + range.min
      );

      bar1.push(tempbar1);
      bar2.push(tempbar2);
      bar3.push(tempbar3);
    }

    return {
      label: label,
      data: data,
      bars: [bar1, bar2, bar3],
    };
  },

  generateBarValue: function (type, range, t) {
    switch (type) {
      case "month":
        previousDate = moment().subtract(1, "M").add(1, "day");
        return this.randomizeBarData(previousDate, "DD MMM", "day", range, t);
        break;

      case "first-quarter":
        previousDate = moment().subtract(2, "months");

        return this.randomizeBarData(previousDate, "MMM YY", "month", range, t);

        break;

      case "second-quarter":
        previousDate = moment().subtract(5, "months");
        return this.randomizeBarData(previousDate, "MMM YY", "month", range, t);
        break;
      case "third-quarter":
        previousDate = moment().subtract(8, "months");
        return this.randomizeBarData(previousDate, "MMM YY", "month", range, t);
        break;
      case "year":
        previousDate = moment().subtract(1, "years").add(1, "M");
        return this.randomizeBarData(previousDate, "MMM YY", "month", range, t);
        break;
      case "upto-date":
        previousDate = moment().startOf("year");
        return this.randomizeBarData(previousDate, "MMM YY", "month", range, t);
        break;
      case "three-year":
        previousDate = moment().subtract(3, "years").add(1, "M");
        return this.randomizeBarData(previousDate, "MMM YY", "month", range, t);
        break;
      case "five-year":
        previousDate = moment().subtract(5, "years").add(1, "M");
        return this.randomizeBarData(previousDate, "MMM YY", "month", range, t);
        break;
      default:
        previousDate = moment().subtract(6, "days");
        return this.randomizeBarData(previousDate, "DD MMM", "day", range, t);

        break;
    }
  },

  createData: function (details, options) {
    var colors =
      "colorcode" in details
        ? details.colorcode
        : ["#F3BB45", "#68B3C8", "#cccccc"];
    var range =
      "range" in details
        ? details.range
        : {
            max: 10000,
            min: 1000,
          };

    var stack = "stack" in details ? details.stack : [1, 2, 3];
    var t = "combine" in details ? true : false;
    if (
      !$.isEmptyObject(details.dataLabels) &&
      details.chartType === "horizontalBar"
    ) {
      varibles = this.randomizeData(range, details.dataLabels.length);
    } else {
      varibles = this.generateBarValue(details.labelsType, range, t);
    }
    varibles.bars = "data" in details ? details.data : varibles.bars;
    var dataSet = [];
    if ("invoice" in details) {
      temp = varibles.bars;
      tempbar = temp[2];
      temp[2] = temp[1];
      temp[1] = tempbar;
      varibles.bars = temp;
    }
    if ("line" in details) {
      var line = details.line;
      (line.data = varibles.data), dataSet.push(line);
    }
    for (let index = 0; index < details.numberOfBars; index++) {
      dataSet.push({
        label: details.barLabels[index],
        data: varibles.bars[index],
        backgroundColor: colors[index],
        borderColor: colors[index],
        categoryPercentage: 0.6,
        barPercentage: 1,
        //stack:stack[index],
        // order:order[index],
        borderWidth: 0,
      });
      if ("stack" in details) {
        dataSet[dataSet.length - 1].stack = stack[index];
      }
    }

    return {
      type: details.chartType,
      data: {
        labels: $.isEmptyObject(details.dataLabels)
          ? varibles.label
          : details.dataLabels,
        datasets: dataSet,
      },
      options: $.isEmptyObject(options) ? this.createOptions(range) : options,
    };
  },

  createOptions: function (range) {
    return {
      plugins: {
        datalabels: {
          // hide datalabels for all datasets
          display: false,
        },
      },
      legend: {
        onClick: (e) => e.stopPropagation(),
      },
      tooltips: {
        mode: "index",
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: range.min,
              max: range.max,
              userCallback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
            type: "linear",
            position: "left",
          },
        ],
      },
    };
  },

  createGraph: function (details, options) {
    chartData = this.createData(details, options);
    return new Chart($(details.graphId), chartData);
  },

  updateChart: function (event, key, chart, className, object, options) {
    event.preventDefault();
    $(className).removeClass("disabled");
    chart.destroy();
    $(key).addClass("disabled");
    return this.createGraph(object, options);
  },
};

let createDataTables = {
  createTable: function (id, dataSet, filterObject, buttonElements) {
    var createFiltersOptions = this.createFiltersOptions;
    var createFilters = this.createFilters;
    var createResetButton = this.createResetButton;
    var createResetButtonAction = this.createResetButtonAction;
    let column = [];
    if (dataSet.valueRow[0] != 0) {
      column.push({
        className: "text-right",
        targets: dataSet.valueRow,
      });
    }
    column.push({
      className: "text-center",
      targets: ["_all"],
    });
    column.push({
      // width: "8%",
      tooltip: "abc",
      targets: ["_all"],
    });
    console.log(column, "column");
    row =
      "rowsGroup" in dataSet
        ? {
            pageLength: 10,
            processing: true,
            ajax: dataSet.ajax,
            rowsGroup: dataSet.rowsGroup,
            order: [[4, "desc"]],
            columns: dataSet.columns,
            tooltip: true,
            tooltip: dataSet.columns.tooltip,
            // columnDefs: dataSet.columnDefs,
            pagingType: "full_numbers",
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, "All"],
            ],
            aaSorting: [],
            responsive: true,
            language: {
              search: "_INPUT_",
              searchPlaceholder: "Search records",
              sLengthMenu: "Number of entries _MENU_",
            },
            columnDefs: column,
            //     {
            //         "targets": !$.isEmptyObject(dataSet.colorCol) ?dataSet.colorCol:[],
            //         "createdCell": function (td, cellData, rowData, row, col) {
            //             if(cellData<5)
            //             $(td).css('background-color', 'red')
            //             if(cellData>5)
            //             $(td).css('background-color', '#FFBF00')
            //         }
            // }

            initComplete: function () {
              api = this.api();
              createFilters(buttonElements.filterId, filterObject);
              createResetButton(buttonElements);
              createFiltersOptions(filterObject, api);
              createResetButtonAction(
                buttonElements.className,
                buttonElements.select,
                filterObject,
                api
              );
              if ("fun" in dataSet) {
                init();
              }
            },
          }
        : {
            autoWidth: false,
            pageLength: 10,
            processing: true,
            ajax: dataSet.ajax,
            //rowsGroup:row,
            columns: dataSet.columns,
            tooltip: true,
            tooltip: "dataSet.tooltip",
            // columnDefs: dataSet.columnDefs,
            pagingType: "full_numbers",
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, "All"],
            ],
            aaSorting: [],
            // responsive: true,
            fixedColumns: true,
            language: {
              search: "_INPUT_",
              searchPlaceholder: "Search records",
              sLengthMenu: "Number of entries _MENU_",
            },
            columnDefs: column,
            //     {
            //         "targets": !$.isEmptyObject(dataSet.colorCol) ?dataSet.colorCol:[],
            //         "createdCell": function (td, cellData, rowData, row, col) {
            //             if(cellData<5)
            //             $(td).css('background-color', 'red')
            //             if(cellData>5)
            //             $(td).css('background-color', '#FFBF00')
            //         }
            // }

            initComplete: function () {
              api = this.api();
              createFilters(buttonElements.filterId, filterObject);
              createResetButton(buttonElements);
              createFiltersOptions(filterObject, api);
              createResetButtonAction(
                buttonElements.className,
                buttonElements.select,
                filterObject,
                api
              );
              if ("fun" in dataSet) {
                init();
              }
            },
          };

    return $(id).DataTable(row);
  },

  createFilters: function (id, filterObject) {
    filterObject.forEach((element) => {
      $(id).append(
        '<select id="' +
          element.id +
          '" class="selectpicker ' +
          element.className +
          '"' +
          'data-live-search="true" title="' +
          element.title +
          '"></select>'
      );
    });
    $(".selectpicker").selectpicker("refresh");
  },

  createFiltersOptions: function (elements, api) {
    console.log(elements, "test2");
    elements.forEach(function (ele) {
      var column = api.columns(ele.number);
      var id = "#" + ele.id;
      $(id).append('<option value="">Reset</option>');
      // addResetFunction(column, '#open-proposal_reset', '.open-proposal_select')
      column
        .data(0)
        .eq(0)
        .unique()
        .sort()
        .each(function (d, j) {
          $(id).append('<option value="' + d + '">' + d + "</option>");

          $(id).on("change", function () {
            var val = $.fn.dataTable.util.escapeRegex($(this).val());
            column.search(val ? "^" + val + "$" : "", true, false).draw();
          });
        });
    });
    $(".selectpicker").selectpicker("refresh");
  },
  createResetButton: function (element) {
    $(element.filterId).append(
      '<button type="reset" class="' +
        element.className +
        ' btn btn-warning reset">' +
        "Reset</button>"
    );
  },
  createResetButtonAction: function (buttonClass, select, filterObject, table) {
    $("." + buttonClass).click(function () {
      $("." + select).val("");
      $("." + select).selectpicker("refresh");
      filterObject.forEach(function (ele) {
        table.columns(ele.number).search("").draw();
      });
      $(this).blur();
    });
  },
};

// let createsubDataTables = {

//     createTable: function (id, dataSet, filterObject, buttonElements) {
//         console.log(dataSet.columnDefs,"dataset")
//         var createFiltersOptions = this.createFiltersOptions;
//         var createFilters = this.createFilters
//         var createResetButton = this.createResetButton;
//         var createResetButtonAction = this.createResetButtonAction;
//         let column = []
//         if (dataSet.valueRow[0] != 0) {
//             column.push({
//                 className: 'text-right',
//                 targets: dataSet.valueRow,
//             })
//         }
//         // column.push({
//         //     className: 'text-center',
//         //     targets: ['_all'],
//         // })
//         column.push({
//             width: 10,
//             targets: ['_all'],
//         })
//         console.log(column,"column");
//         row ="rowsGroup" in dataSet?
//         {
//             pageLength: 10,
//             "processing": true,
//             ajax: dataSet.ajax,
//             rowsGroup:dataSet.rowsGroup,
//             order: [
//                         [4, 'desc']
//                     ],
//             columns: dataSet.columns,
//             columnDefs: dataSet.columnDefs,
//             pagingType: "full_numbers",
//             lengthMenu: [
//                 [10, 25, 50, -1],
//                 [10, 25, 50, "All"]
//             ],
//             "aaSorting": [],
//             responsive: true,
//             language: {
//                 search: "_INPUT_",
//                 searchPlaceholder: "Search records",
//                 sLengthMenu: "Number of entries _MENU_",
//             },
//             columnDefs: column,
//             //     {
//             //         "targets": !$.isEmptyObject(dataSet.colorCol) ?dataSet.colorCol:[],
//             //         "createdCell": function (td, cellData, rowData, row, col) {
//             //             if(cellData<5)
//             //             $(td).css('background-color', 'red')
//             //             if(cellData>5)
//             //             $(td).css('background-color', '#FFBF00')
//             //         }
//             // }

//             initComplete: function () {
//                 api = this.api()
//                 console.log(filterObject,"coming")
//                 createFilters(buttonElements.filterId, filterObject)
//                 createResetButton(buttonElements)
//                 createFiltersOptions(filterObject, api);
//                 createResetButtonAction(buttonElements.className, buttonElements.select, filterObject, api)
//                 if ("fun" in dataSet) {
//                     init();
//                 }

//             }
//         }:{
//             autoWidth: true,
//             pageLength: 10,
//             "processing": true,
//             ajax: dataSet.ajax,
//             //rowsGroup:row,
//             columns: dataSet.columns,
//             // columnDefs: dataSet.columnDefs,
//             pagingType: "full_numbers",
//             lengthMenu: [
//                 [10, 25, 50, -1],
//                 [10, 25, 50, "All"]
//             ],
//             "aaSorting": [],
//             responsive: true,
//             fixedColumns: true,
//             language: {
//                 search: "_INPUT_",
//                 searchPlaceholder: "Search records",
//                 sLengthMenu: "Number of entries _MENU_",
//             },
//             columnDefs: column,
//             //     {
//             //         "targets": !$.isEmptyObject(dataSet.colorCol) ?dataSet.colorCol:[],
//             //         "createdCell": function (td, cellData, rowData, row, col) {
//             //             if(cellData<5)
//             //             $(td).css('background-color', 'red')
//             //             if(cellData>5)
//             //             $(td).css('background-color', '#FFBF00')
//             //         }
//             // }

//             initComplete: function () {
//                 api = this.api()
//                 console.log(filterObject,"test1")
//                 createFilters(buttonElements.filterId, filterObject)
//                 createResetButton(buttonElements)
//                 createFiltersOptions(filterObject, api);
//                 createResetButtonAction(buttonElements.className, buttonElements.select, filterObject, api)
//                 if ("fun" in dataSet) {
//                     init();
//                 }

//             }
//         }

//         return $(id).DataTable(row)

//     },

//     createFilters: function (id, filterObject) {
//         console.log( (id),filterObject,"test3")
//         filterObject.forEach(element => {
//             $(id).append(
//                 '<select id="' + element.id + '" class="selectpicker ' + element.className + '"' +
//                 'data-live-search="true" title="' + element.title + '"></select>'
//             )
//         })
//     },

//     createFiltersOptions: function (elements, api) {
//         console.log(elements,"test2")
//         elements.forEach(function (ele) {
//             var column = api.columns(ele.number);
//             var id = "#" + ele.id
//             $(id).append('<option value="">Reset</option>')
//             // addResetFunction(column, '#open-proposal_reset', '.open-proposal_select')
//             column.data(0).eq(0).unique().sort().each(function (d, j) {
//                 $(id).append('<option value="' + d + '">' + d + '</option>')

//                 $(id).on('change', function () {
//                     var val = $.fn.dataTable.util.escapeRegex(
//                         $(this).val()
//                     );
//                     column
//                         .search(val ? '^' + val + '$' : '', true, false)
//                         .draw();
//                 });
//             });

//         })
//     },
//     createResetButton: function (element) {
//         $(element.filterId).append(
//             '<button type="reset" class="' + element.className + ' btn btn-warning reset">' +
//             'Reset</button>'
//         )
//     },
//     createResetButtonAction: function (buttonClass, select, filterObject, table) {
//         $("." + buttonClass).click(function () {
//             $("." + select).val('')
//             $("." + select).selectpicker("refresh");
//             filterObject.forEach(function (ele) {
//                 table.columns(ele.number)
//                     .search('')
//                     .draw();
//             })
//             $(this).blur()
//         })
//     },
// }

function tableData(max) {
  arr = [];
  l = 2;
  m = max - l;
  temp = 0;
  arr.push(randombetween(1, max - 2));
  arr.push(randombetween(1, max - 1 - arr[0]));
  arr.push(max - arr[0] - arr[1]);
  return arr;
}

function randombetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
