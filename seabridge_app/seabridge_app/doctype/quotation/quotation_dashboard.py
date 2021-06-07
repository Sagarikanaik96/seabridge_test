from __future__ import unicode_literals
from frappe import _

def get_dashboard_data(data):
	return {
		'fieldname': 'prevdoc_docname',
		'non_standard_fieldnames': {
			'Auto Repeat': 'reference_document',
		}
	}
