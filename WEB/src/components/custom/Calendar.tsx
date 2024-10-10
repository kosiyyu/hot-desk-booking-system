import React, { useRef } from 'react';
import { Calendar as Cal } from 'lucide-react';

interface CalendarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClick = () => {
    inputRef.current?.showPicker();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select month';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div
      className={`relative inline-flex items-center justify-between text-special ${className}`}
      onClick={handleClick}
    >
      <div className="flex-grow pr-2">{formatDate(value)}</div>
      <Cal className="w-5 h-5 text-special mr-2 mb-1" />
      <input
        ref={inputRef}
        type="month"
        value={value}
        onChange={handleInputChange}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        aria-hidden="true"
      />
    </div>
  );
};

export default Calendar;
