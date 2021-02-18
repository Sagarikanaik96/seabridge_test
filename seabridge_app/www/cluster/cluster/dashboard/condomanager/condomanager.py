from __future__ import unicode_literals
import frappe

sitemap = 1

def get_context(context):
	print("In Context")
	
	q1=frappe.db.sql("""
		select r.role
		from tabUser u,`tabHas Role` r where 
		u.name = r.parent and r.role = 'Estate Manager'
		and u.enabled = 1 and u.name=%s
	""",(frappe.session.user))
	print("user",frappe.session.user)
	print("result----------",q1)
	if(frappe.session.user=="Administrator"):
		context.data="Administrator";
	else:
		for q in q1:
			for i in q:
				print("actyula------------",i)
				context.data=i
	print("CONTEXT-----------",context.data)
