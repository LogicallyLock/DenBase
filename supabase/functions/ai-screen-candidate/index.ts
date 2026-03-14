import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationId } = await req.json();
    if (!applicationId) {
      return new Response(JSON.stringify({ error: "applicationId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get application with job and company info
    const { data: app, error: appErr } = await supabase
      .from("job_applications")
      .select("*, job_listings(*, companies(name))")
      .eq("id", applicationId)
      .single();

    if (appErr || !app) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get applicant profile and skills
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, bio, experience_level, avg_rating, total_sessions")
      .eq("user_id", app.user_id)
      .single();

    const { data: userSkills } = await supabase
      .from("user_skills")
      .select("skill_type, proficiency, skills(name)")
      .eq("user_id", app.user_id);

    const job = app.job_listings;
    const skillsList = (userSkills || []).map(
      (s: any) => `${s.skills?.name} (${s.skill_type}, ${s.proficiency || "unknown"})`
    ).join(", ");

    const screeningCriteria = job.screening_criteria || {};
    const criteriaText = Object.entries(screeningCriteria)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const prompt = `You are an AI recruiter screening a job application. Score the candidate 0-100 and provide a brief assessment.

JOB: ${job.title} at ${job.companies?.name || "Company"}
DESCRIPTION: ${job.description}
REQUIREMENTS: ${job.requirements || "None specified"}
REQUIRED SKILLS: ${(job.skills_required || []).join(", ") || "None specified"}
SCREENING CRITERIA:
${criteriaText || "None specified"}

CANDIDATE:
Name: ${profile?.full_name || "Unknown"}
Bio: ${profile?.bio || "No bio"}
Experience: ${profile?.experience_level || "Unknown"}
Skills: ${skillsList || "No skills listed"}
Rating: ${profile?.avg_rating || 0}/5 (${profile?.total_sessions || 0} sessions)
Cover Letter: ${app.cover_letter || "None provided"}

Respond in JSON format: {"score": <0-100>, "summary": "<2-3 sentence assessment>", "strengths": ["..."], "concerns": ["..."]}`;

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const aiResponse = await fetch("https://ai-gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    let result = { score: 0, summary: "Unable to screen", strengths: [], concerns: [] };
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0]);
      } catch {}
    }

    // Update the application with screening results
    await supabase
      .from("job_applications")
      .update({
        screening_score: result.score,
        screening_summary: JSON.stringify(result),
        status: "screened",
      })
      .eq("id", applicationId);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
