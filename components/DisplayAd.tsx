"use client";

/**
 * Display ads component for free tier users
 * Shows Google AdSense ads when configured
 */
export default function DisplayAd({ slot = "header" }: { slot?: "header" | "sidebar" | "footer" }) {
  const isAdEnabled = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!isAdEnabled) {
    // Placeholder for when AdSense is not configured
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 text-center border border-gray-200">
        <div className="text-gray-400 mb-2">
          {slot === "header" && "📢"}
          {slot === "sidebar" && "📱"}
          {slot === "footer" && "💡"}
        </div>
        <p className="text-sm text-gray-500">
          Ad Space Available
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {slot === "header" && "728x90 Leaderboard"}
          {slot === "sidebar" && "300x600 Sidebar"}
          {slot === "footer" && "728x90 Footer"}
        </p>
      </div>
    );
  }

  // Actual AdSense implementation
  return (
    <div className="flex justify-center items-center my-4">
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: slot === "sidebar" ? "300px" : "728px",
          height: slot === "sidebar" ? "600px" : "90px",
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={getAdSlotId(slot)}
      />
    </div>
  );
}

function getAdSlotId(slot: string): string {
  // These will be replaced with actual AdSense slot IDs
  const slots = {
    header: "1234567890",
    sidebar: "0987654321",
    footer: "1122334455",
  };
  return slots[slot as keyof typeof slots] || slots.header;
}
