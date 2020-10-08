var agent;
frappe.ui.form.on('Company', {
refresh:function(frm,cdt,cdn){
        agent=frm.doc.associate_agent;
        if(frm.doc.company_type=="Customer"){
            frm.set_query("associate_agent_company",function(){
                return{
                    filters: {
                        "company_type":'Agent'
                    }
                };
             });
        }
        
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
    const doc = frm.doc;
      frappe.confirm(
					__("do you want to assign the company "+frm.doc.associate_agent_company+" for the agent "+frm.doc.associate_agent+"?"),
					function () {
					    if(frm.doc.associate_agent!==undefined && agent!==undefined){
						 frappe.call({
                        			method: "seabridge_app.seabridge_app.api.validate_user_permission",
                        			async:false,
                        			args: {
                        				doctype: "User Permission",
                        				user: agent,
                        				allow:'Company',
                        				value:frm.doc.associate_agent_company
                        			}
                            });
						    create_user_permission(frm.doc.associate_agent,frm.doc.associate_agent_company);
						    var emailTemplate='<h1><strong>  You are authorised to work for the company '+frm.doc.associate_agent_company+'</strong></h1>';
				            sendEmail(frm.doc.name,frm.doc.associate_agent,emailTemplate);
                         }
                         else if(frm.doc.associate_agent!==undefined){
                            create_user_permission(frm.doc.associate_agent,frm.doc.associate_agent_company);
						    var emailTemplate='<h1><strong>  You are authorised to work for the company '+frm.doc.associate_agent_company+'</strong></h1>';
				            sendEmail(frm.doc.name,frm.doc.associate_agent,emailTemplate);
                         }
						
					}
					);
      
}
});

function create_user_permission(associate_agent,associate_agent_company){
     frappe.call({
			method: "seabridge_app.seabridge_app.doctype.request_for_quotation.request_for_quotation.create_user_permission",
			async:false,
			args: {
				doctype: "User Permission",
				user: associate_agent,
				allow:'Company',
				value:associate_agent_company,
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
