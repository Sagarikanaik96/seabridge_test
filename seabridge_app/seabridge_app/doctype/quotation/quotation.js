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
				var supplier;
                var rfq;
                var agent;
                frappe.call({
                    method:"seabridge_app.seabridge_app.api.get_agent_name",
                    args:{
                        doctype:'Customer',
                        is_internal_customer:1,
                        customer_name:doc.customer_name
                    },
                   async:false,
                    callback: function(r){
                        if(r.message!==undefined){
                            agent=r.message;
                        }
                }
                });

                frappe.call({
					method: "frappe.client.get_value",
					async:false,
					args: {
						doctype: "Supplier",
						fieldname: "supplier_name",
						filters:{
							"is_internal_supplier":1,
							"represents_company":frm.doc.company
						}
					},
						callback: function(r) {
                            if(r.message.supplier_name!==undefined){
                                supplier=r.message.supplier_name;
                            }
						}
				});
				frappe.call({
					method: "frappe.client.get_value",
					async:false,
					args: {
						doctype: "Opportunity",
						fieldname: "reference_no",
						filters:{
							"name":frm.doc.opportunity
						}
					},
						callback: function(r) {
                            if(r.message.reference_no!==undefined){
                            	rfq=r.message.reference_no;
                            }
						}
				});
                var emailTemplate=
				'<h3>Dear ' +agent+ ' and '+frm.doc.customer_name+',</h3>'+
				'<h3>We have received your request for quotation '+rfq+' regarding your requirements.We are pleased to inform you that we have enclosed our quotation for your favorable consideration. More details of the enclosed quote and its relevant terms and conditions are provided for your perusal.</h3>'+
                '<br>'+
                '<h3>We look forward to serving you.</h3>'+
                '<h3>Thanks,</h3>'+
                '<h3>'+supplier+'</h3>'+
                '<h3>'+frm.doc.company+'</h3>';
               sendEmail(doc.name,email,emailTemplate,doc.quotation_type);
            }
},
before_cancel:function(frm,cdt,cdn){
            frappe.throw(('Unable to cancel the document as document as Quotation '+frm.doc.name+' is linked with the supplier quotation.'))

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
});
function sendEmail(name,email,template,quotation_type){
if(quotation_type=='Open'){
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
                        print_format:"Quotation Print Format",
                        doctype: "Quotation",
                        name: name,
                        print_letterhead: 0
                    },
                    callback: function(rh){
                        console.log("sent");
                    }   
                });
            }
else if(quotation_type=="Sealed"){
    frappe.call({
        method: "frappe.core.doctype.communication.email.make",
        args: {
            subject: name,
            communication_medium: "Email",
            recipients: email,
            content: template,
            communication_type: "Communication",
            send_email:1
        },
        callback: function(rh){
            console.log("sent");
        }   
    });
}
}
