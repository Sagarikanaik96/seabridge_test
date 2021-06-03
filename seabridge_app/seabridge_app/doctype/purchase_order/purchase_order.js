// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Purchase Order', {
    on_submit:function(frm,cdt,cdn){
          var doc=frm.doc;
	var agent;
          frappe.db.get_value('Customer',{'is_internal_customer':1,'represents_company':doc.company},"customer_name",(r)=>{
            if(r.customer_name){
                frappe.db.get_value("Contact",doc.supplier_name, "user",(c)=>{
                    var email=c.user;
                    if(email!=null){
			var agent,agent_name;
	frappe.call({
					method: "frappe.client.get_value",
					async:false,
					args: {
						doctype: "Company",
						fieldname: "associate_agent",
						filters:{
							"company_name":frm.doc.company
						}
					},
					callback: function(q) {
                            agent=q.message.associate_agent;
				frappe.call({
					method: "frappe.client.get_value",
					async:false,
					args: {
						doctype: "User",
						fieldname: "full_name",
						filters:{
							"email":agent
						}
					},
					callback: function(s) {
                            agent_name=s.message.full_name;
                        
					}
				});
			}
				});
                        var emailTemplate='<h3><strong> Dear '+doc.supplier_name+',</strong></h3><br><br>'+
			'<h3>This is to inform that the Sales Quotation is successfully converted to a confirmed order. We have attached the purchase details for the item. You can find your purchase information below.<br><br>'+
			'Thanks,<br>'+agent_name+'<br>'+r.customer_name+'<br>'+doc.company+'</h3>';
                        sendEmail(doc.name,email,emailTemplate);
                    }
                })
            }

            else{
                frappe.db.get_value("Contact",doc.company, "user",(c)=>{
                    var email=c.user;
                    if(email!=null){
                        var emailTemplate='<h1><strong>  Customer: Customer is not registered for a '+doc.company+'. The Sales order is not created. Please find the attached PO document..</strong></h1>';
                        sendEmail(doc.name,email,emailTemplate);
                    }
                })
            }
        })
    },
    before_submit:function(frm,cdt,cdn){
        frappe.db.get_value("Supplier",{'is_internal_supplier':1,'supplier_name':frm.doc.supplier_name}, "represents_company",(c)=>{
            var company=c.represents_company
            if(company==null){
                frappe.validated = false;
                msgprint('Unable to create Sales Order as supplier:'+frm.doc.supplier_name+' is not associated with any company. Register the Supplier for this Company and submit the document:'+frm.doc.name)
            }
        })

    },

    refresh:function(frm,cdt,cdn){
if(frm.doc.docstatus==1){
frm.add_custom_button(__("Service Completion Note"), function() {
            frappe.route_options = {
            "reference_no": frm.doc.name,
		"supplier": frm.doc.supplier,
		"company": frm.doc.company
            };
            frappe.new_doc("Service Completion Note");
        }, __("Create"));
}

	


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

	$.each(frm.doc.attachment_checklist, function(idx, item){
	    if (!item.options){
		frappe.validated = false;
		msgprint('Select Option for Attachment Checklist','Alert')
            }
	    if (item.options=="No"){
		if(!item.remarks){
			frappe.validated = false;
			msgprint('Please enter the remarks in Attachment Checklist','Alert')
		}
            }
        })
    },
    before_cancel:function(frm,cdt,cdn){
        var po_no;
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Sales Order",
                fields: ["po_no","name"],
                filters:{
                    "po_no":frm.doc.name
                },
            },
            callback: function(r) {
                for(var i=0;i<r.message.length;i++){
                    po_no=r.message[i].po_no
                }
                if(po_no==frm.doc.name){
                    frappe.validated = false;
                    msgprint('Unable to cancel the document as PO:'+frm.doc.name+' is linked with sales order documents.', 'Alert');
                }
            }
        })
    },
    attachment_checklist_template:function(frm,cdt,cdn){
	if(frm.doc.attachment_checklist_template){
		frappe.model.with_doc("Attachment Checklist Template", frm.doc.attachment_checklist_template, function() {
		var tabletransfer= frappe.model.get_doc("Attachment Checklist Template", frm.doc.attachment_checklist_template)
		    $.each(tabletransfer.attachment_checklist_detail, function(index, detail){
			var child = cur_frm.add_child("attachment_checklist");
			child.description=detail.description
			child.options=detail.options
			child.remarks=detail.remarks
			cur_frm.refresh_field("attachment_checklist")
		    })
		})
	}
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
            print_format:"PO Print Format",
            doctype: "Purchase Order",
            name: name,
            print_letterhead: 0
        },        
        callback: function(rh){
            console.log("sent");
        }   
    });
}




frappe.ui.form.on("Purchase Order Item", "item_code",function(frm, doctype, name) {
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

