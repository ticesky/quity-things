// 一个绘画版demo
import { Button } from "antd"
import { useEffect, useRef } from "react"
import './index.css'

type DrawType = 'huabi' | 'rect' | 'arc'
type DrawFnType = (ctx: CanvasRenderingContext2D, x: number, y: number, type: 'huabi' | 'rect' | 'arc') => void;

function Entry1() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>();
    const canvasCtxRef = useRef<CanvasRenderingContext2D>();
    const isDrawRef = useRef<boolean>(false);
    const typeRef = useRef<DrawType>('huabi');
    const beginXYRef = useRef({ X: 0, Y: 0 });
    const colorRef = useRef('#000')
    const imageDataRef = useRef<ImageData>();
    const canvasMoveFn = useRef<(e: MouseEvent) => void>(() => { })
    canvasMoveFn.current = canvasMove

    useEffect(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 400
        canvas.style.border = '1px solid black'
        canvasRef.current = canvas;
        canvas.addEventListener('mousedown', canvasDown)
        canvas.addEventListener('mousemove', canvasMoveFn.current)
        canvas.addEventListener('mouseup', canvasUp)
        const ctx = canvas.getContext('2d')
        if (!ctx || !containerRef.current) {
            return
        }
        canvasCtxRef.current = ctx
        containerRef.current.appendChild(canvas);
    }, [])

    function changeType(type: 'huabi' | 'rect' | 'arc') {
        return () => typeRef.current = type;
    }

    function canvasDown(e: MouseEvent) {
        isDrawRef.current = true;
        beginXYRef.current = {
            X: e.pageX - canvasRef.current?.offsetLeft!,
            Y: e.pageY - canvasRef.current?.offsetTop!
        }
    }

    function canvasMove(e: MouseEvent) {
        if (!isDrawRef.current || !canvasCtxRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvasCtxRef.current;
        const x = e.pageX - canvas.offsetLeft;
        const y = e.pageY - canvas.offsetTop;
        if (typeRef.current === 'huabi') {
            huabiFn(ctx, x, y, typeRef.current)
        } else {
            drawFn(ctx, x, y, typeRef.current)
        }
    }

    function canvasUp() {
        imageDataRef.current = canvasCtxRef.current?.getImageData(0, 0, 800, 400);
        isDrawRef.current = false;
    }

    const huabiFn: DrawFnType = (ctx, x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = colorRef.current;
        ctx.fill();
        ctx.closePath();
    }

    const drawFn: DrawFnType = (ctx, x, y, type) => {
        const beginX = beginXYRef.current.X;
        const beginY = beginXYRef.current.Y;
        ctx.clearRect(0, 0, 800, 400);
        imageDataRef.current && ctx.putImageData(imageDataRef.current, 0, 0, 0, 0, 800, 400);
        ctx.beginPath();
        ctx.strokeStyle = colorRef.current;
        if (type === 'rect') {
            ctx.rect(beginX, beginY, x - beginX, y - beginY);
        } else {
            ctx.arc(
                beginX,
                beginY,
                Math.round(
                    Math.sqrt((x - beginX) * (x - beginX) + (y - beginY) * (y - beginY))
                ),
                0,
                2 * Math.PI
            );
        }
        ctx.stroke();
        ctx.closePath();
    }

    function saveImg() {
        if (!canvasRef.current) return
        const url = canvasRef.current.toDataURL();
        const a = document.createElement("a");
        a.download = "sunshine";
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function clear() {
        imageDataRef.current = undefined
        canvasCtxRef.current?.clearRect(0, 0, 800, 400)
    }

    return <>
        <div className="utils-bar">
            <Button type="primary" onClick={changeType('huabi')}>画笔</Button>
            <Button type="primary" onClick={changeType('rect')}>正方形</Button>
            <Button type="primary" onClick={changeType('arc')}>圆形</Button>
            颜色：
            <Button onClick={clear} >清空</Button>
            <Button onClick={saveImg}>保存</Button>
        </div>
        <div ref={containerRef} />
    </>
}

export default Entry1
