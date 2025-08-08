import React from 'react';

const MinimalTest: React.FC = () => {
  return (
    <div className="p-8 bg-white border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Minimal Test</h1>
      <p>If you can see this, React is working.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default MinimalTest;
