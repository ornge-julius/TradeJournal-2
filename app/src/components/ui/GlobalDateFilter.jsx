import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Filter } from 'lucide-react';
import { useDateFilter } from '../../context/DateFilterContext';

const GlobalDateFilter = () => {
  const { filter, presets, rangeLabel, setPreset, setCustomRange } = useDateFilter();
  const [selectedPreset, setSelectedPreset] = useState(filter.preset || 'allTime');
  const [customFrom, setCustomFrom] = useState(filter.from || '');
  const [customTo, setCustomTo] = useState(filter.to || '');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setSelectedPreset(filter.preset || 'allTime');
    setCustomFrom(filter.from || '');
    setCustomTo(filter.to || '');
  }, [filter]);

  const isCustomPreset = selectedPreset === 'custom';

  const hasInvalidRange = useMemo(() => {
    if (!customFrom || !customTo) {
      return false;
    }
    return customFrom > customTo;
  }, [customFrom, customTo]);

  const handlePresetChange = (event) => {
    const value = event.target.value;
    setSelectedPreset(value);

    if (value !== 'custom') {
      setShowError(false);
      setPreset(value);
    }
  };

  const handleApplyCustom = (event) => {
    event.preventDefault();

    if (!customFrom || !customTo || hasInvalidRange) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setCustomRange({ from: customFrom, to: customTo });
  };

  const handleClear = () => {
    setSelectedPreset('allTime');
    setCustomFrom('');
    setCustomTo('');
    setShowError(false);
    setPreset('allTime');
  };

  return (
    <section
      aria-labelledby="dashboard-date-filter-heading"
      className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-400" aria-hidden="true" />
            <h2 id="dashboard-date-filter-heading" className="text-lg font-semibold text-gray-100">
              Global Date Filter
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-300">Active Range:</span>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-200 text-sm px-3 py-1 border border-blue-400/40">
              {rangeLabel}
            </span>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleApplyCustom}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex flex-col gap-2 lg:min-w-[200px]">
              <label htmlFor="dashboard-date-filter-preset" className="text-sm font-medium text-gray-300">
                Preset
              </label>
              <select
                id="dashboard-date-filter-preset"
                value={selectedPreset}
                onChange={handlePresetChange}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {presets.map((presetOption) => (
                  <option key={presetOption.value} value={presetOption.value}>
                    {presetOption.label}
                  </option>
                ))}
              </select>
            </div>

            {isCustomPreset && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="dashboard-date-filter-from" className="text-sm font-medium text-gray-300">
                    From
                  </label>
                  <input
                    id="dashboard-date-filter-from"
                    type="date"
                    value={customFrom}
                    onChange={(event) => setCustomFrom(event.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="dashboard-date-filter-to" className="text-sm font-medium text-gray-300">
                    To
                  </label>
                  <input
                    id="dashboard-date-filter-to"
                    type="date"
                    value={customTo}
                    onChange={(event) => setCustomTo(event.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3 pb-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!customFrom || !customTo || hasInvalidRange}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>

          {!isCustomPreset && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Choose a preset to instantly update the dashboard. Custom ranges can be set using the controls above.
              </p>
              {!['allTime', 'custom'].includes(selectedPreset) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-blue-300 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  Reset to All Time
                </button>
              )}
            </div>
          )}

          {isCustomPreset && showError && (
            <p role="alert" className="text-sm text-red-400">
              Please select a valid start and end date. The start date must be on or before the end date.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default GlobalDateFilter;
