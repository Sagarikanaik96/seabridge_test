frappe.provide("erpnext");
frappe.provide("erpnext.utils");

$.extend(erpnext, {
	get_currency: function(company) {
		if(!company && cur_frm)
			company = cur_frm.doc.company;
		if(company)
			return frappe.get_doc(":Company", company).default_currency || frappe.boot.sysdefaults.currency;
		else
			return frappe.boot.sysdefaults.currency;
	},

	get_presentation_currency_list: () => {
		const docs = frappe.boot.docs;
		let currency_list = docs.filter(d => d.doctype === ":Currency").map(d => d.name);
		currency_list.unshift("");
		return currency_list;
	},

	toggle_naming_series: function() {
		if(cur_frm.fields_dict.naming_series) {
			cur_frm.toggle_display("naming_series", cur_frm.doc.__islocal?true:false);
		}
	},

	hide_company: function() {
		if(cur_frm.fields_dict.company) {
			var companies = Object.keys(locals[":Company"] || {});
			if(companies.length === 1) {
				if(!cur_frm.doc.company) cur_frm.set_value("company", companies[0]);
				cur_frm.toggle_display("company", false);
			} else if(erpnext.last_selected_company) {
				if(!cur_frm.doc.company) cur_frm.set_value("company", erpnext.last_selected_company);
			}
		}
	},

	is_perpetual_inventory_enabled: function(company) {
		if(company) {
			return frappe.get_doc(":Company", company).enable_perpetual_inventory
		}
	},

	stale_rate_allowed: () => {
		return cint(frappe.boot.sysdefaults.allow_stale);
	},

	setup_serial_no: function() {
		var grid_row = cur_frm.open_grid_row();
		if(!grid_row || !grid_row.grid_form.fields_dict.serial_no ||
			grid_row.grid_form.fields_dict.serial_no.get_status()!=="Write") return;

		var $btn = $('<button class="btn btn-sm btn-default">'+__("Add Serial No")+'</button>')
			.appendTo($("<div>")
				.css({"margin-bottom": "10px", "margin-top": "10px"})
				.appendTo(grid_row.grid_form.fields_dict.serial_no.$wrapper));

		var me = this;
		$btn.on("click", function() {
			let callback = '';
			let on_close = '';

			frappe.model.get_value('Item', {'name':grid_row.doc.item_code}, 'has_serial_no',
				(data) => {
					if(data) {
						grid_row.doc.has_serial_no = data.has_serial_no;
						me.show_serial_batch_selector(grid_row.frm, grid_row.doc,
							callback, on_close, true);
					}
				}
			);
		});
	},

	route_to_adjustment_jv: (args) => {
		frappe.model.with_doctype('Journal Entry', () => {
			// route to adjustment Journal Entry to handle Account Balance and Stock Value mismatch
			let journal_entry = frappe.model.get_new_doc('Journal Entry');

			args.accounts.forEach((je_account) => {
				let child_row = frappe.model.add_child(journal_entry, "accounts");
				child_row.account = je_account.account;
				child_row.debit_in_account_currency = je_account.debit_in_account_currency;
				child_row.credit_in_account_currency = je_account.credit_in_account_currency;
				child_row.party_type = "" ;
			});
			frappe.set_route('Form','Journal Entry', journal_entry.name);
		});
	}
});


