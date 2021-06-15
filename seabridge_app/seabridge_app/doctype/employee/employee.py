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
