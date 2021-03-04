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
from erpnext.accounts.doctype.purchase_invoice.purchase_invoice import PurchaseInvoice
from erpnext.regional.india.utils import update_grand_total_for_rcm
from frappe.model.db_query import DatabaseQuery

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
		q2=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
		q3=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
		count=0
		print('q2q3',q2,q3)
		for i in q2:
			for q in i:
				if(q==frappe.session.user):
					count+=1
		for i in q3:
			for q in i:
				if(q==frappe.session.user):
					count+=2
		print("Count-------------",count)
		q1=frappe.db.sql("""select p.name as "name",
			p.supplier as "supplier",p.grand_total,DATE_FORMAT(p.due_date,'dd/mm/YY'),
	 		p.workflow_state,po.grand_total,po.transaction_date,p.docstatus,
			(CASE
			when p.workflow_state="Draft" Then (select c.associate_agent 
			from `tabCompany` c, `tabUser` u,`tabHas Role` r where c.company_name=p.company and  
			c.associate_agent=u.name and u.name=r.parent and u.enabled = 1 and r.role = "Estate Manager") 
			when p.workflow_state="Pending" Then (select group_concat(u.name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent and r.role = 'Accounts Payable'
			and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 				c.company_name=p.company))
			END) as "user",
			"1234" as "budget"
			from 
			`tabPurchase Order` po right join
			`tabPurchase Invoice` p
			ON p.purchase_order=po.name
			
			and p.purchase_order=po.name
			where p.workflow_state not in ("Cancelled") and p.is_return=0""")
	else:
		q2=frappe.db.sql("""select c.company_name from `tabCompany` c,`tabUser` u  where u.name=%s and u.represents_company=c.associate_agent_company""",(frappe.session.user))
		company_names=''	
		for idx,i in enumerate(q2):
			if(idx!=0):
				company_names+=','
			for j in i:
				company_names+='"'+j+'"'
		q1=frappe.db.sql("""select p.name as "name",
			p.supplier as "supplier",p.grand_total,DATE_FORMAT(p.due_date,'%%d-%%m-%%Y'),
	 		p.workflow_state,po.grand_total,DATE_FORMAT(po.transaction_date,'%%d-%%m-%%Y'),p.docstatus,
			(CASE
			when p.workflow_state="Draft" Then (select c.associate_agent 
			from `tabCompany` c, `tabUser` u,`tabHas Role` r where c.company_name=p.company and  
			c.associate_agent=u.name and u.name=r.parent and u.enabled = 1 and r.role = "Estate Manager") 
			when p.workflow_state="Pending" Then (select group_concat(u.name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent and r.role = 'Accounts Payable'
			and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 				c.company_name=p.company))
			END) as "user",
			T1.budget_amount as "budget"
			from 
			`tabPurchase Order` po right join
			`tabPurchase Invoice` p
			ON p.purchase_order=po.name
			LEFT JOIN(
                        select sum(ba.budget_amount) as budget_amount,
                        p.name as purchase_invoice from
                        `tabBudget Account` ba inner join
                        `tabBudget` b 
                        ON ba.parent=b.name right join 
                        `tabPurchase Invoice Item` i
                        ON b.item_group=i.item_group right join
                        `tabPurchase Invoice` p
                        ON i.parent=p.name
                        where i.expense_account=ba.account and b.fiscal_year=YEAR(CURDATE())
                        AND b.docstatus=1 group by p.name
                        )T1
                        ON T1.purchase_invoice=p.name
			and p.purchase_order=po.name
			where p.workflow_state not in ("Cancelled") and p.is_return=0 and p.company in (%s)"""%company_names)
		q3=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
		q4=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
		count=0
		print('q2q3',q2,q3)
		for i in q3:
			for q in i:
				if(q==frappe.session.user):
					count+=1
		for i in q4:
			for q in i:
				if(q==frappe.session.user):
					count+=2
		print("Count-------------",count)
	
	return q1,count


@frappe.whitelist()
def web_form_try(doc):
	pi_doc=frappe.get_doc("Purchase Invoice",doc) 
	#pi_doc.submit()
	print("PI Doc-------------",pi_doc.name)	

