import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-utils"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export async function POST(req: NextRequest) {
  try { await requireAdmin() } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("image") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
  if (!ALLOWED_MIME_TYPES.includes(file.type))
    return NextResponse.json({ error: "Invalid file type." }, { status: 400 })

  const ncUrl  = process.env.NEXTCLOUD_URL!
  const ncUser = process.env.NEXTCLOUD_USER!
  const ncPass = process.env.NEXTCLOUD_APP_PASSWORD!
  const auth   = Buffer.from(`${ncUser}:${ncPass}`).toString("base64")

  const ext        = file.type.split("/")[1].replace("jpeg", "jpg")
  const filename   = `${Date.now()}.${ext}`
  const remotePath = `/Blog/${filename}`
  const davBase    = `${ncUrl}/remote.php/dav/files/${ncUser}`

  // Ensure the Blog folder exists (MKCOL is idempotent — 405 means already exists)
  const mkcolRes = await fetch(`${davBase}/Blog`, {
    method: "MKCOL",
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!mkcolRes.ok && mkcolRes.status !== 405) {
    const body = await mkcolRes.text().catch(() => "")
    console.error(`Nextcloud MKCOL ${mkcolRes.status}:`, body)
    return NextResponse.json({ error: `Failed to create Blog folder (${mkcolRes.status}).`, detail: body }, { status: 502 })
  }

  const uploadRes = await fetch(`${davBase}${remotePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": file.type,
    },
    body: Buffer.from(await file.arrayBuffer()),
  })
  if (!uploadRes.ok) {
    const body = await uploadRes.text().catch(() => "")
    console.error(`Nextcloud PUT ${uploadRes.status}:`, body)
    return NextResponse.json({ error: `Upload to Nextcloud failed (${uploadRes.status}).`, detail: body }, { status: 502 })
  }

  const shareParams = new URLSearchParams({ path: remotePath, shareType: "3", permissions: "1" })
  const shareRes = await fetch(
    `${ncUrl}/ocs/v2.php/apps/files_sharing/api/v1/shares`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "OCS-APIRequest": "true",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: shareParams,
    }
  )
  const xml = await shareRes.text()
  const token = xml.match(/<token>([^<]+)<\/token>/)?.[1]
  if (!token) {
    console.error(`Nextcloud share ${shareRes.status}:`, xml)
    return NextResponse.json({ error: `Failed to create public share (${shareRes.status}).`, detail: xml }, { status: 502 })
  }

  return NextResponse.json({ url: `${ncUrl}/index.php/s/${token}/preview` })
}