$.extend(erpnext.utils, {
	set_party_dashboard_indicators: function(frm) {
		if(frm.doc.__onload && frm.doc.__onload.dashboard_info) {
			var company_wise_info = frm.doc.__onload.dashboard_info;
			if(company_wise_info.length > 1) {
				company_wise_info.forEach(function(info) {
					erpnext.utils.add_indicator_for_multicompany(frm, info);
				});
			} else if (company_wise_info.length === 1) {
				frm.dashboard.add_indicator(__('Annual Billing: {0}',
					[format_currency(company_wise_info[0].billing_this_year, company_wise_info[0].currency)]), 'blue');
				frm.dashboard.add_indicator(__('Total Unpaid: {0}',
					[format_currency(company_wise_info[0].total_unpaid, company_wise_info[0].currency)]),
				company_wise_info[0].total_unpaid ? 'orange' : 'green');

				if(company_wise_info[0].loyalty_points) {
					frm.dashboard.add_indicator(__('Loyalty Points: {0}',
						[company_wise_info[0].loyalty_points]), 'blue');
				}
			}
		}
	},

	add_indicator_for_multicompany: function(frm, info) {
		frm.dashboard.stats_area.removeClass('hidden');
		frm.dashboard.stats_area_row.addClass('flex');
		frm.dashboard.stats_area_row.css('flex-wrap', 'wrap');

		var color = info.total_unpaid ? 'orange' : 'green';

		var indicator = $('<div class="flex-column col-xs-6">'+
			'<div style="margin-top:10px"><h6>'+info.company+'</h6></div>'+

			'<div class="badge-link small" style="margin-bottom:10px"><span class="indicator blue">'+
			'Annual Billing: '+format_currency(info.billing_this_year, info.currency)+'</span></div>'+

			'<div class="badge-link small" style="margin-bottom:10px">'+
			'<span class="indicator '+color+'">Total Unpaid: '
			+format_currency(info.total_unpaid, info.currency)+'</span></div>'+


			'</div>').appendTo(frm.dashboard.stats_area_row);

		if(info.loyalty_points){
			$('<div class="badge-link small" style="margin-bottom:10px"><span class="indicator blue">'+
			'Loyalty Points: '+info.loyalty_points+'</span></div>').appendTo(indicator);
		}

		return indicator;
	},

	get_party_name: function(party_type) {
		var dict = {'Customer': 'customer_name', 'Supplier': 'supplier_name', 'Employee': 'employee_name',
			'Member': 'member_name'};
		return dict[party_type];
	},

	copy_value_in_all_rows: function(doc, dt, dn, table_fieldname, fieldname) {
		var d = locals[dt][dn];
		if(d[fieldname]){
			var cl = doc[table_fieldname] || [];
			for(var i = 0; i < cl.length; i++) {
				if(!cl[i][fieldname]) cl[i][fieldname] = d[fieldname];
			}
		}
		refresh_field(table_fieldname);
	},

	get_terms: function(tc_name, doc, callback) {
		if(tc_name) {
			return frappe.call({
				method: 'erpnext.setup.doctype.terms_and_conditions.terms_and_conditions.get_terms_and_conditions',
				args: {
					template_name: tc_name,
					doc: doc
				},
				callback: function(r) {
					callback(r)
				}
			});
		}
	},

	make_bank_account: function(doctype, docname) {
		frappe.call({
			method: "erpnext.accounts.doctype.bank_account.bank_account.make_bank_account",
			args: {
				doctype: doctype,
				docname: docname
			},
			freeze: true,
			callback: function(r) {
				var doclist = frappe.model.sync(r.message);
				frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
			}
		})
	},

	add_dimensions: function(report_name, index) {
		let filters = frappe.query_reports[report_name].filters;

		erpnext.dimension_filters.forEach((dimension) => {
			let found = filters.some(el => el.fieldname === dimension['fieldname']);

			if (!found) {
				filters.splice(index, 0 ,{
					"fieldname": dimension["fieldname"],
					"label": __(dimension["label"]),
					"fieldtype": "Link",
					"options": dimension["document_type"]
				});
			}
		});
	},

	make_subscription: function(doctype, docname) {
		frappe.call({
			method: "frappe.automation.doctype.auto_repeat.auto_repeat.make_auto_repeat",
			args: {
				doctype: doctype,
				docname: docname
			},
			callback: function(r) {
				var doclist = frappe.model.sync(r.message);
				frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
			}
		})
	},

	make_pricing_rule: function(doctype, docname) {
		frappe.call({
			method: "erpnext.accounts.doctype.pricing_rule.pricing_rule.make_pricing_rule",
			args: {
				doctype: doctype,
				docname: docname
			},
			callback: function(r) {
				var doclist = frappe.model.sync(r.message);
				frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
			}
		})
	},

	/**
	* Checks if the first row of a given child table is empty
	* @param child_table - Child table Doctype
	* @return {Boolean}
	**/
	first_row_is_empty: function(child_table){
		if($.isArray(child_table) && child_table.length > 0) {
			return !child_table[0].item_code;
		}
		return false;
	},

	/**
	* Removes the first row of a child table if it is empty
	* @param {_Frm} frm - The current form
	* @param {String} child_table_name - The child table field name
	* @return {Boolean}
	**/
	remove_empty_first_row: function(frm, child_table_name){
		const rows = frm['doc'][child_table_name];
		if (this.first_row_is_empty(rows)){
			frm['doc'][child_table_name] = rows.splice(1);
		}
		return rows;
	},
	get_tree_options: function(option) {
		// get valid options for tree based on user permission & locals dict
		let unscrub_option = frappe.model.unscrub(option);
		let user_permission = frappe.defaults.get_user_permissions();
		let options;

		if(user_permission && user_permission[unscrub_option]) {
			options = user_permission[unscrub_option].map(perm => perm.doc);
		} else {
			options = $.map(locals[`:${unscrub_option}`], function(c) { return c.name; }).sort();
		}

		// filter unique values, as there may be multiple user permissions for any value
		return options.filter((value, index, self) => self.indexOf(value) === index);
	},
	get_tree_default: function(option) {
		// set default for a field based on user permission
		let options = this.get_tree_options(option);
		if(options.includes(frappe.defaults.get_default(option))) {
			return frappe.defaults.get_default(option);
		} else {
			return options[0];
		}
	},
	copy_parent_value_in_all_row: function(doc, dt, dn, table_fieldname, fieldname, parent_fieldname) {
		var d = locals[dt][dn];
		if(d[fieldname]){
			var cl = doc[table_fieldname] || [];
			for(var i = 0; i < cl.length; i++) {
				cl[i][fieldname] = doc[parent_fieldname];
			}
		}
		refresh_field(table_fieldname);
	},

	create_new_doc: function (doctype, update_fields) {
		frappe.model.with_doctype(doctype, function() {
			var new_doc = frappe.model.get_new_doc(doctype);
			for (let [key, value] of Object.entries(update_fields)) {
				new_doc[key] = value;
			}
			frappe.ui.form.make_quick_entry(doctype, null, null, new_doc);
		});
	}

});

erpnext.utils.select_alternate_items = function(opts) {
	const frm = opts.frm;
	const warehouse_field = opts.warehouse_field || 'warehouse';
	const item_field = opts.item_field || 'item_code';

	this.data = [];
	const dialog = new frappe.ui.Dialog({
		title: __("Select Alternate Item"),
		fields: [
			{fieldtype:'Section Break', label: __('Items')},
			{
				fieldname: "alternative_items", fieldtype: "Table", cannot_add_rows: true,
				in_place_edit: true, data: this.data,
				get_data: () => {
					return this.data;
				},
				fields: [{
					fieldtype:'Data',
					fieldname:"docname",
					hidden: 1
				}, {
					fieldtype:'Link',
					fieldname:"item_code",
					options: 'Item',
					in_list_view: 1,
					read_only: 1,
					label: __('Item Code')
				}, {
					fieldtype:'Link',
					fieldname:"alternate_item",
					options: 'Item',
					default: "",
					in_list_view: 1,
					label: __('Alternate Item'),
					onchange: function() {
						const item_code = this.get_value();
						const warehouse = this.grid_row.on_grid_fields_dict.warehouse.get_value();
						if (item_code && warehouse) {
							frappe.call({
								method: "erpnext.stock.utils.get_latest_stock_qty",
								args: {
									item_code: item_code,
									warehouse: warehouse
								},
								callback: (r) => {
									this.grid_row.on_grid_fields_dict
										.actual_qty.set_value(r.message || 0);
								}
							})
						}
					},
					get_query: (e) => {
						return {
							query: "erpnext.stock.doctype.item_alternative.item_alternative.get_alternative_items",
							filters: {
								item_code: e.item_code
							}
						};
					}
				}, {
					fieldtype:'Link',
					fieldname:"warehouse",
					options: 'Warehouse',
					default: "",
					in_list_view: 1,
					label: __('Warehouse'),
					onchange: function() {
						const warehouse = this.get_value();
						const item_code = this.grid_row.on_grid_fields_dict.item_code.get_value();
						if (item_code && warehouse) {
							frappe.call({
								method: "erpnext.stock.utils.get_latest_stock_qty",
								args: {
									item_code: item_code,
									warehouse: warehouse
								},
								callback: (r) => {
									this.grid_row.on_grid_fields_dict
										.actual_qty.set_value(r.message || 0);
								}
							})
						}
					},
				}, {
					fieldtype:'Float',
					fieldname:"actual_qty",
					default: 0,
					read_only: 1,
					in_list_view: 1,
					label: __('Available Qty')
				}]
			},
		],
		primary_action: function() {
			const args = this.get_values()["alternative_items"];
			const alternative_items = args.filter(d => {
				if (d.alternate_item && d.item_code != d.alternate_item) {
					return true;
				}
			});

			alternative_items.forEach(d => {
				let row = frappe.get_doc(opts.child_doctype, d.docname);
				let qty = null;
				if (row.doctype === 'Work Order Item') {
					qty = row.required_qty;
				} else {
					qty = row.qty;
				}
				row[item_field] = d.alternate_item;
				frm.script_manager.trigger(item_field, row.doctype, row.name)
					.then(() => {
						frappe.model.set_value(row.doctype, row.name, 'qty', qty);
						frappe.model.set_value(row.doctype, row.name,
							opts.original_item_field, d.item_code);
					});
			});

			refresh_field(opts.child_docname);
			this.hide();
		},
		primary_action_label: __('Update')
	});

	frm.doc[opts.child_docname].forEach(d => {
		if (!opts.condition || opts.condition(d)) {
			dialog.fields_dict.alternative_items.df.data.push({
				"docname": d.name,
				"item_code": d[item_field],
				"warehouse": d[warehouse_field],
				"actual_qty": d.actual_qty
			});
		}
	})

	this.data = dialog.fields_dict.alternative_items.df.data;
	dialog.fields_dict.alternative_items.grid.refresh();
	dialog.show();
}

