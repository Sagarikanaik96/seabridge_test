// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Purchase Invoice', {
refresh: function(frm) {
		console.log('aaaabbbb')
    }, 
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
}
});
