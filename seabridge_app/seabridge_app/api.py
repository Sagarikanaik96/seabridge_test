# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json

@frappe.whitelist()
def get_email(doctype,is_internal_customer,customer_name):
	#email=''
	company=frappe.db.get_value(doctype,{'is_internal_customer':is_internal_customer,'customer_name':customer_name},'represents_company')
	if company:
		return frappe.db.get_value('User Permission',{'for_value':company,'allow':'Company'},'user')


@frappe.whitelist()
def get_company_name(doctype,is_internal_supplier,supplier_name):
    return frappe.db.get_value(doctype,{'is_internal_supplier':is_internal_supplier,'supplier_name':supplier_name},'represents_company')
	

@frappe.whitelist()
def get_supplier_List(item_group,tag):
	item_group_list=json.loads(item_group)
	supplier_list=json.loads(tag)
	group_list=[]
	for group in item_group_list:
		lft,rgt=frappe.db.get_value('Item Group',{'item_group_name':group},['lft','rgt'])
		#rgt=frappe.db.get_value('Item Group',{'item_group_name':item_group},'rgt')
		retrieved_item_group_list=[]
		supplier=[]
		parentList=[]
		retrieved_item_group_list=frappe.db.get_list('Item Group',filters={'lft':['<=',lft],'rgt':['>=',rgt]},fields={'name'})
		if retrieved_item_group_list:
			for val in retrieved_item_group_list:
				group_list.append(val.name)
						
			for group in group_list:
				supplier=frappe.db.get_list('Item Group Detail',filters={'item_group':group},fields={'parent'})
				for row in supplier:
					if row.parent not in supplier_list:
						supplier_list.append(row.parent)     
			
	return supplier_list