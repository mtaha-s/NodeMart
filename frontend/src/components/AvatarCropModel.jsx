import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function AvatarCropModal({ image, onCancel, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-linear-to-r from-[#49AD5E] to-[#2B9CCF] rounded-xl p-6 w-125 relative">

        <h2 className="text-white text-lg mb-4">
          Crop your new profile picture
        </h2>

        <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onCropComplete(croppedAreaPixels)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Set new profile picture
          </button>
        </div>
      </div>
    </div>
  );
}