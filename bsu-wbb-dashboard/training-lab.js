const revealLabItems = document.querySelectorAll(".reveal-lab");
const analyzeButton = document.querySelector("#analyze-button");
const resetButton = document.querySelector("#reset-button");

const defaultValues = {
  teamFgm: 31,
  teamFga: 68,
  teamFgPct: 45.6,
  team3pm: 6,
  team3pa: 21,
  team3pPct: 28.6,
  teamFtm: 13,
  teamFta: 18,
  teamFtPct: 72.2,
  teamOreb: 14,
  teamDreb: 24,
  teamReb: 38,
  teamAst: 17,
  teamTov: 16,
  teamAstTov: 1.06,
  teamStl: 10,
  teamBlk: 4,
  teamPf: 18,
  teamFastbreak: 14,
  teamSecondChance: 12,
  teamPaint: 34,
  teamNote: "本周对抗中内线终结和篮板优势还在，但外线投射效率偏低，失误偏多，比赛末段连续执行质量下降。",
  playerName: "孙恬馨",
  playerPts: 18.5,
  playerReb: 11.2,
  playerOrb: 4.1,
  playerDrb: 7.1,
  playerAst: 2.4,
  playerTov: 3.1,
  playerStl: 1.8,
  playerBlk: 1.2,
  playerFgPct: 51.3,
  player3pPct: 25.0,
  playerFtPct: 74.2,
  playerMin: 31.5,
  playerPf: 2.9,
  playerNote: "当前仍是最稳定的内线终结点和篮板点，但在高压夹击后出球和外线牵制价值还可以继续提升。",
};

function getNumber(id) {
  return Number(document.querySelector(id)?.value || 0);
}

function setValue(id, value) {
  const node = document.querySelector(id);
  if (node) node.value = String(value);
}

