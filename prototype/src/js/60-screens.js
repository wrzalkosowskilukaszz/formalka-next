/* ── Splash, home, chat, and the screen table ─────────────────────────────── */
const SCREENS = {
  splash() {
    const el = h(`<section class="screen splash" aria-label="Formalka">${mark('splash-mark')}<p class="splash-word">formalka</p><p class="splash-sub">Twoje sprawy urzędowe w jednym miejscu</p></section>`);
    el.onclick = () => go('home', 'none');
    return el;
  },
  home() {
    const el = h(`<section class="screen home pad">
      <div class="brandrow">${mark()}<span class="word">formalka</span><span class="tag">prototyp, dane przykładowe</span></div>
      ${STUDY ? `<p class="study-note">${icon('info')}<span><b>Badanie</b> Wpisuj tylko dane wymyślone. Nic nie zostanie wysłane, zarezerwowane ani zapisane na stałe; przypomnienia i formularz są symulowane, a asystent nie korzysta z modelu językowego. ${esc(STUDY_SCOPE)}</span></p>` : ''}
      <div class="home-top">
        <h1 class="home-q">Co dziś załatwiamy?</h1>
        <p class="home-lead">Opisz sprawę własnymi słowami. Asystent AI ułoży z Tobą plan i sam przypomni, co dalej.</p>
        <form class="ask" id="home-ask" autocomplete="off"><label class="sr" for="home-t">Co dziś załatwiamy?</label>
          <input id="home-t" name="t" placeholder="Napisz, co masz do załatwienia" enterkeyhint="send">
          <button class="send" type="submit" aria-label="Wyślij">${icon('arrow-up')}</button></form>
        <p class="meta">Nie podawaj imienia, numerów dokumentów ani adresu.</p></div>
      <section class="home-cases" aria-labelledby="hc-h"><h2 class="sec-h" id="hc-h">Albo wybierz sprawę</h2>
        <div class="ex-row" role="list">${caseTypes().map((x, i) => `<button type="button" role="listitem" class="ex" style="animation-delay:${i * 60}ms" data-type="${x.id}">
          <span class="tile-ic">${icon(x.ic)}</span><b>${esc(x.short)}</b><span class="ex-d">${esc(x.d)}</span>${S.cases.some((c) => c.bpId === x.id) ? '<span class="ex-on">Masz już tę sprawę</span>' : ''}</button>`).join('')}</div></section>
      ${S.cases.length ? `<button type="button" class="btn btn-quiet btn-block" id="to-cases">${icon('house')} Twoje sprawy (${S.cases.length})</button>` : `<section class="how" aria-labelledby="how-h"><h2 class="sec-h" id="how-h">Jak to działa</h2>
        <ol class="how-steps">
          <li><span class="tile-ic sm">${icon('chat-circle-dots')}</span><span><b>Opisz sprawę</b><small>Własnymi słowami albo wybierz z listy powyżej</small></span></li>
          <li><span class="tile-ic sm">${icon('map-trifold')}</span><span><b>Zatwierdź plan</b><small>Kroki, dokumenty, opłaty i urzędy, każde ze źródłem</small></span></li>
          <li><span class="tile-ic sm">${icon('bell')}</span><span><b>Asystent pilnuje</b><small>Przypomina i proponuje, co dalej. Każdą sprawę prowadzi osobny asystent AI</small></span></li>
        </ol></section>`}
      <footer class="home-foot">${icon('info')}<p>Formalka to niezależna usługa, nie urząd. Plan powstaje z przewodników Formalki (${esc(E.registryVersion)}); kwoty, terminy i urzędy to przykłady, nie porada prawna. W prototypie asystent nie korzysta z modelu językowego, a kod prototypu nie wysyła danych sprawy. Linki do urzędów i map otwierają strony poza aplikacją.<span class="build">Wersja prototypu ${esc(BUILD?.id ?? 'dev')}, silnik ${esc(BUILD?.engine ?? '')}</span></p></footer></section>`);
    const input = $('#home-t', el);
    $$('[data-type]', el).forEach((b) => { b.onclick = () => {
      const ex = S.cases.find((c) => c.bpId === b.dataset.type);
      if (ex) { openCase(ex.id); return; }
      runFlow('case', () => startCase(b.dataset.type));
    }; });
    const tc = $('#to-cases', el); if (tc) tc.onclick = () => go('world', 'back');
    $('#home-ask', el).onsubmit = (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) { input.focus(); return; }
      // The one input always leads into the conversation (owner, 16.10: no dead ends on home). Words that
      // name a case already open go to that case; anything else is answered in the chat.
      const named = intentsIn(v);
      const known = named.map((id) => S.cases.find((c) => c.bpId === id)).filter(Boolean);
      if (known.length && named.every((id) => S.cases.some((c) => c.bpId === id))) S.active = known[0].id;
      go('chat', 'fwd');
      free(v);
    };
    return el;
  },
  chat() {
    const names = [...new Set(S.cases.map((c) => c.who))];
    const shown = names.length ? names.slice(0, 3) : [];
    const el = h(`<section class="screen chat">
      <header class="appbar pad"><button type="button" class="circle-btn" id="chat-back" aria-label="Wróć">${icon('arrow-left')}</button>
        ${shown.length ? `<button type="button" class="av-btn" id="chat-av" aria-label="Dziennik działań asystenta"><span class="avatars">${shown.map((n) => avatar(n, '', names.length === 1)).join('')}</span></button>` : ''}
        <span class="ttl"><b>${names.length > 1 ? esc(names.join(', ')) : names.length ? esc(names[0]) : 'Formalka'}</b><span>${names.length > 1 ? 'asystenci AI Twoich spraw, nie urzędnicy' : names.length ? `${esc(who(names[0]).role)}, nie urzędnik` : 'asystent AI'}</span></span>
      </header><div class="status-slot pad"></div><div class="builder-slot pad"></div></section>`);
    el.append(logEl);
    const dw = h('<div class="pad dock-wrap"></div>');
    dw.append(dockEl);
    el.append(dw);
    const b = $('#chat-back', el);
    // No case yet (the home input led here): back to home.
    if (b) b.onclick = () => { const c = C(); if (c?.state.approved) { S.view = 'focus'; go('case', 'back'); } else go(S.cases.length ? 'world' : 'home', 'back'); };
    const av = $('#chat-av', el);
    if (av) av.onclick = () => openHistory(C() || S.cases[0]);
    requestAnimationFrame(mountBuilder);
    drawStatus($('.status-slot', el));
    const c = C();
    if (c && c.pending === 'call' && !S.flow) runFlow('call', () => callFlow(c));
    else if (!S.flow && !dockEl.childElementCount) idleDock();
    S.cases.forEach((x) => { if (!x.pending) x.preview = ''; });
    scrollLog();
    return el;
  },
  world: () => worldScreen(),
  case: () => caseScreen(),
  calendar: () => calendarScreen(),
  teczka: () => teczkaScreen(),
};
