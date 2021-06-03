// Copyright (c) 2021, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Rejection Reason', {
	refresh: function(frm) {
		frm.set_query("company",function(){
                return{
                    filters: {
                        "company_type":['in',['Agent','Customer']]
                    }
                };
             });
	}
});