@frappe.whitelist()
def web_form(doc):
	pi_doc=frappe.get_doc("Purchase Invoice",doc)
	pi_doc.submit()
	pi_doc.db_set('workflow_state','Pending')
	frappe.db.commit()
	agent_comp=frappe.db.get_value('Company',{'company_name':pi_doc.company},'associate_agent_company')
	users=get_agent_users(agent_comp,doc)
	print(users)
	for u in users:
		for user in u:
			template='<h2><span style="color: rgb(102, 185, 102);">Task Details</span></h2><table class="table table-bordered"><tbody><tr><td data-row="insert-column-right"><strong>Document Id</strong></td><td data-row="insert-column-right"><strong style="color: rgb(107, 36, 178);">'+doc+'</strong></td></tr><tr><td data-row="row-z48v"><strong>Approver</strong></td><td data-row="row-z48v"><strong style="color: rgb(107, 36, 178);">'+user+'</strong></td></tr><tr><td data-row="row-zajk"><strong>View Document in ERPNext</strong></td><td data-row="row-mze0"><strong style="color: rgb(230, 0, 0);"><a href="desk#Form/Purchase Invoice/'+doc+'" target="_blank" class="btn btn-success">Click to view document</a></strong></td></tr><tr><td data-row="row-779i"><strong>Note</strong></td><td data-row="row-779i"><strong style="color: rgb(255, 153, 0);">This is a system generated email, please do not reply to this message.</strong></td></tr></tbody></table>'	
			print(user)
			make(subject = "Pending For Approval", content=template, recipients=user,send_email=True)
	
	
@frappe.whitelist()
def web_call_vendor(vendor):
	q1=frappe.db.sql("""
		select p.name as "name",
		po.grand_total,p.grand_total,DATE_FORMAT(po.transaction_date,'%%d-%%m-%%Y'),DATE_FORMAT(p.due_date,'%%d-%%m-%%Y') as "due_date:Date",DATE_FORMAT(p.due_date,'%%d-%%m-%%Y')
		from `tabPurchase Invoice` p left join `tabPurchase Order` po ON p.purchase_order=po.name 
		where p.supplier=%s and p.workflow_state='Paid'""",(vendor))
	print(q1)
	return q1
	
		
@frappe.whitelist()
def get_user_role():
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
		return "Administrator";
	else:
		for q in q1:
			for i in q:
				print("actyula------------",i)
				return i


@frappe.whitelist()
def get_user_estate_role(name):
        user=frappe.db.get_value('Has Role',{'parent':name,'parenttype':'User','role':'Estate Manager'},'parent')
        return user

@frappe.whitelist()
def get_user_estate_roles():
        user=frappe.db.get_value('Has Role',{'parent':frappe.session.user,'parenttype':'User','role':'Estate Manager'},'parent')
        return user
 
@frappe.whitelist()
def approve_invoice(doc):
	pi_doc=frappe.get_doc("Purchase Invoice",doc) 
	pi_doc.db_set('workflow_state','To Pay')
	pi_doc.db_set('status','Unpaid')
	frappe.db.commit()

@frappe.whitelist()
def reject_invoice(doc):
	pi_doc=frappe.get_doc("Purchase Invoice",doc) 
	pi_doc.db_set('workflow_state','Rejected')
	frappe.db.commit()



@frappe.whitelist()
def get_user_accounts_payable():
	user=frappe.db.get_value('Has Role',{'parent':frappe.session.user,'parenttype':'User','role':'Accounts Payable'},'parent')
	return user


