import { ofetch } from 'ofetch'
import { getCloudinary } from '../utils/cloudinary'

export type BufferItem = {
  buffer: Buffer
  filename?: string | null
  mimetype?: string | null
  fieldName?: string | null
}

export type UploadedAsset = {
  url: string
  publicId: string
  resourceType: 'image' | 'video' | 'raw'
  format?: string | null
  bytes?: number | null
  originalFilename?: string | null
}

export type UploadManyOptions = {
  folder?: string
  tags?: string[]
  overwrite?: boolean
  resourceType?: 'image' | 'raw'
  cloudinary?: Record<string, any> // Use a more general type
}

class UploadService {
  /** Public API: upload multiple Buffers */
  async uploadBuffers(
    items: BufferItem[],
    opts: UploadManyOptions = {}
  ): Promise<UploadedAsset[]> {
    if (!items?.length) return []
    const uploads: UploadedAsset[] = []
    for (const item of items) {
      const uploaded = await this.uploadOneBuffer(item, opts)
      uploads.push(uploaded)
    }
    return uploads
  }

  /** Infer resource_type when not explicitly provided */
  private detectResourceType(mimetype?: string | null): 'image' | 'raw' {
    if (!mimetype) return 'raw'
    if (mimetype.startsWith('image/')) return 'image'
    return 'raw'
  }

  /** Upload a single Buffer via the Cloudinary REST API */
  private async uploadOneBuffer(
    item: BufferItem,
    opts: UploadManyOptions
  ): Promise<UploadedAsset> {
    const cloudinaryConfig = getCloudinary()
    const resourceType = opts.resourceType ?? this.detectResourceType(item.mimetype ?? null)
    
    const formData = new FormData()
    formData.append('file', new Blob([new Uint8Array(item.buffer)]), item.filename || 'upload')
    formData.append('api_key', cloudinaryConfig.config().api_key || '')
    formData.append('api_secret', cloudinaryConfig.config().api_secret || '')
    formData.append('upload_preset', 'uploads')
    
    // Only append non-empty values
    if (opts.folder) {
      formData.append('folder', opts.folder)
    }
    if (opts.tags && opts.tags.length > 0) {
      formData.append('tags', opts.tags.join(','))
    }
    if (opts.overwrite !== undefined) {
      formData.append('overwrite', opts.overwrite ? 'true' : 'false')
    }

    try {
      const response = await ofetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.config().cloud_name}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      return {
        url: response.secure_url,
        publicId: response.public_id,
        resourceType: (response.resource_type as 'image' | 'video' | 'raw') ?? 'raw',
        format: response.format ?? null,
        bytes: response.bytes ?? null,
        originalFilename: response.original_filename ?? null,
      }
    } catch (error: any) {
      console.error('Cloudinary upload failed:', {
        error: error.message,
        status: error.status,
        data: error.data,
        config: {
          cloud_name: cloudinaryConfig.config().cloud_name,
          api_key: cloudinaryConfig.config().api_key ? '***' : 'missing',
          resourceType,
          filename: item.filename,
          mimetype: item.mimetype
        }
      })
      throw error
    }
  }
}

export default new UploadService()