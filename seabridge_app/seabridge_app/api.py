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
from datetime import datetime
from itertools import groupby
from frappe.frappeclient import FrappeOAuth2Client,OAuth2Session
import requests

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
def update_status_after_return(doc): 
    pi_doc=frappe.get_doc("Purchase Invoice",doc) 
    pi_doc.db_set('status','Debit Note Issued')

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
	agent_users=frappe.db.sql("""
		select u.name
		from tabUser u,`tabHas Role` r where 
		u.name = r.parent and r.role = 'Accounts Payable'
		and u.enabled = 1 and u.represents_company=%s
	""",(represents_company))
	return agent_users
	

@frappe.whitelist()
def web_form_call():
	if frappe.session.user=="Administrator":
		estate_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
		accounts_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
		count=0
		for i in estate_user:
			for q in i:
				if(q==frappe.session.user):
					count+=1
		for i in accounts_user:
			for q in i:
				if(q==frappe.session.user):
					count+=2
		invoice_list=frappe.db.sql("""select p.name as "name",
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
		company_list=frappe.db.sql("""select c.company_name from `tabCompany` c,`tabUser` u  where u.name=%s and u.represents_company=c.associate_agent_company""",(frappe.session.user))
		company_names=''	
		for idx,i in enumerate(company_list):
			if(idx!=0):
				company_names+=','
			for j in i:
				company_names+='"'+j+'"'
		invoice_list=frappe.db.sql("""select p.name as "name",
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
		estate_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
		accounts_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
		count=0
		for i in estate_user:
			for q in i:
				if(q==frappe.session.user):
					count+=1
		for i in accounts_user:
			for q in i:
				if(q==frappe.session.user):
					count+=2
	return invoice_list,count

@frappe.whitelist()
def web_form(doc):
	pi_doc=frappe.get_doc("Purchase Invoice",doc)
	pi_doc.submit()
	pi_doc.db_set('workflow_state','Pending')
	frappe.db.commit()
	agent_comp=frappe.db.get_value('Company',{'company_name':pi_doc.company},'associate_agent_company')
	users=get_agent_users(agent_comp,doc)
	for u in users:
		for user in u:
			template='<h2><span style="color: rgb(102, 185, 102);">Task Details</span></h2><table class="table table-bordered"><tbody><tr><td data-row="insert-column-right"><strong>Document Id</strong></td><td data-row="insert-column-right"><strong style="color: rgb(107, 36, 178);">'+doc+'</strong></td></tr><tr><td data-row="row-z48v"><strong>Approver</strong></td><td data-row="row-z48v"><strong style="color: rgb(107, 36, 178);">'+user+'</strong></td></tr><tr><td data-row="row-zajk"><strong>View Document in ERPNext</strong></td><td data-row="row-mze0"><strong style="color: rgb(230, 0, 0);"><a href="desk#Form/Purchase Invoice/'+doc+'" target="_blank" class="btn btn-success">Click to view document</a></strong></td></tr><tr><td data-row="row-779i"><strong>Note</strong></td><td data-row="row-779i"><strong style="color: rgb(255, 153, 0);">This is a system generated email, please do not reply to this message.</strong></td></tr></tbody></table>'	
			make(subject = "Pending For Approval", content=template, recipients=user,send_email=True)
	
	
@frappe.whitelist()
def web_call_vendor(vendor):
	vendor_list=frappe.db.sql("""
		select p.name as "name",
		po.grand_total,p.grand_total,DATE_FORMAT(po.transaction_date,'%%d-%%m-%%Y'),DATE_FORMAT(p.due_date,'%%d-%%m-%%Y') as "due_date:Date",DATE_FORMAT(p.due_date,'%%d-%%m-%%Y')
		from `tabPurchase Invoice` p left join `tabPurchase Order` po ON p.purchase_order=po.name 
		where p.supplier=%s and p.workflow_state='Paid'""",(vendor))
	return vendor_list
	
		
@frappe.whitelist()
def get_user_role():
	estate_user=frappe.db.sql("""
		select r.role
		from tabUser u,`tabHas Role` r where 
		u.name = r.parent and r.role = 'Estate Manager'
		and u.enabled = 1 and u.name=%s
	""",(frappe.session.user))
	if(frappe.session.user=="Administrator"):
		return "Administrator";
	else:
		for q in estate_user:
			for user in q:
				return user


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
	doc_posted=False
	headers=frappe.db.get_list("API Integration",fields={'*'})
	has_sbtfx_contract=frappe.db.get_value('Supplier',{'supplier_name':pi_doc.supplier_name},'has_sbtfx_contract')
	if has_sbtfx_contract==1:
		if headers:
			try:
				headers_list = {
				"Authorization": "Bearer " + headers[0].authorization_key,
				"content-type": "application/json"
				}
				conn=FrappeOAuth2Client(headers[0].url,headers[0].authorization_key)
				document='{"documents":[{"buyer_name":"'+ pi_doc.company+'", "buyer_permid": "", "seller_name": "'+pi_doc.supplier_name+'", "seller_permid": "", "document_id": "'+pi_doc.name+'", "document_type": "I", "document_date": "'+str(pi_doc.posting_date)+'", "document_due_date":"'+str(pi_doc.due_date)+'", "amount_total": "'+str(pi_doc.outstanding_amount)+'", "currency_name": "SGD", "source": "community_erpnext", "document_category": "AP", "orig_transaction_ref":"'+pi_doc.bill_no+'"}]}'
				res = requests.post(headers[0].url, document, headers=headers_list, verify=True)
				response_code=str(res)
				res = conn.post_process(res)
				if response_code=="<Response [200]>":
					doc_posted=True
					pi_doc.add_comment('Comment','Sent the '+pi_doc.name+' to '+headers[0].url+' successfully.')
				else:
					doc_posted=False
					pi_doc.add_comment('Comment','Unable to send the '+pi_doc.name+' to '+headers[0].url)
			except Exception:
				doc_posted=False
				pi_doc.add_comment('Comment','Unable to send the '+pi_doc.name+' to '+headers[0].url) 
				frappe.log_error(frappe.get_traceback())

@frappe.whitelist()
def reject_invoice(doc,remarks):
	pi_doc=frappe.get_doc("Purchase Invoice",doc) 
	pi_doc.db_set('workflow_state','Rejected')
	pi_doc.db_set('rejection_reason',remarks)
	frappe.db.commit()
	user=frappe.db.sql("""select c.associate_agent 
			from `tabCompany` c, `tabPurchase Invoice` p where c.company_name=p.company and  
			p.name=%s""",pi_doc.name)
	template='<h2><span style="color: rgb(102, 185, 102);">Task Details</span></h2><table class="table table-bordered"><tbody><tr><td data-row="insert-column-right"><strong>Document Id</strong></td><td data-row="insert-column-right"><strong style="color: rgb(107, 36, 178);">'+pi_doc.name+'</strong></td></tr><tr><td data-row="row-z48v"><strong>Rejection Reason</strong></td><td data-row="row-z48v"><strong style="color: rgb(107, 36, 178);">'+remarks+'</strong></td></tr><tr><td data-row="row-zajk"><strong>View Document in ERPNext</strong></td><td data-row="row-mze0"><strong style="color: rgb(230, 0, 0);"><a href="desk#Form/Purchase Invoice/'+pi_doc.name+'" target="_blank" class="btn btn-success">Click to view document</a></strong></td></tr><tr><td data-row="row-779i"><strong>Note</strong></td><td data-row="row-779i"><strong style="color: rgb(255, 153, 0);">This is a system generated email, please do not reply to this message.</strong></td></tr></tbody></table>'
	make(subject = "Rejected Invoice", content=template, recipients=user[0][0],send_email=True)

@frappe.whitelist()
def get_user_accounts_payable():
	user=frappe.db.get_value('Has Role',{'parent':frappe.session.user,'parenttype':'User','role':'Accounts Payable'},'parent')
	return user


@frappe.whitelist()
def get_data(name=None, supplier=None, match=None,status=None,company=None,
	start=0, sort_by='invoice_date', sort_order='desc'):
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
	if company:
		conditions+=str('And p.company="'+company+'"')
	estate_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
	accounts_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
	count=0
	for i in estate_user:
			for user in i:
				if(user==frappe.session.user):
					count+=1
	for i in accounts_user:
			for user in i:
				if(user==frappe.session.user):
					count+=2
	
	company_names=''
	if(frappe.session.user!="Administrator"):
		company_list=frappe.db.sql("""select c.company_name from `tabUser Permission` u left join `tabCompany` c ON c.company_name=u.for_value where allow="Company" and u.user=%s""",(frappe.session.user))
		for i in company_list:
				for q in i:
					if(q):
						company_names=' and p.company in ('	
						for idx,i in enumerate(company_list):
								if(idx!=0):
									company_names+=','
								for j in i:
									company_names+='"'+j+'"'
						company_names+=')'
	
	sort=" Order by p.due_date "+sort_order+" ,p.name "+sort_order
	if sort_by:
		if(sort_by=="name"):
			sort=" Order by p.name "+sort_order
		elif(sort_by=="invoice_date"):
			sort=" Order by p.due_date "+sort_order+" ,p.name "+sort_order
		elif(sort_by=="po_date"):
			sort=" Order by po.transaction_date "+sort_order+" ,p.name "+sort_order
		elif(sort_by=="status"):
			sort=" Order by p.workflow_state "+sort_order+" ,p.name "+sort_order
	limit=' Limit 20 offset '+start
	if count==1:
		records=frappe.db.sql("""select 
				count(p.name) as "count"
				from 
				`tabPurchase Order` po right join
				`tabPurchase Invoice` p
				ON p.purchase_order=po.name
				and p.purchase_order=po.name
				where p.workflow_state not in ("Cancelled","Paid") and p.is_return=0 """+conditions+company_names)
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
				when p.workflow_state="To Pay" Then (select group_concat(u.full_name)
				from tabUser u,`tabHas Role` r where 
				u.name = r.parent and r.role = 'Finance Manager'
				and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 				c.company_name=p.company))
				when p.workflow_state="Rejected" Then (select distinct (u.full_name)
				from tabUser u,`tabHas Role` r where 
				u.name = r.parent
				and u.enabled = 1 and u.name in (select c.associate_agent from `tabCompany` c where c.company_name=p.company) limit 1)
				END) as "user",
				FORMAT(p.month_budget,2) as "budget","""+str(count)+""" as "role","""+str(records[0][0])+""" as "count",
				T2.file_name as file_name,p.invoice_description
				from 
				`tabPurchase Order` po right join
				`tabPurchase Invoice` p
				ON p.purchase_order=po.name
				lEFT JOIN(
				select count(f.file_name) as file_name,
				f.attached_to_name as attached_to_name from
				`tabFile` f 
				where attached_to_doctype="Purchase Invoice" group by f.attached_to_name
				)T2 
				ON T2.attached_to_name=p.name
				where p.workflow_state not in ("Cancelled","Paid") and p.is_return=0 """+conditions+company_names+sort+limit)
		return items
	elif count==2:
		records=frappe.db.sql("""select 
			count(p.name) as "count"
			from 
			`tabPurchase Order` po right join
			`tabPurchase Invoice` p
			ON p.purchase_order=po.name
			and p.purchase_order=po.name
			where p.workflow_state not in ("Cancelled","Paid") and p.is_return=0 """+conditions+company_names)
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
			when p.workflow_state="To Pay" Then (select group_concat(u.full_name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent and r.role = 'Finance Manager'
			and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 				c.company_name=p.company))
			when p.workflow_state="Rejected" Then (select distinct (u.full_name)
			from tabUser u,`tabHas Role` r where 
			u.name = r.parent
			and u.enabled = 1 and u.name in (select c.associate_agent from `tabCompany` c where c.company_name=p.company) limit 1)
			END) as "user",
			FORMAT(p.month_budget,2) as "budget","""+str(count)+""" as "role","""+str(records[0][0])+""" as "count",
			T2.file_name as file_name,p.invoice_description
			from 
			`tabPurchase Order` po right join
			`tabPurchase Invoice` p
			ON p.purchase_order=po.name
			lEFT JOIN(
			select count(f.file_name) as file_name,
			f.attached_to_name as attached_to_name from
			`tabFile` f 
			where attached_to_doctype="Purchase Invoice" group by f.attached_to_name
			)T2 
			ON T2.attached_to_name=p.name
			where p.workflow_state not in ("Cancelled","Paid","Draft") and p.is_return=0 """+conditions+company_names+sort+limit)
		return items

