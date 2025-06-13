"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/lib/blog-data"
import { useTranslation } from "@/hooks/use-translation"

export default function BlogPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("blog.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("blog.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={post.image || "/placeholder.svg?height=200&width=400"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-6">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-4 text-xl font-bold">{post.title}</h2>
              <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="border-t p-6 pt-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={post.authorImage || "/placeholder.svg?height=32&width=32"}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 rounded-lg bg-muted p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">{t("blog.newsletter.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("blog.newsletter.description")}</p>
          </div>
          <div className="flex items-end">
            <form className="flex w-full max-w-md flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <input
                type="email"
                placeholder={t("blog.newsletter.email_placeholder")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {t("blog.newsletter.subscribe")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
