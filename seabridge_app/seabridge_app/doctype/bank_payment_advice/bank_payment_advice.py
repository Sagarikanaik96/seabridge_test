# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import date

class BankPaymentAdvice(Document):
	pass

def auto_create_payment_entry(doc,method): 
	bpad=frappe.db.get_list("Bank Payment Advice Details",filters={'parent':doc.name,'parenttype':'Bank Payment Advice'},fields={'*'})
	for row in bpad:
		pe_doc=frappe.get_doc(dict(doctype = 'Payment Entry',
		payment_type="Pay",
		posting_date=doc.date,
		company=doc.company,
		mode_of_payment="Wire Transfer",
		paid_to=frappe.db.get_value('Purchase Invoice',{'name':row.invoice_document},'credit_to'),
		paid_from=frappe.db.get_value('Bank Account',{'name':doc.bank_account},'account'),
		party_type="Supplier",
		party=row.supplier_name,
		paid_amount=row.payment_transaction_amount,
		received_amount=55.5,
		reference_no=doc.name,
		reference_date=date.today()
		)).insert(ignore_mandatory=True)
		
		pe_doc.append('references', {
			'reference_doctype':"Purchase Invoice",
			'reference_name':row.invoice_document,
			'due_date':row.due_date,
			'total_amount':row.invoice_amount,
			'outstanding_amount':row.outstanding_amount-row.payment_transaction_amount,
			'allocated_amount':row.payment_transaction_amount	
						    
						})
		pe_doc.submit()
