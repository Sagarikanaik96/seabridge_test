# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "seabridge_app"
app_title = "seabridge_app"
app_publisher = "seabridge_app"
app_description = "seabridge_app"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "seabridge_app@gmail.com"
app_license = "MIT"
app_logo_url = '/assets/seabridge_app/images/Seabridge TFX_VL.png'
app_include_css = "assets/seabridge_app/css/desk.min.css"
#app_include_js = "assets/seabridge_app/js/seabridge_app/utils/common.js"
app_include_js = "assets/seabridge_app/js/seabridge_app/form/multi_select_dialog.js"
website_context = {
	"favicon": 	"/assets/seabridge_app/images/seaicon.png",
	"splash_image": "/assets/seabridge_app/images/Seabridge TFX_VL.png"
}


fixtures = ["Server Script",
{
    "dt":"DocType",
    "filters":[
        [
        "name","in",[
            "Item Group Detail",
            "Registration",
            "Document Specific Naming Series",
	    "Service Completion Note",
	    "Service Completion Note Item",
	    "Agent",
	    "API Integration",
	    "Bank Payment Advice",
	    "Bank Payment Advice Details"
        ]
    ]
]
},
{"dt": "Custom Field",
		"filters": [
         [
             "name", "in", [
		"Opportunity-reference_no",
		"Opportunity-quotation_type",
		"Opportunity-opening_date",
		"Supplier Quotation-rfq_no",
		"Supplier Quotation-quotation_type",
		"Supplier Quotation-opening_date",
		"Supplier Quotation-quotation_no",
		"Item-company_name",
		"Request for Quotation Item-qualifier",
		"Supplier-item_group_detail",
		"Supplier-item_group",
		"Quotation-quotation_type",
		"Quotation-opening_date",
		"Request for Quotation-quotation_type",
		"Request for Quotation-opening_date",
		"Company-company_type",
		"Company-associate_agent_company",
		"Company-associate_agent",
		"Company-naming_series_details",
		"Company-series",
		"User-is_system_admin",
		"User-represents_company",
		"Purchase Invoice Item-over_billing_allowance",
		"Purchase Receipt Item-over_delivery_receipt_allowance",
		"Purchase Order Item-parent_item_group",
		"Purchase Invoice Item-parent_item_group",
		"Sales Order Item-parent_item_group",
		"Sales Invoice Item-parent_item_group",
		"Supplier Quotation Item-parent_item_group",
		"Quotation Item-parent_item_group",
		"purchase Receipt Item-parent_item_group",
		"Blanket Order-supplier_quotation",
		"Contract-company",
		"Company-notify_email",
		"Company-start_date",
		"Company-end_date",
		"Company-default_warehouse",
		"Company-management_agent_registration_details",
		"Company-column_break_13",
		"Purchase Invoice-purchase_order",
		"Purchase Invoice-purchase_receipt",
		"Purchase Invoice-service_completion_note"
		]
	]
]
},
{"dt": "Property Setter",
        "filters": [
	[
		"name","in",
 			[
				"Request for Quotation-naming_series-options",
				"Material Request-naming_series-options",
				"Material Request-material_request_type-options",
				"Material Request Item-warehouse-in_list_view",
				"Supplier Quotation-grand_total-in_list_view",
				"Supplier Quotation-items-depends_on",
				"Supplier Quotation-total_taxes_and_charges-depends_on",
				"Supplier Quotation-taxes-depends_on",
				"Supplier Quotation-taxes_and_charges-depends_on",
				"Supplier Quotation-base_total_taxes_and_charges-depends_on",
				"Supplier Quotation-base_rounded_total-depends_on",
				"Supplier Quotation-base_grand_total-depends_on",
				"Supplier Quotation-base_total-depends_on",
				"Supplier Quotation-total-depends_on",
				"Supplier Quotation-grand_total-depends_on",
				"Supplier Quotation-rounded_total-depends_on",
				"Supplier Quotation-base_in_words-depends_on",
				"Supplier Quotation-in_words-depends_on",
				"Supplier Quotation-tc_name-depends_on",
				"Supplier Quotation-terms-depends_on",
				"Supplier Quotation-base_taxes_and_charges_added-depends_on",
				"Supplier Quotation-base_taxes_and_charges_deducted-depends_on",
				"Supplier Quotation-taxes_and_charges_added-depends_on",
				"Contract-party_name-label",
				"Contract-party_user-hidden",
				"Contract-party_type-options",
				"Contract-party_type-default",
				"Purchase Order-naming_series-reqd"		
						
			]
	]
	]
},
{"dt": "Notification", 
		"filters": [
			"is_standard != 1"]
},
{"dt": "Role", 
		"filters":[
        [
        "name","in",["Agent", "Accounts Payable"]
	]
	]
},

{"dt": "Workflow", 
		"filters":[
        [
        "name","in",["PI Approval WF"]
	]
	]
},
{"dt": "Print Format",
        "filters": [
	[
		"name","in",
 			[
				"Quotation Print Format",
				"PO Print Format",
				"SI Print Format",
				"RFQ Print Format"
			]
	]
]
}
]
doctype_js = {
	"Request for Quotation" : "seabridge_app/doctype/request_for_quotation/request_for_quotation.js",
	"Purchase Invoice" : "seabridge_app/doctype/purchase_invoice/purchase_invoice.js",
	"Sales Invoice" : "seabridge_app/doctype/sales_invoice/sales_invoice.js",
	"Quotation" : "seabridge_app/doctype/quotation/quotation.js",
	"Material Request" : "seabridge_app/doctype/material_request/material_request.js",
	"Supplier" : "seabridge_app/doctype/supplier/supplier.js",
	"Supplier Quotation" : "seabridge_app/doctype/supplier_quotation/supplier_quotation.js",
	"Purchase Order" : "seabridge_app/doctype/purchase_order/purchase_order.js",
	"Sales Order" : "seabridge_app/doctype/sales_order/sales_order.js",
	"Purchase Receipt" : "seabridge_app/doctype/purchase_receipt/purchase_receipt.js",
	"Opportunity" : "seabridge_app/doctype/opportunity/opportunity.js",
	"Registration" : "seabridge_app/doctype/registration/registration.js",
	"Company" : "seabridge_app/doctype/company/company.js",
	"Blanket Order" : "seabridge_app/doctype/blanket_order/blanket_order.js",
	"Contract" : "seabridge_app/doctype/contract/contract.js"
}

