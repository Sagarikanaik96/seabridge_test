# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe

sitemap = 1

def get_context(context):
	print("In Context")
	context.data=frappe.db.get_list('Purchase Invoice',fields=['name','supplier_name','workflow_state','outstanding_amount','due_date'],filters=[['workflow_state', 'not in', ['Cancelled']]])
	q1=frappe.db.sql("""
		update `tabPurchase Invoice` 
		set workflow_state="Submitted" where 
		name = "ACC-PINV-2020-00136-1"
	""")
	#return context



def web_form(doc):
	print("Status----")
