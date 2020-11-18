# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
from frappe.desk.reportview import build_match_conditions, get_filters_cond
import pandas as pd 

@frappe.whitelist()
def get_email(doctype,is_internal_customer,customer_name):
	company=frappe.db.get_value(doctype,{'is_internal_customer':is_internal_customer,'customer_name':customer_name},'represents_company')
	if company:
		return frappe.db.get_value('Company',{'company_name':company},'associate_agent')

def get_selections(selections):
	print("Selections",selections)
     
@frappe.whitelist()
def get_contact_mail(doctype,parenttype,parent):	   
	return frappe.db.get_value(doctype, {'parenttype':parenttype,'parent':parent},'email_id')

@frappe.whitelist()
def get_agent_name(doctype,is_internal_customer,customer_name):
	company=frappe.db.get_value(doctype,{'is_internal_customer':is_internal_customer,'customer_name':customer_name},'represents_company')
	if company:
		email= frappe.db.get_value('Company',{'company_name':company},'associate_agent')
		if email:
			return frappe.db.get_value('User',{'email':email},'full_name')

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

@frappe.whitelist()
def add_comment(doctype,name,owner):
	sq_doc=frappe.get_doc(doctype,name)
	sq_doc.add_comment('Comment',owner+' opened the Supplier Quotation:' +name)

@frappe.whitelist()
def get_user(doctype,parenttype,role,parent):
	return frappe.db.get_value(doctype,{'parenttype':parenttype,'parent':parent,'role':role},'parent')

@frappe.whitelist()
def validate_user_permission(doctype,user,allow,value):
	docVal=frappe.db.get_list(doctype, filters={'user':user,'for_value':value,'allow':allow})
	if docVal:
		frappe.get_doc(dict(
            doctype = doctype,
            user = user,
            for_value = value,
            allow=allow,
            name=docVal[0].name,
            apply_to_all_doctypes=1
            )).delete()

@frappe.whitelist()
def get_user_name(doctype, txt, searchfield, start, page_len, filters):
        return frappe.db.sql("""
                select u.name, concat(u.first_name, ' ', u.last_name)
                from tabUser u, `tabHas Role` r
                where u.name = r.parent and r.role = 'Agent'
                and u.enabled = 1 and u.name like %s
        """, ("%" + txt + "%"))


@frappe.whitelist()
def get_user_filter(doctype, txt, searchfield, start, page_len, filters):
        agent_company=filters['represents_company']
        return frappe.db.sql("""
                select u.name, concat(u.first_name, ' ', u.last_name)
                from tabUser u, `tabHas Role` r
                where u.name = r.parent and r.role = 'Agent'
                and u.enabled = 1 and  u.represents_company=%s
        """,(agent_company))
        
@frappe.whitelist()
def get_opportunity_name(reference_no):
	return frappe.db.get_value('Opportunity',{'reference_no':reference_no},'name')