erpnext.utils.update_child_items = function(opts) {
	const frm = opts.frm;
	const cannot_add_row = (typeof opts.cannot_add_row === 'undefined') ? true : opts.cannot_add_row;
	const child_docname = (typeof opts.cannot_add_row === 'undefined') ? "items" : opts.child_docname;
	this.data = [];
	const fields = [{
		fieldtype:'Data',
		fieldname:"docname",
		read_only: 1,
		hidden: 1,
	}, {
		fieldtype:'Link',
		fieldname:"item_code",
		options: 'Item',
		in_list_view: 1,
		read_only: 0,
		disabled: 0,
		label: __('Item Code')
	}, {
		fieldtype:'Float',
		fieldname:"qty",
		default: 0,
		read_only: 0,
		in_list_view: 1,
		label: __('Qty')
	}, {
		fieldtype:'Currency',
		fieldname:"rate",
		default: 0,
		read_only: 0,
		in_list_view: 1,
		label: __('Rate')
	}];

	if (frm.doc.doctype == 'Sales Order' || frm.doc.doctype == 'Purchase Order' ) {
		fields.splice(2, 0, {
			fieldtype: 'Date',
			fieldname: frm.doc.doctype == 'Sales Order' ? "delivery_date" : "schedule_date",
			in_list_view: 1,
			label: frm.doc.doctype == 'Sales Order' ? __("Delivery Date") : __("Reqd by date"),
			reqd: 1
		})
		fields.splice(3, 0, {
			fieldtype: 'Float',
			fieldname: "conversion_factor",
			in_list_view: 1,
			label: __("Conversion Factor")
		})
	}

	const dialog = new frappe.ui.Dialog({
		title: __("Update Items"),
		fields: [
			{
				fieldname: "trans_items",
				fieldtype: "Table",
				label: "Items",
				cannot_add_rows: cannot_add_row,
				in_place_edit: true,
				reqd: 1,
				data: this.data,
				get_data: () => {
					return this.data;
				},
				fields: fields
			},
		],
		primary_action: function() {
			const trans_items = this.get_values()["trans_items"];
			frappe.call({
				method: 'erpnext.controllers.accounts_controller.update_child_qty_rate',
				freeze: true,
				args: {
					'parent_doctype': frm.doc.doctype,
					'trans_items': trans_items,
					'parent_doctype_name': frm.doc.name,
					'child_docname': child_docname
				},
				callback: function() {
					frm.reload_doc();
				}
			});
			this.hide();
			refresh_field("items");
		},
		primary_action_label: __('Update')
	});

	frm.doc[opts.child_docname].forEach(d => {
		dialog.fields_dict.trans_items.df.data.push({
			"docname": d.name,
			"name": d.name,
			"item_code": d.item_code,
			"delivery_date": d.delivery_date,
			"schedule_date": d.schedule_date,
			"conversion_factor": d.conversion_factor,
			"qty": d.qty,
			"rate": d.rate,
		});
		this.data = dialog.fields_dict.trans_items.df.data;
		dialog.fields_dict.trans_items.grid.refresh();
	})
	dialog.show();
}

