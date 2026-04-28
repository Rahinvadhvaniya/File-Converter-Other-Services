import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for occasional use",
    features: [
      "5 conversions per day",
      "10MB max file size",
      "Basic conversion tools",
      "Ad-supported",
      "Standard processing speed",
    ],
    notIncluded: ["Priority processing", "API access", "Team management"],
    cta: "Get Started Free",
    href: "/",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For power users and professionals",
    features: [
      "Unlimited conversions",
      "50MB max file size",
      "All 12 conversion tools",
      "No ads",
      "Priority processing",
      "Email support",
    ],
    notIncluded: ["API access", "Team management"],
    cta: "Start Pro Plan",
    href: "/?signup=pro",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$49.99",
    period: "per month",
    description: "For teams and businesses",
    features: [
      "Everything in Pro",
      "API access",
      "Team management",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Custom branding",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/?contact=enterprise",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for you. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-b from-red-600 to-pink-600 text-white shadow-2xl scale-105"
                  : "bg-white border border-gray-200 shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 font-bold text-sm px-4 py-1 rounded-full shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2
                  className={`text-2xl font-bold mb-1 ${
                    plan.highlight ? "text-white" : "text-gray-800"
                  }`}
                >
                  {plan.name}
                </h2>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-red-100" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className={`text-5xl font-extrabold ${
                      plan.highlight ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm mb-2 ${plan.highlight ? "text-red-100" : "text-gray-500"}`}
                  >
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.highlight ? "text-yellow-300" : "text-green-500"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={plan.highlight ? "text-white" : "text-gray-700"}>
                      {feature}
                    </span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 opacity-50">
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={plan.highlight ? "text-red-200" : "text-gray-400"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold text-lg transition ${
                  plan.highlight
                    ? "bg-white text-red-600 hover:bg-red-50"
                    : "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            All plans include
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            {[
              "🔒 Secure file handling",
              "🗑️ Auto file deletion",
              "🌐 Browser-based (no install)",
              "📱 Mobile friendly",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
