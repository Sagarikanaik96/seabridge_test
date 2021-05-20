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
    after_save:function(frm,cdt,cdn){
	frappe.call({
                    method:"seabridge_app.seabridge_app.doctype.sales_invoice.sales_invoice.on_save",
                    args:{
                        name:frm.doc.name
                    },
                   async:false,
                    callback: function(r){
                    }
                });
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
	frappe.db.get_value("Purchase Order",frm.doc.po_no, "attachment_checklist_template",(s)=>{
		if(s.attachment_checklist_template){
			frm.set_value('attachment_checklist_template',s.attachment_checklist_template)
			cur_frm.refresh_field("attachment_checklist_template")
		}
	})
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
	if(!frm.doc.invoice_description){
		frappe.db.get_value("Purchase Order",frm.doc.po_no, "invoice_description",(s)=>{
			frm.set_value('invoice_description',s.invoice_description)
			cur_frm.refresh_field("invoice_description")
		})
	}
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


frappe.ui.form.on("Sales Invoice Item", "item_code",function(frm, doctype, name) {
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

