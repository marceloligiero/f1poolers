import React, { useState } from 'react';
import { Event, Driver } from '../../types';
import { useData } from '../../contexts/DataContext';

const getLastName = (fullName: string) => {
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : fullName;
};

const DriverItem: React.FC<{ driver: Driver; isDraggable: boolean }> = ({ driver, isDraggable }) => (
  <div
    draggable={isDraggable}
    onDragStart={(e) => {
        if (isDraggable) {
            e.dataTransfer.setData('driverId', driver.id);
            e.currentTarget.classList.add('opacity-50');
        }
    }}
    onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50')}
    className={`flex items-center p-2 rounded-lg bg-gray-700 w-full ${isDraggable ? 'cursor-grab' : 'cursor-not-allowed'}`}
  >
    <img src={driver.imageUrl} alt={driver.name} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-600" />
    <div>
      <p className="font-bold text-sm text-white truncate">{getLastName(driver.name)}</p>
      <p className="text-xs text-gray-400">{driver.teamName}</p>
    </div>
  </div>
);

// Fix: Define ResultsFormProps interface to resolve the 'Cannot find name' error.
interface ResultsFormProps {
  event: Event;
  onClose: () => void;
}

const ResultsForm: React.FC<ResultsFormProps> = ({ event, onClose }) => {
  const { drivers, addResults } = useData();
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>(drivers);
  const [positions, setPositions] = useState<(Driver | null)[]>(Array(5).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-500', 'bg-gray-600');
    const driverId = e.dataTransfer.getData('driverId');
    const driver = drivers.find(d => d.id === driverId);
    if (driver && !positions.some(p => p?.id === driverId)) {
      const newPositions = [...positions];
      newPositions[index] = driver;
      setPositions(newPositions);
      setAvailableDrivers(availableDrivers.filter(d => d.id !== driverId));
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-red-500', 'bg-gray-600');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-red-500', 'bg-gray-600');
  };

  const removePosition = (index: number) => {
    const driver = positions[index];
    if (driver) {
      const newPositions = [...positions];
      newPositions[index] = null;
      setPositions(newPositions);
      setAvailableDrivers([...availableDrivers, driver].sort((a,b) => a.name.localeCompare(b.name)));
    }
  };

  const handleSubmit = async () => {
    if (positions.some(p => p === null)) {
        alert("Please fill all 5 positions.");
        return;
    }
    setIsLoading(true);
    const finalPositions = positions.filter(p => p !== null) as Driver[];
    await addResults({
        eventId: event.id,
        positions: finalPositions,
    });
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-white">Enter Results for {event.type}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-2 sm:p-4 flex-1 flex flex-row gap-2 sm:gap-4 overflow-y-auto">
          {/* Column 1: Available Drivers */}
          <div className="w-1/2 bg-gray-900 p-2 rounded-lg flex flex-col">
              <h3 className="font-bold mb-3 text-center text-gray-300 flex-shrink-0 text-sm sm:text-base">Available Drivers</h3>
              <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {availableDrivers.map(driver => <DriverItem key={driver.id} driver={driver} isDraggable={true} />)}
              </div>
          </div>

          {/* Column 2: Positions */}
          <div className="w-1/2 bg-gray-900 p-2 rounded-lg flex flex-col">
            <h3 className="font-bold mb-3 text-center text-gray-300 flex-shrink-0 text-sm sm:text-base">Final Positions</h3>
            <div className="space-y-2 flex-grow overflow-y-auto pr-2">
                {positions.map((driver, index) => (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-4">
                        <div className="text-xl sm:text-2xl font-bold text-gray-500 w-8 text-center flex-shrink-0">{index + 1}</div>
                        <div
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className="relative flex items-center justify-center w-full min-h-[68px] p-2 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 transition-colors"
                        >
                            {driver ? (
                                <>
                                    <DriverItem driver={driver} isDraggable={false} />
                                    <button 
                                        onClick={() => removePosition(index)} 
                                        className="absolute -top-1 -right-1 bg-red-600 rounded-full h-5 w-5 text-white text-xs flex items-center justify-center hover:bg-red-500 z-10"
                                        aria-label={`Remove ${driver.name}`}
                                    >
                                        &times;
                                    </button>
                                </>
                            ) : (
                                <p className="text-center text-gray-500 text-xs">Drop Driver Here</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 mt-auto flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={positions.some(p => p === null) || isLoading}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-green-700"
            >
              {isLoading ? 'Submitting...' : 'Submit & Payout'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsForm;