@frappe.whitelist()
def get_data_for_payment(name=None, supplier=None,company=None,
	start=0, sort_by='name', sort_order='desc'):
	'''Return data to render the item dashboard'''
	filters = []
	conditions=""
	if name:
		conditions+=str('And p.name="'+name+'"')
	if supplier:
		conditions+=str('And p.supplier="'+supplier+'"')
	if company:
		conditions+=str('And p.company="'+company+'"')
	
	estate_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
	accounts_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
	count=0
	for i in estate_user:
			for user in i:
				if(user==frappe.session.user):
					count+=1
	for i in accounts_user:
			for user in i:
				if(user==frappe.session.user):
					count+=2
	
	company_names=''
	if(frappe.session.user!="Administrator"):
		company_list=frappe.db.sql("""select c.company_name from `tabUser Permission` u left join `tabCompany` c ON c.company_name=u.for_value where allow="Company" and c.company_type="Customer" and u.user=%s""",(frappe.session.user))
		company_names=''
		for i in company_list:
				for q in i:
					if(q):
						company_names=' and p.company in ('	
						for idx,i in enumerate(company_list):
								if(idx!=0):
									company_names+=','
								for j in i:
									company_names+='"'+j+'"'
						company_names+=')'
		
	
	
	sort=" Order by p.due_date "+sort_order+" ,p.name "+sort_order
	if sort_by:
		if(sort_by=="name"):
			sort=" Order by p.name "+sort_order
		elif(sort_by=="invoice_date"):
			sort=" Order by p.due_date "+sort_order+" ,p.name "+sort_order
		elif(sort_by=="po_date"):
			sort=" Order by po.transaction_date "+sort_order+" ,p.name "+sort_order
		elif(sort_by=="status"):
			sort=" Order by p.workflow_state "+sort_order+" ,p.name "+sort_order
	
	limit=' Limit 20 offset '+start
	finance_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Finance manager'""",frappe.session.user)
	
	if finance_user:
		records=frappe.db.sql("""select 
			count(p.name) as "count"
			from 
			`tabPurchase Order` po right join
			`tabPurchase Invoice` p
			ON p.purchase_order=po.name
			and p.purchase_order=po.name
			where p.workflow_state="To Pay" and p.is_return=0 """+conditions+company_names)
		items=frappe.db.sql("""select p.name as "name",
				p.supplier as "supplier",FORMAT(p.grand_total,2),DATE_FORMAT(p.due_date,"%d-%m-%Y"),
		 		p.workflow_state,FORMAT(po.grand_total,2),DATE_FORMAT(po.transaction_date,"%d-%m-%Y"),p.docstatus,
				(select group_concat(u.full_name)
				from tabUser u,`tabHas Role` r where 
				u.name = r.parent and r.role = 'Finance Manager'
				and u.enabled = 1 and u.represents_company in (select c.associate_agent_company from `tabCompany` c where 				c.company_name=p.company)) as "user",
				FORMAT(p.month_budget,2) as "budget","""+str(count)+""" as "role","""+str(records[0][0])+""" as "count",
				T2.file_name as file_name,p.invoice_description
				from 
				`tabPurchase Order` po right join
				`tabPurchase Invoice` p
				ON p.purchase_order=po.name
				lEFT JOIN(
				select count(f.file_name) as file_name,
				f.attached_to_name as attached_to_name from
				`tabFile` f 
				where attached_to_doctype="Purchase Invoice" group by f.attached_to_name
				)T2 
				ON T2.attached_to_name=p.name
				where p.workflow_state="To Pay" and p.is_return=0 """+conditions+company_names+sort+limit)
	else:
		items=''
	return items

