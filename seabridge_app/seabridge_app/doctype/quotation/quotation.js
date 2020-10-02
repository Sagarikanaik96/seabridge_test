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
                    console.log(r)
                    email=r.message;
                }
            });
            if(email!==undefined){
		        var customer_email;
				var customer;
				var supplier;
				var rfq;
				frappe.call({
					method: "frappe.client.get_value",
					async:false,
					args: {
						doctype: "Customer",
						fieldname: "represents_company",
						filters:{
							"is_internal_customer":1,
							"customer_name":frm.doc.customer_name
						}
					},
						callback: function(r) {
                            if(r.message.represents_company!==undefined){
                                customer=r.message.represents_company;
                            }
						}
				});
				frappe.call({
					method: "frappe.client.get_value",
					async:false,
					args: {
						doctype: "Contact",
						fieldname: "email_id",
						filters:{
							"name":frm.doc.contact_person
						}
					},
						callback: function(r) {
                            if(r.message.email_id!==undefined){
                            customer_email=r.message.email_id;
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
                var emailTemplate='<h3>Customer Name: '+frm.doc.customer_name+'</h3>'+
				'<h3>Customer Company: '+customer+'</h3>'+
				'<h3>Customer Contact: '+customer_email+'</h3>'+
				'<h3>Agent: '+email+'</h3>'+
				'<h3>Date: '+frm.doc.transaction_date+'</h3>'+
				'<h3>Subject: Sales Quotation</h3>'+ 
				'<br>'+
				'<h3>Dear ' +email+ ' and '+frm.doc.customer_name+'</h3>'+
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
