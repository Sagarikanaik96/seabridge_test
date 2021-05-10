from __future__ import unicode_literals

from frappe import _


def get_dashboard_data(data):
	return {
		'fieldname': 'customer',
		'non_standard_fieldnames': {
			'Payment Entry': 'party',
			'Quotation': 'party_name',
			'Opportunity': 'party_name',
			'Bank Account': 'party',
			'Subscription': 'party'
		},
		'dynamic_links': {
			'party_name': ['Customer', 'quotation_to']
		}
	}
