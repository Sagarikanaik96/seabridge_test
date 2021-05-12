from __future__ import unicode_literals

from frappe import _


def get_dashboard_data(data):
	return {
		'fieldname': 'supplier',
		'non_standard_fieldnames': {
			'Payment Entry': 'party_name',
			'Bank Account': 'party'
		}
	}
