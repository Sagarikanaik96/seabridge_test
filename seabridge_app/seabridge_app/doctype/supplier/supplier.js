// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Supplier',{
    refresh(frm){
        frappe.db.get_value('Registration',{'supplier_name':frm.doc.supplier_name},"company",(r)=>{
            frm.set_query("represents_company",function(){
                return{
                    filters: [
                        ["Company","company_name", "in", r.company]
                    ]
                }
            });
        })
    },
	after_save:function(frm,cdt,cdn){
		frappe.call({
				method:"seabridge_app.seabridge_app.doctype.supplier.supplier.create_permissions",
				args:{
					name:frm.doc.name
				},
				async:false,
				callback: function(r){	 	
				}
			});
	}
})
