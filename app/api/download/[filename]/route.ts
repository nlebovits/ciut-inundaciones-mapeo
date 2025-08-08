import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params
    
    // Validate filename for security
    const allowedFiles = [
      'la_plata_original.geojson',
      'la_plata.geojson'
    ]
    
    if (!allowedFiles.includes(filename)) {
      return new NextResponse('File not found', { status: 404 })
    }
    
    // Read file from public/data directory
    const filePath = join(process.cwd(), 'public', 'data', filename)
    const fileBuffer = await readFile(filePath)
    
    // Set appropriate headers for download
    const headers = new Headers()
    headers.set('Content-Type', 'application/geo+json')
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)
    headers.set('Content-Length', fileBuffer.length.toString())
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 