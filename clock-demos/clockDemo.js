function Flipper(config) {
    // 默认配置
    this.config = {
        // 时钟模块的节点
        node: null,
        // 初始前牌文字
        frontText: '0',
        // 初始后牌文字
        backText: '1',
        // 翻转动画时间（毫秒，与翻转动画CSS 设置的animation-duration时间要一致）
        duration: 600,
    }
    // 节点的原本class，与html对应，方便后面添加/删除新的class
    this.nodeClass = {
        flip: 'flip',
        front: 'digital front number',
        back: 'digital back number'
    }
    // 覆盖默认配置
    Object.assign(this.config, config)
    // 定位前后两个牌的DOM节点
    this.frontNode = this.config.node.querySelector('.front')
    this.backNode = this.config.node.querySelector('.back')
    // 是否处于翻牌动画过程中（防止动画未完成就进入下一次翻牌）
    this.isFlipping = false
    // 初始化
    this._init()
}

Flipper.prototype = {
    constructor: Flipper,
    // 初始化
    _init: function () {
        // 设置初始牌面字符
        this._setFront(this.config.frontText)
        this._setBack(this.config.backText)
    },
    // 设置前牌文字
    _setFront: function (className) {
        this.frontNode.setAttribute('class', this.nodeClass.front + className)
    },
    // 设置后牌文字
    _setBack: function (className) {
        this.backNode.setAttribute('class', this.nodeClass.back + className)
    },
    _flip: function (type, front, back) {
        // 如果处于翻转中，则不执行
        if (this.isFlipping) {
            return false
        }
        // 设置翻转状态为true
        this.isFlipping = true
        // 设置前牌文字
        this._setFront(front)
        // 设置后牌文字
        this._setBack(back)
        // 根据传递过来的type设置翻转方向
        let flipClass = this.nodeClass.flip;
        if (type === 'down') {
            flipClass += ' down'
        } else {
            flipClass += ' up'
        }
        // 添加翻转方向和执行动画的class，执行翻转动画
        this.config.node.setAttribute('class', flipClass + ' go')
        // 根据设置的动画时间，在动画结束后，还原class并更新前牌文字
        setTimeout(() => {
            // 还原class
            this.config.node.setAttribute('class', flipClass)
            // 设置翻转状态为false
            this.isFlipping = false
            // 将前牌文字设置为当前新的数字，后牌因为被前牌挡住了，就不用设置了。
            this._setFront(back)
        }, this.config.duration)
    },
    // 下翻牌
    flipDown: function (front, back) {
        this._flip('down', front, back)
    },
    // 上翻牌
    flipUp: function (front, back) {
        this._flip('up', front, back)
    }
}

function formatDate(date, dateFormat) {
    /* 单独格式化年份，根据y的字符数量输出年份
     * 例如：yyyy => 2019
            yy => 19
            y => 9
     */
    if (/(y+)/.test(dateFormat)) {
        const $1 = dateFormat.match(/(y+)/)[1]
        dateFormat = dateFormat.replace(/(y+)/, (date.getFullYear() + '').slice(4 - $1.length));
    }
    // 格式化月、日、时、分、秒
    let o = {
        'm+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'i+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        const reg = new RegExp(`(${k})`) 
        if (reg.test(dateFormat)) {
            const $1 = dateFormat.match(reg)[1];
            // 取出对应的值
            let str = o[k] + '';
            /* 根据设置的格式，输出对应的字符
            * 例如: 早上8时，hh => 08，h => 8
            * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
            * 例如: 下午15时，hh => 15, h => 15
            */
           dateFormat = dateFormat.replace(reg, ($1.length === 1) ? str : padLeftZero(str));
        }
    }
    return dateFormat;
};

//日期时间补零
function padLeftZero(str) {
    return ('00' + str).slice(str.length);
}

function main() {
    // 定位时钟模块
    let clock = document.getElementById('clock')
    // // 定位6个翻板
    let flips = clock.querySelectorAll('.flip')
    // 定义牌板数组，用来存储6个Flipper翻板对象
    const flipObjs = []

    function loop() {
        // 获取当前时间
        let now = new Date()
        // 格式化当前时间，例如现在是20:30:10，则输出"203010"字符串
        let nowTimeStr = formatDate(now, 'hhiiss')
        // 格式化下一秒的时间
        let nextTimeStr = formatDate(new Date(now.getTime() + 1000), 'hhiiss')
        if (flipObjs.length) {
            flipObjs.forEach((flipObj, i) => {
                if (nowTimeStr[i] !== nextTimeStr[i]) {
                    flipObj.flipDown(nowTimeStr[i], nextTimeStr[i])
                }
            })
        } else {
            for (let i = 0; i < flips.length; i++) {
                // 创建6个Flipper实例，初始化并存入flipObjs
                flipObjs.push(new Flipper({
                    // 每个Flipper实例按数组顺序与翻板DOM的顺序一一对应
                    node: flips[i],
                    // 按数组顺序取时间字符串对应位置的数字
                    frontText: nowTimeStr[i],
                    backText: nextTimeStr[i]
                }))
            }
        }
        // requestAnimationFrame(loop)
    }
    loop();
    setInterval(() => loop(), [1000])
}

main()