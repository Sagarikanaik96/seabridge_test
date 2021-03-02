frappe.pages['dashboardpage'].on_page_load = function(wrapper) {
	console.log("Indashboard------------")
	var parent = $('<div class="dashboardpage"></div>').appendTo(wrapper);

	//parent.html(frappe.render_template("dashboardpage", {}));
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Dashboard',
		single_column: true
	});
page.start = 0;

	

	page.item_field = page.add_field({
		fieldname: 'supplier',
		label: __('Vendor'),
		fieldtype:'Link',
		options:'Supplier',
		change: function() {
			page.item_dashboard.start = 0;
			page.item_dashboard.refresh();
		}
	});
	page.invoice_field = page.add_field({
		fieldname: 'purchase_invoice',
		label: __('Purchase Invoice'),
		fieldtype:'Link',
		options:'Purchase Invoice',
		change: function() {
			page.item_dashboard.start = 0;
			page.item_dashboard.refresh();
		}
	});

	page.match_field = page.add_field({
		fieldname: 'match',
		label: __('Match'),
		fieldtype:'Select',
		options:['Y','N'],
		change: function() {
			page.item_dashboard.start = 0;
			page.item_dashboard.refresh();
		}
	});

	page.sort_selector = new frappe.ui.SortSelector({
		parent: page.wrapper.find('.page-form'),
		args: {
			sort_by: 'purchase_invoice',
			sort_order: 'asc',
			options: [
				{fieldname: 'purchase_invoice', label: __('Purchase Invoice')},
				{fieldname: 'reserved_qty', label: __('Reserved for sale')},
				{fieldname: 'reserved_qty_for_production', label: __('Reserved for manufacturing')},
				{fieldname: 'reserved_qty_for_sub_contract', label: __('Reserved for sub contracting')},
				{fieldname: 'actual_qty', label: __('Actual qty in stock')},
			]
		},
		change: function(sort_by, sort_order) {
			page.item_dashboard.sort_by = sort_by;
			page.item_dashboard.sort_order = sort_order;
			page.item_dashboard.start = 0;
			page.item_dashboard.refresh();
		}
	});

	 //page.sort_selector.wrapper.css({'margin-right': '15px', 'margin-top': '4px'});

	frappe.require('assets/seabridge_app/js/item-dashboard.min.js', function() {
		page.item_dashboard = new erpnext.stock.ItemDashboard({
			parent: page.main,
		})

		page.item_dashboard.before_refresh = function() {
			this.supplier = page.item_field.get_value();
			this.purchase_invoice = page.invoice_field.get_value();
			this.match = page.match_field.get_value();
		}

		page.item_dashboard.refresh();

		// item click
		var setup_click = function(doctype) {
			console.log("Doctype-------------",doctype)
			page.main.on('click', 'a[data-type="'+ doctype.toLowerCase() +'"]', function() {
				var name = $(this).attr('data-name');
				console.log(name)
				var field = page[doctype.toLowerCase() + '_field'];
				if(field.get_value()===name) {
					frappe.set_route('Form', doctype, name)
				} else {
					field.set_input(name);
					page.item_dashboard.refresh();
				}
			});
		}

		setup_click('Purchase Invoice');
		setup_click('Warehouse');
	});
}