erpnext.utils.map_current_doc = function(opts) {
	let query_args = {};
	if (opts.get_query_filters) {
		query_args.filters = opts.get_query_filters;
	}

	if (opts.get_query_method) {
		query_args.query = opts.get_query_method;
	}

	if (query_args.filters || query_args.query) {
		opts.get_query = () => {
			return query_args;
		}
	}
	var _map = function() {
		if($.isArray(cur_frm.doc.items) && cur_frm.doc.items.length > 0) {
			// remove first item row if empty
			if(!cur_frm.doc.items[0].item_code) {
				cur_frm.doc.items = cur_frm.doc.items.splice(1);
			}

			// find the doctype of the items table
			var items_doctype = frappe.meta.get_docfield(cur_frm.doctype, 'items').options;

			// find the link fieldname from items table for the given
			// source_doctype
			var link_fieldname = null;
			frappe.get_meta(items_doctype).fields.forEach(function(d) {
				if(d.options===opts.source_doctype) link_fieldname = d.fieldname; });

			// search in existing items if the source_name is already set and full qty fetched
			var already_set = false;
			var item_qty_map = {};

			$.each(cur_frm.doc.items, function(i, d) {
				opts.source_name.forEach(function(src) {
					if(d[link_fieldname]==src) {
						already_set = true;
						if (item_qty_map[d.item_code])
							item_qty_map[d.item_code] += flt(d.qty);
						else
							item_qty_map[d.item_code] = flt(d.qty);
					}
				});
			});
			if(already_set) {
				opts.source_name.forEach(function(src) {
					frappe.model.with_doc(opts.source_doctype, src, function(r) {
						var source_doc = frappe.model.get_doc(opts.source_doctype, src);
						$.each(source_doc.items || [], function(i, row) {
							if(row.qty > flt(item_qty_map[row.item_code])) {
								already_set = false;
								return false;
							}
						})
					})

					if(already_set) {
						frappe.msgprint(__("You have already selected items from {0} {1}",
							[opts.source_doctype, src]));
						return;
					}

				})
			}
		}

		return frappe.call({
			// Sometimes we hit the limit for URL length of a GET request
			// as we send the full target_doc. Hence this is a POST request.
			type: "POST",
			method: 'frappe.model.mapper.map_docs',
			args: {
				"method": opts.method,
				"source_names": opts.source_name,
				"target_doc": cur_frm.doc,
				"args": opts.args
			},
			callback: function(r) {
				if(!r.exc) {
					var doc = frappe.model.sync(r.message);
					cur_frm.dirty();
					cur_frm.refresh();
				}
			}
		});
	}
	if(opts.source_doctype) {
		var d = new frappe.ui.form.MultiSelectDialog({
			doctype: opts.source_doctype,
			target: opts.target,
			date_field: opts.date_field || undefined,
			setters: opts.setters,
			get_query: opts.get_query,
			action: function(selections, args) {
				let values = selections;
				if(values.length === 0){
					frappe.msgprint(__("Please select {0}", [opts.source_doctype]))
					return;
				}
				opts.source_name = values;
				opts.setters = args;
				d.dialog.hide();
				_map();
			},
		});
	} else if(opts.source_name) {
		opts.source_name = [opts.source_name];
		_map();
	}
}

frappe.form.link_formatters['Item'] = function(value, doc) {
	if(doc && doc.item_name && doc.item_name !== value) {
		return value? value + ': ' + doc.item_name: doc.item_name;
	} else {
		return value;
	}
}

frappe.form.link_formatters['Employee'] = function(value, doc) {
	if(doc && doc.employee_name && doc.employee_name !== value) {
		return value? value + ': ' + doc.employee_name: doc.employee_name;
	} else {
		return value;
	}
}

// add description on posting time
$(document).on('app_ready', function() {
	if(!frappe.datetime.is_timezone_same()) {
		$.each(["Stock Reconciliation", "Stock Entry", "Stock Ledger Entry",
			"Delivery Note", "Purchase Receipt", "Sales Invoice"], function(i, d) {
			frappe.ui.form.on(d, "onload", function(frm) {
				cur_frm.set_df_property("posting_time", "description",
					frappe.sys_defaults.time_zone);
			});
		});
	}
});






























