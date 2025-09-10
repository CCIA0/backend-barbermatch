export interface ImageAnalysisResult {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'triangle';
  confidence: number;
}
