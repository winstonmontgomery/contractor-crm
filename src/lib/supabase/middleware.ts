import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Demo mode - allow all access without authentication
  return NextResponse.next({ request })
}
