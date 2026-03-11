import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Send } from "lucide-react";

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    category: "",
    tags: "",
    seo_title: "",
    seo_description: "",
    featured: false,
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data }) => {
        if (data) {
          setForm({
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            cover_image_url: data.cover_image_url || "",
            category: data.category || "",
            tags: data.tags?.join(", ") || "",
            seo_title: data.seo_title || "",
            seo_description: data.seo_description || "",
            featured: data.featured || false,
          });
        }
      });
    }
  }, [id, isNew]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isNew ? generateSlug(title) : f.slug }));
  };

  const save = async (publish = false) => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }
    setSaving(true);

    const payload: any = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      cover_image_url: form.cover_image_url.trim() || null,
      category: form.category.trim() || null,
      tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      featured: form.featured,
    };

    if (publish) {
      payload.status = "published";
      payload.published_at = new Date().toISOString();
    }

    let error;
    if (isNew) {
      payload.author_id = user!.id;
      payload.status = publish ? "published" : "draft";
      ({ error } = await supabase.from("blog_posts").insert(payload));
    } else {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", id));
    }

    if (error) toast.error(error.message);
    else {
      toast.success(publish ? "Published!" : "Saved!");
      navigate("/admin/blog");
    }
    setSaving(false);
  };

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/admin/blog")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <h1 className="text-2xl font-bold mb-6">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>

        <div className="space-y-5">
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title" maxLength={200} />
          </div>
          <div>
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="url-friendly-slug" maxLength={200} />
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Short summary..." rows={2} maxLength={500} />
          </div>
          <div>
            <Label>Content *</Label>
            <Textarea value={form.content} onChange={(e) => update("content", e.target.value)} placeholder="Write your post content here..." rows={16} className="font-mono text-sm" />
          </div>
          <div>
            <Label>Cover Image URL</Label>
            <Input value={form.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)} placeholder="https://..." maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. Engineering" maxLength={100} />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="react, tutorial" maxLength={300} />
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="font-semibold mb-3">SEO</h3>
            <div className="space-y-3">
              <div>
                <Label>SEO Title</Label>
                <Input value={form.seo_title} onChange={(e) => update("seo_title", e.target.value)} placeholder="Custom title for search engines" maxLength={60} />
              </div>
              <div>
                <Label>SEO Description</Label>
                <Textarea value={form.seo_description} onChange={(e) => update("seo_description", e.target.value)} placeholder="Meta description..." rows={2} maxLength={160} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
            <Label>Featured post</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => save(false)} disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>
            <Button variant="default" onClick={() => save(true)} disabled={saving} className="bg-hero-gradient text-primary-foreground">
              <Send className="w-4 h-4 mr-2" /> Publish
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogEditor;
