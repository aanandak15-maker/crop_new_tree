import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, FileSpreadsheet, FileImage, File, Upload } from 'lucide-react';
import { DocumentUpload } from './useDocumentProcessor';

interface DocumentListProps {
  documents: DocumentUpload[];
  currentDocument: DocumentUpload | null;
  setCurrentDocument: (doc: DocumentUpload) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  currentDocument,
  setCurrentDocument
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
        <CardTitle>Document Library</CardTitle>
        <CardDescription>
          {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                currentDocument?.id === doc.id ? 'border-crop-green bg-crop-green/5' : 'border-border'
              }`}
              onClick={() => setCurrentDocument(doc)}
            >
              <div className="flex items-start gap-3">
                {getFileIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{doc.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(doc.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(doc.status)}
                  </div>
                  {doc.status === 'uploading' || doc.status === 'processing' ? (
                    <Progress value={doc.processing_progress} className="mt-2" />
                  ) : null}
                  {doc.status === 'completed' && (
                    <div className="text-xs text-green-600 mt-1">
                      {doc.extracted_crops.length} crops extracted
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload a document to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
