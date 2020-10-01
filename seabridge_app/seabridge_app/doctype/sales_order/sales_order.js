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
    }
})

frappe.ui.form.on('Sales Order','company',function(frm, doctype, name){
    frappe.db.get_value("Sales Taxes and Charges Template",{"company":frm.doc.company},"name",(c)=>{
        frm.set_value("taxes_and_charges",c.name)
    })
})

