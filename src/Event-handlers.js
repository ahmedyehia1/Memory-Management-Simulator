const {AddHoleData,clearHolesData,Alert} = require("./DOM-methods.js")
const {MemoryJS} = require("./addon.node")
const {memorySVG} = require("./SVG-core.js")
let memory;
let width = 350, height = 500, totalSize, data
    
let units = {
    "Byte": 1,
    "KB": Math.pow(2,10),
    "MB": Math.pow(2,20),
    "GB": Math.pow(2,30)
}

//unit dropdowns
$("#memory-unit-holes-dropdown .dropdown-item").click(e => $("#memory-unit-holes-data").text(e.target.innerHTML))
$("#dropdown-menu-process .dropdown-item").click(e => $("#memory-unit-process-data").text(e.target.innerHTML))
//holes events
$("#add-holes").click(() => AddHoleData("#holes-data"))
$("#clear-all-holes").click(() => {
    clearHolesData();
    AddHoleData("#holes-data");
})
$("#start-holes").click(() => {
    let Holes = Object.values($(".hole-data-field")).slice(0,-2);
    let HL=Holes.length;
    let unit = units[$("#memory-unit-holes-data").text()],start,end;
    totalSize = Number($(".total-size-data-field").val())*unit;
    for(let i=0;i<HL;i+=2){
        start = Number(Holes[i].value)*unit
        end = Number(Holes[i+1].value)*unit
        if($("#memory-unit-holes-data").text() == "Byte"){
            start = Math.ceil(start)
            end = Math.ceil(end)
        }
        Holes.push([start,end])
    }
    Holes = Holes.slice(-HL/2)
    memory = new MemoryJS(totalSize,Holes);
    data = memory.create_layout();
    // console.log(data)
    data = Object.values(data);
    height = Math.max(height,24*totalSize/Math.min(...data.map(e => e["size"])));
    $("#gui-svg").empty();
    data.sort((a,b) => {if(a.base > b.base) return 1;if(a.base < b.base) return -1;})
    memorySVG(width,height,totalSize,data)
    $("#gui-tab").click()
})
$("body").keydown(k => {
    if(k.key == "+"){
        if(Object.values($("#start")[0].classList).find(e => e == "show"))
            AddHoleData("#holes-data")
    }
})
//processes events
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
    let proNum = Number($("#process-num").text().slice(8));
    let unit = units[$("#memory-unit-process-data").text()];
    for(let i=0;i<L;i++)
        Process.push({"name":segName[i].value,"size":Number(segSize[i].value)*unit,"process_no":proNum})
    let algorithm = Object.values($(".fit-data")).slice(0,-2).findIndex(e => e.checked)
    Process = memory[["First_fit","Best_fit"][algorithm]](Process);
    $("#gui-svg").empty();
    Process = Object.values(Process);
    Process.sort((a,b) => {if(a.base > b.base) return 1;if(a.base < b.base) return -1;})
    memorySVG(width,height,totalSize,Process)
    //append to process tables
    let processSeg = []
    processSeg = Process.filter(e => {
        if(e.name != "Hole" && e.name != "Reserved") return e
    })
    console.log(Process)
    let processTable = new Array(proNum)
    processTable.fill([])
    processSeg.map(e => {processTable[e.process_no-1] = [...processTable[e.process_no-1],e]})
    if(memory.get_status(proNum)){
        $("#process-num").text(`Process ${proNum+1}`)
        $(".segment-name").removeAttr("disabled")
        $(".segment-size").removeAttr("disabled")
        $(".delete-segment-data").removeAttr("disabled")
        $("#add-segment").removeAttr("disabled")
        $("#memory-unit-process-data").removeAttr("disabled")
        $(".fit-data").removeAttr("disabled")
        $("#accordion").empty();
        processTable.map(pro => {
        $("#accordion").append(`
        <div class="card">
            <div class="card-header" id="headingProcTable${pro[0].process_no}">
            <h5 class="mb-0">
                <button class="btn btn-link" data-toggle="collapse" data-target="#collapseProcTable${pro[0].process_no}" aria-expanded="true" aria-controls="collapseProcTable${pro[0].process_no}">
                process ${pro[0].process_no}
                </button>
            </h5>
            </div>
            <div id="collapseProcTable${pro[0].process_no}" class="collapse" aria-labelledby="headingProcTable${pro[0].process_no}" data-parent="#accordion">
            <div class="card-body">
                <table class="table table-hover table-dark">
                <thead>
                    <tr>
                    <th scope="col">name</th> <th scope="col">base</th> <th scope="col">size</th>
                    </tr>
                </thead>
                <tbody>
                ${pro.map(seg => {
                    return `
                    <tr>
                    <td>${seg.name}</td> <td>${seg.base}</td> <td>${seg.size}</td>
                    </tr>`
                })}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        `)
        })
        $("#gui .card-body .alert").fadeOut(500,() => $(this).remove())
    }
    else{
        Alert(`Process ${proNum} is on pending Please remove allocated segment(s)`,"#gui .card-body")
        $(".segment-name").attr("disabled","disabled")
        $(".segment-size").attr("disabled","disabled")
        $(".delete-segment-data").attr("disabled","disabled")
        $("#add-segment").attr("disabled","disabled")
        $("#memory-unit-process-data").attr("disabled","disabled")
        $(".fit-data").attr("disabled","disabled")
    }
    proNum++
    data = Process
})

// $(".Reserved").click(() => {
//     console.log($(this).class())
// })

exports.handleRemoveSeg = e => {
    // console.log("before remove",data)
    e.path[1].remove()
    data = Object.values(memory.remove(e.path[1].classList[0],e.path[1].getAttribute("data-process")))
    // console.log("after remove",data)
    $("#gui-svg").empty();
    data.sort((a,b) => {if(a.base > b.base) return 1;if(a.base < b.base) return -1;})
    memorySVG(width,height,totalSize,data)
    let memoryArr = Object.values(memory.get_Process()).map(m => {
        return Object.values(m);
    }).slice(1)
    console.log(memoryArr)
    $("#accordion").empty();
    memoryArr.map(pro => {
    $("#accordion").append(`
    <div class="card">
        <div class="card-header" id="headingProcTable${pro[0].process_no}">
        <h5 class="mb-0">
            <button class="btn btn-link" data-toggle="collapse" data-target="#collapseProcTable${pro[0].process_no}" aria-expanded="true" aria-controls="collapseProcTable${pro[0].process_no}">
            process ${pro[0].process_no}
            </button>
        </h5>
        </div>
        <div id="collapseProcTable${pro[0].process_no}" class="collapse" aria-labelledby="headingProcTable${pro[0].process_no}" data-parent="#accordion">
        <div class="card-body">
            <table class="table table-hover table-dark">
            <thead>
                <tr>
                <th scope="col">name</th> <th scope="col">base</th> <th scope="col">size</th>
                </tr>
            </thead>
            <tbody>
            ${pro.map(seg => {
                return `
                <tr>
                <td>${seg.name}</td> <td>${seg.base}</td> <td>${seg.size}</td>
                </tr>`
            })}
            </tbody>
            </table>
        </div>
        </div>
    </div>`)
    })
}