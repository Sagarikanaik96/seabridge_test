// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Material Request', {
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
    },
    refresh: function(frm,cdt,cdn) {
        var blanket_order_type
        var company
        var flag = 0;
        var check=0;
        if(frm.doc.docstatus === 1){
            frappe.call({
                method: "frappe.client.get_list",
                async:false,
                args: {
                    doctype: "Blanket Order",
                    fields : ["company","blanket_order_type","name"],
                    filters:{
                        "blanket_order_type":"Purchasing",
                        "company" : frm.doc.company
                    }
                },
                callback: function(r) {
                    
                    for(var i=0;i<r.message.length;i++){
                        blanket_order_type=r.message[i].blanket_order_type
                        company=r.message[i].company
                        var name = r.message[i].name
                        frappe.model.with_doc("Blanket Order", name, function() {
                            var tabletransfer= frappe.model.get_doc("Blanket Order", name)
                            $.each(frm.doc.items, function(idx, item){
                                $.each(tabletransfer.items, function(index, row){
                                    if(item.item_code== row.item_code){
                                        frm.add_custom_button(__('View Blanket Order'), function(){
                                            frappe.route_options = {"company": frm.doc.company, "blanket_order_type": "Purchasing","item_code":item.item_code}
                                            frappe.set_route("List", "Blanket Order");
                                        });
                                        check++;
                                    }
                                })
                            })
                        })
                    }
                    if(check>0){frappe.msgprint('Blanket Orders available for the requested Items.<br /> Select the View Blanket Orders button to view the Blanket Purchase Orders.')}
                }
            })
        }    
    }
        
})

