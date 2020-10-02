// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registration',{ 
    company:function(frm,cdt,cdn){
    let parts = frm.doc.company.split(" ");
		let abbr = $.map(parts, function (p) {
			return p? p.substr(0, 1) : null;
		}).join("");
		frm.set_value("abbr", abbr);
},
on_submit:function(frm,cdt,cdn){
        if(frm.doc.company_type=="Vendor"){
            frm.set_value("represents_company",frm.doc.company)
            frm.set_value("internal_supplier",1)
            msgprint('Is Supplier and Represents Company is set, please update the form!!','Alert')
        }
    },

before_save:function(frm,cdt,cdn){
	if(frm.doc.date==null){
        	frm.set_value("date",frappe.datetime.get_today())
	}
    },

refresh:function(frm,cdt,cdn){
        if(frm.doc.company_type=="Vendor"){
            frm.set_query("represents_company",function(){
                return{
                    filters: [
                        ["Company","company_name", "in", frm.doc.company]
                    ]
                }
            });
            frm.set_query("parent_company",function(){
                return{
                    filters: [
                        ["Company","is_group", "=", 1]
                    ]
                }
            });
        }
    
    }
})

