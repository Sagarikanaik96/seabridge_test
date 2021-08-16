# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import date
from itertools import groupby
import json
from frappe.core.doctype.communication.email import make

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

@frappe.whitelist()
def update_rejected_invoice(invoices,company):
	invoices_list=json.loads(invoices)
	for doc in invoices_list:
		bpa_doc=frappe.get_doc("Bank Payment Advice",doc['parent'])
		bpa_doc.append('rejected_invoice_details', {
								'invoice_document':doc['invoice_document'],
								'overdue_days':doc['overdue_days'],
								'debit_note':doc['debit_note'],
								'debit_note_amount':doc['debit_note_amount'],
								'supplier_name':doc['supplier_name'],
								'invoice_amount':doc['invoice_amount'],
								'due_date':doc['due_date'],
								'outstanding_amount':doc['outstanding_amount'],
								'payment_transaction_amount':doc['outstanding_amount'],
								'cheque_no':doc['cheque_no'],
								'cheque_date':doc['cheque_date'],
								'purchase_order':doc['purchase_order'],
								'purchase_order_amount':doc['purchase_order_amount'],
								'has_sbtfx_contract':doc['has_sbtfx_contract'],
								'bank_account':doc['bank_account'],
								'bank_name':doc['bank_name'],
								'is_funded':doc['is_funded']
							})
		bpa_doc.save()
		estate_manager=frappe.db.get_value("Company",{'name':company},'associate_agent')  
		make(subject = "Invoice ", content='Invoice "'+doc['invoice_document']+'" is rejected from Bank Payment Advice "'+doc['parent']+'".', recipients=estate_manager,send_email=True)

		pi_doc=frappe.get_doc("Purchase Invoice",doc['invoice_document'])
		pi_doc.db_set('is_bpa_exists',0)  

@frappe.whitelist()
def update_current_approves(doc,current_approves,approvers=None):
	approvers_list=[]
	bpa_doc=frappe.get_doc("Bank Payment Advice",doc)
	approves=int(current_approves)+1
	bpa_doc.db_set("current_approves",approves)
	if approvers is not None:
		approvers_list.append(approvers)
	if frappe.session.user not in approvers_list:
		approvers_list.append(frappe.session.user)
	approvers_name = ','.join(approvers_list)
	bpa_doc.db_set("approvers",approvers_name)
	frappe.db.commit()
