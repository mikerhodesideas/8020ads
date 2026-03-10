export interface Lesson {
  id: string
  title: string
  content: string
}

export interface Module {
  id: number
  title: string
  outcome: string
  lessons: Lesson[]
}

export const modules: Module[] = [
  {
    id: 1,
    title: "Foundation",
    outcome: "You understand the SST framework, where Cowork fits, why it's the right tool for Trekkers and clients, and how everything you've already built in Claude Code maps directly across.",
    lessons: [
      {
        id: "1-1",
        title: "1.1 — What This Course Is and Who It's For",
        content: `# 1.1 — What This Course Is and Who It's For

This course is not a Claude Code refresher. If you've made it here, you already know how to use Claude Code. You've built skills, run commands, wired up workflows. That's the baseline — not the subject.

What this course is about is what comes next: taking everything you've built and making it useful for the people around you. Your team. Your clients. People who will never open a terminal, never edit a markdown file, and don't need to.

That's the gap this course closes.

## The Two Audiences

There are two groups of people you're going to be building for.

**Your internal team.** These are the people in your agency who need to do AI-assisted work — writing briefs, pulling reports, drafting client communications, running repeatable processes — but who aren't going to learn Claude Code to do it. They need something they can open, click, and run. You're going to give them that.

**Your clients.** This is where the bigger opportunity lives. Clients who can see the value of AI but don't have someone internally who can set it up. You can be that person. Not as an add-on. As an embedded AI partner — someone who configures the system, builds the workflows, and hands over something that actually runs. That's a different kind of relationship than campaign management, and a more durable one.

Both audiences have something in common: they need things to be simple, reliable, and ready to use. The work of making things simple is your job. That's what this course is about.

## What You'll Be Able to Do

By the end of this course you'll know how to:

**Configure Cowork for someone else.** Not just set it up on your own machine — set it up in a way that works for a specific person, with the right context loaded, the right skills available, and nothing unnecessary cluttering the interface.

**Build skills that run with one command.** You already know how to write SKILL.md files for your own use. You'll learn how to write them so someone else can run them without needing to understand what's happening underneath.

**Package a repeatable workflow for a client.** Take something you already do in Claude Code — a reporting workflow, a brief generator, a content process — and deploy it in a form a client can actually use on their own.

**Position yourself as the embedded AI partner.** This isn't about selling a one-off setup. It's about becoming the person who owns the AI infrastructure for every business you work with. That positioning is available to you right now — most agencies aren't doing this yet.

## What This Course Assumes

You know Claude Code. You know what a skill is, what a slash command does, what CLAUDE.md is for. You've run hooks. You understand that the brain system is built from markdown files and scripts.

If any of that is unfamiliar, start with the Claude Code course first and come back.

This course starts from that foundation and moves forward — into deployment, into client work, into the practical questions of how you hand something over to a person who doesn't know how it works and doesn't need to.

That's the whole game. Let's get into it.
`,
      },
      {
        id: "1-2",
        title: "1.2 — The SST Framework and Where Cowork Fits",
        content: `# 1.2 — The SST Framework and Where Cowork Fits

Before getting into the tool, it helps to understand the model. Not because you need a framework to do the work, but because having a clear picture of the three roles makes every decision in this course easier. Who you're building for changes how you build.

The framework is called SST: Summit, Scouts, Trekkers.

## The Three Roles

**Summit** is leadership. The person or people who set the direction — what problems to solve, what outcomes to chase, what the business is actually trying to do. Summit doesn't configure AI systems. Summit decides what they're for.

**Scouts** are the pathfinders. They explore what's possible, build the tools, configure the systems, and make things work. Scouts use Claude Code. They're comfortable with the command line, markdown files, scripts, and the occasional broken hook. They figure things out and then build something reliable from what they found.

**Trekkers** are everyone else. The team members and clients who use what Scouts set up. Trekkers don't configure anything — they run things. They need clear entry points, simple commands, and predictable outputs. A Trekker's job is to get work done using tools that already work. They're not here to build.

You are a Scout. The people you're about to serve — your team, your clients — are Trekkers.

## Why the Distinction Matters

The distinction matters because the two roles need completely different tools.

A Scout needs flexibility. You need to be able to open a file, change a prompt, test a variation, break something on purpose to see how it fails. The power of Claude Code comes from exactly that openness — everything is accessible, everything is editable, and there's no abstraction layer between you and how the system actually works.

That same openness is a problem for Trekkers.

If you hand a Trekker Claude Code with a folder full of SKILL.md files and say "just run the one you need," one of two things happens. Either they spend ten minutes trying to figure out which skill to use and how, and give up. Or they accidentally edit something they shouldn't, break the context loading, and now nothing works. Neither outcome is useful.

Trekkers don't need power. They need a clear path to one outcome.

## Where Cowork Fits

Cowork is the Trekker tool. It's Claude's desktop app — a GUI wrapper around the same underlying system you already use in Claude Code. Same skills. Same slash commands. Same CLAUDE.md context. Same hooks and scheduling. Everything you've built in Claude Code works in Cowork.

The difference is what's surfaced. In Cowork, a Trekker sees a clean interface with the skills you've configured for them. They pick a command, answer a prompt if needed, and get an output. They don't see the folder structure. They don't need to know what CLAUDE.md does. The infrastructure is invisible — which is exactly how it should be for them.

This is the key insight: Cowork doesn't require you to rebuild anything. It requires you to think carefully about what to expose and what to hide.

## The Scout's Job in This Course

Your job in this course is to act as the bridge. You understand both sides — the technical reality of how the system is built, and the practical reality of what a Trekker needs to get work done without friction.

Building for Trekkers is a different discipline than building for yourself. When you build for yourself, good enough is fine — you understand the edge cases, you know when to add a flag, you can debug it when it breaks. When you build for a Trekker, it has to work the first time, every time, for someone who doesn't know how it works.

That constraint — building something another person can actually use — is what makes this worth doing. It's also what makes it harder than it looks.

That's what the rest of this course is about.
`,
      },
      {
        id: "1-3",
        title: "1.3 — What You Already Have",
        content: `# 1.3 — What You Already Have

Here's the thing most people miss when they start thinking about deploying Cowork: they assume they need to rebuild.

They don't. You don't.

Everything you've already built in Claude Code maps directly into Cowork. Not approximately — directly. The same files, the same commands, the same context loading, the same automation. The infrastructure is shared. What changes is the interface people use to access it.

This lesson is about making that mapping explicit so you can see what you already have.

## SKILL.md → Skills

In Claude Code, a skill lives in a folder. It has a SKILL.md file that tells Claude what the skill is for, how to use it, and what parameters it needs. You invoke it through a slash command or by asking Claude to use it.

In Cowork, those same SKILL.md files appear as Skills in the interface. A Trekker opens Cowork, sees the skills you've configured, and picks the one they need. They don't know the file is called SKILL.md. They don't need to. They see a name, a short description, and a button to run it.

The file is identical. The experience is different.

## Slash Commands → Commands

Slash commands work exactly the same way in Cowork as they do in Claude Code. Type \`/report\` and the report skill runs. Type \`/brief\` and the brief generator opens. The syntax is unchanged.

The difference is context. In Claude Code, you type slash commands into a terminal. In Cowork, there's a command bar — still the same input, still the same behaviour, but surfaced in a GUI that feels less technical. For a Trekker, that matters. For you, nothing changes.

If you've built a slash command that does something useful, it's already a Cowork command. No extra work required.

## CLAUDE.md → Always-On Context

In Claude Code, CLAUDE.md is the file that loads automatically at the start of every session. It's where you put the context Claude needs to do good work — business information, rules, preferences, background on the client, whatever needs to be present without you having to paste it in each time.

In Cowork, that file does the same thing. Load a project in Cowork and the CLAUDE.md for that project loads with it. The Trekker doesn't see it. They don't configure it. It's just there, doing its job in the background.

This is one of the most powerful parts of deploying Cowork for a client. You write a CLAUDE.md that contains everything Claude needs to know about their business — their tone, their accounts, their key contacts, their standard outputs — and from that point on, every command a Trekker runs has that context baked in. They get better outputs without having to explain anything.

## Hooks → Auto-Triggers

Hooks in Claude Code let you run actions automatically — before a session starts, after a command completes, when certain conditions are met. You might use a hook to log every session, to check something before running a report, or to notify you when a skill completes.

In Cowork, hooks work the same way. Same configuration, same trigger points, same behaviour. If you've built a hook that does something useful, it works in a Cowork deployment without modification.

## Cron → Scheduling

Cron scheduling — running a skill on a timer, automatically, without anyone pressing a button — is available in both Claude Code and Cowork. If you've set up a scheduled report in your own brain, the same pattern applies to a client deployment.

A client who gets a weekly summary every Monday morning without having to ask for it is a very different kind of client relationship than one who has to remember to request it. Scheduling is one of the highest-value things you can configure, and you already know how to do it.

## The Honest Summary

You're further ahead than you think. The question isn't "what do I need to build?" It's "what have I already built that's worth packaging?"

The skills you've been building for your own work — the ones that save you time, the ones you run every week, the ones you've refined until they just work — those are your starting point. The next modules will walk through how to take what you already have, shape it for someone else, and deploy it in a form they can actually use.

Nothing gets thrown away. Everything you've done already counts.
`,
      },
      {
        id: "1-4",
        title: "1.4 — What Trekkers Need vs What Scouts Need",
        content: `# 1.4 — What Trekkers Need vs What Scouts Need

When you build a skill for yourself, you build it to be powerful. You want options. You want to be able to pass different parameters, handle edge cases, adjust the output format on the fly. You're comfortable with ambiguity because you understand the system well enough to navigate it.

When you build for a Trekker, you need to build the opposite of that.

## What Scouts Need

Scouts need flexibility. The ability to change anything, test variations, break things safely, and understand what's happening underneath. Claude Code gives you that — everything is a file, everything is editable, and you can get as deep into the system as you need to.

That flexibility is the point. You're exploring and configuring and refining. The tool needs to match that mode of working.

## What Trekkers Need

Trekkers need one thing: a clear path to one outcome.

Not options. Not flexibility. One command that does one job, reliably, every time. If a Trekker has to make a decision before running a skill — which variant to use, what flag to set, what format to choose — you've already created friction that will stop some percentage of them from using it at all.

Simplicity is not a compromise. It's a design choice, and it's the right one for this context.

Think about the tools your clients use day-to-day. Their CRM. Their reporting dashboard. Their email platform. None of those tools surface all their underlying complexity to every user. There's an admin layer and a user layer. You, as the Scout, are the admin. Trekkers are users. Building for users means hiding the admin layer entirely.

## What "Ready for a Trekker" Looks Like

A skill is ready for a Trekker when:

**It does one thing.** Not one thing with five optional variations — one thing. If you need variations, build multiple skills, each with a clear name that says what it does.

**It asks for only what it can't infer.** If the skill needs a client name, ask for it. If it can pull the client name from CLAUDE.md context, don't ask — just use it. Every question you ask a Trekker is friction. Remove every question you can.

**It produces a consistent output.** Same input, same format of output, every time. Trekkers aren't going to debug inconsistent results. They'll just stop using the tool.

**It fails gracefully.** If something goes wrong — missing input, unexpected data — the skill should give a clear message about what happened and what to do next, not dump an error that makes no sense to someone who doesn't know how the system works.

**It can be explained in one sentence.** If you can't describe what the skill does in a single sentence, it's doing too much. Split it.

## The Discipline of Reducing Optionality

This is the part that most Scouts find counterintuitive: the goal is to reduce what's available, not expand it.

When you build for yourself, adding more options is almost always an improvement. When you build for a Trekker, adding options is almost always a problem. Every extra option is a decision they have to make. Every decision is a potential stopping point.

The discipline here is asking, for every choice you're leaving open: can I make this decision for them? Usually the answer is yes. You know the client's context, you know the standard output they need, you know what "good" looks like for their situation. Make the decision. Bake it in. Let them just press go.

This doesn't mean the system can't be powerful underneath. It absolutely can be — should be. It means the power is in the infrastructure, not the interface. The interface should be boring and obvious.

## Building for Someone Else

The shift from building for yourself to building for someone else is mostly a shift in mindset. Instead of asking "what would make this more useful for me?", you're asking "what would make this possible to use for someone who doesn't understand how it works?"

Those are different questions, and they lead to different design choices.

The best way to test whether something is ready for a Trekker is to watch someone who isn't you try to use it without any explanation from you. If they can do it — if they can look at the skill, understand what it does, run it, and get a useful output — it's ready. If they need you to explain anything, it's not.

That bar is higher than it sounds. But it's achievable, and the rest of this course will show you how to get there.
`,
      },
    ],
  },
  {
    id: 2,
    title: "The Tool",
    outcome: "You know Cowork's interface from a Trekker's perspective and can configure a workspace for someone else before they ever touch it.",
    lessons: [
      {
        id: "2-1",
        title: "2.1 Cowork Orientation: The Trekker's View",
        content: `# 2.1 Cowork Orientation: The Trekker's View

Before you configure a workspace for someone else, you need to know exactly what they'll see when they open it. This lesson walks you through the Cowork interface from the ground up — but with one specific lens: what will your Trekker or client experience?

As a Scout, you already think in Claude Code terms. Cowork replaces the terminal with a GUI. Every concept you know still applies — context files, skills, commands — but the interface is entirely different. Your job in this module is to get fluent in that interface before you hand it to someone else.

---

## The Folder Browser

The folder browser sits on the left side of the Cowork window. It shows the workspace folder — the directory you've pointed Cowork at. This is where all the context files, skill files, and output files live.

Your Trekker will see this, but they probably won't need to use it much. The folder browser is more useful to you as the person setting things up. That said, understand what it shows: it's a live view of the file system. If you've organised the workspace well, folder names will make sense to a non-technical person. If you haven't, they'll feel lost immediately.

**Pre-configure tip:** Name folders clearly. A folder called \`skills\` means nothing to a client. A folder called \`tasks\` or \`assistants\` is better. Or hide what they don't need to see entirely by keeping it outside the workspace root.

---

## The Skill Panel

The skill panel lists all the skills available in the workspace. Each skill is a markdown file — a set of instructions that shapes how Claude behaves in a particular context. The panel lets you toggle skills on or off with a single click.

From the Trekker's perspective, this is where they activate the "mode" they need. If you've built a skill for writing social posts and another for answering client questions, they toggle the relevant one before they start chatting.

Skills can be turned on simultaneously. The context from all active skills gets passed to Claude. This is powerful, but it's also where things get messy if you over-configure. More on that in Module 4.

**Pre-configure tip:** A Trekker should never need to read a skill file to understand what it does. Name each skill clearly (e.g. "Write social posts", "Summarise meeting notes", "Reply to client emails") and write the skill itself to be self-contained. The toggle label is the only thing they'll read before activating it.

---

## The Chat Interface

The chat interface is the main panel. It's where the Trekker types their request and reads Claude's response. It looks and feels like any chat tool — familiar immediately to anyone who's used Claude.ai or ChatGPT.

What makes it different from a basic chat window is the context that's always running underneath: the always-on context file, any active skills, and any commands loaded in the workspace. The Trekker doesn't see this configuration. They just see a text box.

**Pre-configure tip:** Consider writing an opening message that appears in the chat when the workspace loads — a short welcome that tells the Trekker what this workspace does and how to start. Claude can't auto-send a greeting, but you can include instructions in the always-on context to introduce itself when the Trekker says hello.

---

## Slash Commands

Slash commands are triggered by typing \`/\` in the chat. A menu appears showing available commands. The Trekker selects the one they need and Claude runs the predefined workflow.

Think of commands as buttons that launch a specific task. You've used them in Claude Code — \`/sync\`, \`/gm\`, \`/inbox\`. In Cowork, they work the same way, but the Trekker is the one pressing them.

Commands are defined in markdown files inside the workspace. The Trekker never sees the file — they just see the command name and a short description in the menu.

**Pre-configure tip:** Keep command names obvious and action-oriented. \`/write-post\` is better than \`/content\`. \`/send-follow-up\` is better than \`/email\`. The description that appears in the menu matters — write it for someone who doesn't know what the command does internally.

---

## Scheduled Tasks

Cowork supports scheduling — tasks that run automatically at a set time or interval. These appear in the scheduling panel, which shows what's queued and when it's next due.

Your Trekker probably won't set up scheduling themselves. But they may need to check whether a scheduled task ran, or trigger one manually if timing is off. Make sure the scheduled task names are as readable as the command names.

---

## Output Panel

When Claude completes a task, output appears in the chat and, for longer structured responses, in the output panel. Files that Claude generates land in the workspace folder.

This is where Trekkers go to find what was produced. If you've configured the workspace well, output files are named clearly and saved to a sensible location. If you haven't, the Trekker will struggle to find what they asked for.

---

## The Mental Model to Give Your Trekker

Before you hand over a workspace, your Trekker needs one clear mental model: Cowork is a task interface, not a chatbot.

They're not having an open-ended conversation. They're running tasks that you've already defined. They toggle the right skill, type a request (or pick a slash command), and read the output. That's the whole loop.

The cleaner you make that loop, the faster they'll get value — and the less you'll be asked to explain things later.
`,
      },
      {
        id: "2-2",
        title: "2.2 Setting Up Context for Someone Else",
        content: `# 2.2 Setting Up Context for Someone Else

Every Cowork workspace needs always-on context. This is the equivalent of CLAUDE.md in Claude Code — the file that tells Claude who it's working for, what matters, and how to behave. The difference here is that you're writing it for someone else's business.

That's harder than it sounds. When you set up your own brain, you know the business intimately. You know the tone, the clients, the quirks, the things that can't be got wrong. When you're setting up a workspace for a client or a team member, you're working from what they've told you — which is usually incomplete.

This lesson is about how to get what you need, what to write, and the mistakes to avoid.

---

## What Goes in Always-On Context

Always-on context loads with every conversation in the workspace. It shapes every response Claude gives, regardless of what skill is active or what the Trekker types.

It should cover five things:

**1. Who the business is**
Business name, what they do, who their customers are. One or two sentences. Not a mission statement — just enough for Claude to know the operating context.

Example: *"This workspace is for [Business Name], a Sydney-based digital marketing agency that manages Google Ads for e-commerce brands. Primary clients are in fashion and homewares."*

**2. Tone of voice**
How do they communicate? Formal or casual? Do they use Australian spelling? Do they avoid certain words or phrases? If they have a brand guide, pull the relevant language notes from it. If they don't, ask them to describe how they'd explain something to a client — that usually reveals their natural register.

**3. Key tools and context**
What tools does this business use that Claude needs to know about? If there's a CRM, a project management system, a reporting format — name them. If certain files or folders in the workspace are important references, mention them.

**4. Standing rules**
What must Claude always do, or never do? This is where you put the non-negotiables. Common ones:
- Always check existing files before creating new ones
- Never suggest a tool or platform without confirming it's already in use
- Reply in Australian English
- Do not include pricing in any client-facing draft — flag it for human review

**5. Output defaults**
How long should responses typically be? What format is preferred? Should Claude ask clarifying questions before starting a task, or get a draft down first? These defaults reduce friction for the Trekker.

---

## How to Gather This Information

You'll cover most of this in the discovery session covered in Module 3. But don't wait until you're writing the context file to think about it.

During discovery, listen for:
- Words and phrases the client repeats naturally — those are tone signals
- Things they say they hate seeing in drafts — those are standing rules
- Names of tools they mention — those go in key tools
- Anything they say Claude "must" do or "must never" do — standing rules, capture them verbatim

After the discovery session, don't rely on your notes alone. Send a short summary back to the client: "Here's what I'm building the workspace around — does anything look wrong?" You'll catch gaps before they show up as bad outputs.

---

## Writing Context for a Business You Don't Know Well

This is the honest challenge. You know your own business deeply. You're writing context for a business you've spent an hour learning about.

A few things that help:

**Write lean and test.** A shorter context file that's accurate is better than a long one that's half-guessed. Start with what you know confidently, run a few test tasks, and add to the context as gaps show up.

**Ask for examples.** The fastest way to understand tone and output quality is to ask the client to show you something they've already produced that they're proud of. One good example is worth a page of description.

**Write in second person to Claude, not to the Trekker.** The always-on context is read by Claude, not the Trekker. Write it like instructions, not documentation. "Always reply in a conversational tone" not "This business values a conversational tone."

---

## A Simple Template to Start From

\`\`\`
## Business
[Business name] is a [what they do] based in [location]. They work with [who their clients are].

## Tone of voice
[Describe the register — formal/casual, direct/warm, any specific preferences.]
Use Australian English spelling throughout.

## Key tools and context
- [Tool 1]: [what it's used for]
- [Tool 2]: [what it's used for]
- [Relevant files or folders in workspace]

## Standing rules
- [Rule 1]
- [Rule 2]
- [Rule 3]

## Output defaults
- Keep responses [length guidance — concise / detailed]
- Prefer [format — bullet points / paragraphs / tables]
- [Any default behaviour for clarifying questions]
\`\`\`

Use this as a starting point, not a rigid structure. Some businesses need more tone guidance. Some need a long list of rules. Adjust the weight based on where the risk of error is highest for that client.

---

## Common Mistakes

**Too generic.** Context that could apply to any business gives Claude almost nothing to work with. "Professional tone" is meaningless. "Formal enough for corporate clients but approachable — no jargon" is useful.

**Too long.** Always-on context loads with every conversation. If it's 2,000 words, you're burning context window on every task. Keep it under 400 words where possible. Move anything that's task-specific into a skill file instead.

**Missing key rules.** The rules section is usually underdeveloped. Push the client: "What's the thing that, if Claude got it wrong, would cause you a real problem?" That's what belongs in standing rules.

**Writing it once and forgetting it.** Always-on context needs a review after the first week of use. Real-world tasks reveal gaps that no discovery session will. Build in a check-in with your client after their first week of using the workspace, and update the context file based on what came up.
`,
      },
    ],
  },
  {
    id: 3,
    title: "Discovery",
    outcome: "You can run a structured discovery session with a team member or client, identify the right workflows to automate first, and leave with everything you need to build.",
    lessons: [
      {
        id: "3-1",
        title: "3.1 Running a Discovery Session",
        content: `# 3.1 Running a Discovery Session

Before you build anything, you need to understand how someone actually works. Not how they think they work, or how they'd ideally work — how they actually spend their time right now.

A discovery session is a 20–30 minute conversation designed to surface that reality. Done well, it gives you everything you need to decide what to build first. Done poorly, you end up building something that solves a problem nobody has.

## How to Frame It

The way you open the session matters. If you walk in saying "I'm going to automate your work," people get defensive or start pitching you their most ambitious ideas. Neither is useful.

Instead, frame it like this:

> "I want to understand how you work before I build anything. No pitching, no promises yet — I just want to see what your week actually looks like."

That framing works whether you're talking to an internal team member or an external client. It signals that you're listening first, and it sets realistic expectations. The best discoveries happen when the other person feels like they're just describing their job, not justifying it.

## The Core Questions

Start broad, then follow the thread:

**What do you do every week that follows the same pattern?**
This is your opener. Let them answer freely. You're looking for recurring work — the things that happen every Monday, every end of month, every time a client asks a particular question.

**What takes time but doesn't require much thinking once you know what you're doing?**
This one surfaces the rote work they've stopped noticing. People often don't volunteer this because they assume it's not interesting or automatable. Push gently: "What would you hand off to someone new on day one?"

**What do you produce repeatedly that looks roughly the same?**
Emails, reports, summaries, briefs, onboarding docs — anything with a familiar shape. If the output of a task looks similar each time, that's a strong signal.

**Where do you copy and paste?**
A simple, practical question that almost always uncovers something useful. Copy-paste is a workflow waiting to be automated.

**What takes longer than it should?**
Not always automatable, but it tells you where the pain is. Sometimes the answer here points to a simpler workflow upstream.

## Listening for the Real Workflow

Answers are often vague at first. Someone might say "I do a lot of client reporting" or "I handle follow-ups after calls." Your job is to ask one more question:

> "Can you walk me through exactly what that looks like — from when you start to when it's done?"

That follow-up question is where the actual workflow appears. You find out that "client reporting" means: pull a CSV from Google Ads, open last week's report as a template, manually update numbers, write two sentences of commentary, send. That's a specific, buildable thing.

With internal team members, you can push harder and go deeper — they're used to working with you. With clients, slow down a little. Let them talk. Your instinct might be to jump to the solution the moment you spot the pattern, but clients need to feel heard before they trust your recommendation.

## Taking Notes That Translate into Skills

Don't take notes like you're writing a meeting summary. Take notes like you're writing a spec.

For each workflow you spot, capture:
- **Trigger** — What starts this task? (Monday morning, end of a call, client sends something)
- **Inputs** — What does the person start with? (CSV, email, transcript, brief)
- **Process** — What do they actually do with it, step by step?
- **Output** — What does the finished thing look like? (Report, email, Slack message, doc)
- **Frequency** — How often does this happen?
- **Recipient** — Who gets the result?

This structure maps almost directly onto a skill file. When you sit down to build, you're not starting from scratch — you're filling in a template that already exists in your notes.

## Internal vs External — What Changes

The discovery process is the same whether you're talking to a team member or a client. The conversation, the questions, the note-taking — all the same.

What changes is the relationship dynamic:

With an **internal team member**, you have more context already. You can skip the small talk and get specific faster. They'll also be more honest about what's actually painful, because there's less to lose.

With an **external client**, spend a few minutes at the start establishing that this is a working conversation, not a pitch. Be explicit that you're not going to promise to build everything they mention — you're just learning. That honesty builds more trust than any amount of enthusiasm about what's possible.

In both cases, end the session with a clear next step: "I'll look at what came up today and come back to you with a recommendation for where to start."

That's the job of discovery. Not to decide what to build in the room — but to gather enough to make a good decision after.
`,
      },
      {
        id: "3-2",
        title: "3.2 Spotting Automatable Workflows",
        content: `# 3.2 Spotting Automatable Workflows

Discovery surfaces a lot of work. Some of it is automatable. Most of it isn't — at least not yet, and not easily. The mistake most people make is trying to build the most impressive thing first rather than the most appropriate thing.

This lesson gives you a practical filter to use during and after discovery, so you can quickly sort what's worth building from what isn't.

## The Four Filters

A workflow is a strong automation candidate if it passes all four of these:

**1. Repetitive**
Does this happen regularly — weekly, monthly, after every call, every time a client onboards? One-off tasks aren't worth automating. The value compounds with repetition.

**2. Rule-based**
Is there a consistent pattern to how it gets done? Even if the content changes, the structure should stay the same. A weekly performance summary follows the same logic every week — pull data, compare to last week, flag what's changed, write it up. The rules don't change even though the numbers do.

**3. Text-heavy**
The work involves writing, reading, summarising, drafting, or formatting. Claude handles text. It doesn't handle complex numerical modelling, design decisions, or relationship judgment. If the core of the task is moving information from one format to another — a transcript into action items, a CSV into a narrative, a brief into an email — you're in the right territory.

**4. Currently manual**
There's no existing tool doing this. If someone already has a report scheduler or a CRM doing the follow-up emails, there's nothing to build. You're looking for gaps where someone is doing something by hand that follows a predictable pattern.

## Common Workflows That Pass the Filter

These come up regularly in agency and PPC contexts:

- **Weekly performance summary** — Campaign data CSV comes in, someone turns it into a client-ready narrative. Same structure every week, just different numbers.
- **Post-meeting follow-up email** — After every client call, someone writes up action items and sends a follow-up. The inputs (transcript or notes) and outputs (email) are predictable.
- **Meeting prep brief** — Before a client call, someone pulls together recent data, account notes, and open questions into a brief. Same shape every time.
- **Budget pacing alert** — Spend vs budget is checked weekly or mid-month, and someone flags accounts that are running fast or slow. Rule-based, repetitive, low judgment required.
- **Client onboarding doc** — Intake form answers get turned into a structured onboarding document and a first contact email. Clear inputs, predictable outputs.

What these have in common: the inputs are consistent, the output structure is consistent, and the transformation in between follows rules you can write down.

## Common Workflows That Don't Pass the Filter

Knowing what not to build first is just as important.

**Strategy recommendations** — Too much judgment involved. What to do with an account depends on context that shifts constantly. Claude can help inform strategy, but it can't own it.

**Client crisis management** — When a client is upset, the response depends entirely on the relationship, the history, and the specific situation. Not rule-based.

**Highly variable creative work** — Ad copy for a brand-new client with no reference material, no tone guide, no examples. You can help, but the first draft isn't automatable in a meaningful way yet.

**Sensitive internal processes** — Performance reviews, billing disputes, contract negotiations. Even if they're repetitive, the stakes make automation inappropriate until you have much more trust in the output.

**Anything where a mistake is expensive** — If getting it wrong means a client loses money or trust, start somewhere lower risk first.

## The "Is This Automatable?" Checklist

Use this during or after your discovery session. Go through each question quickly — it takes about two minutes per workflow.

- [ ] Does this happen at least once a month?
- [ ] Does it follow the same steps each time?
- [ ] Is the main work reading, writing, or reformatting text?
- [ ] Is someone currently doing this manually?
- [ ] Are the inputs predictable? (Not "it depends what the client sends")
- [ ] Is the output a document, email, summary, or structured text?
- [ ] If Claude got it 90% right, would that still save significant time?
- [ ] Would a mistake here be recoverable? (Human reviews before it goes out)

If you get 6+ yes answers, it's a strong candidate. Under 5, put it in the "later" pile.

## How to Handle the Workflow They're Most Excited About

Clients and team members often have a favourite idea. It's usually something impressive-sounding — "Can you automate our entire reporting workflow?" or "Can we build something that handles all the client emails?"

Sometimes those ideas pass the filter. Often they don't — or they're too big to start with.

When you need to set a different direction, don't say "that won't work." Instead, explain the logic:

> "That one's interesting and I want to come back to it. For the first build, I'd rather start with something tighter so we can see results quickly and I can get a feel for how you work. Once that's running well, we can tackle the bigger stuff with a better foundation."

Most people accept that reasoning because it's honest and it still acknowledges their idea. You're not dismissing it — you're sequencing it.

The goal at this stage is to leave the discovery session with a short list of 2–4 workflows that pass the filter, ranked by how good a first build each one would be. The next lesson covers how to make that final call.
`,
      },
      {
        id: "3-3",
        title: "3.3 Prioritising Where to Start",
        content: `# 3.3 Prioritising Where to Start

After a good discovery session you'll usually have more than one workflow worth building. That's a good problem to have — but it still needs solving. Picking the wrong first workflow doesn't just waste a week. It can undermine the whole rollout.

This lesson gives you a clear framework for choosing where to start, how to sequence what comes after, and how to communicate a roadmap without overcommitting.

## Why the First Skill Matters More Than It Should

The first thing you build sets the tone for everything that follows. If it works well and saves obvious time, people get excited. They bring you more ideas. They actually use it. The second build is easier to justify.

If the first thing you build is slow, glitchy, or solves a problem nobody felt urgently, adoption stalls. Suddenly you're fighting to prove the value of something that should have been demonstrating it.

This isn't a technical problem. It's a trust problem. And trust compounds in both directions.

So the goal with the first build isn't to be impressive. It's to be useful, fast, and reliable. Give people a win they can feel immediately.

## The Fast-Win Framework

When you have 2–4 workflows that passed the automatable filter, score each one against two dimensions:

**Repetition — How often does this happen?**
Daily or weekly beats monthly. Monthly beats quarterly. The higher the frequency, the faster the value shows up and the more quickly you get feedback on whether it's working.

**Risk — What happens if the output isn't perfect?**
A draft that a human reviews before it goes out is low risk. An email that sends automatically to clients is higher risk. A financial calculation is higher risk still.

The formula is simple: **highest repetition + lowest risk = start here.**

That usually points to something like a weekly performance summary or a post-meeting follow-up email draft. These happen often, they're reviewed before they leave the building, and the value is immediately obvious when they work.

## Applying It in Practice

Imagine discovery surfaces three workflows:

1. Weekly performance summary (every week, human reviews before sending)
2. Budget pacing alert (mid-month, reviewed before sending)
3. Client onboarding document (happens 2–3 times a month, sent directly to clients)

Score them:

| Workflow | Frequency | Risk | Verdict |
|---|---|---|---|
| Weekly performance summary | High | Low | Start here |
| Budget pacing alert | Medium | Low | Build second |
| Client onboarding doc | Medium | Medium | Build third |

The weekly performance summary wins. It happens every week so you'll know within two cycles whether it's working. A human reviews it before it goes out, so if Claude produces something off, the damage is zero. And when it does work, it saves real time every single week.

Start there. Get it running. Then move to the next one.

## Sequencing the Roadmap

Once you've picked the first build, think about the order for what follows. The general principle: **go from low risk to higher risk, and from simple to complex**.

After a simple, high-frequency skill is running well:
- Add more workflows in the same category (more reports, more briefing types)
- Then move to slightly higher-stakes outputs (things that go directly to clients without review)
- Then tackle more complex multi-step workflows (onboarding sequences, multi-email chains)

Don't jump to the complex stuff early just because it's possible. Confidence in the system — yours and the client's — needs to build alongside the capability.

## Communicating the Roadmap to a Client or Team Member

When you come back after discovery with your recommendation, keep the communication simple. You don't need a project plan. You need a clear answer to three questions:

**What are we building first?**
Name it specifically. "We're going to start with the weekly performance summary — the one where you turn the CSV into the client email."

**Why are we starting there?**
Give the actual reason. "It happens every week, the output is reviewed before it goes out, and it's the one where saving even 30 minutes a week compounds the fastest."

**What comes after?**
Give a rough sequence, not a timeline. "After that, we'll look at the meeting follow-ups, then the budget pacing alerts. But let's get the first one working properly first."

The key word in that last sentence is "properly." You're not committing to a delivery date or a project plan. You're saying: one thing at a time, done well.

Avoid the temptation to present a full roadmap with timelines upfront. It sounds impressive but creates expectations you can't always control. A loose sequence — "first this, then that, then we'll see" — gives you flexibility without seeming vague.

## The Decision Rule

If you're ever unsure which workflow to pick, apply this test:

> "If this is the only thing I build for this person, which one would they be most grateful for six months from now?"

That question cuts through everything. It forces you to think about ongoing, compounding value rather than one-time impact. The answer is almost always the high-frequency, low-risk workflow — because it delivers value every single week, not once.

Pick that one. Build it well. Then build the next.
`,
      },
    ],
  },
  {
    id: 4,
    title: "Building",
    outcome: "You can take any workflow description and turn it into a working Skill file — in the right voice, for the right person, doing exactly the right thing.",
    lessons: [
      {
        id: "4-1",
        title: "4.1 — Translating a Workflow Into a Skill File",
        content: `# 4.1 — Translating a Workflow Into a Skill File

Every workflow you want to hand off to a Trekker needs to become a Skill file. The Skill file is a markdown document that tells Claude exactly what to do, how to do it, and what to produce. If the file is vague, Claude will fill the gaps with assumptions — and those assumptions probably won't match what you or your client expects.

This lesson walks through the structure of a Skill file, section by section, using the post-meeting email workflow as the working example.

---

## The Five Sections Every Skill Needs

### 1. Goal

One or two sentences. What does this skill produce, and why does it exist?

**Example:**

> After a client meeting, produce a follow-up email that summarises the key decisions, lists action items with owners, and sets expectations for next steps. The email should be ready to send with minimal editing.

The goal anchors everything else. If you find yourself writing steps that don't serve this goal, cut them.

### 2. Steps

A numbered list of what Claude should do, in order. Each step is a concrete action, not a description of an outcome.

**Example:**

> 1. Read the meeting transcript provided by the Trekker.
> 2. Extract all decisions made during the meeting (look for phrases like "we agreed", "we'll go with", "let's do").
> 3. Extract all action items, including who is responsible and any deadline mentioned.
> 4. Draft a follow-up email addressed to the client using the agency's tone guide (see voice instructions below).
> 5. Format the email with a brief intro paragraph, a "Decisions" section, an "Action items" section with a simple table (Item | Owner | Due), and a closing sentence.

Notice: each step has a verb. "Read", "extract", "draft", "format". Not "consider" or "understand" — actual actions.

### 3. Tools

List what Claude is allowed to use: read files, write files, run scripts, make API calls, search the web. Be explicit. If you don't specify, Claude may try things you didn't intend.

**Example:**

> - Read the transcript file provided (no web search needed)
> - Write the finished email to a new file in \`/outputs/emails/\`
> - Do not call any external APIs

For simpler skills, this section might just say: "Text only — no file writes, no external tools."

### 4. Output Format

This is the section most Scouts forget, and it's the one that causes the most re-work.

Specify: format (markdown, plain text, HTML), length (short/long, word counts if it matters), structure (headers, bullet points, table), file name if it's being saved.

**Example:**

> - Format: markdown
> - Length: 250–400 words total (the client reads on mobile)
> - Structure: intro paragraph, H2 "Decisions" with bullet list, H2 "Action Items" with a three-column table (Item, Owner, Due Date), closing sentence
> - File name: \`[YYYY-MM-DD]-[ClientName]-follow-up.md\`
> - Save to: \`/outputs/emails/\`

The more specific you are here, the less the Trekker has to fix before sending.

### 5. Edge Cases

This is where you document the things that go wrong. You won't know all of them on day one — but you should capture them as they appear.

Common edge cases for the post-meeting email skill:

> - If no clear decisions were made, note this in the email: "We covered [topics] and will confirm direction by [date]."
> - If no action items were assigned to specific people, list the item and leave the Owner column as "TBD — confirm before sending."
> - If the transcript is unclear or incomplete, flag this in a comment at the top of the file: \`<!-- Transcript unclear — please verify action items before sending -->\`
> - If the meeting was a discovery call rather than a working session, skip the Decisions section and focus the email on next steps only.

---

## How Much Detail Is Too Much?

The right amount of detail is: enough that Claude produces the correct output without you reviewing every word.

Too little: "Write a follow-up email." Claude will produce something — but it might be too formal, too long, miss action items, or use language the client doesn't expect.

Too much: A 1,500-word skill file for a 300-word email. The steps become a maze, and when something breaks you can't tell where.

Aim for the minimum that produces the right result. Then add edge cases as you discover them.

---

## The Most Common Mistakes When Building for Trekkers

**Assuming context the Trekker doesn't have.** If your skill says "use the client's tone guide", the Trekker needs to know what that means and where to find it. Link to it or paste the key points directly in the skill.

**Skipping the output format.** You know what a good follow-up email looks like. The Trekker might not. Claude definitely doesn't know your preferences unless you tell it.

**No edge cases.** Real meetings are messy. Someone goes quiet, no decisions get made, the transcript cuts off. Write at least two or three edge cases for every skill before you hand it to a Trekker.

**Over-engineering the steps.** If you find yourself writing ten sub-steps inside a single step, that's a sign the skill is trying to do too much. Consider splitting it, or simplifying the output.

---

## The Pattern

When you sit down to write a new Skill file, work through the five sections in order:

1. What does this produce and why?
2. What does Claude do, step by step?
3. What tools can it use?
4. What does the output look like, exactly?
5. What can go wrong, and how should it handle that?

Answer those five questions clearly and you have a working skill. Everything else is refinement.
`,
      },
      {
        id: "4-2",
        title: "4.2 — Writing for Someone Else's Voice and Context",
        content: `# 4.2 — Writing for Someone Else's Voice and Context

A skill you build for your own workflow can be loose about voice. You know what you mean. You'll catch anything that sounds off.

A skill you build for a client cannot be loose. If the output sounds wrong — too formal, too casual, wrong terminology, wrong sign-off — the Trekker has to fix it before it goes anywhere. Do that enough times and the skill loses trust. People stop using it.

Getting voice right in a skill file is not a soft skill. It's a specification problem. Here's how to solve it.

---

## What "Voice" Means in a Skill File

Voice in a skill file is the combination of four things:

**Tone.** How formal or casual is the writing? Does the client use "Hi" or "Dear"? Do they write in first person or third? Short sentences or longer ones?

**Terminology.** What words do they use for the things they work with? "Campaign" or "program"? "Client" or "partner"? "Creative" or "assets"? These aren't interchangeable in the client's world.

**Naming conventions.** How do they refer to themselves, their team, their products? If the agency is "The Studio" internally but "Studio Name" to clients, that matters.

**Register.** Is the writing direct and punchy, or warm and reassuring? Does it hedge ("we think this might") or commit ("we recommend this")?

None of this can be inferred from a job title or a website. You have to ask.

---

## Questions to Ask in Discovery

When you're building a skill for a client, add these to your discovery process. You don't need all of them for every skill — pick the ones that apply.

- Can you show me three emails you've sent to clients that you were happy with?
- How do you typically open a follow-up email — any standard phrases you always use?
- Are there words or phrases you actively avoid? (Surprisingly useful. Clients often have strong preferences here.)
- How do you refer to yourself in writing — "I", "we", or by the agency name?
- What's your sign-off? Do you always include a specific line before your name?
- What do you call [the thing this skill writes about]? For example, do you say "meeting notes" or "recap" or "action log"?

Write these down. They go directly into the skill file, either in the voice instructions section or embedded in the output format section.

---

## How to Embed Voice in the Skill File

The simplest approach is a short "Voice and Tone" block near the top of the skill, before the steps. Something like:

> **Voice and Tone**
> Write in first person ("I" not "we"). Tone is warm but direct — no hedging, no excessive pleasantries. Open with one sentence that references something specific from the meeting. Sign off with "Talk soon," followed by the sender's name. Never use "please find attached" or "as per our conversation."

That block is a direct instruction to Claude. It's specific enough to be followed, short enough not to overwhelm the rest of the skill.

For terminology, use a simple glossary in the same section:

> **Terminology**
> - "Program" not "campaign"
> - "Partner" not "client" when writing to [Company Name]
> - "Creative team" not "designers"

This takes ten minutes to gather and saves the Trekker from fixing vocabulary in every output.

---

## The Same Workflow, Two Clients

Here's how the meeting prep skill would look different for two different clients.

**Client A: Formal B2B agency, financial services sector**

> **Voice and Tone**
> Professional and measured. Third person preferred in client-facing sections ("The team will…"). No contractions. Open with "Following our call on [date]". Close with "Kind regards". Avoid anything conversational.

**Client B: Casual digital studio, e-commerce clients**

> **Voice and Tone**
> Relaxed and direct. First person ("I'll" is fine). Short sentences. Open with something that references the conversation specifically. Sign off with "Cheers" or "Talk soon". Avoid corporate language — if it sounds like a legal document, rewrite it.

The workflow underneath is identical. The voice instructions are completely different. Both are specific enough that Claude can follow them without guessing.

---

## Testing Whether You've Got It Right

Write the skill, run it on a real example, and then ask the client (or Trekker) one question: "Does this sound like you?"

Not "Is this accurate?" — accuracy is a separate question. "Does this sound like you?"

If they say no, ask them to mark the specific phrases that feel wrong. Don't ask them to rewrite it — just mark what's off. Then update the voice block to address those specific phrases.

Two rounds of this is usually enough to lock in the voice.

---

## When the Client's Voice Is Inconsistent

Some clients don't have a consistent voice. Their emails vary depending on who wrote them or what mood they were in that day. You have two options:

**Pick the best examples and standardise.** Choose three emails they were happy with, identify the patterns across all three, and write those patterns into the skill. Tell the client: "I've based this on the examples you shared — let me know if I've got the tone right."

**Build in flexibility.** If the client genuinely writes differently for different audiences (warm for SME clients, formal for enterprise), consider separate skills or a "register" input the Trekker can set when they run the command.

What you shouldn't do is leave it undefined. An undefined voice produces inconsistent output, which erodes trust in the skill faster than anything else.

---

## The Discipline

Building for someone else requires you to capture what you'd normally leave in your head. That's the discipline. You can't rely on your own sense of what sounds right — you have to make it explicit enough that Claude can follow it, and a Trekker can trust it.

Get the voice right once, document it properly, and the skill keeps producing the right output indefinitely. Get it wrong, and the Trekker becomes a proofreader. That's not why you built the skill.
`,
      },
      {
        id: "4-3",
        title: "4.3 — Commands vs Skills: What to Build and When",
        content: `# 4.3 — Commands vs Skills: What to Build and When

There are two things you build in CoWork: Skills and Commands. They work together, but they do different things. Understanding the distinction saves you from building the wrong thing — or building the right thing in the wrong place.

---

## What Each One Does

**A Skill** is a markdown file that gives Claude context, rules, and instructions. It loads automatically in the background when certain conditions are met, or you reference it explicitly. The Trekker doesn't need to know it exists. It shapes how Claude behaves.

Think of a skill as standing instructions. "When producing any client-facing output, follow these tone rules." "When working with campaign data, here's what the columns mean and what to look for."

**A Command** is a slash command the Trekker types to initiate something. \`/weekly-summary\`, \`/meeting-email\`, \`/budget-check\`. The Trekker runs it. Claude executes the steps. An output appears.

Skills set context. Commands trigger action.

---

## The Decision Rule

Use this to decide what to build:

**Does the Trekker need to initiate it?** → Build a Command.

**Is it context Claude always needs when doing a certain type of work?** → Build a Skill.

**Is it a complex workflow with multiple stages?** → Build both: a Skill that holds the instructions, and a Command that runs it.

That's it. The rest is application.

---

## The Weekly Performance Summary as an Example

Here's how this plays out in practice.

The weekly performance summary workflow takes a campaign data CSV, produces a client-ready narrative summary, and saves it to an output folder. Three components:

**The Skill file** (\`weekly-performance-summary.md\`) holds everything Claude needs to know to do this well:

- What the CSV columns mean and which ones matter
- What "good" and "bad" performance looks like for this client
- The client's voice and formatting preferences
- Edge cases (what to say if conversions are zero, how to handle missing data)
- Output format: which sections the summary needs, in what order

**The Command** (\`/weekly-summary\`) is what the Trekker runs. It's a short markdown file that does one thing: it tells Claude to load the skill and run it with the file the Trekker provides.

\`\`\`
# /weekly-summary

Load the weekly-performance-summary skill and run it on the CSV file in /data/weekly/.

When done, save the summary to /outputs/weekly/ and confirm the file name.
\`\`\`

The Trekker types \`/weekly-summary\`. Claude loads the skill, reads the file, produces the summary, saves it, confirms. The Trekker copies the output and sends it to the client.

---

## Why Both Exist

You could put everything into the command. Some people do. It creates two problems.

First, commands become unwieldy. If your command file is 800 words of instructions, it's hard to update and harder to debug when something goes wrong. You don't know if the problem is in the voice instructions, the step sequence, or the output format specification.

Second, skills are reusable. The client voice instructions, the terminology glossary, the column definitions — those might apply to multiple commands. Write them once in a skill and reference them from any command that needs them. Change the skill once and every command that uses it picks up the change.

Keep commands short. Put the substance in the skill.

---

## When a Command Should Chain Multiple Skills

Some workflows are complex enough to need more than one skill. A pre-campaign briefing might need: the client context skill (who they are, what they're selling), the performance summary skill (what the data shows), and the voice skill (how to write for them). One command, three skills loading in sequence.

The command handles the orchestration:

\`\`\`
# /campaign-brief

1. Load client-context for [ClientName]
2. Load the weekly-performance-summary skill
3. Load the [ClientName]-voice skill
4. Produce a pre-campaign brief using all three as context
5. Save to /outputs/briefs/ and confirm
\`\`\`

This works because the skills are modular. You can update the voice skill without touching the performance summary skill. You can reuse the client context skill in other commands. When something produces the wrong output, you can isolate which skill is the problem.

---

## When to Keep Things Separate

The temptation when building for clients is to make one big command that does everything. Resist it.

Separate commands are easier to debug. If \`/campaign-brief\` produces the wrong output, you don't know what went wrong. If \`/weekly-summary\` produces the wrong output, you know the problem is in the weekly-performance-summary skill or the data file — that's a much smaller search.

Separate skills are easier to update. Client voice changes? Update one skill. Column definitions change? Update one skill. Everything that references that skill picks up the change automatically.

Build small. Combine when you need to.

---

## The Practical Test

When you're deciding what to build, ask:

1. Does a Trekker need to trigger this? → Command.
2. Does Claude need this context to do anything related to this client or topic? → Skill.
3. Is this workflow big enough to have multiple distinct stages? → Skill for the substance, Command for the trigger.
4. Am I building one thing that does too many separate things? → Split it.

The goal is a system the Trekker can use without thinking about the architecture underneath. They run a command. The right skills load. The output appears. That's the whole experience.

Your job as the Scout is to make sure the architecture is solid enough that the experience is exactly that simple.
`,
      },
    ],
  },
  {
    id: 5,
    title: "Connecting and Testing",
    outcome: "The workflow connects to the right tools, runs on a schedule without anyone triggering it, and you've stress-tested it enough to hand over with confidence.",
    lessons: [
      {
        id: "5-1",
        title: "5.1 Connecting to Tools via MCP",
        content: `# 5.1 Connecting to Tools via MCP

Cowork becomes dramatically more useful the moment it can read from and write to the tools your team and clients already use. That's what MCP — Model Context Protocol — makes possible. Before you can schedule automations or hand skills off to Trekkers, you need Cowork talking to the right tools. This lesson covers how that works.

## What MCP Actually Is

Think of MCP as a bridge. On one side is Cowork (and Claude). On the other side are external applications: Google Sheets, Slack, HubSpot, Monday, ClickUp, email clients, databases. MCP defines a standard way for Cowork to send requests to those tools and receive data back.

Without MCP, you're stuck importing files manually or copy-pasting data into a conversation. With MCP, a skill can read a client's live spend data from a Google Sheet, pull a deal status from HubSpot, or post an alert to Slack — all without a human touching it.

MCP servers are small programs that sit between Cowork and the external tool. Each tool has its own MCP server. When you configure an MCP connection in Cowork, you're telling it which server to talk to and how to authenticate.

## Common Connections for Agency Work

For a PPC or Google Ads agency, the most common MCP connections are:

- **Google Sheets** — where most clients store budgets, pacing data, and performance summaries
- **Slack** — the standard channel for automated alerts and notifications
- **HubSpot or another CRM** — for reading client records, deal stages, or contact info
- **Email (Gmail or Outlook)** — for drafting and sending automated summaries
- **Google Ads (via the 8020mcp server)** — for reading campaign-level performance data directly

You don't need all of these on day one. Start with the tools the specific workflow actually requires.

## Setting Up a Basic MCP Connection

The exact steps depend on which tool you're connecting, but the pattern is consistent:

1. **Identify the MCP server** — find or confirm the server for the tool you need. Some are pre-built and available publicly (Google Sheets, Slack). Others you may need to configure or install.

2. **Add the server to your Cowork configuration** — this means adding the server details to your \`.mcp.json\` file (or equivalent config in your Cowork setup). You'll specify the server name, the type (usually \`http\` or \`stdio\`), and the endpoint or command to start it.

3. **Add the API credentials** — every MCP server needs authentication. For Google Sheets, that's a Google service account or OAuth token. For Slack, it's a bot token. These credentials go in your environment variables or Cowork's secrets management — never hardcoded in the config file.

4. **Test the connection** — before building any workflow around it, confirm the connection works. Run a simple query: list the sheets in a Google Sheets file, or fetch recent Slack messages from a channel. If that works, the plumbing is good.

## When a Client's Tools Are Different From Yours

This comes up constantly in agency work. You've built a workflow that reads from Google Sheets, but the client uses Notion. Or they use ClickUp instead of Monday.

Before you start building, ask the client to confirm which tools they actually use — and which ones they're willing to connect via API. Don't assume. A five-minute conversation up front saves hours of rework.

When a client uses a tool you haven't connected before, check whether an MCP server exists for it. Many common tools have community-built or vendor-built MCP servers. If not, you may need to use the tool's REST API directly, which adds complexity.

Document which tools each client workflow connects to. You'll need this when something breaks or when a team member takes over the account.

## Handling API Keys Without the Security Headache

API keys and OAuth tokens are the practical reality of MCP connections. Someone has to own them, and that someone needs to understand what access they're granting.

For internal team workflows, you'll typically manage credentials yourself — one set of agency-owned credentials for tools like Slack or your internal Sheets.

For client tools, it's cleaner to have the client create a dedicated service account or API token with read-only access where possible. This keeps your agency's credentials separate from theirs, and it means if a client offboards, you revoke their token without touching anything else.

Never store credentials in shared documents or chat threads. Use environment variables in Cowork's configuration. If Cowork is running on a server you control, use a secrets manager. If you're using a hosted Cowork environment, check how it handles secrets — most have a secure variable store built in.

The rule of thumb: least privilege access. If a skill only needs to read from a Google Sheet, don't give it write access. If it only needs to post to one Slack channel, don't grant workspace-wide permissions.

Get the connections right here, and everything in the next two lessons — scheduling and testing — becomes straightforward.
`,
      },
      {
        id: "5-2",
        title: "5.2 Scheduling: Automations That Run Themselves",
        content: `# 5.2 Scheduling: Automations That Run Themselves

The difference between a tool and an automation is simple: a tool waits to be used, an automation just works. Cowork's built-in scheduling is what turns the skills you've built into the second category. This lesson walks through how to set up a schedule, how to choose what to schedule, and how to confirm it's actually running before you hand anything over.

## How Scheduling Works in Cowork

Unlike Claude Code — where you'd need to set up an external cron job or task scheduler to run anything on a timer — Cowork handles scheduling natively. You define a schedule directly in the workflow configuration, and Cowork handles the rest.

To set up a schedule:

1. **Open the workflow you want to schedule** in Cowork. This should be a skill that's already been tested and works correctly when triggered manually.

2. **Find the trigger settings** — in Cowork's interface, each workflow has a trigger section. Switch the trigger type from "manual" to "scheduled."

3. **Set the frequency** — common options are: every N minutes, daily at a specific time, weekly on a specific day and time, or a custom cron expression if you need more control (e.g., weekdays only at 8am).

4. **Set the timezone** — this is easy to overlook and causes real problems. Make sure the schedule is set to the client's timezone, not your server's default. A budget alert that fires at 8am is useful. One that fires at 8am UTC when the client is in Sydney is not.

5. **Save and activate** — most scheduling setups require an explicit activation step. Don't assume saving is enough. Look for an "enable" or "activate" toggle and confirm it's on.

6. **Check the run history after the first scheduled trigger** — don't just walk away after activating. Come back after the first scheduled run time and confirm it actually executed. Look at the run log, check the output, verify any downstream actions (Slack messages sent, Sheet updated, email drafted) actually happened.

## What to Schedule vs What to Keep Manual

Not every skill benefits from scheduling. Some things need a human in the loop — a judgment call, client approval, or context that changes each time.

**Good candidates for scheduling:**

- **Budget pacing alerts** — these run every day (or multiple times a day), check spend against target, and post to Slack or email if something is off. The logic is consistent, the data source is live, and the action is low-stakes enough to automate fully.

- **Weekly performance summaries** — every Monday morning, read the last 7 days of data from Google Sheets or the Ads API, generate a narrative summary, and send it to the client or save it to a shared folder. No one needs to remember to do this.

- **Daily data pulls** — if you're reading from Google Ads and writing to a Google Sheet, scheduling this means the Sheet is always current when someone opens it.

- **Status check-ins** — a simple daily confirmation that data pipelines are running, files are present, or accounts are active.

**Better left as manual triggers:**

- Anything that requires reviewing before sending (e.g., a draft email that needs personalisation)
- Skills that depend on inputs that change unpredictably (e.g., "run this after Mike's call")
- Workflows in early testing — run manually until you're confident, then schedule

## Confirming a Scheduled Task Is Actually Running

This is where a lot of people get caught out. Activating a schedule and confirming it works are two different things.

Before you hand over any scheduled skill:

1. **Check the first run manually** — either wait for the first scheduled trigger and review the run log, or temporarily set the schedule to run in the next few minutes so you can watch it happen. Then reset to the proper frequency.

2. **Verify the output** — don't just check that the skill "ran." Check what it actually produced. Did the Slack message appear in the right channel? Is the Google Sheet updated with current data? Did the email draft appear in the right inbox?

3. **Check for silent failures** — some workflows appear to succeed but produce empty or incorrect output. A skill that reads from a Sheet and finds no data might complete without error but send a blank summary. Test with real data.

4. **Document the schedule** — write down: what the skill does, when it runs, what it reads, what it writes or sends, and where to check if something goes wrong. This goes in the skill's documentation (covered in more detail in Module 6).

## The Difference Between a Skill a Trekker Uses and One That Just Works

This is a useful framing to keep in mind as you build.

Some skills are tools for Trekkers — they trigger them when they need something done. The Trekker is the actor.

Scheduled skills are different. The Trekker isn't triggering anything. The automation runs whether they think about it or not. The Trekker is the recipient — they get the output (the Slack alert, the summary email, the updated Sheet) without doing anything.

That's a much higher bar. If a manual skill occasionally needs a retry, a Trekker can do that. If a scheduled skill silently fails for three days, no one knows until a client asks why they haven't received their weekly summary.

Get the scheduling right, test it thoroughly, and you've built something that genuinely saves your team time without creating a new thing for them to manage.
`,
      },
      {
        id: "5-3",
        title: "5.3 Testing Before Anyone Touches It",
        content: `# 5.3 Testing Before Anyone Touches It

A skill that breaks in front of a client or a team member is worse than no skill at all. It damages trust, creates cleanup work, and makes people skeptical of the next thing you build. Thorough testing before handoff is not optional — it's the difference between automation that earns confidence and automation that people quietly stop using.

This lesson gives you a practical testing process you can run on every skill before it goes to a Trekker or a client.

## Why Testing Matters More in Cowork Than in Claude Code

When you're building for yourself in Claude Code, you're the one who knows when something goes wrong, and you can fix it immediately. When you hand a skill to a Trekker, they don't have that context. They'll see an error message, try once more, and then go back to doing it manually — or worse, come to you every time it breaks.

Clients are even less forgiving. They've been told this automation will save them time. If it fails on day one, the trust is gone.

Test as if you won't be there to explain what went wrong.

## The Pre-Handoff Testing Checklist

Run through each of these before signing off on any skill:

**1. Run with good input**
This is the obvious one, but be deliberate. Use real data that represents a normal use case. Confirm the output is correct — not just "it ran without erroring," but that the actual output is what you'd want a client to see. Check formatting, numbers, names, and any conditional logic.

**2. Run with bad input**
What happens if someone feeds the skill incorrect data? A wrong file name, a column that's been renamed, a number where text is expected. Does it fail gracefully with a useful error message, or does it produce a confusing output or silent failure? Fix any case where the skill behaves badly on bad input.

**3. Run with missing data**
What if the Google Sheet has no data for the date range? What if the Slack channel doesn't exist? What if the MCP connection times out? The skill should handle missing or unavailable data without crashing, and it should communicate clearly when something is missing rather than producing an empty result with no explanation.

**4. Check the output format**
Is the output readable by someone who didn't build it? If it's a Slack message, does it look right in Slack — not just in the run log? If it's an email draft, open the draft. If it's a Sheet update, open the Sheet. View the output the way a Trekker or client will see it, not just the way Cowork shows it internally.

**5. Check edge cases**
Think about what unusual but plausible inputs look like. A client with zero spend on a particular day. An account with a campaign name that has special characters. A transcript that's unusually long. Test at least one or two edge cases that feel realistic for the specific workflow.

## Stress-Testing Scheduled Setups

For any skill that runs on a schedule, add these additional checks:

**Run it twice in a row.** Does the second run produce duplicate output (two Slack messages, two Sheet rows)? Scheduled skills need to be idempotent — running them again shouldn't break anything or create noise.

**Simulate a missed run.** If the skill reads "last 7 days of data" and it runs weekly, what happens if it runs 8 days after the previous run? Does it still produce sensible output, or does it silently miss a day?

**Check the run log after the first real scheduled execution.** Don't assume the activation step was enough. Come back after the first real trigger and confirm everything executed as expected.

## What "Done" Means Before Handoff

A skill is ready to hand over when:

- It works correctly on normal input
- It fails gracefully on bad or missing input
- The output is readable and correctly formatted
- You've tested it the way a Trekker or client will use it (not just the way you use it)
- Scheduled skills have been confirmed running at least once
- You have documented what it does, what it connects to, and where to check if something breaks

If you're not confident you could step away for two weeks and the skill would still work without you, it's not ready.

## Document What You Tested

This step is easy to skip when you're in a hurry. Don't skip it.

Keep a simple testing log alongside each skill. It doesn't need to be long. Something like this:

---

**Skill:** Weekly Performance Summary
**Tested:** 2026-03-10
**Tested by:** Mike

| Test | Result |
|------|--------|
| Normal input (7 days, full data) | Pass — correct output, correct formatting |
| Empty data range | Pass — returns "No data available for this period" |
| Missing Sheet connection | Pass — errors with clear message, no crash |
| Duplicate run (ran twice) | Pass — second run overwrites, no duplicate Slack message |
| First scheduled run confirmed | Pass — ran at 8am AEDT Monday, Slack message received |

---

This log serves two purposes. First, it forces you to actually run the tests. Second, it gives you something to refer back to if a client says "this broke last Tuesday" — you can check whether that scenario was covered in testing or whether it's something new.

Copy the table format above, adapt it to the skill, and save it with the skill documentation. Future you — or whoever picks this up next — will thank you.

Testing isn't the last step before handoff. It's what makes handoff possible.
`,
      },
    ],
  },
  {
    id: 6,
    title: "Deploying to Your Team",
    outcome: "Your Trekkers have Cowork set up, they know how to use it, and you have a system for growing the skill library as the team's needs evolve.",
    lessons: [
      {
        id: "6-1",
        title: "6.1 — Setting Up Cowork for a Trekker",
        content: `# 6.1 — Setting Up Cowork for a Trekker

Before any team member opens Cowork, you need to do the setup work. Not because they can't figure things out, but because the first experience sets everything. A cluttered workspace with half-finished skills and cryptic command names sends a signal: this is a prototype. A clean, intentional workspace sends a different signal: this is a tool we actually use here.

Your job is to make the right thing the only obvious thing.

## Folder Structure

Cowork uses a folder and file structure that shapes what Claude sees as context. For a Trekker, the relevant files are the ones specific to their role — not everything in your Scout setup.

Create a dedicated folder for each role's working files. An account manager doesn't need access to the folder you built your skills in, or your personal inbox processing setup, or last month's client audit. Those files will just add noise.

A clean Trekker setup typically has:

- A **role folder** with the files they'll actually reference (client briefs, account context, templates)
- A **skills folder** containing only the skills they're meant to use
- A **commands file** that surfaces only the commands relevant to their work

Keep your own Scout files separate. If you're working in the same Cowork instance, organise so your stuff doesn't bleed into their view.

## Which Skills to Surface

You've probably built more skills than any one team member needs. Don't expose all of them.

For each Trekker role, pick the three to five skills that map directly to their daily work. Everything else stays in the background — not deleted, just not surfaced in their command list.

The test: if a Trekker looked at the command list and saw ten options, would they know which one to use right now? If the answer is no, there are too many. Reduce until the answer is obvious.

Skills they'll use daily go at the top. Skills they'll use occasionally go in a clearly labelled section below. Skills they'll never use don't appear at all.

## Which Commands to Expose

Commands are how Trekkers will interact with Cowork most of the time. The names and descriptions you give these commands matter more than you'd think.

Avoid internal names that made sense to you while building. "Run account review" is better than "account-audit-v3". The command name should describe what happens, not what the skill is called in the file system.

Write a short description for every command. One sentence. What does it do, and when would you use it? This is the most important documentation your Trekkers will ever read, and most of them won't read anything else.

Use consistent naming conventions. If some commands start with verbs and others start with nouns, it feels unfinished. Pick a pattern and stick to it.

## Making the Workspace Look Finished

A workspace that looks like a work in progress invites tinkering and questions. You want neither when someone is trying to do their job.

Before a Trekker touches it:

- Remove any test skills, draft skills, or skills named "v2" or "new-version"
- Make sure every command has a description
- Check that the skills actually work end-to-end (run them yourself with realistic inputs)
- Remove any placeholder content in templates or context files
- Set the project instructions so Claude knows it's working with a Trekker — not a Scout. The tone and depth of responses should match the audience.

This last point is worth pausing on. If Claude's default responses assume a technically literate user, a Trekker will get output that's harder to use than it should be. Adjust the system prompt so responses are clear, direct, and action-oriented — not exploratory.

## First Impressions

The first time someone opens Cowork, they're forming a view of whether this is worth their time. A few small things compound:

- The project name should be clear and specific ("Client Reporting — Account Managers"), not generic ("Cowork")
- If there's a welcome message or instructions file, write it for a human, not a developer
- The first command they'll run should have the most obvious name in the list
- Test the setup on a fresh machine if you can, or ask a colleague to look at it cold before it goes to the team

You're not shipping code. You're shipping a work environment. Treat it accordingly.

## The Checklist Before Handover

Before you hand a Trekker access to Cowork, run through this:

- Folder structure is clean and role-appropriate
- Only relevant skills are exposed
- Every command has a clear name and one-line description
- All skills work end-to-end with realistic test inputs
- System prompt is tuned for a non-technical user
- No draft, test, or half-built skills are visible
- The workspace name and any welcome text make sense to someone seeing it for the first time

When you can check all of these off, you're ready to onboard.
`,
      },
      {
        id: "6-2",
        title: "6.2 — Onboarding Team Members",
        content: `# 6.2 — Onboarding Team Members

Most tool rollouts fail the same way. Someone sends a Slack message with a link and says "give this a try." People open it, poke around for ten minutes, don't immediately understand the point, and quietly go back to what they were doing before.

That's not a training problem. It's a design problem. The goal of onboarding is to get someone to a genuine win as fast as possible — before they've had time to form an opinion about whether this is going to be worth their effort.

## One Demo, One Command, One Win

The structure of a first session is not "here's how Cowork works." It's:

1. Show them one thing it can do — something directly relevant to their work
2. Have them run one command themselves — the same thing you just showed them
3. Let the output speak for itself

That's it. That's the whole first session.

Pick the command carefully. It should be something that takes them time to do manually, produces output they can actually use right now, and has a short enough run time that they're not sitting there waiting and wondering. A weekly client summary, a keyword expansion, a first draft of a report section — whatever is most immediately relevant to their role.

The sequence matters. You run it first so they see it work. They run it second so they experience the control. The win is something they can use today, not a hypothetical benefit.

Don't extend the session beyond this. If they're curious, that's great — tell them you'll go through more next time. Ending with them wanting more is a better outcome than exhausting their goodwill with a two-hour walkthrough.

## What NOT to Explain

Resist the urge to explain how it works underneath. Trekkers don't need to know what's in the skills folder, how the system prompt is structured, what Claude is doing when it processes the command, or why you chose this particular setup. That's Scout knowledge. Sharing it in an onboarding session creates the impression that they'll need to understand all of it eventually.

Don't explain:

- How the files are organised behind the scenes
- What Claude is (beyond "an AI tool we've configured for our work")
- The distinction between skills and commands
- Anything that would take longer to explain than to just show

The moment you start explaining infrastructure, you're no longer onboarding — you're teaching. Save teaching for people who ask specific questions about specific things they want to change.

## Sequencing a Team Rollout

If you're rolling out to multiple team members, don't do it all at once.

Start with one person. Someone who's open to new tools, not someone who's sceptical. Get them to a win, get their feedback, and let them tell the next person about it. Word of mouth from a peer is worth more than any training session you could run.

Rollout by role, not by individual. Get all the account managers using one skill before moving to another team. This way you can improve the skill based on real feedback before the next group sees it. It also means problems surface in a controlled way rather than everyone hitting the same issue simultaneously.

Wait until someone is actually using a skill before introducing another one. Adding features nobody's using yet is how a workspace gets cluttered and confusing.

## Handling the Sceptic

You'll have someone who says "I'd rather just do it in Excel" or "I can write this faster myself." Don't argue with them.

Acknowledge it: "That makes sense — you've got a system that works." Then ask if you can show them one thing, and run the same demo you'd run with anyone else. If they still prefer their own approach after seeing it, let them. Mandating adoption of a tool that someone doesn't want to use produces compliance, not results.

The better strategy is to let the results of other people's use do the selling. When a colleague produces a client brief in three minutes that used to take forty-five, that's more persuasive than anything you'll say.

## Building the Habit

Habit formation is about repetition in the same context, not motivation. You want Cowork to be the first thing someone opens when they sit down to a task, not something they remember to try after they've already started doing it manually.

A few things that help:

- Run the first command with them at the start of their actual work day, not in a training session. Context matters.
- For the first week, check in briefly — "did you use it for X this week?" Not to pressure them, but to surface friction early.
- If there's a task type they do repeatedly, build the skill for that specifically and make it the default way to start that task.
- Don't introduce a second skill until they've used the first one at least five times. Depth before breadth.

The goal isn't to get everyone using every skill. It's to get each person using the two or three skills that save them the most time, consistently. That compounds. A team that uses three skills daily is producing far more value than a team that occasionally tries ten.
`,
      },
      {
        id: "6-3",
        title: "6.3 — Maintaining and Growing the Team Skill Library",
        content: `# 6.3 — Maintaining and Growing the Team Skill Library

Deploying Cowork is not a one-off project. The initial setup gets you started, but the value compounds over time only if the library stays healthy. Skills that made sense six months ago may no longer fit how the team works. New tasks emerge that don't have a skill yet. The workspace can drift from "clean and intentional" to "cluttered and confusing" without anyone noticing it happen.

Your ongoing role as a Scout is maintainer — not just builder.

## Adding New Skills

New skills should be added in response to a real need, not because you've thought of something interesting to build. The bar is: does someone on the team do this task repeatedly, and is the current manual process slower than it should be?

When you identify that need, build the skill in your Scout environment first. Test it with realistic inputs. When it works consistently, add it to the Trekker workspace.

Don't announce new skills by sending a message explaining what they do. Run the introduction the same way you ran initial onboarding: show them one demo, have them run it once, let them get a win. A Slack message about a new skill gets skimmed. A two-minute demo gets remembered.

Add one new skill at a time. Adding three at once means none of them get proper attention. Trekkers have a day job — they're not waiting for new tools to try.

## Retiring Skills

Skills that are no longer used are clutter. Clutter makes people scan past things they should notice. A workspace with twenty commands is harder to navigate than one with eight, even if only eight of the twenty are still relevant.

The signal that a skill is dead: nobody has used it in the past four to six weeks. Check with the relevant team member before removing it — sometimes a skill is genuinely useful but seasonal. But if it's not being used and nobody misses it, remove it.

Don't rename old skills and archive them in a "legacy" folder. That folder will grow and become its own clutter problem. Delete the command from the Trekker view entirely. Keep the underlying skill file if you think you might need it again, but hide it from the workspace.

When you retire a skill, you don't need to make an announcement. If someone notices it's gone and needs it, they'll say something. Usually they won't notice.

## Keeping the Workspace from Getting Cluttered

Clutter accumulates gradually, which is why it's hard to notice until it's already a problem. Set a recurring check — once a month works well — where you look at the Trekker workspace with fresh eyes and ask: if I were new here, would this feel manageable?

The things that create clutter fastest:

- Commands with similar names that do slightly different things (rationalise into one)
- Skills that were built for a specific client or campaign but left in the general workspace
- Description text that's out of date because the skill was updated but the description wasn't
- Commands that are no longer alphabetically sorted or grouped logically

Keep the workspace at the minimum number of skills that covers the team's actual daily work. If you're adding more than you're retiring, stop and ask whether you're solving real problems or just building.

## Gathering Feedback from Trekkers

Trekkers won't spontaneously tell you a skill is frustrating to use. They'll either stop using it or find a workaround, and you won't know until you ask.

Build a lightweight feedback loop. The simplest version: every few weeks, ask each Trekker one question — "what's the skill you use most, and what's the one thing about it that could be better?" That's it. You're looking for specific friction, not general satisfaction ratings.

Common things you'll hear:

- The output needs reformatting before they can use it (the skill should do that automatically)
- They have to add the same context every time they run the command (build that context into the skill)
- The skill occasionally produces something unusable (improve the prompt or add input validation)
- There's a task they still do manually because there's no skill for it (you've found your next build)

Act on this feedback quickly. If someone tells you a skill is broken on a Tuesday and you fix it by Thursday, that builds confidence. If it takes three weeks, they stop reporting problems.

## The Scout's Ongoing Role

Once Cowork is deployed and the team is using it, your role shifts from builder to maintainer. That means:

- Monthly workspace reviews (clean up, retire dead skills, check descriptions are accurate)
- Quarterly conversations with each Trekker about what's working and what isn't
- Building new skills when real needs emerge, not when you have a good idea
- Being the person who knows what's in the library and why

This doesn't take much time if you keep up with it. A well-maintained skill library that the team actually uses is worth far more than a large one that gets ignored. The goal is depth of use, not breadth of capability.

The library compounds when people use it every day. It stagnates when it gets too complex to navigate or too out-of-date to trust. Your job is to keep it in the first state, not the second.
`,
      },
    ],
  },
  {
    id: 7,
    title: "Deploying to Clients",
    outcome: "You can set up Cowork for a client, teach them to use it confidently, and run a demo that makes the value immediately obvious.",
    lessons: [
      {
        id: "7-1",
        title: "7.1 — Setting Up Cowork for a Client",
        content: `# 7.1 — Setting Up Cowork for a Client

Setting up Cowork for a client is the same process as setting it up for your team. The tool is the same, the build process is the same, the logic is the same. What changes is the relationship — and that changes quite a bit.

When you're building for your own team, you can cut corners, ship rough versions, and iterate in full view of everyone. You can say "it's a bit clunky but it works" and nobody minds. You cannot do that with a client. The first version they see needs to be finished, even if you know you'll be improving it later.

Here's what that means in practice.

## Discovery is more structured

With your team, discovery is informal. You already know the workflows. With a client, you need to be deliberate. Before you write a single command, you want to understand three things: what they're doing repeatedly, where time is being lost, and what a good output looks like to them.

That last one matters more than most people realise. A good output to you might be dense and analytical. A good output to your client might be short paragraphs they can forward directly to their boss. If you don't know what "good" looks like before you build, you'll be guessing — and guessing costs time.

Run a proper discovery session. Ask them to walk you through the last time they did each task manually. Ask what they'd change about it. Ask who else reads the output. Take notes. That session will tell you exactly what to build.

## Access requests are more formal

You'll need access to some of their systems — maybe their Google Ads account, maybe their CRM, maybe just their Google Drive. With a team member you'd ask in Slack and move on. With a client, you want to do this properly.

Send a clear list of what you need access to and why. Give them options where possible (read-only vs. full access, for example). Don't ask for more than you need. And once you have access, document what you have — both for your records and so they can see it.

This isn't bureaucracy for its own sake. It builds trust. A client who sees you being careful with their access becomes a client who refers other clients.

## The workspace needs higher polish

Before a client sees it for the first time, the workspace should be clean. Commands should have clear, readable names. Descriptions should say what the command does in plain language — no jargon, no internal shorthand. The output should be formatted so a non-technical person can read it without guidance.

Test every command you're going to demo. Not once — multiple times. Run it with realistic data. Check the output looks right. Then run it again.

Clients remember the first impression. If it looks rough the first time they see it, they'll carry that impression forward even after you've improved it.

## Changes go through a process

Once a client is using Cowork, changes need to be managed deliberately. You don't push updates in the background without telling them. You don't quietly fix things and hope they notice.

Before you change anything, tell them what you're changing and why. After you change it, tell them what's different. This doesn't need to be formal — a short email is fine. But it needs to happen.

This matters especially if something breaks. If a command stops working and you fix it without saying anything, the client might not notice — but they also might have noticed it was broken and be waiting for you to bring it up. Being proactive about problems builds more trust than pretending they didn't happen.

## What if the client wants to make changes themselves?

Some clients will ask if they can edit commands or add their own. The honest answer is: they can, but you'd rather they didn't, and here's why.

Commands that work well are the result of careful prompting and testing. A well-meaning edit can break something that was working. The better model is to make it easy for them to request changes and quick for you to implement them — rather than giving them the keys and hoping for the best.

Offer a simple feedback channel: a shared doc, a Slack channel, a weekly check-in. Tell them that when they want something changed, they flag it to you and you turn it around quickly. That's a better service than handing over edit access — and it keeps you in the loop.

The goal is a workspace that works reliably for the client and is maintained properly by you. That's the foundation for an ongoing engagement.
`,
      },
      {
        id: "7-2",
        title: "7.2 — Teaching Clients to Use It",
        content: `# 7.2 — Teaching Clients to Use It

Your job is not to use Cowork for the client. Your job is to make them capable of using it, while you stay in the background as the person who builds and maintains it.

That distinction matters. If you do everything for them, they become dependent on you personally rather than on the system. The system stops being an asset they own and starts being a service you provide. That's a weaker position for both of you.

What you're aiming for is a client who can trigger a command, read the output, and know when something needs your attention. That's it. They don't need to understand how it works. They don't need to know anything about AI. They just need to be able to use it reliably.

Here's how to get them there.

## Run a short training session — 30 minutes maximum

More than 30 minutes and you're overcomplicating it. The commands they'll use every day are probably two or three at most. Focus on those and nothing else.

Start by showing them what they'll do each time — the exact sequence of steps. Open Cowork, select the command, run it, read the output. Walk through it once while they watch. Then walk through it again while they do it. Then let them do it on their own while you watch.

Don't cover every command in the workspace. Don't give them a tour of everything you built. Pick the two or three commands they'll use most and train those. The rest can wait until they're asking for it.

Before you finish, make sure they can find the workspace again on their own, run a command without prompting from you, and tell you what the output is telling them. If they can do those three things, the training worked.

## Make it feel easy without oversimplifying

There's a balance here. You want to make it feel simple — and it is simple, for the user — but you don't want to be condescending about it. Clients are smart. They know when they're being talked down to.

The right framing is: "This is designed to be straightforward. You trigger it, it does the work, you get the output. The complexity is all behind the scenes — that's what I handle."

Avoid explaining how prompts work, what models are involved, or anything about the underlying technology unless they specifically ask. If they ask, give a short answer and redirect: "It's using Claude in the background — what matters is that the output is useful to you. Does this look right?"

Use their language, not yours. If they call it a "report", call it a report. If they call it a "brief", call it a brief. Meet them where they are.

## What to do when a client is hesitant or nervous about AI

Some clients will be uncomfortable with AI. They might worry about data privacy, or feel like they're being asked to trust something they don't understand, or just find the whole thing a bit unsettling.

Don't push past it. Address it directly.

On data: be specific about what data goes where. If you know the details of how Claude handles data, share them. If you're not sure, find out before the session. Vague reassurances don't help — specifics do.

On trust: remind them that you've tested this. You've seen the outputs. You've built this specifically for how they work. You're not asking them to trust a generic AI tool — you're asking them to trust something you've built and tested for them.

On the general discomfort: acknowledge it. "A lot of people feel that way at first. Once you see it working on your actual work, that feeling usually goes away pretty quickly." Then show them. The demo does more than any explanation.

## Building their confidence

Confidence comes from repetition, not from explanation. The best thing you can do in a training session is let the client run the command themselves — multiple times if possible.

The first time they do it, it feels unfamiliar. The second time, it feels manageable. By the third time, they're starting to see it as normal.

If they make a mistake — run the wrong command, get confused about what to paste in — treat it as completely expected. Don't make a big deal of it. Just redirect and try again. The goal isn't a perfect run through the training; it's them feeling like they can do this on their own.

## What "capable" actually looks like

By the end of the session, a capable client can:

1. Open Cowork and find the right command without help
2. Run it successfully with their own data
3. Read the output and understand what it's telling them
4. Know when to use it and when to flag something to you

That last point is worth making explicit in the training. Tell them directly: "If the output ever looks wrong, or if you're not sure about something, send it to me. You don't need to figure it out yourself — that's what I'm here for."

That framing takes the pressure off them and keeps you in the loop. It also sets up the ongoing relationship correctly: they use it, you support it, both of you benefit.
`,
      },
      {
        id: "7-3",
        title: "7.3 — The Demo That Creates the Moment",
        content: `# 7.3 — The Demo That Creates the Moment

You are not trying to explain how Cowork works. You are trying to create a single moment where the client thinks "I need this."

Everything about the demo is built around that moment. The setup, the timing, what you say, what you don't say — all of it is designed to create one clear before-and-after that the client can see with their own eyes. Once they've had that moment, everything else becomes easier: the handoff, the training, the ongoing relationship.

If you explain first and demo second, you've already lost. Explanations trigger questions. Questions lead to rabbit holes. Rabbit holes kill momentum. Show first. Explain only what gets asked.

## Set up the "before" scenario

Before you touch Cowork, establish the problem you're about to solve. You want the client to have the old way fresh in their mind so the contrast lands.

The easiest way to do this is to ask a question they already know the answer to. Something like: "How long does it usually take you to pull together a performance summary after a campaign review?" They'll tell you. Ten minutes. Half an hour. Whatever it is.

Then: "And what does that process look like?" Let them describe it — pulling data, writing it up, making it readable, sending it. Nod along. Don't comment yet.

Now you have the before in their head. The work they're doing manually, the time it takes, the steps involved. You haven't said anything about what you're about to show them. You've just reminded them of the problem.

## Choose the right workflow to demo first

The best first demo is the one with the most visible time saving. For most agencies, that's either the weekly performance summary or the post-meeting email.

**Weekly performance summary:** You paste in campaign data, run the command, and get a structured, client-ready report in seconds. The contrast is stark — data in, readable summary out. The client can see immediately that this would take them time to do manually.

**Post-meeting email:** You paste in a meeting transcript or rough notes, run the command, and get a formatted email with action items and a professional draft ready to send. If your client is someone who spends time on follow-up emails after every call, this one hits hard.

Pick whichever one is most relevant to that specific client's pain. If you built both, demo the more dramatic one first. You can show the second one later in the same session, but lead with the one that will create the moment.

## Script and rehearse it

A demo that's been rehearsed looks confident and effortless. A demo that hasn't looks shaky and unpolished. Given that your whole pitch is that this makes things easier, a stumbling demo undercuts everything.

Rehearse with real-looking data. Don't use placeholders or dummy text — use something that looks like an actual report or an actual meeting transcript. The closer it is to what the client actually deals with, the more it will resonate.

Know exactly what you're going to paste in before you start. Have it ready to copy. Know which command you're running. Know what the output will look like. The only thing that should feel "live" is the running of the command itself.

Time yourself. The whole thing — setup, run, output, reaction — should take no more than five minutes. If it's taking longer, cut something.

## What to say while it's running

When you trigger the command and it starts running, say something like: "This is where it's doing the work." Then stop talking.

Let the client watch. Let there be a moment of silence. Don't fill it with explanation. Don't narrate what's happening technically. The silence creates anticipation, and anticipation makes the output land harder.

When the output appears, don't immediately explain it. Let them read it first. Give them five to ten seconds. Then ask: "What do you think?"

Their response will tell you what landed. If they start asking questions about the content of the output, that's good — they're engaging with it as a real document. If they say "that's impressive," move forward. If they look uncertain, ask a more specific question: "Does that look like the kind of thing you'd normally write up yourself?"

## Handling questions about the technology

At some point they'll ask how it works. The short answer is: "It's running through Claude in the background — but what I've built is the logic specific to your work. The AI is just the engine."

If they press further — about data privacy, about accuracy, about what happens if it gets something wrong — answer directly and briefly, then redirect. "Data stays within the session, it's not stored or trained on. And on accuracy — that's exactly why I test everything before you see it. If something ever looks off, flag it to me."

Don't get pulled into a twenty-minute conversation about large language models. Answer the question, then bring it back to what they just saw: "But you've just seen it work on real data — does the output look right to you?"

## The goal is one moment, not a full education

The demo isn't training. It's not an explanation. It's a proof of value in five minutes.

You're looking for one moment where they stop thinking about whether this is interesting and start thinking about where else they could use it. When you see that shift — a question like "could it do this for X too?" — you're done. The demo worked.

Everything that comes after — the training, the handoff, the iteration — is easier once that moment exists.
`,
      },
      {
        id: "7-4",
        title: "7.4 — Iteration and Ongoing Support",
        content: `# 7.4 — Iteration and Ongoing Support

The first version you hand off is not the final version. It never is. This is not a failure — it's just how this works, and the way you frame it before handoff determines whether iteration feels like a normal part of the engagement or like something went wrong.

Set the expectation early. Before you hand over the workspace, say something like: "We'll refine this together over the first few weeks as you use it in practice. That's normal — we've built it based on what we know now, and using it with real work will show us where to improve it."

That one sentence changes everything. Now iteration is expected, not embarrassing. The client isn't waiting for it to break — they're anticipating the refinement cycle as part of how this works.

## Run a structured feedback session two weeks in

Don't wait for the client to bring problems to you. Two weeks after handoff, schedule a short call — 20 minutes — specifically to review how it's going.

"How's it going?" is not a useful question. It's too open-ended, and clients tend to say "fine" even when things could be better, because they don't want to seem difficult.

Ask specific questions instead:

- "Which commands have you used most in the last two weeks?"
- "Is there anything in the output that you regularly have to change before you use it?"
- "Is there anything you're still doing manually that you wish Cowork was handling?"
- "Has anything surprised you — in either direction?"

These questions surface real issues. "I always have to reformat the table before I send it" is actionable. "The meeting prep brief sometimes misses context because I have to add the client's background manually" is actionable. "Fine" is not.

Document what they tell you. Even if it's minor. Even if you already know about it. Having a record of the feedback and the changes you made based on it builds credibility over time.

## Turning vague feedback into specific changes

Clients don't speak in terms of prompts and outputs. They speak in terms of outcomes. "The summary doesn't quite feel like us" or "the tone is a bit off" sounds vague but it's telling you something specific.

Your job is to translate. Ask follow-up questions:

- "When you say it doesn't feel like you — what would it sound like if it did?"
- "Can you show me an example of the output you'd want to send, versus what you got?"
- "Is it the structure, the language, or the level of detail that feels off?"

Usually two or three questions will get you to a concrete answer. "The sentences are too long" or "it's using technical terms our clients don't know" or "we always lead with the key number, not the background."

Once you have that, you know exactly what to change in the command. Go make the change, run the command with the same data as before, and compare the outputs. If it's better, send the client a before-and-after so they can see what changed.

## Communicating changes back to the client

When you update a command, tell the client what you changed and why. Not a long explanation — just a short message.

Something like: "I've updated the performance summary command based on what you mentioned last week. The output now leads with the headline number and keeps the language simpler throughout. Worth running it on this week's data to see how it looks."

That message does three things: it shows you listened, it tells them what to look for, and it prompts them to test it. You're not asking them to trust that it's better — you're inviting them to verify it.

If a change doesn't land right, that's fine. Go again. This is normal product work. The client doesn't expect perfection on the first pass; they expect you to be responsive and to keep improving it.

## Making iteration feel normal, not like a sign something went wrong

The risk is that a client interprets repeated changes as a sign the system isn't working properly. That risk is almost entirely about framing.

If you treat every improvement as a problem you're fixing, it feels like the system has problems. If you treat every improvement as the system getting better, it feels like progress.

The language matters. Instead of "I fixed an issue with the output," say "I've refined the output based on how you're using it." Instead of "it wasn't quite right before," say "now that we've seen it in practice, here's what I've improved."

You can also normalise it by referencing what other clients go through: "Most of the refinement happens in the first month — after that, it tends to stabilise and you're just making small tweaks as your work evolves."

## The ongoing support model

After the first month, the pattern settles into something predictable. The client uses the commands. Occasionally something changes in their work — a new reporting format, a new client type, a shift in what they need from their summaries — and they flag it to you. You update the command and tell them what changed.

This is a low-maintenance, high-value ongoing engagement. You're not doing their work for them. You're maintaining the system that makes their work easier.

Make sure the client knows how to reach you when they need a change. Keep the feedback channel simple — an email address, a shared doc, a Slack message, whatever works for them. And be quick to respond when they flag something. Speed matters less than consistency, but turning around a small change in 24-48 hours reinforces that the system is well-supported.

That reliability — not the technology, not the cleverness of the commands — is what makes clients keep paying and keep referring.
`,
      },
    ],
  },
  {
    id: 8,
    title: "The Bigger Opportunity",
    outcome: "You see Cowork not as a one-off setup job but as the foundation of an embedded, ongoing relationship — with your team and with every client you work with.",
    lessons: [
      {
        id: "8-1",
        title: "8.1 Building a Shared Skill Library",
        content: `# 8.1 Building a Shared Skill Library

Every workflow you build for a client takes real work. The discovery conversation, the understanding of how their business operates, the iteration until the skill actually does what it's supposed to do. That work is worth more than one client.

The shift that separates Scouts who scale from those who stay stuck doing custom work forever is this: every skill you build is a library asset first, a client deliverable second.

## The Mindset Shift

When you build a content approval workflow for a social media agency, you are not building *their* content approval workflow. You are building *a* content approval workflow that this client happens to be the first to use. The next agency you work with gets the benefit of everything you figured out this time — and you get the benefit of a faster build with fewer mistakes.

This reframe changes how you approach the work. You start thinking about what's specific to this client versus what's universal to this type of business. You build accordingly.

## What Makes a Skill Reusable

The core of a reusable skill is separating the logic from the context.

Logic is the process: what the skill does, in what order, with what rules. This stays the same across clients in the same category.

Context is the specifics: the client's brand voice, their internal terminology, their preferred output format, their tools and systems. This changes per client.

In practice, this means building skills with two components:

**The skill file** — the instructions and logic that define what the skill does. Written generically enough to work across clients of the same type.

**The context file** — a client-specific configuration that gets loaded into the skill. Brand voice, style guide, key contacts, preferred formats, specific rules for this business.

When you install the skill for a new client, you keep the skill file and write a new context file. The install takes an hour instead of a week.

## Organising Your Library

A library that isn't organised is just a collection of files you'll never find again. Structure matters from the start.

A practical structure looks like this:

\`\`\`
skills-library/
  content/
    social-post-drafter/
    email-sequence-writer/
    blog-outline-builder/
  ops/
    meeting-summary/
    client-onboarding-checklist/
    weekly-report-compiler/
  finance/
    invoice-chaser/
    budget-summary/
  templates/
    context-file-template.md
\`\`\`

Categories by function rather than by client. When you build something new, you can immediately see where it belongs and whether something similar already exists.

Each skill folder should contain the skill file, a README explaining what the skill does, which client it was first built for, and any known variations or limitations, plus a changelog that tracks improvements over time.

## Versioning as You Improve

Skills get better. The first version of your meeting summary skill will be rougher than the version you have six months later after using it across a dozen clients. Version your skills.

The simplest approach: a version number in the skill file name or a version note at the top of the file, and a short changelog entry every time you make a meaningful change. You do not need complex tooling. You need to know whether Client A has version 1 or version 3 of a skill, and whether it is worth upgrading them.

When a skill improves significantly, that is also a natural reason to reach out to clients who have an older version. More on that in the next lesson.

## Building the Library From Day One

You do not need ten clients to start a library. You need one.

After your first client install, take an hour to extract the reusable parts. Strip out the client-specific context. Document what the skill does. File it properly. That is your library — one skill in it, ready for the next client who needs something similar.

Every install after that adds to it. The library builds itself as long as you are intentional about extracting the reusable core each time.

By the time you have five or six clients, you will have a library that makes you genuinely faster than a new entrant. By ten clients, it is a significant competitive advantage. That is what you are building toward.
`,
      },
      {
        id: "8-2",
        title: "8.2 The Skill Marketplace",
        content: `# 8.2 The Skill Marketplace

Here is a conversation that becomes available to you once you have a real skill library.

A client you set up six months ago mentions they are spending too much time on weekly reporting. You have already built a weekly report compiler for another client in a similar business. You say: "I actually built something for this exact problem for one of my other clients. It has been working well for them. Want me to install it for you?"

That is the skill marketplace model. Not a formal marketplace. Not a product catalogue. Just a Scout with a growing library of things that work, and clients who trust them enough to say yes when they offer something new.

## What This Looks Like in Practice

The offer is simple: here is a skill I built, here is the problem it solves, here is how it works in practice, and here is roughly what it takes to install and configure it for your setup.

You are not pitching software. You are offering a known solution to a known problem, based on your understanding of their business. The framing matters. "I've been building out my skill library and thought of you" lands very differently from "I have a new service I'd like to sell you."

The difference is that the first framing is about them. You thought of them. You saw a connection. That is how trusted advisors operate, and it is what you are becoming for these clients.

## Framing New Skills as Value, Not Upsell

The fastest way to make these conversations feel transactional is to make them feel like a sales call. Avoid that.

The better approach: lead with the outcome. "This saves most of my clients about two hours per week on reporting" is more useful than "I've built a new skill." What does it do for them? What problem does it solve? How quickly will they feel the benefit?

If you can name a specific pain point they have mentioned before and connect the skill directly to it, even better. "You mentioned in our last catch-up that the end-of-month reporting was eating into Friday afternoons. I've been working on something that handles most of that automatically."

That is not an upsell. That is a Scout paying attention.

## Packaging a Skill for Easy Installation

A skill that takes three hours to install across different client workspaces is hard to offer consistently. The closer you can get to a one-hour install — or even a thirty-minute install — the more freely you can offer skills to clients and the better your economics look.

This comes back to the context file approach from lesson 8.1. If your skill is already structured to separate logic from configuration, installation means creating a context file and testing. That is fast.

A few things that speed up installation further:

Write a standard onboarding checklist for each skill — what information you need from the client before you start, what setup steps happen in what order, how you verify it is working correctly. Run through this the same way each time.

Document the common edge cases. Every skill has quirks that only appear in specific situations. If you have installed a skill five times, you have probably seen the main ones. Write them down so you do not rediscover them each time.

Test with a real example before handover. Not a contrived test — something that reflects actual work the client does. The client gains confidence, and you catch any configuration issues before they do.

## The Natural Ongoing Touchpoint

Here is what the skill marketplace creates that is worth more than any individual sale: a legitimate reason to stay in regular contact with every client.

When you have a growing library, you are always learning which skills are working well across multiple clients, which ones are getting upgraded, and which new problems you are seeing come up again and again. That gives you things to talk about — and a reason to schedule regular check-ins that are genuinely useful rather than awkward "just checking in" calls.

Every time a skill from your library goes into a client, you have a natural follow-up conversation in a month: how is it working? What would make it better? Is the team actually using it?

Every time you significantly improve a skill, clients running older versions are a natural audience for an update conversation.

This is not a subscription you are selling — though over time, if clients are paying you monthly to maintain and expand their skill setup, that is exactly what it becomes. You are just not calling it that. You are calling it what it actually is: ongoing work that keeps delivering value.

Set that expectation from the start. The initial install is the beginning, not the end.
`,
      },
      {
        id: "8-3",
        title: "8.3 Becoming the Embedded AI Partner",
        content: `# 8.3 Becoming the Embedded AI Partner

There are two versions of what you could be to a client.

The first version: a consultant who comes in, sets up Cowork, trains the team, and moves on. Competent, professional, genuinely helpful. And easily replaced by the next competent person who comes along offering the same thing.

The second version: the person who knows how this business thinks, what the team struggles with, which workflows have been tried and abandoned and why, and where the next opportunity is. The person who built the skills that run parts of their day. The person they call when they want to do something new with AI.

That second version is not easily replaced. Not because of a contract or exclusivity — but because the knowledge and the relationship compound over time in a way that is genuinely hard to replicate quickly.

This lesson is about how to become that second version.

## What Embedded Actually Means

Embedded does not mean you are on-site every day. It means you are inside the client's operational thinking on an ongoing basis.

In practice, it looks like this:

You have a standing monthly or quarterly check-in that is not a sales call — it is a review. What is working? What has changed in the business? Where is the team spending time that feels inefficient? What new things are they trying to do that the current skill setup does not support?

You proactively suggest things. Between check-ins, when you build something for another client that feels applicable, you reach out. When you see a pattern in how they are using their skills that could be improved, you mention it.

You understand the business well enough to notice opportunities they have not named yet. That is the deeper service.

## The Ongoing Relationship in Practice

A practical structure for an embedded partnership:

**Monthly:** A short check-in — fifteen to thirty minutes. Review usage. Anything broken? Anything frustrating? Any upcoming projects where AI could help? This call keeps you current and demonstrates that you are paying attention.

**Quarterly:** A fuller review of the skill library. What has been built, what is being used, what has been retired, and what is planned for the next quarter. This is where you propose new builds and confirm priorities. It is also where you adjust pricing if the scope has grown.

**Ongoing:** Access to update and improve skills as needed. When a skill breaks because the client's process changed, you fix it. When a skill consistently gets poor results, you iterate on it. The client is not managing this themselves — that is part of the value of having you.

The client pays for this, whether as a retainer or a regular hourly block. You are not doing this for free. But the conversation around payment is much easier when the value is clear and ongoing — not a one-time project fee that always feels like it needs justifying.

## Why This Is Better for the Client

The alternative to having an embedded AI partner is managing all of this themselves. That means someone on the team takes responsibility for maintaining skills, figuring out what to build next, keeping up with how Cowork is evolving, and training new staff. For most agency clients, that is a distraction from the actual work.

When you are embedded, they do not have to think about any of that. They use the tools, they flag issues, and you handle the rest. The AI layer in their business works because someone is responsible for making it work.

Over time, the skills you build reflect real knowledge of their business. An instruction file that captures exactly how their team thinks about a problem is more valuable than a generic template. A skill tuned over six months of real use is more useful than one installed last week. The client gets something that genuinely fits how they work — not off-the-shelf.

## Why This Is Better for You

A client on a retainer is worth far more than a client on a project. Predictable income, lower acquisition cost, deeper relationships, and a clearer view of your forward workload.

Beyond the economics: embedded clients teach you more. You see what actually gets used. You understand the gap between what people say they want and what they do with it once it exists. That knowledge makes you better — faster to spot opportunities, sharper at scoping work, more confident in your recommendations.

Embedded clients also refer. When someone asks your client who set up their AI systems and whether they are happy with the result, they are not going to say "some consultant we hired once." They are going to name you, because you are still there.

## The Win-Win-Win

This arrangement works because all three parties benefit.

The client gets an AI layer in their business that actually keeps working and improving, without having to own that function themselves.

The client's business improves — they do things faster, with less friction, at better quality than before. That is the point. It is not just about having AI tools; it is about business outcomes.

And you get embedded relationships with clients who value what you do, pay you consistently, and want you to keep going. Not a project. A partnership.

That is the version worth building toward.
`,
      },
      {
        id: "8-4",
        title: "8.4 The Compounding Effect",
        content: `# 8.4 The Compounding Effect

Let me show you what this looks like from a distance.

You run your first discovery session. You build one skill. You install it. It works. You have the beginning of a library.

That feels small. It is small. But it is also the beginning of something that compounds — and compounding is not linear. It is slow at first, and then it is not.

## How the Compounding Works

The mechanism is straightforward, and it runs in three directions simultaneously.

**Your library grows.** Every skill you build adds to a library that makes the next install faster. Client two benefits from everything you figured out with client one. Client five benefits from four rounds of iteration and learning. The time it takes you to set up a new client decreases, but the quality of what you install increases. At some point, a new client install that would have taken you a week takes you two days — and the result is better.

**Your understanding deepens.** Every client you work with teaches you something about their industry, their business model, their operational challenges. An agency owner who sets up Cowork for five e-commerce brands knows things about how those businesses work that no one who has only worked with one of them knows. That expertise is real and it is valuable. It makes you sharper in discovery sessions. It helps you spot opportunities faster. It gives you credibility when you are talking to the next prospect in that space.

**Your capacity expands.** Faster installs and a growing library mean you can serve more clients without burning out. You are not starting from scratch each time. The work is more systematic, more repeatable, and — critically — more delegable if you ever want to bring someone in to help. Documented, organised skills are the foundation of a practice that can grow beyond just you.

These three compounding effects reinforce each other. A richer library speeds up installs, which means you can take on more clients, which means more workflows get added to the library, which means it gets richer. Meanwhile your understanding of client industries deepens, which improves the quality of what you build, which makes clients more likely to stay and refer.

## What 12 Months Looks Like

If you start today, run a discovery session this month, build one skill, and install it — here is roughly what 12 months from now could look like if you stay consistent.

You have worked with four to six clients. Some are on retainers; others have moved to quarterly check-ins. Your library has fifteen to twenty skills in it across content, ops, and reporting functions. Some of those skills are in use at multiple clients.

New installs take you significantly less time than they did at the start. You know what questions to ask in discovery. You know which skills tend to be most immediately useful. You can have a new client up and running with their first three or four skills in a day.

You have started to see patterns across clients in similar industries. That pattern recognition is the beginning of genuine specialisation — and specialisation commands better rates than generalism.

Your existing clients are bringing you new problems, not because they need more convincing, but because the first skills worked and they can see what else might be possible.

That is not a dramatic transformation. It is the result of consistent, unglamorous work — building skills, installing them, paying attention to what works, improving things, staying in contact with clients. None of those steps are complicated. The compounding does the rest.

## The Skill vs The Knowledge

One more thing worth naming.

The skills in your library are valuable. But what is more valuable is the knowledge you carry about how to build them, what makes them good, and how to fit them to a real business. Skills can be copied. That knowledge cannot.

As AI tools evolve and the process of building skills becomes more accessible, what will differentiate the Scouts who are still thriving from those who got commoditised is the depth of their understanding. The ones who are embedded with clients, who know those businesses, who have seen dozens of installs and know which patterns work — those are the ones with something durable.

Start building that understanding now, even before your library is large.

## Your First Step

Not a mindset shift. Not a plan. A specific action you can take this week.

Book a discovery session with one potential client — someone you already have a relationship with, an existing client you have not yet pitched Cowork to, or a prospect you have been meaning to follow up with.

Run the discovery session using what you learned in Module 3. Come out of it with a clear picture of one workflow that would make a real difference to how they work.

Build that skill. Install it. Make sure it actually works.

That is the first entry in your library. That is where the compounding starts.

Everything else in this course has been preparation. This is where you begin.
`,
      },
    ],
  },
]
