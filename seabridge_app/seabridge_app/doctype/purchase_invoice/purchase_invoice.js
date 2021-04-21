// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Purchase Invoice', { 
after_save:function(frm,cdt,cdn){
	if(frm.doc.is_return==1){
		frappe.call({
		        method:"seabridge_app.seabridge_app.api.update_status",
		        args:{
				doc:cur_frm.doc.return_against		
			},
		        async:false,
		        callback: function(r){
		        }
            	});

	}
	frappe.call({
		        method:"seabridge_app.seabridge_app.api.update_monthly_budget",
		        args:{
				doc:frm.doc.name		
			},
		        async:false,
		        callback: function(r){
		        }
            	});



},
before_save:function(frm,cdt,cdn){
	var count=0;
	if(frm.doc.naming_series){}
	else{
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
	frappe.db.get_value("Sales Invoice",frm.doc.bill_no,"po_no",(c)=>{
		$.each(frm.doc.items, function(idx, item){
			if(item.purchase_order){}
			else{
				item.purchase_order=c.po_no;
			}
		})
			
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
	},

after_workflow_action: (frm) => {
var email_id;
	if(frm.doc.workflow_state=="Pending")
	{
		frappe.db.get_value("Company",frm.doc.company,"associate_agent_company",(c)=>{
			if(c.associate_agent_company){
				frappe.call({
					method:"seabridge_app.seabridge_app.api.get_agent_users",
					async:false,
					args:{
						"represents_company":c.associate_agent_company,
						"doc":frm.doc.name
					},
					callback: function(r){
						
						for(var i=0;i<r.message.length;i++){
							var email_template='<h2><span style="color: rgb(102, 185, 102);">Task Details</span></h2><table class="table table-bordered"><tbody><tr><td data-row="insert-column-right"><strong>Document Id</strong></td><td data-row="insert-column-right"><strong style="color: rgb(107, 36, 178);">'+frm.doc.name+'</strong></td></tr><tr><td data-row="row-z48v"><strong>Approver</strong></td><td data-row="row-z48v"><strong style="color: rgb(107, 36, 178);">'+r.message[i][0]+'</strong></td></tr><tr><td data-row="row-zajk"><strong>View Document in ERPNext</strong></td><td data-row="row-mze0"><strong style="color: rgb(230, 0, 0);"><a href="desk#Form/Purchase Invoice/'+frm.doc.name+'" target="_blank" class="btn btn-success">Click to view document</a></strong></td></tr><tr><td data-row="row-779i"><strong>Note</strong></td><td data-row="row-779i"><strong style="color: rgb(255, 153, 0);">This is a system generated email, please do not reply to this message.</strong></td></tr></tbody></table>'


							frappe.call({
								method: "frappe.core.doctype.communication.email.make",
								args: {
								    subject: "Approval",
								    communication_medium: "Email",
								    recipients: r.message[i][0],
								    content: email_template,
								    communication_type: "Communication",
								    send_email:1,
								    attachments:[],
								    print_format:"Standard",
								    doctype: "Purchase Invoice",
								    name: frm.doc.name,
								    print_letterhead: 0
								},        
								callback: function(rh){
								    console.log("sent");
									
								}   
							});				
						}
					}
				})
			}				
		})
	}
if(frm.doc.workflow_state=="Submitted"){
 var tabletransfer= frappe.model.get_doc("Purchase Invoice", frm.doc.name)
        $.each(tabletransfer.items, function(index, row){
               
     frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Item",
                                                "name": row.item_code,
                                                "fieldname": "over_billing_allowance",
                                                "value":0
                                            }
                                        });  
        	});
}

	if(frm.doc.workflow_state=="To Bill"){
	frappe.call({
		        method:"seabridge_app.seabridge_app.doctype.purchase_invoice.purchase_invoice.post_invoice",
		        args:{
				name:frm.doc.name	
			},
		        async:false,
		        callback: function(r){
		            
				
		        }
		    });
	}
	if(frm.doc.workflow_state=="Return"){
		frappe.call({
                method:"seabridge_app.seabridge_app.api.update_status_after_return",
                args:{
			doc:cur_frm.doc.return_against		
		},
                async:false,
                callback: function(r){
                }
            });
	}
},

refresh:function(frm,cdt,cdn){

	if(frm.doc.purchase_order){
		if(frm.doc.purchase_receipt){}
		else{
			      frappe.call({
				method:"seabridge_app.seabridge_app.api.get_purchase_receipt",
				args:{
				    purchase_order:frm.doc.purchase_order,
					purchase_invoice:frm.doc.name
				},
				async:false,
				callback: function(r){
				 
				}
			    });
		}

		if(frm.doc.service_completion_note){}
		else{
					

			frappe.db.get_value("Service Completion Note",{"reference_no":frm.doc.purchase_order},"name",(c)=>{
			
				if(c.name){
				frappe.call({
				                            async: false,
				                            "method": "frappe.client.set_value",
				                            "args": {
				                                "doctype": "Purchase Invoice",
				                                "name": frm.doc.name,
				                                "fieldname": "service_completion_note",
				                                "value":c.name
				                            }
				                        });
			}
			})
		}
	}
	else{
	if(frm.doc.bill_no){
	frappe.db.get_value("Sales Invoice",frm.doc.bill_no,"po_no",(c)=>{
	if(c.po_no){
			

				frappe.call({
                method:"seabridge_app.seabridge_app.api.set_po",
                args:{
			doc:cur_frm.doc.name,
			po_no:c.po_no		
		},
                async:false,
                callback: function(r){
                }
            });
			}
		})
	}
	}		
	
}
});


frappe.ui.form.on("Purchase Invoice Item", "item_code",function(frm, doctype, name) {
      var row = locals[doctype][name];
        frappe.db.get_value("Item",row.item_code, "item_group",(s)=>{
          frappe.db.get_value("Item Group",s.item_group,"parent_item_group",(a)=>{
		if(s.item_group=="Services"){
		row.parent_item_group="Services";
		}else
			{
                row.parent_item_group=a.parent_item_group;
		}
            })
        })
        
})



