import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ASAAS_API_URL = "https://api.asaas.com/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Tratar CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY secret not configured.");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.");
    }

    // Admin client - bypasses RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Authenticate user who called the function
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("Missing Authorization header.");
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) throw new Error("Unauthorized");
    const userId = user.id;

    console.log(`Iniciando cancelamento de assinatura para o usuário: ${userId}`);

    // 2. Buscar o ID da assinatura do Asaas na tabela assinaturas
    const { data: assinatura, error: subError } = await supabaseAdmin
      .from("assinaturas")
      .select("id, asaas_assinatura_id, status")
      .eq("cliente_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.warn(`Erro ao buscar assinatura no BD: ${subError.message}`);
    }

    // 3. Cancelar a assinatura no Asaas (se existir)
    let asaasCanceled = false;
    if (assinatura && assinatura.asaas_assinatura_id) {
      const asaasAssinaturaId = assinatura.asaas_assinatura_id;
      console.log(`Cancelando assinatura no Asaas: ${asaasAssinaturaId}`);
      
      const asaasRes = await fetch(`${ASAAS_API_URL}/subscriptions/${asaasAssinaturaId}`, {
        method: "DELETE",
        headers: {
          "access_token": ASAAS_API_KEY,
        },
      });

      if (!asaasRes.ok) {
        const errorData = await asaasRes.json().catch(() => ({}));
        console.warn(`Erro Asaas ao cancelar assinatura: ${JSON.stringify(errorData)}`);
        // Se a assinatura já estava inativa no Asaas, consideramos como sucesso local.
      } else {
        asaasCanceled = true;
        console.log(`Assinatura Asaas cancelada com sucesso.`);
      }

      // Atualiza a tabela de assinaturas localmente
      await supabaseAdmin
        .from("assinaturas")
        .update({ status: 'cancelado' })
        .eq("id", assinatura.id);
    } else {
      throw new Error("Nenhuma assinatura encontrada para cancelar.");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Assinatura cancelada com sucesso",
        asaasCanceled
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[cancel-subscription] Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
