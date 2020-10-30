// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Purchase Invoice', { 
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
	frappe.db.get_value("Sales Invoice",frm.doc.bill_no,"po_no",(c)=>{
		$.each(frm.doc.items, function(idx, item){
			item.purchase_order=c.po_no;
		})
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


before_submit:function(frm,cdt,cdn){		
            $.each(frm.doc.items, function(idx, item){
                frappe.model.with_doc("Purchase Order", item.purchase_order, function() {
                    var tabletransfer= frappe.model.get_doc("Purchase Order", item.purchase_order)
                    $.each(tabletransfer.items, function(index, row){
                        if(item.item_code==row.item_code){
                            if(item.amount>row.amount){
                            var diff=item.amount-row.amount
                            var min_per=100*diff/row.amount
                            frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Item",
                                                "name": item.item_code,
                                                "fieldname": "over_billing_allowance",
                                                "value":item.over_billing_allowance
                                            }
                                        });
                            var check=item.amount-row.amount*item.over_billing_allowance/100-row.amount;
                            if(item.over_billing_allowance<min_per){
                            frappe.validated = false;
                            msgprint('This document is over limit by <b>Amount '+check+'</b> for item <b>'+item.item_code+'</b>. Are you making another <b>Purchase Invoice</b> against the same <b>Purchase Order Item</b>? <br><br> To allow over billing, update "Over Billing Allowance" at Purchase Invoice Item details','Limit Crossed')
                            }
                            }
                        }
                    })
                })
            })
    },
on_submit: function(frm) {
        var tabletransfer= frappe.model.get_doc("Purchase Invoice", frm.doc.name)
        $.each(tabletransfer.items, function(index, row){
               
     frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Item",
                                                "name": row.item_code,
                                                "fieldname": "over_billing_allowance",
                                                "value":0
                                            }
                                        });  
        	});
	}
});


frappe.ui.form.on("Purchase Invoice Item", "item_code",function(frm, doctype, name) {
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

