document.addEventListener('DOMContentLoaded', () => {
  // --- CORE HELPERS ---
  const $ = (id) => document.getElementById(id);
  const mainContent = document.querySelector('.content');
  const navMenu = $('nav');
  let isMobile = window.innerWidth <= 900;

  const readInt = (id, def) => parseInt($(id)?.value) || def;
  const readStr = (id, def) => $(id)?.value || def;
  const checked = id => $(id)?.checked;
  const randomOf = arr => arr[Math.floor(Math.random() * arr.length)];

  const showToast = (msg = "Copied!") => {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t.timer);
    t.timer = setTimeout(() => t.classList.remove('show'), 1500);
  };

  const copyToClipboard = (element) => {
    const text = element?.dataset.copytext || element?.textContent || element?.value;
    if (text) navigator.clipboard.writeText(text).then(() => showToast(), () => showToast("Failed to copy!"));
  };

  const slotReveal = (el, finalText, opts = {}) => {
    if (!el) return;
    el.dataset.copytext = finalText;
    const chars = opts.chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    el.innerHTML = '';
    const spans = [...finalText].map(char => {
      const s = document.createElement('span');
      s.className = 'slot';
      if (char === ' ' || (opts.staticChars && opts.staticChars.includes(char))) {
        s.innerHTML = char === ' ' ? '&nbsp;' : char;
      }
      el.appendChild(s);
      return s;
    });
    let animationFrame;
    const animate = () => {
      spans.forEach((span, i) => {
        if (span.textContent === finalText[i] || (opts.staticChars && opts.staticChars.includes(finalText[i]))) return;
        if (Math.random() > 0.92) {
          span.textContent = finalText[i];
          span.classList.add('spin');
        } else {
          span.textContent = randomOf(chars);
        }
      });
      if (spans.some((s, i) => s.textContent !== finalText[i] && !(opts.staticChars && opts.staticChars.includes(finalText[i])))) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    cancelAnimationFrame(animationFrame);
    animate();
  };

  const addPanel = (id, title, content, setupLogic) => {
    const panel = document.createElement('section');
    panel.id = `panel-${id}`;
    panel.className = 'panel';
    panel.style.display = 'none';
    panel.innerHTML = `<h2>${title}</h2>` + content;
    mainContent.appendChild(panel);
    if (setupLogic) setupLogic(panel);
  };

  const setupUI = () => {
    const sidebar = $('sidebar'), hamburger = $('hamburger'), nav = $('nav');
    if (isMobile) sidebar.classList.add('hide');

    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('hide');
      sidebar.classList.toggle('user-opened', !sidebar.classList.contains('hide'));
    });

    window.addEventListener('resize', () => {
      isMobile = window.innerWidth <= 900;
      if (isMobile && !sidebar.classList.contains('user-opened')) {
        sidebar.classList.add('hide');
      } else if (!isMobile) {
        sidebar.classList.remove('hide', 'user-opened');
      }
    });

    nav.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (tab) {
        nav.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
        const targetPanel = $(tab.dataset.target);
        if (targetPanel) targetPanel.style.display = 'block';
        if (isMobile) {
          sidebar.classList.add('hide');
          sidebar.classList.remove('user-opened');
        }
      }
      const toggle = e.target.closest('.category-toggle');
      if (toggle) {
        toggle.classList.toggle('collapsed');
      }
    });
    (nav.querySelector('.tab.active') || nav.querySelector('.tab')).click();
  };

  const animateTitleAndFavicon = () => {
    const frames = ['{Dev Hub}', '[Dev Hub]', '<Dev Hub/>'];
    const emojis = ['💻', '⚡️', '🚀', '⚙️'];
    const faviconEl = $('favicon');
    let i = 0;
    setInterval(() => {
      document.title = frames[i % frames.length];
      faviconEl.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emojis[i % emojis.length]}</text></svg>`;
      i++;
    }, 1500);
  };
  
  // --- DEFINE NAVIGATION STRUCTURE ---
  const navStructure = [
      { type: 'tab', id: 'home', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, name: 'Home' },
      { type: 'category', title: 'Generators', tools: [
          { id: 'password', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`, name: 'Password Generator' },
          { id: 'code', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`, name: 'Code Generator' },
          { id: 'uuid', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`, name: 'UUID Generator' },
          { id: 'hash', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="7"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>`, name: 'Hash Generator' }
      ]},
      { type: 'category', title: 'Games', tools: [
          { id: 'codebreaker', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 16h.01"/><path d="M12 12h.01"/><path d="M12 8h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/><path d="M7 8h.01"/><path d="M12 20a8 8 0 0 0 8-8"/></svg>`, name: 'Code Breaker' },
          { id: 'wordle', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`, name: 'Wordle' },
          { id: 'snake', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8.5 10.5c-1 0-1.5-1-1.5-1.5s.5-1.5 1.5-1.5S10 8 10 8.5 9.5 10.5 8.5 10.5z"/><path d="M15.5 10.5c-1 0-1.5-1-1.5-1.5s.5-1.5 1.5-1.5S17 8 17 8.5s-.5 2-1.5 2z"/><path d="M5.5 6.5C3 6.5 1 4.5 1 2V1.5c0-1 .5-1.5 1-1.5h20c.5 0 1 .5 1 1.5V2c0 2.5-2 4.5-4.5 4.5"/><path d="M5.5 6.5c0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5"/><path d="M12 6.5c0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5"/><path d="M2.5 11.5c-1 0-1.5 1-1.5 2v4c0 1 .5 1.5 1.5 1.5h19c1 0 1.5-.5 1.5-1.5v-4c0-1-.5-2-1.5-2"/></svg>`, name: 'Snake' },
          { id: 'pong', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18.5 4.5H19"/><path d="M6 12H5"/><path d="M4.5 19.5H5"/><path d="M19.5 19.5H19"/><circle cx="12" cy="12" r="1"/><path d="M15.5 15.5.5.5"/></svg>`, name: 'Pong' }
      ]},
      { type: 'category', title: 'Settings', tools: [
          { id: 'settings', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`, name: 'Appearance' }
      ]}
  ];
  navStructure.forEach(item => {
    if(item.type === 'tab') {
      const tab = document.createElement('div');
      tab.className = `tab ${item.id === 'home' ? 'active' : ''}`;
      tab.dataset.target = `panel-${item.id}`;
      tab.innerHTML = `${item.icon} ${item.name}`;
      navMenu.appendChild(tab);
    } else if (item.type === 'category') {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'nav-category';
      const toggleButton = document.createElement('button');
      toggleButton.className = 'category-toggle';
      toggleButton.textContent = item.title;
      categoryDiv.appendChild(toggleButton);
      const contentDiv = document.createElement('div');
      contentDiv.className = 'category-content';
      const innerDiv = document.createElement('div');
      item.tools.forEach(tool => {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.target = `panel-${tool.id}`;
        tab.innerHTML = `${tool.icon} ${tool.name}`;
        innerDiv.appendChild(tab);
      });
      contentDiv.appendChild(innerDiv);
      categoryDiv.appendChild(contentDiv);
      navMenu.appendChild(categoryDiv);
    }
  });


  // --- ALL PANEL DEFINITIONS ---
  
  // Home panel
  addPanel('home', 'Developer Hub', `<p class="muted">A collection of essential tools for developers. Use the sidebar to navigate or the search below to filter tools.</p><div class="field"><input type="search" id="search-tools" placeholder="Search for a tool..."></div>`, p => {
    const searchInput = $('search-tools');
    const tabs = [...document.querySelectorAll('.tab:not([data-target=panel-home])')];
    const categories = [...document.querySelectorAll('.nav-category')];
    searchInput.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        tabs.forEach(tab => {
            const text = tab.textContent.toLowerCase();
            tab.style.display = text.includes(term) ? 'flex' : 'none';
        });
        categories.forEach(cat => {
            const visibleTabs = [...cat.querySelectorAll('.tab')].some(t => t.style.display !== 'none');
            cat.style.display = visibleTabs ? 'block' : 'none';
        });
    });
  });

  // Settings Panel
  addPanel('settings', 'Appearance', `<p class="muted">Customize the look and feel of the app.</p><div class="field"><label>Theme</label><div id="theme-selector" class="theme-grid"></div></div><div class="field" id="pastel-picker-container" style="display:none; margin-top: 16px;"><label>Custom Pastel Base Color</label><input type="color" id="pastel-picker"></div>`, p => {const html=document.documentElement, pickerContainer=$('pastel-picker-container'), picker=$('pastel-picker'), grid=$('theme-selector'); const themes = [ {id:'cosmic',name:'Cosmic',colors:['hsl(250, 80%, 65%)','hsl(240, 5%, 20%)']}, {id:'ocean',name:'Ocean',colors:['hsl(215, 25%, 27%)','hsl(177, 30%, 25%)']}, {id:'cotton-candy',name:'Candy',colors:['hsl(328, 100%, 72%)','hsl(260, 88%, 70%)']}, {id:'geometry-dash',name:'Geometry',colors:['hsl(180, 95%, 50%)','hsl(50, 100%, 60%)']}, {id:'stormy-night',name:'Stormy',colors:['hsl(220, 90%, 60%)','hsl(240, 10%, 30%)']}, {id:'galaxy',name:'Galaxy',colors:['hsl(220, 90%, 60%)','hsl(240, 10%, 30%)']}, {id:'rustic',name:'Rustic',colors:['hsl(25, 80%, 50%)','hsl(35, 15%, 30%)']}, {id:'fox',name:'Fox',colors:['hsl(20, 100%, 55%)','hsl(0, 0%, 13%)']}, {id:'custom-pastel',name:'Custom',colors:[]} ]; themes.forEach(t=>{const swatch=document.createElement('div');swatch.className='theme-swatch';swatch.dataset.theme=t.id;swatch.innerHTML=`<div class="color-dots">${t.colors.map(c=>`<div class="color-dot" style="background:${c}"></div>`).join('')}${t.id==='custom-pastel'?'<input type="color" id="pastel-picker" value="#a855f7" style="width:100%; height:100%; opacity:0; position:absolute; cursor:pointer;">':''}</div><span class="theme-name">${t.name}</span>`;grid.appendChild(swatch)}); const apply=(t)=>{html.dataset.theme=t;localStorage.setItem('appTheme',t);document.querySelectorAll('.theme-swatch').forEach(s=>s.classList.toggle('active',s.dataset.theme===t));pickerContainer.style.display=t==='custom-pastel'?'flex':'none'}; grid.addEventListener('click',e=>{const swatch=e.target.closest('.theme-swatch');if(swatch)apply(swatch.dataset.theme)}); const hexToHsl=(H)=>{let r=0,g=0,b=0;if(H.length==4){r="0x"+H[1]+H[1];g="0x"+H[2]+H[2];b="0x"+H[3]+H[3]}else if(H.length==7){r="0x"+H[1]+H[2];g="0x"+H[3]+H[4];b="0x"+H[5]+H[6]}r/=255;g/=255;b/=255;let cmin=Math.min(r,g,b),cmax=Math.max(r,g,b),delta=cmax-cmin,h=0,s=0;if(delta==0)h=0;else if(cmax==r)h=((g-b)/delta)%6;else if(cmax==g)h=(b-r)/delta+2;else h=(r-g)/delta+4;h=Math.round(h*60);if(h<0)h+=360;s=delta==0?0:delta/(1-Math.abs(2*(cmax+cmin)/2-1));s=+(s*100).toFixed(1);return {h,s}};const updatePastel=(color)=>{const{h,s}=hexToHsl(color);html.style.setProperty('--custom-hue',h);html.style.setProperty('--custom-saturation',`${s}%`);localStorage.setItem('pastelColor',color)};document.body.addEventListener('input',e=>{if(e.target.id==='pastel-picker')updatePastel(e.target.value)});const savedTheme=localStorage.getItem('appTheme')||'cosmic';apply(savedTheme);const savedColor=localStorage.getItem('pastelColor')||'#a855f7';updatePastel(savedColor);if($('pastel-picker'))$('pastel-picker').value=savedColor;});
  
      // Other panels
      addPanel('password','Password Generator',`<p class="muted">Create strong, secure passwords.</p><div class="field"><label>Length</label><input id="pass-len" type="number" value="24" max="2048"></div><div id="pass-options" class="options-grid"></div><div class="row"><button id="pass-gen" class="btn">Generate</button><button id="pass-copy" class="btn">Copy</button></div><div id="pass-output" class="output-box" style="white-space:nowrap; overflow-x:auto; justify-content:flex-start"></div>`,p=>{const parent=$('pass-options');['Uppercase','Lowercase','Numbers','Symbols'].forEach(opt=>{const id=`pass-${opt.toLowerCase()}`;const label=document.createElement('label');label.className='custom-checkbox';label.innerHTML=`<input type="checkbox" id="${id}" ${opt!=='Symbols'?'checked':''}><div class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>${opt}</span>`;parent.appendChild(label)});const gen=()=>{let c='',res='';const l=Math.min(2048, readInt('pass-len', 24));if(checked('pass-upper'))c+='ABCDEFGHIJKLMNPQRSTUVWXYZ';if(checked('pass-lower'))c+='abcdefghijklmnopqrstuvwxyz';if(checked('pass-nums'))c+='123456789';if(checked('pass-spec'))c+='!@#$%^&*()_+';if(c==='')c='...';for(let i=0;i<l;i++)res+=randomOf(c);slotReveal($('pass-output'),res,{chars:c})};$('pass-gen').onclick=gen;$('pass-copy').onclick=()=>copyToClipboard($('pass-output'));gen();});
      addPanel('uuid', 'UUID Generator', `<p class="muted">Generate universally unique identifiers (v4).</p><div class="row"><button id="uuid-gen" class="btn">Generate</button><button id="uuid-copy" class="btn">Copy</button></div><div id="uuid-output" class="output-box"></div>`,p=>{const gen=()=>slotReveal($('uuid-output'),crypto.randomUUID(), {staticChars:'-'});$('uuid-gen').onclick=gen;$('uuid-copy').onclick=()=>copyToClipboard($('uuid-output'));gen()});
      addPanel('hash', 'Hash Generator', `<p class="muted">Compute a cryptographic hash of any text.</p><div class="field"><label>Input Text</label><textarea id="hash-text" rows="4">hello world</textarea></div><div class="row"><button id="hash-btn" class="btn">Generate</button><button onclick="copyToClipboard($('hash-out'))" class="btn">Copy</button></div><div id="hash-out" class="output-box" style="font-size:0.9rem;"></div>`, p => {const gen = async() => { const txt = readStr('hash-text'); const data = new TextEncoder().encode(txt); let out = ''; for (const alg of ['SHA-1', 'SHA-256', 'SHA-512']) {let hashHex;const hashBuffer=await crypto.subtle.digest(alg,data);hashHex=Array.from(new Uint8Array(hashBuffer)).map(b=>b.toString(16).padStart(2,'0')).join('');out += `${alg}:\n${hashHex}\n\n`;} $('hash-out').textContent = out.trim();}; $('hash-btn').onclick = gen; gen()});
      addPanel('codebreaker', 'Code Breaker', `<p class="muted">Educational game: Guess the secret 6-digit code in 10 tries.</p><div id="codebreaker-results"></div><div id="game-status"></div><div class="grid" style="grid-template-columns:1fr 1fr; margin-top: 16px"><div class="field"><label>Your Guess</label><input id="cb-guess-input" type="text" maxlength="6" pattern="[0-9]*"></div><div class="field"><label>Guesses Left</label><div id="cb-guesses-left" class="output-box" style="margin-top:0; justify-content:center;">10</div></div></div><div class="row"><button id="cb-guess-btn" class="btn">Guess</button><button id="cb-newgame-btn" class="btn">New Game</button></div>`, p => {let secret, guessesLeft, gameOver;const resultsDiv=$('codebreaker-results'),statusDiv=$('game-status'),guessInput=$('cb-guess-input'),guessBtn=$('cb-guess-btn'),guessesLeftDiv=$('cb-guesses-left');const newGame=()=>{secret=Array.from({length:6},()=>Math.floor(Math.random()*10)).join('');guessesLeft=10;gameOver=false;resultsDiv.innerHTML=Array.from({length:6},()=>`<div class="digit-box">?</div>`).join('');statusDiv.textContent='';guessInput.value='';guessBtn.disabled=false;guessesLeftDiv.textContent=guessesLeft};const checkGuess=()=>{if(gameOver||guessBtn.disabled)return;const guess=guessInput.value;if(guess.length!==6||!/^\d+$/.test(guess)){showToast('Enter a 6-digit number!');return}guessBtn.disabled=true;guessesLeft--;guessesLeftDiv.textContent=guessesLeft;resultsDiv.innerHTML='';let correctCount=0;const boxes=[];for(let i=0;i<6;i++){const box=document.createElement('div');box.className='digit-box';resultsDiv.appendChild(box);boxes.push(box)}const revealLoop=async()=>{for(let i=0;i<6;i++){const box=boxes[i];let status='absent';if(guess[i]===secret[i]){status='correct';correctCount++}else if(secret.includes(guess[i]))status='present';await new Promise(res=>setTimeout(res,200));box.style.animationDelay=`${i*0.1}s`;box.textContent=guess[i];box.classList.add(status,'reveal')}if(correctCount===6){gameOver=true;statusDiv.textContent='You won!';statusDiv.style.color='hsl(142, 80%, 60%)';}else if(guessesLeft<=0){gameOver=true;statusDiv.textContent=`You lost! The code was: ${secret}`;statusDiv.style.color='hsl(var(--destructive))';} else {guessBtn.disabled=false;}};revealLoop()};$('cb-guess-btn').onclick=checkGuess;$('cb-newgame-btn').onclick=newGame;guessInput.addEventListener('keydown',e=>{if(e.key==='Enter')checkGuess()});newGame()});
      addPanel('wordle','Wordle',`<p class="muted">Full game coming soon!</p>`);
      addPanel('snake','Snake',`<p class="muted">Full game coming soon!</p>`);
      addPanel('pong','Pong',`<p class="muted">Full game coming soon!</p>`);

      // Initialize the App
      setupUI();
      animateTitleAndFavicon();
    });
  </script>
</body>
</html>
