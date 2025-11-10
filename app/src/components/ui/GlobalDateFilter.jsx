import React, { useEffect, useState, useRef } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useDateFilter } from '../../context/DateFilterContext';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const CalendarGrid = ({ currentMonth, currentYear, selectedStart, selectedEnd, onDateSelect }) => {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get days from previous month
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastDayOfPreviousMonth = new Date(previousYear, previousMonth + 1, 0).getDate();

  const days = [];
  // Previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = lastDayOfPreviousMonth - i;
    days.push({ day, month: previousMonth, year: previousYear, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, month: currentMonth, year: currentYear, isCurrentMonth: true });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({ day, month: nextMonth, year: nextYear, isCurrentMonth: false });
  }

  const isDateInRange = (day, month, year) => {
    if (!selectedStart || !selectedEnd) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr >= selectedStart && dateStr <= selectedEnd;
  };

  const isDateSelected = (day, month, year) => {
    if (!selectedStart && !selectedEnd) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedStart || dateStr === selectedEnd;
  };

  const handleDateClick = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  return (
    <div className="grid grid-cols-7 gap-1 mt-2">
      {DAYS_OF_WEEK.map((day) => (
        <div key={day} className="text-center text-xs text-gray-600 dark:text-gray-400 py-2">
          {day}
        </div>
      ))}
      {days.map(({ day, month, year, isCurrentMonth }, index) => {
        const inRange = isDateInRange(day, month, year);
        const isSelected = isDateSelected(day, month, year);

        return (
          <button
            key={`${year}-${month}-${day}-${index}`}
            type="button"
            onClick={() => handleDateClick(day, month, year)}
            className={`
              aspect-square flex items-center justify-center text-sm rounded transition-colors
              ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-200'}
              ${isSelected ? 'bg-emerald-500 text-white font-semibold' : ''}
              ${inRange && !isSelected ? 'bg-emerald-100 dark:bg-emerald-500/30 text-emerald-900 dark:text-white' : ''}
              ${!inRange && !isSelected && isCurrentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
            `}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

const GlobalDateFilter = ({ variant = 'default' }) => {
  const { filter, presets, setPreset, setCustomRange } = useDateFilter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(filter.preset || 'allTime');
  const [customFrom, setCustomFrom] = useState(filter.from || '');
  const [customTo, setCustomTo] = useState(filter.to || '');
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (filter.from) {
      const date = new Date(`${filter.from}T00:00:00`);
      return date.getMonth();
    }
    return new Date().getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => {
    if (filter.from) {
      const date = new Date(`${filter.from}T00:00:00`);
      return date.getFullYear();
    }
    return new Date().getFullYear();
  });
  const [selectingStart, setSelectingStart] = useState(true);
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const dropdownRef = useRef(null);
  const presetDropdownRef = useRef(null);

  useEffect(() => {
    setSelectedPreset(filter.preset || 'allTime');
    setCustomFrom(filter.from || '');
    setCustomTo(filter.to || '');
    
    if (filter.from) {
      const date = new Date(`${filter.from}T00:00:00`);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [filter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(event.target)) {
        setIsPresetOpen(false);
      }
    };

    if (isOpen || isPresetOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isPresetOpen]);

  const handlePresetChange = (value) => {
    setSelectedPreset(value);
    setIsPresetOpen(false);

    if (value !== 'custom') {
      setPreset(value);
      setIsOpen(false);
    } else {
      // Switch to custom mode
      if (!customFrom && !customTo) {
        setSelectingStart(true);
      }
    }
  };

  const handleDateSelect = (dateStr) => {
    // Always switch to custom mode when selecting dates
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
      // Initialize with current filter dates if available
      if (filter.from && !customFrom) {
        setCustomFrom(filter.from);
      }
      if (filter.to && !customTo) {
        setCustomTo(filter.to);
      }
    }

    const currentFrom = customFrom || filter.from || '';
    if (selectingStart || !currentFrom) {
      // Selecting start date
      setCustomFrom(dateStr);
      setCustomTo('');
      setSelectingStart(false);
    } else if (dateStr < currentFrom) {
      // Selected date is before start, make it the new start
      setCustomFrom(dateStr);
      setCustomTo('');
      setSelectingStart(false);
    } else {
      // Selecting end date
      setCustomTo(dateStr);
      setSelectingStart(true);
    }
  };

  // Apply custom range when both dates are set
  useEffect(() => {
    if (selectedPreset === 'custom' && customFrom && customTo) {
      setCustomRange({ from: customFrom, to: customTo });
      setIsOpen(false);
    }
  }, [customFrom, customTo, selectedPreset, setCustomRange]);


  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleFromDateClick = () => {
    // Switch to custom mode when clicking date buttons
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }
    setSelectingStart(true);
    const dateToUse = customFrom || filter.from;
    if (dateToUse) {
      const date = new Date(`${dateToUse}T00:00:00`);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  };

  const handleToDateClick = () => {
    // Switch to custom mode when clicking date buttons
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }
    setSelectingStart(false);
    const dateToUse = customTo || filter.to || customFrom || filter.from;
    if (dateToUse) {
      const date = new Date(`${dateToUse}T00:00:00`);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  };

  const currentPresetLabel = presets.find(p => p.value === selectedPreset)?.label || 'All Time';

  const isNavbarVariant = variant === 'navbar';
  const buttonAriaLabel = isNavbarVariant ? 'Open date range filter' : undefined;
  const dropdownAlignment = isNavbarVariant ? 'right-0' : 'left-0 md:left-auto md:right-0';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={buttonAriaLabel}
        aria-expanded={isOpen}
        className={`flex items-center gap-2 rounded-xl transition-colors shadow-lg hover:shadow-xl text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 ${
          isNavbarVariant
            ? 'bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700/80 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white dark:supports-[backdrop-filter]:bg-gray-800/60 border border-gray-200 dark:border-gray-700'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <Calendar className="h-4 w-4" />
        <span
          className={`text-sm font-medium ${
            isNavbarVariant ? 'hidden sm:inline' : ''
          }`}
        >
          Date range
        </span>
        {isNavbarVariant && (
          <span className="sr-only sm:hidden">Date range</span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isNavbarVariant ? 'hidden sm:block' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${dropdownAlignment} top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-4`}
        >
          {/* Preset Dropdown */}
          <div className="relative mb-4" ref={presetDropdownRef}>
            <button
              type="button"
              onClick={() => setIsPresetOpen(!isPresetOpen)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span>{currentPresetLabel}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isPresetOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isPresetOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handlePresetChange(preset.value)}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                      selectedPreset === preset.value ? 'text-emerald-600 dark:text-emerald-300' : 'text-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {selectedPreset === preset.value ? (
                      <>
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-2">{preset.label}</span>
                      </>
                    ) : (
                      <span>{preset.label}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Display */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={handleFromDateClick}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                selectingStart && selectedPreset === 'custom'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {filter.from ? formatDisplayDate(filter.from) : 'Start date'}
            </button>
            <button
              type="button"
              onClick={handleToDateClick}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                !selectingStart && selectedPreset === 'custom'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {filter.to ? formatDisplayDate(filter.to) : 'End date'}
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => handleMonthChange('prev')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {MONTHS[currentMonth]}
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {currentYear}
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleMonthChange('next')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <CalendarGrid
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedStart={filter.from || null}
            selectedEnd={filter.to || null}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
};

export default GlobalDateFilter;
