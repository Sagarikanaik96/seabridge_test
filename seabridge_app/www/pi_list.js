function myFunction(a,b){
  document.getElementById("demo").innerHTML = a * b*a;

frappe.call({
	method: 'seabridge_app.www.pi.get_invoices',
			callback: function(r) {
			}
})

}
