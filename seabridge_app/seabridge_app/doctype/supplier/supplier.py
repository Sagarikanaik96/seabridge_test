# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import os

class Employee(Document):
	pass

@frappe.whitelist()
def create_permissions(name):
	supp_doc=frappe.get_doc("Supplier",name) 
	users=frappe.db.get_list("User",filters={'represents_company':supp_doc.represents_company},fields={'*'})
	companies=frappe.db.get_list("Allowed To Transact With",filters={'parent':supp_doc.name,'parenttype':'Supplier'},fields={'*'})
	if users:
		if companies:
			for user in users:
				for company in companies:
					customers=frappe.db.get_all("Customer",filters={'represents_company':company.company},fields={'*'})
					for customer in customers:
						permission=frappe.db.get_list('User Permission',filters={'user':user.name,'for_value':customer.name},fields={'*'})
						if not permission:
							up_doc=frappe.get_doc(dict(doctype = 'User Permission',
								user=user.name,
								allow="Customer",
								for_value=customer.name,
								apply_to_all_doctypes=1
							)).insert(ignore_mandatory=True)
							up_doc.save()
