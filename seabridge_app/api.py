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
from frappe.model.db_query import DatabaseQuery
from datetime import datetime
from itertools import groupby
from frappe.frappeclient import FrappeOAuth2Client,OAuth2Session
import requests
from datetime import timedelta, date


@frappe.whitelist()
def status_update(filters = None):
	date=True
	keys=True
	requestData=json.loads(frappe.request.data.decode('utf-8'))
	mandatoryKeyList=['source','vendor_name','document_id','status','document_category','update_date']
	for key in mandatoryKeyList:
		if not key in requestData.keys():
			frappe.local.response['http_status_code'] = 400
			frappe.response['status']="FAILED"
			frappe.response['message']='Mandatory field '+ key+' not provided'
			keys=False
	if keys==True:
		if requestData['status'].lower()=="funded":
			if (requestData['document_category']=="AP"):
				pi_exists=frappe.db.get_list("Purchase Invoice",filters={'name':requestData['document_id']},fields={'*'})
				if pi_exists:
					pi_doc=frappe.get_doc("Purchase Invoice",requestData['document_id']) 
					pi_doc.db_set('is_funded',1)
					pi_doc.db_set('on_hold',0)
					if 'notes' in requestData.keys():
						pi_doc.db_set('notes',requestData['notes'])
					try:
						pi_doc.db_set('update_date',requestData['update_date'])
					except:
						date=False
						
					pi_doc.db_set('source',requestData['source'])
					frappe.db.commit()
					if pi_doc.supplier.lower()==requestData['vendor_name'].lower():
						if date==True:
							frappe.response['status']="SUCCESS"
							frappe.response['message']="Successfully updated the status"
							
						else:
							frappe.local.response['http_status_code'] = 400
							frappe.response['status']="FAILED"
							frappe.response['message']="Date Format Incorrect (Must be 'YYYY-MM-DD')"
					else:
						frappe.local.response['http_status_code'] = 400
						frappe.response['status']="FAILED"
						frappe.response['message']="Vendor Name Incorrect (Vendor Name of this Invoice is "+pi_doc.supplier+")"
				else:
					frappe.local.response['http_status_code'] = 400
					frappe.response['status']="FAILED"
					frappe.response['message']="Purchase Invoice Unavailable"
			else:
				frappe.local.response['http_status_code'] = 400
				frappe.response['status']="FAILED"
				frappe.response['message']="Invalid Document Category (Should be 'AP')"
		else:
			frappe.local.response['http_status_code'] = 400
			frappe.response['status']="FAILED"
			frappe.response['message']="Invalid Status (Must be 'Funded')" 

@frappe.whitelist()
def create_contract_note(filters = None):
	try:
		keys=True
		requestData=json.loads(frappe.request.data.decode('utf-8'))
		if 'doctype' in requestData.keys():
			fieldsList = frappe.db.sql("""SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` where `TABLE_NAME`=%s  and
		 	`COLUMN_NAME` not in ('name','creation','modified','modified_by','owner','docstatus','parent','parentfield','parenttype',
			'idx','naming_series','_liked_by','_assign','amended_from','_user_tags','_comments');
			""",'tab'+requestData['doctype'],as_list=True)
			mandatoryKeyList=['doctype']
			for field in fieldsList:
				mandatoryKeyList.append(field[0])
			for key in mandatoryKeyList:
				if not key in requestData.keys() and key!="terms_and_conditions":
					if key=="terms":
						if "terms_and_conditions" not in requestData.keys():
							frappe.local.response['http_status_code'] = 400
							frappe.response['status']="FAILED"
							frappe.response['message']='Either terms or terms_and_conditions is Mandatory'
							keys=False
					else:
						frappe.local.response['http_status_code'] = 400
						frappe.response['status']="FAILED"
						frappe.response['message']='Mandatory field '+ key+' not provided'
						keys=False
			if keys==True:
				transactions=requestData['transaction_information']
				if not transactions or not transactions[0]:
					frappe.local.response['http_status_code'] = 400
					frappe.response['status']="FAILED"
					frappe.response['message']='Atleast 1 transaction is mandatory'
					keys=False
			if keys==True:			
				cn_doc=frappe.get_doc(dict(doctype = requestData['doctype']))
				cn_doc.save(ignore_permissions=True)
				for key in mandatoryKeyList:
					if key not in ('transaction_information','doctype'):
						
						if key=="terms":
							if key in requestData.keys():
								terms=frappe.db.get_value('Terms and Conditions', {'name': requestData['terms']}, 'terms')
								cn_doc.db_set(key,requestData['terms'])
								cn_doc.db_set('terms_and_conditions',terms)
						else:
							if key!="terms_and_conditions":
								cn_doc.db_set(key,requestData[key])
							else:
								if key in requestData.keys():
									cn_doc.db_set(key,requestData[key])				
				for transaction in transactions:
					childTableFieldList = frappe.db.sql("""SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` where `TABLE_NAME`=%s and `COLUMN_NAME` not in ('name','creation','modified','modified_by','owner','docstatus','parent',
				'parentfield','parenttype','idx','naming_series','_liked_by','_assign','amended_from','_user_tags','_comments');
				""",'tab'+transaction['doctype'],as_list=True)			
					childTableKeyList=[]
					
					for field in childTableFieldList:
						childTableKeyList.append(field[0])
					ctd_doc=frappe.get_doc(dict(doctype = transaction['doctype'],
						parentfield=transaction['parentfield'],
						parenttype=requestData['doctype'],
						parent=cn_doc.name
					)).insert(ignore_mandatory=True,ignore_permissions=True)
					frappe.db.commit()
					for key in childTableKeyList:
						key_name="'"+key+"'"
						ctd_doc.db_set(key,transaction[key])
				cn_doc.db_set('docstatus',1)
				frappe.response['Status']="Success"
				frappe.response['Message']='Successfully created Contract Note '+cn_doc.name
				data_list=[requestData['doctype']+" : "+cn_doc.name]
				frappe.response['Data']=data_list
		else:
			frappe.local.response['http_status_code'] = 400
			frappe.response['status']="FAILED"
			frappe.response['message']='Mandatory field doctype not provided'
	except:
		frappe.local.response['http_status_code'] = 400
		frappe.response['status']="FAILED"
		frappe.response['message']='Something went wrong'



