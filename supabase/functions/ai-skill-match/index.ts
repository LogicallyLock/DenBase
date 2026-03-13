import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Get current user's skills
    const { data: mySkills } = await supabase
      .from("user_skills")
      .select("*, skills(name, category)")
      .eq("user_id", user.id);

    if (!mySkills || mySkills.length === 0) {
      return new Response(JSON.stringify({ matches: [], reason: "Add skills to your profile to get AI-powered matches." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const teachSkills = mySkills.filter((s: any) => s.skill_type === "teach").map((s: any) => s.skills?.name).filter(Boolean);
    const learnSkills = mySkills.filter((s: any) => s.skill_type === "learn").map((s: any) => s.skills?.name).filter(Boolean);

    // Get all other users with skills
    const { data: allUserSkills } = await supabase
      .from("user_skills")
      .select("user_id, skill_type, skills(name, category)")
      .neq("user_id", user.id);

    if (!allUserSkills || allUserSkills.length === 0) {
      return new Response(JSON.stringify({ matches: [], reason: "No other users with skills found yet." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group by user
    const userSkillMap: Record<string, { teach: string[]; learn: string[] }> = {};
    for (const us of allUserSkills) {
      const uid = us.user_id;
      if (!userSkillMap[uid]) userSkillMap[uid] = { teach: [], learn: [] };
      const name = (us as any).skills?.name;
      if (name) userSkillMap[uid][us.skill_type as "teach" | "learn"].push(name);
    }

    // Build prompt for AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userSummaries = Object.entries(userSkillMap).map(([uid, skills]) =>
      `User ${uid}: teaches [${skills.teach.join(", ")}], wants to learn [${skills.learn.join(", ")}]`
    ).join("\n");

    const prompt = `You are a skill matching engine. Given a user's skills and other users' skills, find the best matches based on complementary teach/learn overlap.

Current user:
- Can teach: [${teachSkills.join(", ")}]
- Wants to learn: [${learnSkills.join(", ")}]

Other users:
${userSummaries}

Return the top 5 best matches as a JSON array. Each match should have:
- user_id: the matched user's ID
- score: compatibility score 0-100
- reason: one sentence why they're a good match

Only return users with meaningful overlap (score > 30).`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [{
          type: "function",
          function: {
            name: "return_matches",
            description: "Return skill match results",
            parameters: {
              type: "object",
              properties: {
                matches: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      user_id: { type: "string" },
                      score: { type: "number" },
                      reason: { type: "string" },
                    },
                    required: ["user_id", "score", "reason"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["matches"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_matches" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let matches: any[] = [];
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      matches = parsed.matches || [];
    }

    // Enrich with profile data
    const matchUserIds = matches.map((m: any) => m.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, user_id, full_name, avatar_url, tutor_category, avg_rating, session_price")
      .in("user_id", matchUserIds);

    const enrichedMatches = matches.map((m: any) => {
      const profile = profiles?.find((p: any) => p.user_id === m.user_id);
      return { ...m, profile: profile || null };
    }).filter((m: any) => m.profile);

    return new Response(JSON.stringify({ matches: enrichedMatches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-skill-match error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
