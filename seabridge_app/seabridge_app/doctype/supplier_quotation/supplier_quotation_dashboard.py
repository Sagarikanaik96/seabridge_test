from __future__ import unicode_literals
from frappe import _

def get_dashboard_data(data):
	return {
		'fieldname': 'supplier_quotation',
		'non_standard_fieldnames': {
			'Auto Repeat': 'reference_document'
		},
		'internal_links': {
			'Material Request': ['items', 'material_request'],
			'Request for Quotation': ['items', 'request_for_quotation'],
			'Project': ['items', 'project'],
		}

	}
