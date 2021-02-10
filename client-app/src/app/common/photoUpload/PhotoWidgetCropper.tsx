import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface IProps {
    setImage: (file: Blob) => void;
    imagePreview: string;
}

const PhotoWidgetCropper: React.FC<IProps> = ({ setImage, imagePreview }) => {

    const cropper = useRef<Cropper>(null);

    const cropImage = () => {
        if (cropper.current && typeof (cropper.current as any).cropper.getCroppedCanvas === 'undefined') {
            return;
        }
        if (cropper && cropper.current) {
            (cropper.current as any).cropper.getCroppedCanvas().toBlob((blob:any) => {
                setImage(blob as Blob);
            }, 'image/jpeg');
        }
    }

    return (
        <Cropper
            ref={cropper as any}
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            preview='.img-preview'
            guides={false}
            aspectRatio={1 / 1}
            viewMode={1}
            dragMode='move'
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            crop={cropImage}
        />
    )
}

export default PhotoWidgetCropper
