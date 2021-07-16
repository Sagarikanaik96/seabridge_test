# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import os

class Customer(Document):
	pass

@frappe.whitelist()
def create_permissions(name):
	#validate_user_permission(name)
	cust_doc=frappe.get_doc("Customer",name) 
	users=frappe.db.get_list("User",filters={'represents_company':cust_doc.represents_company},fields={'*'})
	companies=frappe.db.get_list("Allowed To Transact With",filters={'parent':cust_doc.name,'parenttype':'Customer'},fields={'*'})
	if users:
		if companies:
			for user in users:
				for company in companies:
					suppliers=frappe.db.get_all("Supplier",filters={'represents_company':company.company},fields={'*'})
					for supplier in suppliers:
						permission=frappe.db.get_all('User Permission',filters={'user':user.name,'allow':"Supplier",'for_value':supplier.name},fields={'*'})
						if not permission:
							up_doc=frappe.get_doc(dict(doctype = 'User Permission',
								user=user.name,
								allow="Supplier",
								for_value=supplier.name,
								apply_to_all_doctypes=1
							)).insert(ignore_mandatory=True,ignore_permissions=True)
							up_doc.save()

						permission=frappe.db.get_all('User Permission',filters={'user':user.name,'allow':"Customer",'for_value':cust_doc.customer_name},fields={'*'})
						if not permission:
							up_doc=frappe.get_doc(dict(doctype = 'User Permission',
								user=user.name,
								allow="Customer",
								for_value=cust_doc.customer_name,
								apply_to_all_doctypes=1
							)).insert(ignore_mandatory=True,ignore_permissions=True)
							up_doc.save()
	agent_user=frappe.db.get_value('Company',{'company_name':cust_doc.represents_company},'associate_agent')
	if agent_user:
		for company in companies:
			suppliers=frappe.db.get_all("Supplier",filters={'represents_company':company.company},fields={'*'})
			for supplier in suppliers:
						permission=frappe.db.get_all('User Permission',filters={'user':agent_user,'allow':"Supplier",'for_value':supplier.name},fields={'*'})
						if not permission:
							up_doc=frappe.get_doc(dict(doctype = 'User Permission',
								user=agent_user,
								allow="Supplier",
								for_value=supplier.name,
								apply_to_all_doctypes=1
							)).insert(ignore_mandatory=True,ignore_permissions=True)
							up_doc.save()
		permission=frappe.db.get_all('User Permission',filters={'user':agent_user,'allow':"Customer",'for_value':cust_doc.customer_name},fields={'*'})
		if not permission:
			up_doc=frappe.get_doc(dict(doctype = 'User Permission',
				user=agent_user,
				allow="Customer",
				for_value=cust_doc.customer_name,
				apply_to_all_doctypes=1
			)).insert(ignore_mandatory=True,ignore_permissions=True)
			up_doc.save()
		

def validate_user_permission(name):
    if not frappe.db.exists('User Permission', {'for_value': name, 'user': frappe.session.user, 'allow': 'Customer'}):
        up_doc = frappe.get_doc(dict(doctype='User Permission',
                                     user=frappe.session.user,
                                     allow="Customer",
                                     for_value=name,
                                     apply_to_all_doctypes=1
                                     )).insert(ignore_mandatory=True, ignore_permissions=True)
        up_doc.save()
