import React from 'react';
import { getAllCropNames, getCropByName } from '@/data/cropData';

const CropDataTest: React.FC = () => {
  try {
    const cropNames = getAllCropNames();
    const wheatData = getCropByName('Wheat');

    return (
      <div className="p-8 bg-white border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Crop Data Test</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Crop Names:</h2>
          <p>{cropNames.join(', ')}</p>
          <p>Total: {cropNames.length}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Wheat Data:</h2>
          {wheatData ? (
            <div>
              <p><strong>Name:</strong> {wheatData.name}</p>
              <p><strong>Scientific Name:</strong> {wheatData.scientificName}</p>
              <p><strong>Season:</strong> {wheatData.season.join(', ')}</p>
              <p><strong>Varieties:</strong> {wheatData.varieties.length}</p>
            </div>
          ) : (
            <p className="text-red-500">Wheat data not found!</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Raw Data:</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify({ cropNames, wheatData: wheatData ? 'Found' : 'Not found' }, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8 bg-red-100 border border-red-400 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-red-800">Error Loading Crop Data</h1>
        <p className="text-red-700">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
};

export default CropDataTest;
