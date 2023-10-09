function draw() {
    const container = document.getElementById('demo')
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 100
    const ctx = canvas.getContext('2d')

    if (!container || !ctx) return

    // 填充的颜色
    ctx.fillStyle = 'darkgray'
    // 填充矩形 fillRect(起始X,起始Y,终点X,终点Y)
    ctx.fillRect(0, 0, 400, 100)
    ctx.fillStyle = '#fff'
    // 绘制填充文字
    ctx.fillText('刮刮卡', 180, 50)

    let isDraw = false
    canvas.onmousedown = function () {
        isDraw = true
    }
    canvas.onmousemove = function (e) {
        if (!isDraw) return
        // 计算鼠标在canvas里的位置
        const x = e.pageX - canvas.offsetLeft
        const y = e.pageY - canvas.offsetTop
        // 设置globalCompositeOperation
        ctx.globalCompositeOperation = 'destination-out'
        // 画圆
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        // 填充圆形
        ctx.fill()
    }
    canvas.onmouseup = function () {
        isDraw = false
    }

    container.appendChild(canvas);
}

draw()