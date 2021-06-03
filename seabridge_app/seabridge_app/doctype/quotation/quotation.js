frappe.ui.form.on('Quotation', {
on_submit:function(frm,cdt,cdn){
        var doc=frm.doc;
        var email;
        var agent;
        var supplier;
        var rfq;
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
            else {
                var email_id;
                frappe.call({
					method:"seabridge_app.seabridge_app.api.get_contact_mail",
					async:false,
					args: {
						doctype: "Contact Email",
						parenttype:'Contact',
						parent:frm.doc.contact_person
					},
						callback: function(r) {
                            if(r.message!==undefined){
                                email_id=r.message;
                            }
						}
                });
                var emailTemplate=
				'<h3>Dear ' +frm.doc.contact_person+ ' and '+frm.doc.customer_name+',</h3>'+
				'<h3>We have received your request for quotation '+rfq+' regarding your requirements.We are pleased to inform you that we have enclosed our quotation for your favorable consideration. More details of the enclosed quote and its relevant terms and conditions are provided for your perusal.</h3>'+
                '<br>'+
                '<h3>We look forward to serving you.</h3>'+
                '<h3>Thanks,</h3>'+
                '<h3>'+supplier+'</h3>'+
                '<h3>'+frm.doc.company+'</h3>';
               sendEmail(doc.name,email_id,emailTemplate,doc.quotation_type);

            }
},
before_cancel:function(frm,cdt,cdn){
            frappe.throw(('Unable to cancel the document as document as Quotation '+frm.doc.name+' is linked with the supplier quotation.'))

},
before_submit:function(frm,cdt,cdn){
    frappe.db.get_value('Customer',{'is_internal_Customer':1,'customer_name':frm.doc.customer_name},'represents_company',(s)=>{
	frappe.db.get_value("Company",s.represents_company, "default_warehouse",(c)=>{
		if(c.default_warehouse==undefined)
		{	
			frappe.validated=false;
			msgprint('Please maintain a default warehouse at Company '+s.represents_company,'Alert')	
		}
	})
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

	var flag=0;
	$.each(frm.doc.items, function(idx, item){
	            if (item.parent_item_group != "Services"){
		flag=1;
            }
        })
	if(flag==1){ frm.set_df_property("total_net_weight", "hidden", 0);
	} else {  frm.set_df_property("total_net_weight", "hidden", 1);  }
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


frappe.ui.form.on("Quotation Item", "item_code",function(frm, doctype, name) {
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

