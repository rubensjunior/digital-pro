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

    // Admin client - bypasses RLS to insert profile + subscription
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const {
      user_id, name, email, document, phone,
      cep, address, neighborhood, city, state, number, complement,
      coupon_code, // ← novo campo opcional
    } = body;

    // Validate user exists in Supabase Auth
    if (!user_id) throw new Error("user_id é obrigatório.");
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (userError || !userData?.user) throw new Error("Usuário não encontrado.");

    // ── Validação de Cupom (quando fornecido) ──────────────────────────────
    let isFreeAccess = false;

    if (coupon_code && String(coupon_code).trim() !== "") {
      const codigoNormalizado = String(coupon_code).trim().toLowerCase();

      const { data: cupomData, error: cupomError } = await supabaseAdmin
        .from("cupons")
        .select("id, tipo, limite_usos, total_usado, ativo")
        .eq("codigo", codigoNormalizado)
        .single();

      if (cupomError || !cupomData) {
        throw new Error("Cupom inválido ou não encontrado.");
      }
      if (!cupomData.ativo) {
        throw new Error("Este cupom não está mais ativo.");
      }
      if (cupomData.limite_usos !== null && cupomData.total_usado >= cupomData.limite_usos) {
        throw new Error("Este cupom já atingiu o limite de usos.");
      }

      isFreeAccess = true;

      // Incrementar uso do cupom
      await supabaseAdmin
        .from("cupons")
        .update({ total_usado: cupomData.total_usado + 1 })
        .eq("id", cupomData.id);
    }

    // Clean masks from inputs
    const cpfCnpjClean = String(document).replace(/\D/g, "");
    const phoneClean = String(phone).replace(/\D/g, "");
    const cepClean = String(cep).replace(/\D/g, "");

    // ── 1. Create customer in Asaas ──────────────────────────────────────────
    const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name,
        email,
        cpfCnpj: cpfCnpjClean,
        mobilePhone: phoneClean,
        address,
        addressNumber: number,
        complement: complement || "",
        province: neighborhood,
        postalCode: cepClean,
        city,
        state,
        country: "BR",
        notificationDisabled: isFreeAccess, // sem notificações para free
      }),
    });

    const customerData = await customerRes.json();
    if (!customerRes.ok) {
      throw new Error(`Erro Asaas (cliente): ${JSON.stringify(customerData?.errors ?? customerData)}`);
    }
    const asaasClienteId: string = customerData.id;

    // ── 2. Assinatura/Cobrança (apenas para plano pago) ──────────────────────
    let asaasAssinaturaId: string | null = null;
    let subscriptionStatus = "FREE_TRIAL";
    let invoiceUrl: string | null = null;

    if (!isFreeAccess) {
      // Criar assinatura com cobrança normal
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextDueDate = tomorrow.toISOString().split("T")[0];

      const subscriptionRes = await fetch(`${ASAAS_API_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access_token": ASAAS_API_KEY,
        },
        body: JSON.stringify({
          customer: asaasClienteId,
          billingType: "UNDEFINED",
          cycle: "MONTHLY",
          value: 25,
          nextDueDate,
          description: "Assinatura Plano PRO - RKS Digital PRO",
        }),
      });

      const subscriptionData = await subscriptionRes.json();
      if (!subscriptionRes.ok) {
        throw new Error(`Erro Asaas (assinatura): ${JSON.stringify(subscriptionData?.errors ?? subscriptionData)}`);
      }
      asaasAssinaturaId = subscriptionData.id;
      subscriptionStatus = subscriptionData.status ?? "PENDING";

      // Buscar URL da primeira cobrança
      try {
        const chargesRes = await fetch(
          `${ASAAS_API_URL}/subscriptions/${asaasAssinaturaId}/charges?limit=1`,
          { headers: { "access_token": ASAAS_API_KEY } }
        );
        if (chargesRes.ok) {
          const chargesData = await chargesRes.json();
          const firstCharge = chargesData?.data?.[0];
          invoiceUrl = firstCharge?.invoiceUrl ?? firstCharge?.bankSlipUrl ?? subscriptionData.url ?? null;
        }
      } catch (_) {
        // Non-critical: invoice URL is optional
      }
    }

    // ── 3. Save profile in `clientes` ─────────────────────────────────────────
    const { error: profileError } = await supabaseAdmin
      .from("clientes")
      .insert({
        id: user_id,
        nome_completo: name,
        cpf_cnpj: document,
        telefone: phone,
        asaas_cliente_id: asaasClienteId,
        status: isFreeAccess ? "ativo" : "pendente",
      });

    if (profileError) throw new Error(`Erro DB (clientes): ${profileError.message}`);

    // ── 4. Save subscription in `assinaturas` ─────────────────────────────────
    const { error: subError } = await supabaseAdmin
      .from("assinaturas")
      .insert({
        cliente_id: user_id,
        nome_plano: isFreeAccess ? "Plano PRO (Beta Free)" : "Plano PRO",
        status: subscriptionStatus,
        asaas_assinatura_id: asaasAssinaturaId, // null para free
      });

    if (subError) throw new Error(`Erro DB (assinaturas): ${subError.message}`);

    // ── 5. Return success ─────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        success: true,
        free_access: isFreeAccess,
        asaas_cliente_id: asaasClienteId,
        asaas_assinatura_id: asaasAssinaturaId,
        invoice_url: invoiceUrl,
        status: subscriptionStatus,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[signup-asaas] Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
