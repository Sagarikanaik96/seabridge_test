// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sales Order", {
before_submit: function(frm,cdt,cdn){
    frappe.db.get_value("Purchase Order",frm.doc.po_no,"base_grand_total",(c)=>{
        if(frm.doc.total>c.base_grand_total){
                frappe.validated = false;
                msgprint('Unable to submit the '+frm.doc.name+ ' as the rate should not be more than the '+frm.doc.po_no+'. Please maintain the same rate to submit the document.', 'Alert');
                return false;
        }
    })
    frappe.db.get_value("Purchase Order",frm.doc.po_no,"total_qty",(c)=>{
        if(frm.doc.total_qty>c.total_qty){
                frappe.validated = false;
                msgprint('Unable to submit the '+frm.doc.name+ ' as the quantity should not be more than the '+frm.doc.po_no+'. Please maintain the same quantity to submit the document.', 'Alert');
                return false;
        }
    })
},
before_save:function(frm,cdt,cdn){
        var count=0;
        frappe.model.with_doc("Company", frm.doc.company, function() {
            var tabletransfer= frappe.model.get_doc("Company", frm.doc.company)
            $.each(tabletransfer.series, function(index, row){
                if(row.reference_document==frm.doc.doctype){
                    frm.set_value("naming_series",row.series)
                    count++;
                }
            })
            if(count==0){
                frappe.validated = false;
                msgprint('Unable to save the '+frm.doc.doctype+' as the naming series are unavailable. Please provide the naming series at the Company: '+frm.doc.company+' to save the document.','Alert')
            }
        })
        var flag=0;
        $.each(frm.doc.items, function(idx, item){
                    if (item.parent_item_group != "Services"){
            flag=1;
                }
            })
        if(flag==1){ frm.set_df_property("total_net_weight", "hidden", 0);
        } else {  frm.set_df_property("total_net_weight", "hidden", 1);  }
    },
customer:function(frm,cdt,cdn){
	frappe.db.get_value("Customer",{"name":frm.doc.customer},"represents_company",(c)=>{
		if(c.represents_company){
			var  company=c.represents_company
			frm.set_query("_agent_contact_person",function(){
					return{
					    query: "seabridge_app.seabridge_app.api.get_contact_filter",
					    filters:{
						"company_name":company
					    },
					}
				    });
		}
	});
}
})

frappe.ui.form.on('Sales Order','company',function(frm, doctype, name){
    frappe.db.get_value("Sales Taxes and Charges Template",{"company":frm.doc.company},"name",(c)=>{
        frm.set_value("taxes_and_charges",c.name)
    })
})



frappe.ui.form.on("Sales Order Item", "item_code",function(frm, doctype, name) {
      var row = locals[doctype][name];
        frappe.db.get_value("Item",row.item_code, "item_group",(s)=>{
         // console.log(s) 
          frappe.db.get_value("Item Group",s.item_group,"parent_item_group",(a)=>{
             // console.log(a) 
		if(s.item_group=="Services"){
		row.parent_item_group="Services";
		}else
			{
                row.parent_item_group=a.parent_item_group;
		}
            })
        })
        
})