@frappe.whitelist()
def create_payment(invoices,account,company):
	bank_account=account.strip()
	invoice_list=json.loads(invoices)
	purchase_invoices=frappe.db.get_list("Purchase Invoice",filters={'name':['in',invoice_list]},fields={'*'})
	bpa_doc=frappe.get_doc(dict(doctype = 'Bank Payment Advice',
	company=company,
	date=datetime.date(datetime.now()),
	bank_account=bank_account
	)).insert(ignore_mandatory=True)
	bpa_doc.save()
	for inv in purchase_invoices:
		number=(datetime.date(datetime.now())-inv['due_date'])
		days_val=number.days
		return_invoices=frappe.db.get_list("Purchase Invoice",filters={'return_against':inv['name']},fields={'*'})
		if return_invoices:
			return_inv=return_invoices[0]['name']	
			return_total=return_invoices[0]['grand_total']
		else:
			return_inv=''
			return_total=0
		purchase_order=frappe.db.get_value('Purchase Invoice',{'name':inv['name']},'purchase_order')
		if purchase_order:
			po=purchase_order
			purchase_amount=frappe.db.get_value('Purchase Order',{'name':po},'grand_total')
		else:
			po=''
			purchase_amount=0
		has_sbtfx=frappe.db.get_value('Supplier',{'name':inv['supplier_name']},'has_sbtfx_contract')
		if has_sbtfx==1:
			represents_company=frappe.db.get_value('Supplier',{'name':inv['supplier_name']},'represents_company')
			parent_company=frappe.db.get_value('Company',{'name':represents_company},"parent_company")
			bank_account=frappe.db.get_value("Company",{'name':parent_company},"bank_account")
			bank_name=frappe.db.get_value("Company",{'name':parent_company},"bank_name")
		else:
			bank_account=frappe.db.get_value("Supplier",{'name':inv['supplier_name']},"bank_account")
			bank_name=frappe.db.get_value("Supplier",{'name':inv['supplier_name']},"bank_name")
		bpa_doc.append('bank_payment_advice_details', {
						    'invoice_document':inv['name'],
						    'overdue_days':days_val,
						    'debit_note':return_inv,
						    'debit_note_amount':return_total,
						    'supplier_name':inv['supplier_name'],
						    'invoice_amount':inv['grand_total'],
						    'due_date':inv['due_date'],
						    'outstanding_amount':inv['outstanding_amount'],
						    'payment_transaction_amount':inv['outstanding_amount'],
						    'cheque_no':"1234",
						    'cheque_date':datetime.date(datetime.now()),
						    'purchase_order':po,
						    'purchase_order_amount':purchase_amount,
						    'has_sbtfx_contract':has_sbtfx,
						    'bank_account':bank_account,
						    'bank_name':bank_name
						})
	bpa_doc.save()
	frappe.msgprint("Payment Batch <a href='/desk#Form/Bank%20Payment%20Advice/"+bpa_doc.name+"'  target='_blank'>"+bpa_doc.name+"</a>  successfully created for selected invoices")

