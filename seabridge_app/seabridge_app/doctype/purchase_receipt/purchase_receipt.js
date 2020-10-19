// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on("Purchase Receipt", {
    on_submit: function(frm) {
               var tabletransfer= frappe.model.get_doc("Purchase Receipt", frm.doc.name)
        $.each(tabletransfer.items, function(index, row){
               
     frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Item",
                                                "name": row.item_code,
                                                "fieldname": "over_delivery_receipt_allowance",
                                                "value":0
                                            }
                                        });  
        });
},
before_submit:function(frm,cdt,cdn){
            $.each(frm.doc.items, function(idx, item){
                frappe.model.with_doc("Purchase Order", item.purchase_order, function() {
                    var tabletransfer= frappe.model.get_doc("Purchase Order", item.purchase_order)
                    $.each(tabletransfer.items, function(index, row){
                        if(item.item_code==row.item_code){
                            if(item.qty>row.qty){
                            var diff=item.qty-row.qty
                            var min_per=100*diff/row.qty
                            frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Item",
                                                "name": item.item_code,
                                                "fieldname": "over_delivery_receipt_allowance",
                                                "value":item.over_delivery_receipt_allowance
                                            }
                                        });
                            var check=item.qty-row.qty*item.over_delivery_receipt_allowance/100-row.qty;
                            if(item.over_delivery_receipt_allowance<min_per){
                            frappe.validated = false;
                             msgprint('This document is over limit by <b>Qty '+check+'</b> for item <b>'+item.item_code+'</b>. Are you making another <b>Purchase Receipt</b> against the same <b>Purchase Order Item</b>? <br><br> To allow over receipt, update "Over Receipt Allowance" at Purchase Receipt Item details','Limit Crossed')
                            }
                            }
                        }
                    })
                })
            })
    },

before_save:function(frm,cdt,cdn){

	var flag=0;
	$.each(frm.doc.items, function(idx, item){
	            if (item.parent_item_group != "Services"){
		flag=1;
            }
        })
	if(flag==1){ frm.set_df_property("total_net_weight", "hidden", 0);
	} else {  frm.set_df_property("total_net_weight", "hidden", 1);  }
}

})


frappe.ui.form.on("Purchase Receipt Item", "item_code",function(frm, doctype, name) {
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




