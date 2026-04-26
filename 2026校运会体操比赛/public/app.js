const scheduleRows = [
  {
    date: "2026-05-18",
    session: "第 1 场",
    event: "自由体操",
    group: "竞技组",
    athlete: "李晨曦 / 教育学院",
    venue: "综合训练馆 A 厅",
    time: "14:00",
    status: "正常",
    changed: false,
    code: "BT2026-018",
    name: "李晨曦",
  },
  {
    date: "2026-05-18",
    session: "第 2 场",
    event: "平衡木",
    group: "女子兴趣组",
    athlete: "王雨晴 / 新闻传播学院",
    venue: "综合训练馆 B 厅",
    time: "15:20",
    status: "时间调整",
    changed: true,
    code: "BT2026-026",
    name: "王雨晴",
  },
  {
    date: "2026-05-19",
    session: "第 1 场",
    event: "跳马",
    group: "竞技组",
    athlete: "张一鸣 / 运动训练学院",
    venue: "综合训练馆 A 厅",
    time: "09:30",
    status: "正常",
    changed: false,
    code: "BT2026-031",
    name: "张一鸣",
  },
  {
    date: "2026-05-19",
    session: "第 3 场",
    event: "团体展示",
    group: "兴趣组",
    athlete: "教育学院代表队",
    venue: "综合训练馆主场",
    time: "16:10",
    status: "正常",
    changed: false,
    code: "TEAM-EDU",
    name: "教育学院代表队",
  },
];

const scoreRows = [
  {
    rank: 1,
    name: "李晨曦",
    code: "BT2026-018",
    team: "教育学院",
    event: "自由体操",
    eventScore: "13.600",
    totalScore: "27.100",
    detail: {
      movement: "动作难度 A 组 + 连接动作",
      difficulty: "D 分 5.2",
      execution: "E 分 8.4",
      deduction: "扣分 0.0",
      judge: "裁判组评分：完成稳定，连接流畅",
    },
  },
  {
    rank: 2,
    name: "张一鸣",
    code: "BT2026-031",
    team: "运动训练学院",
    event: "跳马",
    eventScore: "13.200",
    totalScore: "26.400",
    detail: {
      movement: "助跑 + 跳马完整动作",
      difficulty: "D 分 5.0",
      execution: "E 分 8.3",
      deduction: "扣分 0.1",
      judge: "裁判组评分：起跳有力，落地略有移动",
    },
  },
  {
    rank: 3,
    name: "王雨晴",
    code: "BT2026-026",
    team: "新闻传播学院",
    event: "平衡木",
    eventScore: "12.950",
    totalScore: "25.880",
    detail: {
      movement: "平衡木规定动作",
      difficulty: "D 分 4.9",
      execution: "E 分 8.2",
      deduction: "扣分 0.15",
      judge: "裁判组评分：动作完整，转体处稍有停顿",
    },
  },
  {
    rank: 1,
    name: "教育学院代表队",
    code: "TEAM-EDU",
    team: "教育学院",
    event: "团体展示",
    eventScore: "38.600",
    totalScore: "38.600",
    detail: {
      movement: "团体成套展示",
      difficulty: "完成度优秀",
      execution: "整齐度高",
      deduction: "无明显失误",
      judge: "裁判组评分：队形完整，表现力突出",
    },
  },
];

const boards = {
  allAround: [
    "李晨曦 27.100",
    "张一鸣 26.400",
    "王雨晴 25.880",
  ],
  event: [
    "自由体操 李晨曦 13.600",
    "跳马 张一鸣 13.200",
    "平衡木 王雨晴 12.950",
  ],
  team: [
    "教育学院代表队 38.600",
    "运动训练学院代表队 37.950",
    "新闻传播学院代表队 36.820",
  ],
};

const photoSlides = [
  {
    tag: "自由体操",
    title: "落地瞬间",
    description: "校运会自由体操比赛现场、动作定格与观众席氛围展示位。",
    className: "photo-stage-a",
  },
  {
    tag: "平衡木",
    title: "平衡控制",
    description: "适合展示平衡木专项动作、控制细节和现场聚焦画面。",
    className: "photo-stage-b",
  },
  {
    tag: "团体展示",
    title: "队形展开",
    description: "适合展示学院代表队编排、队形变化和集体展示氛围。",
    className: "photo-stage-c",
  },
];

