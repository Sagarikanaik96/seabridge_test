// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt
var agent;
frappe.ui.form.on('Registration',{ 
    company:function(frm,cdt,cdn){
    let parts = frm.doc.company.split(" ");
		let abbr = $.map(parts, function (p) {
			return p? p.substr(0, 1) : null;
		}).join("");
		frm.set_value("abbr", abbr);
},

agent_company:function(frm,cdt,cdn){
    if(frm.doc.agent_user!==undefined){
        frm.doc.agent_user='';
        cur_frm.refresh_fields("agent_user");
    }
       frm.set_query("agent_user", function() {
            return {
                    query: "seabridge_app.seabridge_app.api.get_user_name",
                    filters:{
                        "represents_company":frm.doc.agent_company,
                        "role":"Agent"
                    }
            };
        });
},
refresh:function(frm,cdt,cdn){
	agent=frm.doc.agent_user;
        if(frm.doc.company_type=="Vendor"){
            frm.set_query("represents_company",function(){
                return{
                    filters: [
                        ["Company","company_name", "in", frm.doc.company]
                    ]
                }
            });
            
        }
	frm.set_query("parent_company",function(){
                return{
                    filters: [
                        ["Company","is_group", "=", 1]
                    ]
                }
            });
            
	frm.set_query("agent_user", function() {
            return {
                    query: "seabridge_app.seabridge_app.api.get_user_filter",
                    filters:{
                        "represents_company":frm.doc.agent_company
                    },
                
            };
        });
	 
    
    },

on_submit:function(frm,cdt,cdn){
        if(frm.doc.company_type=="Vendor" || frm.doc.company_type=="Agent"){
		if(frm.doc.supplier_name){
		    frm.set_value("represents_company",frm.doc.company)
		    frm.set_value("internal_supplier",1)
		}
        }
	if(frm.doc.company_type=="Customer"){
		    frm.set_value("represents_companys",frm.doc.company)
		    frm.set_value("is_internal_customer",1)
        }
},
agent_user:function(frm,cdt,cdn){
   	const doc = frm.doc;
       
					    if(frm.doc.agent_user!==undefined && agent!==undefined){
						 frappe.call({
                        			method: "seabridge_app.seabridge_app.api.validate_user_permission",
                        			async:false,
                        			args: {
                        				doctype: "User Permission",
                        				user: agent,
                        				allow:'Company',
                        				value:frm.doc.company
                        			}
                            });
				        frappe.db.get_value("Company",frm.doc.company, "name",(s)=>{
					frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Company",
                                                "name":s.name ,
                                                "fieldname": "associate_agent",
                                                "value":frm.doc.agent_user
                                            }
                                        });
					})
						    create_user_permission(frm.doc.agent_user,frm.doc.company);
				
						    var emailTemplate='<h1><strong>  You are authorised to work for the company '+frm.doc.agent_company+'</strong></h1>';
				            sendEmail(frm.doc.name,frm.doc.agent_user,emailTemplate);
                         }
                         else if(frm.doc.agent_user!==undefined){
                            create_user_permission(frm.doc.agent_user,frm.doc.company);

						    var emailTemplate='<h1><strong>  You are authorised to work for the company '+frm.doc.agent_company+'</strong></h1>';
				            sendEmail(frm.doc.name,frm.doc.agent_user,emailTemplate);
                         }
						
					
					
      
	
    },

before_submit:function(frm,cdt,cdn){
        if(frm.doc.company_type=="Vendor" || frm.doc.company_type=="Agent"){
		if(frm.doc.customer_name){
			msgprint('Unable to create the Customer as Company Type is '+frm.doc.company_type,'Alert')
		}
		frm.set_value("customer_name", "")
		frm.set_value("customer_group", "")
		frm.set_value("customer_type", "")
		
        }
	if(frm.doc.company_type=="Customer"){
		if(frm.doc.supplier_name){
			msgprint('Unable to create the Supplier as Company Type is '+frm.doc.company_type,'Alert')
		}
		frm.set_value("supplier_name", "")
		frm.set_value("supplier_group", "")
		frm.set_value("supplier_type", "")
		
        }
	
    },

before_save:function(frm,cdt,cdn){
	if(frm.doc.date==null){
        	frm.set_value("date",frappe.datetime.get_today())
	}
    },

before_cancel:function(frm,cdt,cdn){
	frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Registration",
                                                "name":frm.doc.name ,
                                                "fieldname": "internal_supplier",
                                                "value":0
                                            }
                                        });
	frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Registration",
                                                "name":frm.doc.name ,
                                                "fieldname": "represents_company",
                                                "value":''
                                            }
                                        });
	frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Registration",
                                                "name":frm.doc.name ,
                                                "fieldname": "is_internal_customer",
                                                "value":0
                                            }
                                        });
	frappe.call({
                                            async: false,
                                            "method": "frappe.client.set_value",
                                            "args": {
                                                "doctype": "Registration",
                                                "name":frm.doc.name ,
                                                "fieldname": "represents_companys",
                                                "value":''
                                            }
                                        });
	cur_frm.refresh_fields("internal_supplier");
	cur_frm.refresh_fields("represents_company");
	cur_frm.refresh_fields("is_internal_customer");
	cur_frm.refresh_fields("represents_companys");
}
})

function create_user_permission(agent_user,company){
     frappe.call({
			method: "seabridge_app.seabridge_app.doctype.request_for_quotation.request_for_quotation.create_user_permission",
			async:false,
			args: {
				doctype: "User Permission",
				user: agent_user,
				allow:'Company',
				value:company,
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

