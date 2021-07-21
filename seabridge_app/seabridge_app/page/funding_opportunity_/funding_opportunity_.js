frappe.pages['funding-opportunity-'].on_page_load = function (wrapper) {
	var parent = $('<div class="funding-opportunity-list"></div>').appendTo(wrapper);
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Invoices',
		single_column: true
	});
	page.start = 0;
	page.today_claim = 0;
	display_cards(page.today_claim)
	$("<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>").appendTo('.page-form')
	page.status_field = page.add_field({
		fieldname: 'inv_status',
		label: __('Status'),
		fieldtype: 'Select',
		options: ["", "ELIGIBLE FOR FUNDING", "SUBMITTED FOR FUNDING", "FUNDED"],
		change: function () {
			page.invoice_dashboard.start = 0;
			page.invoice_dashboard.refresh();
		}
	});


	frappe.require('/assets/seabridge_app/js/fund_opportunity_page.min.js', function () {
		page.invoice_dashboard = new seabridge_app.ActionTable({
			parent: page.main,
		})
		page.invoice_dashboard.before_refresh = function () {
			this.status = page.status_field.get_value();
		}
		page.invoice_dashboard.refresh();

	});
}
function display_cards(today_claim){
var total_credit_limit;
	var total_funds_claimed;
	var total_credit_available;
	var total_invoices_available_for_funding;
	var total_financing_amount_available_for_funding;
	
	frappe.call({
		method: "seabridge_app.seabridge_app.api.post_fund_opportunities",
		args: {
			seller_name: "WEE HONG POTTERY"
		},
		async: false,
		callback: function (r) {
			total_credit_limit = ((parseFloat(r.message.total_credit_limit)).toLocaleString('en-US'));
        total_funds_claimed = ((parseFloat(r.message.total_funds_claimed)).toLocaleString('en-US'));
        total_credit_available =((parseFloat(r.message.total_credit_available)).toLocaleString('en-US'));
        total_invoices_available_for_funding=((parseFloat(r.message.total_invoices_available_for_funding)).toLocaleString('en-US'));
        total_financing_amount_available_for_funding = ((parseFloat(r.message.total_financing_amount_available_for_funding)).toLocaleString('en-US'));


		}
	});

$("<style>.row:after {content: '';display: table;clear: both;}@media screen and (max-width: 700px) {.column {width: 100%;display: block;margin-bottom: 30px;}}.column {float: left;width: 33.3%;padding: 10px 10px;}.card {box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);padding: 16px;text-align: right;background-color: #ddd;align:right;}</style><div style='width:100%' style='margin-left:100px;'><div class='row'><div class='column'><div class='card bg-success'><table width='100%'><tr width='100%'><td width='40%' align='left'><i class='fa fa-credit-card fa-3x' aria-hidden='true' style='color:orange;text-align:left;'></i></td><td width='60%'><font style='font-size:12px;'>Total Credit Limit </font><h4>" + total_credit_limit + "</h4></td></tr></table></div></div><div class='column'><div class='card bg-success'><table width='100%'><tr width='100%'><td width='20%' align='left'><i class='fa fa-money fa-3x' aria-hidden='true' style='color:brown;text-align:left;'></i></td><td width='80%'><font style='font-size:12px;'>Total Funds Claimed</font><h4>" + total_funds_claimed + "</h4></td></tr></table></div></div><div class='column'><div class='card bg-success'><table width='100%'><tr width='100%'><td width='40%' align='left'><i class='fa fa-credit-card fa-3x' aria-hidden='true' style='color:green;text-align:left;'></i></td><td width='60%'><font style='font-size:12px;'>Total Credit Available</font><h4>" + total_credit_available + "</h4></td></tr></table></div></div><br><br><br><br><div class='column'><div class='card bg-success'><table width='100%'><tr width='100%'><td width='20%' align='left'><i class='fa fa-credit-card fa-3x' aria-hidden='true' style='color:orange;text-align:left;'></i></td><td width='80%'><font style='font-size:12px;'>Total Invoices Available For Funding</font><h4>" + total_invoices_available_for_funding + "</h4></td></tr></table></div></div><div class= 'column'><div class='card bg-success'><table width='100%'><tr width='100%'><td width='20%' align='left'><i class='fa fa-usd fa-3x' aria-hidden='true' style='color:green;text-align:left;'></i></td><td width='80%'><font style='font-size:12px;'>Total Funding Amount Available For Funding</font><h4>" + total_financing_amount_available_for_funding + "</h4></td></tr></table></div></div><div class='column'><div class='card bg-success'><table width='100%'><tr width='100%'><td width='20%' align='left'><i class='fa fa-usd fa-3x' aria-hidden='true' style='color:green;text-align:left;'></i></td><td width='80%'><font style='font-size:12px;'>Today's Claim </font><h4><div class='todays-claims'>" + today_claim + "</div></h4></td></tr></table></div></div></div></div>").appendTo('.page-form')




}
