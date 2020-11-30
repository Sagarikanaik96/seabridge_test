// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt
var today = new Date().toISOString().slice(0, 10)
frappe.ui.form.on('Request for Quotation', {
	opening_date:function(frm,cdt,cdn){
		if(frm.doc.opening_date<today){
			frm.doc.opening_date='';
			cur_frm.refresh_field('opening_date');
			frappe.throw("Opening Date cannot be before today's date.");
		}
	},
	refresh:function(frm,cdt,cdn){
		var item_group=[];
		item_group=get_item_group(frm.doc.items);
		supplier_filter(frm,item_group);
		if(frm.doc.quotation_type=='Sealed'&& frappe.user_roles.includes('Customer Representative')){
			cur_frm.add_custom_button(__("Open Quotation"),function() {
					frappe.call({
							method: "frappe.client.get_list",
							"async":false,
							args: {
							doctype: "Supplier Quotation",
							fields: ["*"],
							filters:{
								"quotation_type":'Sealed',
								"rfq_no":frm.doc.name
								},
								"limit_page_length":0
							},
						callback: function(r) {
							for(var i=0;i<r.message.length;i++){
							if(r.message[i].opening_date==today){
								frappe.call({
									"method": "frappe.client.set_value",
									"args": {
									"doctype": "Supplier Quotation",
									"name": r.message[i].name,
									"fieldname": "quotation_type",
									"value": "Open"
									},
									'async': false
								});
								cur_frm.timeline.insert_comment(frappe.user_info().fullname+' opened the Supplier Quotation:' +r.message[i].name)
								
								frappe.call({
									"method": "seabridge_app.seabridge_app.api.add_comment",
									"args": {
									"doctype": "Supplier Quotation",
									"name": r.message[i].name,
									"owner":frappe.user_info().fullname
									},
								});
								}
							else if(frm.doc.opening_date>today){
								frappe.throw("Unable to open the "+r.message[i].name+ "as the Opening Date: "+r.message[i].opening_date+" is not reached. Please open the document on" +r.message[i].opening_date+".");
							}
							else if(frm.doc.opening_date<today){
								frappe.throw("Unable to open the '+r.message[i].name+ ' as you don't have enough permission. Please login as a Customer Representative of "+r.message[i].company+" to open the document.");
							}
							}
						}
					});
				
			});
		}
	},
	on_submit:function(frm,cdt,cdn){
		var doc=frm.doc;
		$.each(doc.suppliers,function(idx,supplier){
			$.each(doc.items,function(idx,item){
				frappe.call({
					method: "seabridge_app.seabridge_app.doctype.request_for_quotation.request_for_quotation.get_tag",
					async:false,
					args: {
						parent:supplier.supplier
					},
					callback: function(r) {
						if(r.message===item.qualifier){
							var company;
							var name;
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
									console.log(r.message)
								}
							});
							frappe.call({
								method: "seabridge_app.seabridge_app.api.get_opportunity_name",
								async:false,
								args: {
									doctype: "Opportunity",
									reference_no:frm.doc.name
								},
								callback: function(c){
									name=c.message;
								}
							});
							if(company!==undefined){
								var agent;
								var customer;
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
									callback: function(r) {
										if(r.message.associate_agent!==undefined){
											agent=r.message.associate_agent;
										}
									}
								});
								frappe.call({
									method: "frappe.client.get_value",
									async:false,
									args: {
										doctype: "Customer",
										fieldname: "customer_name",
										filters:{
											"is_internal_Customer":1,
											"represents_company":frm.doc.company
										}
									},
									callback: function(r) {
										if(r.message.customer_name!==undefined){
											customer=r.message.customer_name;
										}
									}
								});
								if(agent!=null){
									var emailTemplate=
										'<h3> Dear '+supplier.supplier_name+',</h3>'+
										'<br>'+
										'<h3>We understand that your company manufactures some products that fit our business requirements, and would like to request a quotation on the following attached items. We would appreciate your sales quotation for the listed items/services available in Request for Quotation attachment.</h3>'+
										'<br>'+
										'<h3>Thank you, I look forward to your prompt response.</h3>'+
										'<br>'+
										'<h3>Yours sincerely,</h3>'+
										'<h3>'+agent+'</h3>'+
										'<h3>'+customer+'</h3>'+
										'<h3>'+frm.doc.company+'</h3>';
									sendEmail(name,supplier.email_id,emailTemplate);
								}
								else if (agent==null){
									var emailTemplate=
										'<h3> Dear '+supplier.supplier_name+',</h3>'+
										'<br>'+
										'<h3>We understand that your company manufactures some products that fit our business requirements, and would like to request a quotation on the following attached items. We would appreciate your sales quotation for the listed items/services available in Request for Quotation attachment.</h3>'+
										'<br>'+
										'<h3>Thank you, I look forward to your prompt response.</h3>'+
										'<br>'+
										'<h3>Yours sincerely,</h3>'+
										'<h3>'+customer+'</h3>'+
										'<h3>'+frm.doc.company+'</h3>';
									sendEmail(name,supplier.email_id,emailTemplate);
								}
							}
							else{
								var emailTemplate1='<h1><strong>Unable to create an Opportunity because you do not have any company associated with yourself</strong></h1>';
								sendEmail(name,supplier.email_id,emailTemplate1);
							}
						}
					}
				});
			});
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

  	},
	before_cancel:function(frm,cdt,cdn){
		frappe.throw('Unable to cancel the document as Request for Quotation'+frm.doc.name+'is linked with the submitted opportunity.')
	},
	before_submit:function(frm,cdt,cdn){
		$.each(frm.doc.suppliers,function(idx,supplier){
			if(supplier.contact && supplier.email_id){}
			else{
				frappe.throw('Unable to submit the document as contact details are unavailable for the supplier: '+supplier.supplier+'. Please provide the contact details to submit the document.')
			}
		})
	}
});
frappe.ui.form.on('Request for Quotation Item', {
	item_code:function(frm,cdt,cdn){
		var item_group=[];
		item_group=get_item_group(frm.doc.items);
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
							doctype: "Opportunity",
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
							return {
								filters: {
									supplier_name:["in",suppliers] 
								}
							};
						});
						
				}
		});
	
	}
