import type { Metadata } from "next";
import { ProjectEditor } from "@/components/admin/project-editor";

export const metadata: Metadata = {
  title: "New Project | Admin",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return <ProjectEditor isEdit={false} />;
}
