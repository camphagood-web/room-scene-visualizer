import type { FilterOptions, ActiveFilters } from '../types'

interface GalleryFiltersProps {
  filterOptions: FilterOptions
  activeFilters: ActiveFilters
  onFilterChange?: (filters: ActiveFilters) => void
}

export function GalleryFilters({
  filterOptions,
  activeFilters,
  onFilterChange,
}: GalleryFiltersProps) {
  const handleRoomTypeToggle = (roomTypeId: string) => {
    const newRoomTypes = activeFilters.roomTypes.includes(roomTypeId)
      ? activeFilters.roomTypes.filter((id) => id !== roomTypeId)
      : [...activeFilters.roomTypes, roomTypeId]
    onFilterChange?.({ ...activeFilters, roomTypes: newRoomTypes })
  }

  const handleStyleToggle = (styleId: string) => {
    const newStyles = activeFilters.designStyles.includes(styleId)
      ? activeFilters.designStyles.filter((id) => id !== styleId)
      : [...activeFilters.designStyles, styleId]
    onFilterChange?.({ ...activeFilters, designStyles: newStyles })
  }

  const handleDateRangeChange = (dateRange: ActiveFilters['dateRange']) => {
    onFilterChange?.({ ...activeFilters, dateRange })
  }

  const hasActiveFilters =
    activeFilters.roomTypes.length > 0 ||
    activeFilters.designStyles.length > 0 ||
    activeFilters.dateRange !== 'all-time'

  const clearAllFilters = () => {
    onFilterChange?.({
      roomTypes: [],
      designStyles: [],
      dateRange: 'all-time',
    })
  }

  return (
    <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Date Range */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
            Time Period
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.dateRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => handleDateRangeChange(range.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  activeFilters.dateRange === range.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
            Room Type
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.roomTypes.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomTypeToggle(room.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  activeFilters.roomTypes.includes(room.id)
                    ? 'bg-cyan-500 dark:bg-cyan-600 text-white shadow-sm'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>

        {/* Design Styles */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
            Design Style
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.designStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleToggle(style.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  activeFilters.designStyles.includes(style.id)
                    ? 'bg-cyan-500 dark:bg-cyan-600 text-white shadow-sm'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
