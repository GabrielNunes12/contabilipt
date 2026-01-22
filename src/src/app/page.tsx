import { Calculator } from "@/components/calculator/Calculator";
import { IRSSimulator } from "@/components/calculator/IRSSimulator";
import { getCurrentUser } from "@/services/auth/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  let user = await getCurrentUser();

  // Dev Mode Bypass: Inject fake user to unlock premium UI
  /*
  if (!user && process.env.NODE_ENV === 'development') {
    user = {
      id: 'dev-mock-id',
      email: 'dev@localhost',
    };
  }
  */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-32 pb-32 overflow-hidden">
        {/* Abstract Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white">
              Contractor em Portugal? <br />
              <span className="text-emerald-400 inline-block mt-2">Otimiza os teus impostos.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Simulador fiscal avançado para profissionais de tecnologia com clientes internacionais.
              Compara regimes, prevê custos e maximiza o teu rendimento líquido.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-200/50 p-1">
              <TabsTrigger value="calculator" className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">
                Freelancer vs Empresa
              </TabsTrigger>
              <TabsTrigger value="irs" className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">
                Simulador IRS 2025
              </TabsTrigger>
            </TabsList>
            <TabsContent value="calculator">
              <Calculator user={user} />
            </TabsContent>
            <TabsContent value="irs">
              <IRSSimulator user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer / Trust */}
      <section className="py-12 text-center text-slate-500 text-sm">
        <p>Valores simulados para 2025. Não dispensa consulta de contabilista.</p>
      </section>
    </main>
  );
}
