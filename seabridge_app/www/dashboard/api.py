# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
from frappe.desk.reportview import build_match_conditions, get_filters_cond
import pandas as pd 
from frappe.core.doctype.communication.email import make

#from flask import Flask, render_template
#app = Flask(__name__)

#@app.route('/')
#def index():
#  return render_template('web_pi_row.html.html')



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

@frappe.whitelist()
def get_purchase_receipt(purchase_order,purchase_invoice):
	pi_list=frappe.db.get_list('Purchase Receipt Item',filters={'parenttype':'Purchase Receipt','purchase_order':purchase_order},fields={'*'})
	if pi_list:
		pi_doc=frappe.get_doc("Purchase Invoice",purchase_invoice) 		
		pi_doc.db_set('purchase_receipt',pi_list[0].parent)


@frappe.whitelist()
def update_status(doc): 
    pi_doc=frappe.get_doc("Purchase Invoice",doc) 
    pi_doc.db_set('workflow_state','Debit Note Initialized')

@frappe.whitelist()
def get_user_email(name):
        user=frappe.db.get_value('Has Role',{'parent':name,'parenttype':'User','role':'Accounts Payable'},'parent')
        return user

@frappe.whitelist()
def set_po(doc,po_no):
    pi_doc=frappe.get_doc("Purchase Invoice",doc) 
    pi_doc.db_set('purchase_order',po_no)
	

@frappe.whitelist()
def get_contact_filter(doctype, txt, searchfield, start, page_len, filters):
	agent_company=filters['company_name']
	user=frappe.db.get_value('Company',{'company_name':agent_company},'associate_agent')
	return frappe.db.sql(""" select name from `tabContact` where user=%s""",(user))

@frappe.whitelist()
def get_contact_phone(doctype,parenttype,parent):	   
	return frappe.db.get_value(doctype, {'parenttype':parenttype,'parent':parent},'phone')


@frappe.whitelist()
def update_pi_status(doc): 
    pi_doc=frappe.get_doc("Purchase Invoice",doc) 
    pi_doc.db_set('workflow_state','Debit Note Initialized')


@frappe.whitelist()
def get_agent_users(represents_company,doc):
	q1=frappe.db.sql("""
		select u.name
		from tabUser u,`tabHas Role` r where 
		u.name = r.parent and r.role = 'Accounts Payable'
		and u.enabled = 1 and u.represents_company=%s
	""",(represents_company))
	
	return q1
	

@frappe.whitelist()
def web_form_call():
	print(frappe.session.user)
	if frappe.session.user=="Administrator":
		q1=frappe.db.sql("""
			select p.name as "name",
			p.supplier as "supplier",p.grand_total,p.due_date,
	 		p.workflow_state,po.grand_total,po.transaction_date,p.docstatus,
			(CASE
			when p.workflow_state="Draft" Then (select c.associate_agent 
			from `tabCompany` c, `tabUser` u,`tabHas Role` r where c.company_name=p.company and  
			c.associate_agent=u.name and u.name=r.parent and u.enabled = 1 and r.role = "Estate Manager") 
			when p.workflow_state="Pending" Then (select group_concat(u.name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent and r.role = 'Accounts Payable'
			and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 			c.company_name=p.company))
			END) as "user",
			(select ba.budget_amount from `tabBudget Account` ba right join `tabBudget` b ON b.name=ba.parent 
			AND b.item_group in(select i.item_group from `tabPurchase Invoice Item` i where
			i.parent=p.name) and ba.account in (select id.expense_account from `tabItem Default` id
			RIGHT JOIN `tabItem` item ON item.name=id.parent
			right JOIN `tabPurchase Invoice Item` i ON i.item_code=item.item_code 
			where p.name=i.parent and id.company=p.company)) as "budget_amount"
			from `tabPurchase Invoice` p left join `tabPurchase Order` po ON p.purchase_order=po.name
			where p.workflow_state not in ("Rejected","Cancelled")""")
	else:
		q2=frappe.db.sql("""select c.company_name from `tabCompany` c where c.associate_agent=%s""",(frappe.session.user))
		company_names=''
		for idx,i in enumerate(q2):
			if(idx!=0):
				company_names+=','
			for j in i:
				company_names+='"'+j+'"'
		q1=frappe.db.sql("""
			select p.name as "name",
			p.supplier as "supplier",p.grand_total,p.due_date,
	 		p.workflow_state,po.grand_total,po.transaction_date,p.docstatus,
			(CASE
			when p.workflow_state="Draft" Then (select c.associate_agent 
			from `tabCompany` c, `tabUser` u,`tabHas Role` r where c.company_name=p.company and  
			c.associate_agent=u.name and u.name=r.parent and u.enabled = 1 and r.role = "Estate Manager") 
			when p.workflow_state="Pending" Then (select group_concat(u.name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent and r.role = 'Accounts Payable'
			and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 			c.company_name=p.company))
			END) as "user",
			(select ba.budget_amount from `tabBudget Account` ba right join `tabBudget` b ON b.name=ba.parent 
			AND b.item_group in(select i.item_group from `tabPurchase Invoice Item` i where
			i.parent=p.name) and ba.account in (select id.expense_account from `tabItem Default` id
			RIGHT JOIN `tabItem` item ON item.name=id.parent
			right JOIN `tabPurchase Invoice Item` i ON i.item_code=item.item_code 
			where p.name=i.parent and id.company=p.company)) as "budget_amount"
			from `tabPurchase Invoice` p left join `tabPurchase Order` po ON p.purchase_order=po.name
			where p.workflow_state not in ("Rejected","Cancelled") and p.company in (%s)"""%company_names)
	
	return q1
	

@frappe.whitelist()
def web_form(doc):
	
	#q1=frappe.db.sql("""
		#update `tabPurchase Invoice` 
		#set workflow_state="Submitted" where 
		#name = "ACC-PINV-2020-00136-1"
	#""")
	print("Status Change----")
	pi_doc=frappe.get_doc("Purchase Invoice",doc) 
	pi_doc.db_set('workflow_state','Pending')
	frappe.db.commit()
	
	
@frappe.whitelist()
def web_call_vendor(vendor):
	print("ABCDVendor--------",vendor)
	q1=frappe.db.sql("""
		select p.name as "name",
		po.grand_total,p.grand_total,po.transaction_date,p.due_date as "due_date:Date",p.due_date
		from `tabPurchase Invoice` p left join `tabPurchase Order` po ON p.purchase_order=po.name 
		where p.supplier=%s and p.workflow_state='Paid'""",(vendor))
	print(q1)
	return q1
	
		

 
