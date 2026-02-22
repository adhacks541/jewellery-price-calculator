import React, { useState } from 'react';

const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="gallery-container">
            <div className="gallery-main">
                <img src={selectedImage} alt="Product Main" />
            </div>
            {images.length > 1 && (
                <div className="gallery-thumbs">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`thumb ${selectedImage === img ? 'active' : ''}`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img} alt={`Thumbnail ${index + 1}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
