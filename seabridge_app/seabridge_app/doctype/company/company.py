# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Company(Document):
	pass

def before_save(doc,method):
	for series in doc.series:
		naming_doc=frappe.db.get_list("Document Specific Naming Series", filters={'reference_document': series.reference_document, 'series': series.series, 'parent':doc.name},fields={'*'})
		if naming_doc:
			print('nameseries-------------',naming_doc)
		else:
			new_doc=frappe.db.get_list("Document Specific Naming Series", filters={'reference_document': series.reference_document,'series': series.series},fields={'*'})
			if new_doc:
				frappe.throw("Naming Series "+series.series+" already exists for Company "+new_doc[0].parent)
