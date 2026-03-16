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
    title: "What is Cowork?",
    outcome: "You understand what Cowork is, how it differs from ChatGPT, and you have it installed and running on your computer.",
    lessons: [
      {
        id: "1-1",
        title: "What is Cowork?",
        content: `# What is Cowork?

You've probably used ChatGPT. You type a question, you get an answer. It's useful. But everything happens inside a browser tab. You copy text in. You copy results out. The AI lives in one world, and your actual work lives in another.

Cowork is different. It's a desktop app from Anthropic (the company behind Claude) that works directly with the files on your computer. Not through copy-paste. Not through uploads. It sits right alongside your documents, spreadsheets, and folders, and it can read them, create new ones, and edit existing ones.

Think of it this way:

**ChatGPT** is like texting a smart friend. You describe your problem, they text back advice. Helpful, but you still do all the work.

**Cowork** is like having that smart friend sitting at your desk, looking at your screen, and actually doing the work with you. You say "organise these files" and the files get organised. You say "turn this data into a report" and a report appears in your folder.

That's the core difference. Cowork doesn't just talk about your work. It does your work.

## What it looks like in practice

When you open Cowork, the first thing you do is point it at a folder on your computer. That folder becomes your workspace. Cowork can see every file inside it, read them, create new ones, and edit existing ones.

> [SCREENSHOT: Cowork working in a folder on your computer]

No copying and pasting. No uploading. The app just has access to everything in that folder. That's what makes it so different from a chat window.

## What you need

- A computer (Mac or Windows)
- A Claude Pro account ($20/month) or higher
- That's it

Cowork is only available on paid Claude plans (Pro, Max, Team, or Enterprise). A free Claude account won't give you access. No coding. No terminal. No technical setup beyond installing the app. If you can install Spotify or Slack, you can install Cowork.

## Try it

If you haven't already, go to [claude.ai](https://claude.ai) and sign up for at least a Pro plan. You'll need it in a couple of lessons when we install the app. If you already have a paid account, you're ahead of the game.
`,
      },
      {
        id: "1-2",
        title: "How It's Different from ChatGPT",
        content: `# How It's Different from ChatGPT

If you've used ChatGPT (or Claude in the browser, or Gemini, or any other chat AI), you already know the basics: type a question, get an answer. That mental model is the right starting point. Cowork builds on it.

But there are some key differences that change everything about how you work. Let's walk through them.

## The copy-paste problem

With ChatGPT, your workflow looks like this:

1. Open ChatGPT in a browser tab
2. Copy some text from a document
3. Paste it into ChatGPT
4. Read the response
5. Copy the response
6. Paste it back into your document

For a quick question, that's fine. For real work, the copying and pasting, back and forth, trying to give the AI enough context... it gets exhausting fast.

Cowork eliminates that entirely. It can already see your files. You don't copy anything in. Results appear as actual files on your computer. You don't copy anything out.

## ChatGPT answers questions. Cowork does tasks.

This is the biggest mental shift. When you use ChatGPT, you're having a conversation. You ask, it answers. You're the one who acts on the information.

With Cowork, you give it a task. "Summarise these meeting notes." "Turn this CSV into a chart." "Draft a follow-up email based on this conversation." And it does the task. The output isn't a chat bubble you need to copy from. It's a file on your computer, ready to use.

|  | ChatGPT | Cowork |
|---|---|---|
| Where it runs | Browser tab | Desktop app |
| How you share files | Copy-paste or upload | Drag in, or point at a folder |
| Where results go | Chat bubble | Real files on your computer |
| Best for | Questions and brainstorming | Tasks and production work |
| Knows about your files | Only what you paste in | Everything you point it at |

## They're not competing

This isn't about Cowork being "better" than ChatGPT. They're different tools for different jobs.

Need a quick answer to a question? ChatGPT (or Claude in the browser) is great. Need to brainstorm ideas? Chat is perfect for that.

But when the work involves your actual files, when you need something created or transformed or organised, that's where Cowork takes over. It's the difference between asking for directions and having someone drive you there.

## Try it

Think of the last time you used ChatGPT for something that involved a lot of copy-pasting. Maybe you were reformatting a document, or extracting information from a spreadsheet, or trying to get a consistent output across multiple inputs.

Write that task down. We're going to do it in Cowork later, and you'll feel the difference immediately.
`,
      },
      {
        id: "1-3",
        title: "Installing Cowork",
        content: `# Installing Cowork

Time to get Cowork on your computer. This takes about two minutes.

## Step 1: Download the app

Go to [claude.ai/download](https://claude.ai/download) and download Cowork for your operating system (Mac or Windows).

> [SCREENSHOT: The Cowork download page showing Mac and Windows options]

## Step 2: Install it

**On Mac:** Open the downloaded .dmg file and drag Cowork to your Applications folder. Just like installing any other app.

**On Windows:** Run the installer and follow the prompts. Default settings are fine.

## Step 3: Open it

Find Cowork in your Applications (Mac) or Start menu (Windows) and open it.

The first time you launch it, you'll need to sign in with your Claude account. If you already use Claude in the browser, use the same login. If you don't have one yet, you can create one right here.

> [SCREENSHOT: Cowork sign-in screen]

## Step 4: You're in

Once you're signed in, you'll see the main Cowork interface.

> [SCREENSHOT: Cowork main interface]

Down the left sidebar you'll see:

- **New task** to start a fresh conversation
- **Search** and **Scheduled** for finding past work or scheduling tasks
- **Ideas** for inspiration on what to try
- **Customize** where skills, connectors, and plugins live (we'll get to that later)
- **Recents** showing your recent sessions (empty for now)

In the centre is the chat area where you type your requests. That's it. No complicated setup.

## If something goes wrong

- **"I can't find the download"**: Check your Downloads folder. The file is called **claude.dmg** on Mac or **claude.exe** on Windows.
- **"It won't open on Mac"**: Right-click the app, choose "Open", then click "Open" again on the security dialog. macOS sometimes blocks new apps the first time.
- **"I can't sign in"**: Make sure you're using the same email as your Claude account. You need a paid plan (Pro or higher) to use Cowork.

## Try it

Install Cowork and open it. That's the whole task for this lesson. Get to the point where you can see the main interface. If you can see a place to type, you're done.
`,
      },
      {
        id: "1-4",
        title: "The Interface Tour",
        content: `# The Interface Tour

You've got Cowork open. Let's look at what you're working with.

## Before you start a conversation

When you first open Cowork, you see the left sidebar and a big empty centre area with a text box at the bottom. We covered the sidebar in the last lesson: New task, Search, Scheduled, Ideas, Customize, and your Recent sessions.

The centre is where everything happens. You type at the bottom, and Cowork responds above. It works like any chat interface, but there's a key difference: when Cowork reads, creates, or edits files, you'll see exactly what it's doing right here in the conversation. Full transparency.

## Once you start a conversation

The right-hand side of the screen stays hidden until you start chatting. Once you do, three panels appear:

> [SCREENSHOT: Cowork active conversation]

- **Progress** shows checkmarks as Cowork works through a task. For longer tasks, you can see how far along it is.
- **Your folder** (shown by name) displays the project folder you're working in and key files like instructions. This is how Cowork knows which files it can see.
- **Context** tracks the tools and referenced files used in this task. It's a quick way to see what Cowork has been reading and working with.

You don't need to interact with any of these panels. They're there so you can see what's happening behind the scenes.

## Settings

Click your name in the bottom left corner to open the settings menu.

> [SCREENSHOT: Cowork settings menu]

You can ignore this for now. It's where you'll find account settings, language options, and links to help. Nothing here that you need for getting started.

## The mental model

Here's the simplest way to think about the interface:

1. **Left sidebar**: Navigation, starting new tasks, and Customize (for later)
2. **Centre**: Your conversation with Cowork
3. **Right panels**: Progress, your folder, and context (only visible during a conversation)

You talk to it in the centre. It works with your files. The sidebar and right panels are there to keep you informed, not to add complexity.

## Try it

Open Cowork, point it at a folder on your computer, and type something simple like "What files are in this folder?" Watch how the right-hand panels appear and update as Cowork works.

You can't break anything. Cowork will always ask before making changes to existing files. So click around freely.
`,
      },
    ],
  },
  {
    id: 2,
    title: "Working With Files",
    outcome: "You can give Cowork files to work with, understand where results go, and know exactly what it can and can't access on your computer.",
    lessons: [
      {
        id: "2-1",
        title: "Giving Cowork a File",
        content: `# Giving Cowork a File

Chatting is nice. But the real power of Cowork shows up when you give it something to work with.

## Working in a folder

The first way to give Cowork files is to point it at a folder. Just below the chat window, you'll see a folder button. Click it to choose which folder Cowork should work in.

> [SCREENSHOT: Cowork folder picker]

Once you've selected a folder, Cowork can see every file inside it. You can ask it to read files, create new ones, or work across multiple documents at once. You don't need to upload anything. Just point it at the folder and start asking.

## Drag and drop

The second way is to drag a file straight into the chat area. Grab a file from Finder (Mac) or File Explorer (Windows) and drop it into the conversation. Cowork will read it and wait for your instructions.

You'll use drag and drop a lot as you go through the demos in this course. It's quick and it works with any file, even if it's not in your current project folder.

## Give it a task

Once Cowork has the file, tell it what to do. Be direct. Here are some things that work well:

- "Summarise this document in 5 bullet points"
- "Turn this into a formatted report"
- "Find all the action items in these notes"
- "Create a table from this data"
- "Rewrite this email to be more professional"

The output might appear in the chat, or it might create a new file. For simple requests like "summarise this," you'll usually see the summary right in the conversation. For bigger tasks like "create a report," it'll create an actual file on your computer.

## Try it in the game

The best way to see all of this in action is to play through the demos. If you haven't started Level 1 yet, head over to the game and try the first demo. You'll drag in a real file, give Cowork a task, and see the result.
`,
      },
      {
        id: "2-2",
        title: "Where Your Results Go",
        content: `# Where Your Results Go

You gave Cowork a file. It did something with it. But where did the result actually go?

This is one of the most important things to understand about Cowork, and it's different from every browser-based AI you've used.

## Results are real files

When Cowork creates something, it creates an actual file on your computer. Not a chat response you need to copy. Not a temporary preview. A real file, in a real folder, that you can open with any app.

Ask Cowork to "create a summary document from these notes" and you'll find a new file in your project folder. Something like \`meeting-summary.md\` or \`summary.txt\`. You can open it in Word, Notion, Google Docs, whatever you normally use.

> [SCREENSHOT: A project folder showing a newly created file from Cowork]

## Where they appear

New files appear in your **project folder**. That's the folder Cowork is currently pointed at. If you're not sure which folder that is, ask: "What folder are we working in?"

You can track what Cowork is working with in the Context panel on the right side of the interface.

## Chat responses vs file creation

Not everything creates a file. There's a simple pattern:

- **Questions** get answered in the chat. ("What's the main theme of this document?" produces a chat response.)
- **Tasks** produce files. ("Create a summary document from this" produces an actual file.)

If you want a file when Cowork gives you a chat response, just say: "Save that as a file called summary.md." It will.

## Editing existing files

Cowork doesn't just create new files. It can also edit existing ones. Say "Fix the typos in meeting-notes.txt" and it'll update the file directly.

The first time Cowork wants to make changes to files in your folder, it'll ask for permission. Once you allow it, that applies to all files in the folder for that session. Destructive actions like deleting files always get a separate permission check, no matter what.

## Try it in the game

Head to the game and play through the Level 1 demos. You'll see Cowork read files, create new ones, and produce results that land right in your project folder.
`,
      },
      {
        id: "2-3",
        title: "What Cowork Can and Can't See",
        content: `# What Cowork Can and Can't See

Before you go further, it's worth understanding the boundaries. Knowing what Cowork can access (and what it can't) will save you confusion and help you feel confident using it with real work.

## What it CAN see

**Your project folder.** Everything inside the folder you've pointed Cowork at. All files, all subfolders, everything. Point it at a different folder and it sees that one instead.

**Files you drag in.** Even if a file isn't in your project folder, you can drag it into the chat and Cowork will read it for that conversation.

**Your conversation history.** Cowork remembers everything you've said in the current conversation. It uses that context to give better answers as you go.

## What it CAN'T see

**Other folders on your computer.** Cowork only sees the folder you've pointed it at. Your desktop, your downloads, your other projects... invisible.

**Your email, browser, or other apps.** By default, Cowork can't read your inbox, check your calendar, or browse websites. It works with local files only. (Later, you can add connectors that give it access to specific services. But that's your choice, and it happens one service at a time.)

**Other people's sessions.** Your conversations are private. Nobody else can see what you're working on.

**Your screen or webcam.** Cowork doesn't watch you work. It only knows what you type and the files you've shared.

## The permission model

The first time Cowork wants to edit or create files in your folder, it'll ask for permission. Once you allow it, that covers all file changes in that folder for the current session.

But destructive actions are different. If Cowork wants to **delete** a file, it always asks separately, even if you've already allowed edits. You'll see exactly what it wants to delete and you can allow or deny it.

> [SCREENSHOT: Cowork asking for permission to delete a file]

You can change which folder Cowork is working in at any time. And you can drag files in from anywhere. So you're always in control of what it has access to.

## Practical takeaway

Cowork is scoped to one folder at a time, plus whatever you drag in. It can't wander into other folders, it can't reach the internet, and it asks before doing anything destructive like deleting files. That's enough access to be very useful, with enough limits to feel safe.

## Try it in the game

Head to the game and play through the Level 1 demos. You'll see how Cowork works with different file types: a website file, an inbox export, and a CSV spreadsheet. Each one shows a different way of giving Cowork something to work with and getting a useful result back.
`,
      },
      {
        id: "2-4",
        title: "Giving Cowork Context",
        content: `# Giving Cowork Context

You've learned how to give Cowork files and folders. But every time you start a new session, Cowork starts fresh. It doesn't remember that you prefer Australian English, or that your business is called "Bright Digital", or that you never want the word "synergy" in anything it writes.

Global Instructions fix that.

## What are Global Instructions?

Global Instructions are a block of text that loads into every Cowork session automatically. Think of it as a permanent briefing note. You write it once, and Claude reads it at the start of every conversation from that point on.

Without Global Instructions, you'd need to remind Cowork of the same things every session. With them, it already knows.

## Where to find them

Click your profile name or icon in the bottom left corner of Cowork to open **Settings**. Select **Cowork** in the left sidebar.

> [SCREENSHOT: Cowork global instructions in settings]

You'll see **Global instructions** at the top with an **Edit** button. Click Edit, type your instructions, and save. That's the entire setup.

## What to put in them

Keep it short. These instructions load with every session, so don't write a novel. Aim for a few clear lines covering:

**Who you are and what your business does.** One or two sentences. This stops Claude from making wrong assumptions.

*"I run a digital marketing agency in Melbourne called Bright Digital. My clients are e-commerce brands in fashion and homewares."*

**How you want Claude to write.** Your preferred tone, spelling conventions, anything about voice.

*"Write in a professional but friendly tone. Use Australian English. Keep things concise."*

**Rules that always apply.** Things Claude should always do or never do.

*"Always check for existing files before creating new ones. Never use the words leverage, synergy, or utilise."*

## A simple starting point

Here's a template you can copy and adapt:

\`\`\`
I run [business name], a [what you do] in [location].
My customers are [who you serve].

Write in a [tone] voice. Use [Australian/British/American] English.

Rules:
- [Your most important rule]
- [Another rule]
- [One more if needed]
\`\`\`

You can always add more later. Start simple.

## What Global Instructions don't do

Global Instructions tell Claude about your preferences and rules. They don't give Claude access to anything new. Files, folders, and connectors are separate. Think of Global Instructions as "who I am and how I work" and everything else as "what I'm working on right now."

## Try it

Open Settings, go to Cowork, and write three lines of Global Instructions. Your business name, your preferred tone, and one rule. Then start a new session and notice how Claude's responses already feel more tailored.
`,
      },
    ],
  },
  {
    id: 3,
    title: "Skills",
    outcome: "You understand what skills are, you've installed one, and you've seen the difference between generic Cowork and a skill-powered specialist.",
    lessons: [
      {
        id: "3-1",
        title: "What Is a Skill?",
        content: `# What Is a Skill?

You've seen what Cowork can do with files. It reads them, creates new ones, follows your instructions. That's useful on its own.

But there's a gap between "useful" and "exactly what I needed." When you ask Cowork to summarise meeting notes, you get a summary. It's fine. But it's not the structured action items with owners, due dates, and a follow-up email that you actually wanted.

A skill closes that gap.

## What a skill actually is

A skill is a set of instructions that turns Cowork from a generalist into a specialist. It's a zip file you download and install. Inside, there's a text file (called SKILL.md) that tells Cowork exactly what to do, what format to use, and what "good output" looks like for a specific task.

Think of it like giving a smart assistant a detailed playbook. Without the playbook, they'll do their best and probably get you 70% of the way there. With the playbook, they nail it every time.

## Without a skill vs with a skill

Here's a concrete example. You give Cowork a blog post and ask it to create social media content.

**Without a skill:** You get a generic response. Maybe a LinkedIn post, maybe a tweet. The format varies each time, the tone might not match your voice, and you'll spend time editing.

**With the Content Repurposer skill:** You get a LinkedIn post, a Twitter thread, an email newsletter version, and a short video script. All formatted correctly for each platform, all in a single interactive HTML page with copy buttons. Consistent every time.

Same AI. Same input. Dramatically different output. The skill didn't make Cowork smarter. It told Cowork exactly what you needed.

> [SKILL: Content Repurposer]

## Skills are simple

A skill is just a folder with a few files:

- **SKILL.md**: The instructions, written in plain English. This is the core of every skill.
- **Scripts** (optional): Code that handles calculations or formatting, so the AI doesn't have to guess at maths.
- **Templates** (optional): Starting points for output structure.

You don't need to write these. You install pre-built skills as zip files. That's it.

## Why this matters

If you've played through the Level 1 demos in the game, you saw Cowork handle a website, emails, and data. Those results were decent. Now imagine those same tasks, but with a specialist skill telling Cowork exactly how to handle each one. That's Level 2 in the game, and the difference is obvious.

Skills are what turn Cowork from a clever chatbot into a practical business tool.

## Try it in the game

If you haven't played the Level 1 demos yet, do that first. Then move to Level 2, where you'll see the same types of tasks handled by skill-powered Cowork. The before-and-after speaks for itself.
`,
      },
      {
        id: "3-2",
        title: "Installing a Skill",
        content: `# Installing a Skill

Installing a skill takes about 30 seconds. Here's how.

## Step 1: Get the skill file

Skills come as zip files. You can download them from the [game demos](/play) (Level 2 has several), or from the Ads to AI community if you're a member. Save the zip file somewhere easy to find. Your desktop works.

The game includes these skills you can download and try:

- **Content Repurposer** (from Demo 4)
- **Meeting Intelligence** (from Demo 5)
- **Search Term Analyzer** (from Demo 6)
- **CSV Analyzer** (from Demo 10)

## Step 2: Open Customize

Click **Customize** in the left sidebar. You'll see three options: Connect your tools, Create new skills, and Browse plugins.

> [SCREENSHOT: Finding the Customize button in Cowork]

## Step 3: Go to Skills and upload

Click **Skills** in the left panel, then click the **+** button in the top right. Choose the third option, **Upload a skill**, and select your downloaded zip file. Cowork unpacks it and installs the skill automatically.

> [SCREENSHOT: The Skills section in Customize]

That's it. The skill appears in your list and is ready to use.

## Using the skill

Now drag in a file that matches the skill's purpose and tell Cowork what to do.

> [SCREENSHOT: Dragging a file into Cowork]

For example, with the Content Repurposer installed:

1. Drag in a blog post or article
2. Type: "Repurpose this content for social media"

Cowork recognises the installed skill and uses it. The output will be structured, formatted, and ready to use.

You can also be explicit: "Use the Content Repurposer skill on this file." Both approaches work.

## If something goes wrong

- **Cowork didn't use the skill**: Be more explicit in your request. Name the skill directly.
- **The zip won't upload**: Make sure you're uploading the .zip file itself, not an unzipped folder.
- **Can't find Customize**: It's in the left sidebar, labelled "Customize" with a briefcase icon.

## Try it in the game

Play through the Level 2 demos. Each one lets you download a real skill zip file and see what it produces. You can install these same skills in your own Cowork afterwards.
`,
      },
      {
        id: "3-3",
        title: "Skills in Action",
        content: `# Skills in Action

You know what skills are and how to install them. Now let's look at what they actually produce. These map directly to the Level 2 demos in the game, so you can try each one yourself.

## Content Repurposer

**The task:** You have one blog post. You need content for LinkedIn, Twitter, email, and maybe a video script.

**Without a skill:** You get a generic rewrite for each platform. Inconsistent formatting, no structure, no export options.

**With the skill:** You get an interactive HTML page with tabs for each platform. LinkedIn gets a professional hook. Twitter gets a thread with hashtags. Email gets a personal intro and clear CTA. Each tab has a copy button. One input, multiple polished outputs.

This is Demo 4 in the game. Try it with the sample blog post, then try it with something you've written.

## Meeting Intelligence

**The task:** You have messy meeting notes. You need to know what was decided, who's doing what, and you need to send a follow-up email.

**Without a skill:** You get a summary. It's okay, but decisions and action items are mixed together, and you still need to write the follow-up email yourself.

**With the skill:** You get structured sections: decisions made, action items with owners and due dates, key discussion points, open questions, and a ready-to-send follow-up email. Everything separated and organised.

This is Demo 5 in the game. The difference between generic notes and skill-powered extraction is stark.

## Search Term Analyzer / CSV Analyzer

**The task:** You have raw data in a CSV. Could be search terms, campaign metrics, sales figures, anything with rows and columns. You need insights.

**Without a skill:** You get a text summary. Some numbers, some observations. Hard to share, hard to dig into.

**With the skill:** You get an interactive dashboard. Charts pick the right visualisation automatically. Key metrics are highlighted at the top. You can filter and sort. The skill's scripts handle the maths, so the numbers are reliable.

These are Demos 6 and 10 in the game. Same data, but the skill turns a wall of numbers into something you can actually use.

## The pattern

Every skill follows the same pattern:

1. Give Cowork a file
2. The skill tells Cowork exactly what to do with it
3. You get structured, consistent, ready-to-use output

Three or four skills covering your most common tasks will save you hours every week. And these are just the starting point. Imagine having dozens, each one a specialist for a different part of your work.

## Try it in the game

Play through the Level 2 demos. Download the skills. See the results. Then think about which of your regular tasks would benefit from this kind of structure.
`,
      },
    ],
  },
  {
    id: 4,
    title: "What's Next",
    outcome: "You understand how Cowork connects to your real tools, how to stay safe, and where to go to keep building.",
    lessons: [
      {
        id: "4-1",
        title: "Connectors and the Real World",
        content: `# Connectors and the Real World

So far, everything you've done with Cowork has been with files on your computer. Drag a file in, get a result back. That's powerful on its own.

But your work doesn't live entirely in files. It's in your email, your calendar, your project management tool, your CRM. Connectors are how Cowork reaches those places.

## What's a connector?

A connector links Cowork to an external service. Once connected, Cowork can read from (and sometimes write to) that service, just like it reads files in your folder.

You can access your connected services from the **+** menu below the chat window, under **Connectors**.

> [SCREENSHOT: Cowork connectors menu]

For example:

- **Gmail**: Cowork reads your emails, searches your inbox, drafts responses
- **Google Calendar**: Cowork sees your schedule, finds free time, summarises your week
- **Google Drive**: Cowork searches and reads files stored in your Drive

## Why this changes things

With files only, Cowork is a great assistant for document work. With connectors, it starts working across your whole day.

Imagine asking: "What's in my inbox that relates to meetings happening this week?" That question requires access to both email and calendar. No single tool gives you that answer easily. Cowork with both connectors does.

Or: "Triage my inbox, check my calendar for gaps tomorrow, and draft replies to the urgent ones." That's files, email, and calendar working together in one request.

## You don't need to set these up now

Connectors are an "unlock when you're ready" feature. You install them from **Customize > Connectors** in Cowork, and each one requires you to sign in to the relevant service and grant access.

> [SCREENSHOT: Cowork connectors panel]

The game's Level 3 demos show what this looks like in practice. The first Level 3 demo combines inbox and calendar data to show cross-service intelligence.

## The right approach

Start with reading. Let Cowork summarise your inbox and calendar. Get comfortable with how it interprets your data. Only then move to letting it draft emails or create events. Start passive, then go active.

## Try it in the game

Head to the Level 3 demos in the game. You'll see how connectors let Cowork work across services, not just files. It's where "helpful with documents" becomes "runs parts of your business."
`,
      },
      {
        id: "4-2",
        title: "Safety and Trust",
        content: `# Safety and Trust

AI is powerful. It's also imperfect. Here's what you need to know about using Cowork safely, without the scare tactics.

## What Cowork does well

Cowork is transparent about its work. Every action it takes shows up in your conversation. You can see exactly which files it read, what it created, and what changes it's proposing. There's no hidden activity.

When it wants to edit an existing file, it asks first. You see the proposed changes and approve or reject them. It doesn't silently overwrite your work.

## Where to be careful

**Always review important output.** Cowork is very capable, but it can make mistakes. If you're sending a client email, check it. If it's calculating numbers, verify the key figures. The same way you'd review work from a new team member before it goes out the door.

**Be aware of what you share.** When you point Cowork at a folder, it can see everything in that folder. If there are sensitive files you don't want the AI to process, put them in a separate folder. Cowork only sees what you point it at.

**AI output is a draft, not a final product.** For internal notes, summaries, and first drafts, Cowork's output is usually good enough to use directly. For anything external-facing or high-stakes, treat it as a strong starting point that you refine.

## The hidden payload demo

The game has a Level 3 demo about a newsletter with a hidden payload. It's a practical lesson about how AI can catch things humans miss, and also about why healthy scepticism matters. Worth playing through.

## The practical stance

Cowork is a tool. Like any tool, it works best when you understand what it's good at and where it needs supervision. You wouldn't send a first draft from a new hire to a client without reading it. Same idea here.

The good news: Cowork shows you everything it's doing. You're never in the dark about what's happening. That transparency is built in, not bolted on.

## Try it in the game

Play the Level 3 security demo (Demo 9). It's a quick, practical lesson about staying sharp when working with AI.
`,
      },
      {
        id: "4-3",
        title: "Going Further",
        content: `# Going Further

You've learned the basics. You've seen what Cowork can do with files, and what it can do when you add skills. Let's talk about where this goes.

## The brain system

Cowork is great for individual tasks. But the brain system is where it gets serious.

The brain is a separate, more powerful tool built on Claude Code. It's where you or someone technical in your business creates the skills, automations, and workflows that the rest of your team then uses in Cowork. Think of it as the engine room. The brain handles email management, content creation, project tracking, contact management, meeting follow-ups, daily briefings, and more.

The skills you've been downloading in this course? Someone built those in the brain. The connectors, the structured outputs, the templates. All created once in the brain, then packaged as skills that anyone can use in Cowork.

If Cowork is where your team gets work done, the brain is where you build the system that makes that work better.

## The Ads to AI community

Everything in this course is a starting point. The Ads to AI community is where it goes further:

- **A thriving community** of people building with AI, sharing what works, helping each other
- **The brain system**: a complete AI infrastructure that manages email, content, projects, contacts, and more
- **50+ ready-made skills** for different industries and tasks
- **Courses** from beginner to advanced, including building your own skills and automations
- **Monthly Q&A calls** to get your questions answered live

You've already experienced the demos. You've seen what a few skills can do. The community is where you get the full toolkit and the support to make it work for your specific business.

## What to do right now

1. **Play through any game demos you haven't tried.** Each one teaches you something new and lets you download real skills.
2. **Install a skill and use it on your own files.** The shift from demo data to your actual work is where it clicks.
3. **Join the Ads to AI community** to get the brain system, 50+ skills, courses, and a community that's building with AI every day.
`,
      },
    ],
  },
]
