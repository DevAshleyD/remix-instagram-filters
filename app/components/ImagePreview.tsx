import { useState, useEffect, useRef } from 'react';
import type { ImageStyle } from '~/utils/imageProcessing';
import { applyFilterToImage, downloadImage, revokeImageUrl } from '~/utils/imageProcessing';

interface ImagePreviewProps {
  originalImage: string;
  selectedStyle: ImageStyle;
  fileName: string;
  strength?: number;
}

export function ImagePreview({
  originalImage,
  selectedStyle,
  fileName,
  strength = 1
}: ImagePreviewProps) {
  const [processedImage, setProcessedImage] = useState<string>(originalImage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const previousProcessedUrl = useRef<string>('');

  useEffect(() => {
    let isCancelled = false;

    const processImage = async () => {
      if (selectedStyle.id === 'normal') {
        setProcessedImage(originalImage);
        return;
      }

      setIsProcessing(true);
      try {
        const processed = await applyFilterToImage(originalImage, selectedStyle.id, strength);

        if (!isCancelled) {
          // Revoke previous blob URL to prevent memory leaks
          if (previousProcessedUrl.current && previousProcessedUrl.current.startsWith('blob:')) {
            revokeImageUrl(previousProcessedUrl.current);
          }
          previousProcessedUrl.current = processed;
          setProcessedImage(processed);
        } else {
          // If cancelled, revoke the new URL
          revokeImageUrl(processed);
        }
      } catch (error) {
        console.error('Failed to process image:', error);
      } finally {
        if (!isCancelled) {
          setIsProcessing(false);
        }
      }
    };

    processImage();

    return () => {
      isCancelled = true;
    };
  }, [originalImage, selectedStyle, strength]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previousProcessedUrl.current && previousProcessedUrl.current.startsWith('blob:')) {
        revokeImageUrl(previousProcessedUrl.current);
      }
    };
  }, []);

  const handleDownload = () => {
    const extension = fileName.split('.').pop() || 'jpg';
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const strengthSuffix = strength < 1 ? `_${Math.round(strength * 100)}` : '';
    const newFileName = `${baseName}_${selectedStyle.id}${strengthSuffix}.${extension}`;
    downloadImage(processedImage, newFileName);
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">미리보기</h2>
            {selectedStyle.id !== 'normal' && (
              <p className="text-sm text-gray-500 mt-1">
                {selectedStyle.nameKo} ({Math.round(strength * 100)}% 강도)
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {showComparison ? '단일 보기' : '비교 보기'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              다운로드
            </button>
          </div>
        </div>

        <div className="relative overflow-auto max-h-[80vh]">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">필터 적용 중...</p>
                <p className="text-sm text-gray-400 mt-1">{selectedStyle.nameKo}</p>
              </div>
            </div>
          )}

          {showComparison ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="overflow-auto">
                <div className="flex items-center gap-2 mb-2 sticky top-0 bg-white py-1 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                    원본
                  </span>
                </div>
                <div className="flex justify-center bg-gray-50 rounded-lg p-2">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full h-auto rounded-lg shadow-md object-contain"
                    style={{ maxHeight: '65vh' }}
                  />
                </div>
              </div>
              <div className="overflow-auto">
                <div className="flex items-center gap-2 mb-2 sticky top-0 bg-white py-1 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                    {selectedStyle.nameKo}
                  </span>
                  {strength < 1 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {Math.round(strength * 100)}%
                    </span>
                  )}
                </div>
                <div className="flex justify-center bg-gray-50 rounded-lg p-2">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="max-w-full h-auto rounded-lg shadow-md object-contain"
                    style={{ maxHeight: '65vh' }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex justify-center bg-gray-50 rounded-lg p-2">
              <img
                src={processedImage}
                alt="Preview"
                className="max-w-full h-auto rounded-lg shadow-md object-contain"
                style={{ maxHeight: '75vh' }}
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                  {selectedStyle.nameKo}
                </span>
                {strength < 1 && selectedStyle.id !== 'normal' && (
                  <span className="bg-purple-600/90 text-white px-2.5 py-1.5 rounded-full text-xs font-medium shadow-lg">
                    {Math.round(strength * 100)}%
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedStyle.id !== 'normal' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {selectedStyle.nameKo}
                  <span className="ml-2 text-sm font-normal text-gray-500">({selectedStyle.name})</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{selectedStyle.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
