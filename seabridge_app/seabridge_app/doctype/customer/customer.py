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
def create_permissions(name,represents_company):
	if not represents_company:
        	validate_user_permission(name)
        	delete_role()
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
    represents_company=frappe.db.get_value('User',{'name':frappe.session.user},'represents_company')
    user_list=frappe.db.get_all('User',filters={'represents_company':represents_company},fields=['name'])
    for user in user_list:
        if not frappe.db.exists('User Permission', {'for_value': name, 'user': user['name'], 'allow': 'Customer'}):
            up_doc = frappe.get_doc(dict(doctype='User Permission',
                                        user=user['name'],
                                        allow="Customer",
                                        for_value=name,
                                        apply_to_all_doctypes=1
                                        )).insert(ignore_mandatory=True, ignore_permissions=True)
            up_doc.save(ignore_permissions=True)

@frappe.whitelist()
def create_role(user):
    if not frappe.db.exists('Has Role', {'parent': user, 'parentfield':'roles','role': 'System Manager','parenttype':'User'}):
        up_doc = frappe.get_doc(dict(doctype='Has Role',
                                     parent=user,
                                     role='System Manager',
                                     parenttype='User',
                                     parentfield='roles'
                                     )).insert(ignore_permissions=True)
        up_doc.save(ignore_permissions=True)

@frappe.whitelist()
def delete_role():
    docVal= frappe.db.get_list('Has Role', filters={'parent': frappe.session.user, 'parentfield':'roles','role': 'System Manager','parenttype':'User'})
    if docVal:
        frappe.get_doc(dict(doctype='Has Role',
                                     parent=frappe.session.user,
                                     role='System Manager',
                                     parenttype='User',
                                     parentfield='roles',
                                     name=docVal[0].name
                                     )).delete(ignore_permissions=True)
