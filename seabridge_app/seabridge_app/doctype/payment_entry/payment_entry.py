# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeOAuth2Client,OAuth2Session
from frappe.model.document import Document
import json
import requests
from datetime import datetime

class PurchaseInvoice(Document):
	pass

@frappe.whitelist()
def update_status(doc,method):
    if doc.payment_type=="Pay":
        for val in doc.references:
            if val.reference_doctype=="Purchase Invoice":
                if val.outstanding_amount==0: 
                    pi_doc=frappe.get_doc("Purchase Invoice",val.reference_name) 
                    pi_doc.db_set('workflow_state','Paid')
                    pi_doc.db_set('status','Paid')
                    pi_doc.db_set('paid_date',datetime.date(datetime.now()))


def update_status_on_cancel(doc,method):
    if doc.payment_type=="Pay":
        for val in doc.references:
            if val.reference_doctype=="Purchase Invoice":
                if val.outstanding_amount>0:
                    pi_doc=frappe.get_doc("Purchase Invoice",val.reference_name) 
                    pi_doc.db_set('workflow_state','To Pay')
             

