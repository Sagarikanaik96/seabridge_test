# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import datetime
from frappe.core.doctype.communication.email import make
from frappe.frappeclient import FrappeOAuth2Client,OAuth2Session
from frappe.utils.error import make_error_snapshot
from seabridge_app.seabridge_app.api import update_monthly_budget
import json
import requests
class SalesInvoice(Document):
	pass

def auto_create_purchase_invoice(doc,method):
	supplier=frappe.db.get_value('Supplier',{'is_internal_supplier':1,'represents_company':doc.company},'supplier_name')
	company=frappe.db.get_value('Customer',{'is_internal_Customer':1,'customer_name':doc.customer_name},'represents_company')
	contact_person=frappe.db.get_value('Dynamic Link',{'parenttype':'Contact','link_doctype':'Supplier',"link_name":supplier},'parent')
	pi_name=frappe.db.get_list('Document Specific Naming Series',filters={'parent':company,'parenttype':'Company'},fields={'*'})
	purchase_invoice_name="null"
	for tup in pi_name:
		if tup.reference_document=="Purchase Invoice":
			purchase_invoice_name=tup.series

	if purchase_invoice_name!="null":
		if company:
			if supplier:
				tax_template=frappe.db.get_value('Purchase Taxes and Charges Template',{'company':doc.customer_name},'name')
				tax_list=frappe.db.get_list("Purchase Taxes and Charges",filters={'parent':tax_template,'parenttype':'Purchase Taxes and Charges Template'},fields={'*'})
				pi_doc=frappe.get_doc(dict(doctype = 'Purchase Invoice',
							supplier=supplier,
							naming_series=purchase_invoice_name,
							company=company,
							posting_date=datetime.datetime.strptime(doc.posting_date, "%Y-%m-%d").date(),
							due_date=datetime.datetime.strptime(doc.due_date, "%Y-%m-%d").date(),
							supplier_address=frappe.db.get_value("Dynamic Link",{"parenttype":"Address","link_doctype":"Supplier","link_name":supplier},"parent"),
							contact_person=contact_person,
							contact_email=frappe.db.get_value('Contact Email', {'parenttype':'Contact','parent':contact_person},'email_id'),
							conversion_rate=1,
							bill_no=doc.name,
							bill_date=datetime.datetime.strptime(doc.posting_date, "%Y-%m-%d").date(),
							tc_name=doc.tc_name,
							payment_terms_template=doc.payment_terms_template,
							taxes_and_charges=tax_template,
							terms=doc.terms,
							total=doc.total,
							grand_total=doc.grand_total,
							base_grand_total=doc.base_grand_total,
							rounded_total=doc.rounded_total,
							base_rounded_total=doc.base_rounded_total,
							purchase_order=doc.po_no,
							attachment_checklist_template=doc.attachment_checklist_template,
							invoice_description=doc.invoice_description
						)).insert(ignore_mandatory=True)
				for val in doc.items:
						pi_doc.append('items', {
							'item_code':val.item_code,
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
				for tax in tax_list:
						pi_doc.append('taxes',{
							'account_head':tax.account_head,
							'charge_type':tax.charge_type,
							'add_deduct_tax':'Add',
                        	'category':'Total',
							'description':tax.description,
							'rate':frappe.db.get_value("Sales Taxes and Charges",{'parent':doc.name,'parenttype':'Sales Invoice'},'rate')
						})
				pi_doc.add_comment('Comment',' System created  '+pi_doc.name)
				pi_doc.save()
				for v in pi_doc.items:
					if doc.po_no:
						po_items=frappe.db.get_list("Purchase Order Item",filters={'parent':doc.po_no,'parenttype':'Purchase Order','item_code':v.item_code},fields={'*'})
						for po in po_items:
							if v.item_code==po.item_code:
								v.po_qty=po.qty
					pi_doc.save()
				for v in pi_doc.items:
					if doc.po_no:
						po_items=frappe.db.get_list("Purchase Order Item",filters={'parent':doc.po_no,'parenttype':'Purchase Order','item_code':v.item_code},fields={'*'})
						for po in po_items:
							if v.item_code==po.item_code:
								v.po_amount=po.amount
					pi_doc.save()
				for v in pi_doc.items:
					if doc.po_no:
						po_items=frappe.db.get_list("Purchase Order Item",filters={'parent':doc.po_no,'parenttype':'Purchase Order','item_code':v.item_code},fields={'*'})
						for po in po_items:
							if v.item_code==po.item_code:
								v.po_rate=po.rate
					pi_doc.save()
				attachment_list=frappe.db.get_list("Attachment Checklist Detail",filters={'parent':doc.name,'parenttype':'Sales Invoice'},fields={'*'})
				for detail in attachment_list:
					    pi_doc.append('attachment_checklist',{
						'description':detail.description,
						'options':detail.options,
						'remarks':detail.remarks
					    })
				pi_doc.save()
				doc.add_comment('Comment','  Purchase Invoice: '+pi_doc.name)
				files=frappe.db.get_list('File',filters={'attached_to_doctype':'Sales Invoice','attached_to_name':doc.name},fields={'*'})
				for single_file in files:
					file_doc=frappe.get_doc(dict(doctype = 'File',
						file_name=single_file.file_name,
						is_private=single_file.is_private,
						file_size=single_file.file_size,
						file_url=single_file.file_url,
						attached_to_doctype="Purchase Invoice",
						attached_to_name=pi_doc.name
					)).insert(ignore_mandatory=True)
					file_doc.save()
				update_monthly_budget(pi_doc.name)
		  
		else:
			frappe.msgprint('Unable to create  Sales Invoice as customer: '+doc.customer_name +' is not associated with any company. Register the Customer for the Company and submit the document: '+doc.name+ '.')
			raise frappe.ValidationError('Unable to create  Sales Invoice as customer: '+doc.customer_name +' is not associated with any company. Register the Customer for the Company and submit the document: '+doc.name+ '.')
	else:
		frappe.throw("Unable to save the Purchase Invoice as the naming series are unavailable . Please provide the naming series at the Company: "+company+" to save the document");

	has_sbtfx_contract=frappe.db.get_value('Company',{'company_name':doc.company},'has_sbtfx_contract')
	if has_sbtfx_contract==1:
		doc_posted=False
		headers=frappe.db.get_list("API Integration",fields={'*'})
		if headers:
			try:
				headers_list = {
					"Authorization": "Bearer " + headers[0].authorization_key,
					"content-type": "application/json"
				}
				conn=FrappeOAuth2Client(headers[0].url,headers[0].authorization_key)
				document='{"documents":[{"buyer_name":"'+ doc.customer_name+'", "buyer_permid": "", "seller_name": "'+doc.company+'", "seller_permid": "", "document_id": "'+doc.name+'", "document_type": "I", "document_date": "'+doc.posting_date+'", "document_due_date":"'+doc.due_date+'", "amount_total": "'+str(doc.grand_total)+'", "currency_name": "SGD", "source": "community_erpnext", "document_category": "AR", "orig_transaction_ref":""}]}'
				print(document)
				res = requests.post(headers[0].url, document, headers=headers_list, verify=True)
				print("RESPONSE",res)
				response_code=str(res)
				res = conn.post_process(res)
				if response_code=="<Response [200]>":
					doc_posted=True
					doc.add_comment('Comment','Sent the '+doc.name+' to '+headers[0].url+' successfully.')
				else:
					doc_posted=False
					message="The post of Sales Invoice Document : "+doc.name+" is unsuccessful."
					doc.add_comment('Comment','Unable to send the '+doc.name+' to '+headers[0].url)
			except Exception:
				print(Exception)
				doc_posted=False
				message="The post of Sales Invoice Document : "+doc.name+" is unsuccessful."
				doc.add_comment('Comment','Unable to send the '+doc.name+' to '+headers[0].url) 
				frappe.log_error(frappe.get_traceback())
		print(doc_posted)

def delete_purchase_invoice(doc,method):
	purchase_invoice=frappe.db.get_value('Purchase Invoice',{'bill_no':doc.name},'name')
	if purchase_invoice:
		pi_doc=frappe.get_doc("Purchase Invoice",purchase_invoice)
		if pi_doc.docstatus!=1:
			pi_doc.delete()
			frappe.db.commit()
		else:
			frappe.throw("Unable to cancel Sales Invoice as Submitted Purchase Invoice "+purchase_invoice+" is linked with this document")	

@frappe.whitelist()
def on_save(name):
	doc=frappe.get_doc("Sales Invoice",name)
	if doc.po_no:
		files=frappe.db.get_list('File',filters={'attached_to_doctype':'Purchase Order','attached_to_name':doc.po_no},fields={'*'})
		si_files=frappe.db.get_list('File',filters={'attached_to_doctype':'Sales Invoice','attached_to_name':doc.name},fields={'*'})
		if files:
			if si_files:
				for single_file in files:
					count=0
					for si_file in si_files:
						if single_file.file_url==si_file.file_url:
							count=1
					if count==0:
						file_doc=frappe.get_doc(dict(doctype = 'File',
							file_name=single_file.file_name,
							is_private=single_file.is_private,
							file_size=single_file.file_size,
							file_url=single_file.file_url,
							attached_to_doctype="Sales Invoice",
							attached_to_name=doc.name
						)).insert(ignore_mandatory=True)
						file_doc.save()
			else:
				for single_file in files:
					file_doc=frappe.get_doc(dict(doctype = 'File',
							file_name=single_file.file_name,
							is_private=single_file.is_private,
							file_size=single_file.file_size,
							file_url=single_file.file_url,
							attached_to_doctype="Sales Invoice",
							attached_to_name=doc.name
						)).insert(ignore_mandatory=True)
					file_doc.save()