frappe.ui.form.MultiSelectDialog = class MultiSelectDialog {
	constructor(opts) {
		/* Options: doctype, target, setters, get_query, action, add_filters_group, data_fields, primary_action_label */
		Object.assign(this, opts);
		var me = this;
		if (this.doctype != "[Select]") {
			frappe.model.with_doctype(this.doctype, function () {
				me.make();
			});
		} else {
			this.make();
		}
	}

	make() {
		let me = this;
		this.page_length = 20;
		this.start = 0;
		let fields = this.get_primary_filters();
		// Make results area
		fields = fields.concat([
			{ fieldtype: "HTML", fieldname: "results_area" },
			{
				fieldtype: "Button", fieldname: "more_btn", label: __("More"),
				click: () => {
					if(this.target['window']){
						this.start = 0;
						this.page_length +=20;
					}
					else{
						this.start += 20;
					}
					this.get_results();
				}
			}
		]);

		// Custom Data Fields
		if (this.data_fields) {
			fields.push({ fieldtype: "Section Break" });
			fields = fields.concat(this.data_fields);
		}
		let doctype_plural = this.doctype.plural();

		if(this.doctype=="Purchase Invoice"){
			if(this.target['window']){
				let supplier = this.get_query ? this.get_query().filters : {} || {};
				var title1=supplier['supplier'][1]
				this.dialog = new frappe.ui.Dialog({
				title:title1.concat(" - Paid Invoices"),
				fields:fields,
				secondary_action: function (e) {
				}
				});
			}
			else{
				this.dialog = new frappe.ui.Dialog({
				title: __("Select {0}", [(this.doctype == '[Select]') ? __("value") : __(doctype_plural)]),
				fields: fields,
				primary_action_label: this.primary_action_label || __("Set Invoices"),
				primary_action: function () {
					let filters_data = me.get_custom_filters();
					me.action(me.get_checked_values(), cur_dialog.get_values(), me.args, filters_data);
				}
			});
			}
			
		}
		else{		

			this.dialog = new frappe.ui.Dialog({
				title: __("Select {0}", [(this.doctype == '[Select]') ? __("value") : __(doctype_plural)]),
				fields: fields,
				primary_action_label: this.primary_action_label || __("Get Items"),
				secondary_action_label: __("Make {0}", [me.doctype]),
				primary_action: function () {
					let filters_data = me.get_custom_filters();
					me.action(me.get_checked_values(), cur_dialog.get_values(), me.args, filters_data);
				},
				secondary_action: function (e) {
					// If user wants to close the modal
					if (e) {
						frappe.route_options = {};
						if (Array.isArray(me.setters)) {
							for (let df of me.setters) {
								frappe.route_options[df.fieldname] = me.dialog.fields_dict[df.fieldname].get_value() || undefined;
							}
						} else {
							Object.keys(me.setters).forEach(function (setter) {
								frappe.route_options[setter] = me.dialog.fields_dict[setter].get_value() || undefined;
							});
						}

						frappe.new_doc(me.doctype, true);
					}
				}
			});
		}

		if (this.add_filters_group) {
			this.make_filter_area();
		}

		this.$parent = $(this.dialog.body);
		this.$wrapper = this.dialog.fields_dict.results_area.$wrapper.append(`<div class="results"
			style="border: 1px solid #d1d8dd; border-radius: 3px; height: 300px;overflow: auto;"></div>`);

		this.$results = this.$wrapper.find('.results');
		this.$results.append(this.make_list_row());

		this.args = {};

		this.bind_events();
		this.get_results();
		this.dialog.show();
	}

	get_primary_filters() {
		let fields = [];

		let columns = new Array(3);

		// Hack for three column layout
		// To add column break
		columns[0] = [
			{
				fieldtype: "Data",
				label: __("Search"),
				fieldname: "search_term"
			}
		];
		columns[1] = [];
		columns[2] = [];

		if ($.isArray(this.setters)) {
			this.setters.forEach((setter, index) => {
				columns[(index + 1) % 3].push(setter);
			});
		} else {
			Object.keys(this.setters).forEach((setter, index) => {
				let df_prop = frappe.meta.docfield_map[this.doctype][setter];
				// Index + 1 to start filling from index 1
				// Since Search is a standrd field already pushed
				if(this.target['window']){
					
						if(setter=="grand_total"){
							columns[(index + 1) % 3].push({
							fieldtype: df_prop.fieldtype,
							label: "Inv$",
							fieldname: setter,
							options: df_prop.options,
							default: this.setters[setter]
							});
						}
						else if(setter=="due_date"){
							columns[(index + 1) % 3].push({
							fieldtype: df_prop.fieldtype,
							label: "Invoice Date",
							fieldname: setter,
							options: df_prop.options,
							default: this.setters[setter]
							});
						} 
						else{
							columns[(index + 1) % 3].push({
							fieldtype: df_prop.fieldtype,
							label: df_prop.label,
							fieldname: setter,
							options: df_prop.options,
							default: this.setters[setter]
							});
						}
					
				}
				else{
					columns[(index + 1) % 3].push({
					fieldtype: df_prop.fieldtype,
					label: df_prop.label,
					fieldname: setter,
					options: df_prop.options,
					default: this.setters[setter]
					});
				}
			});
		}

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
		if (Object.seal) {
			Object.seal(columns);
			// now a is a fixed-size array with mutable entries
		}

		fields = [
			...columns[0],
			{ fieldtype: "Column Break" },
			...columns[1],
			{ fieldtype: "Column Break" },
			...columns[2],
			{ fieldtype: "Section Break", fieldname: "primary_filters_sb" }
		];

		if (this.add_filters_group) {
			fields.push(
				{
					fieldtype: 'HTML',
					fieldname: 'filter_area',
				}
			);
		}
		return fields;
	}

	make_filter_area() {
		this.filter_group = new frappe.ui.FilterGroup({
			parent: this.dialog.get_field('filter_area').$wrapper,
			doctype: this.doctype,
			on_change: () => {
				this.get_results();
			}
		});
	}

	get_custom_filters() {
		
		if (this.add_filters_group && this.filter_group) {
			return this.filter_group.get_filters().reduce((acc, filter) => {
				return Object.assign(acc, {
					[filter[1]]: [filter[2], filter[3]]
				});
			}, {});
		} else {
			return [];
		}
	}

	bind_events() {
		let me = this;

		this.$results.on('click', '.list-item-container', function (e) {
			if (!$(e.target).is(':checkbox') && !$(e.target).is('a')) {
				$(this).find(':checkbox').trigger('click');
			}
		});

		this.$results.on('click', '.list-item--head :checkbox', (e) => {
			this.$results.find('.list-item-container .list-row-check')
				.prop("checked", ($(e.target).is(':checked')));
		});

		this.$parent.find('.input-with-feedback').on('change', () => {
			frappe.flags.auto_scroll = false;
			this.get_results();
		});

		this.$parent.find('[data-fieldtype="Data"]').on('input', () => {
			var $this = $(this);
			clearTimeout($this.data('timeout'));
			$this.data('timeout', setTimeout(function () {
				frappe.flags.auto_scroll = false;
				me.empty_list();
				me.get_results();
			}, 300));
		});
	}

	get_checked_values() {
		// Return name of checked value.
		return this.$results.find('.list-item-container').map(function () {
			if ($(this).find('.list-row-check:checkbox:checked').length > 0) {
				return $(this).attr('data-item-name');
			}
		}).get();
	}

	get_checked_items() {
		// Return checked items with all the column values.
		let checked_values = this.get_checked_values();
		return this.results.filter(res => checked_values.includes(res.name));
	}

	make_list_row(result = {}) {
		var me = this;
		// Make a head row by default (if result not passed)
		let head = Object.keys(result).length === 0;

		let contents = ``;
		let columns = ["name"];

		if ($.isArray(this.setters)) {
			for (let df of this.setters) {
				columns.push(df.fieldname);
			}
		} else {
			columns = columns.concat(Object.keys(this.setters));
		}
		var dashboard=this.target
		columns.forEach(function (column) {
			var title=''
			if(result[column]){
			var row_value=result[column]}
			else{row_value=''}
			if(dashboard['window']){
				if(frappe.model.unscrub(column)=="Name"){title="Inv#"}
				else if(frappe.model.unscrub(column)=="Grand Total"){title="Inv$"
					var format = new Intl.NumberFormat('en-US', { 
					style: 'currency', 
					currency: 'USD', 
					minimumFractionDigits: 2, 
				    }); 
					row_value=format.format(result[column])
				}	
				else if(frappe.model.unscrub(column)=="Due Date"){title="Invoice Date"
					
				}
				else{title=frappe.model.unscrub(column)}
				if((frappe.model.unscrub(column)=="Due Date" || frappe.model.unscrub(column)=="Paid Date") && result[column]){
					var date = new Date(result[column]);
					var dd = date.getDate();
					var mm = date.getMonth()+1;
					var yyyy = date.getFullYear();
					if(dd<10){
					    dd='0'+dd;
					} 
					if(mm<10){
					    mm='0'+mm;
					} 
					var row_value= dd+'-'+mm+'-'+yyyy;
				}
				if(frappe.model.unscrub(column)=="Grand Total"){
					contents += `<div class="list-item__content ellipsis" style="text-align:right;">
				${
	head ? `<span class="ellipsis text-muted" title="${__(frappe.model.unscrub(column))}"><table><tr><td width="200">`+title+`</td></tr></table></span>`
		: (column !== "name" ? `<span class="ellipsis result-row" title="${__(result[column] || '')}"><table><tr><td width="200" align="right">`+row_value+`</td></tr></table></span>`
			: `<a href="${"#Form/" + me.doctype + "/" + result[column] || ''}" class="list-id ellipsis" title="${__(result[column] || '')}">
							<font style="color:blue;" >${__(result[column] || '')}</font></a>`)}
			</div>`;

				
				
				}
				else if(frappe.model.unscrub(column)=="Due Date"){
					contents += `<div class="list-item__content ellipsis">
					${
		head ? `<span class="ellipsis text-muted" title="${__(frappe.model.unscrub(column))}">`+title+`</span>`
			: (column !== "name" ? `<span class="ellipsis result-row" title="${__(result[column] || '')}">`+row_value+`</span>`
				: `<a href="${"#Form/" + me.doctype + "/" + result[column] || ''} "target="_blank" class="list-id ellipsis" title="${__(result[column] || '')}">
								<font style="color:blue;" >${__(result[column] || '')}</font></a>`)}
				</div>`;
				contents += `<div class="list-item__content ellipsis">
				${
	head ? `<span class="ellipsis text-muted" title="Status">Status</span>`
		: (column !== "name" ? `<span class="ellipsis result-row" title="Paid">Paid</span>`
			: `<a href="${"#Form/" + me.doctype + "/" + result[column] || ''}" class="list-id ellipsis" title="${__(result[column] || '')}">
							<font style="color:blue;" >${__(result[column] || '')}</font></a>`)}
			</div>`;
				}
				else{
				contents += `<div class="list-item__content ellipsis">
				${
	head ? `<span class="ellipsis text-muted" title="${__(frappe.model.unscrub(column))}">`+title+`</span>`
		: (column !== "name" ? `<span class="ellipsis result-row" title="${__(result[column] || '')}">`+row_value+`</span>`
			: `<a href="${"#Form/" + me.doctype + "/" + result[column] || ''} "target="_blank" class="list-id ellipsis" title="${__(result[column] || '')}">
							<font style="color:blue;" >${__(result[column] || '')}</font></a>`)}
			</div>`;				
			}
		}
		else{
			contents += `<div class="list-item__content ellipsis">
				${
	head ? `<span class="ellipsis text-muted" title="${__(frappe.model.unscrub(column))}">${__(frappe.model.unscrub(column))}</span>`
		: (column !== "name" ? `<span class="ellipsis result-row" title="${__(result[column] || '')}">${__(result[column] || '')}</span>`
			: `<a href="${"#Form/" + me.doctype + "/" + result[column] || ''}" class="list-id ellipsis" title="${__(result[column] || '')}">
							${__(result[column] || '')}</a>`)}
			</div>`;
		}
		});
		if(dashboard['window']){
			var $row = $(`<div class="list-item">
				${contents}
			</div>`);
		}
		else{
			var $row = $(`<div class="list-item">
			<div class="list-item__content" style="flex: 0 0 10px;">
				<input type="checkbox" class="list-row-check" data-item-name="${result.name}" ${result.checked ? 'checked' : ''}>
			</div>
			${contents}
		</div>`);
			
		}

		head ? $row.addClass('list-item--head')
			: $row = $(`<div class="list-item-container" data-item-name="${result.name}"></div>`).append($row);

		$(".modal-dialog .list-item--head").css("z-index", 0);
		return $row;
	}

	render_result_list(results, more = 0, empty = true) {
		var me = this;
		var more_btn = me.dialog.fields_dict.more_btn.$wrapper;

		// Make empty result set if filter is set
		if (!frappe.flags.auto_scroll && empty) {
			this.empty_list();
		}
		more_btn.hide();

		if (results.length === 0) return;
		if (more) more_btn.show();

		let checked = this.get_checked_values();

		results
			.filter(result => !checked.includes(result.name))
			.forEach(result => {
				me.$results.append(me.make_list_row(result));
			});

		if (frappe.flags.auto_scroll) {
			this.$results.animate({ scrollTop: me.$results.prop('scrollHeight') }, 500);
		}
	}

	empty_list() {
		// Store all checked items
		let checked = this.get_checked_items().map(item => {
			return {
				...item,
				checked: true
			};
		});

		// Remove **all** items
		this.$results.find('.list-item-container').remove();

		// Rerender checked items
		this.render_result_list(checked, 0, false);
	}

	get_results() {
		let me = this;
		let filters = this.get_query ? this.get_query().filters : {} || {};
		let filter_fields = [];
	
		if ($.isArray(this.setters)) {
			for (let df of this.setters) {
				filters[df.fieldname] = me.dialog.fields_dict[df.fieldname].get_value() || undefined;
				me.args[df.fieldname] = filters[df.fieldname];
				filter_fields.push(df.fieldname);
			}
		} else {
			Object.keys(this.setters).forEach(function (setter) {
				var value = me.dialog.fields_dict[setter].get_value();
				if (me.dialog.fields_dict[setter].df.fieldtype == "Data" && value) {
					filters[setter] = ["like", "%" + value + "%"];
				}
				else if (me.dialog.fields_dict[setter].df.fieldtype == "Date" && value) {
					filters[setter] = ["<=", ""+value];
					me.args[setter] = filters[setter];
					filter_fields.push(setter);
				}
				else if (me.dialog.fields_dict[setter].df.fieldtype == "Currency" && value) {
					filters[setter] = ["<=", ""+value];
					me.args[setter] = filters[setter];
					filter_fields.push(setter);
				}
				 else {
					filters[setter] = value || undefined;
					me.args[setter] = filters[setter];
					filter_fields.push(setter);
				}
			});
		}
		let filter_group = this.get_custom_filters();
		Object.assign(filters, filter_group);
		let args = {
			doctype: me.doctype,
			txt: me.dialog.fields_dict["search_term"].get_value(),
			filters: filters,
			filter_fields: filter_fields,
			start: this.start,
			page_length: this.page_length + 1,
			query: this.get_query ? this.get_query().query : '',
			as_dict: 1
		};
		frappe.call({
			type: "GET",
			method: 'frappe.desk.search.search_widget',
			no_spinner: true,
			args: args,
			callback: function (r) {
				let more = 0;
				me.results = [];
				if (r.values.length) {
					if (r.values.length > me.page_length) {
						r.values.pop();
						more = 1;
					}
					r.values.forEach(function (result) {
						result.checked = 0;
						me.results.push(result);
					});
				}
				me.render_result_list(me.results, more);
			}
		});
	}
};





