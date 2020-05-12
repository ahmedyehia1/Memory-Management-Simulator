// const {Alert} = require("./DOM-methods")
const {SVG} = require("@svgdotjs/svg.js")
// const {memory} = require("./Event-handlers")

const frame = (draw,w,h,poffset,strk) => {
    draw.rect(w-2*strk,h).fill('none').move(poffset+strk,strk).stroke({ color: '#333', width: strk}).radius(5)
}
const segment = (draw,w,start,size,dataToPixel,poffset,strk,name,proNum,color,isConnected,fs) => {
    draw = draw.group()
    draw.attr({"class":name,"data-process":proNum,"cursor":"pointer","onclick":"handleRemoveSeg(event)"})
    let startText = start.toString(), endText = (start+size).toString()
    start = start/dataToPixel
    size = size/dataToPixel
    fs =  Math.min(fs || 24,size/2)
    //chunk rectangle
    draw.rect(w-2*strk,size).move(poffset+strk,start+strk).fill(color).stroke({"color":"#333","width":1})
    //name text
    let text = draw.text(name).font({ fill: '#eee',size: fs, family: 'Arial' }).x(poffset+w/2-name.length*fs/4).y(start+strk+(size)/2-fs/4)
    //base text
    if(isConnected) draw.text(startText).font({ fill: '#333',size: 12, family: 'Arial' }).x(poffset+w+4).y(start+3/2*strk)
    //end text
    draw.text(endText).font({ fill: '#333',size: 12, family: 'Arial' }).x(poffset+w+4).y(start+size+strk)
    //process name data
    if(name != "Reserved"){
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
        })
    }
}

exports.memorySVG = (width,height,totalSize,data) => {
    let color = ["#444","#36c"], isConnectedFlag = 1, strk = 6, dataToPixel = totalSize/height, poffset = 100
    let draw = SVG().addTo('#gui-svg').size(width,height+2*strk)
    
    data.forEach(element => {
        if(element["name"].toUpperCase() != 'HOLE' && element["status"]){
            segment(draw,width-poffset-50,
                element["base"],element["size"],dataToPixel,poffset,
                strk,element["name"],element["process_no"],
                color[element["name"]!="Reserved"?1:0],isConnectedFlag);
                isConnectedFlag = 0
            }else{
                isConnectedFlag = 1
            }
        })
        frame(draw,width-poffset-50,height,poffset,strk)
}