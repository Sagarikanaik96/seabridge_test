// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Customer',{
	after_save:function(frm,cdt,cdn){
console.log('INSAVE-------------')
		frappe.call({
				method:"seabridge_app.seabridge_app.doctype.customer.customer.create_permissions",
				args:{
					name:frm.doc.name
				},
				async:false,
				callback: function(r){	 	
				}
			});
	}
})