@frappe.whitelist()
def get_user_roles_dashboard():
	estate_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Estate Manager'""",frappe.session.user)
	accounts_user=frappe.db.sql("""select u.name 
			from `tabUser` u,`tabHas Role` r where u.name=%s and
			u.name=r.parent and u.enabled = 1 and r.role = 'Accounts Payable'""",frappe.session.user)
	finance_user=frappe.db.sql("""select u.name
				from tabUser u,`tabHas Role` r where 
				u.name = r.parent and r.role = 'Finance Manager'
				and u.enabled = 1 and u.name=%s""",frappe.session.user)

	role_count=0
	for user_list in estate_user:
			for user in user_list:
				if(user==frappe.session.user):
					role_count+=1
	for user_list in accounts_user:
			for user in user_list:
				if(user==frappe.session.user):
					role_count+=2
	for user_list in finance_user:
			for user in user_list:
				if(user==frappe.session.user):
					role_count+=3
	return role_count


@frappe.whitelist()
def get_estate_company_detail():
	company_detail=''
	company_list=frappe.db.sql("""select group_concat(c.company_name)
				from tabUser u,`tabHas Role` r, `tabCompany` c where 
				u.name = r.parent and r.role = 'Estate Manager'
				and u.enabled = 1 and u.name=c.associate_agent and c.associate_agent=%s""",frappe.session.user)
	for company in company_list:
		for company_name in company:
			company_detail=company_name
	return company_detail

	
