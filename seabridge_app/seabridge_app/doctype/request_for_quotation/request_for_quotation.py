# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RequestforQuotation(Document):
	pass

def auto_create_opportunity(doc,method): 
	for row in doc.suppliers:
		for val in doc.items:
			tag=get_tag(row.supplier)
			if val.qualifier==tag:
				try:
					customer=frappe.db.get_value('Customer',{'is_internal_customer':1,'represents_company':doc.company},'customer_name')
					company=frappe.db.get_value('Supplier',{'is_internal_supplier':1,'supplier_name':row.supplier},'represents_company')
					contact_person=frappe.db.get_value('Dynamic Link',{'parenttype':'Contact','link_doctype':'Customer','link_name':customer},'parent')
					customer_address=frappe.db.get_value('Dynamic Link',{'parenttype':'Address','link_doctype':'Customer','link_name':customer},'parent')
					r_name=frappe.db.get_list('Document Specific Naming Series',filters={'parent':company,'parenttype':'Company'},fields={'*'})
					rfq_name="null"
					for tup in r_name:
						if tup.reference_document=="Opportunity":
							rfq_name=tup.series
					if rfq_name!="null":
						if customer:
							if company:
								create_user_permission(row.email_id,'Company',company,True)
								opp_doc=frappe.get_doc(dict(doctype = 'Opportunity',
											opportunity_from = 'Customer',
											naming_series=rfq_name,
											party_name=customer,
											contact_person=contact_person,
											with_items=1,
											customer_address=customer_address,
											contact_display=contact_person,
											contact_email=frappe.db.get_value('Contact Email', {'parenttype':'Contact','parent':contact_person},'email_id'),
											company=company,
											reference_no=doc.name,
											quotation_type=doc.quotation_type,
											opening_date=doc.opening_date,
											ignore_permissions='true')).insert()			
								opp_doc.append('items', {
									'item_code': val.item_code,
									'qty': val.qty,
									'uom':val.uom
									})
								agent_name=frappe.db.get_value('User',{'email':frappe.session.user},'full_name')
								agent_company=frappe.db.get_value('User',{'email':frappe.session.user},'represents_company')
								if agent_company:
									opp_doc.add_comment('Comment',agent_name+' created '+opp_doc.name+' from '+agent_company)
								opp_doc.save()
								doc.add_comment('Created','  created Opportunity for '+row.supplier)
								companyName=frappe.db.get_value('Item',val.item_code,'company_name')
								if companyName:
									create_user_permission(row.email_id,'Company',companyName,False,'Item')
									
						else:
							frappe.msgprint("Unable to create Opportunity as customer: "+doc.company+ " is not associated with any company. Register the Company and submit the document: "+doc.name+". As Customer is not associated with any company, don't let MA submit the RFQ document.")
							raise frappe.ValidationError("Unable to create Opportunity as customer: " +doc.company+" is not associated with any company.")
					else:
						frappe.throw("Unable to save the Opportunity as the naming series are unavailable . Please provide the naming series at the Company: "+company+" to save the document");						
				except KeyError:
					pass
@frappe.whitelist()
def create_user_permission(user,allow,value,check,applicable_for=''):
#user,allow,for_value,apply_to_all_doctypes,applicable_for
    docVal=frappe.db.get_list('User Permission', filters={'user':user,'for_value':value,'allow':allow,'apply_to_all_doctypes':check,'applicable_for':applicable_for})
    if not docVal:
        frappe.get_doc(dict(doctype = 'User Permission',
        	user = user,
            allow=allow,
        	for_value =value,
        	apply_to_all_doctypes=check,
        	applicable_for=applicable_for)).insert()


@frappe.whitelist()
def delete_user_permission(user,allow,value,check,applicable_for=''):
#user,allow,for_value,apply_to_all_doctypes,applicable_for
    docVal=frappe.db.get_list('User Permission', filters={'user':user,'for_value':value,'allow':allow,'apply_to_all_doctypes':check,'applicable_for':applicable_for})
    if not docVal:
        frappe.get_doc(dict(doctype = 'User Permission',
        	user = user,
            allow=allow,
        	for_value =value,
        	apply_to_all_doctypes=check,
        	applicable_for=applicable_for)).delete()


@frappe.whitelist()
def get_tag(parent):
	return frappe.db.get_value('Tag Link',{'parent':parent},'tag')