const photoLibrary = {
  men: {
    label: "男生项目",
    items: [
      {
        key: "floor",
        name: "男子自由体操",
        subtitle: "地面动作与落地镜头",
        cover: "photo-a",
        note: "归档男子自由体操比赛、热身、完整动作和落地定格照片。",
        files: [
          "男子自由体操_资格赛_李晨曦_落地定格_001.jpg",
          "男子自由体操_热身区_动作准备_002.jpg",
          "男子自由体操_比赛现场_观众视角_003.jpg",
        ],
      },
      {
        key: "pommel",
        name: "男子鞍马",
        subtitle: "摆动与支撑动作镜头",
        cover: "photo-b",
        note: "归档男子鞍马专项动作、侧面机位和裁判席视角照片。",
        files: [
          "男子鞍马_竞技组_完整动作_001.jpg",
          "男子鞍马_裁判视角_动作连接_002.jpg",
          "男子鞍马_候场区_检录准备_003.jpg",
        ],
      },
      {
        key: "rings",
        name: "男子吊环",
        subtitle: "静止支撑与力量动作",
        cover: "photo-c",
        note: "归档吊环静止、十字支撑和下法动作照片。",
        files: [
          "男子吊环_静止支撑_001.jpg",
          "男子吊环_十字支撑_002.jpg",
          "男子吊环_下法落地_003.jpg",
        ],
      },
      {
        key: "vault",
        name: "男子跳马",
        subtitle: "助跑起跳与落地镜头",
        cover: "photo-d",
        note: "归档助跑、起跳、腾空和落地四段关键镜头。",
        files: [
          "男子跳马_助跑起跳_001.jpg",
          "男子跳马_腾空动作_002.jpg",
          "男子跳马_落地稳定_003.jpg",
        ],
      },
      {
        key: "parallel",
        name: "男子双杠",
        subtitle: "摆动与下法过程影像",
        cover: "photo-a",
        note: "归档双杠摆动、支撑转体和下法动作照片。",
        files: [
          "男子双杠_摆动过程_001.jpg",
          "男子双杠_支撑动作_002.jpg",
          "男子双杠_下法镜头_003.jpg",
        ],
      },
      {
        key: "horizontal",
        name: "男子单杠",
        subtitle: "腾跃飞行与抓杠镜头",
        cover: "photo-b",
        note: "归档单杠飞行动作、转体和落地画面。",
        files: [
          "男子单杠_飞行动作_001.jpg",
          "男子单杠_转体抓杠_002.jpg",
          "男子单杠_赛后致意_003.jpg",
        ],
      },
    ],
  },
  women: {
    label: "女生项目",
    items: [
      {
        key: "vault",
        name: "女子跳马",
        subtitle: "起跳、腾空与落地归档",
        cover: "photo-d",
        note: "归档女子跳马资格赛、决赛和落地抓拍照片。",
        files: [
          "女子跳马_助跑启动_001.jpg",
          "女子跳马_腾空瞬间_002.jpg",
          "女子跳马_落地镜头_003.jpg",
        ],
      },
      {
        key: "bars",
        name: "女子高低杠",
        subtitle: "换杠与腾跃动作镜头",
        cover: "photo-c",
        note: "归档高低杠换杠、腾跃和收尾动作照片。",
        files: [
          "女子高低杠_换杠动作_001.jpg",
          "女子高低杠_腾跃镜头_002.jpg",
          "女子高低杠_收尾定格_003.jpg",
        ],
      },
      {
        key: "beam",
        name: "女子平衡木",
        subtitle: "平衡控制与下法镜头",
        cover: "photo-b",
        note: "归档平衡木控制动作、转体和下法镜头。",
        files: [
          "女子平衡木_平衡控制_001.jpg",
          "女子平衡木_转体动作_002.jpg",
          "女子平衡木_下法落地_003.jpg",
        ],
      },
      {
        key: "floor",
        name: "女子自由体操",
        subtitle: "成套动作与表现力镜头",
        cover: "photo-a",
        note: "归档女子自由体操音乐编排、跳跃和结束动作照片。",
        files: [
          "女子自由体操_成套开场_001.jpg",
          "女子自由体操_跳跃动作_002.jpg",
          "女子自由体操_结束定格_003.jpg",
        ],
      },
    ],
  },
};

