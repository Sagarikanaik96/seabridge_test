frappe.ui.form.on('Quotation', {
on_submit:function(frm,cdt,cdn){
      var doc=frm.doc;
            var email;
            frappe.call({
                method:"seabridge_app.seabridge_app.api.get_email",
                args:{
                    doctype:'Customer',
                    is_internal_customer:1,
                    customer_name:doc.customer_name
                },
               async:false,
                callback: function(r){
                    email=r.message;
                }
            });
            if(email!==undefined){
                var emailTemplate='<h1><strong>  Supplier Quotation is created.</strong></h1>';
                sendEmail(doc.name,email,emailTemplate);
            }
},
before_cancel:function(frm,cdt,cdn){
            frappe.throw(('Unable to cancel the document as document as Quotation '+frm.doc.name+' is linked with the supplier quotation.'))

}
});
function sendEmail(name,email,template){
frappe.call({
                    method: "frappe.core.doctype.communication.email.make",
                    args: {
                        subject: name,
                        communication_medium: "Email",
                        recipients: email,
                        content: template,
                        communication_type: "Communication",
                        send_email:1,
                        attachments:[],
                        print_format:"Standard",
                        doctype: "Quotation",
                        name: name,
                        print_letterhead: 0
                    },
                    callback: function(rh){
                        console.log("sent");
                    }   
                });
}
