import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ASAAS_API_URL = "https://api.asaas.com/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY secret not configured.");

    // Admin client - bypasses RLS to read/update the tables
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── 1. Authenticate user who called the function ─────────────────────────
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) throw new Error("Unauthorized");
    const userId = user.id;

    // ── 2. Get user's subscription from DB ────────────────────────────────────
    const { data: assinatura, error: subError } = await supabaseAdmin
      .from("assinaturas")
      .select("id, asaas_assinatura_id, status, proxima_cobranca")
      .eq("cliente_id", userId)
      .order("criado_em", { ascending: false })
      .limit(1)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar assinatura no BD: ${subError.message}`);
    }

    if (!assinatura || !assinatura.asaas_assinatura_id) {
      return new Response(
        JSON.stringify({ success: true, message: "Nenhuma assinatura Asaas vinculada", status: "none" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const asaasAssinaturaId = assinatura.asaas_assinatura_id;

    // ── 3. Fetch subscription data from Asaas ─────────────────────────────────
    const asaasRes = await fetch(`${ASAAS_API_URL}/subscriptions/${asaasAssinaturaId}`, {
      method: "GET",
      headers: {
        "access_token": ASAAS_API_KEY,
      },
    });

    if (!asaasRes.ok) {
      const errorData = await asaasRes.json().catch(() => ({}));
      throw new Error(`Erro Asaas (get subscription): ${JSON.stringify(errorData)}`);
    }

    const asaasData = await asaasRes.json();
    // Asaas status pode ser: ACTIVE, EXPIRED, INACTIVE, PENDING, etc.
    const realStatus = asaasData.status; // EX: 'ACTIVE'
    const nextDueDate = asaasData.nextDueDate; // EX: '2026-05-26'

    // Definir o status interno inicial baseado na assinatura
    let internalStatus = 'ativo';
    if (realStatus === 'EXPIRED' || realStatus === 'INACTIVE') {
      internalStatus = 'cancelado';
    }

    // ── 3b. Se assinatura ainda está PENDING, verificar cobranças ─────────────
    // O Asaas pode manter status PENDING mesmo após pagamento da 1ª cobrança.
    // Neste caso, verificamos se há ao menos uma cobrança confirmada.
    if (realStatus === 'PENDING' || realStatus === 'OVERDUE') {
      try {
        const chargesRes = await fetch(
          `${ASAAS_API_URL}/subscriptions/${asaasAssinaturaId}/charges?limit=10`,
          { headers: { "access_token": ASAAS_API_KEY } }
        );
        if (chargesRes.ok) {
          const chargesData = await chargesRes.json();
          const charges: Array<{ status: string }> = chargesData?.data ?? [];
          // Se qualquer cobrança foi confirmada/recebida, libera o acesso
          const hasConfirmedCharge = charges.some(
            (c) => c.status === "CONFIRMED" || c.status === "RECEIVED"
          );
          if (hasConfirmedCharge) {
            internalStatus = 'ativo';
          }
        }
      } catch (_) {
        // Não critico: se falhar, usa o status da assinatura
        console.warn("[sync-asaas] Falha ao buscar cobranças, usando status da assinatura.");
      }
    }

    let changed = false;

    // ── 4. Update Database if needed ──────────────────────────────────────────
    // Se o status da assinatura mudou, ou a data de próxima cobrança mudou
    if (assinatura.status !== internalStatus || assinatura.proxima_cobranca !== nextDueDate) {
      const { error: updateSubError } = await supabaseAdmin
        .from("assinaturas")
        .update({
          status: internalStatus,
          proxima_cobranca: nextDueDate,
        })
        .eq("id", assinatura.id);

      if (updateSubError) throw new Error(`Erro ao atualizar assinatura no BD: ${updateSubError.message}`);
      changed = true;
    }

    // Atualizar o cliente. Só inativa se a assinatura está cancelada E o prazo de vigência já expirou.
    let isPastDueDate = false;
    if (nextDueDate) {
      isPastDueDate = new Date(nextDueDate) < new Date();
    } else {
      isPastDueDate = true; // Se não tem data, já expirou
    }
    
    const clientStatus = (internalStatus === 'cancelado' && isPastDueDate) ? 'inativo' : 'ativo';
    const { data: cliente, error: clientError } = await supabaseAdmin
      .from("clientes")
      .select("status")
      .eq("id", userId)
      .single();

    if (!clientError && cliente && cliente.status !== clientStatus) {
      await supabaseAdmin
        .from("clientes")
        .update({ status: clientStatus })
        .eq("id", userId);
      changed = true;
    }

    // ── 5. Return response ────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        success: true,
        changed,
        status: internalStatus,
        asaasStatus: realStatus,
        nextDueDate,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[sync-asaas] Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