@frappe.whitelist()
def get_data(name=None, supplier=None, match=None,status=None,
	start=0, sort_by='name', sort_order='desc'):
	'''Return data to render the item dashboard'''
	filters = []
	conditions=""
	if name:
		conditions+=str('And p.name="'+name+'"')
	if supplier:
		conditions+=str('And p.supplier="'+supplier+'"')
	if match:
		if match=='Y':
			conditions+=str('And p.workflow_state not in ("Draft","Cancelled")')
		if match=='N':
			conditions+=str('And p.workflow_state="Draft"')
	if status:
		conditions+=str('And p.workflow_state="'+status+'"')
	q3=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
	q4=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
	count=0
	for i in q3:
			for q in i:
				if(q==frappe.session.user):
					count+=1
	for i in q4:
			for q in i:
				if(q==frappe.session.user):
					count+=2
	
	q2=frappe.db.sql("""select c.company_name from `tabCompany` c,`tabUser` u  where u.name=%s and u.represents_company=c.associate_agent_company and c.associate_agent=%s""",(frappe.session.user,frappe.session.user))
	company_names=''
	for i in q2:
			for q in i:
				if(q):
					company_names=' and p.company in ('	
					for idx,i in enumerate(q2):
							if(idx!=0):
								company_names+=','
							for j in i:
								company_names+='"'+j+'"'
					company_names+=')'
	
	sort=''
	if sort_by:
		if(sort_by=="name"):
			sort+=" Order by p.name "+sort_order
		elif(sort_by=="invoice_date"):
			sort+=" Order by p.due_date "+sort_order
		elif(sort_by=="po_date"):
			sort+=" Order by po.transaction_date "+sort_order
	
	limit=' Limit 20 offset '+start
	items=frappe.db.sql("""select p.name as "name",
			p.supplier as "supplier",FORMAT(p.grand_total,2),DATE_FORMAT(p.due_date,"%d-%m-%Y"),
	 		p.workflow_state,FORMAT(po.grand_total,2),DATE_FORMAT(po.transaction_date,"%d-%m-%Y"),p.docstatus,
			(CASE
			when p.workflow_state="Draft" Then (select u.full_name 
			from `tabCompany` c, `tabUser` u,`tabHas Role` r where c.company_name=p.company and  
			c.associate_agent=u.name and u.name=r.parent and u.enabled = 1 and r.role = "Estate Manager") 
			when p.workflow_state="Pending" Then (select group_concat(u.full_name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent and r.role = 'Accounts Payable'
			and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 				c.company_name=p.company))
			END) as "user",
			T1.budget_amount as "budget","""+str(count)+""" as "role"
			from 
			`tabPurchase Order` po right join
			`tabPurchase Invoice` p
			ON p.purchase_order=po.name
			LEFT JOIN(
                        select sum(ba.budget_amount) as budget_amount,
                        p.name as purchase_invoice from
                        `tabBudget Account` ba inner join
                        `tabBudget` b 
                        ON ba.parent=b.name right join 
                        `tabPurchase Invoice Item` i
                        ON b.item_group=i.item_group right join
                        `tabPurchase Invoice` p
                        ON i.parent=p.name
                        where i.expense_account=ba.account and b.fiscal_year=YEAR(CURDATE())
                        AND b.docstatus=1 group by p.name
                        )T1
                        ON T1.purchase_invoice=p.name
			and p.purchase_order=po.name
			where p.workflow_state not in ("Cancelled") and p.is_return=0 """+conditions+company_names+sort+limit)
	
	
	
	return items

@frappe.whitelist()
def get_data_for_payment(company=None,
	start=0, sort_by='name', sort_order='desc'):
	'''Return data to render the item dashboard'''
	filters = []
	conditions=""
	if company:
		conditions+=str('And p.company="'+company+'"')
	
	q3=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
	q4=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
	count=0
	for i in q3:
			for q in i:
				if(q==frappe.session.user):
					count+=1
	for i in q4:
			for q in i:
				if(q==frappe.session.user):
					count+=2
	
	q2=frappe.db.sql("""select c.company_name from `tabCompany` c,`tabUser` u  where u.name=%s and u.represents_company=c.associate_agent_company and c.associate_agent=%s""",(frappe.session.user,frappe.session.user))
	company_names=''
	for i in q2:
			for q in i:
				if(q):
					company_names=' and p.company in ('	
					for idx,i in enumerate(q2):
							if(idx!=0):
								company_names+=','
							for j in i:
								company_names+='"'+j+'"'
					company_names+=')'
	
	sort=''
	if sort_by:
		if(sort_by=="name"):
			sort+=" Order by p.name "+sort_order
		elif(sort_by=="invoice_date"):
			sort+=" Order by p.due_date "+sort_order
		elif(sort_by=="po_date"):
			sort+=" Order by po.transaction_date "+sort_order
	
	limit=' Limit 20 offset '+start
	items=frappe.db.sql("""select p.name as "name",
			p.supplier as "supplier",FORMAT(p.grand_total,2),DATE_FORMAT(p.due_date,"%d-%m-%Y"),
	 		p.workflow_state,FORMAT(po.grand_total,2),DATE_FORMAT(po.transaction_date,"%d-%m-%Y"),p.docstatus,
			(CASE
			when p.workflow_state="Draft" Then (select u.full_name 
			from `tabCompany` c, `tabUser` u,`tabHas Role` r where c.company_name=p.company and  
			c.associate_agent=u.name and u.name=r.parent and u.enabled = 1 and r.role = "Estate Manager") 
			when p.workflow_state="Pending" Then (select group_concat(u.full_name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent and r.role = 'Accounts Payable'
			and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 				c.company_name=p.company))
			END) as "user",
			"123.00" as "budget","""+str(count)+""" as "role"
			from 
			`tabPurchase Order` po right join
			`tabPurchase Invoice` p
			ON p.purchase_order=po.name
			
			and p.purchase_order=po.name
			where p.workflow_state not in ("Cancelled") and p.is_return=0 """+conditions+company_names+sort+limit)
	
	
	
	return items
