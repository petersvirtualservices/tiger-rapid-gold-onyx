import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-CT2RNDWL.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-1vAx-gM_.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-D02QvaiP.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var PHASES = [
	{
		id: "plan",
		label: "Decisions",
		heading: "Decisions to make together"
	},
	{
		id: "house",
		label: "The house",
		heading: "The house and the buyers"
	},
	{
		id: "money",
		label: "Bills",
		heading: "Bills and contracts to close"
	},
	{
		id: "utilities",
		label: "Utilities",
		heading: "Utilities and services"
	},
	{
		id: "mail",
		label: "Mail & IDs",
		heading: "Mail, IDs, and accounts"
	},
	{
		id: "health",
		label: "Health",
		heading: "Health and the first week"
	},
	{
		id: "storage",
		label: "Packing",
		heading: "Sorting, packing, and lockers"
	},
	{
		id: "week",
		label: "Moving week",
		heading: "Moving week"
	},
	{
		id: "after",
		label: "Afterward",
		heading: "After the keys are handed over"
	}
];
var ASSIGNEES = [
	"Anyone",
	"Mom",
	"Dad",
	"Whoever is home",
	"All of us",
	"A company"
];
function phaseHeading(id) {
	return PHASES.find((phase) => phase.id === id)?.heading ?? "Other";
}
function isPhaseId(value) {
	return PHASES.some((phase) => phase.id === value);
}
function isAssignee(value) {
	return ASSIGNEES.includes(value);
}
/** Starter list for leaving a house lived in for fifty years. */
var SEED_TASKS = [
	{
		title: "Choose a move-out date everyone agrees on",
		detail: "Write the date down where Mom, Dad, and you can all see it. Utilities, the buyers, and the lockers all need the same day.",
		phase: "plan",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Decide where you will sleep the first night",
		detail: "A new house, a family member, or a short stay. Do not disconnect the old utilities until that next place can take you.",
		phase: "plan",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Talk through what is kept, given away, or stays",
		detail: "Fifty years of things will not fit in a weekend. Agree now on heirlooms, what the buyer keeps, and what can go. Put the decisions in a note on this item.",
		phase: "plan",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Ask a realtor, or someone you trust, to walk the sale with you",
		detail: "You do not have to decide a price today. You do need one person who will explain the paperwork in plain language.",
		phase: "plan",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Schedule a home review for potential buyers",
		detail: "Set a walkthrough with your agent and a home inspection before buyers arrive, so you hear about the roof, plumbing, electric, and repairs first. A house this age should also be checked for things you may need to disclose, such as older paint or insulation. Put the appointment in the note.",
		phase: "house",
		assignee: "Anyone",
		pinned: true,
		pinOrder: 4
	},
	{
		title: "Make a repair list from that review",
		detail: "Fix safety items first: steps, railings, smoke detectors, leaks, and anything that could surprise a buyer. The rest can be repaired or simply disclosed.",
		phase: "house",
		assignee: "A company",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Collect the house papers in one folder",
		detail: "Deed, property-tax bills, mortgage or home-equity papers, and the homeowners policy. This folder stays with you. It does not go in a locker.",
		phase: "house",
		assignee: "Whoever is home",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Keep homeowners insurance until closing day",
		detail: "Call the insurer, tell them the house is being sold, and ask them not to cancel coverage until the sale is finished. Ask what refund you might receive after.",
		phase: "house",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Clear a path so the house can be shown",
		detail: "Walkways, the entry light, and a few clear surfaces matter more than a perfect house. You do not need to empty it before the first review.",
		phase: "house",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Photograph every room before it is emptied",
		detail: "Do this for the memories, and so you have a record of the condition. Include the yard, the basement, and the inside of the garage.",
		phase: "house",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Set aside keys, remotes, and manuals for the buyer",
		detail: "Spare keys, garage remotes, appliance manuals, paint colors, and the size of the furnace filter. Leave them on the kitchen counter on the last day.",
		phase: "house",
		assignee: "Whoever is home",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Decide what is attached to the house and what you are taking",
		detail: "Light fixtures, curtains, mounted shelves, and the doorbell camera cause arguments at the end. Write the list down and tell the agent.",
		phase: "house",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Pay off the water filtration system",
		detail: "Call the company named on the tank or on the monthly bill. Ask for the payoff amount in writing, the date it must be paid, and whether they remove the equipment or it stays with the house. Save the receipt with the closing papers.",
		phase: "money",
		assignee: "Anyone",
		pinned: true,
		pinOrder: 3
	},
	{
		title: "Write down every automatic payment tied to this address",
		detail: "Lawn care, pest control, the alarm, the newspaper, water delivery, a furnace contract. Cancel them or give them the new address so they do not keep billing the old house.",
		phase: "money",
		assignee: "Whoever is home",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Ask the lender for a payoff amount, if you still owe on the house",
		detail: "A mortgage or home-equity line needs an official payoff before closing. Request it in writing and put the figure in the note.",
		phase: "money",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Start a folder for deposits and final bills",
		detail: "Utility deposits you should get back, the last electric bill, and any company that still owes you a refund. Check it once a week until they arrive.",
		phase: "money",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Confirm Spectrum or Cox, then plan the internet move",
		detail: "Look at the bill or the sticker on the modem so you know which company it really is. Do not cancel until the next place has working internet. Ask for a disconnect date, return the modem and remotes, and keep the confirmation number.",
		phase: "utilities",
		assignee: "Anyone",
		pinned: true,
		pinOrder: 1
	},
	{
		title: "Update T-Mobile and keep your phone numbers",
		detail: "Change the service address and the billing address. Check whether any phones are still being paid off — that balance does not disappear when you move. Write down account PINs and keep the same numbers.",
		phase: "utilities",
		assignee: "Anyone",
		pinned: true,
		pinOrder: 2
	},
	{
		title: "Close the trash service",
		detail: "Find out who hauls the trash, the city or a private company, and set the last pickup. Return the carts if they are not yours. If you already have the next address, start service there before you stop it here.",
		phase: "utilities",
		assignee: "Whoever is home",
		pinned: true,
		pinOrder: 6
	},
	{
		title: "Schedule the last day for electric, gas, and city water",
		detail: "These are separate from the filtration company. Ask each one for a final reading on move-out morning, and start service at the next place a day or two early so there is no gap.",
		phase: "utilities",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Cancel or transfer a landline, alarm, or medical alert",
		detail: "If nobody uses it, close it and return the equipment. If someone depends on a medical alert, move that service before the old one stops.",
		phase: "utilities",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Stop lawn, pest, cleaning, or the newspaper — or move them",
		detail: "Give each company the last day of service in writing, by email or a note you keep. Do not rely on a phone call alone.",
		phase: "utilities",
		assignee: "Whoever is home",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "File a post-office change of address for each person",
		detail: "Do this at the post office or at usps.com, one form per adult. Mail forwarding is a bridge, not a substitute for telling each company yourself.",
		phase: "mail",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Update the bank, Social Security, Medicare, pensions, and insurance",
		detail: "These matter more than store catalogs. Change the mailing address on each one, and check that deposits still land in the right account.",
		phase: "mail",
		assignee: "Mom",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Update licenses, car titles, and where the cars are garaged",
		detail: "Wait until you have the new address, then tell the motor-vehicle office and the car insurer. An old garaging address can cause a claim problem.",
		phase: "mail",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Tell the people and offices who still use this address",
		detail: "Pharmacy, doctors, church, the voter office, neighbors, and anyone who has a spare key. Neighbors of fifty years should hear it from you, not from a sign in the yard.",
		phase: "mail",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Ask whether a will or power of attorney needs the new address",
		detail: "If those papers name this house, or list an old address, a short call to the attorney is enough to learn whether they must be updated. Keep the originals with you, not in storage.",
		phase: "mail",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Refill medicines so you have several weeks on hand",
		detail: "Moving week is a bad time to run out. Ask the pharmacy for a list of what is due, and where a refill can be picked up next.",
		phase: "health",
		assignee: "Mom",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Pack a first-week bag that never goes into a locker",
		detail: "Medicines, glasses, hearing aids, IDs, chargers, a few clothes, and the important-papers folder. Label the bag DO NOT STORE and keep it in the car.",
		phase: "health",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Tell each doctor you are moving",
		detail: "Ask how records can follow you, and get paper copies of anything you cannot easily replace. Update Medicare and the pharmacy with the new address when you have it.",
		phase: "health",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Reserve storage lockers and decide what goes in them",
		detail: "Reserve the units before packing day. Ask for climate control if you are storing photographs, papers, or wood furniture. Measure sofas and beds first. Keep the unit number, gate code, and a spare key somewhere that does not go inside the locker.",
		phase: "storage",
		assignee: "Anyone",
		pinned: true,
		pinOrder: 5
	},
	{
		title: "Sort one room at a time",
		detail: "Keep, give away, sell, or throw away. Finish a room before you start the next one, or the whole house becomes a pile.",
		phase: "storage",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Label every box with the room and what is inside",
		detail: "Write it on two sides. Keep the same list in a note here, so a locker is not a mystery six months from now.",
		phase: "storage",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Keep the only copies of important papers out of the locker",
		detail: "Wills, the deed, IDs, insurance cards, and medical papers ride with you. A locker can flood, lock you out, or be months away when you need a document tomorrow.",
		phase: "storage",
		assignee: "Whoever is home",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Schedule a donation pickup or a small sale",
		detail: "Call the charity early. They book up, and what they will not take still has to leave the house before closing.",
		phase: "storage",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Take paint, chemicals, and old fuel to a hazardous-waste drop-off",
		detail: "Garage leftovers from many years do not go in the regular trash or the locker. Search your city's household hazardous waste day and put the date in the note.",
		phase: "storage",
		assignee: "Dad",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Book the movers or the truck, and help for the heavy pieces",
		detail: "Reserve a date that matches closing, not the week after. Ask the movers whether they will carry boxes into the locker or only to the curb.",
		phase: "week",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Empty and clean the refrigerator the day before",
		detail: "Defrost it if it is not frost-free, wipe it out, and leave the doors propped so it does not mildew. Do not leave food for the buyers.",
		phase: "week",
		assignee: "Whoever is home",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Read the meters on the last morning and photograph them",
		detail: "Electric, gas, and water. The photo is what you show if a final bill looks wrong.",
		phase: "week",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Leave the house clean, with remotes and manuals on the counter",
		detail: "Broom-clean is enough. Walk each room once. Check closets, the attic, the shed, and under the sinks.",
		phase: "week",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Walk through with the buyers or the agent before you hand over the keys",
		detail: "This is the last look. Bring the folder of manuals, the remotes, and every key. Do not leave a spare hidden outside.",
		phase: "week",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Confirm the companies you canceled actually stopped",
		detail: "Internet (Spectrum or Cox), T-Mobile's old address, trash, and the filtration payoff. Match them against this list and keep the confirmation numbers in the notes.",
		phase: "after",
		assignee: "Anyone",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Watch forwarded mail for a month",
		detail: "Each piece that still uses the old address is a company you still need to call. Update them, then check the item off only when that one is done.",
		phase: "after",
		assignee: "Whoever is home",
		pinned: false,
		pinOrder: 0
	},
	{
		title: "Make the locker payment automatic, and share the key",
		detail: "Two people should know the facility, the unit number, the gate code, and where the key is. A locker nobody can open is the same as losing what is inside.",
		phase: "after",
		assignee: "All of us",
		pinned: false,
		pinOrder: 0
	}
];
//#endregion
export { isAssignee as a, authMiddleware as i, PHASES as n, isPhaseId as o, SEED_TASKS as r, phaseHeading as s, ASSIGNEES as t };
