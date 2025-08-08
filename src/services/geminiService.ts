interface GeminiConfig {
  apiKey: string;
  model?: string;
}

interface DocumentProcessingRequest {
  content: string;
  documentType: 'pdf' | 'csv' | 'excel' | 'word' | 'image';
  fileName: string;
}

interface ExtractedCropData {
  name: string;
  scientific_name: string;
  description: string;
  season: string[];
  climate_type: string[];
  climate_zone?: string[];
  soil_type: string[];
  soil_texture?: string[];
  water_requirement: string;
  growth_duration: string;
  average_yield?: string;
  origin?: string;
  growth_habit?: string;
  life_span?: string;
  plant_type?: string;
  fruit_type?: string;
  edible_part?: string;
  pollination?: string;
  propagation_type?: string;
  planting_season?: string;
  optimum_temp?: string;
  tolerable_temp?: string;
  light_requirement?: string;
  pest_name?: string[];
  disease_name?: string[];
  harvest_time?: string;
  maturity_indicators?: string;
  storage_conditions?: string;
  shelf_life?: string;
  processed_products?: string[];
  health_benefits?: string;
  variety_name?: string[];
  confidence_score?: number;
  source_document?: string;
  extraction_notes?: string;
}

class GeminiService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // 1 second between requests

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-2.5-flash';
  }

  async processDocument(request: DocumentProcessingRequest): Promise<ExtractedCropData[]> {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Rate limiting: ensure minimum interval between requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
          const waitTime = this.minRequestInterval - timeSinceLastRequest;
          console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastRequestTime = Date.now();
        
        const prompt = this.buildExtractionPrompt(request);
        
        console.log(`Attempting Gemini API call (attempt ${attempt}/${maxRetries})`);
        
        const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        });

        if (!response.ok) {
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * attempt;
            
            console.log(`Rate limited (429). Retrying in ${delay}ms...`);
            
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            } else {
              throw new Error(`Gemini API rate limit exceeded after ${maxRetries} attempts`);
            }
          } else {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
          }
        }

              const data = await response.json();
        console.log('Gemini API Response:', JSON.stringify(data, null, 2)); // Better debug log
        
        // Validate the response structure
        if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
          console.error('Invalid Gemini API response structure:', JSON.stringify(data, null, 2));
          throw new Error('Invalid response structure from Gemini API');
        }
        
        const candidate = data.candidates[0];
        console.log('Candidate structure:', JSON.stringify(candidate, null, 2)); // Debug candidate
        
        let extractedText = '';
        
        // Try different possible response structures
        if (candidate && candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
          extractedText = candidate.content.parts[0].text || '';
        } else if (candidate && candidate.text) {
          // Alternative structure
          extractedText = candidate.text;
        } else if (candidate && candidate.content && candidate.content.text) {
          // Another possible structure
          extractedText = candidate.content.text;
        } else if (typeof candidate === 'string') {
          // Direct string response
          extractedText = candidate;
        } else {
          console.error('Invalid candidate structure:', JSON.stringify(candidate, null, 2));
          throw new Error('Invalid candidate structure in Gemini API response');
        }
        if (!extractedText) {
          console.error('No text content in Gemini response');
          throw new Error('No text content received from Gemini API');
        }
        
        console.log('Extracted text from Gemini:', extractedText); // Debug extracted text
        
        return this.parseExtractedData(extractedText, request.fileName);
        
      } catch (error) {
        console.error(`Error on attempt ${attempt}:`, error);
        
        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          throw error;
        }
        
        // For non-429 errors, wait before retrying
        if (!error.message.includes('429')) {
          const delay = baseDelay * attempt;
          console.log(`Non-rate-limit error. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // This should never be reached, but just in case
    throw new Error('All retry attempts failed');
  }

  private buildExtractionPrompt(request: DocumentProcessingRequest): string {
    return `
Extract crop information from this ${request.documentType} document (${request.fileName}) and return as JSON array.

Required fields: name, scientific_name, description, season[], climate_type[], soil_type[], water_requirement, growth_duration, average_yield, confidence_score, extraction_notes

Optional fields: origin, growth_habit, life_span, plant_type, fruit_type, edible_part, pollination, propagation_type, planting_season, optimum_temp, tolerable_temp, light_requirement, pest_name[], disease_name[], harvest_time, maturity_indicators, storage_conditions, shelf_life, processed_products[], health_benefits, variety_name[], climate_zone[], soil_texture[]

Document content:
- swot_opportunities, swot_threats

Document Content:
${request.content}

Instructions:
1. Extract all crop information found in the document
2. Return only valid JSON array format
3. Include confidence scores (0.0 to 1.0) for each extraction
4. Add extraction notes explaining any uncertainties
5. If a field is not found, omit it from the JSON
6. Ensure all text values are properly escaped
7. Return only the JSON array, no additional text

Expected Output Format:
[
  {
    "name": "Crop Name",
    "scientific_name": "Scientific Name",
    "description": "Description",
    "season": ["Season1", "Season2"],
    "climate_type": ["Climate1", "Climate2"],
    "soil_type": ["Soil1", "Soil2"],
    "water_requirement": "Water requirement",
    "growth_duration": "Duration",
    "average_yield": "Yield",
    "confidence_score": 0.95,
    "extraction_notes": "Notes"
  }
]
`;
  }

  private parseExtractedData(extractedText: string, fileName: string): ExtractedCropData[] {
    try {
      console.log('Parsing extracted text:', extractedText); // Debug log
      
      // First, try to parse as JSON
      const jsonMatch = extractedText.match(/```json\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        try {
          const jsonString = jsonMatch[1];
          console.log('Found JSON in code block:', jsonString);
          
          const parsedData = JSON.parse(jsonString);
          
          // Validate and transform the data
          return parsedData.map((item: any) => ({
            name: item.name || '',
            scientific_name: item.scientific_name || '',
            description: item.description || '',
            season: Array.isArray(item.season) ? item.season : [],
            climate_type: Array.isArray(item.climate_type) ? item.climate_type : [],
            climate_zone: Array.isArray(item.climate_zone) ? item.climate_zone : undefined,
            soil_type: Array.isArray(item.soil_type) ? item.soil_type : [],
            soil_texture: Array.isArray(item.soil_texture) ? item.soil_texture : undefined,
            water_requirement: item.water_requirement || '',
            growth_duration: item.growth_duration || '',
            average_yield: item.average_yield || '',
            origin: item.origin || undefined,
            growth_habit: item.growth_habit || undefined,
            life_span: item.life_span || undefined,
            plant_type: item.plant_type || undefined,
            fruit_type: item.fruit_type || undefined,
            edible_part: item.edible_part || undefined,
            pollination: item.pollination || undefined,
            propagation_type: item.propagation_type || undefined,
            planting_season: item.planting_season || undefined,
            optimum_temp: item.optimum_temp || undefined,
            tolerable_temp: item.tolerable_temp || undefined,
            light_requirement: item.light_requirement || undefined,
            pest_name: Array.isArray(item.pest_name) ? item.pest_name : undefined,
            disease_name: Array.isArray(item.disease_name) ? item.disease_name : undefined,
            harvest_time: item.harvest_time || undefined,
            maturity_indicators: item.maturity_indicators || undefined,
            storage_conditions: item.storage_conditions || undefined,
            shelf_life: item.shelf_life || undefined,
            processed_products: Array.isArray(item.processed_products) ? item.processed_products : undefined,
            health_benefits: item.health_benefits || undefined,
            variety_name: Array.isArray(item.variety_name) ? item.variety_name : undefined,
            confidence_score: item.confidence_score || 0.5,
            source_document: fileName,
            extraction_notes: item.extraction_notes || ''
          }));
        } catch (jsonError) {
          console.log('JSON parsing failed, trying text parsing:', jsonError);
          
          // Try to extract partial JSON data from the truncated response
          try {
            const partialJsonMatch = extractedText.match(/\{[^}]*"name"[^}]*\}/g);
            if (partialJsonMatch && partialJsonMatch.length > 0) {
              console.log('Found partial JSON objects, attempting to parse...');
              const partialCrops = partialJsonMatch.map(jsonStr => {
                try {
                  const cropData = JSON.parse(jsonStr);
                  return {
                    name: cropData.name || 'Unknown Crop',
                    scientific_name: cropData.scientific_name || `${cropData.name || 'Unknown'} spp.`,
                    description: cropData.description || `Information about ${cropData.name || 'Unknown'} extracted from research document.`,
                    season: Array.isArray(cropData.season) ? cropData.season : ['Spring', 'Summer'],
                    climate_type: Array.isArray(cropData.climate_type) ? cropData.climate_type : ['Temperate'],
                    soil_type: Array.isArray(cropData.soil_type) ? cropData.soil_type : ['Well-drained'],
                    water_requirement: cropData.water_requirement || 'Moderate',
                    growth_duration: cropData.growth_duration || '3-5 years',
                    average_yield: cropData.average_yield || 'Variable',
                    confidence_score: cropData.confidence_score || 0.8,
                    source_document: fileName,
                    extraction_notes: 'Extracted from partial JSON response'
                  };
                } catch (e) {
                  return null;
                }
              }).filter(crop => crop !== null);
              
              if (partialCrops.length > 0) {
                console.log('Successfully extracted', partialCrops.length, 'crops from partial JSON');
                return partialCrops;
              }
            }
          } catch (partialError) {
            console.log('Partial JSON extraction also failed:', partialError);
          }
        }
      }
      
      // If JSON parsing failed or no JSON found, try text-based parsing
      console.log('Attempting text-based parsing...');
      return this.parseTextResponse(extractedText, fileName);
    } catch (error) {
      console.error('Error parsing extracted data:', error);
      throw new Error('Failed to parse AI extracted data');
    }
  }

  private parseTextResponse(text: string, fileName: string): ExtractedCropData[] {
    const crops: ExtractedCropData[] = [];
    
    // Split by lines and look for crop patterns
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for crop name patterns (e.g., "Cherry", "Sweet Cherry", etc.)
      // Skip lines that are just percentages or scientific names
      if (line && 
          !line.includes('%') && 
          !line.includes('Prunus') && 
          !line.includes('spp.') &&
          !line.includes('var.') &&
          line.length > 0 && 
          line.length < 100) { // Crop names are typically short
        
        const cropName = line;
        let scientificName = '';
        let description = '';
        let confidenceScore = 0.8;
        
        // Look for confidence score on the same line or next line
        const confidenceMatch = line.match(/(\d+)%/);
        if (confidenceMatch) {
          confidenceScore = parseInt(confidenceMatch[1]) / 100;
        }
        
        // Look for scientific name in next few lines
        for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine.includes('Prunus') || nextLine.includes('spp.') || nextLine.includes('var.')) {
            scientificName = nextLine;
            break;
          }
        }
        
        // Look for description (longer text) after scientific name
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine.length > 100 && 
              !nextLine.includes('%') && 
              !nextLine.includes('Prunus') &&
              !nextLine.includes('spp.') &&
              !nextLine.includes('var.')) {
            description = nextLine;
            break;
          }
        }
        
        // Skip if this looks like a description line (too long)
        if (line.length > 100) continue;
        
        if (cropName && cropName.length > 0) {
          crops.push({
            name: cropName,
            scientific_name: scientificName || `${cropName} spp.`,
            description: description || `Information about ${cropName} extracted from research document.`,
            season: ['Spring', 'Summer'], // Default seasons
            climate_type: ['Temperate'], // Default climate
            soil_type: ['Well-drained'], // Default soil
            water_requirement: 'Moderate',
            growth_duration: '3-5 years',
            average_yield: 'Variable',
            confidence_score: confidenceScore,
            source_document: fileName,
            extraction_notes: 'Extracted from text-based AI response'
          });
        }
      }
    }
    
    console.log('Text parsing results:', crops.length, 'crops extracted');
    console.log('Sample crops:', crops.slice(0, 3)); // Show first 3 crops for debugging
    return crops;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test message. Please respond with "Connection successful" if you can read this.'
            }]
          }]
        })
      });

      if (!response.ok) {
        console.error('Connection test failed with status:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        console.error('Invalid response structure in connection test:', data);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export default GeminiService;
export type { ExtractedCropData, DocumentProcessingRequest, GeminiConfig };
