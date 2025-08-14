import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, FileSpreadsheet, FileImage, File } from 'lucide-react';
import { DocumentUpload } from './useDocumentProcessor';

interface DocumentUploadCardProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  documents: DocumentUpload[];
  isProcessing: boolean;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  fileInputRef,
  handleFileUpload,
  documents,
  isProcessing
}) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case 'image':
        return <FileImage className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading':
        return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Uploading</span>;
      case 'processing':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Processing</span>;
      case 'completed':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>;
      case 'failed':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Upload PDF, CSV, Excel, Word, or image files for AI-powered crop data extraction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-crop-green transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Supports: PDF, CSV, Excel, Word, Images
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.csv,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.gif"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Recent Uploads */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Uploads</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {documents.slice(-3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{doc.name}</div>
                    <div className="text-xs text-gray-500">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
