"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface BlogPost {
  _id: string
  documentId: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl?: string
  tags: string[]
  publishedAt: string
  author: {
    name: string
    avatar?: string
  }
  isPublished: boolean
  isFeatured: boolean
}

interface Category {
  _id: string
  documentId: string
  name: string
  slug: string
}

export default function BlogPage() {
  const { t, locale } = useTranslation()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState("")

  useEffect(() => {
    fetchData()
  }, [locale])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [postsRes, categoriesRes] = await Promise.all([
        fetch(`/api/blog?lang=${locale}&published=true`),
        fetch(`/api/categories?lang=${locale}&active=true`),
      ])

      const postsData = await postsRes.json()
      const categoriesData = await categoriesRes.json()

      if (postsData.success) {
        setPosts(postsData.data || [])
      } else {
        console.error("Failed to fetch blog posts:", postsData.error)
        setPosts([])
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data || [])
      } else {
        console.error("Failed to fetch categories:", categoriesData.error)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setPosts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    const matchesCategory = selectedCategory === "all" ? true : post.categoryDocumentId === selectedCategory

    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true

    return matchesSearch && matchesCategory && matchesTag
  })

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))
  const featuredPosts = filteredPosts.filter((post) => post.isFeatured)
  const regularPosts = filteredPosts.filter((post) => !post.isFeatured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("blog.title")}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("blog.subtitle")}</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("blog.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t("blog.filter_by_category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("blog.all_categories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.documentId} value={category.documentId}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={selectedTag ? "default" : "outline"}
              onClick={() => setSelectedTag("")}
              className={
                selectedTag
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:text-primary hover:border-primary/50"
              }
            >
              {t("blog.all_posts")}
            </Button>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-primary/10 text-primary"
                  }`}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Blog Posts */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-12">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("blog.featured_posts")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredPosts.map((post) => (
                    <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative bg-gray-200">
                        {post.coverImageUrl ? (
                          <Image
                            src={post.coverImageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400">
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2">{t("blog.featured")}</Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US")}
                          <User className="h-4 w-4 ml-2" />
                          {post.author.name}
                        </div>
                        <h3 className="text-xl font-semibold line-clamp-2">{post.title}</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                              {t("blog.read_more")}
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                {featuredPosts.length > 0 && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("blog.latest_posts")}</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative bg-gray-200">
                        {post.coverImageUrl ? (
                          <Image
                            src={post.coverImageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400">
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US")}
                          <User className="h-4 w-4 ml-2" />
                          {post.author.name}
                        </div>
                        <h3 className="text-xl font-semibold line-clamp-2">{post.title}</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                              {t("blog.read_more")}
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("blog.no_posts")}</h3>
            <p className="text-gray-600">
              {locale === "vi"
                ? "Không tìm thấy bài viết nào phù hợp với tiêu chí tìm kiếm."
                : "No blog posts found matching your search criteria."}
            </p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("blog.newsletter.title")}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{t("blog.newsletter.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder={t("blog.newsletter.email_placeholder")} className="flex-1" />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t("blog.newsletter.subscribe")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
