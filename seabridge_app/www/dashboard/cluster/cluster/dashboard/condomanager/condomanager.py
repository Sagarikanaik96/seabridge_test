from __future__ import unicode_literals
import frappe

sitemap = 1

def get_context(context):
	print("In Context")
	context.data=frappe.db.get_list('Purchase Invoice',fields=['name','supplier_name','workflow_state','outstanding_amount','due_date'],filters=[['workflow_state', 'not in', ['Cancelled']]])
	#context.data="Buying"
	print("In Context------------",context.data)
