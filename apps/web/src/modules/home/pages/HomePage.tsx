import { Clock, Mic, Brain, Sparkles, Check } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Aprende inglés hablando desde el primer día
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Fluento usa inteligencia artificial para ayudarte a desarrollar fluidez 
              en inglés a través de ejercicios de traducción inversa.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              Empezar ahora - ¡Es gratis!
            </button>
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-16">
            ¿Por qué Fluento?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<Mic className="w-8 h-8 text-primary" />}
              title="Práctica oral real"
              description="Desarrolla fluidez hablando desde el primer momento, sin miedo a equivocarte"
            />
            <FeatureCard 
              icon={<Brain className="w-8 h-8 text-primary" />}
              title="Adaptativo"
              description="El sistema se adapta a tu nivel, reforzando las áreas donde más lo necesitas"
            />
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-primary" />}
              title="IA Avanzada"
              description="Evaluación instantánea de tus respuestas usando tecnología de última generación"
            />
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-16">
            ¿Cómo funciona?
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              <Step 
                number={1}
                title="Escucha la frase en español"
                description="Te presentamos una frase contextualizada en situaciones reales"
              />
              <Step 
                number={2}
                title="Traduce en voz alta"
                description="Tienes unos segundos para decir la frase en inglés"
              />
              <Step 
                number={3}
                title="Recibe feedback instantáneo"
                description="La IA evalúa tu respuesta y te da retroalimentación inmediata"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Planes */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-16">
            Planes diseñados para ti
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PlanCard 
              title="Gratuito"
              description="Comienza a practicar"
              price="€0"
              features={[
                "Acceso a listas públicas",
                "Práctica diaria limitada",
                "Evaluación por IA"
              ]}
            />
            <PlanCard 
              title="Premium"
              description="Aprovecha todo el potencial"
              price="€9.99/mes"
              features={[
                "Todas las características gratuitas",
                "Práctica ilimitada",
                "Listas personalizadas",
                "Sin restricciones"
              ]}
              highlighted
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Comienza tu viaje hacia la fluidez hoy
          </h2>
          <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
            Crear cuenta gratis
          </button>
        </div>
      </section>
    </main>
  );
}

// Componentes auxiliares
function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function PlanCard({ title, description, price, features, highlighted = false }: {
  title: string;
  description: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={`p-8 rounded-xl ${
      highlighted ? 'border-2 border-primary shadow-lg' : 'border border-gray-200'
    }`}>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-4xl font-bold mb-6">{price}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
