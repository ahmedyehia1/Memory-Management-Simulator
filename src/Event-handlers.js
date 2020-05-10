const {AddHoleData,clearHolesData} = require("./DOM-methods.js");

let units = {
    "Byte": 1,
    "KB": Math.pow(2,10),
    "MB": Math.pow(2,20),
    "GB": Math.pow(2,30)
}

$("#memory-unit-holes-dropdown .dropdown-item").click(e => $("#memory-unit-holes-data").text(e.target.innerHTML))
$("#dropdown-menu-process .dropdown-item").click(e => $("#memory-unit-process-data").text(e.target.innerHTML))
$("#add-holes").click(() => AddHoleData("#holes-data"))
$("#clear-all-holes").click(() => {
    clearHolesData();
    AddHoleData("#holes-data");
})
$("#start-holes").click(() => {
    let Holes = Object.values($(".hole-data-field")).slice(0,-2);
    let HL=Holes.length;
    let unit = units[$("#memory-unit-holes-data").text()];
    let totalSize = Number($(".total-size-data-field").val())*unit;
    for(let i=0;i<HL;i+=2)
        Holes.push([Number(Holes[i].value)*unit,Number(Holes[i+1].value)*unit])
    Holes = Holes.slice(-HL/2)
    console.log(totalSize,Holes)
    $("#gui-tab").click()
})
$("body").keydown(k => {
    if(k.key == "+"){
        if(Object.values($("#start")[0].classList).find(e => e == "show"))
            AddHoleData("#holes-data")
    }
})
$("#add-segment").click(() => {
    $("#segment-data").append(`
    <div class="row my-2 d-flex align-items-center justify-content-center">
        <div class="col-sm-5 px-1">
            <input type="text" class="form-control segment-name" placeholder="Seg name">
        </div>
        <div class="col-sm-5 px-1">
            <input type="text" class="form-control segment-size" placeholder="Seg size">
        </div>
        <a class="col-sm-1 delete-segment-data" href="#" onclick="removeDataField(event)">&#9747;</a>
    </div>
    `)
})
$("#add-process").click(() => {
    let segName = Object.values($(".segment-name")).slice(0,-2);
    let segSize = Object.values($(".segment-size")).slice(0,-2);
    let L=segName.length,Process = [];
    let unit = units[$("#memory-unit-process-data").text()];
    for(let i=0;i<L;i++)
        Process.push([segName[i].value,Number(segSize[i].value)*unit,Number($("#process-num").text().slice(8))])
    let algorithm = Object.values($(".form-check-input")).slice(0,-2).findIndex(e => e.checked)
    console.log(Process,algorithm)
})