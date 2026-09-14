const os = require("os");
const readline = require("readline");

function formatBytes(bytes) {
    if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + " GB";
    }
    if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(2) + " MB";
    }
    if (bytes >= 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }
    return bytes + " B";
}

function startMemoryMonitor(intervalMs = 10000) {
    const stdout = process.stdout;

    const draw = () => {
        const usage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();

        const rss = formatBytes(usage.rss);
        const heapUsed = formatBytes(usage.heapUsed);
        const heapTotal = formatBytes(usage.heapTotal);
        const sysUsed = formatBytes(totalMem - freeMem);
        const sysTotal = formatBytes(totalMem);

        const line = `🧠 Memory | RSS: ${rss} | Heap: ${heapUsed}/${heapTotal} | System: ${sysUsed}/${sysTotal}`;

        if (stdout.isTTY) {
            readline.clearLine(stdout, 0);
            readline.cursorTo(stdout, 0);
            stdout.write(line);
        } else {
            stdout.write(line + "\n");
        }
    };

    draw();
    const timer = setInterval(draw, intervalMs);
    timer.unref();

    return timer;
}

module.exports = { startMemoryMonitor };
