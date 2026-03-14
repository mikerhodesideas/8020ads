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
        title: "What Cowork Is",
        content: `# What Cowork Is

You've probably used ChatGPT. You type a question, you get an answer. It's useful. But everything happens inside a browser tab. You copy text in. You copy results out. The AI lives in one world, and your actual work lives in another.

Cowork is different. It's a desktop app from Anthropic (the company behind Claude) that works directly with the files on your computer. Not through copy-paste. Not through uploads. It sits right alongside your documents, spreadsheets, and folders, and it can read them, create new ones, and edit existing ones.

Think of it this way:

**ChatGPT** is like texting a smart friend. You describe your problem, they text back advice. Helpful, but you still do all the work.

**Cowork** is like having that smart friend sitting at your desk, looking at your screen, and actually doing the work with you. You say "organise these files" and the files get organised. You say "turn this data into a report" and a report appears in your folder.

That's the core difference. Cowork doesn't just talk about your work. It does your work.

## What it looks like in practice

Here's a simple example. Say you have a messy folder of client notes. In ChatGPT, you'd need to copy each note, paste it in, ask for help, copy the result back out. For ten files, that's painful.

In Cowork, you point it at the folder and say: "Read all these notes and create a summary document organised by client." Thirty seconds later, there's a new file in your folder with exactly that.

> [SCREENSHOT: Cowork creating a summary document from a folder of files]

That's not magic. It's not complicated. You just need to know how to talk to it, which is what this course is for.

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

| | ChatGPT | Cowork |
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

> [SCREENSHOT: Dragging Cowork to Applications on Mac]

## Step 3: Open it

Find Cowork in your Applications (Mac) or Start menu (Windows) and open it.

The first time you launch it, you'll need to sign in with your Claude account. If you already use Claude in the browser, use the same login. If you don't have one yet, you can create one right here.

> [SCREENSHOT: Cowork sign-in screen]

## Step 4: You're in

Once you're signed in, you'll see the main Cowork interface. Don't worry about understanding everything yet. We'll do a proper tour in the next lesson.

For now, just notice a few things:

- There's a text area where you type (just like any chat)
- There's a sidebar or panel that shows files
- It feels familiar, like a chat app, but with some extra pieces

> [SCREENSHOT: Cowork main interface after first sign-in]

## If something goes wrong

- **"I can't find the download"**: Check your Downloads folder. The file is called something like "Cowork-Setup" or "Cowork.dmg".
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

The interface has a few key areas. None of them are complicated, but knowing what each one does will save you a lot of confusion later.

## The chat area

This is the big area in the middle. It works like any chat interface you've used. You type at the bottom, messages appear above. Cowork responds in the same space.

> [SCREENSHOT: The chat area with a simple conversation]

The difference from a browser chat: when Cowork creates or edits files, you'll see that happen right here in the conversation. It'll show you what it's reading, what it's creating, and what it changed. Transparency is built in.

## The project folder

On the right side (or in the sidebar, depending on your setup), you'll see a file browser. This shows the files in your current project folder.

> [SCREENSHOT: The file browser panel showing a folder with files]

This is important: **Cowork works within a folder.** When you open Cowork, you choose which folder it should focus on. It can see all the files in that folder, and any new files it creates will go there too.

Think of it like opening a project in any app. You tell it where to look, and that becomes its workspace.

## The Customize menu

Click the Customize button (or look for the settings/gear area). This is where you'll eventually add skills, connectors, and plugins. We won't use it yet, but know it's there.

> [SCREENSHOT: The Customize menu or button location]

## What you can ignore for now

- Advanced settings
- Developer tools
- Any configuration panels

You don't need any of that to start. The basics are: type in the chat area, point it at a folder, and let it work. Everything else is optional and we'll cover it when it becomes useful.

## The mental model

Here's the simplest way to think about the interface:

1. **Left/sidebar**: Navigation and settings
2. **Centre**: Your conversation with Cowork
3. **Right**: The files Cowork can see and create

You talk to it in the centre. It works with files on the right. And as you get more advanced, you'll configure it on the left.

## Try it

Open Cowork and explore the interface. Click on things. Type "Hello, what can you help me with?" and see what happens. Open the file browser and see what folder it's pointed at.

You can't break anything. Cowork will always ask before making changes to existing files. So click around freely. Get comfortable with where things are.
`,
      },
    ],
  },
  {
    id: 2,
    title: "Your First Conversation",
    outcome: "You've had your first real conversation with Cowork, given it a file to work with, and seen it create something useful on your computer.",
    lessons: [
      {
        id: "2-1",
        title: "Starting a Chat",
        content: `# Starting a Chat

You've got Cowork open. The chat area is staring at you. Now what?

Just type. Seriously. Type anything. Ask it a question. Give it a task. Say hello. There's no wrong way to start.

## Your first message

Here are some good first messages to try:

- "What can you help me with?"
- "I'm new to Cowork. What should I know?"
- "Can you see any files right now?"

That last one is useful because it tells you whether Cowork is pointed at a folder with files in it, or if it's starting with an empty workspace.

> [SCREENSHOT: A simple first conversation in Cowork]

## How it responds

Cowork responds in the chat, just like ChatGPT or any other AI chat. You'll see text, sometimes formatted with bold, bullet points, or headings.

But here's what's different: if you ask it to do something that involves files, it won't just tell you how. It'll do it. Ask it to create a to-do list and it'll create an actual file. Ask it to read a document and it'll actually read the file, not ask you to paste it in.

## Having a conversation

You can go back and forth, just like any chat. Ask a follow-up question. Change your mind. Give more detail. Cowork remembers everything you've said in the current conversation.

A few tips for good conversations:

- **Be specific about what you want.** "Summarise this document" works. "Help me with this" is too vague.
- **Tell it the format you want.** "Give me bullet points" or "Create a table" or "Write it as a short paragraph."
- **Don't worry about being too polite or too casual.** Cowork doesn't care about tone. It cares about clarity.

## Starting a new conversation

Each conversation is a fresh start. If you want to work on something new, start a new conversation. The old one is still there in your history if you need it.

## Try it

Start a conversation with Cowork. Ask it: "I have a folder of documents I need help organising. What information would you need from me to help?"

Read what it says. This gives you a feel for how it thinks and what kind of instructions work best.
`,
      },
      {
        id: "2-2",
        title: "Giving Cowork a File",
        content: `# Giving Cowork a File

Chatting is nice. But the real power of Cowork shows up when you give it something to work with.

## How to give it a file

There are two ways:

**1. Drag and drop.** Grab a file from your desktop or file explorer and drag it right into the chat area. Cowork will read it and wait for your instructions.

> [SCREENSHOT: Dragging a file into the Cowork chat area]

**2. Just mention it.** If the file is already in your project folder, you can just reference it: "Read the file called meeting-notes.txt" or "Look at the spreadsheet in this folder." Cowork will find it.

## Give it a task

Once Cowork has the file, tell it what to do. Here are some things that work well:

- "Summarise this document in 5 bullet points"
- "Turn this into a formatted report"
- "Find all the action items in these notes"
- "Create a table from this data"
- "Rewrite this email to be more professional"

Be direct. You're giving instructions, not having a philosophical conversation.

## Watch it work

This is the moment that surprises most people the first time. Cowork reads your file, processes it, and creates something new. You'll see it working in the chat: reading the file, thinking through the task, then producing the output.

> [SCREENSHOT: Cowork reading a file and producing a summary]

The output might appear in the chat, or it might create a new file. For simple requests like "summarise this," you'll usually see the summary right in the conversation. For bigger tasks like "create a report," it'll create an actual file.

## A simple exercise

Let's do this for real. Create a text file on your computer with this content (or anything similar):

**meeting-notes.txt**
\`\`\`
Team meeting March 10
Attendees: Sarah, James, Priya, Tom

Discussion:
- Website redesign is behind schedule. Sarah will follow up with the developer.
- New pricing page needs to be live by April 1.
- James pitched the idea of a customer survey. Team agreed. Priya will draft questions.
- Tom flagged that the email automation is broken. Needs fixing this week.
- Next meeting: March 17.
\`\`\`

Now drag that file into Cowork and type: "Read these meeting notes and give me a list of action items with who is responsible for each."

## Try it

Do the exercise above. Create the file, drag it in, ask for action items. See what comes back. If you already have real meeting notes, even better. Use those.
`,
      },
      {
        id: "2-3",
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

You can also see new files appear in the file browser panel on the right side of the Cowork interface. They show up in real time as Cowork creates them.

## Chat responses vs file creation

Not everything creates a file. There's a simple pattern:

- **Questions** get answered in the chat. ("What's the main theme of this document?" produces a chat response.)
- **Tasks** produce files. ("Create a summary document from this" produces an actual file.)

If you want a file when Cowork gives you a chat response, just say: "Save that as a file called summary.md." It will.

## The "wait, it actually did it" moment

This is the point where most people realise Cowork is something different. You didn't copy anything. You didn't paste anything. You pointed at a file, said what you wanted, and the result appeared in your folder, ready to use.

No exporting. No reformatting. No "let me just clean this up." It's done.

> [SCREENSHOT: Opening a Cowork-created file in another application]

## Editing existing files

Cowork doesn't just create new files. It can also edit existing ones. Say "Fix the typos in meeting-notes.txt" and it'll update the file directly.

Important: Cowork always asks permission before changing an existing file. You'll see what it wants to change and you approve or reject the edit. It never silently overwrites your work.

## Try it

Go back to the exercise from the previous lesson (or start a new one). This time, ask Cowork to create a file: "Create a new file called action-items.md with the action items from these notes, formatted as a checklist."

Then go to your project folder and open the file. It's really there. That's Cowork.
`,
      },
    ],
  },
  {
    id: 3,
    title: "Working With Your Files",
    outcome: "You can point Cowork at any folder, ask it to read and organise your files, and you understand what it can and can't access on your computer.",
    lessons: [
      {
        id: "3-1",
        title: "Pointing Cowork at a Folder",
        content: `# Pointing Cowork at a Folder

So far you've worked with individual files. That's useful, but the real power comes when you point Cowork at an entire folder. It can see everything inside, understand how files relate to each other, and work across multiple documents at once.

## Setting your project folder

When you open Cowork, you'll see an option to choose your project folder. This is the folder Cowork will work within for this session.

> [SCREENSHOT: Choosing a project folder in Cowork]

You can pick any folder on your computer:
- A project folder with client files
- Your desktop (if that's where your files live)
- A specific folder you've set up for experimenting

Once selected, Cowork can see every file and subfolder inside it.

## Why folders matter

Working with a folder is different from working with a single file. Here's why:

**Context.** When Cowork can see all the files in a folder, it understands the bigger picture. Instead of "summarise this one document," you can say "look at all the client notes in this folder and tell me which projects are behind schedule."

**Connections.** Cowork can find relationships between files. "Compare the budgets in these three spreadsheets" or "find all the files that mention the Henderson project."

**Batch operations.** Need to rename 20 files? Reformat 10 documents? Cowork can work through the whole folder, not just one file at a time.

## Creating a practice folder

If you want to follow along without touching any important files, create a practice folder:

1. Create a new folder on your desktop called "cowork-practice"
2. Put a few files in it: text files, a spreadsheet, some notes, anything you have lying around
3. Point Cowork at this folder

This gives you a safe space to experiment. Cowork can't see anything outside this folder, and you can delete the whole thing when you're done.

## Try it

Create a practice folder with at least 3-4 different files in it. They can be anything: old notes, a spreadsheet, some text files, maybe a document you've been meaning to organise. Point Cowork at the folder and ask: "What files are in this folder? Give me a quick summary of each one."

See how Cowork reads through everything and gives you an overview. That's the starting point for everything we'll do next.
`,
      },
      {
        id: "3-2",
        title: "Reading, Summarising, and Organising",
        content: `# Reading, Summarising, and Organising

Now that Cowork can see your folder, let's put it to work. These are the bread-and-butter tasks that save the most time, and they're all simple to ask for.

## Reading files

The simplest thing you can do: ask Cowork to read something and tell you what's in it.

- "Read the file quarterly-report.pdf and give me the key numbers"
- "What's in the spreadsheet? Give me a summary of the columns and what they contain"
- "Read all the files in the /notes subfolder"

Cowork handles text files, CSVs, PDFs, and most common document formats. If it can't read something, it'll tell you.

## Summarising

This is where Cowork starts saving you real time. Instead of reading through ten documents yourself, ask Cowork to do it:

- "Summarise all the files in this folder. One paragraph per file."
- "Give me the top 3 takeaways from each document in the /reports folder"
- "Read these meeting notes and tell me what decisions were made"

The summaries appear in the chat, but you can always say "save that as a file" if you want to keep them.

## Organising

This is the one that feels like magic the first time. Cowork can reorganise files, rename them, create folder structures, and move things around:

- "Organise these files into subfolders by topic"
- "Rename all these files to follow the pattern YYYY-MM-DD-topic.md"
- "Create an index file that lists every document in this folder with a one-line description"

> [SCREENSHOT: Before and after of a messy folder that Cowork has organised]

**Important:** Cowork will always show you what it plans to do before making changes. You'll see a list of proposed renames or moves, and you approve them. It doesn't just start shuffling files around without asking.

## Combining tasks

The real efficiency comes from chaining these together:

"Read all the files in this folder. Create a summary document with one section per file. Then suggest a better folder structure and rename the files to be more consistent."

That's one instruction. Three tasks. Cowork handles the whole sequence.

## Try it

Point Cowork at your practice folder (or any folder with a few files) and try this:

"Read every file in this folder. Create a new file called INDEX.md that lists each file with a one-sentence description of what it contains. Sort the list by topic."

Check the result. It should be a clean, organised index of everything in your folder. If something's off, tell Cowork what to fix. It'll update the file.
`,
      },
      {
        id: "3-3",
        title: "What Cowork Can and Can't See",
        content: `# What Cowork Can and Can't See

Before you go further, it's worth understanding the boundaries. Knowing what Cowork can access (and what it can't) will save you from confusion later, and help you feel confident about privacy and safety.

## What it CAN see

**Your project folder.** Everything inside the folder you've pointed Cowork at. All files, all subfolders, everything.

**Files you drag in.** Even if a file isn't in your project folder, you can drag it into the chat and Cowork will read it for that conversation.

**Your conversation history.** Cowork remembers everything you've said in the current conversation. It uses that context to give better answers and avoid repeating itself.

## What it CAN'T see

**Other folders on your computer.** Cowork only sees the folder you've pointed it at. Your emails, your browser tabs, your other applications: invisible to it.

**The internet.** By default, Cowork can't browse websites or search Google. It works with local files. (Later, in Module 6, we'll cover connectors that let it access specific online services like email.)

**Other people's Cowork sessions.** Your conversations are private. Nobody else can see what you're doing.

**Your screen or webcam.** Cowork doesn't "watch" you work. It only knows what you type and the files you've given it access to.

## What it CAN do with your files

- **Read** any file in your project folder
- **Create** new files in your project folder
- **Edit** existing files (with your permission)
- **Rename** or move files (with your permission)
- **Delete** files (with your permission, and it always confirms first)

## The permission model

This is important: **Cowork always asks before changing your files.**

If you say "rewrite this document," Cowork will show you the proposed changes and wait for your approval. You can accept, reject, or ask for modifications. It never silently overwrites your work.

> [SCREENSHOT: Cowork asking for permission before editing a file]

This is one of the things that makes Cowork safe to use with real work files. You're always in control.

## The mental model

Think of Cowork as a very capable assistant sitting in one room of your house. They can see everything in that room (your project folder) and do impressive work with it. But they can't wander into other rooms, they can't leave the house to check the post, and they always knock before rearranging the furniture.

That's the right level of trust for now. Enough access to be genuinely useful. Enough limits to feel safe.

## Try it

Ask Cowork these questions about its own access:

1. "What folder are we working in right now?"
2. "How many files can you see?"
3. "Can you access the internet?"

The answers will confirm everything above. And if anything surprises you, this is a good time to ask follow-up questions. Cowork is great at explaining its own capabilities.
`,
      },
    ],
  },
  {
    id: 4,
    title: "Adding Skills",
    outcome: "You understand what skills are, you've installed your first one, and you've seen the dramatic difference between generic AI and a skill-powered specialist.",
    lessons: [
      {
        id: "4-1",
        title: "What Is a Skill?",
        content: `# What Is a Skill?

So far, everything you've done with Cowork has been using its general intelligence. You ask, it does its best. And that's pretty good.

But here's the thing: Cowork is like a smart person who just arrived at your company on their first day. They're capable and willing, but they don't know your processes, your preferences, or what "good" looks like in your specific context.

A skill changes that.

## Skills in plain English

A skill is a set of instructions that turns Cowork from a generalist into a specialist. It tells Cowork:

- What task to focus on
- What format the output should follow
- What rules to apply
- What scripts to run for calculations or formatting

When you install a skill, you're giving Cowork expertise in one specific area. Instead of "do your best with this data," the skill says "extract action items, categorise them by urgency, assign owners based on the attendee list, and format the output as a checklist with due dates."

## Without a skill vs with a skill

Here's a concrete example. Say you give Cowork a blog post and ask it to repurpose the content for social media.

**Without a skill**, you get a generic response. Maybe a tweet thread, maybe a LinkedIn post. The format is inconsistent, it might miss your brand voice, and you'll need to edit heavily.

**With the Content Repurposer skill**, you get:
- A LinkedIn post in your tone
- A Twitter/X thread with hooks
- An email newsletter version
- A short-form video script
- All in an interactive HTML page with tabs and copy buttons

Same input. Dramatically different output. The difference isn't that Cowork got smarter. It's that the skill told it exactly what "good" looks like.

## What's inside a skill?

A skill is just a folder containing a few files:

- **SKILL.md**: The instructions. This is the "brain" of the skill. It tells Cowork what to do, step by step, and what the output should look like.
- **Scripts** (optional): Code files that handle calculations, formatting, or data processing. These ensure consistent, precise output that doesn't rely on the AI to do maths.
- **Templates** (optional): Starting points for the output format.

You don't need to write these yourself (though you can). For now, you'll install pre-built skills that are ready to go.

## Why this matters

Skills are what make Cowork a practical business tool instead of just a clever chatbot. A chatbot gives you suggestions. A skill-powered Cowork gives you finished, ready-to-use output.

Every demo you try in [the interactive game](/play) uses a skill. That's why the results look polished and professional. It's not a different AI. It's the same AI with better instructions.

## Try it

Think about a task you do regularly where the output always follows the same format. Maybe it's:

- A weekly report that always has the same sections
- A client email that follows a certain structure
- A data analysis that needs specific metrics calculated

That repetitive structure is exactly what a skill captures. Write down one task like this. In the next lesson, you'll install a skill and see the difference for yourself.
`,
      },
      {
        id: "4-2",
        title: "Installing Your First Skill",
        content: `# Installing Your First Skill

Time to install a skill. This takes about 30 seconds, and it's the single biggest upgrade to how Cowork works for you.

## What you'll install

We're going to install the **Content Repurposer** skill. It takes a blog post, article, or any piece of long-form content, and turns it into multiple formats: LinkedIn post, tweet thread, email newsletter, and more. All in one go.

You can download the skill from the [interactive game](/play) (it's one of the Level 2 demos), or Mike will provide a direct download link.

## Step by step

### 1. Download the skill

Download the \`content-repurposer.zip\` file and save it somewhere easy to find (your desktop is fine).

### 2. Open Cowork's Customize menu

In Cowork, look for the **Customize** button. It's usually in the sidebar or settings area.

> [SCREENSHOT: Finding the Customize button in Cowork]

### 3. Go to Skills

In the Customize panel, click on **Skills**. You'll see any skills you've already installed (probably none yet).

> [SCREENSHOT: The Skills section in Customize, empty state]

### 4. Click the + button

Click the **+** (add) button to install a new skill.

> [SCREENSHOT: The add skill button]

### 5. Upload the zip file

Select the \`content-repurposer.zip\` file you downloaded. Cowork will unpack it and install the skill.

> [SCREENSHOT: Uploading a skill zip file]

### 6. Done

That's it. The skill is installed. You'll see it listed in your Skills panel.

> [SCREENSHOT: The Content Repurposer skill installed and visible in the Skills list]

## Running the skill

Now let's use it. You need a piece of content to repurpose. You can:

- Use a blog post you've written
- Copy an article you like into a text file
- Use the sample file from the game demos

Drag the content file into Cowork and type:

"Use the Content Repurposer skill on this article."

Or simply:

"Repurpose this content for social media."

Cowork will recognise that you have the skill installed and use it automatically. Watch what happens.

> [SCREENSHOT: Cowork running the Content Repurposer skill, showing the output]

## What you should see

The skill produces an interactive HTML file with:
- Multiple tabs (LinkedIn, Twitter, Email, etc.)
- Copy buttons for each version
- Consistent formatting across all outputs
- Content adapted to each platform's style

Open the HTML file in your browser. Click through the tabs. This is what a skill does: turns a vague task into a precise, polished, ready-to-use result.

## If something goes wrong

- **"Cowork didn't use the skill"**: Try being more explicit: "Run the Content Repurposer skill on this file."
- **"The zip won't upload"**: Make sure you're uploading the .zip file directly, not an unzipped folder.
- **"I can't find Customize"**: It might be behind a menu icon or in the sidebar. Look for a gear icon or three dots.

## Try it

Install the Content Repurposer skill and run it on any piece of content you have. A blog post, an article, even a long email. See what comes back. That's the baseline for what a skill can do.
`,
      },
      {
        id: "4-3",
        title: "Generic AI vs Skilled AI",
        content: `# Generic AI vs Skilled AI

You've installed a skill. You've seen what it produces. Now let's make sure the lesson really sinks in, because this distinction is the core idea of everything that follows.

## The test

Here's a simple comparison. Take the same piece of content and give it to Cowork twice.

**First, without the skill.** Start a new conversation (so Cowork doesn't use the skill automatically) and type:

"Here's a blog post. Repurpose it for LinkedIn, Twitter, and email newsletter."

Read what you get back.

**Then, with the skill.** In a new conversation (or the same one), type:

"Use the Content Repurposer skill on this blog post."

Compare the two outputs.

## What you'll notice

The generic response is... fine. It's helpful. The AI does its best. But you'll likely see:

- Inconsistent formatting between platforms
- Missing elements you'd want (like hashtags, hooks, or character counts)
- A wall of text instead of something you can immediately use
- No export options, no copy buttons, no interactivity

The skilled response is different. It's structured, consistent, and practical. Every platform has the right format. There are copy buttons. The output is an HTML page you can open and use immediately.

## Why the difference?

It's not that the AI is smarter with a skill. It's that the skill removes the guesswork.

Without a skill, Cowork has to figure out:
- What format should LinkedIn use?
- How long should a tweet be?
- What does "email newsletter" mean to you?
- Should it create files or just respond in the chat?

With a skill, all of those decisions are already made. The skill says: "LinkedIn posts should be 150-200 words with a hook in the first line. Tweets should be threaded with a max of 280 characters each. The output goes in an HTML file with tabs and copy buttons."

**The skill is the difference between "use your best judgment" and "here's exactly what I need."**

## This applies to everything

The Content Repurposer is just one example. Every task that has a repeatable structure benefits from a skill:

- **Meeting notes** become structured action items with assigned owners
- **Raw data** becomes an interactive dashboard with charts and filtering
- **Email triage** becomes a prioritised list with suggested responses
- **Client feedback** becomes categorised, scored, and summarised

In the next module, you'll see several of these in action. Each one follows the same pattern: install the skill, give it a file, get a dramatically better result.

## The bigger picture

Here's why this matters beyond just "better output." Skills make AI **reliable**. Without them, you get different results every time, and you spend time fixing the output to match what you actually wanted.

With skills, the output is consistent. You can trust it. You can hand it to a colleague and say "run this, it works." That's the difference between a toy and a tool.

## Try it

Do the comparison yourself. Same content, with and without the skill. Notice the differences. Then ask yourself: what other tasks in your work would benefit from this level of structure?

Write down two or three. We'll get to real examples in the next module.
`,
      },
    ],
  },
  {
    id: 5,
    title: "Real Examples",
    outcome: "You've seen skills handle real business tasks: email triage, content repurposing, data analysis, and meeting notes. You know how to run each one and what to expect.",
    lessons: [
      {
        id: "5-1",
        title: "Email Triage",
        content: `# Email Triage

Let's start with something everyone deals with: a messy inbox. This example shows how a skill turns a pile of emails into a clear, prioritised action list.

## The scenario

You have 20 emails. Some are urgent. Some are FYI. Some need a reply. Some can wait. Sorting through them manually takes time and mental energy. With a skill, it takes about 30 seconds.

## How it works

1. **Export your emails** as a file (JSON, text, or even just paste them into a document)
2. **Give the file to Cowork** with an email triage skill installed
3. **Get back a priority dashboard**: urgent items at the top, FYI items at the bottom, with suggested next actions for each

> [SCREENSHOT: Email triage skill output showing a priority dashboard]

## What the skill produces

A good email triage skill creates an interactive HTML dashboard with:

- **Priority levels**: Urgent, Needs Reply, FYI, Can Wait
- **One-line summaries** for each email so you can scan quickly
- **Suggested actions**: "Reply with X," "Forward to Y," "No action needed"
- **Filtering**: Click a priority level to see only those emails

Compare that to reading through 20 emails one by one. The skill doesn't just sort them. It thinks about what matters and surfaces the things you actually need to act on.

## Try it in the game

The [interactive game](/play) has an email triage demo in Level 1. You can see exactly what the output looks like and try it with sample data.

## Try it yourself

If you want to test this with real emails:

1. Pick 5-10 recent emails from your inbox
2. Copy them into a text file (subject line and first paragraph is enough)
3. Point Cowork at the file
4. Ask: "Triage these emails by priority. Flag anything that needs a reply today."

Even without a dedicated email skill, Cowork will do a decent job. With one, the output is structured, consistent, and immediately useful.
`,
      },
      {
        id: "5-2",
        title: "Content Repurposing",
        content: `# Content Repurposing

You've already seen this skill in action when you installed it in Module 4. Now let's look at how to get the most out of it, and why it's one of the most popular skills people use.

## The problem it solves

You write something once: a blog post, an article, a case study, a newsletter. Then you need versions for LinkedIn, Twitter/X, email, maybe a short video script. Doing that manually means rewriting the same content 4-5 times, each in a different format and tone.

The Content Repurposer skill does all of that from a single input.

## Getting better results

The skill works well out of the box, but a few things make the output even better:

**Give it longer content.** A 200-word blurb doesn't give the skill much to work with. A 1000-word blog post gives it enough material to create genuinely different versions for each platform.

**Be specific about your audience.** Add a line like: "My audience is small business owners who are not technical" or "This is for a B2B SaaS audience." The skill adapts the tone for each platform while keeping your audience in mind.

**Tell it what to emphasise.** "Focus on the practical tips, not the theory" or "The key message is that automation saves time" gives the skill a clear angle for each version.

## What the output looks like

The skill creates an HTML file with tabs:

- **LinkedIn**: Professional tone, hook in the first line, 150-200 words
- **Twitter/X**: Thread format, short punchy sentences, hashtags
- **Email Newsletter**: Personal tone, clear CTA, easy to scan
- **Short Video Script**: Spoken-word version, 60-90 seconds
- **Summary**: One-paragraph version for repurposing anywhere

Each tab has a copy button. Click, paste, done.

## Try it in the game

The [Content Repurposer demo](/play) in Level 2 walks you through the full process with sample content.

## Try it yourself

Take something you've written recently (or something you wish you had time to repurpose) and run the Content Repurposer skill on it. Compare the output to what you'd normally produce manually. Pay attention to the time difference.

Most people find the skill produces a solid first draft for every platform in under a minute. Even if you tweak the results, that's a huge time saving.
`,
      },
      {
        id: "5-3",
        title: "Data Analysis",
        content: `# Data Analysis

This is the example that gets the biggest reaction. You give Cowork a spreadsheet, and it creates an interactive dashboard with charts, filtering, and insights. No formulas, no pivot tables, no spreadsheet skills required.

## The scenario

You have a CSV or spreadsheet with data. Sales numbers, campaign metrics, survey responses, expense tracking, anything with rows and columns. You need to understand what's in it.

Normally you'd open it in Excel or Google Sheets, squint at the numbers, maybe try to build a chart. With a data analysis skill, you skip straight to the insights.

## How it works

1. **Drag your CSV/spreadsheet into Cowork** (or point it at the file in your project folder)
2. **Ask for analysis**: "Analyse this data and create a dashboard"
3. **Get back an interactive HTML report** with charts, summaries, and key findings

> [SCREENSHOT: A data analysis dashboard created by Cowork from a CSV file]

## What makes the skilled version better

Without a skill, Cowork will look at your data and give you a text summary. Decent, but hard to share and not very visual.

With a data analysis skill, you get:

- **Charts** that automatically pick the right visualisation (bar, line, pie) based on your data
- **Key metrics** pulled out and highlighted at the top
- **Filtering and sorting** so you can explore the data yourself
- **Anomaly detection**: "This number looks unusual compared to the trend"
- **Export options**: Download filtered views, save charts

The skill's scripts handle the calculations. That means the numbers are reliable. The AI doesn't "estimate" your totals. The code adds them up properly.

## What kind of data works?

Almost anything in rows and columns:

- Sales data (revenue, units, by product/region)
- Marketing data (clicks, conversions, cost per lead)
- Survey responses
- Financial data (expenses, income, budgets)
- Any CSV export from any tool

## Try it in the game

The [Campaign Dashboard demo](/play) in Level 1 shows a data analysis in action. The Level 2 demos include more advanced analysis with the CSV Analyzer skill.

## Try it yourself

Find any spreadsheet or CSV you have. Export data from whatever tool you use: Google Ads, Shopify, your accounting software, a CRM. Drag it into Cowork and say:

"Analyse this data. Create an interactive dashboard showing the key metrics, trends, and anything that looks unusual."

Open the HTML file it creates. Click around. Filter. Sort. That took 30 seconds.
`,
      },
      {
        id: "5-4",
        title: "Meeting Notes to Action Items",
        content: `# Meeting Notes to Action Items

Meetings produce notes. Notes produce... nothing, usually. They sit in a document until the next meeting when someone asks "wait, who was supposed to do that?"

A meeting intelligence skill fixes this. It takes messy notes and turns them into structured, actionable output.

## The scenario

You've just finished a meeting. You have notes: maybe typed, maybe from a recording transcript, maybe a mix of both. The notes are useful but messy. Decisions are buried in discussion. Action items aren't clearly separated from general conversation. Nobody knows who agreed to do what by when.

## How the skill works

1. **Give Cowork your meeting notes** (paste, drag a file, or point at it)
2. **Run the Meeting Intelligence skill**
3. **Get back a structured dashboard** with everything extracted and organised

## What you get

The Meeting Intelligence skill produces:

- **Decisions made**: Clear list of what was decided, not what was discussed
- **Action items**: Who does what, by when, with checkboxes
- **Key discussion points**: Summarised, not verbatim
- **Follow-up email draft**: Ready to send to attendees
- **Open questions**: Things that were raised but not resolved
- **CSV export**: For tracking action items in a project tool

> [SCREENSHOT: Meeting Intelligence dashboard showing categorised outputs]

## Why this matters

The difference between "here are your notes" and "here's what you need to do" is the difference between information and action. The skill doesn't just reorganise your notes. It interprets them and produces the thing you actually need: a clear list of next steps.

And the follow-up email is a real time saver. Instead of drafting "Hi team, here's a summary of what we discussed..." for 20 minutes, the skill writes it for you. You review, tweak if needed, and send.

## Try it in the game

The [Meeting Intelligence demo](/play) in Level 2 shows the full workflow with sample meeting notes.

## Try it yourself

After your next meeting, try this:

1. Get your notes into a file (even rough notes work fine)
2. Give the file to Cowork
3. Say: "Extract the action items, decisions, and open questions from these meeting notes. Draft a follow-up email for the attendees."

If you have the Meeting Intelligence skill installed, the output will be a full dashboard. Without the skill, you'll still get useful extraction, but the structured dashboard and export features come from the skill.

Either way, compare the time to what it would normally take you to write that follow-up email manually. That's the value you're getting from this one skill alone.
`,
      },
    ],
  },
  {
    id: 6,
    title: "Making It Yours",
    outcome: "You know how to customise skills for your business, connect Cowork to your real tools, and you have a clear path forward to keep building.",
    lessons: [
      {
        id: "6-1",
        title: "Customising Skills",
        content: `# Customising Skills

The skills you've installed work out of the box. But the real value comes when you make them work for YOUR business. Customising a skill is simpler than you'd think.

## What you can customise

Every skill has a main instruction file called **SKILL.md**. This is just a text file that tells Cowork what to do. You can open it and read it. You can edit it.

Common things to customise:

- **Output format**: Change the sections, headings, or structure
- **Tone and voice**: Add your brand voice guidelines
- **Priorities**: Tell the skill what matters most to you
- **Terminology**: Use your industry terms instead of generic ones
- **Output type**: HTML dashboard, markdown document, CSV export, whatever you prefer

## How to customise

1. **Find the skill's folder.** In Cowork's Customize > Skills panel, you can locate where each skill is stored.

> [SCREENSHOT: Locating a skill's folder in the Customize panel]

2. **Open SKILL.md.** This is the instruction file. Read through it. You'll see it's written in plain English.

3. **Make a change.** For example, if you want the Content Repurposer to always write in an Australian, casual tone, add a line: "Always use Australian English. Keep the tone casual and direct. Avoid corporate jargon."

4. **Save and test.** Run the skill again. See if the change shows up in the output. If not, adjust your wording.

## Example: customising the email triage skill

Say you want the email triage skill to always flag emails from your top 3 clients as high priority, regardless of content. Open the SKILL.md and add:

\`\`\`
Always classify emails from these senders as High Priority:
- sarah@bigclient.com
- james@importantco.com
- priya@keyaccount.com
\`\`\`

Now every time you run the triage, those clients get flagged. You've encoded your business knowledge into the skill.

## Adding context about your business

One of the most powerful customisations is giving Cowork context about your business. You can add a section to any skill's instructions:

\`\`\`
About my business:
- I run a digital marketing agency with 5 staff
- Our main clients are in real estate and hospitality
- We use Monday.com for project management
- Reports should always include ROI calculations
\`\`\`

This context shapes every output. Meeting notes will flag marketing-specific follow-ups. Data analysis will highlight the metrics you care about. Content repurposing will match your industry's tone.

## Don't be afraid to experiment

You can't break a skill by editing SKILL.md. If something goes wrong, you can always reinstall the original version. The worst that happens is the output changes in a way you don't like, and you edit again.

Think of it like adjusting settings in any app. You're not rewriting the code. You're telling the skill what you prefer.

## Try it

Open the SKILL.md file for any skill you've installed. Read through it. Then make one small change:

- Add a line about your preferred tone
- Add context about your business
- Change the output format for one section

Run the skill again and see the difference. That's customisation.
`,
      },
      {
        id: "6-2",
        title: "Connectors and Plugins",
        content: `# Connectors and Plugins

Until now, everything you've done with Cowork has been with files on your computer. You drag files in, Cowork creates files out. That's powerful, but it's not the whole picture.

Connectors and plugins let Cowork interact with your real tools: email, calendar, project management, and more. This is where "AI assistant" starts becoming "AI infrastructure."

## What's a connector?

A connector links Cowork to an external service. Once connected, Cowork can read from (and sometimes write to) that service.

Examples:
- **Gmail connector**: Cowork can read your emails, search your inbox, draft responses
- **Google Calendar connector**: Cowork can see your schedule, find free time, summarise your week
- **Slack connector**: Cowork can read channels, summarise threads

## How to install a connector

1. Go to **Customize > Connectors** in Cowork
2. Browse the available connectors
3. Click the one you want
4. Follow the authentication steps (usually sign in to the service and grant access)

> [SCREENSHOT: The Connectors panel showing available connectors]

> [SCREENSHOT: Authenticating a Gmail connector]

## What's a plugin?

Plugins are similar to connectors but they add capabilities rather than connecting to services. A plugin gives Cowork new abilities it didn't have before.

Example: The **Design plugin** from Anthropic adds visual analysis and design critique capabilities. With it installed, Cowork can look at a website screenshot and give you detailed design feedback with scores and specific improvement suggestions.

You install plugins from **Customize > Browse Plugins**.

> [SCREENSHOT: The plugin marketplace in Cowork]

## Start with reading, not writing

Here's a sensible approach when you're getting started: **connect your tools for reading first, not writing.**

Let Cowork read your emails and calendar. Let it summarise what's there. Get comfortable with how it interprets your data.

Only after you trust the output should you let it draft emails, create calendar events, or post messages. Start passive, then go active.

## What you can do with connectors

Once Gmail and Calendar are connected, try:

- "Summarise the 20 most recent emails in my inbox. Flag anything urgent."
- "Look at my calendar for this week. Where do I have back-to-back meetings? Where are the gaps?"
- "Create a combined summary: what's in my inbox that relates to meetings happening this week?"

That last one is the kind of cross-service insight that you can't easily get from any single tool. Cowork connects the dots because it can see across your tools.

## Try it

Install one connector. Gmail is the most useful starting point. Follow the setup steps, then ask Cowork:

"Summarise my inbox. What needs attention today?"

See how it handles real, live data. That's the bridge from "files on my computer" to "AI working with my real business."
`,
      },
      {
        id: "6-3",
        title: "Where to Go Next",
        content: `# Where to Go Next

You started this course having only used AI in a browser. Let's look at where you are now.

## What you've learned

- **Module 1**: What Cowork is and how it differs from ChatGPT
- **Module 2**: How to have a conversation and give it files
- **Module 3**: Working with folders, organising, and understanding access boundaries
- **Module 4**: What skills are, how to install them, and why they matter
- **Module 5**: Real examples of skills in action (email, content, data, meetings)
- **Module 6**: Customising skills and connecting Cowork to your real tools

That's a complete foundation. You can install Cowork, point it at your files, add skills, and connect it to your tools. Most people who use AI haven't gotten this far.

## What's possible from here

There are a few directions you can take this:

### Build your own skills

You've been using pre-built skills. But you can also create your own. If you have a task you do repeatedly and the output always follows a similar structure, that's a skill waiting to be written.

You don't need to write code. A SKILL.md file written in plain English is enough to start. Describe the task, describe the output, add examples of what "good" looks like. Cowork does the rest.

### Go deeper with connectors

Gmail and Calendar are just the start. There are connectors for Slack, project management tools, CRMs, and more. Each one gives Cowork access to another piece of your work, making it more useful across your entire day.

### Combine skills and connectors

The real power comes from combining things. A morning routine that:
1. Reads your inbox (Gmail connector)
2. Checks your calendar (Calendar connector)
3. Triages emails by priority (email triage skill)
4. Summarises your day ahead

That's not science fiction. That's what people are building right now.

## The Ads to AI community

Everything in this course is a starting point. The [Ads to AI community](https://ads2ai.com) is where you go deeper:

- **Ready-made skills**: Dozens of pre-built skills for different industries and tasks
- **The brain system**: A complete AI infrastructure that manages email, content, projects, contacts, and more
- **Courses**: From beginner to advanced, including building your own skills
- **Monthly Q&A calls**: Get your questions answered live
- **A community of people doing this work**: Share what you're building, learn from others

You don't have to figure this out alone. The community exists specifically for people at your stage: you understand the basics, you can see the potential, and you want to go further.

## One last thing

You know more than most people now. Seriously. Most people are still copy-pasting into ChatGPT. You've got Cowork installed, skills running, connectors live. That puts you ahead.

The question isn't whether AI will change how you work. It already has, in the time it took you to go through this course.

The question is how far you want to take it.

[Join the Ads to AI community](https://ads2ai.com) and find out.
`,
      },
    ],
  },
]
