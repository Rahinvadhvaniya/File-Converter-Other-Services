export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "10 conversions per day",
        "Basic file formats",
        "Standard processing speed",
        "Email support",
        "Ad-supported"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited conversions",
        "All file formats",
        "Priority processing",
        "Priority email support",
        "No ads",
        "Batch processing",
        "API access (1,000 calls/month)"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$49.99",
      period: "per month",
      features: [
        "Everything in Pro",
        "Unlimited API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "White-label option",
        "Advanced analytics"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 ${
              plan.highlighted
                ? "bg-gradient-to-br from-red-600 to-pink-600 text-white transform scale-105 shadow-2xl"
                : "bg-white border-2 border-gray-200"
            }`}
          >
            <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
              {plan.name}
            </h3>
            <div className="mb-6">
              <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                {plan.price}
              </span>
              <span className={`text-lg ${plan.highlighted ? "text-white/80" : "text-gray-500"}`}>
                /{plan.period}
              </span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? "text-white" : "text-green-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className={plan.highlighted ? "text-white" : "text-gray-600"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                plan.highlighted
                  ? "bg-white text-red-600 hover:bg-gray-100"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">
          All plans include 14-day money-back guarantee
        </p>
        <p className="text-gray-600">
          Need a custom plan? <a href="#contact" className="text-red-600 hover:underline">Contact us</a>
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time. No questions asked.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">
              Yes, all paid plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards, debit cards, and PayPal through Stripe.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Are my files secure?</h3>
            <p className="text-gray-600">
              Absolutely. All files are encrypted during transfer and processing, and automatically deleted after 1 hour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
