const {Alert} = require("./DOM-methods")
const {SVG} = require("@svgdotjs/svg.js")

let width = 350, height = 500
let totalSize = 1024
// segment : name,proNum,base,size,status
let data = [
    ["reserved",0,0,120,1],
    ["hole",0,120,60,1],
    ["data",132,165,75,1],
    ["hole",0,240,62,1],
    ["reserved",0,302,66,1],
    ["code",2,368,224,1],
    ["hole",0,592,408,1],
    ["code",2,500,500,0],
]
height = Math.max(height,24*totalSize/Math.min(...data.map(e => e[3])))
console.log(height)

const frame = (draw,w,h,poffset,strk) => {
    draw.rect(w-2*strk,h).fill('none').move(poffset+strk,strk).stroke({ color: '#333', width: strk}).radius(5)
}
const segment = (draw,w,start,size,dataToPixel,poffset,strk,name,proNum,color,isConnected,fs) => {
    draw = draw.group()
    draw.attr({"class":"seg","data-process":proNum,"cursor":"pointer"})
    let startText = start.toString(), endText = (start+size).toString()
    start = start/dataToPixel
    size = size/dataToPixel
    fs =  Math.min(fs || 24,size/2)
    //chunk rectangle
    draw.rect(w-2*strk,size).move(poffset+strk,start+strk).fill(color)
    //name text
    let text = draw.text(name).font({ fill: '#eee',size: fs, family: 'Arial' }).center(poffset+w/2,start+strk+(size)/2)
    //base text
    if(isConnected) draw.text(startText).font({ fill: '#333',size: 12, family: 'Arial' }).x(poffset+w+4).cy(start+3/2*strk)
    //end text
    draw.text(endText).font({ fill: '#333',size: 12, family: 'Arial' }).x(poffset+w+4).cy(start+size+strk)
    //process name data
    draw.on('mouseenter',() => {
        let pw = 90,ph = 36
        let processDataRect = draw.rect(pw,ph).cy(start+strk+size/2).fill("#333").radius(6).stroke({ color: '#555', width: strk/2}).attr({"opacity":"0"})
        processDataRect.animate(400).attr({"opacity":"1"})
        let processDataArrow = draw.polyline(`${pw+strk},${start+strk+size/2} ${pw},${start+strk+(size-ph/2)/2} ${pw},${start+strk+(size+ph/2)/2}`)
        .fill("#555").attr({"opacity":"0"})
        processDataArrow.animate(400).attr({"opacity":"1"})
        let processDataText = draw.text(`process ${proNum}`).font({ fill: '#eee',size: 12, family: 'Arial' }).cx(ph+strk).cy(start+strk+size/2).attr({"opacity":"0"})
        processDataText.animate(400).attr({"opacity":"1"})
        draw.on('mouseleave',() => {processDataRect.remove();processDataText.remove();processDataArrow.remove()})
        // let processDataRect = draw.rect(pw,ph).x(w+strk).cy(start+strk+size/2).fill("#333").radius(6).stroke({ color: '#555', width: strk/2}).attr({"opacity":"0"})
        // processDataRect.animate(400).attr({"opacity":"1"})
        // let processDataArrow = draw.polyline(`${w},${start+strk+size/2} ${w+strk},${start+strk+(size-ph/2)/2} ${w+strk},${start+strk+(size+ph/2)/2}`)
        // .fill("#555").attr({"opacity":"0"})
        // processDataArrow.animate(400).attr({"opacity":"1"})
        // let processDataText = draw.text(`process ${proNum}`).font({ fill: '#eee',size: 12, family: 'Arial' }).x(w+strk+ph/2).cy(start+strk+size/2).attr({"opacity":"0"})
        // processDataText.animate(400).attr({"opacity":"1"})
        // draw.on('mouseleave',() => {processDataRect.remove();processDataText.remove();processDataArrow.remove()})
    })
}
const memory = (width,height,totalSize,data) => {
    let color = ["#444","#36c"], isConnectedFlag = 1, strk = 6, dataToPixel = totalSize/height, poffset = 100
    let draw = SVG().addTo('#gui-svg').size(width,height+2*strk)
    
    data.forEach(element => {
        if(element[0] != 'hole' && element[element.length-1]){
            segment(draw,width-poffset-50,
                element[2],element[3],dataToPixel,poffset,
                strk,element[0],element[1],
                color[element[1]!=0?1:0],isConnectedFlag);
                isConnectedFlag = 0
            }else{
                isConnectedFlag = 1
                if(element[element.length-1] == 0){
                    Alert(`Process ${element[1]} is on pending`,"#gui .col-sm-4")
                }
            }
        })
        frame(draw,width-poffset-50,height,poffset,strk)
}

memory(width,height,totalSize,data)