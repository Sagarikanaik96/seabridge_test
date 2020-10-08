// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Purchase Invoice', { 
before_save:function(frm,cdt,cdn){
    frappe.db.get_value("Sales Invoice",frm.doc.bill_no,"base_grand_total",(c)=>{
	    if(frm.doc.total>c.base_grand_total){
		    frappe.throw('Unable to save the '+frm.doc.name+ ' as the rate should not be more than the '+frm.doc.bill_no+'. Please maintain the same rate to submit the document.');
	    }
    });
    frappe.db.get_value("Sales Invoice",frm.doc.bill_no,"total_qty",(c)=>{
	    if(frm.doc.total_qty>c.total_qty){
		     frappe.throw('Unable to save the '+frm.doc.name+ ' as the rate should not be more than the '+frm.doc.bill_no+'. Please maintain the same rate to submit the document.');
	    }
    });
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

},
before_save:function(frm,cdt,cdn){
	if(frm.doc.bill_no){
        	frappe.db.get_value("Sales Invoice",{'name':frm.doc.bill_no}, "po_no",(c)=>{
			if(c.po_no){
				$.each(frm.doc.items, function(idx, item){
					item.purchase_order=c.po_no;				
				})
			}
		})
	}
},


before_submit:function(frm,cdt,cdn){
            var po;
            var item_val;
            var amount;
            $.each(frm.doc.items, function(idx, item){
                po=item.purchase_order
                item_val=item.item_code
                frappe.model.with_doc("Purchase Order", po, function() {
                    var tabletransfer= frappe.model.get_doc("Purchase Order", po)
                    $.each(tabletransfer.items, function(index, row){
                        if(item_val==row.item_code){
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
                            msgprint('This document is over limit by <b>Amount '+check+'</b> for item <b>'+item.item_code+'</b>. Are you making another <b>Purchase Invoice</b> against the same <b>Purchase Order Item</b>? <br><br> To allow over receipt, update "Over Billing Allowance" at Purchase Invoice Item details','Limit Crossed')
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



