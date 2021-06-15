// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee', {
	before_save:function(frm,cdt,cdn){
		var saved_doc=0
		var reports_to=""
		if(frm.doc.__islocal==1){saved_doc=0}
		else{saved_doc=1}
		if(frm.doc.reports_to){reports_to=frm.doc.reports_to}
		if(frm.doc.user_id){
			frappe.call({
				method:"seabridge_app.seabridge_app.doctype.employee.employee.create_permissions",
				args:{
					reports_to:reports_to,
					user_id:frm.doc.user_id,
					saved_doc:saved_doc,
					name:frm.doc.name
				},
				async:false,
				callback: function(r){	 	
				}
			});
		}
	}  
})

