import crypto from "crypto"

export function parseNameAndTripcode(input: string): {
  displayName: string
  tripcode: string | null
} {
  const hashIndex = input.indexOf("#")
  if (hashIndex === -1) {
    return { displayName: input.trim(), tripcode: null }
  }

  const displayName = input.slice(0, hashIndex).trim()
  const password = input.slice(hashIndex + 1)

  const hash = crypto
    .createHmac("sha256", process.env.TRIPCODE_SECRET!)
    .update(password)
    .digest("hex")

  const tripcode = hash.slice(0, 6)

  return { displayName: displayName || "Anonymous", tripcode }
}
