export function highlightText(text: string, searchQuery: string): string {
  if (!searchQuery.trim()) return text

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

export function getTextPreview(text: string, searchQuery: string, maxLength = 150): string {
  if (!searchQuery.trim()) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const lowerText = text.toLowerCase()
  const lowerQuery = searchQuery.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  // Get context around the match
  const start = Math.max(0, index - 50)
  const end = Math.min(text.length, index + searchQuery.length + 100)

  let preview = text.substring(start, end)
  if (start > 0) preview = "..." + preview
  if (end < text.length) preview = preview + "..."

  return preview
}
