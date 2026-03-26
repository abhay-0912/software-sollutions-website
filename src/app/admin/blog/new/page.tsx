import type { Metadata } from "next";
import { BlogEditor } from "@/components/admin/blog-editor";

export const metadata: Metadata = {
  title: "New Blog Post | Admin",
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return <BlogEditor isEdit={false} />;
}
