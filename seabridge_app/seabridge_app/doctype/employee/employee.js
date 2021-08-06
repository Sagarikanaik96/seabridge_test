// Copyright (c) 2020, seabridge_app and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee', {
before_save:function(frm,cdt,cdn){
var saved_doc=0
var reports_to=""
if(frm.doc.__islocal==1){saved_doc=0}
else{saved_doc=1}
if(frm.doc.reports_to){reports_to=frm.doc.reports_to}
if(frm.doc.user_id){
frappe.call({
method:"seabridge_app.seabridge_app.doctype.employee.employee.create_permissions",
args:{
reports_to:reports_to,
user_id:frm.doc.user_id,
saved_doc:saved_doc,
name:frm.doc.name
},
async:false,
callback: function(r){
}
});
}
} ,
user_id:function(frm,cd,cdn){
if(frm.doc.user_id && frm.doc.company){
update_filter(frm)
}
},
refresh:function(frm,cd,cdn){
if(frm.doc.user_id && frm.doc.company){
update_filter(frm)
}
}
})

function update_filter(frm){
var employee=[]
frappe.call({
method:"seabridge_app.seabridge_app.doctype.employee.employee.get_reports_to_filter",
args:{
user:frm.doc.user_id,
company:frm.doc.company
},
async:false,
callback: function(r){
console.log(r)
for(var i=0; i<r.message.length; i++){
employee.push(r.message[i]);
}
}
});
frm.set_query("reports_to", function() {
return {
filters: {
name:["in",employee]
}
};
});
}
