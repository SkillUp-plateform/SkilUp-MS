export interface Resource {
  id: number;
  name: string;
  contentType: string;
  size: number;
  fileData: Uint8Array;
  formationId: number;
}