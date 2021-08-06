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
def create_permissions(reports_to,user_id,saved_doc,name):
	if saved_doc==0: 
		if reports_to!="":
			reports_to_user=frappe.db.get_value('Employee',{'name':reports_to},'user_id')
			permissions=frappe.db.get_list("User Permission",filters={'user':user_id},fields={'*'})
			for permission in permissions:
				same_permission=frappe.db.get_list("User Permission",filters={'user':reports_to_user,'allow':permission.allow,'for_value':permission.for_value},fields={'*'})
				if not same_permission:
					up_doc=frappe.get_doc(dict(doctype = 'User Permission',
						user=reports_to_user,
						allow=permission.allow,
						for_value=permission.for_value,
						apply_to_all_doctypes=1
					)).insert(ignore_mandatory=True)
					up_doc.save()
	else:
		if reports_to!="":	
			reports_to_before=frappe.db.get_value('Employee',{'name':name},'reports_to')
			if reports_to_before:
				if reports_to_before!=reports_to:
					reports_to_user=frappe.db.get_value('Employee',{'name':reports_to_before},'user_id')
					permissions=frappe.db.get_list("User Permission",filters={'user':user_id},fields={'*'})
					for permission in permissions:
						same_permission=frappe.db.get_list("User Permission",filters={'user':reports_to_user,'allow':permission.allow,'for_value':permission.for_value},fields={'*'})
						if same_permission:
							perm_doc=frappe.get_doc("User Permission",same_permission[0].name)
							perm_doc.delete()
							frappe.db.commit()
			reports_to_user=frappe.db.get_value('Employee',{'name':reports_to},'user_id')
			permissions=frappe.db.get_list("User Permission",filters={'user':user_id},fields={'*'})
			for permission in permissions:
				same_permission=frappe.db.get_list("User Permission",filters={'user':reports_to_user,'allow':permission.allow,'for_value':permission.for_value},fields={'*'})
				if not same_permission:
					up_doc=frappe.get_doc(dict(doctype = 'User Permission',
						user=reports_to_user,
						allow=permission.allow,
						for_value=permission.for_value,
						apply_to_all_doctypes=1
					)).insert(ignore_mandatory=True)
					up_doc.save()			
		else:
			reports_to_before=frappe.db.get_value('Employee',{'name':name},'reports_to')
			if reports_to_before:
				reports_to_user=frappe.db.get_value('Employee',{'name':reports_to_before},'user_id')
				permissions=frappe.db.get_list("User Permission",filters={'user':user_id},fields={'*'})
				for permission in permissions:
					same_permission=frappe.db.get_list("User Permission",filters={'user':reports_to_user,'allow':permission.allow,'for_value':permission.for_value},fields={'*'})
					if same_permission:
						perm_doc=frappe.get_doc("User Permission",same_permission[0].name)
						perm_doc.delete()
						frappe.db.commit()

@frappe.whitelist()
def get_reports_to_filter(user,company):
    employee_list=[]
    estate_user=frappe.db.sql("""select u.name 
            from `tabUser` u,`tabHas Role` r where u.name=%s and
            u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",(user), as_list=True)
    if estate_user:
        user_list=frappe.db.sql("""select u.name 
            from tabUser u,`tabHas Role` r where 
            u.name = r.parent and r.role = 'Accounts Payable'
            and u.enabled = 1 and u.represents_company =%s""",(company),as_dict=True)
        for row in user_list:
            employee=frappe.db.get_value('Employee',{'user_id':row['name']},'name')
            if employee:
                employee_list.append(employee)
    else:
        account_payable=frappe.db.sql("""select u.name 
            from `tabUser` u,`tabHas Role` r where u.name=%s and
            u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",(user), as_list=True)
        if account_payable:
                user_list=frappe.db.sql("""select u.name
                    from tabUser u,`tabHas Role` r where 
                    u.name = r.parent and r.role = 'Finance Manager'
                    and u.enabled = 1 and u.represents_company =%s""",(company),as_dict=True)
                for row in user_list:
                    employee=frappe.db.get_value('Employee',{'user_id':row['name']},'name')
                    if employee:
                        employee_list.append(employee)
    return employee_list
