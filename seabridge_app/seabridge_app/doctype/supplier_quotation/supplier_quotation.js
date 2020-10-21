// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Supplier Quotation', {
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

    refresh:  function(frm) {
        if(frm.doc.docstatus === 1){    
            frm.page.add_inner_button('Blanket Order', function(){
                var doc = frappe.model.get_new_doc('Blanket Order');
                //doc.blanket_order = frm.doc.name;
                doc.blanket_order_type = 'Purchasing';
                doc.supplier = frm.doc.supplier;
                doc.supplier_quotation = frm.doc.name
                doc.company = frm.doc.company;
                doc.from_date = frm.doc.transaction_date;
                doc.to_date = frm.doc.valid_till;
                //doc.items = frm.doc.items;
                doc.tc_name = frm.doc.tc_name;
                doc.terms = frm.doc.terms;
                frappe.set_route('Form', 'Blanket Order', doc.name);
            },'Create')
        }
    }
})


frappe.ui.form.on("Supplier Quotation Item", "item_code",function(frm, doctype, name) {
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
