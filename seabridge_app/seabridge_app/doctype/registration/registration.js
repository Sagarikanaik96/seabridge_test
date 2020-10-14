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
        if(frm.doc.company_type=="Vendor" || frm.doc.company_type=="Agent"){
		if(frm.doc.supplier_name){
		    frm.set_value("represents_company",frm.doc.company)
		    frm.set_value("internal_supplier",1)
		    msgprint('Is Internal Supplier and Represents Company is set, please update the form!!','Alert')
		}
        }
	if(frm.doc.company_type=="Customer"){
		    frm.set_value("represents_companys",frm.doc.company)
		    frm.set_value("is_internal_customer",1)
		    msgprint('Is Internal Customer and Represents Company is set, please update the form!!','Alert')
        }
	
    },

before_submit:function(frm,cdt,cdn){
        if(frm.doc.company_type=="Vendor" || frm.doc.company_type=="Agent"){
		if(frm.doc.customer_name){
			msgprint('Unable to create the Customer as Company Type is '+frm.doc.company_type,'Alert')
		}	
        }
	if(frm.doc.company_type=="Customer"){
		if(frm.doc.supplier_name){
			msgprint('Unable to create the Supplier as Company Type is '+frm.doc.company_type,'Alert')
		}
		
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
    
    },
before_cancel:function(frm,cdt,cdn){
	var comp_count=0;
  frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Company",
                fields: ["company_name"],
                filters:{
                    "company_name":frm.doc.company
                },
            },
            callback: function(r) {
                for(var i=0;i<r.message.length;i++){
		if(r.message[i].company_name==frm.doc.company){
			comp_count++
		}
                }
               
            }
        })
	 if(comp_count!=0){
                   frappe.throw('Unable to cancel the document as Company: '+frm.doc.company+' is linked with this document.', 'Alert');
                }


	var supp_count=0;
  frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Supplier",
                fields: ["supplier_name"],
                filters:{
                    "supplier_name":frm.doc.supplier_name
                },
            },
            callback: function(r) {
                for(var i=0;i<r.message.length;i++){
		if(r.message[i].supplier_name==frm.doc.supplier_name){
			supp_count++
		}
                }
               
            }
        })
	 if(supp_count!=0){
                    frappe.throw('Unable to cancel the document as a Supplier: '+frm.doc.supplier_name+' is linked with this document.', 'Alert');
                }


		var user_count=0;
  frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "User",
                fields: ["email"],
                filters:{
                    "email":frm.doc.email
                },
            },
            callback: function(r) {
                for(var i=0;i<r.message.length;i++){
		if(r.message[i].email==frm.doc.email){
			user_count++
		}
                }
               
            }
        })
	 if(user_count!=0){
                    frappe.throw('Unable to cancel the document as an User: '+frm.doc.first_name+' is linked with this document.', 'Alert');
                }
}
})

