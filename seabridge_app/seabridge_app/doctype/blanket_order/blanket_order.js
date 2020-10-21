frappe.ui.form.on("Blanket Order", "supplier_quotation", function(frm) {

    frappe.model.with_doc("Supplier Quotation", frm.doc.supplier_quotation, function() {
        var tabletransfer= frappe.model.get_doc("Supplier Quotation", frm.doc.supplier_quotation)
        cur_frm.clear_table("items");
        $.each(tabletransfer.items, function(index, row){
            
            var d=frm.add_child("items");
            d.item_code = row.item_code;
            d.item_name = row.item_name;
            d.qty = row.qty;
            d.rate = row.rate;
            cur_frm.refresh_field("items");
        })
    })
})
