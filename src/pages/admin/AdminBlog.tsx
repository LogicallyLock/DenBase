import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const AdminBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Post deleted"); fetchPosts(); }
  };

  const togglePublish = async (post: any) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const updates: any = { status: newStatus };
    if (newStatus === "published" && !post.published_at) updates.published_at = new Date().toISOString();
    const { error } = await supabase.from("blog_posts").update(updates).eq("id", post.id);
    if (error) toast.error(error.message);
    else { toast.success(newStatus === "published" ? "Published!" : "Unpublished"); fetchPosts(); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link to="/admin/blog/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Post</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No blog posts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                  {post.featured && <Badge variant="outline">Featured</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {post.category && `${post.category} · `}
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="icon" onClick={() => togglePublish(post)} title={post.status === "published" ? "Unpublish" : "Publish"}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Link to={`/admin/blog/${post.id}`}>
                  <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlog;