var reference;
var company;
frappe.avatar = function (user, css_class, title, image_url = null) {
	let user_info;
	if (user) {
		// desk
		user_info = frappe.user_info(user);
	} else {
		// website
		let full_name = title || frappe.get_cookie("full_name");
		user_info = {
			image: image_url === null ? frappe.get_cookie("user_image") : image_url,
			fullname: full_name,
			abbr: frappe.get_abbr(full_name),
			color: frappe.get_palette(full_name)
		};
	}


	if (!css_class) {
		css_class = "avatar-small";
	}


	frappe.call({
                                method: "frappe.client.get_list",
				async:false,
                                args: {
                                    doctype: "User",
                                    fields: ["represents_company"],
                                    filters:{
                                        "email":user
                                    },
                                },
                                callback: function(p) {
                                    for(var i=0;i<p.message.length;i++){
                                        company=p.message[i].represents_company

                                    }
				}
			})

		if(company){
			frappe.call({
                                method: "frappe.client.get_list",
				async:false,
                                args: {
                                    doctype: "Company",
                                    fields: ["company_name","company_logo"],
                                    filters:{
                                        "company_name":company
                                    },
                                },
                                callback: function(p) {
                                    for(var i=0;i<p.message.length;i++){
                                        reference=p.message[i].company_logo

                                    }
				}
			})
		}

if (!title) {
	if(company){
		title = company;
	}
	else{
		title = user_info.fullname;
	}
}
if(reference){
	image_url = image_url || reference;
	const image = (window.cordova && image_url.indexOf('http') === -1) ? frappe.base_url + image_url : image_url;
	return `<span class="avatar ${css_class}" title="${title}">
	<span class="avatar-frame" style='background-image: url("${image}")'
	title="${title}"></span>
	</span>`;
}
else {
	var abbr = user_info.abbr;
	if (css_class === 'avatar-small' || css_class == 'avatar-xs') {
		abbr = abbr.substr(0, 1);
	}
	return `<span class="avatar ${css_class}" title="${title}">
	<div class="standard-image" style="background-color: ${user_info.color};">
	${abbr}</div>
	</span>`;
}

};




