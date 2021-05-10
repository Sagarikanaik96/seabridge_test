from __future__ import unicode_literals
from frappe import _

def get_dashboard_data(data):
	return {
		'fieldname': 'item_code',
		'non_standard_fieldnames': {
			'Work Order': 'production_item',
			'Product Bundle': 'new_item_code',
			'BOM': 'item',
			'Batch': 'item'
		}
	}
