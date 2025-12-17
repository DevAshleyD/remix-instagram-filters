import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  imageStyles,
  filterCategories,
  generateFilterThumbnail,
  type ImageStyle
} from '~/utils/imageProcessing';

interface StyleSelectorProps {
  selectedStyle: ImageStyle;
  onStyleSelect: (style: ImageStyle) => void;
  previewImage?: string;
  onStrengthChange?: (strength: number) => void;
}

type CategoryKey = keyof typeof filterCategories;

export function StyleSelector({
  selectedStyle,
  onStyleSelect,
  previewImage,
  onStrengthChange
}: StyleSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [strength, setStrength] = useState(100);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

  // Filter styles by category
  const filteredStyles = useMemo(() => {
    if (selectedCategory === 'all') return imageStyles;
    return imageStyles.filter(style => style.category === selectedCategory);
  }, [selectedCategory]);

  // Generate thumbnails when preview image changes
  useEffect(() => {
    if (!previewImage) return;

    let isCancelled = false;
    setIsGeneratingThumbnails(true);

    const generateThumbnails = async () => {
      const newThumbnails: Record<string, string> = {};

      // Generate thumbnails in batches of 6 for better performance
      const batchSize = 6;
      for (let i = 0; i < imageStyles.length; i += batchSize) {
        if (isCancelled) break;

        const batch = imageStyles.slice(i, i + batchSize);
        const promises = batch.map(async (style) => {
          try {
            const thumbnail = await generateFilterThumbnail(previewImage, style.id, 150);
            return { id: style.id, thumbnail };
          } catch (error) {
            console.error(`Failed to generate thumbnail for ${style.id}:`, error);
            return { id: style.id, thumbnail: '' };
          }
        });

        const results = await Promise.all(promises);
        results.forEach(({ id, thumbnail }) => {
          if (thumbnail) {
            newThumbnails[id] = thumbnail;
          }
        });

        if (!isCancelled) {
          setThumbnails(prev => ({ ...prev, ...newThumbnails }));
        }
      }

      setIsGeneratingThumbnails(false);
    };

    generateThumbnails();

    return () => {
      isCancelled = true;
    };
  }, [previewImage]);

  // Handle strength change
  const handleStrengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setStrength(value);
    onStrengthChange?.(value / 100);
  }, [onStrengthChange]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: imageStyles.length };
    imageStyles.forEach(style => {
      counts[style.category] = (counts[style.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      {/* Header with strength slider */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Choose a style</h2>
          <p className="text-sm text-gray-500 mt-1">
            40+ Instagram style filter ({filteredStyles.length}개 표시)
          </p>
        </div>

        {/* Strength slider */}
        {selectedStyle.id !== 'normal' && (
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              필터 강도
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={strength}
              onChange={handleStrengthChange}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-sm font-bold text-blue-600 w-10">
              {strength}%
            </span>
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          entire ({categoryCounts.all})
        </button>
        {(Object.keys(filterCategories) as CategoryKey[]).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterCategories[category].nameKo} ({categoryCounts[category] || 0})
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isGeneratingThumbnails && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span>썸네일 생성 중...</span>
        </div>
      )}

      {/* Style grid - scrollable container with fixed height */}
      <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3">
        {filteredStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${
              selectedStyle.id === style.id
                ? 'ring-4 ring-blue-500 ring-offset-2 transform scale-[1.03] shadow-lg'
                : 'hover:ring-2 hover:ring-gray-300 hover:transform hover:scale-[1.02] hover:shadow-md'
            }`}
          >
            {/* Thumbnail - larger size */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {thumbnails[style.id] ? (
                <img
                  src={thumbnails[style.id]}
                  alt={style.nameKo}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : previewImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 w-full h-full" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div
                    className="w-16 h-16 rounded-lg shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    }}
                  />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Selected indicator */}
              {selectedStyle.id === style.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Label - larger text */}
            <div className="p-2 bg-white">
              <h3 className="text-sm font-semibold text-gray-800 truncate text-center">
                {style.nameKo}
              </h3>
            </div>
          </button>
        ))}
        </div>
      </div>

      {/* Selected style info */}
      {selectedStyle.id !== 'normal' && (
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
              {thumbnails[selectedStyle.id] ? (
                <img
                  src={thumbnails[selectedStyle.id]}
                  alt={selectedStyle.nameKo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedStyle.nameKo}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({selectedStyle.name})
                </span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">{selectedStyle.description}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {filterCategories[selectedStyle.category as CategoryKey]?.nameKo || selectedStyle.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

