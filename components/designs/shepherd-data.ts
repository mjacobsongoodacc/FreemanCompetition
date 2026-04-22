// Shared mock data for Shepherd homepage explorations.
// Mirrors the design-canvas export at design-exports/data.jsx.

export const SHEPHERD = {
  storm: {
    name: "IDA",
    category: 4,
    maxWinds: 125,
    gusts: 155,
    pressure: 949,
    movement: "NNW 12 MPH",
    landfallETA: "SUN 08:00 CDT",
    advisory: 28,
    advisoryTime: "23:00 CDT",
    coords: { lat: 27.8, lng: -88.2 },
  },
  streams: [
    { n: "01", key: "PLAN", label: "Plan", body: "Your prep decisions, kept current." },
    { n: "02", key: "RESOURCES", label: "Resources", body: "Money, fuel, meds, dependents." },
    { n: "03", key: "LOCATION", label: "Location", body: "Where you are right now." },
    { n: "04", key: "DISASTER", label: "Disaster", body: "What the storm is doing." },
    { n: "05", key: "WORLD", label: "World", body: "Traffic, outages, open gas." },
  ],
  chat: [
    { role: "user", time: "23:15", body: "Okay I'm scared. What do I actually do? I have $1,000 and a Civic." },
    {
      role: "bot",
      time: "23:16",
      body: "You leave today. Jackson, Mississippi — Hampton Inn on County Line Road at $89/night. Four nights is $356, which leaves $644 for gas, food, and a buffer. I-10 West to Baton Rouge, then I-55 North. Leave by 2 PM when contraflow opens. Grey folder, mom's meds, grandma's photo box, three days of clothes. Text her you're picking her up at 1.",
    },
    { role: "user", time: "23:17", body: "What if traffic is bad on I-10?" },
    {
      role: "bot",
      time: "23:18",
      body: "Off at Williams, Airline Highway north to US-61. Adds 35 minutes but keeps you moving. Top off at the Shell at Williams before you get on — stations past Hammond went dry this morning.",
    },
  ],
  alerts: [
    { t: "23:14", agency: "NWS NHC", sev: "red", body: "HURRICANE WARNING extended to St. Tammany Parish" },
    { t: "22:58", agency: "LA GOHSEP", sev: "amber", body: "I-10 West contraflow begins 14:00 Tuesday" },
    { t: "22:30", agency: "ENTERGY", sev: "amber", body: "Precautionary outages begin 06:00 Sunday, Orleans Parish" },
    { t: "21:45", agency: "NWS NHC", sev: "red", body: "Ida strengthens to Category 4; max winds now 125 mph" },
    { t: "21:00", agency: "NOLA OHSEP", sev: "red", body: "Mandatory evacuation Zone A effective 06:00 Tuesday" },
    { t: "20:30", agency: "LSP", sev: "blue", body: "All state parks east of Atchafalaya closed through Monday" },
  ],
  manifesto: {
    tagline: "When the plan breaks, Shepherd walks with you.",
    pitch:
      "A personal disaster companion for the moments your plan doesn't survive contact with the storm.",
    paragraphs: [
      "The plan is onboarding. Shepherd is the voice beside you when the checklist stops matching reality — when the gas line moves, when your mom texts from Slidell, when the advisory shifts and your stomach drops.",
      "I stay with you from three days out through shelter on night three. Calm when it can be, direct when it cannot. Think of me as the older sister who spent years inside emergency management and still sounds like a person, not a siren.",
    ],
  },
} as const;

export type ShepherdData = typeof SHEPHERD;