const els = {
  countdownText: document.getElementById("countdownText"),
  dateFilter: document.getElementById("dateFilter"),
  eventFilter: document.getElementById("eventFilter"),
  scheduleTableBody: document.getElementById("scheduleTableBody"),
  athleteQuery: document.getElementById("athleteQuery"),
  searchAthleteBtn: document.getElementById("searchAthleteBtn"),
  lookupResult: document.getElementById("lookupResult"),
  scoreFilterType: document.getElementById("scoreFilterType"),
  scoreKeyword: document.getElementById("scoreKeyword"),
  searchScoreBtn: document.getElementById("searchScoreBtn"),
  scoreTableBody: document.getElementById("scoreTableBody"),
  scoreDetail: document.getElementById("scoreDetail"),
  allAroundBoard: document.getElementById("allAroundBoard"),
  eventBoard: document.getElementById("eventBoard"),
  teamBoard: document.getElementById("teamBoard"),
  photoCarousel: document.getElementById("photoCarousel"),
  photoTag: document.getElementById("photoTag"),
  photoTitle: document.getElementById("photoTitle"),
  photoDesc: document.getElementById("photoDesc"),
  prevPhotoBtn: document.getElementById("prevPhotoBtn"),
  nextPhotoBtn: document.getElementById("nextPhotoBtn"),
  photoTabMen: document.getElementById("photoTabMen"),
  photoTabWomen: document.getElementById("photoTabWomen"),
  photoFolderGrid: document.getElementById("photoFolderGrid"),
  photoLibraryTitle: document.getElementById("photoLibraryTitle"),
  photoLibraryCount: document.getElementById("photoLibraryCount"),
  photoLibraryMeta: document.getElementById("photoLibraryMeta"),
  photoFileList: document.getElementById("photoFileList"),
  animatedBlocks: Array.from(
    document.querySelectorAll(
      ".hero-copy, .hero-panel, .panel-card, .bottom-banner, .schedule-alert, .quick-entry, .announcement-item",
    ),
  ),
};

const state = {
  deadline: new Date("2026-05-18T14:00:00+08:00"),
  currentPhotoIndex: 0,
  currentPhotoGender: "men",
  currentPhotoFolderKey: "floor",
};

init();

function init() {
  renderCountdown();
  bindScheduleFilters();
  bindLookup();
  bindScoreSearch();
  bindPhotoCarousel();
  bindPhotoLibrary();
  renderScheduleTable();
  renderScoreTable(scoreRows);
  renderBoards();
  renderDefaultDetail();
  renderPhotoSlide();
  renderPhotoLibrary();
  setupReveal();
}

