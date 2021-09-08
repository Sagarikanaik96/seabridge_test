# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeOAuth2Client,OAuth2Session
from frappe.model.document import Document
import json
import requests
from seabridge_app.seabridge_app.api import create_api_interacion_tracker
from datetime import datetime
from frappe.core.doctype.communication.email import make

class PurchaseInvoice(Document):
	pass


@frappe.whitelist()
def before_submit(doc,method):
	if doc.purchase_receipt:
		for val in doc.items:
			pr_items=frappe.db.get_list("Purchase Receipt Item",filters={'parent':doc.purchase_receipt,'parenttype':'Purchase Receipt'},fields={'*'})
			for pr in pr_items:
				if val.item_code==pr.item_code:
					if val.qty!=pr.qty:
						frappe.throw(' Unable to submit the Purchase Invoice as the quantity is not equal to the received quantity. Please keep the quantity same as '+doc.purchase_receipt)

	if doc.service_completion_note:
		for val in doc.items:
			scn_items=frappe.db.get_list("Purchase Receipt Item",filters={'parent':doc.service_completion_note,'parenttype':'Service Completion Note'},fields={'*'})
			for scn in scn_items:
				if val.item_code==scn.item_code:
					if val.qty!=scn.qty:
						frappe.throw(' Unable to submit the Purchase Invoice as the quantity is not equal to the received quantity. Please keep the quantity same as '+doc.service_completion_note)

	if doc.purchase_order:
		for val in doc.items:
			po_items=frappe.db.get_list("Purchase Order Item",filters={'parent':doc.purchase_order,'parenttype':'Purchase Order'},fields={'*'})
			for po in po_items:
				if val.item_code==po.item_code:
					if val.amount>po.amount:
						diff=val.amount-po.amount
						min_per=100*diff/po.amount
						item_doc=frappe.get_doc("Item",val.item_code)
						item_doc.db_set('over_billing_allowance',val.over_billing_allowance) 
						check=val.amount-po.amount*val.over_billing_allowance/100-po.amount;
						if val.over_billing_allowance<min_per:
							frappe.throw('This document is over limit by <b>Amount '+str(check)+'</b> for item <b>'+val.item_code+'</b>. Are you making another <b>Purchase Invoice</b> against the same <b>Purchase Order Item</b>? <br><br> To allow over billing, update "Over Billing Allowance" at Purchase Invoice Item details')
	
@frappe.whitelist()
def update_status(doc,method):
    if doc.is_return==1:
        pi_doc=frappe.get_doc("Purchase Invoice",doc.return_against) 
        pi_doc.db_set('workflow_state','Rejected')

@frappe.whitelist()
def post_invoice(name):
        doc=frappe.get_doc("Purchase Invoice",name)
        doc.db_set("send_for_approval",True)
        doc_posted=False
        headers=frappe.db.get_all("API Integration",fields={'*'})
        has_sbtfx_contract=frappe.db.get_value('Supplier',{'supplier_name':doc.supplier_name},'has_sbtfx_contract')
        if has_sbtfx_contract==1:
            if headers:
                date_time=datetime.now()
                try:
                     headers_list = {
                         "Authorization": "Bearer " + headers[0].authorization_key,
                         "content-type": "application/json"
                     }
                     print("URL",headers[0].url)
                     print("Auth Key",headers[0].authorization_key)
                     conn=FrappeOAuth2Client(headers[0].url,headers[0].authorization_key)
                     credit_days=frappe.db.sql("""select sum(credit_days) as credit_days from `tabPayment Terms Template Detail` where parent=%s""",(doc.payment_terms_template), as_list=True)
                     if credit_days[0][0]==None:
                         credit_days[0][0]=0
                     document='{"documents":[{"buyer_name":"'+ doc.company+'", "buyer_permid": "", "seller_name": "'+doc.supplier_name+'", "seller_permid": "", "document_id": "'+doc.name+'", "document_type": "I", "document_date": "'+str(doc.posting_date)+'", "document_due_date":"'+str(doc.due_date)+'", "amount_total": "'+str(doc.outstanding_amount)+'", "currency_name": "SGD", "source": "seaprop","credit_days": '+str(credit_days[0][0])+', "document_category": "AP", "orig_transaction_ref":"'+doc.bill_no+'"}]}'
                     print(document)
                     res = requests.post(headers[0].url, document, headers=headers_list, verify=False)
                     print("RESPONSE",res)
                     response_code=str(res)
                     responsedata=res.json()
                     message=responsedata['Data'][0]['Message']
                     res = conn.post_process(res)
                     
                     if response_code=="<Response [200]>":
                         doc_posted=True
                         doc.add_comment('Comment','Sent the '+doc.name+'to SBTFX successfully.')
                         create_api_interacion_tracker(headers[0].url,doc.name,doc.company,date_time,'Success',message)
                     else:
                         doc_posted=False
                         doc.add_comment('Comment','Unable to send the '+doc.name+' to SBTFX.')
                         create_api_interacion_tracker(headers[0].url,doc.name,doc.company,date_time,'Failure',message)
                         make(subject = 'Transaction Unsuccessful',recipients =headers[0].email,communication_medium = "Email",content = message,send_email = True)
                except Exception:
                     print(Exception)
                     doc_posted=False
                     doc.add_comment('Comment','Unable to send the '+doc.name+' to SBTFX.') 
                     msg=frappe.log_error(frappe.get_traceback())
                     create_api_interacion_tracker(headers[0].url,doc.name,doc.company,date_time,'Failure',msg.error)
                     make(subject = 'Transaction Unsuccessful',recipients = headers[0].email,communication_medium = "Email",content = msg.error,send_email = True)
                    
        return doc_posted
       
@frappe.whitelist()
def get_approver(company,workflow_state):
    agent_user = frappe.db.get_value(
        'Company', {'name': company}, 'associate_agent')
    if agent_user:
        reports_to = frappe.db.get_value(
            'Employee', {'user_id': agent_user}, 'reports_to')
        if reports_to:
            name = frappe.db.get_value(
                'Employee', {'name': reports_to}, 'user_id')
            if name:
                #if workflow_state=="Pending":
                return frappe.db.sql("""select u.name from tabUser u,`tabHas Role` r where 
            u.name = r.parent and u.name=%s and r.role = 'Accounts Payable'
                and u.enabled = 1 """, (name), as_dict=True)


