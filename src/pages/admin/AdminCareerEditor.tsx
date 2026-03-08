import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const AdminCareerEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", location: "", job_type: "full-time",
    department: "", requirements: "", benefits: "", salary_range: "", status: "open",
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("careers").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setForm({
          title: data.title || "", description: data.description || "", location: data.location || "",
          job_type: data.job_type || "full-time", department: data.department || "",
          requirements: data.requirements || "", benefits: data.benefits || "",
          salary_range: data.salary_range || "", status: data.status || "open",
        });
      });
    }
  }, [id, isNew]);

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: form.title.trim(), description: form.description.trim(),
      location: form.location.trim() || null, job_type: form.job_type,
      department: form.department.trim() || null, requirements: form.requirements.trim() || null,
      benefits: form.benefits.trim() || null, salary_range: form.salary_range.trim() || null,
      status: form.status,
    };
    const { error } = isNew
      ? await supabase.from("careers").insert(payload)
      : await supabase.from("careers").update(payload).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Saved!"); navigate("/admin/careers"); }
    setSaving(false);
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/admin/careers")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold mb-6">{isNew ? "New Job Listing" : "Edit Job Listing"}</h1>
        <div className="space-y-5">
          <div>
            <Label>Job Title *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Senior Frontend Engineer" maxLength={200} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Department</Label>
              <Input value={form.department} onChange={(e) => update("department", e.target.value)} placeholder="e.g. Engineering" maxLength={100} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Remote, San Francisco" maxLength={100} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Job Type</Label>
              <Select value={form.job_type} onValueChange={(v) => update("job_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Salary Range</Label>
              <Input value={form.salary_range} onChange={(e) => update("salary_range", e.target.value)} placeholder="e.g. $120k - $160k" maxLength={100} />
            </div>
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={8} placeholder="Job description..." />
          </div>
          <div>
            <Label>Requirements</Label>
            <Textarea value={form.requirements} onChange={(e) => update("requirements", e.target.value)} rows={5} placeholder="List requirements..." />
          </div>
          <div>
            <Label>Benefits</Label>
            <Textarea value={form.benefits} onChange={(e) => update("benefits", e.target.value)} rows={4} placeholder="List benefits..." />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCareerEditor;
