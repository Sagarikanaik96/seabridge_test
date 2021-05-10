frappe.pages['finance-action-list'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Payment Batch',
		single_column: true
	});
page.start = 0;


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
		reqd:1,
		change: function() {
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
			if(page.account_field){
				frappe.db.get_value("Bank Account",{'company':page.company_field.get_value(),'is_default':1},"name",(c)=>{
				if(c.name){
				page.account_field.set_value(c.name)
				}
				else{page.account_field.set_value('')}
				})
			}
			else{
			frappe.db.get_value("Bank Account",{'company':page.company_field.get_value(),'is_default':1},"name",(c)=>{
				if(c.name){
				page.account_field = page.add_field({
					fieldname: 'account',
					label: __('Bank account'),
					fieldtype:'Link',
					options:'Bank Account',
					get_query: () => {
									return {
										filters: {
											"company": ["in", [page.company_field.get_value()]]
										}
									}
								},
					reqd:1,
					default:c.name,
					change: function() {
						page.invoice_dashboard.start = 0;
						page.invoice_dashboard.refresh();
					}
				});
				}
				else{
					page.account_field = page.add_field({
					fieldname: 'account',
					label: __('Bank account'),
					fieldtype:'Link',
					options:'Bank Account',
					get_query: () => {
									return {
										filters: {
											"company": ["in", [page.company_field.get_value()]]
										}
									}
								},
					reqd:1,
					change: function() {
						page.invoice_dashboard.start = 0;
						page.invoice_dashboard.refresh();
					}
				});
					
				}
			})
			} 
			
		}
	});
	
	page.supplier_field = page.add_field({
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

	frappe.require('/assets/seabridge_app/js/payment_page.min.js', function() {
		page.invoice_dashboard = new seabridge_app.ActionTable({
			parent: page.main,
		})

		page.invoice_dashboard.before_refresh = function() {
			this.company = page.company_field.get_value();
			if(page.account_field){
			this.account=page.account_field.get_value();}
			this.supplier = page.supplier_field.get_value();
			this.purchase_invoice = page.invoice_field.get_value();
		}

		page.invoice_dashboard.refresh();

		// item click
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
