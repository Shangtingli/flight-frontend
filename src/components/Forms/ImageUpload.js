import { Upload, Icon, message } from 'antd';
import React from "react"
import {Storage} from 'aws-amplify';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

export default class ImageUpload extends React.Component {
    state = {
        loading: false,
        file: null,
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                    file: info.file.originFileObj
                }),
            );
        }
    };

    async handleUpload(userEmail){

        if (this.state.file === null){
            return "avatars/defaultAvatar.png";
        }
        const response = await Storage.put(`s3/avatars/${userEmail}-avatar.png`, this.state.file, {
            contentType: 'image/png',
        })
        return response;
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        return (
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                    {imageUrl ? <img className="avatar-real" src={imageUrl} alt="avatar" style={styles.image} /> : uploadButton}
                </Upload>
        );
    }
}

const styles = {
    image:{
        width: '100%'
    }
}
