// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sales Invoice', {
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
                    var emailTemplate='<h1><strong> Sales Invoice is created and Submitted Successfully.Please find the attachment.</strong></h1>';
                    sendEmail(doc.name,email,emailTemplate);
                }
    
    },
    before_cancel:function(frm,cdt,cdn){
        frappe.throw(('Unable to cancel the document as Sales Invoice: '+frm.doc.name+' is linked with purchase invoice documents.'))
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
                            doctype: "Sales Invoice",
                            name: name,
                            print_letterhead: 0
                        },
                        callback: function(rh){
                            console.log("sent");
                        }   
                    });
    }
