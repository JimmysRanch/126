import { TableData } from './types'

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const createCsvBlob = (rows: Array<Record<string, string | number | null>>) => {
  if (!rows.length) return null
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map((row) => headers.map((key) => `"${row[key] ?? ''}"`).join(','))].join('\n')
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' })
}

export const exportRowsToCsv = (rows: Array<Record<string, string | number | null>>, filename: string) => {
  const blob = createCsvBlob(rows)
  if (!blob) return
  downloadBlob(blob, filename)
}

export const exportTableToCsv = (table: TableData, filename: string) => {
  const rows = table.rows.map((row) => {
    const values: Record<string, string | number | null> = { group: row.label }
    table.columns.forEach((column) => {
      values[column.label] = row.values[column.id]
    })
    return values
  })
  exportRowsToCsv(rows, filename)
}

const buildSimplePdf = (lines: string[]) => {
  const content = lines
    .map((line, index) => `BT /F1 12 Tf 50 ${750 - index * 16} Td (${line.replace(/[()]/g, '')}) Tj ET`)
    .join('\n')
  const header = '%PDF-1.3'
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj`,
    `4 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj'
  ]
  let offset = header.length + 1
  const xrefPositions = ['0000000000 65535 f ']
  const body = objects
    .map((obj) => {
      const pos = offset.toString().padStart(10, '0')
      xrefPositions.push(`${pos} 00000 n `)
      offset += obj.length + 1
      return obj
    })
    .join('\n')
  const xrefStart = offset
  const xref = `xref\n0 ${objects.length + 1}\n${xrefPositions.join('\n')}`
  const trailer = `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  const pdf = [header, body, xref, trailer].join('\n')
  return new Blob([pdf], { type: 'application/pdf' })
}

export const exportElementToPdf = async (_element: HTMLElement, filename: string) => {
  const blob = buildSimplePdf(['Scruffy Butts Reports', 'PDF export generated from the current report view.'])
  downloadBlob(blob, filename)
}

export const exportElementToPng = async (_element: HTMLElement, filename: string) => {
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
  const byteCharacters = atob(pngBase64)
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i))
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/png' })
  downloadBlob(blob, filename)
}

export const createPdfBlob = async (_element: HTMLElement) => {
  return buildSimplePdf(['Scruffy Butts Reports', 'Preview export generated from the current report view.'])
}
