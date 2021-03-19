// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Bank Payment Advice', {

company:function(frm,cdt,cdn){
	frappe.db.get_value("Bank Account",frm.doc.bank_account,"company",(c)=>{
		if(c.company!=frm.doc.company){
			frm.set_value('bank_account','')
			cur_frm.refresh_field("bank_payment_advice_details")
		}
	})
},
refresh:function(frm,cdt,cdn){
frm.set_query("company",function(){
                return{
                    filters: {
                        "company_type":'Customer'
                    }
                };
             });


if(frm.doc.docstatus==1){
frm.add_custom_button(__('Export'), function(){
//frm.set_value('reference_doctype',frm.doc.doctype)
			const doctype = frm.doc.doctype;
			if (doctype) {
			frappe.model.with_doctype(doctype, () => set_field_options(frm));
			} else {
			reset_filter_and_field(frm);
			}
			can_export(frm) ? export_data(frm) : null;
		
})
}


   frm.set_query("bank_account",function(){
                return{
                    filters: [
                        ["Bank Account","company", "=", frm.doc.company],
			["Bank Account","is_company_account", "=", 1]
                    ]
                }
            }); 
var hideTheButtonWrapper = $('*[data-fieldname="bank_payment_advice_details"]');
hideTheButtonWrapper .find('.grid-add-row').hide();

if(frm.doc.docstatus==0){
	frm.add_custom_button(__('Get Invoices'), function(){
var select={}
	 let dialogObj= new frappe.ui.form.MultiSelectDialog({
 doctype: "Purchase Invoice",
 target: frm,
 setters: {
 supplier: "",
 due_date:"",
 outstanding_amount:""
 },
 date_field: "transaction_date",
 get_query() {
 return {
 filters: {  docstatus: ['=', 1] ,workflow_state: ['=', "To Pay"] ,company:frm.doc.company}
 }
 },
 action(selections) {
select=selections
 $.each(selections,function(idx){
 frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Purchase Invoice",
                fields: ["name","due_date","supplier_name","status","grand_total","outstanding_amount"],
                filters:{
                    "name":select[idx]
                },
            },
            callback: function(r) {
                for(var i=0;i<r.message.length;i++){
                    var count=0
                    $.each(frm.doc.bank_payment_advice_details, function(idx, detail){
                        if(detail.invoice_document==r.message[i].name){
                            count++;
                        }
                    })
                    if(count==0){
			
                    var child = cur_frm.add_child("bank_payment_advice_details");
                    child.invoice_document=r.message[i].name;
			        child.due_date = r.message[i].due_date;
			        child.supplier_name=r.message[i].supplier_name
			        child.status = r.message[i].status;
			        child.invoice_amount = r.message[i].grand_total;
			        child.outstanding_amount=r.message[i].outstanding_amount;
			        child.payment_transaction_amount=r.message[i].outstanding_amount;
				child.overdue_days=frappe.datetime.get_day_diff(frappe.datetime.nowdate(),child.due_date)
				
			         frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Purchase Invoice",
                fields: ["name","is_return","return_against","grand_total"],
                filters:{
                    "return_against":select[idx]
                },
            },
            callback: function(r) {
                if(r.message.length>0){
                    
                for(var i=0;i<r.message.length;i++){
                    child.debit_note = r.message[i].name;
                    child.debit_note_amount = r.message[i].grand_total;
                }
                }
            }
			         })
			
			frappe.db.get_value("Purchase Invoice",select[idx],"purchase_order",(c)=>{
				if(c.purchase_order){
				child.purchase_order=c.purchase_order
				frappe.db.get_value("Purchase Order",c.purchase_order,"grand_total",(c)=>{
						child.purchase_order_amount=c.grand_total
						cur_frm.refresh_field("bank_payment_advice_details")
					})
				}
				
			})
			

	frappe.db.get_value("Supplier",child.supplier_name,"has_sbtfx_contract",(s)=>{
		child.has_sbtfx_contract=s.has_sbtfx_contract;
		cur_frm.refresh_field("bank_payment_advice_details")
		if(s.has_sbtfx_contract==1){
			frappe.db.get_value("Supplier",child.supplier_name,"represents_company",(c)=>{
				frappe.db.get_value("Company",c.represents_company,"parent_company",(p)=>{
					frappe.db.get_value("Company",p.parent_company,"bank_account",(b)=>{
						child.bank_account=b.bank_account
					})
					frappe.db.get_value("Company",p.parent_company,"bank_name",(b)=>{
						child.bank_name=b.bank_name
					})
				
				})
			})
		}
		else{


		frappe.db.get_value("Supplier",child.supplier_name,"bank_account",(b)=>{
			child.bank_account=b.bank_account
		})
		frappe.db.get_value("Supplier",child.supplier_name,"bank_name",(b)=>{
			child.bank_name=b.bank_name
		})
				

		}		
	})
			cur_frm.refresh_field("bank_payment_advice_details")

			
                    }
                }
               
            }
        })
 cur_frm.refresh_field("bank_payment_advice_details")
 })
dialogObj.dialog.hide()
cur_frm.save();
}

}); 

	frappe.call({
                method:"seabridge_app.seabridge_app.doctype.bank_payment_advice.bank_payment_advice.sort_details",
                args:{
			doc:frm.doc.name		
		},
                async:false,
                callback: function(r){
			var idx_count=0;
			$.each(frm.doc.bank_payment_advice_details, function(idx, detail){
				if(detail.invoice_document!=r.message[idx].invoice_document){
					idx_count++;
				}			
			})
			if(idx_count>0){
			cur_frm.clear_table("bank_payment_advice_details");

			for(var i=0;i<r.message.length;i++){
				var child = cur_frm.add_child("bank_payment_advice_details");
				child.invoice_document=r.message[i].invoice_document,
				child.due_date=r.message[i].due_date,
				child.supplier_name=r.message[i].supplier_name,
				child.has_sbtfx_contract=r.message[i].has_sbtfx_contract,
				child.invoice_amount=r.message[i].invoice_amount,
				child.debit_note=r.message[i].debit_note,
				child.debit_note_amount=r.message[i].debit_note_amount,
				child.outstanding_amount=r.message[i].outstanding_amount,
				child.payment_transaction_amount=r.message[i].payment_transaction_amount,
				child.purchase_order=r.message[i].purchase_order,
				child.purchase_order_amount=r.message[i].purchase_order_amount,
				child.cheque_no=r.message[i].cheque_no,
				child.cheque_date=r.message[i].cheque_date,
				child.overdue_days=r.message[i].overdue_days,
				child.bank_account=r.message[i].bank_account,
				child.bank_name=r.message[i].bank_name
			}
			}
			
		}
		})
  });	
   }
	
	},
	date:function(frm,cdt,cdn){
	 if(frm.doc.date<frappe.datetime.nowdate()){
	      msgprint("Date cannot be before todays date")
	      frm.set_value("date","")
            cur_frm.refresh_field("date")
	 }   
	},
	before_save:function(frm,cdt,cdn){
		$.each(frm.doc.bank_payment_advice_details, function(idx, item){
			item.cheque_date=frappe.datetime.nowdate()
			if(item.bank_account || item.bank_name){}
			else{
				frappe.db.get_value("Supplier",item.supplier_name,"has_sbtfx_contract",(c)=>{
					if(c.has_sbtfx_contract==1){
						frappe.db.get_value("Supplier",item.supplier_name,"bank_account",(b)=>{
							if(b.bank_account){item.bank_account=b.bank_account}
						})
						frappe.db.get_value("Supplier",item.supplier_name,"bank_name",(b)=>{
							if(b.bank_name){item.bank_name=b.bank_name}
						})
					}
					else{
						frappe.db.get_value("Supplier",item.supplier_name,"represents_company",(r)=>{
							frappe.db.get_value("Company",r.represents_company,"parent_company",(p)=>{
								frappe.db.get_value("Company",p.parent_company,"bank_name",(bn)=>{
									if(bn.bank_account){item.bank_account=bn.bank_account}	
								})
								frappe.db.get_value("Company",p.parent_company,"bank_name",(bn)=>{
									if(bn.bank_name){item.bank_name=bn.bank_name}
								})
							})
						})


					}
				})
			}

		})
		

	},
	

	before_submit:function(frm,cdt,cdn){
		$.each(frm.doc.bank_payment_advice_details, function(idx, item){
			item.cheque_date=frappe.datetime.nowdate()
			item.cheque_no=frm.doc.name
		})

		
    }
})

