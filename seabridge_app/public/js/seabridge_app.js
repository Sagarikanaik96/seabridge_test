$(document).on("startup", function () {
	var role=0
	previous_route=frappe.get_route()
	if(frappe.session.user!="Administrator"){
		frappe.call({method:"seabridge_app.seabridge_app.api.get_user_roles_dashboard",
			async:false,
			callback:function(r){
				role=r.message
			}
		})
		if(previous_route[0]==""){
			//dashboard for Accounts payable or Estate manager role
			if(role==1 || role==2){
				frappe.set_route("#agent-action-list");
			}
			//payment dashboard for Finance manager
			else if(role==3){
				frappe.set_route("#finance-action-list");		
			}
		}
	}
});
