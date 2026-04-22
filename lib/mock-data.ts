export const user = {
  name: "Sarah Boudreaux",
  age: 34,
  address: "4612 St. Anthony Ave, Gentilly 70122",
  vehicle: "2014 Honda Civic",
  fuelPercent: 37,
  cash: 844,
  insuranceNotes: "No flood coverage",
  dependents: [
    { name: "Mom", location: "Slidell", status: "READY · INSULIN STOCKED" },
  ],
} as const;

export const storm = {
  name: "Ida",
  category: 4,
  position: { lat: 27.8, lng: -88.2 },
  maxWinds: 125,
  gusts: 155,
  pressure: 949,
  movement: "NNW 12 mph",
  landfallETA: "Sunday 08:00 CDT",
  advisoryNumber: 28,
  advisoryTime: "23:00 CDT",
} as const;

export const exposure = {
  surge: "9–13 FT",
  wind: "120 MPH",
  evacZone: "A",
  /** Seconds until mandatory evac cutoff — frozen scenario: 22h 14m */
  prepTimeSeconds: 80040,
} as const;

/** Initial landfall countdown — 36:24:12 */
export const landfallCountdownInitialSeconds =
  36 * 3600 + 24 * 60 + 12;

export type IndicatorState = "ok" | "warn" | "alert" | "off";

export const statusIndicators = [
  { label: "GPS LOCK", state: "ok" as const },
  { label: "STORM FEED", state: "ok" as const, live: true },
  { label: "COMPANION", state: "ok" as const, live: true },
  { label: "MOM · SLIDELL", state: "warn" as const },
  { label: "FUEL SENSOR", state: "ok" as const },
] as const;

export type AlertSeverity = "red" | "amber" | "blue";

export const alerts = [
  {
    time: "23:14",
    agency: "NWS NHC",
    headline: "HURRICANE WARNING extended to St. Tammany Parish",
    severity: "red" as const,
  },
  {
    time: "22:58",
    agency: "LA GOHSEP",
    headline: "I-10 West contraflow begins 14:00 Tuesday",
    severity: "amber" as const,
  },
  {
    time: "22:30",
    agency: "ENTERGY",
    headline: "Precautionary outages begin 06:00 Sunday in Orleans Parish",
    severity: "amber" as const,
  },
  {
    time: "21:45",
    agency: "NWS NHC",
    headline: "Ida strengthens to Category 4; max winds now 125 mph",
    severity: "red" as const,
  },
  {
    time: "21:00",
    agency: "NOLA OHSEP",
    headline: "Mandatory evacuation Zone A effective 06:00 Tuesday",
    severity: "red" as const,
  },
  {
    time: "20:30",
    agency: "LSP",
    headline: "All state parks east of Atchafalaya closed through Monday",
    severity: "blue" as const,
  },
] as const;

export type ChatRole = "user" | "bot";

export const chatHistory = [
  {
    role: "user" as const,
    time: "23:15",
    body: "Okay I'm scared. What do I actually do? I have $1,000 and a Civic.",
  },
  {
    role: "bot" as const,
    time: "23:16",
    body: "You leave today. Here's the plan built for your actual numbers. Jackson, Mississippi — Hampton Inn on County Line Road at $89/night. Four nights = $356. That leaves $644 for gas, food, and a buffer. Route: I-10 West to Baton Rouge, then I-55 North. Leave by 2 PM when contraflow opens. Pack your laptop, mom's meds, grandma's photo box, the grey folder with your lease and insurance, three days of clothes. The Walgreens at 4500 I-55 in Jackson takes her plan — I've flagged it. Text her you're picking her up in Slidell at 1 PM.",
  },
  {
    role: "user" as const,
    time: "23:17",
    body: "What if traffic is bad on I-10?",
  },
  {
    role: "bot" as const,
    time: "23:18",
    body: "If I-10 bottlenecks past LaPlace, get off at Williams Boulevard and take Airline Highway north to US-61. Adds 35 minutes but keeps you moving. Top off at the Shell at Williams and Airline before you get on — the next reliable cluster is 40 miles up and stations past Hammond went dry this morning.",
  },
] as const;

export const companionPreview =
  "Your tank is at 3/8 and I-10 westbound is starting to bottleneck at Baton Rouge. If traffic hits, get off at Williams and take Airline north to US-61 — I'll walk you through it.";