frappe.ui.form.on("Bank Payment Advice Details", "invoice_document",function(frm, doctype, name) {
    var row = locals[doctype][name];
    frappe.db.get_value('Purchase Invoice',{'name':row.invoice_document},"due_date",(r)=>{
    row.due_date = r.due_date;
    refresh_field("bank_payment_advice_details");
    })
	})


frappe.ui.form.on("Bank Payment Advice Details", "debit_note_amount",function(frm, doctype, name) {
    var row = locals[doctype][name];
    row.outstanding_amount = row.invoice_amount+row.debit_note_amount;
    refresh_field("bank_payment_advice_details");
	})
	
frappe.ui.form.on("Bank Payment Advice Details", "payment_transaction_amount",function(frm, doctype, name) {
    var row = locals[doctype][name];
    if(row.payment_transaction_amount>row.outstanding_amount)
    {   msgprint("Payment Transaction amount cannot be greater than Outstanding Amount")
        row.payment_transaction_amount=0;
        refresh_field("bank_payment_advice_details");
	
    }
    })

const can_export = frm => {
	const doctype = frm.doc.doctype;
	const parent_multicheck_options = frm.fields_multicheck[doctype] ?
		frm.fields_multicheck[doctype].get_checked_options() : [];
	let is_valid_form = false;
	if (!doctype) {
		frappe.msgprint(__('Please select the Document Type.'));
	} else if (!parent_multicheck_options.length) {
		frappe.msgprint(__('Atleast one field of Parent Document Type is mandatory'));
	} else {
		is_valid_form = true;
	}
	return is_valid_form;
};

