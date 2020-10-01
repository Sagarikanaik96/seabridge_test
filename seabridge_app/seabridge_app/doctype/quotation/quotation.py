# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Quotation(Document):
	pass

def auto_create_supplier_quotation(doc,method):
    supplier=frappe.db.get_value('Supplier',{'is_internal_supplier':1,'represents_company':doc.company},'supplier_name')
    company=frappe.db.get_value('Customer',{'is_internal_Customer':1,'customer_name':doc.customer_name},'represents_company')
    contact_person=frappe.db.get_value('Dynamic Link',{'parenttype':'Contact','link_doctype':'Supplier',"link_name":supplier},'parent')
    if company:
        if supplier:
            sq_doc=frappe.get_doc(dict(doctype = 'Supplier Quotation',
                        supplier=supplier,
                        company=company,
                        valid_till=doc.valid_till,
                        supplier_address=frappe.db.get_value("Dynamic Link",{"parenttype":"Address","link_doctype":"Supplier","link_name":supplier},"parent"),
                        contact_person=contact_person,
                        contact_email=frappe.db.get_value('Contact Email', {'parenttype':'Contact','parent':contact_person},'email_id'),
                        conversion_rate=1,
                        quotation_no=doc.name,
                        tc_name=doc.tc_name,
                        terms=doc.terms,
                        total=doc.total,
                        grand_total=doc.grand_total,
                        base_grand_total=doc.base_grand_total,
                        rounded_total=doc.rounded_total,
                        base_rounded_total=doc.base_rounded_total,
			quotation_type=doc.quotation_type,
			opening_date=doc.opening_date,
                        rfq_no=frappe.db.get_value('Opportunity',doc.opportunity,'reference_no')
                    )).insert(ignore_mandatory=True)
            for val in doc.items:
                    sq_doc.append('items', {
                        'item_code':val.item_code,
                        'qty':val.qty,
                        'uom':val.uom,
                        'stock_uom':val.stock_uom,
                        'rate':val.rate,
                        'amount':val.amount,
                        'base_rate':val.base_rate,
                        'base_amount':val.base_amount,
                        'description':val.description,
                    'conversion_factor':val.conversion_factor
                    })
            sq_doc.add_comment('Comment',' System created  '+sq_doc.name)
            sq_doc.save()
            doc.add_comment('Comment','  Supplier Quotation: '+sq_doc.name)  
    else:
        frappe.msgprint("Unable to create Supplier Quotation as customer: "+doc.customer_name +" is not associated with any company. Register the Company and submit the document: "+doc.name+ ". As Customer is not associated with any company, don't let Vendor submit the Quotation document.")
        raise frappe.ValidationError("Unable to create Supplier Quotation as customer: "+doc.customer_name +" is not associated with any company. Register the Company and submit the document: "+doc.name+ ". As Customer is not associated with any company, don't let Vendor submit the Quotation document.")
