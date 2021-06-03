frappe.ui.form.on('Contract', {
refresh:function(frm,cdt,cdn){
	frm.set_query("company",function(){
                return{
                    filters: {
                        "company_type":'Customer'
                    }
                };
             });
},
on_submit:function(frm,cdt,cdn){
console.log(frappe.datetime.nowdate())
	 frappe.db.get_value('Registration',{'company':frm.doc.company},"end_date",(r)=>{
		console.log(r.end_date)
		if(r.end_date)	{
			console.log("Company setting1")
			frappe.db.get_value('Company',{'company_name':frm.doc.company},"end_date",(c)=>{
				if(((frappe.datetime.nowdate())>=frm.doc.start_date) && ((frappe.datetime.nowdate())<=frm.doc.end_date)){
								console.log("Company setting2")
					frappe.db.get_value('Company',{'company_name':frm.doc.company},"name",(s)=>{
					
						frappe.call({
						    "method": "frappe.client.set_value",
						    "args": {
						        "doctype": "Company",
						        "name": s.name,
						        "fieldname": {
								"end_date":frm.doc.end_date,
								"start_date": frm.doc.start_date,
								"associate_agent_company":frm.doc.party_name
							},
						    }
						})
								
					})

				}
			})
		}
		else{
			

			frappe.db.get_value('Registration',{'company':frm.doc.company},"name",(s)=>{
				
				frappe.call({
		                    "method": "frappe.client.set_value",
		                    "args": {
		                        "doctype": "Registration",
		                        "name": s.name,
		                        "fieldname": {
						"end_date":frm.doc.end_date,
						"start_date": frm.doc.start_date,
						"agent_company":frm.doc.party_name
					}
		                    }
		                })		
			})
			
			frappe.db.get_value('Company',{'company_name':frm.doc.company},"name",(s)=>{
				
				


				frappe.call({
		                    "method": "frappe.client.set_value",
		                    "args": {
		                        "doctype": "Company",
		                        "name": s.name,
		                        "fieldname": {
						"end_date":frm.doc.end_date,
						"start_date": frm.doc.start_date,
						"associate_agent_company":frm.doc.party_name,
						"notify_email":frappe.session.user
						
					}
		                    }
		                })		
			})
				
		}
	})
	
}
});

