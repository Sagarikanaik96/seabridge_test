// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Request for Quotation', {
	// refresh: function(frm) {

	// }
	after_save:function(frm,cdt,cdn){
		var doc=frm.doc;
		  $.each(doc.suppliers,function(idx,supplier){
			  var company;
			  frappe.call({
                method:"seabridge_app.seabridge_app.api.get_company_name",
				  args:{
					  doctype:'Supplier',
					  is_internal_supplier:1,
					  supplier_name:supplier.supplier
				  },
				 async:false,
				  callback: function(r){
					  company=r.message;
				  }
			  });
			  if(company!==undefined){
				  var emailTemplate='<h1><strong> Opportunity is created</strong></h1>';
				  sendEmail(doc.name,supplier.email_id,emailTemplate);
			  }
			  else{
				  var emailTemplate1='<h1><strong>Unable to create an Opportunity because you do not have any company associated with yourself</strong></h1>';
				  sendEmail(doc.name,supplier.email_id,emailTemplate1);
			  }
		  });
  },
  before_save:function(frm,cdt,cdn){
		var supplierList=frm.doc.suppliers;
	  for(var i=0; i< supplierList.length; i++) {
		  for(var j=i+1; j<supplierList.length; j++) {
				 if(supplierList[i].supplier===supplierList[j].supplier) {
				  frappe.throw('The already entered/inserted Supplier '+supplierList[j].supplier+' should not be allowed to added twice.');
			  }
		  }
	  }
  },
before_cancel:function(frm,cdt,cdn){
	frappe.throw('Unable to cancel the document as Request for Quotation'+frm.doc.name+'is linked with the submitted opportunity.')

}
});
frappe.ui.form.on('Request for Quotation Item', {
	item_code:function(frm,cdt,cdn){
		var item_group=[];
			item_group=get_item_group(frm.doc.items);
			cur_frm.refresh_fields();
			supplier_filter(frm,item_group);
	},
	qualifier:function(frm,cdt,cdn){
		var item_group=[];
		var tag_supplier=[];
		item_group=get_item_group(frm.doc.items);
		$.each(frm.doc.items, function(idx, item){
			frappe.call({
						method: "frappe.client.get_list",
						async:false,
						args: {
							doctype: "Tag Link",
							fields: "parent",
						filters:{
							"tag":item.qualifier,
							"parenttype":"Supplier"
							}
						},
					callback: function(r) {
						$.each( r.message,function(idx,supplier){
							if(!tag_supplier.includes(supplier.parent)){
								tag_supplier.push(supplier.parent);
							}
						});
				}
			});
		});
		cur_frm.refresh_fields();
		 supplier_filter(frm,item_group,tag_supplier);
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
							doctype: "Request for Quotation",
							name: name,
							print_letterhead: 0
						},
						callback: function(rh){
							console.log("sent");
						}   
					});
	}
	function get_item_group(items){
	var item_group=[];
		$.each(items,function(idx,item){
			frappe.call({
							method: "frappe.client.get_value",
							async:false,
							args: {
								doctype: "Item",
								fieldname: "item_group",
								filters:{
									"item_code":item.item_code
								}
							},
						callback: function(r) {
							if(!item_group.includes(r.message.item_group)){
								item_group.push(r.message.item_group);
							}
						}
					});
		});
		return item_group;
	}
	
	function supplier_filter(frm,item_group,tag_supplier=[]){
	var suppliers=[];
	console.log('jdshs',item_group)
		frappe.call({
			method:"seabridge_app.seabridge_app.api.get_supplier_List",
			async:false,
					args: {
						item_group: item_group,
						tag:tag_supplier
					},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
							suppliers.push(r.message[i]);
						}
						frm.set_query("supplier", "suppliers", function(frm, cdt, cdn) {
							async:false
							return {
								filters: {
									supplier_name:["in",suppliers] 
								}
							};
						});
				}
		});
	
	}