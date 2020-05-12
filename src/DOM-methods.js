exports.AddHoleData = selector => {
    $(selector).append($(`<div class="hole-data p-1 d-flex justify-content-around align-items-center">
    <div class="col-sm-4">
    <input type="text" class="form-control hole-data-field" placeholder="base" onkeyup="holeDataCheck(event)">
</div>
<div class="col-sm-4">
<input type="text" class="form-control hole-data-field" placeholder="size" onkeyup="holeDataCheck(event)">
</div>
<a class="mx-3 delete-hole-data" onclick="removeDataField(event)" href="#">&#9747;</a>
    </div>`))
}
exports.removeDataField = e => e.path[1].remove()
exports.clearHolesData = () => $("#holes-data").empty(":first")
exports.holeDataCheck = (e) => {
    let target = e.keyCode;
    if(target == 107) e.target.value = e.target.value.slice(0,-1);
    if(target >= 65 && target <= 90){
        exports.Alert("Please type Numbers only","#start",1000)
    }
}
exports.Alert = (msg,parent,time) => {
    let alert = $(`
        <div class="alert alert-warning col-sm-8 mx-auto text-center" role="alert">
            ${msg}
        </div>
        `);
        $(parent).append(alert);
        if(time != undefined)
            alert.delay(1000).fadeOut(200,() => {
                $(this).remove()
            })
}