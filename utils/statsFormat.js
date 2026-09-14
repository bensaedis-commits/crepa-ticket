function formatTime(ms) {

    if (!ms || ms <= 0)
        return "0s";

    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds || parts.length === 0)
        parts.push(`${seconds}s`);

    return parts.join(" ");

}

function getRank(closed) {

    if (closed >= 300) return "👑 Elite";
    if (closed >= 150) return "💎 Expert";
    if (closed >= 70) return "🛡 Senior";
    if (closed >= 30) return "⭐ Support";
    if (closed >= 10) return "🟢 Helper";

    return "🔰 Rookie";

}

function getProgressBar(percent) {

    const total = 10;

    const filled = Math.round((percent / 100) * total);

    return "█".repeat(filled) + "░".repeat(total - filled);

}

function getAverageRating(stats) {

    return stats.reviews > 0
        ? stats.rating / stats.reviews
        : 0;

}

function getAverageResponse(stats) {

    return stats.claimed > 0
        ? stats.totalResponseTime / stats.claimed
        : Number.MAX_SAFE_INTEGER;

}

function getStars(avg) {

    const full = Math.round(avg);

    return "★".repeat(full) + "☆".repeat(5 - full);

}

module.exports = {
    formatTime,
    getRank,
    getProgressBar,
    getAverageRating,
    getAverageResponse,
    getStars
};