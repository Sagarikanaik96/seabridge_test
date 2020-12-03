# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import date
from itertools import groupby

class BankPaymentAdvice(Document):
	pass

def validate_bank_details(doc,method):
        account="null"
        name="null"
        for val in doc.bank_payment_advice_details:
            if val.bank_account:
                account=val.bank_account
            if val.bank_name:
                name=val.bank_name
            if account=="null" or name=="null":
                has_sbtfx_contract=frappe.db.get_value('Supplier',{'supplier_name':val.supplier_name},'has_sbtfx_contract')
                if has_sbtfx_contract!=1:
                    frappe.throw("Unable to submit the document. Please maintain the Bank Account Details at Supplier: "+val.supplier_name)
                else:
                    represents_company=frappe.db.get_value('Supplier',{'supplier_name':val.supplier_name},'represents_company')
                    parent_company=frappe.db.get_value('Company',{'company_name':represents_company},'parent_company')
                    frappe.throw("Unable to submit the document. Please maintain the Bank Account Details at Parent Company: "+parent_company)


def auto_create_payment_entry(doc,method): 
	bpad=frappe.db.get_list("Bank Payment Advice Details",filters={'parent':doc.name,'parenttype':'Bank Payment Advice'},fields={'*'})
	sorted_users = sorted(bpad, key=lambda x: (x['supplier_name']))
	grouped_by_supplier = {}

	for key, group in groupby(sorted_users, key=lambda x: (x['supplier_name'])):
		grouped_by_supplier[key]= list(group)

	for key,val in grouped_by_supplier.items():	
		pe_doc=frappe.get_doc(dict(doctype = 'Payment Entry',
		payment_type="Pay",
		posting_date=doc.date,
		company=doc.company,
		mode_of_payment="Wire Transfer",
		paid_from=frappe.db.get_value('Bank Account',{'name':doc.bank_account},'account'),
		party_type="Supplier",
		paid_amount="0",
		received_amount="0",
		party=key,
		reference_no=doc.name,
		reference_date=date.today()
		)).insert(ignore_mandatory=True)
		
		amount=0
		for row in val:
					amount=amount+row.payment_transaction_amount
					pe_doc.update({
						"paid_to":frappe.db.get_value('Purchase Invoice',{'name':row.invoice_document},'credit_to'),
						"paid_amount":amount,
						"received_amount":amount,
					})

					pe_doc.append('references', {
						'reference_doctype':"Purchase Invoice",
						'reference_name':row.invoice_document,
						'due_date':row.due_date,
						'total_amount':row.invoice_amount,
						'outstanding_amount':row.outstanding_amount-row.payment_transaction_amount,
						'allocated_amount':row.payment_transaction_amount	
										
					})
		pe_doc.submit()

@frappe.whitelist()
def sort_details(doc):
	bpad=frappe.db.get_list("Bank Payment Advice Details",filters={'parent':doc,'parenttype':'Bank Payment Advice'},fields={'*'})
	sorted_users = sorted(bpad, key=lambda x: (x['overdue_days']))
	return sorted_users
