import type { UploadApiOptions, UploadApiResponse } from 'cloudinary'
import { Readable } from 'node:stream'
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
  cloudinary?: Omit<UploadApiOptions, 'resource_type' | 'public_id'>
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

  /** Upload a single Buffer via upload_stream */
  private async uploadOneBuffer(
    item: BufferItem,
    opts: UploadManyOptions
  ): Promise<UploadedAsset> {
    const cloudinary = getCloudinary()
    const resourceType = opts.resourceType ?? this.detectResourceType(item.mimetype ?? null)

    const uploadOptions: UploadApiOptions = {
      folder: opts.folder,
      tags: opts.tags,
      overwrite: opts.overwrite ?? false,
      resource_type: resourceType,
      ...opts.cloudinary,
    }

    const stream = Readable.from(item.buffer)

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const cld = cloudinary.uploader.upload_stream(uploadOptions, (err, res) =>
        err ? reject(err) : resolve(res as UploadApiResponse)
      )
      stream.pipe(cld)
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: (result.resource_type as 'image' | 'video' | 'raw') ?? 'raw',
      format: result.format ?? null,
      bytes: result.bytes ?? null,
      originalFilename: result.original_filename ?? null,
    }
  }
}

export default new UploadService()