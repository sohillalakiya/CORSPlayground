import { NextRequest, NextResponse } from 'next/server'

// Test endpoint for verifying API testing functionality

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name') || 'World'
  
  return NextResponse.json({
    message: `Hello, ${name}!`,
    method: 'GET',
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries())
  })
}

export async function POST(request: NextRequest) {
  let body = null
  
  try {
    body = await request.json()
  } catch {
    // If not JSON, try to get text
    try {
      body = await request.text()
    } catch {
      body = null
    }
  }
  
  return NextResponse.json({
    message: 'Data received successfully',
    method: 'POST',
    timestamp: new Date().toISOString(),
    receivedData: body,
    headers: Object.fromEntries(request.headers.entries())
  }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  let body = null
  
  try {
    body = await request.json()
  } catch {
    try {
      body = await request.text()
    } catch {
      body = null
    }
  }
  
  return NextResponse.json({
    message: 'Resource updated successfully',
    method: 'PUT',
    timestamp: new Date().toISOString(),
    updatedData: body,
    headers: Object.fromEntries(request.headers.entries())
  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') || 'unknown'
  
  return NextResponse.json({
    message: `Resource ${id} deleted successfully`,
    method: 'DELETE',
    timestamp: new Date().toISOString(),
    deletedId: id,
    headers: Object.fromEntries(request.headers.entries())
  })
}