frappe.ui.scroll = function(element, animate, additional_offset) {
	var header_offset = $(".navbar").height() + $(".page-head").height();
	var top = $(element).offset().top - header_offset - cint(additional_offset);
	if (animate) {
		$("html, body").animate({ scrollTop: top });
	} else {
		$(window).scrollTop(top);
	}
};

frappe.get_palette = function(txt) {
	return '#fafbfc';
	// //return '#8D99A6';
	// if(txt==='Administrator') return '#36414C';
	// // get color palette selection from md5 hash
	// var idx = cint((parseInt(md5(txt).substr(4,2), 16) + 1) / 5.33);
	// if(idx > 47) idx = 47;
	// return frappe.palette[idx][0]
}

frappe.get_abbr = function(txt, max_length) {
	if (!txt) return "";
	var abbr = "";
	$.each(txt.split(" "), function(i, w) {
		if (abbr.length >= (max_length || 2)) {
			// break
			return false;

		} else if (!w.trim().length) {
			// continue
			return true;
		}
		abbr += w.trim()[0];
	});

	return abbr || "?";
}

frappe.gravatars = {};
frappe.get_gravatar = function(email_id, size = 0) {
	var param = size ? ('s=' + size) : 'd=retro';
	if(!frappe.gravatars[email_id]) {
		// TODO: check if gravatar exists
		frappe.gravatars[email_id] = "https://secure.gravatar.com/avatar/" + md5(email_id) + "?" + param;
	}
	return frappe.gravatars[email_id];
}

// string commons

window.repl =function repl(s, dict) {
	if(s==null)return '';
	for(var key in dict) {
		s = s.split("%("+key+")s").join(dict[key]);
	}
	return s;
}

window.replace_all = function(s, t1, t2) {
	return s.split(t1).join(t2);
}

window.strip_html = function(txt) {
	return txt.replace(/<[^>]*>/g, "");
}

window.strip = function(s, chars) {
	if (s) {
		var s= lstrip(s, chars)
		s = rstrip(s, chars);
		return s;
	}
}

window.lstrip = function lstrip(s, chars) {
	if(!chars) chars = ['\n', '\t', ' '];
	// strip left
	var first_char = s.substr(0,1);
	while(in_list(chars, first_char)) {
		var s = s.substr(1);
		first_char = s.substr(0,1);
	}
	return s;
}

window.rstrip = function(s, chars) {
	if(!chars) chars = ['\n', '\t', ' '];
	var last_char = s.substr(s.length-1);
	while(in_list(chars, last_char)) {
		var s = s.substr(0, s.length-1);
		last_char = s.substr(s.length-1);
	}
	return s;
}

frappe.get_cookie = function getCookie(name) {
	return frappe.get_cookies()[name];
}

frappe.get_cookies = function getCookies() {
	var c = document.cookie, v = 0, cookies = {};
	if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
		c = RegExp.$1;
		v = 1;
	}
	if (v === 0) {
		c.split(/[,;]/).map(function(cookie) {
			var parts = cookie.split(/=/, 2),
				name = decodeURIComponent(parts[0].trimLeft()),
				value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
			if(value && value.charAt(0)==='"') {
				value = value.substr(1, value.length-2);
			}
			cookies[name] = value;
		});
	} else {
		c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
			var name = $0,
				value = $1.charAt(0) === '"'
						? $1.substr(1, -1).replace(/\\(.)/g, "$1")
						: $1;
			cookies[name] = value;
		});
	}
	return cookies;
}

