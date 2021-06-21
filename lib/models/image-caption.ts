export interface ImageCaption {
  caption?: string;
  confidence?: string;
}

export interface ImageCaptionResult {
  captions: ImageCaption[];
  tags: string[];
}
