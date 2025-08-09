import { type MultiPartData, readMultipartFormData } from 'h3'
import { type BufferItem } from '../services/upload.service'

export type ParsedMultipart = {
  fields: Record<string, string>
  files: BufferItem[]
}

export async function parseMultipart(event: any): Promise<ParsedMultipart> {
  const parts: MultiPartData[] | undefined = await readMultipartFormData(event)
  const out: ParsedMultipart = { fields: {}, files: [] }

  if (!parts) return out

  for (const p of parts) {
    // File
    if (p.type && Buffer.isBuffer(p.data)) {
      out.files.push({
        buffer: p.data,
        filename: p.filename ?? null,
        mimetype: p.type ?? null,
        fieldName: p.name ?? null,
      })
      continue
    }

    // Text (string or Buffer)
    if (typeof p.data === 'string') {
      out.fields[p.name as string] = p.data
    } else if (Buffer.isBuffer(p.data)) {
      out.fields[p.name as string] = p.data.toString('utf8')
    }
  }

  return out
}