frappe.palette = [
	['#FFC4C4', 0],
	['#FFE8CD', 0],
	['#FFD2C2', 0],
	['#FF8989', 0],
	['#FFD19C', 0],
	['#FFA685', 0],
	['#FF4D4D', 1],
	['#FFB868', 0],
	['#FF7846', 1],
	['#A83333', 1],
	['#A87945', 1],
	['#A84F2E', 1],
	['#D2D2FF', 0],
	['#F8D4F8', 0],
	['#DAC7FF', 0],
	['#A3A3FF', 0],
	['#F3AAF0', 0],
	['#B592FF', 0],
	['#7575FF', 0],
	['#EC7DEA', 0],
	['#8E58FF', 1],
	['#4D4DA8', 1],
	['#934F92', 1],
	['#5E3AA8', 1],
	['#EBF8CC', 0],
	['#FFD7D7', 0],
	['#D2F8ED', 0],
	['#D9F399', 0],
	['#FFB1B1', 0],
	['#A4F3DD', 0],
	['#C5EC63', 0],
	['#FF8989', 1],
	['#77ECCA', 0],
	['#7B933D', 1],
	['#A85B5B', 1],
	['#49937E', 1],
	['#FFFACD', 0],
	['#D2F1FF', 0],
	['#CEF6D1', 0],
	['#FFF69C', 0],
	['#A6E4FF', 0],
	['#9DECA2', 0],
	['#FFF168', 0],
	['#78D6FF', 0],
	['#6BE273', 0],
	['#A89F45', 1],
	['#4F8EA8', 1],
	['#428B46', 1]
]

frappe.is_mobile = function() {
	return $(document).width() < 768;
}

frappe.utils.xss_sanitise = function (string, options) {
	// Reference - https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
	let sanitised = string; // un-sanitised string.
	const DEFAULT_OPTIONS = {
		strategies: ['html', 'js'] // use all strategies.
	}
	const HTML_ESCAPE_MAP = {
		'<': '&lt',
		'>': '&gt',
		'"': '&quot',
		"'": '&#x27',
		'/': '&#x2F'
	};
	const REGEX_SCRIPT     = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi; // used in jQuery 1.7.2 src/ajax.js Line 14
	options          	   = Object.assign({ }, DEFAULT_OPTIONS, options); // don't deep copy, immutable beauty.

	// Rule 1
	if ( options.strategies.includes('html') ) {
		for (let char in HTML_ESCAPE_MAP) {
			const escape = HTML_ESCAPE_MAP[char];
			const regex = new RegExp(char, "g");
			sanitised = sanitised.replace(regex, escape);
		}
	}

	// Rule 3 - TODO: Check event handlers?
	if ( options.strategies.includes('js') ) {
		sanitised = sanitised.replace(REGEX_SCRIPT, "");
	}

	return sanitised;
}

frappe.utils.sanitise_redirect = (url) => {
	const is_external = (() => {
		return (url) => {
			function domain(url) {
				let base_domain = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/img.exec(url);
				return base_domain == null ? "" : base_domain[1];
			}

			function is_absolute(url) {
				// returns true for url that have a defined scheme
				// anything else, eg. internal urls return false
				return /^(?:[a-z]+:)?\/\//i.test(url);
			}

			// check for base domain only if the url is absolute
			// return true for relative url (except protocol-relative urls)
			return is_absolute(url) ? domain(location.href) !== domain(url) : false;
		}
	})();

	const sanitise_javascript = ((url) => {
		// please do not ask how or why
		const REGEX_SCRIPT = /j[\s]*(&#x.{1,7})?a[\s]*(&#x.{1,7})?v[\s]*(&#x.{1,7})?a[\s]*(&#x.{1,7})?s[\s]*(&#x.{1,7})?c[\s]*(&#x.{1,7})?r[\s]*(&#x.{1,7})?i[\s]*(&#x.{1,7})?p[\s]*(&#x.{1,7})?t/gi;

		return url.replace(REGEX_SCRIPT, "");
	});

	url = frappe.utils.strip_url(url);

	return is_external(url) ? "" : sanitise_javascript(frappe.utils.xss_sanitise(url, {strategies: ["js"]}));
};

frappe.utils.strip_url = (url) => {
	// strips invalid characters from the beginning of the URL
	// in our case, the url can start with either a protocol, //, or even #
	// so anything except those characters can be considered invalid
	return url.replace(/^[^A-Za-z0-9(//)#]+/g, '');
}

frappe.utils.new_auto_repeat_prompt = function(frm) {
	const fields = [
		{
			'fieldname': 'frequency',
			'fieldtype': 'Select',
			'label': __('Frequency'),
			'reqd': 1,
			'options': [
				{'label': __('Daily'), 'value': 'Daily'},
				{'label': __('Weekly'), 'value': 'Weekly'},
				{'label': __('Monthly'), 'value': 'Monthly'},
				{'label': __('Quarterly'), 'value': 'Quarterly'},
				{'label': __('Half-yearly'), 'value': 'Half-yearly'},
				{'label': __('Yearly'), 'value': 'Yearly'}
			]
		},
		{
			'fieldname': 'start_date',
			'fieldtype': 'Date',
			'label': __('Start Date'),
			'reqd': 1,
			'default': frappe.datetime.nowdate()
		},
		{
			'fieldname': 'end_date',
			'fieldtype': 'Date',
			'label': __('End Date')
		}
	];
	frappe.prompt(fields, function(values) {
		frappe.call({
			method: "frappe.automation.doctype.auto_repeat.auto_repeat.make_auto_repeat",
			args: {
				'doctype': frm.doc.doctype,
				'docname': frm.doc.name,
				'frequency': values['frequency'],
				'start_date': values['start_date'],
				'end_date': values['end_date']
			},
			callback: function (r) {
				if (r.message) {
					frappe.show_alert({
						'message': __("Auto Repeat created for this document"),
						'indicator': 'green'
					});
					frm.reload_doc();
				}
			}
		});
	},
	__('Auto Repeat'),
	__('Save')
	);
}

frappe.utils.get_page_view_count = function(route) {
	return frappe.call("frappe.website.doctype.web_page_view.web_page_view.get_page_view_count", {
		path: route
	});
};
