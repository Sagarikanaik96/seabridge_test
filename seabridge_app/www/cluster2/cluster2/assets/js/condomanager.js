condomanagerdashboard = {
     
    
    initdataTable: function () {
        var condodata = [
        { "vendor":"HOME CLICK PTE LTD", "invoice":"INV-00265", "poamount":"600.00", "invamount":"696.00", "allocatedbudget":"700.00", "purchaseorderdate":"8/19/2020", "invoiceduedate":"10/1/2020", "match":"Y", "pendingwith":"Name (Role)", "status":"MC Approved" },
        {"vendor":"F1 RECREATION  LEASING PTE LTD","invoice":"INV-202008/0261", "poamount":"500.00", "invamount":"592.06", "allocatedbudget":"600.00", "purchaseorderdate":"8/19/2020", "invoiceduedate":"10/1/2020", "match":"Y", "pendingwith":"Name (Role)", "status":"Paid"} ,
        {"vendor":"STARHUB LTD", "invoice":"8002276698092020", "poamount":"90.00", "invamount":"92.00", "allocatedbudget":"100.00", "purchaseorderdate":"8/19/2020", "invoiceduedate":"10/1/2020", "match":"Y", "pendingwith":"Name (Role)", "status":"Pending"},
        ]
        var condomanagerdata = [
            {"invoice":"INV-00265", "poamount":"696", "invamount":"696", "purchaseorderdate":"8/19/2020", "invoiceduedate":"10/1/2020", "paiddate":"8/31/2020" },
            ]

      let elementArray = [
       
        {
          id: "condo-title",
          title: "Vendor",
          number: 2,
          className: "col-md-3 condo-select",
        },
        {
          id: "condo-match",
          title: "Macth",
          number: 8,
          className: "col-md-3 condo-select",
        },
  
        {
          id: "condo-pending",
          title: "Pending With",
          number: 9,
          className: "col-md-3 condo-select",
        },
      ];
  
      let dataSet = {
        data:condodata,
        columns: [
          {
            data: null,
            width: "1%",
            class: "text-break text-center",
            render: function (data, row) {
              return '<input name="product" class="checkbox" type="checkbox">';
            },
            
          },
          {
            data: "vendor",
            width: "13%",
            class: "text-break text-center",
          },
          {
            data: "invoice",
            width: "13%",
            class: "text-break text-center",
            render: function (data, row) {
              return '<a href="../../assets/pdf/invoice.pdf" target="_blank">' + data + '</a>';
            },
            
          },
          {
            data: "poamount",
            width: "10%",
            class: "text-break text-right",
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
            data: "purchaseorderdate",
            width: "12%",
            class: "text-break text-center",
          },
          {
            data: "invoiceduedate",
            width: "7%",
            class: "text-break text-center",
          },
          {
            data: "match",
            class: "text-break text-center",
          },
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
            width: "6%",
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
                          class="btn btn-primary btn-success btn-sm btn-fill condo-btn">${data}</button>`;
              }
              
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
        ];
        dataSet = {
          data:condomanagerdata,
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
              data: dataSet.data,
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
              data: dataSet.data,
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