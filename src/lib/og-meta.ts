export function ogImageForRoute(
  route:
    | 'home'
    | 'experience'
    | 'blog'
    | 'cinema'
    | 'experience-detail'
    | 'blog-detail'
    | 'cinema-detail'
): string {
  return `/og/${route}.svg`
}

export function buildMetadataOg(args: {
  title: string
  description: string
  route:
    | 'home'
    | 'experience'
    | 'blog'
    | 'cinema'
    | 'experience-detail'
    | 'blog-detail'
    | 'cinema-detail'
  url?: string
}) {
  return {
    title: args.title,
    description: args.description,
    openGraph: {
      title: args.title,
      description: args.description,
      type: 'website',
      url: args.url,
      images: [
        {
          url: ogImageForRoute(args.route),
          width: 1200,
          height: 630,
          alt: args.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: args.title,
      description: args.description,
      images: [ogImageForRoute(args.route)],
    },
  }
}
