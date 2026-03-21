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
    title: "Getting Started",
    outcome: "You've built your first skill, understand how skill files work, and have a workspace set up with context files.",
    lessons: [
      {
        id: "s1-1",
        title: "What Skills Actually Are",
        content: `# What Skills Actually Are

You've just seen what Cowork can do with skills installed. Now it's time to understand what a skill actually is, and why it changes everything about how you use AI.

## The Problem With Prompting

Most people use AI the same way every time. They open a chat, type a long prompt explaining what they want, get a result, and close the window. Next time they need the same thing, they type it all again. Or they dig through old conversations trying to find that one prompt that worked.

This is like writing the same email from scratch every single day. It works, but it wastes time and the quality varies every time. Some days you remember to include all the details. Other days you forget half of them and get a mediocre result.

## What a Skill Is

A skill is a set of instructions saved as a file. That's it.

You write out exactly what you want Cowork to do, step by step, save it once, and Cowork follows those instructions every time. The instructions include what the goal is, what steps to take, what tools to use, and what the output should look like.

The file is written in plain English (technically it's a markdown file, but you don't need to know what that means). There's no code. No programming. Just clear, specific instructions that Cowork reads and follows.

Think of it like a recipe. A good cook can improvise, but a recipe means anyone can produce a consistent result. Skills are recipes for Cowork.

## Why This Matters

Here's the stat that convinced me: when you test a skill against a simple prompt for the same task, the skill produces the right output roughly 100% of the time. The raw prompt? About 33%.

That's not because the AI is smarter with a skill. It's because the skill removes ambiguity. Every step is defined. Every expectation is spelled out. There's no room for the AI to guess what you meant, because you've already told it.

This is the difference between asking someone "Can you handle the invoices?" and giving them a checklist: open the folder, check each invoice against the PO number, flag anything over $5,000, and save the summary to this specific sheet. Same person, wildly different results.

## What a Skill Looks Like (Don't Worry About the Details Yet)

Here's a simplified version of what a skill file contains:

- **Name:** What the skill is called
- **Description:** When Cowork should use it (this is important, and we'll cover it in Lesson 6)
- **Goal:** What the skill produces and why it exists
- **Steps:** A numbered list of what to do, in order
- **Output format:** What the finished result should look like

You'll build your first one in the next lesson. For now, the point is: it's just a text file with instructions.

## Where Skills Live

In Cowork, skills are managed through the Customize panel (the paintbrush icon in the sidebar). You can:

- **Add skills** by installing them from a file or using the built-in Skill Creator
- **Toggle skills on and off** so only the ones you need are active
- **View and edit** the skill files at any time

Each active skill takes up a small amount of Cowork's attention (its "context window"). This means you don't want 50 skills active at once. Keep the ones you're using turned on, and toggle the rest off. Five to ten active skills is a good range.

## What You'll Build in This Course

Over the next 11 lessons, you'll go from zero skills to a working collection that handles real tasks in your business. Here's the arc:

- **Lessons 2-4:** Build your first skill, understand the file format, set up your workspace
- **Lessons 5-8:** Create skills the smart way, make them trigger reliably, add your business context, and build interactive skills
- **Lessons 9-11:** Connect skills to real tools (email, calendar), test them properly, and learn to improve any skill
- **Lesson 12:** Where this all leads, including automation, multi-skill workflows, and the community of people building this stuff together

Every lesson ends with something built. No theory-only lessons after this one.

## Common Mistakes at This Stage

**"I need to learn to code first."** You don't. Skills are plain English instructions in a text file. If you can write a clear email, you can write a skill.

**"I'll just keep using prompts."** You can. But you'll keep getting inconsistent results and retyping the same context every session. Skills solve both problems.

**"I need the perfect skill before I start."** Your first skill will be rough. That's fine. You'll improve it in Lesson 11. The important thing is to start.
`,
      },
      {
        id: "s1-2",
        title: "Your First Skill in 5 Minutes",
        content: `# Your First Skill in 5 Minutes

Time to build something. In this lesson you'll use Cowork's built-in Skill Creator to produce a working skill without writing a single line yourself.

## Why This Matters

You could write a skill file by hand (and you'll learn how in Lesson 3), but there's a faster way to start. Cowork has a built-in Skill Creator that interviews you about what you want, then generates the skill file for you.

It's the fastest path from "I have no skills" to "I have a working skill."

## The Concept

The Skill Creator is itself a skill that comes pre-installed in Cowork. When you activate it and describe what you want to build, it asks a series of questions to narrow down exactly what the skill should do, who it's for, and what the output should look like.

This questioning process matters. A vague request like "help me with emails" could mean a hundred different things. The Skill Creator's questions force you to get specific: What kind of emails? What tone? What information do you need before writing? What does a good result look like?

Once it has enough information, it generates the SKILL.md file and lets you review it before adding it to your library.

## Hands-On: Build a Meeting Summary Skill

Let's build a skill that takes messy meeting notes and turns them into a clean summary with action items. This is something most people do manually after every call.

**Step 1: Open the Skill Creator**

In Cowork, click the Customize icon (paintbrush) in the sidebar. Look for the Skill Creator in your skills list. If it's not active, toggle it on.

**Step 2: Tell it what you want**

Type this into Cowork:

\`\`\`
I want to create a skill that processes meeting notes. I'll paste in raw
notes from a call, and the skill should produce a clean summary with three
sections: Key Decisions, Action Items (with who's responsible), and Open
Questions that still need answers.
\`\`\`

**Step 3: Answer the questions**

The Skill Creator will ask you several questions. Here's roughly what to expect and how to answer:

- **What domain is this for?** Business meetings, client calls, internal team syncs
- **What's the output format?** A markdown file saved to the current folder
- **How detailed should the summary be?** Concise. One paragraph for context, then bullet points for each section
- **Should it include anything else?** Add a "Follow-up Date" field if any deadlines were mentioned

Answer honestly based on your actual needs. Skip any question that doesn't apply.

**Step 4: Review the skill**

The Skill Creator will show you the generated SKILL.md file. Read through it. Does it capture what you described? If something's off, tell Cowork what to change before finalizing.

**Step 5: Add it to your library**

Once you're happy with it, confirm and the skill gets added to your library. You can now use it by pasting meeting notes into Cowork and the skill will activate automatically based on the context.

**Step 6: Test it**

Paste in some real meeting notes (or make some up) and see what comes out. The output should follow the structure you defined: Key Decisions, Action Items, Open Questions.

## What You Built

You now have a working skill that processes meeting notes into a structured summary. It's in your Cowork library and will activate whenever you paste meeting notes.

## Common Mistakes

**Answering every question with "I don't know."** The Skill Creator needs specifics to build something useful. If you're unsure, think about the last time you did this task manually. What did you produce? What format was it in? Use that as your answer.

**Not testing immediately.** Always test a new skill right after creating it. The first version often needs a small tweak, and it's easier to fix while the context is fresh.

**Expecting perfection on the first try.** Your first skill won't be perfect. That's normal. You'll learn to edit and improve skills in later lessons. For now, "working" is the goal, not "flawless."
`,
      },
      {
        id: "s1-3",
        title: "Inside a SKILL.md File",
        content: `# Inside a SKILL.md File

You've built a skill using the Skill Creator. Now let's open the file it generated and understand each part, so you can edit skills yourself.

## Why This Matters

The Skill Creator is great for getting started, but you'll eventually want to tweak a skill by hand. Maybe you want to change the output format, add a step, or adjust how a skill handles edge cases. Understanding the file means you're not dependent on the Skill Creator for every change.

## The Two Parts of Every Skill File

Every SKILL.md has two sections: the **frontmatter** at the top and the **body** below it.

### Part 1: The Frontmatter

The frontmatter sits between two lines of three dashes (\`---\`). It contains metadata about the skill:

\`\`\`yaml
---
name: meeting-summary
description: Processes raw meeting notes into a structured summary with decisions, action items, and open questions.
---
\`\`\`

Two fields matter here:

**name** (max 64 characters): The skill's label. Must be lowercase with hyphens, no spaces. This is how the skill appears in your library.

**description** (max 200 characters): This is the most important line in the file. Cowork reads this description to decide whether your skill is relevant to what you're asking. If the description is vague, Cowork won't know when to use it. We'll go deep on this in Lesson 6.

There's also an optional \`dependencies\` field if your skill needs Python or Node.js packages, but most skills won't need it.

### Part 2: The Body

Everything below the frontmatter is the instruction set. This is where you tell Cowork what to do. A good skill body has five sections:

**Goal** - One or two sentences. What does this skill produce, and why does it exist?

\`\`\`markdown
## Goal

After a meeting, produce a structured summary that captures what was decided,
what needs to happen next, and what's still unresolved. The summary should be
ready to share with attendees without editing.
\`\`\`

**Steps** - A numbered list of actions. Each step should be a concrete thing to do, not a vague instruction.

\`\`\`markdown
## Steps

1. Read the meeting notes provided by the user.
2. Identify all decisions (look for "we agreed", "we'll go with", "decided to").
3. Extract action items with the responsible person and any deadline mentioned.
4. List any questions that were raised but not resolved.
5. Write a one-paragraph context summary (who met, when, what the meeting was about).
6. Assemble the final output in the format specified below.
\`\`\`

**Output Format** - Exactly what the result should look like.

\`\`\`markdown
## Output Format

Save as a markdown file named \\\`meeting-summary-YYYY-MM-DD.md\\\` with these sections:

### Context
One paragraph: attendees, date, topic.

### Key Decisions
Bullet points. One decision per bullet.

### Action Items
Bullet points. Format: "- [Person]: Task (by [date] if mentioned)"

### Open Questions
Bullet points. Questions raised but not answered.
\`\`\`

**Tools** (optional) - If the skill uses connectors like Gmail or Calendar, note them here.

**Edge Cases** (optional) - What should the skill do if something unexpected happens?

\`\`\`markdown
## Edge Cases

- If no decisions were made, write "No decisions recorded" under Key Decisions.
- If notes are very brief (under 50 words), ask the user if they have more context before proceeding.
\`\`\`

## Hands-On: Edit Your Meeting Summary Skill

Open the skill you built in Lesson 2. Find it in Cowork's Customize panel.

Make these three changes:

1. **Add a step:** After the action items step, add: "7. If any action item has a deadline within 48 hours, mark it with [URGENT] at the start."

2. **Change the output format:** Add a "Next Meeting" section at the bottom where the skill notes any suggested follow-up date.

3. **Tighten the goal:** Make sure it mentions that the summary should be concise enough to read in under 2 minutes.

Save your changes and test the skill again with the same meeting notes. Compare the output to what you got before.

## What You Built

You now understand the anatomy of a skill file and can edit one yourself. You've made manual changes to your meeting summary skill and confirmed they work.

## Common Mistakes

**Writing vague steps.** "Summarize the meeting" is not a step. "Extract all decisions mentioned in the notes, looking for phrases like 'we agreed' or 'let's go with'" is a step. The more specific your steps, the more consistent the output.

**Forgetting the output format.** Without a defined output format, Cowork will improvise. Sometimes that's fine. Usually it's not. Spell out exactly what the result should look like.

**Making the body too long.** Keep your SKILL.md under 200 lines. If you need more detail, you can add reference files in a \`references/\` folder (covered in Lesson 12). For now, keep it tight.
`,
      },
      {
        id: "s1-4",
        title: "Setting Up Your Workspace",
        content: `# Setting Up Your Workspace

Skills work best when Cowork knows who you are, how you work, and where things go. This lesson sets up the foundation that every future skill will benefit from.

## Why This Matters

A skill that writes a client email without knowing your name, your business, or your tone of voice will produce something generic. The same skill, given that context, produces something you'd actually send.

Context is what separates "this is a decent AI draft" from "this sounds like me."

## Folder Structure

When you open Cowork, it asks you to select a folder. This folder is your workspace. Everything Cowork reads and creates lives here.

Start with this structure:

\`\`\`
my-workspace/
  context/
    about-me.md
    brand-voice.md
    working-preferences.md
  output/
  skills/
\`\`\`

**context/** holds the files that tell Cowork who you are and how to work. Every skill can reference these.

**output/** is where Cowork saves finished work. Keeping output separate from context means your workspace stays clean.

**skills/** is optional. Some people like to keep their skill files here for easy access, but skills installed through the Customize panel don't need to live in your folder.

Create this folder structure now. You can do it in Finder, Explorer, or ask Cowork to create it for you.

## The Three Context Files

### about-me.md

This tells Cowork who you are. Include:

- Your name and role
- Your business (what you do, who you serve)
- Your current priorities (what matters right now)
- Your daily schedule and non-negotiables (e.g., "no meetings before 10am")

Example:

\`\`\`markdown
# About Me

I'm Sarah Chen, founder of Greenline Digital. We manage Google Ads for
e-commerce brands doing $1M-$10M in annual revenue.

Current priorities:
- Onboarding 3 new clients this month
- Building out our reporting process
- Creating content for LinkedIn (posting 3x per week)

Schedule:
- Deep work: 8am-11am (no meetings, no email)
- Client calls: 1pm-4pm
- Admin and planning: 4pm-5pm
\`\`\`

### brand-voice.md

This tells Cowork how to sound when writing for you:

- Your tone (casual, professional, direct, warm?)
- Words or phrases you use often
- Words or phrases you never use
- Examples of writing you like (paste in a paragraph from something you've written)

Example:

\`\`\`markdown
# Brand Voice

Tone: Direct, friendly, no jargon. Write like I'm explaining something
to a smart friend over coffee.

Always use:
- "I" not "we" (I'm a solo founder)
- Short paragraphs (3 sentences max)
- Concrete examples over abstract claims

Never use:
- "Leverage", "synergy", "utilize", "cutting-edge"
- Corporate buzzwords
- Emojis (unless explicitly asked)

Example of my writing style:
"Most Google Ads accounts waste 20% of their budget on search terms that
will never convert. The fix takes 15 minutes. Here's exactly what to do."
\`\`\`

### working-preferences.md

This tells Cowork how you like to work:

- Where to save output
- How to handle uncertainty (ask you, or make a decision and flag it?)
- Your preferences for file naming, formatting, length

Example:

\`\`\`markdown
# Working Preferences

- Save all output to the output/ folder
- Use markdown format unless I ask for something else
- File names: YYYY-MM-DD-description.md
- If you're unsure about something, ask me before proceeding
- Keep summaries under 500 words
- When writing emails, draft only. Never send.
\`\`\`

## Global Instructions

Global Instructions are separate from your folder files. They follow you across every folder and every session. Set them in Cowork's settings (not in a file).

The most important Global Instruction: tell Cowork to read your context files at the start of every task.

Go to Settings, find Global Instructions, and add something like:

\`\`\`
At the start of every task, read the files in my context/ folder
(about-me.md, brand-voice.md, working-preferences.md) to understand
who I am and how I work. Apply this context to everything you produce.
\`\`\`

This single instruction makes Cowork dramatically more consistent, because it stops relying on memory (which resets every session) and starts reading your actual files.

## Hands-On

1. Create the folder structure shown above
2. Write your own versions of the three context files (about-me.md, brand-voice.md, working-preferences.md)
3. Set up the Global Instruction to read those files
4. Test it: ask Cowork to write a short email to a client. Does it use your name? Your tone? Your preferred format?

## What You Built

You now have a workspace with context files that every skill can reference, and a Global Instruction that ensures Cowork reads them. Every skill you build from here will benefit from this foundation.

## Common Mistakes

**Putting everything in Global Instructions.** Global Instructions have limited space and can't be easily referenced by skills. Put the details in files and use Global Instructions to point Cowork to those files.

**Being too vague in your context files.** "I like professional writing" doesn't help. "Short sentences, no jargon, always include a specific example" helps a lot.

**Skipping this lesson.** It's tempting to jump ahead to building more skills. But without context files, every skill you build will produce generic output. Ten minutes here saves hours later.
`,
      },
    ],
  },
  {
    id: 2,
    title: "Building Better Skills",
    outcome: "You can create skills from real work, make them trigger reliably, add business context, connect to real tools, and test them properly.",
    lessons: [
      {
        id: "s2-1",
        title: "The \"Do It First\" Method",
        content: `# The "Do It First" Method

This is the most important lesson in the course. The fastest way to create a great skill isn't to sit down and write one from scratch. It's to do the actual work in Cowork first, then tell Cowork to turn what it just did into a reusable skill.

## Why This Matters

When you try to write a skill from scratch, you're guessing at what the workflow should be. You think you know the steps, but you inevitably miss things. You forget the edge case where the data is messy, or the step where you need to reformat the output, or the part where you check something before moving on.

But when you do the work first, Cowork captures the real workflow, not the imagined one. It sees every step you took, every correction you made, every decision point. Then when you say "turn this into a skill," it has the full picture.

## The Pattern

It's three steps:

1. **Do the work.** Open Cowork with your workspace folder selected. Complete the task you want to automate, start to finish. Don't overthink it. Just do it as you normally would.

2. **Ask for the skill.** Once the work is done and you're happy with the result, type: "Turn what you just did into a reusable skill. Create a SKILL.md file that I can use for this same task next time."

3. **Review and refine.** Cowork will generate a skill file based on the conversation. Read through it. Does it capture the full workflow? Did it miss anything? Tell Cowork to adjust before finalizing.

That's it. The work you already needed to do becomes the blueprint for the skill.

## Worked Example: Client Onboarding Brief

Let's say you've just had a call with a new client and you need to organize your notes.

**Step 1: Do the work**

Paste your notes into Cowork:

\`\`\`
Here are my notes from a call with a potential new client:

- Company: Meridian Pool Supplies
- Contact: James Wu, Marketing Manager
- Monthly ad spend: $35k across Google and Meta
- Main issue: Search campaigns converting but Shopping is eating budget
  with no clear ROAS data
- They use Shopify, about 2,000 products
- Current agency dropped the ball on negative keywords
- James makes day-to-day decisions, but CEO (his boss Dave) approves budget changes
- Want to see a proposal by next Wednesday
- Mentioned competitor "AquaMax" is outranking them on key terms

Please organize this into a structured client brief.
\`\`\`

Cowork produces a clean brief with sections, formatting, and structure.

**Step 2: Convert to a skill**

Now type:

\`\`\`
That was exactly what I needed. Turn this process into a reusable skill
so I can run it for every new client call. The skill should:
- Accept raw meeting notes as input
- Produce the same structured brief format
- Ask me for the client name and call date if I don't include them
- Save the output as a markdown file
\`\`\`

**Step 3: Review**

Cowork generates a SKILL.md file. Check that it captured the sections you care about, the format you liked, and the file naming convention. Tweak anything that's off.

## When to Use This Method vs the Skill Creator

Use the **"Do It First" method** when:
- You've already done this task before and know what good output looks like
- The workflow involves judgment calls that are hard to describe in advance
- You want the skill to match your actual process, not a generic template

Use the **Skill Creator** (Lesson 2) when:
- You're starting from scratch and need help scoping the skill
- The task is well-defined and you can describe it clearly upfront
- You want the Socratic questioning to help you think through the requirements

Both approaches produce a SKILL.md file. The "Do It First" method just gives Cowork more context to work with.

## Hands-On

Pick a task you've done at least twice in the last month. Something that takes 10-30 minutes. Examples:

- Turning raw notes into a formatted document
- Writing a weekly update email
- Summarizing a report for a colleague
- Processing a data export into something readable

Do the task in Cowork right now. Then convert it to a skill using the pattern above.

## What You Built

A skill based on your actual workflow, not a guess at what your workflow might be. This is likely more accurate and useful than anything you could have written from scratch.

## Common Mistakes

**Rushing the "do the work" step.** If you cut corners during the initial task, the skill will inherit those shortcuts. Do the task properly. The skill reflects whatever you showed it.

**Not reviewing the generated skill.** Cowork's skill file is a first draft. It captures the gist, but you should always read through it and adjust. Maybe it missed a step. Maybe it added something you don't need.

**Only doing this once.** This method works for every skill you build. Whenever you catch yourself doing the same task a second or third time, that's your signal: do it in Cowork and convert it.
`,
      },
      {
        id: "s2-2",
        title: "Descriptions That Trigger",
        content: `# Descriptions That Trigger

You've built a few skills now. But here's the question: does Cowork actually use them when it should? The answer depends almost entirely on the description in your SKILL.md frontmatter.

## Why This Matters

In Cowork, you don't type a slash command to activate a skill (the way you might in other tools). Instead, Cowork reads your message, scans the descriptions of all your active skills, and decides which one fits.

If your description is vague, Cowork might not realize your skill is relevant. If it's too broad, it might fire when you don't want it to. The description is the trigger mechanism, and getting it right is the difference between a skill that works reliably and one that sits unused.

## How Cowork Decides

When you send a message, Cowork does something like this:

1. Reads your message
2. Scans the descriptions of all active skills
3. Matches your message against those descriptions
4. If a skill is a strong match, it loads the full SKILL.md and follows the instructions

This means the description needs to contain the words and concepts that someone would naturally use when they need this skill. Not technical jargon about what the skill does internally, but the actual phrases a person would type.

## The Three-Part Description Framework

A good description has three elements packed into 200 characters or fewer:

### 1. What it does (the action)

Start with the core action: "Processes meeting notes," "Writes LinkedIn posts," "Analyzes CSV files."

### 2. Trigger keywords (when to fire)

Include the words someone would actually type: "meeting notes," "call summary," "action items." These are the match points Cowork uses.

### 3. What it produces (the output)

End with the result: "into a structured brief," "with scoring and feedback," "as an HTML report."

**Example - Bad:**

\`\`\`yaml
description: A tool for processing information and creating organized documents.
\`\`\`

This could match almost anything. It tells Cowork nothing specific about when to activate.

**Example - Good:**

\`\`\`yaml
description: Processes raw meeting notes or call transcripts into a structured summary with decisions, action items, and open questions.
\`\`\`

This fires when someone pastes meeting notes. It won't fire when someone asks about email or data analysis.

## Testing Your Triggers

The best way to check if a description works is to test it. With your skill active, try sending messages with different phrasings:

- The obvious phrasing: "Here are my meeting notes from today's call"
- A less obvious phrasing: "Can you organize these notes from a conversation I had?"
- An unrelated message: "Write me a LinkedIn post about AI tools"

The skill should activate for the first two and stay quiet for the third. If it doesn't, adjust the description.

## Negative Triggers

Sometimes you need to prevent a skill from firing. If you have both a "meeting summary" skill and an "email drafter" skill, and someone says "summarize this email thread," which one fires?

You can add negative context to the description:

\`\`\`yaml
description: Processes raw meeting notes or call transcripts into a structured summary. Not for email threads or chat logs.
\`\`\`

The "Not for" line helps Cowork distinguish between similar skills.

## The 15,000 Character Ceiling

Here's something most people don't realize: Cowork loads the frontmatter (name + description) of every active skill into its context at the start of a session. All your active skills' descriptions, combined, share a budget of roughly 15,000 characters.

If you have 20 active skills with 200-character descriptions, that's 4,000 characters. Fine. But if you write 500-character descriptions (breaking the 200-character guideline), you'll eat into your budget fast and Cowork's ability to match skills degrades.

Keep descriptions tight. Under 200 characters. Say more in the body, not the description.

## Hands-On

1. Open the skills you've built so far (Lessons 2, 3, 5)
2. Read each description. Does it contain the words someone would naturally type?
3. Rewrite any description that's vague or too broad using the three-part framework
4. Test each skill by sending 3 different messages: one that should trigger it, one that's borderline, and one that shouldn't trigger it
5. Adjust until each skill fires reliably for the right messages

## What You Built

Descriptions that work as reliable triggers. Your skills now activate when they should and stay quiet when they shouldn't.

## Common Mistakes

**Writing descriptions for yourself instead of for Cowork.** You know what your skill does, but Cowork only knows what the description says. Write the description as if Cowork has never seen the skill before (because in a new session, it hasn't).

**Too many active skills.** If you have 15+ skills active, Cowork has more descriptions to scan and more chances for confusion. Keep 5-10 active at a time. Toggle the rest off.

**Descriptions that overlap.** If two skills have similar descriptions, Cowork might pick the wrong one. Differentiate them clearly, or combine them into one skill.
`,
      },
      {
        id: "s2-3",
        title: "Adding Your Business Context",
        content: `# Adding Your Business Context

A skill without your business context is basically not worth having. This lesson is about the difference between generic output and output that sounds like you and fits your business.

## Why This Matters

Every skill you've built so far works. But the output is probably a bit... generic. It uses safe, professional language. It doesn't mention your specific audience. It doesn't know your pricing, your competitors, or the phrases you always use.

That's because the skill knows how to do the task but doesn't know anything about your business. Context is the fix.

## The Context Layer

In Lesson 4, you created three context files: about-me.md, brand-voice.md, and working-preferences.md. Those files are your foundation. Now you'll connect them to your skills.

The principle is simple: at the right step in a skill, tell Cowork to read a context file before proceeding.

## How to Reference Context Files in a Skill

In your SKILL.md body, add a step that reads the relevant file:

\`\`\`markdown
## Steps

1. Read context/brand-voice.md to understand the user's tone and style preferences.
2. Read the meeting notes provided by the user.
3. Extract decisions, action items, and open questions.
4. Write the summary using the tone and style from brand-voice.md.
5. Save the output to the output/ folder.
\`\`\`

Step 1 loads the context. Step 4 applies it. This means the skill produces output that matches your voice every time, without you having to explain your preferences in every conversation.

## What Context to Add (and Where)

Not every skill needs every context file. Match the context to the task:

**Writing skills** (emails, posts, summaries): brand-voice.md is essential. Audience/ICP files are useful if you're writing for a specific group.

**Analysis skills** (data processing, audits): working-preferences.md matters most. How detailed should the analysis be? What format?

**Client-facing skills** (proposals, briefs, reports): about-me.md (who you are, what you offer) plus any client-specific context.

## Creating Additional Context Files

The three files from Lesson 4 cover the basics. As your skills get more specific, you might want more targeted context files:

**audience.md** - Who you serve. Their problems, their language, what they care about.

\`\`\`markdown
# Audience

I work with e-commerce business owners doing $500K-$5M in annual revenue.
They're usually running Google Ads themselves or have a small team managing it.

Their main frustrations:
- Wasted ad spend on irrelevant search terms
- No clear picture of which campaigns actually drive profit
- Feeling overwhelmed by Google Ads complexity

They want: more sales, less wasted spend, and someone to tell them
what to focus on. They don't care about technical jargon. They want results.
\`\`\`

**services.md** - What you offer, your pricing model, your differentiators.

**competitor-notes.md** - What your competitors do, how you're different.

The key: each file should be short (under 500 words), specific, and written in plain language. These aren't formal documents. They're notes that help Cowork understand your world.

## Before and After

Here's the same skill output without context and with context:

**Without context:**

> Subject: Follow-Up from Our Meeting
>
> Dear James,
>
> Thank you for taking the time to meet with us today. We enjoyed learning
> about your business and discussing your advertising needs. We believe our
> services would be a strong fit for your organization.

**With brand-voice.md loaded:**

> Subject: Next steps from our call
>
> Hey James,
>
> Good call today. I've pulled together the brief below based on what you
> told me about Meridian's Shopping campaigns and the negative keyword
> situation. Three things stood out as quick wins...

Same skill. Same task. Completely different output. The second one sounds like a real person because it has context about how that person writes.

## Hands-On

1. Pick your best skill (the one you use most)
2. Open its SKILL.md and add a step that reads brand-voice.md
3. Run the skill with and without that step, using the same input
4. Compare the two outputs side by side

If the difference is noticeable, add context references to your other skills too.

Then create one new context file that's specific to your business (audience.md, services.md, or something else relevant). Reference it in at least one skill.

## What You Built

Skills that produce output matching your voice and business context. Plus at least one new context file tailored to your specific needs.

## Common Mistakes

**Loading every context file in every skill.** If your meeting summary skill reads your audience.md and services.md and competitor-notes.md, that's a lot of context that probably isn't relevant. Match the context to the task. More isn't always better.

**Writing context files that are too long.** A 2,000-word brand voice guide is hard for Cowork to apply consistently. Keep each file under 500 words. Be specific and concrete.

**Forgetting to update context files.** Your business changes. Your tone evolves. Your priorities shift. If your about-me.md still says "my priority is launching in Q1" and it's now Q3, that's stale context producing stale output. Review these files every month or two.
`,
      },
      {
        id: "s2-4",
        title: "Skills That Ask Questions",
        content: `# Skills That Ask Questions

Some skills need information from you before they can run. Rather than guessing or producing something generic, a well-built skill asks the right questions first.

## Why This Matters

Not every task can start from a single prompt. A "write a proposal" skill needs to know: for which client? What services? What budget range? What timeline?

You could include all of that in your initial message every time. But you'll forget something, and then the output is wrong, and you have to start over. It's better to build the questions into the skill itself, so it always gathers what it needs before running.

## How It Works

In your SKILL.md steps, add questions at the start:

\`\`\`markdown
## Steps

1. Ask the user for the following information before proceeding:
   - Client name
   - What service or product is this proposal for?
   - Approximate budget range (if known)
   - Deadline for delivering the proposal

2. If the user has already provided some of this information in their
   initial message, skip those questions and only ask for what's missing.

3. Once all information is gathered, proceed to write the proposal...
\`\`\`

The key detail is step 2: don't ask questions the user already answered. If someone types "Write a proposal for Meridian Pool Supplies for our Google Ads management service, budget around $5k/month," the skill should only ask about the deadline, not re-ask everything.

## How Many Questions Is Too Many?

Two to three questions is the sweet spot. More than that feels like an interrogation, and people will stop using the skill.

If your skill needs more than three inputs, consider whether some of them could be:

- **Pulled from context files** (your services, pricing, standard terms)
- **Given sensible defaults** ("If no deadline mentioned, use 5 business days")
- **Asked only when relevant** ("If the budget is over $10k, ask about payment terms")

The goal is to reduce friction while still getting what the skill needs.

## Conditional Questions

Sometimes you only need to ask certain questions based on earlier answers:

\`\`\`markdown
## Steps

1. Ask the user: "Is this for a new client or an existing client?"

2. If new client:
   - Ask for company name, contact person, and what they do
   - Read context/services.md for available offerings

3. If existing client:
   - Ask for the client name only
   - Look for an existing brief in the output/ folder
\`\`\`

This keeps the interaction short for repeat tasks while still handling new situations properly.

## The "Preflight Check" Pattern

Some skills benefit from confirming assumptions before running. Instead of asking open-ended questions, present what the skill plans to do and ask for confirmation:

\`\`\`markdown
## Steps

1. Read the user's input and the context files.

2. Before producing output, present a brief summary:
   "Here's what I'm planning to create:
   - A proposal for [client name]
   - Covering [service]
   - Budget: [amount]
   - Deadline: [date]
   Does this look right? Anything to change?"

3. Wait for confirmation before proceeding.
\`\`\`

This catches misunderstandings early. It takes five seconds to confirm, versus five minutes to redo a proposal that got the basics wrong.

## Hands-On

1. Pick a skill that currently requires you to include a lot of detail in your initial message
2. Add 2-3 questions to the start of the skill
3. Include the "skip if already provided" instruction
4. Test it three ways:
   - With a vague message ("Write a proposal")
   - With a partial message ("Write a proposal for Meridian, Google Ads management")
   - With a complete message (all details included)

The skill should ask the right number of questions each time: all of them for the vague message, just the missing ones for the partial, and none for the complete message.

## What You Built

A skill that gathers the information it needs without making you remember everything upfront. It adapts to how much context you provide.

## Common Mistakes

**Asking too many questions.** If your skill asks five questions before doing anything, people will just type the whole thing as a prompt instead. Keep it to 2-3 max.

**Not handling partial information.** If the user already told you the client name in their message and your skill asks again, it feels broken. Always check what's already been provided.

**Asking vague questions.** "What do you need?" is too open. "Which client is this for?" is specific and fast to answer. Make every question easy to respond to.
`,
      },
      {
        id: "s2-5",
        title: "Connecting to Real Tools",
        content: `# Connecting to Real Tools

Until now, your skills have worked with text you paste in and files in your folder. This lesson opens the door to live data: your actual emails, calendar, documents, and more.

## Why This Matters

A meeting summary skill is useful. A meeting summary skill that pulls today's calendar events, checks the attendees against your contacts, and drafts a follow-up email in Gmail? That's a different category entirely.

Connectors are what turn Cowork from a text-processing tool into something that actually participates in your workflow.

## What Connectors Are

Connectors are integrations that give Cowork access to external tools. They're set up through the Cowork interface (Customize > Connectors) and typically require you to log in with your existing account (Google, Slack, etc.).

Each connector comes with two types of permissions:

**Read access:** View your data. See your calendar events, read your emails, view files in Drive.

**Write access:** Take actions. Create calendar events, draft emails, update documents.

You control these separately. You can give a connector read access without write access, so Cowork can see your calendar but can't create events until you explicitly allow it.

## Available Connectors

Cowork has native connectors for the most common tools:

- **Gmail** - Read emails, search inbox, create drafts, send (if you allow it)
- **Google Calendar** - View events, check availability, create events
- **Google Drive** - Read documents, create and update files
- **Slack** - Read channels, post messages, search conversations
- **Notion** - Read and update pages and databases
- **Microsoft 365** - Outlook, OneDrive, Teams equivalents

There are others, and more are being added regularly. Check the Connectors panel in Cowork for the current list.

## Setting Up Your First Connector

Let's connect Gmail. It's the most universally useful.

1. Open Cowork, go to Customize > Connectors
2. Find Gmail and click Connect
3. Log in with your Google account and approve the permissions
4. Choose your permission level:
   - **Read emails:** Always allow (this is safe, it just views)
   - **Create drafts:** Always allow (drafts aren't sent, you review first)
   - **Send emails:** Needs approval (you'll be asked each time)

The "draft only" pattern is important. Let Cowork create drafts that you review and send yourself. This keeps you in control while still saving time.

## Using Connectors in Skills

Once a connector is set up, your skills can reference it:

\`\`\`markdown
## Steps

1. Use the Gmail connector to find the 5 most recent unread emails.
2. For each email, determine if it's:
   - Urgent (needs a response today)
   - Follow-up (needs a response this week)
   - FYI (read and archive)
   - Junk (archive immediately)
3. For urgent emails, draft a brief response.
4. Save a summary of all emails and their categories to output/inbox-triage.md.

## Connector Requirements

This skill requires the Gmail connector with read and draft-create permissions.
\`\`\`

The "Connector Requirements" section at the bottom tells anyone using the skill what they need to set up first.

## A Practical Example: Daily Briefing

Here's a skill that combines two connectors:

\`\`\`markdown
## Goal

Produce a morning briefing covering today's calendar and priority emails.

## Steps

1. Read context/about-me.md for priorities and schedule preferences.
2. Use the Google Calendar connector to get today's events.
3. Use the Gmail connector to get unread emails from the last 12 hours.
4. Write a briefing with three sections:
   - Today's Schedule (events with times, attendees, and prep notes)
   - Priority Emails (anything that needs action today)
   - FYI (everything else, one line each)
5. Save to output/briefing-YYYY-MM-DD.md.

## Connector Requirements

- Google Calendar (read access)
- Gmail (read access)
\`\`\`

This skill turns "check my calendar and email" from a 15-minute morning routine into a 30-second scan.

## Hands-On

1. Connect at least one connector (Gmail or Google Calendar are the easiest to start with)
2. Set permissions conservatively: read access on "always allow," write access on "needs approval"
3. Create a skill that uses the connector (use the daily briefing example above, or adapt it)
4. Test it and check that the data it pulls is accurate

## What You Built

A skill connected to a live data source. Your skills can now work with real information from your actual tools, not just text you paste in.

## Common Mistakes

**Giving full write access immediately.** Start with read-only or draft-only. Once you trust the skill's output, you can open up write access. It's easy to grant more permissions later, hard to undo a sent email.

**Not noting connector requirements.** If you share a skill or come back to it later, you'll forget what connectors it needs. Always include a "Connector Requirements" section.

**Expecting connectors to work offline.** Connectors need an internet connection and an active session in Cowork. If Cowork is closed or your computer is asleep, connector-based skills won't run (relevant for scheduled tasks, covered in Lesson 12).
`,
      },
      {
        id: "s2-6",
        title: "Testing Your Skills",
        content: `# Testing Your Skills

You've been building skills based on feel: run them, look at the output, decide if it's good enough. This lesson introduces a more systematic approach: defining what "good" means, testing against those criteria, and measuring pass rates.

## Why This Matters

"It looks about right" is how most people evaluate AI output. The problem is that "about right" shifts depending on your mood, the time of day, and how rushed you are. What felt fine on Monday might look terrible on Thursday.

Testing gives you an objective answer. You define what the output must include, run the skill multiple times, and count how often it hits the mark. Numbers replace vibes.

## How Evaluation Works

The evaluation process has three parts:

### 1. Define criteria

Write 3-5 specific, binary (yes/no) tests for your skill's output. Each criterion should be something you can check without subjective judgment.

Good criteria:
- "Output includes a subject line"
- "Summary is under 300 words"
- "Action items include a responsible person for each item"
- "Output is saved as a markdown file, not displayed in chat"
- "Tone matches the brand voice (no jargon, no corporate speak)"

Bad criteria:
- "Output is good" (too vague)
- "Writing is high quality" (subjective)
- "It sounds professional" (means different things to different people)

### 2. Run the skill multiple times

Use the same input (or a set of test inputs) and run the skill 3-5 times. Save each output.

Why multiple times? Because AI output varies. A skill might work perfectly on the first run and miss something on the third. Testing multiple times reveals how consistent the skill is.

### 3. Score against criteria

For each run, check every criterion. Did it pass or fail? Calculate the pass rate.

Example:
- 5 criteria, 3 runs = 15 total checks
- 13 passed = 87% pass rate
- The 2 failures were both on "action items include a responsible person"

Now you know exactly what to fix: the step that extracts action items needs to be more specific about including the responsible person.

## Running an Evaluation in Cowork

You can ask Cowork to run an eval for you:

\`\`\`
I want to test my meeting-summary skill. Here are my criteria:

1. Output has a "Key Decisions" section with at least one bullet point
2. Output has an "Action Items" section with owner names for each item
3. Output has an "Open Questions" section
4. Summary context paragraph is under 100 words
5. Output is saved as a markdown file in the output/ folder

Run the skill 3 times using this test input:
[paste your test meeting notes here]

Score each run against the criteria and give me the pass rates.
\`\`\`

Cowork will run the skill three times, check each output against your five criteria, and report the results.

## What to Do With the Results

**100% pass rate:** Your skill is solid. Move on.

**80-99% pass rate:** Look at which criteria failed. Usually it's one specific step that needs tightening. Edit that step in the SKILL.md and re-run the eval.

**Below 80%:** Something fundamental is off. The steps might be too vague, the output format might not be defined clearly enough, or the skill might need more context. Revisit Lessons 3 and 7.

## A/B Testing Context Files

Here's a powerful use of evaluation: test whether a specific context file actually improves output.

Run the same skill, same input, same criteria, but twice: once with brand-voice.md referenced, once without. Compare pass rates.

If the version with context scores higher, the context file is working. If the scores are the same, the context file might not be adding value for this particular skill. Remove it and save the token budget.

## Hands-On

1. Pick your most-used skill
2. Write 5 evaluation criteria (specific, binary, checkable)
3. Ask Cowork to run the skill 3 times against a test input and score the results
4. If anything failed, edit the relevant step in the SKILL.md
5. Re-run the eval to confirm the fix worked

## What You Built

An evaluation framework for your skills. You can now objectively measure whether a skill works and pinpoint exactly what to fix when it doesn't.

## Common Mistakes

**Writing criteria you can't objectively check.** "Does it sound natural?" is subjective. "Does it avoid the words 'utilize', 'leverage', and 'synergy'?" is checkable. Make criteria binary.

**Only testing once.** A single run doesn't tell you if the skill is consistent. Run at least 3 times. If you're building something important, run 5.

**Fixing symptoms instead of causes.** If the skill keeps missing action item owners, don't just re-run until it works. Fix the step that extracts action items. Make the instruction more specific: "For each action item, include the person responsible. If no person was named, write 'Owner: TBD'."
`,
      },
      {
        id: "s2-7",
        title: "Editing and Improving Skills",
        content: `# Editing and Improving Skills

You don't need to build every skill from scratch. Some of the best skills start as someone else's work that you adapt. This lesson covers how to take any skill, understand it, and make it yours.

## Why This Matters

The 10-skill pack you received is a starting point, not a final product. Those skills were built for a general audience. They don't know your business, your tone, or your specific workflow. Editing them to fit your needs is often faster and more effective than building from scratch.

The same applies to any skill you find online, get from a community, or build yourself three months ago when your needs were different.

## The Editing Workflow

### 1. Read the skill file first

Before changing anything, read the entire SKILL.md. Understand:
- What's the goal?
- What steps does it take?
- What output format does it produce?
- Does it reference any context files or connectors?

### 2. Run it once with real input

See what it produces before you change anything. This gives you a baseline. Sometimes a skill is better (or worse) than you expected from reading the file.

### 3. Identify what to change

Common edits:
- **Output format doesn't match what you need** - Change the output format section
- **Missing a step** - Add the step in the right place in the sequence
- **Too generic** - Add context file references (Lesson 7)
- **Description doesn't trigger properly** - Rewrite using the framework from Lesson 6
- **Too long/verbose** - Trim steps or tighten the goal

### 4. Make targeted changes

Don't rewrite the whole skill. Change the specific parts that need changing. If the steps are good but the output format is wrong, only change the output format.

### 5. Test the edited version

Run it again with the same input you used in step 2. Compare. Is it better? If yes, keep the changes. If not, try a different edit.

## Refactoring a Bloated Skill

If you encounter a skill with a SKILL.md over 200 lines, it needs trimming. Long skills cause performance problems: Cowork loads the whole thing into its context and has less room for actual work.

The fix: **extract detail into reference files.**

Before (300+ lines in SKILL.md):
\`\`\`markdown
## Steps

1. Analyze the website using these 47 criteria:
   - Title tag present and under 60 characters
   - Meta description present and under 160 characters
   - H1 tag present on every page
   [... 44 more criteria ...]

2. Score each criterion on a 1-5 scale using this rubric:
   - 1: Not present
   - 2: Present but incorrect
   [... detailed rubric ...]
\`\`\`

After (under 200 lines in SKILL.md):
\`\`\`markdown
## Steps

1. Read references/audit-checklist.md for the full criteria list.
2. Read references/scoring-rubric.md for how to score each criterion.
3. Analyze the website against the checklist.
4. Score each criterion using the rubric.
5. Write the report using the format in references/report-template.md.
\`\`\`

The detail moved to reference files that Cowork loads only when it reaches that step. The SKILL.md stays lean.

## Adapting Skills From Your Skill Pack

Here's how to approach editing one of the skills from your pack:

1. **Install the skill** in Cowork
2. **Run it once** with real data. Note what you like and what doesn't fit.
3. **Open the SKILL.md** and check:
   - Does the description match how you'd describe the task?
   - Do the steps match your actual workflow?
   - Does the output format work for you?
4. **Add your context:** Reference your brand-voice.md or other context files
5. **Adjust the output:** Change formatting, sections, or file naming to match your preferences
6. **Test the edited version**

## Hands-On

1. Pick one skill from your pack that's close to what you need but not quite right
2. Run it once with real input (baseline)
3. Make 2-3 targeted edits (add context, change output format, add a step)
4. Run it again with the same input
5. Compare the two outputs

If you have a skill over 200 lines, practice extracting the longest section into a \`references/\` file.

## What You Built

The ability to take any skill and make it work for you. This is arguably more valuable than building skills from scratch, because you're starting from something that already works and making it fit your specific needs.

## Common Mistakes

**Changing everything at once.** If you rewrite the entire skill and the output is worse, you won't know which change caused the problem. Edit one thing at a time and test between changes.

**Not keeping a backup.** Before editing a skill, save a copy of the original. If your edits make things worse, you can revert.

**Ignoring the description when editing steps.** If you add significant new functionality to a skill's steps, the description might need updating too. Otherwise Cowork won't know when to trigger the expanded skill.
`,
      },
    ],
  },
  {
    id: 3,
    title: "Going Further",
    outcome: "You know where skills lead next and how to keep levelling up.",
    lessons: [
      {
        id: "s3-1",
        title: "Where This Goes Next",
        content: `# Where This Goes Next

You've built skills, connected them to real tools, tested them, and made them your own. This final lesson covers the advanced techniques you'll eventually want, and where to find the community of people already doing this at a much deeper level.

## Multi-Skill Workflows

So far, each of your skills runs independently. But skills can chain together naturally in a conversation.

Example: you run your client research brief skill. It produces a structured brief. Then you say "now write a proposal based on that brief" and your proposal skill picks up automatically, using the research output as its input.

You don't need to wire these together explicitly. If both skills are active and their descriptions are clear, Cowork will chain them naturally based on the context of the conversation.

For more complex workflows, you can create a "command" file that orchestrates multiple skills in sequence:

\`\`\`markdown
## Morning Routine

1. Run the daily-briefing skill (pulls Calendar + Gmail)
2. Run the inbox-triage skill (categorizes unread emails)
3. Run the task-planner skill (creates today's priority list from the briefing)
4. Save everything to output/morning-YYYY-MM-DD.md
\`\`\`

One prompt triggers the full sequence.

## Scheduled Tasks

Any skill can run on a schedule without you lifting a finger.

In Cowork, use the schedule feature to set a skill to run hourly, daily, or weekly. The daily briefing skill is the obvious candidate: schedule it for 7am every morning, and your briefing is waiting when you open Cowork.

Two important caveats:
- Your computer needs to be on and Cowork needs to be open for scheduled tasks to run
- Start with read-only or draft-only tasks. Don't schedule a skill that sends emails without your review.

The pattern that works best: schedule skills that gather and organize information (briefings, inbox triage, report summaries). Keep anything that takes action (sending, posting, deleting) as manual tasks where you review the output first.

## Progressive Disclosure

As your skills get more sophisticated, the SKILL.md file can get long. The 200-line guideline exists because Cowork performs better with concise instruction files.

The solution is **progressive disclosure**: keep your SKILL.md lean and store the detail in separate reference files.

\`\`\`
my-skill/
  SKILL.md              (under 200 lines - the table of contents)
  references/
    audit-checklist.md   (loaded only when the audit step runs)
    scoring-rubric.md    (loaded only when the scoring step runs)
    report-template.md   (loaded only when writing the report)
\`\`\`

The SKILL.md points to each reference file at the right step:

\`\`\`markdown
3. Read references/audit-checklist.md and evaluate the website against each criterion.
4. Read references/scoring-rubric.md and score each criterion.
\`\`\`

Cowork loads each file only when it reaches that step, keeping its context window clean and its performance sharp.

## Plugins: Packaging Skills for Others

A plugin is a bundle of related skills, context files, and connector configurations packaged as a single installable unit. If you've built a set of skills that work together (say, a client onboarding workflow with research, proposal, and follow-up skills), you can package them as a plugin and share them.

This is where skill-building stops being just personal productivity and starts becoming something you can offer to clients, team members, or a broader audience.

## The Ceiling You'll Hit (and What's Beyond It)

Everything in this course works inside Cowork's desktop app. For most people, that's more than enough. But if you keep going, you'll eventually hit some limits:

- **No memory between sessions.** Every time you start Cowork, it forgets everything from last time. Your context files help, but they're static. There's no learning loop.
- **No version control.** When you edit a skill, the old version is gone. There's no history, no rollback, no way to track what changed.
- **No automation beyond the desktop.** Scheduled tasks only run when your computer is on and Cowork is open. There's no server, no cloud, no overnight processing.
- **Limited integrations.** Connectors cover the big tools, but if you need something specific (your CRM, your ad platform, your custom database), you'll need more than connectors can offer.

These aren't dealbreakers. They're the edges of what a desktop app can do. For many people, skills + connectors + scheduling is plenty.

But if you find yourself wanting more, there's a path forward.

## The AI Scout Path

There's a community of people who have already pushed past these limits. They call themselves AI Scouts, and they're part of Ads to AI.

Scouts are business owners, marketers, and operators who use AI to run real parts of their business. Not just chat. Not just skills. Full systems that handle research, reporting, client communication, content creation, and automation.

What makes the Scout community different:

- **A shared skill library.** Members build skills and share them. Instead of starting from scratch, you start from something that already works and adapt it.
- **The brain system.** A personal AI infrastructure that goes beyond Cowork. It connects your email, calendar, files, and tools into a single system with memory, version control, and overnight automation. Everything you learned in this course is the foundation; the brain builds on top of it.
- **Monthly Q&A calls.** Live sessions with practitioners working on the same problems. Not theory. Real workflows, real tools, real results.
- **Courses and learning paths.** Structured programs covering automated reporting, AI analysis, and building autonomous systems. Pick up where this course leaves off.
- **A 1:1 strategy call** to help you figure out where to start based on your specific situation.

If you've finished this course and you're thinking "I want to go deeper," that's exactly what the Scout path is for. The link is on the page where you found this course.

## What You've Built Across This Course

Look at where you started and where you are now:

- **Lesson 1:** You understood what a skill is
- **Lesson 2:** You built your first one
- **Lesson 3:** You learned to read and edit the file yourself
- **Lesson 4:** You set up a workspace with context files
- **Lesson 5:** You learned the fastest way to create skills (do it first, then package)
- **Lesson 6:** You made skills trigger reliably
- **Lesson 7:** You added your business context so output sounds like you
- **Lesson 8:** You built interactive skills that gather information
- **Lesson 9:** You connected skills to real tools
- **Lesson 10:** You tested and measured skill quality
- **Lesson 11:** You learned to edit and improve any skill
- **Lesson 12:** You've seen where this goes next

You're no longer someone who types prompts into a chat box. You're someone who builds systems that work consistently, every time. That's a fundamentally different relationship with AI.

The question now is: how far do you want to take it?
`,
      },
    ],
  },
]
