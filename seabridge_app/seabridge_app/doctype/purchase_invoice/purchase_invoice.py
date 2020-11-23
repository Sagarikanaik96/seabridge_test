# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

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
    frappe.msgprint("After Submit")
    if doc.is_return==1:
        frappe.msgprint("Status"+doc.status)
        pi_doc=frappe.get_doc("Purchase Invoice",doc.return_against) 
        #invoices=frappe.db.get_list("Purchase Invoice",filters={'is_return':1,'return_against':doc.},fields={'*'})
        #if invoices:
        frappe.msgprint("Present"+pi_doc.name)
        pi_doc.db_set('status','Debit Note Issued')
        

