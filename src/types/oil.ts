export enum OilType {
  PETROL = "PETROL",
  DIESEL = "DIESEL",
  CRUDE = "CRUDE"
}

export interface OilResourceBase {
  date: string
  price: number
  type: OilType
  oil_document_url?: string | null
}

export interface OilResourceCreate extends OilResourceBase {}

export interface OilResourceUpdate {
  date?: string
  price?: number
  type?: OilType
  oil_document_url?: string | null
}

export interface OilResourceResponse extends OilResourceBase {
  id: string
  userId?: string | null
  email?: string | null
  created_at: string
  updated_at: string
}

export interface CursorPage<T> {
  items: T[]
  next_cursor: string | null
  previous_cursor: string | null
  next_page?: string | null
  previous_page?: string | null
}

export interface UploadUrlRequest {
  key: string
  content_type?: string
}

export interface UploadUrlResponse {
  upload_url: string
  download_url: string
}