function renderCountdown() {
  if (!els.countdownText) {
    return;
  }

  const now = new Date();
  const diff = state.deadline.getTime() - now.getTime();

  if (diff <= 0) {
    els.countdownText.textContent = "比赛进行中";
    return;
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  els.countdownText.textContent = `距赛事开始还有 ${days} 天 ${hours} 小时`;
}

function bindScheduleFilters() {
  els.dateFilter?.addEventListener("change", renderScheduleTable);
  els.eventFilter?.addEventListener("change", renderScheduleTable);
}

function renderScheduleTable() {
  const selectedDate = els.dateFilter?.value || "all";
  const selectedEvent = els.eventFilter?.value || "all";

  const filtered = scheduleRows.filter((row) => {
    const dateMatch = selectedDate === "all" || row.date === selectedDate;
    const eventMatch = selectedEvent === "all" || row.event === selectedEvent;
    return dateMatch && eventMatch;
  });

  els.scheduleTableBody.replaceChildren(
    ...filtered.map((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(row.date)}</td>
        <td>${escapeHtml(row.session)}</td>
        <td>${escapeHtml(row.event)}</td>
        <td>${escapeHtml(row.group)}</td>
        <td>${escapeHtml(row.athlete)}</td>
        <td>${escapeHtml(row.venue)}</td>
        <td>${escapeHtml(row.time)}</td>
        <td><span class="status-badge${row.changed ? " is-changed" : ""}">${escapeHtml(row.status)}</span></td>
      `;
      return tr;
    }),
  );
}

function bindLookup() {
  els.searchAthleteBtn?.addEventListener("click", renderLookupResult);
  els.athleteQuery?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      renderLookupResult();
    }
  });
}

function renderLookupResult() {
  const query = (els.athleteQuery?.value || "").trim();

  if (!query) {
    els.lookupResult.innerHTML = "<p>请输入参赛编码或姓名。</p>";
    return;
  }

  const match = scheduleRows.filter(
    (row) => row.code.includes(query) || row.name.includes(query),
  );

  if (!match.length) {
    els.lookupResult.innerHTML = "<p>未查询到相关场次，请确认输入信息是否正确。</p>";
    return;
  }

  els.lookupResult.innerHTML = match
    .map(
      (row) => `
        <article class="lookup-hit">
          <strong>${escapeHtml(row.name)}</strong>
          <span>${escapeHtml(row.group)} · ${escapeHtml(row.event)}</span>
          <p>${escapeHtml(row.date)} ${escapeHtml(row.time)} · ${escapeHtml(row.venue)} · ${escapeHtml(row.session)}</p>
        </article>
      `,
    )
    .join("");
}

function bindScoreSearch() {
  els.searchScoreBtn?.addEventListener("click", handleScoreSearch);
  els.scoreKeyword?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleScoreSearch();
    }
  });
}

function handleScoreSearch() {
  const type = els.scoreFilterType?.value || "all";
  const keyword = (els.scoreKeyword?.value || "").trim();

  if (!keyword || type === "all") {
    renderScoreTable(scoreRows);
    return;
  }

  const filtered = scoreRows.filter((row) => {
    if (type === "name") {
      return row.name.includes(keyword);
    }
    if (type === "code") {
      return row.code.includes(keyword);
    }
    if (type === "team") {
      return row.team.includes(keyword);
    }
    if (type === "event") {
      return row.event.includes(keyword);
    }
    return true;
  });

  renderScoreTable(filtered);
}

function renderScoreTable(rows) {
  els.scoreTableBody.replaceChildren(
    ...rows.map((row) => {
      const tr = document.createElement("tr");
      const button = document.createElement("button");
      button.className = "table-link";
      button.type = "button";
      button.textContent = "查看明细";
      button.addEventListener("click", () => renderScoreDetail(row));

      tr.innerHTML = `
        <td>${escapeHtml(String(row.rank))}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.code)}</td>
        <td>${escapeHtml(row.team)}</td>
        <td>${escapeHtml(row.event)}</td>
        <td>${escapeHtml(row.eventScore)}</td>
        <td>${escapeHtml(row.totalScore)}</td>
        <td></td>
      `;
      tr.lastElementChild?.appendChild(button);
      return tr;
    }),
  );
}

function renderDefaultDetail() {
  if (scoreRows[0]) {
    renderScoreDetail(scoreRows[0]);
  }
}

function renderScoreDetail(row) {
  els.scoreDetail.innerHTML = `
    <article class="detail-sheet">
      <strong>${escapeHtml(row.name)} · ${escapeHtml(row.event)}</strong>
      <div class="detail-grid">
        <div><span>动作内容</span><p>${escapeHtml(row.detail.movement)}</p></div>
        <div><span>难度分</span><p>${escapeHtml(row.detail.difficulty)}</p></div>
        <div><span>完成分</span><p>${escapeHtml(row.detail.execution)}</p></div>
        <div><span>扣分细则</span><p>${escapeHtml(row.detail.deduction)}</p></div>
      </div>
      <div class="judge-note">
        <span>裁判评分</span>
        <p>${escapeHtml(row.detail.judge)}</p>
      </div>
    </article>
  `;
}

function renderBoards() {
  renderRankList(els.allAroundBoard, boards.allAround);
  renderRankList(els.eventBoard, boards.event);
  renderRankList(els.teamBoard, boards.team);
}

function renderRankList(target, items) {
  target.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );
}

function bindPhotoCarousel() {
  els.prevPhotoBtn?.addEventListener("click", () => {
    state.currentPhotoIndex = (state.currentPhotoIndex - 1 + photoSlides.length) % photoSlides.length;
    renderPhotoSlide();
  });

  els.nextPhotoBtn?.addEventListener("click", () => {
    state.currentPhotoIndex = (state.currentPhotoIndex + 1) % photoSlides.length;
    renderPhotoSlide();
  });
}

function renderPhotoSlide() {
  const slide = photoSlides[state.currentPhotoIndex];

  if (!slide || !els.photoCarousel) {
    return;
  }

  els.photoCarousel.className = `photo-carousel ${slide.className}`;
  els.photoTag.textContent = slide.tag;
  els.photoTitle.textContent = slide.title;
  els.photoDesc.textContent = slide.description;
}

function bindPhotoLibrary() {
  els.photoTabMen?.addEventListener("click", () => switchPhotoLibrary("men"));
  els.photoTabWomen?.addEventListener("click", () => switchPhotoLibrary("women"));
}

function switchPhotoLibrary(gender) {
  if (state.currentPhotoGender === gender) {
    return;
  }

  state.currentPhotoGender = gender;
  state.currentPhotoFolderKey = photoLibrary[gender].items[0]?.key || "";
  renderPhotoLibrary();
}

function renderPhotoLibrary() {
  updatePhotoTabs();
  renderPhotoFolders();
  renderPhotoFiles();
}

function updatePhotoTabs() {
  els.photoTabMen?.classList.toggle("is-active", state.currentPhotoGender === "men");
  els.photoTabWomen?.classList.toggle("is-active", state.currentPhotoGender === "women");
}

function renderPhotoFolders() {
  const group = photoLibrary[state.currentPhotoGender];

  if (!group || !els.photoFolderGrid) {
    return;
  }

  els.photoFolderGrid.replaceChildren(
    ...group.items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `photo-folder-card ${item.cover}${item.key === state.currentPhotoFolderKey ? " is-active" : ""}`;
      button.innerHTML = `
        <span class="photo-folder-tag">${escapeHtml(group.label)}</span>
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.subtitle)}</p>
      `;
      button.addEventListener("click", () => {
        state.currentPhotoFolderKey = item.key;
        renderPhotoLibrary();
      });
      return button;
    }),
  );
}

function renderPhotoFiles() {
  const group = photoLibrary[state.currentPhotoGender];
  const folder = group?.items.find((item) => item.key === state.currentPhotoFolderKey);

  if (!group || !folder) {
    return;
  }

  if (els.photoLibraryTitle) {
    els.photoLibraryTitle.textContent = `${folder.name}照片库`;
  }

  if (els.photoLibraryCount) {
    els.photoLibraryCount.textContent = `${folder.files.length} 份文件`;
  }

  if (els.photoLibraryMeta) {
    els.photoLibraryMeta.innerHTML = `
      <span>分类说明</span>
      <p>${escapeHtml(folder.note)}</p>
    `;
  }

  if (els.photoFileList) {
    els.photoFileList.replaceChildren(
      ...folder.files.map((fileName, index) => {
        const article = document.createElement("article");
        article.className = "photo-file-item";
        article.innerHTML = `
          <div class="photo-file-icon">JPG</div>
          <div class="photo-file-copy">
            <strong>${escapeHtml(fileName)}</strong>
            <p>${escapeHtml(group.label)} · ${escapeHtml(folder.name)} · 第 ${index + 1} 份归档</p>
          </div>
        `;
        return article;
      }),
    );
  }
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    for (const block of els.animatedBlocks) {
      block.classList.add("is-visible");
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  for (const block of els.animatedBlocks) {
    observer.observe(block);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