const export_data = frm => {
	let get_template_url = '/api/method/frappe.core.doctype.data_export.exporter.export_data';
	var export_params = () => {
		let columns = {};
		Object.keys(frm.fields_multicheck).forEach(dt => {
			const options = frm.fields_multicheck[dt].get_checked_options();
			columns[dt] = options;
		});
		return {
			doctype: frm.doc.doctype,
			select_columns: JSON.stringify(columns),
			filters: {'name':frm.doc.name},
			file_type: "CSV",
			template: true,
			with_data: 1
		};
	};

	open_url_post(get_template_url, export_params());
};

const reset_filter_and_field = (frm) => {
	const parent_wrapper = frm.fields_dict.fields_multicheck.$wrapper;
	const filter_wrapper = frm.fields_dict.filter_list.$wrapper;
	parent_wrapper.empty();
	filter_wrapper.empty();
	frm.filter_list = [];
	frm.fields_multicheck = {};
};

const set_field_options = (frm) => {
	const parent_wrapper = frm.fields_dict.fields_multicheck.$wrapper;
	const filter_wrapper = frm.fields_dict.filter_list.$wrapper;
	const doctype = frm.doc.doctype;
	const related_doctypes = get_doctypes(doctype);

	parent_wrapper.empty();
	filter_wrapper.empty();

	frm.filter_list = new frappe.ui.FilterGroup({
		parent: filter_wrapper,
		doctype: doctype,
		on_change: () => { },
	});

	// Add 'Select All' and 'Unselect All' button
	make_multiselect_buttons(parent_wrapper);

	frm.fields_multicheck = {};
	related_doctypes.forEach(dt => {
		frm.fields_multicheck[dt] = add_doctype_field_multicheck_control(dt, parent_wrapper);
	});

	frm.refresh();
};

const make_multiselect_buttons = parent_wrapper => {
	const button_container = $(parent_wrapper)
		.append('<div class="flex"></div>')
		.find('.flex');

	["Select All", "Unselect All"].map(d => {
		frappe.ui.form.make_control({
			parent: $(button_container),
			df: {
				label: __(d),
				fieldname: frappe.scrub(d),
				fieldtype: "Button",
				click: () => {
					checkbox_toggle(d !== 'Select All');
				}
			},
			render_input: true
		});
	});

	$(button_container).find('.frappe-control').map((index, button) => {
		$(button).css({"margin-right": "1em"});
	});

	function checkbox_toggle(checked) {
		$(parent_wrapper).find('[data-fieldtype="MultiCheck"]').map((index, element) => {
			$(element).find(`:checkbox`).prop("checked", checked).trigger('click');
		});
	}

};

const get_doctypes = parentdt => {
	return [parentdt].concat(
		frappe.meta.get_table_fields(parentdt).map(df => df.options)
	);
};

const add_doctype_field_multicheck_control = (doctype, parent_wrapper) => {
	const fields = get_fields(doctype);

	const options = fields
		.map(df => {
			return {
				label: df.label,
				value: df.fieldname,
				danger: df.reqd,
				checked: 1
			};
		});

	const multicheck_control = frappe.ui.form.make_control({
		parent: parent_wrapper,
		df: {
			"label": doctype,
			"fieldname": doctype + '_fields',
			"fieldtype": "MultiCheck",
			"options": options,
			"columns": 3,
		},
		render_input: true
	});

	multicheck_control.refresh_input();
	return multicheck_control;
};

const filter_fields = df => frappe.model.is_value_type(df) && !df.hidden;
const get_fields = dt => frappe.meta.get_docfields(dt).filter(filter_fields);
