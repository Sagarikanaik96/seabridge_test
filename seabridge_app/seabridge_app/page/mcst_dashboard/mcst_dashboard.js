frappe.pages['mcst-dashboard'].on_page_load = function(wrapper) {
	var parent = $('<div class="mcst-dashboard"></div>').appendTo(wrapper);
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'MCST Dashboard',
		single_column: true
	});
page.start = 0;

	page.bpa_field = page.add_field({
		fieldname: 'bpa',
		label: __('Bank Payment Advice'),
		fieldtype:'Link',
		options:'Bank Payment Advice',
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
								"workflow_state_name": ["in", ["Submitted","Pending"]]
							}
						}
					},
		change: function() {
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
		}
	});
	
	

	
						frappe.call({method:"seabridge_app.seabridge_app.api.get_mcst_company",
							async:false, 
							callback:function(r){
								page.company_detail_field = page.add_field({
									fieldname: 'company',
									label: __('Company'),
									fieldtype:'Data',
									default:r.message,
									read_only:1
								});
							}
						})
	
	
	page.sort_selector = new frappe.ui.SortSelector({
		parent: page.wrapper.find('.page-form'),
		args: {
			sort_by: 'date',
			sort_order: 'desc',
			options: [
				{fieldname: 'date', label: __('BPA Date')},
				{fieldname: 'name', label: __('Bank Payment Advice')},
				{fieldname: 'status', label: __('Status')},
				{fieldname: 'approvals_required', label: __('Total Approvals Required')},
				{fieldname: 'current_approvers', label: __('Total Current Approvers')}
			]
		},
		change: function(sort_by, sort_order) {
			page.invoice_dashboard.sort_by = sort_by;
			page.invoice_dashboard.sort_order = sort_order;
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
		}
	});

	frappe.require('/assets/seabridge_app/js/mcst_dashboard.min.js', function() {
		page.invoice_dashboard = new seabridge_app.ActionTable({
			parent: page.main,
		})

		page.invoice_dashboard.before_refresh = function() {
			this.bpa = page.bpa_field.get_value();
			this.company=page.company_detail_field.get_value();
			this.status=page.status_field.get_value();
			
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



