// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Bank Payment Advice', {
refresh:function(frm,cdt,cdn){
   frm.set_query("bank_account",function(){
                return{
                    filters: [
                        ["Bank Account","company", "=", frm.doc.company]
                    ]
                }
            }); 
    
	frm.add_custom_button(__('Get Invoices'), function(){
var select={}
	 let dialogObj= new frappe.ui.form.MultiSelectDialog({
 doctype: "Purchase Invoice",
 target: frm,
setters: {
 supplier: "",
 due_date:"",
 outstanding_amount:""
 },
 date_field: "transaction_date",
 get_query() {
 return {
 filters: { docstatus: ['=', 1] , status: ['!=',"Paid"]}
 }
 },
 action(selections) {

select=selections
 $.each(selections,function(idx){
 frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Purchase Invoice",
                fields: ["name","due_date","supplier_name","status","grand_total","outstanding_amount"],
                filters:{
                    "name":select[idx]
                },
            },
            callback: function(r) {
                for(var i=0;i<r.message.length;i++){
                    var count=0
                    $.each(frm.doc.bank_payment_advice_details, function(idx, detail){
                        if(detail.invoice_document==r.message[i].name){
                            count++;
                        }
                    })
                    if(count==0){
                    var child = cur_frm.add_child("bank_payment_advice_details");
                    child.invoice_document=r.message[i].name;
			        child.due_date = r.message[i].due_date;
			        child.supplier_name=r.message[i].supplier_name
			        child.status = r.message[i].status;
			        child.invoice_amount = r.message[i].grand_total;
			        child.outstanding_amount=r.message[i].outstanding_amount;
			        
			         frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Purchase Invoice",
                fields: ["name","is_return","return_against","grand_total"],
                filters:{
                    "return_against":select[idx]
                },
            },
            callback: function(r) {
                if(r.message.length>0){
                    
                for(var i=0;i<r.message.length;i++){
                    child.debit_note = r.message[i].name;
                    child.debit_note_amount = r.message[i].grand_total;
                }
                }
            }
			         })
		            cur_frm.refresh_field("bank_payment_advice_details")
                    }
                }
               
            }
        })
 cur_frm.refresh_field("bank_payment_advice_details")
 })
dialogObj.dialog.hide()
 }
}); 
  });
   
	},
	date:function(frm,cdt,cdn){
	 if(frm.doc.date<frappe.datetime.nowdate()){
	      msgprint("Date cannot be before todays date")
	      frm.set_value("date","")
            cur_frm.refresh_field("date")
	 }   
	}
	
})

frappe.ui.form.on("Bank Payment Advice Details", "invoice_document",function(frm, doctype, name) {
    var row = locals[doctype][name];
    frappe.db.get_value('Purchase Invoice',{'name':row.invoice_document},"due_date",(r)=>{
    row.due_date = r.due_date;
    refresh_field("bank_payment_advice_details");
    })
	})


frappe.ui.form.on("Bank Payment Advice Details", "debit_note_amount",function(frm, doctype, name) {
    var row = locals[doctype][name];
    row.outstanding_amount = row.invoice_amount+row.debit_note_amount;
    refresh_field("bank_payment_advice_details");
	})
	
frappe.ui.form.on("Bank Payment Advice Details", "payment_transaction_amount",function(frm, doctype, name) {
    var row = locals[doctype][name];
    if(row.payment_transaction_amount>row.outstanding_amount)
    {   msgprint("Payment Transaction amount cannot be greater than Outstanding Amount")
        row.payment_transaction_amount=0;
        refresh_field("bank_payment_advice_details");
	
    }
    })