doc_events = {
    	"Sales Invoice": {
		"on_submit": ["seabridge_app.seabridge_app.doctype.sales_invoice.sales_invoice.auto_create_purchase_invoice"]
    },
	"Request for Quotation": {
		"on_submit": ["seabridge_app.seabridge_app.doctype.request_for_quotation.request_for_quotation.auto_create_opportunity"]
	    },
	"Quotation": {
		"on_submit": ["seabridge_app.seabridge_app.doctype.quotation.quotation.auto_create_supplier_quotation"]
    },
	"Registration": {
		"on_submit": ["seabridge_app.seabridge_app.doctype.registration.registration.on_registration_submit"]
    },
	"Purchase Order": {
		"on_submit": ["seabridge_app.seabridge_app.doctype.purchase_order.purchase_order.auto_create_sales_order"]
    },
	"Bank Payment Advice": {
		"on_submit": ["seabridge_app.seabridge_app.doctype.bank_payment_advice.bank_payment_advice.auto_create_payment_entry"]
    },
	"Purchase Invoice": {
		"on_submit": ["seabridge_app.seabridge_app.doctype.purchase_invoice.purchase_invoice.update_status"],
		"before_submit": ["seabridge_app.seabridge_app.doctype.purchase_invoice.purchase_invoice.before_submit"]
    }
}

override_doctype_dashboards = {
"Purchase Order": ["seabridge_app.seabridge_app.doctype.purchase_order.purchase_order_dashboard.get_dashboard_data"]
}

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/seabridge_app/css/seabridge_app.css"
# app_include_js = "/assets/seabridge_app/js/seabridge_app.js"

# include js, css files in header of web template
# web_include_css = "/assets/seabridge_app/css/seabridge_app.css"
# web_include_js = "/assets/seabridge_app/js/seabridge_app.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "seabridge_app.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "seabridge_app.install.before_install"
# after_install = "seabridge_app.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "seabridge_app.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"seabridge_app.tasks.all"
# 	],
# 	"daily": [
# 		"seabridge_app.tasks.daily"
# 	],
# 	"hourly": [
# 		"seabridge_app.tasks.hourly"
# 	],
# 	"weekly": [
# 		"seabridge_app.tasks.weekly"
# 	]
# 	"monthly": [
# 		"seabridge_app.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "seabridge_app.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "seabridge_app.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "seabridge_app.task.get_dashboard_data"
# }

