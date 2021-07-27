// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Customer',{
	after_save:function(frm,cdt,cdn){
		if(frm.doc.represents_company){
			frappe.call({
					method:"seabridge_app.seabridge_app.doctype.customer.customer.create_permissions",
					args:{
						name:frm.doc.name,
						represents_company:frm.doc.represents_company
					},
					async:false,
					callback: function(r){
						window.location.reload	 	
					}
				});
		}
	},
	validate: function (frm, cdt, cdn) {
		if (frm.doc.represents_company == "None" || frm.doc.represents_company == '') {
			frappe.call({
				method: "seabridge_app.seabridge_app.doctype.customer.customer.create_role",
				args: {
				user: frappe.session.user
				},
				async: false,
				callback: function (r) {
				}
			});
		}
	}
})
