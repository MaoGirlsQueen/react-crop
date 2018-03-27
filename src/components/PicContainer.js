import React from 'react'
import './PicContainer.less'
import Crop from './Crop'

class PicContainter extends React.Component {
    state = {
        height: 150,
        width: 300,
        img: '',
        fileType: '',
        cropImgUrl: ''
    }
    fileEvent = {
        onChange: (e) => {
            if (!e.target.files || e.target.files.length <= 0) {

            }
            //获取图片
            const file = e.target.files[0];
            if (file.type.split("/")[0] !== 'image') {
                console.log('不是图片')
            }
            this.setState({
                fileType: file.type
            })
            this.file2Base64(file)
        }
    }
    file2Base64 = (file) => {
        if (!this.reader) {
            this.reader = new FileReader(file);
            this.reader.onload = (e) => {
                let base64 = e.target.result;
                let img = new Image();
                img.src = base64;
                img.onload = () => {
                    this.setState({
                        img
                    })
                }

            }
        }
        this.reader.readAsDataURL(file);

    }
    componentWillUnmount() {
        this.reader = null;
    }
    render() {
        const { style } = this.props;
        const { height, width } = this.state;
        const styleString = {
            ...style,
            height,
            width
        }
        return (
            <div>
                <div className={'container'}>
                    <Crop
                        img={this.state.img}
                        getCropImgUrl={(imgUrl) => {
                            console.log('截取的图片:', imgUrl),
                                this.setState({
                                    cropImgUrl: imgUrl
                                })
                        }}
                    >
                    </Crop>
                    <div className={'addPic'}>+<input
                        type="file"
                        {...this.fileEvent} />
                    </div>
                </div>
                <img style={{marginTop:20}} src={this.state.cropImgUrl} />
            </div>
        )
    }
}
export default PicContainter;