@frappe.whitelist()
def get_invoice_details(invoice_name):
	invoice='"'+invoice_name+'"'
	invoice_data=frappe.db.sql("""select p.company,p.supplier,DATE_FORMAT(p.due_date,"%d-%m-%Y"),FORMAT(p.grand_total,2),
	po.name,FORMAT(po.grand_total,2),DATE_FORMAT(po.transaction_date,"%d-%m-%Y"),FORMAT(p.month_budget,2),p.invoice_description,pi.item_name,pi.qty,FORMAT(pi.rate,2),FORMAT(pi.amount,2),FORMAT(p.net_total,2),FORMAT(p.total_taxes_and_charges,2)
	from `tabPurchase Invoice Item` pi right join `tabPurchase Invoice` p ON p.name=pi.parent left join `tabPurchase Order` po
	ON p.purchase_order=po.name
	where p.name="""+invoice)
	invoice_attachments=frappe.db.sql("""select f.file_name,
	f.file_url from
	`tabFile` f 
	right join `tabPurchase Invoice` p
	ON f.attached_to_name=p.name	
	where attached_to_doctype="Purchase Invoice" 
	and p.name="""+invoice)
	checklist=frappe.db.sql("""select IFNULL(acd.description,''),IFNULL(acd.options,''),IFNULL(acd.remarks,'') from
	`tabAttachment Checklist Detail` acd right join
	`tabPurchase Invoice` p
	ON acd.parent=p.name
	where p.name="""+invoice)
	if invoice_attachments:
		if checklist[0][0]!='':
			return invoice_data,invoice_attachments,checklist
		else:
			return invoice_data,invoice_attachments,0
	else:
		if checklist[0][0]!='':
			return invoice_data,0,checklist 
		else:
			return invoice_data,0,0

