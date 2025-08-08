import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface GeminiConfigCardProps {
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  connectionStatus: 'idle' | 'testing' | 'connected' | 'failed';
  testGeminiConnection: () => Promise<void>;
}

export const GeminiConfigCard: React.FC<GeminiConfigCardProps> = ({
  geminiApiKey,
  setGeminiApiKey,
  connectionStatus,
  testGeminiConnection
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Configuration
        </CardTitle>
        <CardDescription>
          Configure your Gemini AI API key to enable intelligent document processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="api-key" className="text-sm font-medium">
            Gemini API Key
          </label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your Gemini API key"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            onClick={testGeminiConnection}
            disabled={!geminiApiKey || connectionStatus === 'testing'}
            className="flex items-center gap-2"
          >
            {connectionStatus === 'testing' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
            
            {connectionStatus === 'testing' && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Testing
              </Badge>
            )}
            
            {connectionStatus === 'failed' && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Connection Failed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
