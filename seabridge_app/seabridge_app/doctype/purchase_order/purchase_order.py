# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PurchaseOrder(Document):
	pass

def auto_create_sales_order(doc,method): 
	customer=frappe.db.get_value('Customer',{'is_internal_customer':1,'represents_company':doc.company},'customer_name')
	company=frappe.db.get_value('Supplier',{'is_internal_supplier':1,'supplier_name':doc.supplier_name},'represents_company')
	so_name=frappe.db.get_list('Document Specific Naming Series',filters={'parent':company,'parenttype':'Company'},fields={'*'})
	warehouse=frappe.db.get_value('Company',{'company_name':doc.supplier_name},'default_warehouse')
	sales_order_name="null"
	for tup in so_name:
	    if tup.reference_document=="Sales Order":
	        sales_order_name=tup.series

	if sales_order_name!="null":
		if customer:
			if company:
					taxes=frappe.db.get_value('Sales Taxes and Charges Template',{'company':doc.supplier_name},'name')
					tax=frappe.db.get_list("Sales Taxes and Charges",filters={'parent':taxes,'parenttype':'Sales Taxes and Charges Template'},fields={'*'})
					attachment_list=frappe.db.get_list("Attachment Checklist Detail",filters={'parent':doc.name,'parenttype':'Purchase Order'},fields={'*'})
					agent=frappe.db.get_value('Company',{'Company_name':doc.company},'associate_agent')
					so_doc=frappe.get_doc(dict(doctype = 'Sales Order',
						    company=company,
						    naming_series=sales_order_name,
						    customer=customer,
						    delivery_date=doc.schedule_date,
						    customer_address=frappe.db.get_value("Dynamic Link",{"parenttype":"Address","link_doctype":"Customer","link_name":customer},"parent"),
						    contact_person=frappe.db.get_value('Dynamic Link',{'parenttype':'Contact','link_doctype':'Customer',"link_name":customer},'parent'),
						    taxes_and_charges=frappe.db.get_value('Sales Taxes and Charges Template',{'company':doc.supplier_name},'name'),
						    po_no=doc.name,
						    set_warehouse=warehouse,
						    po_date=doc.transaction_date,
						    total=doc.total,
						    grand_total=doc.grand_total,
						    base_grand_total=doc.base_grand_total,
						    rounded_total=doc.rounded_total,
						    base_rounded_total=doc.base_rounded_total,
						    payment_terms_template=doc.payment_terms_template,
						    tc_name=doc.tc_name,
						    terms=doc.terms,
						    attachment_checklist_template=doc.attachment_checklist_template,
						    invoice_description=doc.invoice_description
						)).insert(ignore_mandatory=True)
					if agent:
						contact=frappe.db.get_value('Contact',{'user':agent},'name')
						if contact:
							so_doc.update({
								"_agent_contact_person":contact,
								"_agent_contact_email":frappe.db.get_value('Contact Email',{'parent':contact},'email_id'),
								"agent_contact_phone":frappe.db.get_value('Contact Phone',{'parent':contact},'phone')
							})
					for val in doc.items:
						so_doc.append('items', {
						    'item_code':val.item_code,
						    'delivery_date':doc.schedule_date,
						    'qty':val.qty,
						    'uom':val.uom,
						    'stock_uom':val.stock_uom,
						    'rate':val.rate,
						    'amount':val.amount,
						    'base_rate':val.base_rate,
						    'base_amount':val.base_amount,
						    'description':val.description,
						    'warehouse':warehouse,
						    'conversion_factor':val.conversion_factor
						})
					for row in tax:
					    so_doc.append('taxes',{
						'account_head':row.account_head,
						'charge_type':row.charge_type,
						'rate':row.rate
					    })
					for detail in attachment_list:
					    so_doc.append('attachment_checklist',{
						'description':detail.description,
						'options':detail.options,
						'remarks':detail.remarks
					    })
					agent_name=frappe.db.get_value('User',{'email':frappe.session.user},'full_name')
					agent_company=frappe.db.get_value('User',{'email':frappe.session.user},'represents_company')
					if agent_company:
						so_doc.add_comment('Comment',agent_name+' created '+so_doc.name+' from '+agent_company)
					so_doc.save()
					doc.add_comment('Comment','  Sales Order: '+so_doc.name)
					files=frappe.db.get_list('File',filters={'attached_to_doctype':'Purchase Order','attached_to_name':doc.name},fields={'*'})
					for single_file in files:
						file_doc=frappe.get_doc(dict(doctype = 'File',
							file_name=single_file.file_name,
							is_private=single_file.is_private,
							file_size=single_file.file_size,
							file_url=single_file.file_url,
							attached_to_doctype="Sales Order",
							attached_to_name=so_doc.name
						)).insert(ignore_mandatory=True)
						file_doc.save()
	else:
    		frappe.throw("Unable to save the Sales Order as the naming series are unavailable . Please provide the naming series at the Company: "+company+" to save the document");

