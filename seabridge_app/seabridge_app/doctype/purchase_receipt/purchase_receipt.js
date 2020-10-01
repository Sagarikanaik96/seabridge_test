// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

let allow=0;
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
}
})
    
Purchase Receipt
frappe.ui.form.on("Purchase Receipt Item", "over_delivery_receipt_allowance",function(frm, doctype, name) {
    var row = locals[doctype][name];
    frappe.db.get_value("Item",row.item_code, "over_delivery_receipt_allowance",(s)=>{
        allow=s.over_delivery_receipt_allowance;
        frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Item",
                                                "name": row.item_code,
                                                "fieldname": "over_delivery_receipt_allowance",
                                                "value":row.over_delivery_receipt_allowance
                                            }
                                        });
    })   
})


Material Request
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
    }
})
