const { createCanvas, Image } = require('bindings')('canvas');
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');
const img = new Image()
const img2 = new Image()

img.onload = () => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, 100, 100);
    img2.onerror = err => {
        console.log(err)
    }
    img2.onload = () => {
        ctx.drawImage(img2, 150, 150, 100, 100);
        canvas.createPNG("image");
    }
    img2.src = "https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super"
}
img.onerror = err => {
    console.log(err)
}
img.src = 'https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super'