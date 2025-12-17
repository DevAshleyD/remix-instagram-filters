import { useState, useCallback } from 'react';
import type { MetaFunction } from "@remix-run/node";
import { ImageUploader } from '~/components/ImageUploader';
import { StyleSelector } from '~/components/StyleSelector';
import { ImagePreview } from '~/components/ImagePreview';
import { imageStyles } from '~/utils/imageProcessing';

export const meta: MetaFunction = () => {
  return [
    { title: "Photo Style - Convert photo style" },
    { name: "description", content: "40+ Instagram Transform your photos with style filters" },
  ];
};

export default function Index() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [filterStrength, setFilterStrength] = useState(1);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setFileName('');
    setSelectedStyle(imageStyles[0]);
    setFilterStrength(1);
  };

  const handleStrengthChange = useCallback((strength: number) => {
    setFilterStrength(strength);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* security notification banner */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>100% Browser-based processing</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <span>No image storage on server</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span>DB No use</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-lg">🔐</span>
            <span>Complete privacy guaranteed</span>
          </div>
        </div>
      </div>

      {/* header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Photo Style
                </h1>
                <p className="text-xs text-gray-500">40+ Instagram Filters</p>
              </div>
            </div>
            {uploadedImage && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                new image
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedImage ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Apply cool styles to your photos
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                40+ Instagram You can transform your photos with style filters.
              </p>
            </div>

            {/* 보안 안내 카드 */}
            <div className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">Complete privacy protection</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      All image processing is done exclusively in the browser.
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Images are not sent or stored on the server.
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Doesn't use a database
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <ImageUploader onImageUpload={handleImageUpload} />

            {/* 기능 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
              <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">easy upload</h3>
                <p className="text-sm text-gray-600">Upload images easily with drag and drop</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">40+ styles</h3>
                <p className="text-sm text-gray-600">Instagram Style filters and intensity control</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Instant download</h3>
                <p className="text-sm text-gray-600">Save edited images with one click</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 스타일 선택 */}
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={setSelectedStyle}
              previewImage={uploadedImage}
              onStrengthChange={handleStrengthChange}
            />

            {/* 이미지 미리보기 */}
            <ImagePreview
              originalImage={uploadedImage}
              selectedStyle={selectedStyle}
              fileName={fileName}
              strength={filterStrength}
            />
          </div>
        )}
      </main>

      {/* footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Privacy Policy Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy Policy
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔒</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">local processing</h4>
                <p>All image conversions are processed solely in the user's browser and are not sent to external servers.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🛡️</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Data not collected</h4>
                <p>We do not collect or store any data, including images, personal information, or usage history.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">✅</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">safe use</h4>
                <p>It works without a server connection, so there is no risk of hacking or data leakage.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Made with Remix & Tailwind CSS • 40+ Instagram Style Filters • 100% Privacy Guaranteed
          </p>
        </div>
      </footer>
    </div>
  );
}
