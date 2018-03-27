import React from 'react'
import './Crop.less';

export default class Crop extends React.Component {
    static defaultProps = {
        img: null,
        maxImgWidth: 500,
        cropWidth: 300,
        cropHeight: 150,
        quality: 1,//图片压缩比例，0-1
        //getCropImgUrl
    }
    state = {
        //裁剪框起始点坐标
        x: 30,
        y: 50,
        //鼠标位置
        downX: 0,
        downY: 0,
        //step:10,//裁剪框移动像素 避免重绘次数过多
    }
    componentDidUpdate() {
        const { img } = this.props;
        if (!img) {
            return
        }
        let cvs = this.createCanvas(img, this.props.maxImgWidth);
        //绘制cvs，获取压缩后图片
        let resultImg = this.drawCanvas(cvs, img);
        resultImg.onload = () => {
            this.drawCrop(resultImg);
        }
    }
    componentWillUnmount() {
        this.cropCanvas = null;
    }
    //创建背景图
    createCanvas(img, maxWidth) {
        let cvs = document.getElementById('backCvs');
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        if (width > maxWidth) {
            height = height / (width / maxWidth);
            width = maxWidth;
        }
        cvs.width = width;
        cvs.height = height;
        return cvs;
    }
    drawCanvas(cvs, img) {
        let resultImg = new Image();
        let ctx = cvs.getContext("2d");
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cvs.width, cvs.height);
        //指定file格式，可以从fileType获取
        let base64 = cvs.toDataURL('image', this.props.quality);
        resultImg.src = base64;
        return resultImg;
    }
    cropCanvasProps = {
        id: 'cropCanvas',
        width: this.props.cropWidth,
        height: this.props.cropHeight,
        onMouseDown: (e) => {
            const { clientX, clientY } = e;
            this.setState({
                downX: clientX,
                downY: clientY
            })
            this.cropCanvas.addEventListener('mousemove', this.cropMove);
        },
        onMouseUp: (e) => {
            this.cropCanvas.removeEventListener('mousemove', this.cropMove)
        },
    }
    //裁剪框移动
    cropMove = (e) => {
        const { clientX, clientY } = e;
        const {maxImgWidth,getCropImgUrl}=this.props;
        const {width,height}=this.cropCanvas;
        console.log(width)
        const { downX, x, downY, y, step } = this.state;
        //判断超出边界  占没考虑往下，图片有滚动条
        if(x + clientX - downX+width>maxImgWidth||x + clientX - downX<0||y+clientY - downY<0)
        return;
        let imgUrl=this.cropCanvas.toDataURL('image');
        this.setState({
            downX: clientX,
            downY: clientY,
            x: x + clientX - downX,
            y: y + clientY - downY
        },()=>{getCropImgUrl&&getCropImgUrl(imgUrl)})
    }
    //绘制裁剪框
    drawCrop = (img) => {
        const { x, y } = this.state;
        let cvs=document.getElementById('cropCanvas')
        let width = cvs.width;
        let height = cvs.height;
        let cvt = cvs.getContext('2d');
        cvt.drawImage(img, x, y, width, height, 0, 0, width, height)
    }
    render() {
        const { x, y } = this.state;
        return (
            <div>
                <canvas id='backCvs'>
                </canvas>
                <canvas {...this.cropCanvasProps} ref={(node) => this.cropCanvas = node} style={{ marginLeft: x, marginTop: y }}>
                </canvas>
            </div>
        )

    }
}