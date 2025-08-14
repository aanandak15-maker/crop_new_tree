import React from 'react';
import { useDocumentProcessor } from './useDocumentProcessor';
import { GeminiConfigCard } from './GeminiConfigCard';
import { DocumentUploadCard } from './DocumentUploadCard';
import { DocumentList } from './DocumentList';
import { DocumentDetailView } from './DocumentDetailView';

export const AIDocumentProcessor: React.FC = () => {
  const {
    // State
    documents,
    currentDocument,
    isProcessing,
    geminiApiKey,
    connectionStatus,
    fileInputRef,
    
    // Actions
    setGeminiApiKey,
    setCurrentDocument,
    testGeminiConnection,
    handleFileUpload,
    saveCropToDatabase,
    saveAllCrops
  } = useDocumentProcessor();

  return (
    <div className="space-y-6">
      {/* AI Configuration */}
      <GeminiConfigCard
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
        connectionStatus={connectionStatus}
        testGeminiConnection={testGeminiConnection}
      />

      {/* Document Upload */}
      <DocumentUploadCard
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        documents={documents}
        isProcessing={isProcessing}
      />

      {/* Document Library and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DocumentList
            documents={documents}
            currentDocument={currentDocument}
            setCurrentDocument={setCurrentDocument}
          />
        </div>

        <div className="lg:col-span-2">
          <DocumentDetailView
            currentDocument={currentDocument}
            saveAllCrops={saveAllCrops}
            saveCropToDatabase={saveCropToDatabase}
          />
        </div>
      </div>
    </div>
  );
};