@frappe.whitelist()
def update_monthly_budget(doc):
	pi_doc=frappe.get_doc("Purchase Invoice",doc) 
	pi_items=frappe.db.get_list('Purchase Invoice Item',filters={'parenttype':'Purchase Invoice','parent':pi_doc.name},fields={'*'})
	fiscal_year=frappe.db.get_list('Fiscal Year',filters={'disabled':0,'year_start_date':['<=',pi_doc.posting_date],'year_end_date':['>=',pi_doc.posting_date]},fields={'*'})
	if fiscal_year:
		fiscal_year_name=''
		for year in fiscal_year:
			fiscal_year_items=frappe.db.get_list('Fiscal Year Company',filters={'parenttype':'Fiscal Year','parent':year['name'],'company':pi_doc.company},fields={'*'})
			if fiscal_year_items:
				fiscal_year_name=year['name']
		if fiscal_year_name!='':
			budget_list=frappe.db.get_list('Budget',filters={'company':pi_doc.company,'item_group':pi_items[0]['item_group'],'fiscal_year':fiscal_year_name,'docstatus':['!=',2]},fields={'*'})
			if budget_list:
				budget_name=budget_list[0]['name']
				budget_account=frappe.db.get_list('Budget Account',filters={'parenttype':'Budget','parent':budget_list[0]['name'],'account':pi_items[0]['expense_account']},fields={'*'})
				if budget_account:
					if budget_list[0]['monthly_distribution']:
						invoice_date = pi_doc.posting_date
						month = invoice_date.strftime("%B")
						monthly_distribution=frappe.db.get_list('Monthly Distribution Percentage',filters={'parenttype':'Monthly Distribution','parent':budget_list[0]['monthly_distribution'],'month':month},fields={'*'})
						monthly_budget=monthly_distribution[0]['percentage_allocation']*budget_account[0]['budget_amount']/100
						pi_doc.db_set('month_budget',monthly_budget)
					else:
						monthly_budget=budget_account[0]['budget_amount']/12
						pi_doc.db_set('month_budget',monthly_budget)
