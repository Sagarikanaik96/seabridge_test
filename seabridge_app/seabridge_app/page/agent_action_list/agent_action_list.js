frappe.pages['agent-action-list'].on_page_load = function(wrapper) {
	var parent = $('<div class="agent-action-list"></div>').appendTo(wrapper);
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Action Table',
		single_column: true
	});
page.start = 0;

	frappe.call({method:"seabridge_app.seabridge_app.api.get_user_roles_dashboard",
				async:false, 
				callback:function(r){
					if(r.message==2){
					page.company_field = page.add_field({
						fieldname: 'company',
						label: __('Company'),
						fieldtype:'Link',
						options:'Company',
						get_query: () => {
										return {
											filters: {
												"company_type": ["in", ["Customer"]]
											}
										}
									},
						
						change: function() {
							page.invoice_dashboard.start = 0;
							page.invoice_dashboard.refresh();
						}
					});
					}
				}
			})

	page.item_field = page.add_field({
		fieldname: 'supplier',
		label: __('Vendor'),
		fieldtype:'Link',
		options:'Supplier',
		change: function() {
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
		}
	});
	page.invoice_field = page.add_field({
		fieldname: 'purchase_invoice',
		label: __('Purchase Invoice'),
		fieldtype:'Link',
		options:'Purchase Invoice',
		change: function() {
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
		}
	});
	page.status_field = page.add_field({
		fieldname: 'status',
		label: __('Status'),
		fieldtype:'Link',
		options:'Workflow State',
		get_query: () => {
						return {
							filters: {
								"workflow_state_name": ["in", ["Draft","To Pay","Rejected","Paid","Pending"]]
							}
						}
					},
		change: function() {
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
		}
	});

	frappe.call({method:"seabridge_app.seabridge_app.api.get_user_roles_dashboard",
				async:false, 
				callback:function(r){
					if(r.message==1){
						page.match_field = page.add_field({
							fieldname: 'match',
							label: __('Match'),
							fieldtype:'Select',
							options:['','Y','N'],
							change: function() {
								page.invoice_dashboard.start = 0;
								page.invoice_dashboard.refresh();
							}
						});
						frappe.call({method:"seabridge_app.seabridge_app.api.get_estate_company_detail",
							async:false, 
							callback:function(r){
								page.company_detail_field = page.add_field({
									fieldname: 'company_detail',
									label: __('Company Detail'),
									fieldtype:'Data',
									default:r.message,
									read_only:1
								});
							}
						})
							
					}
				}
	})


	
	page.sort_selector = new frappe.ui.SortSelector({
		parent: page.wrapper.find('.page-form'),
		args: {
			sort_by: 'invoice_date',
			sort_order: 'desc',
			options: [
				{fieldname: 'invoice_date', label: __('Invoice Due Date')},
				{fieldname: 'po_date', label: __('PO Date')},
				{fieldname: 'status', label: __('Status')},
			]
		},
		change: function(sort_by, sort_order) {
			page.invoice_dashboard.sort_by = sort_by;
			page.invoice_dashboard.sort_order = sort_order;
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
		}
	});

	frappe.require('/assets/seabridge_app/js/item-dashboard.min.js', function() {
		page.invoice_dashboard = new seabridge_app.ActionTable({
			parent: page.main,
		})

		page.invoice_dashboard.before_refresh = function() {
			this.supplier = page.item_field.get_value();
			this.purchase_invoice = page.invoice_field.get_value();
			this.status = page.status_field.get_value();
			
			var role_check=0
			frappe.call({method:"seabridge_app.seabridge_app.api.get_user_roles_dashboard",
				async:false,
				callback:function(r){
					if(r.message==2){
					role_check=2
					}
					else if(r.message==1){
						role_check=1
					}
				}
			})
			if(role_check==2){
				this.company = page.company_field.get_value();
			}
			else if(role_check==1){
				this.match = page.match_field.get_value();
			}
			else{this.match =''}
		}

		page.invoice_dashboard.refresh();

		var setup_click = function(doctype) {
			page.main.on('click', 'a[data-type="'+ doctype.toLowerCase() +'"]', function() {
				var name = $(this).attr('data-name');
				var field = page[doctype.toLowerCase() + '_field'];
				if(field.get_value()===name) {
					frappe.set_route('Form', doctype, name)
				} else {
					field.set_input(name);
					page.invoice_dashboard.refresh();
				}
			});
		}

		setup_click('Purchase Invoice');
	});
}



