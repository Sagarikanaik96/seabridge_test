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
	sales_order_name="null"
	for tup in so_name:
	    if tup.reference_document=="Sales Order":
	        sales_order_name=tup.series

	if sales_order_name!="null":
		if customer:
			if company:
					taxes=frappe.db.get_value('Sales Taxes and Charges Template',{'company':doc.supplier_name},'name')
					tax=frappe.db.get_list("Sales Taxes and Charges",filters={'parent':taxes,'parenttype':'Sales Taxes and Charges Template'},fields={'*'})
					so_doc=frappe.get_doc(dict(doctype = 'Sales Order',
						    company=company,
						    naming_series=sales_order_name,
						    customer=customer,
						    delivery_date=doc.schedule_date,
						    customer_address=frappe.db.get_value("Dynamic Link",{"parenttype":"Address","link_doctype":"Customer","link_name":customer},"parent"),
						    contact_person=frappe.db.get_value('Dynamic Link',{'parenttype':'Contact','link_doctype':'Customer',"link_name":customer},'parent'),
						    taxes_and_charges=frappe.db.get_value('Sales Taxes and Charges Template',{'company':doc.supplier_name},'name'),
						    po_no=doc.name,
						    po_date=doc.transaction_date,
						    total=doc.total,
						    grand_total=doc.grand_total,
						    base_grand_total=doc.base_grand_total,
						    rounded_total=doc.rounded_total,
						    base_rounded_total=doc.base_rounded_total,
						    payment_terms_template=doc.payment_terms_template,
						    tc_name=doc.tc_name
						)).insert(ignore_mandatory=True)
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
						'conversion_factor':val.conversion_factor
						})
					for row in tax:
					    so_doc.append('taxes',{
						'account_head':row.account_head,
						'charge_type':row.charge_type,
						'rate':row.rate
					    })
					so_doc.add_comment('Comment',' System created  '+so_doc.name)
					so_doc.save()
					doc.add_comment('Comment','  Sales Order: '+so_doc.name)
	else:
    		frappe.throw("Unable to save the Sales Order as the naming series are unavailable . Please provide the naming series at the Company: "+company+" to save the document");

