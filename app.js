// 角色狀態數據初始化
const player = {
    name: "玩家",
    hp: 150,
    maxHp: 150,
    baseAtk: 700,
    isOverclocked: false
};

const boss = {
    name: "大魔王川普",
    hp: 10000,
    maxHp: 10000,
    atk: 35,
    isStunned: false
};

// DOM 元素綁定
const logWindow = document.getElementById('log-window');
const playerHpDisplay = document.getElementById('player-hp');
const bossHpDisplay = document.getElementById('boss-hp');
const actionButtons = document.querySelectorAll('button');

// 終端機文字輸出函數
function printLog(message, className = "") {
    const logEntry = document.createElement('div');
    if (className) logEntry.classList.add(className);
    logEntry.innerText = `> ${message}`;
    logWindow.appendChild(logEntry);
    logWindow.scrollTop = logWindow.scrollHeight;
}

// 更新畫面上血量顯示
function updateUI() {
    playerHpDisplay.innerText = Math.max(0, player.hp);
    bossHpDisplay.innerText = Math.max(0, boss.hp);
}

// 鎖定/解鎖控制按鈕
function toggleControls(disabled) {
    actionButtons.forEach(btn => {
        btn.disabled = disabled;
    });
}

// 玩家回合動作執行
async function executeAction(actionType) {
    toggleControls(true);

    if (actionType === 'attack') {
        const damage = player.isOverclocked ? player.baseAtk * 2 : player.baseAtk;
        boss.hp -= damage;
        printLog(`玩家執行了 [強制抹除]，對 川普 造成 ${damage} 點數據傷害。`);
        player.isOverclocked = false; 
    } 
    else if (actionType === 'hack') {
        const damage = 250;
        boss.hp -= damage;
        printLog(`玩家試圖繞過關稅防火牆，對 川普 造成 ${damage} 點傷害。`);
        
        if (Math.random() > 0.5) {
            boss.isStunned = true;
            printLog(`[SUCCESS] 觸發緩衝區溢位！川普 正在發 Twitter 反駁，下回合無法行動。`, "system");
        } else {
            printLog(`[FAILED] 川普 的防禦系統擋下了你的攻擊，並宣稱這是 Fake News。`, "warning");
        }
    }
    else if (actionType === 'overclock') {
        player.isOverclocked = true;
        printLog(`玩家啟動了 [核心超頻]，準備下一擊的高速編譯輸出！傷害加倍。`, "system");
    }
    else if (actionType === 'reboot') {
        const heal = 50;
        player.hp = Math.min(player.maxHp, player.hp + heal);
        printLog(`玩家執行 [系統重啟]，修復了 ${heal} 點 HP。`, "system");
    }

    updateUI();
    if (checkGameOver()) return;

    await new Promise(resolve => setTimeout(resolve, 1200));
    executeBossTurn();
}

// 魔王回合邏輯
function executeBossTurn() {
    if (boss.isStunned) {
        printLog(`川普 的社交帳號遭遇流量限制，本回合無法行動。`, "system");
        boss.isStunned = false; 
    } else {
        // 川普的隨機攻擊招式
        const bossSkills = [
            `川普 釋放了 [Fake News 廣播]，對 玩家 造成 ${boss.atk} 點精神污染傷害！`,
            `川普 執行了 [You're Fired!] 指令，強制剔除了 玩家 ${boss.atk} 點 HP！`,
            `川普 築起了 [巨大數據牆]，對 玩家 造成 ${boss.atk} 點物理撞擊！`,
            `川普 大喊 [MAKE CODE GREAT AGAIN!]，能量激發造成 ${boss.atk} 點傷害！`
        ];
        const randomSkill = bossSkills[Math.floor(Math.random() * bossSkills.length)];
        
        player.hp -= boss.atk;
        printLog(randomSkill, "warning");
    }

    updateUI();
    if (!checkGameOver()) {
        toggleControls(false);
    }
}

// 檢查遊戲結束條件
function checkGameOver() {
    if (boss.hp <= 0) {
        boss.hp = 0;
        printLog(`====================================`, "system");
        printLog(`[VICTORY] 「大魔王川普」已被成功解構。`, "system");
        printLog(`程式地獄的封鎖已解除。連線自由化。`, "system");
        printLog(`====================================`, "system");
        return true;
    }

    if (player.hp <= 0) {
        player.hp = 0;
        printLog(`====================================`, "warning");
        printLog(`[FATAL ERROR] 你的代碼不夠偉大。`, "warning");
        printLog(`你被開除了 (You're Fired)。 GAME OVER.`, "warning");
        printLog(`====================================`, "warning");
        return true;
    }

    return false;
}