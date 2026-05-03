const BOT_RE =
  /(bot|crawler|spider|preview|facebookexternalhit|slackbot|discordbot|telegrambot|twitterbot|linkedinbot|whatsapp|googlebot|bingbot|yandex|duckduck|ahrefs|semrush|petal|baidu|applebot|embedly|pinterest|skypeuripreview|vkshare|w3c_validator|curl|wget|httpclient|python-requests|axios|node-fetch|go-http-client|java\/|okhttp)/i

export function isBotUA(ua: string | null | undefined): boolean {
  if (!ua) return true
  return BOT_RE.test(ua)
}