function formatOneDecimal(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function formatTwoDecimals(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function ratioToScore(value, target, max = 100) {
  if (target <= 0) return 0;
  return clamp((value / target) * max);
}

function invertRatioToScore(value, limit) {
  if (limit <= 0) return 0;
  return clamp((1 - value / limit) * 100);
}

function buildCoolShape(values) {
  const points = [
    [50, 50 - values[0] * 0.42],
    [50 + values[1] * 0.37, 50 - values[1] * 0.2],
    [50 + values[2] * 0.34, 50 + values[2] * 0.24],
    [50, 50 + values[3] * 0.4],
    [50 - values[4] * 0.34, 50 + values[4] * 0.24],
    [50 - values[5] * 0.37, 50 - values[5] * 0.2],
  ];

  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

function topAndWeakest(entries) {
  const sorted = [...entries].sort((a, b) => b.value - a.value);
  return {
    top: sorted.slice(0, 2),
    weak: sorted.slice(-2).reverse(),
  };
}

function renderTags(targetId, labels) {
  const target = document.querySelector(targetId);
  if (!target) return;
  target.innerHTML = labels.map((label) => `<span>${label}</span>`).join("");
}

function readTeamData() {
  const fgm = getNumber("#team-fgm");
  const fga = getNumber("#team-fga");
  const fgPct = getNumber("#team-fg-pct") || (fga ? (fgm / fga) * 100 : 0);
  const threePm = getNumber("#team-3pm");
  const threePa = getNumber("#team-3pa");
  const threePct = getNumber("#team-3p-pct") || (threePa ? (threePm / threePa) * 100 : 0);
  const ftm = getNumber("#team-ftm");
  const fta = getNumber("#team-fta");
  const ftPct = getNumber("#team-ft-pct") || (fta ? (ftm / fta) * 100 : 0);
  const oreb = getNumber("#team-oreb");
  const dreb = getNumber("#team-dreb");
  const reb = getNumber("#team-reb") || oreb + dreb;
  const ast = getNumber("#team-ast");
  const tov = getNumber("#team-tov");
  const astTov = getNumber("#team-ast-tov") || (tov ? ast / tov : ast);
  const stl = getNumber("#team-stl");
  const blk = getNumber("#team-blk");
  const pf = getNumber("#team-pf");
  const fastbreak = getNumber("#team-fastbreak");
  const secondChance = getNumber("#team-second-chance");
  const paint = getNumber("#team-paint");
  const points = fgm * 2 + threePm + ftm;
  const note = document.querySelector("#team-note")?.value.trim() || "";

  return {
    fgm,
    fga,
    fgPct,
    threePm,
    threePa,
    threePct,
    ftm,
    fta,
    ftPct,
    oreb,
    dreb,
    reb,
    ast,
    tov,
    astTov,
    stl,
    blk,
    pf,
    fastbreak,
    secondChance,
    paint,
    points,
    note,
  };
}

function readPlayerData() {
  const name = document.querySelector("#player-name")?.value.trim() || "球员";
  const pts = getNumber("#player-pts");
  const reb = getNumber("#player-reb");
  const orb = getNumber("#player-orb");
  const drb = getNumber("#player-drb");
  const ast = getNumber("#player-ast");
  const tov = getNumber("#player-tov");
  const stl = getNumber("#player-stl");
  const blk = getNumber("#player-blk");
  const fgPct = getNumber("#player-fg-pct");
  const threePct = getNumber("#player-3p-pct");
  const ftPct = getNumber("#player-ft-pct");
  const min = getNumber("#player-min");
  const pf = getNumber("#player-pf");
  const note = document.querySelector("#player-note")?.value.trim() || "";

  return {
    name,
    pts,
    reb,
    orb,
    drb,
    ast,
    tov,
    stl,
    blk,
    fgPct,
    threePct,
    ftPct,
    min,
    pf,
    note,
  };
}

function deriveTeamDimensions(team) {
  const pointsPerShot = team.fga ? team.points / team.fga : 0;
  const threeRate = team.fga ? team.threePa / team.fga : 0;
  const paintRate = team.points ? team.paint / team.points : 0;
  const secondChanceRate = team.points ? team.secondChance / team.points : 0;
  const fastbreakRate = team.points ? team.fastbreak / team.points : 0;
  const reboundEdge = ratioToScore(team.reb, 42);
  const assistSecurity = clamp(team.astTov * 46);
  const defenseActivity = clamp(team.stl * 6 + team.blk * 7 - Math.max(team.pf - 16, 0) * 2);
  const perimeterQuality = clamp(team.threePct * 1.75 - Math.max(threeRate - 0.32, 0) * 48);
  const offensiveEfficiency = clamp(pointsPerShot * 56 + team.ftPct * 0.42);
  const stability = clamp(team.ftPct * 0.35 + team.astTov * 22 + invertRatioToScore(team.tov, 24) * 0.35);

  return {
    offensiveEfficiency,
    defenseActivity,
    stability,
    assistSecurity,
    reboundEdge,
    perimeterQuality,
    paintRate,
    secondChanceRate,
    fastbreakRate,
    threeRate,
  };
}

function derivePlayerDimensions(player) {
  const assistSecurity = player.tov ? player.ast / player.tov : player.ast;
  const finishEfficiency = clamp(player.fgPct * 1.2 + player.ftPct * 0.2);
  const defensiveImpact = clamp(player.stl * 18 + player.blk * 20 - Math.max(player.pf - 3.5, 0) * 10);
  const stability = clamp(player.ftPct * 0.28 + player.fgPct * 0.42 + invertRatioToScore(player.tov, 5) * 0.3);
  const playmaking = clamp(assistSecurity * 42 + player.ast * 8);
  const reboundImpact = clamp(player.reb * 7 + player.orb * 5);
  const perimeterThreat = clamp(player.threePct * 1.9);

  return {
    finishEfficiency,
    defensiveImpact,
    stability,
    playmaking,
    reboundImpact,
    perimeterThreat,
    assistSecurity,
  };
}

function updateTeamDerivedFields() {
  const fgm = getNumber("#team-fgm");
  const fga = getNumber("#team-fga");
  const threePm = getNumber("#team-3pm");
  const threePa = getNumber("#team-3pa");
  const ftm = getNumber("#team-ftm");
  const fta = getNumber("#team-fta");
  const oreb = getNumber("#team-oreb");
  const dreb = getNumber("#team-dreb");
  const ast = getNumber("#team-ast");
  const tov = getNumber("#team-tov");

  setValue("#team-fg-pct", formatOneDecimal(fga ? (fgm / fga) * 100 : 0));
  setValue("#team-3p-pct", formatOneDecimal(threePa ? (threePm / threePa) * 100 : 0));
  setValue("#team-ft-pct", formatOneDecimal(fta ? (ftm / fta) * 100 : 0));
  setValue("#team-reb", oreb + dreb);
  setValue("#team-ast-tov", formatTwoDecimals(tov ? ast / tov : ast));
}

function buildTeamLabels(team, dims) {
  const labels = [];

  if (dims.paintRate >= 0.42) labels.push("内线驱动明显");
  if (dims.secondChanceRate >= 0.14) labels.push("二次进攻存在感强");
  if (dims.fastbreakRate >= 0.16) labels.push("转换推进积极");
  if (dims.perimeterQuality <= 45 && dims.threeRate >= 0.28) labels.push("外线依赖偏高但效率不足");
  if (dims.assistSecurity < 55) labels.push("组织稳定性不足");
  if (dims.defenseActivity >= 68) labels.push("防守活跃度较高");
  if (dims.stability <= 55) labels.push("末段执行波动较大");

  return labels.slice(0, 5);
}

function buildPlayerLabels(player, dims) {
  const labels = [];

  if (dims.finishEfficiency >= 72) labels.push(`${player.name}终结效率突出`);
  if (dims.reboundImpact >= 74) labels.push(`${player.name}篮板影响力强`);
  if (dims.perimeterThreat <= 46) labels.push(`${player.name}外线牵制有限`);
  if (dims.playmaking <= 50) labels.push(`${player.name}高压下处理球需加强`);
  if (dims.defensiveImpact >= 66) labels.push(`${player.name}防守干扰较明显`);
  if (dims.stability >= 68) labels.push(`${player.name}训练输出稳定`);

  return labels.slice(0, 5);
}

function buildTeamAnalysis(team, dims, ranked) {
  const styleParts = [];

  if (dims.paintRate >= 0.42) styleParts.push("内线终结和禁区得分仍是主要支撑");
  if (dims.secondChanceRate >= 0.14) styleParts.push("前场篮板后的二次进攻转化较明显");
  if (dims.fastbreakRate >= 0.16) styleParts.push("转换推进能提供额外得分");
  if (dims.perimeterQuality <= 45) styleParts.push("外线投射质量偏低");
  if (dims.assistSecurity < 55) styleParts.push("助失比说明组织端仍不够稳");

  return `当前球队最突出的维度是${ranked.top[0].key}和${ranked.top[1].key}，最需要优先补强的是${ranked.weak[0].key}与${ranked.weak[1].key}。${styleParts.join("，")}。${team.note}`;
}

function buildPlayerAnalysis(player, dims, ranked) {
  const styleParts = [];

  if (dims.finishEfficiency >= 72) styleParts.push("她在篮下和近筐终结仍然最有保障");
  if (dims.reboundImpact >= 74) styleParts.push("篮板保护和二次进攻价值突出");
  if (dims.perimeterThreat <= 46) styleParts.push("外线牵制还不足以持续拉开空间");
  if (dims.playmaking <= 50) styleParts.push("被夹击后的出球与再组织仍需专项训练");

  return `${player.name}当前最突出的特点是${ranked.top[0].key}和${ranked.top[1].key}，相对薄弱项是${ranked.weak[0].key}与${ranked.weak[1].key}。${styleParts.join("，")}。${player.note}`;
}

function buildPlan(team, player, teamRank, playerRank, teamDims, playerDims) {
  const plan = [];

  if (teamDims.perimeterQuality <= 50) {
    plan.push("优先安排外线专项：接球投、弱侧回应投和高疲劳后的定点三分，提高外围命中质量。");
  } else {
    plan.push("保留当前外围手感优势，把外线训练更多放到战术回应和选择质量上。");
  }

  if (teamDims.assistSecurity < 55) {
    plan.push("针对组织协同偏弱，增加强压下推进、二传衔接和失误后立即再组织训练。");
  } else {
    plan.push("继续维持传导质量，把配合训练升级到更高对抗和更快节奏下执行。");
  }

  if (teamDims.reboundEdge >= 68) {
    plan.push("保留篮板和二次进攻优势，继续强化前场篮板冲抢后的二次终结和外弹再组织。");
  } else {
    plan.push("补篮板对抗和卡位习惯，避免训练端的回合控制能力下降。");
  }

  if (playerDims.playmaking <= 50) {
    plan.push(`围绕${player.name}增加夹击后出球、肘区策应和短顺下再分配训练，降低处理球波动。`);
  } else {
    plan.push(`保持${player.name}当前处理球质量，在保留强项的基础上提升她的决策速度。`);
  }

  if (playerDims.perimeterThreat <= 46) {
    plan.push(`给${player.name}补足中远距离威胁，避免她只能在禁区附近形成价值。`);
  }

  return plan.slice(0, 4);
}

function analyze() {
  updateTeamDerivedFields();

  const team = readTeamData();
  const player = readPlayerData();
  const teamDims = deriveTeamDimensions(team);
  const playerDims = derivePlayerDimensions(player);

  const teamEntries = [
    { key: "进攻效率", value: teamDims.offensiveEfficiency },
    { key: "防守活跃", value: teamDims.defenseActivity },
    { key: "稳定执行", value: teamDims.stability },
    { key: "组织协同", value: teamDims.assistSecurity },
    { key: "篮板存在", value: teamDims.reboundEdge },
    { key: "外线质量", value: teamDims.perimeterQuality },
  ];

  const playerEntries = [
    { key: "终结效率", value: playerDims.finishEfficiency },
    { key: "防守影响", value: playerDims.defensiveImpact },
    { key: "稳定度", value: playerDims.stability },
    { key: "组织处理", value: playerDims.playmaking },
    { key: "篮板影响", value: playerDims.reboundImpact },
    { key: "外线威胁", value: playerDims.perimeterThreat },
  ];

  const teamRank = topAndWeakest(teamEntries);
  const playerRank = topAndWeakest(playerEntries);

  const teamShape = document.querySelector("#team-radar-shape");
  const playerShape = document.querySelector("#player-radar-shape");

  if (teamShape) {
    teamShape.style.clipPath = buildCoolShape([
      teamDims.offensiveEfficiency / 100,
      teamDims.defenseActivity / 100,
      teamDims.stability / 100,
      teamDims.assistSecurity / 100,
      teamDims.reboundEdge / 100,
      teamDims.perimeterQuality / 100,
    ]);
  }

  if (playerShape) {
    playerShape.style.clipPath = buildCoolShape([
      playerDims.finishEfficiency / 100,
      playerDims.defensiveImpact / 100,
      playerDims.stability / 100,
      playerDims.playmaking / 100,
      playerDims.reboundImpact / 100,
      playerDims.perimeterThreat / 100,
    ]);
  }

  const teamAnalysis = buildTeamAnalysis(team, teamDims, teamRank);
  const playerAnalysis = buildPlayerAnalysis(player, playerDims, playerRank);
  const planItems = buildPlan(team, player, teamRank, playerRank, teamDims, playerDims);
  const goalText = `当前更适合采用“保强项、补短板、先解决真实比赛影响最大的问题”的目标结构：球队优先围绕${teamRank.weak[0].key}和${teamRank.weak[1].key}做周训练修正，球员层面优先把${playerRank.weak[0].key}提升到稳定可用。`;
  const metricText = `球队强项：${teamRank.top[0].key}、${teamRank.top[1].key}。球队短板：${teamRank.weak[0].key}、${teamRank.weak[1].key}。球员强项：${playerRank.top[0].key}、${playerRank.top[1].key}。球员短板：${playerRank.weak[0].key}、${playerRank.weak[1].key}。`;

  const teamAnalysisNode = document.querySelector("#team-analysis");
  const playerAnalysisNode = document.querySelector("#player-analysis");
  const goalNode = document.querySelector("#goal-output");
  const metricNode = document.querySelector("#metric-summary");
  const planListNode = document.querySelector("#plan-list");

  if (teamAnalysisNode) teamAnalysisNode.textContent = teamAnalysis;
  if (playerAnalysisNode) playerAnalysisNode.textContent = playerAnalysis;
  if (goalNode) goalNode.textContent = goalText;
  if (metricNode) metricNode.textContent = metricText;
  if (planListNode) {
    planListNode.innerHTML = planItems.map((item) => `<li>${item}</li>`).join("");
  }

  renderTags("#team-tags", buildTeamLabels(team, teamDims));
  renderTags("#player-tags", buildPlayerLabels(player, playerDims));
}

function resetDefaults() {
  setValue("#team-fgm", defaultValues.teamFgm);
  setValue("#team-fga", defaultValues.teamFga);
  setValue("#team-fg-pct", defaultValues.teamFgPct);
  setValue("#team-3pm", defaultValues.team3pm);
  setValue("#team-3pa", defaultValues.team3pa);
  setValue("#team-3p-pct", defaultValues.team3pPct);
  setValue("#team-ftm", defaultValues.teamFtm);
  setValue("#team-fta", defaultValues.teamFta);
  setValue("#team-ft-pct", defaultValues.teamFtPct);
  setValue("#team-oreb", defaultValues.teamOreb);
  setValue("#team-dreb", defaultValues.teamDreb);
  setValue("#team-reb", defaultValues.teamReb);
  setValue("#team-ast", defaultValues.teamAst);
  setValue("#team-tov", defaultValues.teamTov);
  setValue("#team-ast-tov", defaultValues.teamAstTov);
  setValue("#team-stl", defaultValues.teamStl);
  setValue("#team-blk", defaultValues.teamBlk);
  setValue("#team-pf", defaultValues.teamPf);
  setValue("#team-fastbreak", defaultValues.teamFastbreak);
  setValue("#team-second-chance", defaultValues.teamSecondChance);
  setValue("#team-paint", defaultValues.teamPaint);
  setValue("#team-note", defaultValues.teamNote);

  setValue("#player-name", defaultValues.playerName);
  setValue("#player-pts", defaultValues.playerPts);
  setValue("#player-reb", defaultValues.playerReb);
  setValue("#player-orb", defaultValues.playerOrb);
  setValue("#player-drb", defaultValues.playerDrb);
  setValue("#player-ast", defaultValues.playerAst);
  setValue("#player-tov", defaultValues.playerTov);
  setValue("#player-stl", defaultValues.playerStl);
  setValue("#player-blk", defaultValues.playerBlk);
  setValue("#player-fg-pct", defaultValues.playerFgPct);
  setValue("#player-3p-pct", defaultValues.player3pPct);
  setValue("#player-ft-pct", defaultValues.playerFtPct);
  setValue("#player-min", defaultValues.playerMin);
  setValue("#player-pf", defaultValues.playerPf);
  setValue("#player-note", defaultValues.playerNote);

  analyze();
}

if (analyzeButton) {
  analyzeButton.addEventListener("click", analyze);
}

if (resetButton) {
  resetButton.addEventListener("click", resetDefaults);
}

document.querySelectorAll("#team-fgm, #team-fga, #team-3pm, #team-3pa, #team-ftm, #team-fta, #team-oreb, #team-dreb, #team-ast, #team-tov").forEach((input) => {
  input.addEventListener("input", updateTeamDerivedFields);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealLabItems.forEach((item) => observer.observe(item));

updateTeamDerivedFields();
analyze();
