var agent;
frappe.ui.form.on('Company', {
refresh:function(frm,cdt,cdn){
        agent=frm.doc.associate_agent;
        if(frm.doc.company_type=="Customer"){
		frm.set_query("default_warehouse",function(){
                return{
                    filters: {
                        "company":frm.doc.company_name
                    }
                };
             });
        }


	 frm.set_query("associate_agent", function() {
            return {
                    query: "seabridge_app.seabridge_app.api.get_user_filter",
                    filters:{
                        "represents_company":frm.doc.associate_agent_company
                    },
                
            };
        });
	if(frm.doc.end_date<=frappe.datetime.nowdate()){
		if(frm.doc.associate_agent){
			delete_user_permission(agent,frm.doc.company_name);
		}
	}
	frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Contract",
                fields: ["start_date","end_date","party_name","name"],
                filters:{
                    "company":frm.doc.company_name
                },
            },
            callback: function(r) {
                for(var i=0;i<r.message.length;i++){
			if(r.message[i].start_date==frm.doc.start_date && r.message[i].end_date==frm.doc.end_date)
			{
				
			}
			else{
				if(r.message[i].start_date>=frappe.datetime.nowdate() && r.message[i].end_date>frappe.datetime.nowdate())
				{
					frappe.call({
						    "method": "frappe.client.set_value",
						    "args": {
						        "doctype": "Company",
						        "name": frm.doc.name,
						        "fieldname": {
								"end_date":r.message[i].end_date,
								"start_date": r.message[i].start_date,
								"associate_agent_company":r.message[i].party_name
							},
						    }
						})
				}

			}
                }
            }
        })
        
    },
after_save:function(frm,cdt,cdn){
	frappe.db.get_value("Supplier",{"represents_company":frm.doc.company_name}, "has_sbtfx_contract",(s)=>{
		if(s.has_sbtfx_contract!=frm.doc.has_sbtfx_contract){
				frappe.db.get_value("Supplier",{"represents_company":frm.doc.company_name}, "name",(r)=>{
					frappe.call({
		                                    async: false,
		                                    "method": "frappe.client.set_value",
		                                    "args": {
		                                        "doctype": "Supplier",
		                                        "name": r.name,
		                                        "fieldname": "has_sbtfx_contract",
		                                        "value":frm.doc.has_sbtfx_contract
		                                    }
		                                });
			})
		}
	})
	frappe.db.get_value("Supplier",{"represents_company":frm.doc.company_name}, "bank_name",(s)=>{
		if(s.bank_name!=frm.doc.bank_name){
				frappe.db.get_value("Supplier",{"represents_company":frm.doc.company_name}, "name",(r)=>{
					frappe.call({
		                                    async: false,
		                                    "method": "frappe.client.set_value",
		                                    "args": {
		                                        "doctype": "Supplier",
		                                        "name": r.name,
		                                        "fieldname": "bank_name",
		                                        "value":frm.doc.bank_name
		                                    }
		                                });
			})
		}
	})
	frappe.db.get_value("Supplier",{"represents_company":frm.doc.company_name}, "bank_account",(s)=>{
		if(s.bank_account!=frm.doc.bank_account){
				frappe.db.get_value("Supplier",{"represents_company":frm.doc.company_name}, "name",(r)=>{
					frappe.call({
		                                    async: false,
		                                    "method": "frappe.client.set_value",
		                                    "args": {
		                                        "doctype": "Supplier",
		                                        "name": r.name,
		                                        "fieldname": "bank_account",
		                                        "value":frm.doc.bank_account
		                                    }
		                                });
			})
		}
	})
},
associate_agent_company:function(frm,cdt,cdn){
    if(frm.doc.associate_agent!==undefined){
        frm.doc.associate_agent='';
        cur_frm.refresh_fields("associate_agent");
    }
       frm.set_query("associate_agent", function() {
            return {
                    query: "seabridge_app.seabridge_app.api.get_user_name",
                    filters:{
                        "represents_company":frm.doc.associate_agent_company,
                        "role":"Agent"
                    }
                
            };
        });

},
associate_agent:function(frm,cdt,cdn){
	if(agent){

	}
    const doc = frm.doc;
      frappe.confirm(
					__("Do you want to assign the company "+frm.doc.associate_agent_company+" for the agent "+frm.doc.associate_agent+"?"),
					function () {
					    if(frm.doc.associate_agent!==undefined && agent!==undefined){
						delete_user_permission(agent,frm.doc.company_name);
						 frappe.call({
                        			method: "seabridge_app.seabridge_app.api.validate_user_permission",
                        			async:false,
                        			args: {
                        				doctype: "User Permission",
                        				user: agent,
                        				allow:'Company',
                        				value:frm.doc.company_name
                        			}
                            });
						    create_user_permission(frm.doc.associate_agent,frm.doc.company_name);
				
						    var emailTemplate='<h1><strong>  You are authorised to work for the company '+frm.doc.associate_agent_company+'</strong></h1>';
				            sendEmail(frm.doc.name,frm.doc.associate_agent,emailTemplate);
                         }
                         else if(frm.doc.associate_agent!==undefined){
                            create_user_permission(frm.doc.associate_agent,frm.doc.company_name);

						    var emailTemplate='<h1><strong>  You are authorised to work for the company '+frm.doc.associate_agent_company+'</strong></h1>';
				            sendEmail(frm.doc.name,frm.doc.associate_agent,emailTemplate);
                         }
				frappe.db.get_value("Registration",{"company":frm.doc.name}, "name",(s)=>{
					frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Registration",
                                                "name":s.name ,
                                                "fieldname": "agent_user",
                                                "value":frm.doc.associate_agent
                                            }
                                        });
					})		
					}
					);
			
      
}
});

function create_user_permission(associate_agent,company_name){
     frappe.call({
			method: "seabridge_app.seabridge_app.doctype.request_for_quotation.request_for_quotation.create_user_permission",
			async:false,
			args: {
				doctype: "User Permission",
				user: associate_agent,
				allow:'Company',
				value:company_name,
				check:1
			}
    });
}

function delete_user_permission(associate_agent,company_name){
     frappe.call({
			method: "seabridge_app.seabridge_app.doctype.request_for_quotation.request_for_quotation.delete_user_permission",
			async:false,
			args: {
				doctype: "User Permission",
				user: associate_agent,
				allow:'Company',
				value:company_name,
				check:1
			}
    });
}


function sendEmail(name,email,template){
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
