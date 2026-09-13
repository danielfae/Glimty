'use strict';

const PRODUCTS = require('./locales/products');

const DEFAULT_LOCALE = 'nb';
const LOCALES = ['nb', 'en'];

const COLORS = {
  White: { nb: 'Hvit', en: 'White' },
  'Steel grey': { nb: 'Stålgrå', en: 'Steel grey' },
  Black: { nb: 'Svart', en: 'Black' },
  Navy: { nb: 'Marine', en: 'Navy' },
  Olive: { nb: 'Oliven', en: 'Olive' },
  Steel: { nb: 'Stål', en: 'Steel' },
  Grey: { nb: 'Grå', en: 'Grey' },
  'Black/Grey': { nb: 'Svart/grå', en: 'Black/Grey' },
  'Black/Orange': { nb: 'Svart/oransje', en: 'Black/Orange' },
  Red: { nb: 'Rød', en: 'Red' },
  'Safety yellow': { nb: 'Varselgul', en: 'Safety yellow' },
  Natural: { nb: 'Natur', en: 'Natural' },
  Charcoal: { nb: 'Kull', en: 'Charcoal' },
  Tan: { nb: 'Kamel', en: 'Tan' },
  'Vintage green': { nb: 'Vintagegrønn', en: 'Vintage green' },
  'White/Beige': { nb: 'Hvit/beige', en: 'White/Beige' },
  'Grey/Dark Gray': { nb: 'Grå/mørkgrå', en: 'Grey/Dark Gray' },
  'Beige/Beige': { nb: 'Beige', en: 'Beige/Beige' },
  Pink: { nb: 'Rosa', en: 'Pink' },
  Blue: { nb: 'Blå', en: 'Blue' },
  Linen: { nb: 'Lin', en: 'Linen' },
  Crystal: { nb: 'Krystall', en: 'Crystal' },
  Porcelain: { nb: 'Porselen', en: 'Porcelain' },
  'Stainless steel': { nb: 'Rustfritt stål', en: 'Stainless steel' },
  Onyx: { nb: 'Onyx', en: 'Onyx' }
};

const UI = {
  nb: {
    lang_label: 'Språk',
    skip_content: 'Hopp til innhold',
    nav_shop: 'Butikk',
    nav_how: 'Slik funker det',
    nav_faq: 'FAQ',
    nav_talk: 'Snakk med Glimty',
    nav_talk_short: 'Snakk',
    nav_start_over: 'Start på nytt',
    nav_start_over_short: 'Nytt',
    crumbs_label: 'Du er her',
    chat_sending: 'Søker i lageret…',
    chat_open_gift: 'Åpne gaven',
    footer_left: 'Glimty — gaver fra You Brands-katalogen.',
    footer_right: 'Bilder og produkttekst fra you.no. Lageret holdes av Glimty.',
    footer_home_left: 'Glimty — hver gang du trenger en gave.',
    footer_home_right: 'Snakk på nettet. Vi blir med deg til gaven er valgt.',

    home_title: 'Glimty — hver gang du trenger en gave',
    home_description: 'Snakk med Glimtys egen gaveassistent. Finn, pakk inn og planlegg gaver uten å forlate siden.',
    home_eyebrow: 'Personlig shopping, på nett',
    home_lede: 'Hver gang du trenger en gave',
    home_intro: 'Snakk med en assistent som allerede kan handle til folk. Den enkleste måten å finne, pakke inn og huske en gave — uten Messenger, uten skjema.',
    home_cta_gift: 'Jeg trenger en gave',
    home_cta_hei: 'Si hei til assistenten',
    home_how_title: 'Slik funker det',
    home_how_intro: 'Du beskriver personen. Glimtys assistent bygger et brief, og blir med deg gjennom innpakning og påminnelser. Assistenten er her når du er her.',
    home_step1_title: 'Fortell hvem det er til',
    home_step1_body: 'Kjæreste, forelder, kollega, et barn — pluss anledningen og et budsjett du kan leve med.',
    home_step2_title: 'Få tre ekte forslag',
    home_step2_body: 'Ikke en dump av katalogen. Tre gaver som passer briefet, med en grunn for hver.',
    home_step3_title: 'Pakk inn, send eller husk',
    home_step3_body: 'Legg ved et kort, send det til dem, eller slipp datoen inn i planleggeren så neste gave ikke blir panikk.',
    home_cats_title: 'Glimty finner det for deg',
    home_cats_intro: 'Drikkeflasker, reise, vesker, Lexington-frotté, Iittala og Georg Jensen — fotografert fra You Brands-katalogen.',
    home_cat_gifts: '{count} gaver · {hint}',
    home_featured_title: 'Fra butikken',
    home_featured_intro: 'Et kort utvalg av det assistenten liker å anbefale først.',
    home_split_eyebrow: 'Assistenten',
    home_split_title: 'Din egen shopper, ikke et skript som starter på nytt',
    home_split_p1: 'Den gamle Glimty bodde i Facebook Messenger og gjentok samme velkomst hver gang noen skrev «hei». Denne husker briefet, forstår en setning som «gave til pappa, bursdag, 50 dollar», og spør bare om det som mangler.',
    home_split_p2: 'Trenger du innpakning eller en huskeliste i stedet? Si ifra. Samme assistent tar alle tre.',
    home_split_cta: 'Åpne hele assistenten',
    home_try_title: 'Prøv en første linje',
    home_try_p1: '«Jeg trenger en gave til kjæresten. Jubileum. Rundt 160 dollar. Hun elsker middag og blomster.»',
    home_try_p2: 'Eller start med innpakning, eller legg inn «Mamma, bursdag, 12. juni» i planleggeren.',
    home_faq_title: 'FAQ',
    home_faq1_q: 'Er dette fortsatt på Facebook Messenger?',
    home_faq1_a: 'Nei. Glimty bor på denne siden. Assistenten er vår — den sender deg ikke til Messenger, Typeform eller en annen innboks.',
    home_faq2_q: 'Kan jeg skrive i stedet for å trykke på knapper?',
    home_faq2_a: 'Ja. Knappene er snarveier. En hel setning er som regel nok til at assistenten hopper videre.',
    home_faq3_q: 'Pakker og sender dere gaver?',
    home_faq3_a: 'Assistenten tar kortteksten og hvor den skal. I denne forhåndsvisningen er kassen simulert, så du kan gå hele løypa.',
    home_faq4_q: 'Hva med gaveplanleggeren?',
    home_faq4_a: 'Legg inn folk og datoer mens du tenker på dem. Listen blir med økten, så neste gave allerede har et navn.',
    catalog_empty: 'Butikken lastet ikke akkurat da. Prøv å oppdatere siden.',
    home_nudge: 'Leter du etter en gave? Assistenten kan hjelpe deg nå.',
    home_nudge_btn: 'Se hvordan det funker',
    home_open_chat: 'Åpne Glimty-assistenten',

    shop_title: 'Butikk — Glimty',
    shop_title_cat: '{label} — Glimty butikk',
    shop_eyebrow: 'Lager',
    shop_heading: 'Butikken',
    shop_intro: '{count} gaver fotografert fra you.no — flasker, sekker, Lexington-frotté, Iittala, Georg Jensen og Gerber.',
    shop_meta: 'Gaver fra You Brands-katalogen, på Glimtys lager.',
    shop_all: 'Alle {count}',
    stock_in: 'På lager',
    stock_low: '{count} igjen',
    stock_out: 'Utsolgt',
    stock_in_count: '{count} på lager',
    stock_low_long: 'Lavt lager — {count} igjen',
    colors: 'Farger: {list}',
    ask_about: 'Spør Glimty om denne gaven',
    more_cat: 'Mer {label}',
    source_note: 'Fra You Brands-katalogen. <a href="{url}">Se på you.no</a>',
    also_in: 'Også i {label}',
    sku_line: '{brand} · SKU {sku}',

    not_found_title: 'Ikke funnet — Glimty',
    not_found_h1: 'Den siden er ikke her.',
    not_found_p: 'Assistenten er her, derimot.',

    assistant_title: 'Glimty-assistenten',
    assistant_head: 'Din gaveassistent',
    assistant_sub: 'Finner en gave, pakker den inn, eller husker datoene',
    assistant_placeholder: 'Fortell hvem det er til, eller velg en vei over',
    assistant_send: 'Send',
    assistant_back: 'Tilbake til Glimty',
    widget_name: 'Glimty',
    widget_sub: 'Personlig gaveassistent',
    widget_close: 'Lukk chatten',
    widget_placeholder: 'Skriv en melding',

    cat_drinkware: 'Drikke',
    cat_drinkware_hint: 'Flasker, termoser og kopper fra You og Georg Jensen',
    cat_travel: 'Reise',
    cat_travel_hint: 'Sekker og vaskevesker som tåler en uke borte',
    cat_bags: 'Vesker',
    cat_bags_hint: 'GOTS-bomull og canvasnett',
    cat_home: 'Hjem og spa',
    cat_home_hint: 'Lexington-frotté — kåper og hotellhåndklær',
    cat_tableware: 'Bord',
    cat_tableware_hint: 'Iittala og Georg Jensen til bordet',
    cat_outdoors: 'Friluft',
    cat_outdoors_hint: 'Gerber-verktøy til mat uten kjøkken',

    recipient_partner: 'Kjæreste',
    recipient_parent: 'Forelder',
    recipient_friend: 'Venn',
    recipient_colleague: 'Kollega',
    recipient_kid: 'Et barn',
    recipient_other: 'Noen andre',
    occasion_birthday: 'Bursdag',
    occasion_anniversary: 'Jubileum',
    occasion_holiday: 'Høytid',
    occasion_housewarming: 'Innflytting',
    occasion_thank_you: 'Takk',
    occasion_just_because: 'Bare fordi',
    budget_modest: 'Under 40 USD',
    budget_mid: '40–80 USD',
    budget_generous: '80–150 USD',
    budget_open: '150 USD+',
    interest_style: 'Stil',
    interest_home: 'Hjem',
    interest_food: 'Mat og drikke',
    interest_outdoors: 'Friluft',
    interest_music: 'Musikk',
    interest_books: 'Bøker',
    interest_wellness: 'Velvære',
    interest_experience: 'Opplevelser',
    interest_flowers: 'Blomster',
    planned_count: '{count} planlagt',

    chat_welcome: 'Hei — jeg er Glimty, din personlige gaveassistent. Jeg finner en gave som passer personen, ikke en generisk «topp 10»-liste. Hva trenger du i dag?',
    chat_need_gift: 'Jeg trenger en gave',
    chat_wrapping: 'Innpakning',
    chat_planner: 'Gaveplanlegger',
    chat_who: 'Hvem handler vi til?',
    chat_occasion: 'Skjønner — en gave til {who}. Hva er anledningen?',
    chat_budget: 'Hvilket budsjett føles greit? Jeg holder meg inni det.',
    chat_interests_have: 'Jeg har en følelse av smaken. Legg til noe jeg misser, eller si at det holder.',
    chat_interests_ask: 'Hva er de opptatt av? Velg noen — eller skriv det med egne ord.',
    chat_interests_enough: 'Det holder',
    chat_interest_noted: 'Notert — {label}. Noe mer, eller skal jeg plukke gaver?',
    chat_recommend: 'Her er tre gaver jeg faktisk ville gitt til {who} for {occasion}. Trykk på én for å velge, eller be meg se på nytt.',
    chat_recommend_from_text: 'Jeg trakk et kort utvalg fra det du nettopp sa.',
    chat_recommend_more: 'Noen flere, fortsatt inni briefet ditt.',
    chat_recommend_updated: 'Oppdaterte briefet og så på nytt.',
    chat_show_others: 'Vis meg andre',
    chat_change_brief: 'Endre briefet',
    chat_start_over: 'Start på nytt',
    chat_wrap_with_gift: 'Jeg kan pakke inn {name}, skrive et kort, og få den sendt. Hvor skal den?',
    chat_wrap_no_gift: 'Jeg kan pakke inn, skrive kort og sende en gave for deg. Har du gaven allerede, eller skal jeg finne en først?',
    chat_wrap_to_them: 'Send til mottakeren',
    chat_wrap_to_me: 'Send den til meg',
    chat_wrap_skip: 'Hopp over innpakning',
    chat_find_first: 'Finn en gave først',
    chat_have_gift: 'Jeg har gaven allerede',
    chat_planner_intro: 'Fortell hvem du trenger gave til, og når. Jeg holder en stille liste og kan foreslå når datoen nærmer seg.',
    chat_planner_existing: '\n\nAllerede på listen:\n{list}',
    chat_planner_add: 'Legg til noen',
    chat_find_now: 'Finn en gave nå',
    chat_clear_list: 'Tøm listen',
    chat_planner_format: 'Skriv det slik: «Mamma, bursdag, 12. juni» — navn, anledning, dato.',
    chat_chosen: 'Godt valg. {name} koster {price} USD. Jeg kan pakke den inn, legge den i planleggeren, eller la deg gå med dette valget.',
    chat_chosen_fallback: 'Jeg har merket den.',
    chat_view_gift: 'Se gaven',
    chat_wrap_and_send: 'Pakk inn og send',
    chat_add_planner: 'Legg i planleggeren',
    chat_thats_all: 'Det var det jeg trengte',
    chat_wrap_skip_done: 'Ingen innpakning — gaven selv er nok. Kom tilbake når du trenger den neste.',
    chat_another: 'Start en ny gave',
    chat_wrap_have_prompt: 'Fortell hva gaven er, og linjen du vil ha på kortet. Jeg tar det derfra.',
    chat_wrap_card_ask: 'Sender til {who}. Hva skal kortet si? En kort linje er bedre enn en tale.',
    chat_delivery_you: 'deg',
    chat_delivery_them: 'mottakeren',
    chat_done: 'Jeg er her når neste gave dukker opp. Ingen hast.',
    chat_find_another: 'Finn en ny gave',
    chat_open_planner: 'Åpne planleggeren',
    chat_card_noted_gift: 'Kort notert. Jeg pakker inn {name} og sender den til {who}. «{note}» står på kortet.',
    chat_card_noted: 'Kort notert: «{note}». Send gaveinfo når du har den, så tar jeg innpakningen.',
    chat_add_this_planner: 'Legg denne i planleggeren',
    chat_planner_almost: 'Nesten — prøv «Alex, jubileum, 3. mars» så jeg får den inn.',
    chat_find_instead: 'Finn en gave i stedet',
    chat_fallback: 'Jeg kan finne en gave, pakke inn en du allerede har, eller holde en planlegger. Si hvem det er til, eller velg en vei under.',
    chat_locale_nb: 'Språket er norsk. Jeg svarer på norsk fra nå.',
    chat_locale_en: 'Language is English. I will answer in English from here.',
    chat_who_them: 'dem',
    chat_occasion_moment: 'denne anledningen',
    chat_planner_someone: 'Noen',
    chat_planner_soon: 'Snart',
    chat_planner_to_choose: 'Skal velges',
    chat_planner_gift: 'Gave å velge',
    chat_error: 'Jeg nådde ikke assistenten akkurat da.'
  },
  en: {
    lang_label: 'Language',
    skip_content: 'Skip to content',
    nav_shop: 'Shop',
    nav_how: 'How it works',
    nav_faq: 'FAQ',
    nav_talk: 'Talk to Glimty',
    nav_talk_short: 'Talk',
    nav_start_over: 'Start over',
    nav_start_over_short: 'Reset',
    crumbs_label: 'You are here',
    chat_sending: 'Looking in the shop…',
    chat_open_gift: 'Open this gift',
    footer_left: 'Glimty — gifts from the You Brands catalog.',
    footer_right: 'Photos and product copy sourced from you.no. Inventory is held by Glimty.',
    footer_home_left: 'Glimty — every time you need a gift.',
    footer_home_right: 'Talk on the web. We stay with you until the gift is chosen.',

    home_title: 'Glimty — every time you need a gift',
    home_description: 'Talk with Glimty’s own gift assistant. Find, wrap, and plan presents without leaving the site.',
    home_eyebrow: 'Personal shopping, on the web',
    home_lede: 'Every time you need a gift',
    home_intro: 'Talk with an assistant who already knows how to shop for people. The easiest way to find, wrap, and remember a gift — no Messenger, no handoff to a form.',
    home_cta_gift: 'I need a gift',
    home_cta_hei: 'Say hei to the assistant',
    home_how_title: 'How it works',
    home_how_intro: 'You describe the person. Glimty’s assistant builds a brief, then stays with you through wrapping and reminders. Assistants are here whenever you are.',
    home_step1_title: 'Tell us who it’s for',
    home_step1_body: 'Partner, parent, colleague, a child — plus the occasion and a budget you can live with.',
    home_step2_title: 'Get three real options',
    home_step2_body: 'Not a dump of the catalog. Three gifts that fit the brief, with a reason for each.',
    home_step3_title: 'Wrap, send, or remember',
    home_step3_body: 'Add a card, send it to them, or drop the date into your planner so the next gift is not a scramble.',
    home_cats_title: 'Glimty finds it for you',
    home_cats_intro: 'Drinkware, travel, bags, Lexington terry, Iittala and Georg Jensen — photographed from the You Brands catalog.',
    home_cat_gifts: '{count} gifts · {hint}',
    home_featured_title: 'From the shop',
    home_featured_intro: 'A short edit of what the assistant likes to recommend first.',
    home_split_eyebrow: 'The assistant',
    home_split_title: 'Your own shopper, not a script that restarts',
    home_split_p1: 'The old Glimty lived in Facebook Messenger and repeated the same welcome every time someone typed “hi.” This one keeps the brief, understands a sentence like “gift for my dad, birthday, $50,” and only asks for what’s missing.',
    home_split_p2: 'Need wrapping or a reminder list instead? Say so. The same assistant handles all three.',
    home_split_cta: 'Open the full assistant',
    home_try_title: 'Try a first line',
    home_try_p1: '“I need a gift for my girlfriend. Anniversary. Around $160. She loves dinner and flowers.”',
    home_try_p2: 'Or start with wrapping, or add “Mom, birthday, June 12” to the planner.',
    home_faq_title: 'FAQ',
    home_faq1_q: 'Is this still on Facebook Messenger?',
    home_faq1_a: 'No. Glimty now lives on this site. The assistant is ours — it does not send you to Messenger, Typeform, or a third-party inbox.',
    home_faq2_q: 'Can I type instead of tapping buttons?',
    home_faq2_a: 'Yes. Buttons are shortcuts. A full sentence is usually enough for the assistant to skip ahead.',
    home_faq3_q: 'Do you wrap and send gifts?',
    home_faq3_a: 'The assistant takes the card line and where it should go. In this preview, checkout is simulated so you can walk the whole path.',
    home_faq4_q: 'What about the gift planner?',
    home_faq4_a: 'Add people and dates as you think of them. The list stays with your session so the next gift is already named.',
    catalog_empty: 'The shop did not load just then. Try refreshing the page.',
    home_nudge: 'Looking for a gift? The assistant can help you now.',
    home_nudge_btn: 'See how it works',
    home_open_chat: 'Open Glimty assistant',

    shop_title: 'Shop — Glimty',
    shop_title_cat: '{label} — Glimty shop',
    shop_eyebrow: 'Inventory',
    shop_heading: 'The shop',
    shop_intro: '{count} gifts photographed from you.no — bottles, packs, Lexington terry, Iittala, Georg Jensen, and Gerber.',
    shop_meta: 'Gifts from the You Brands catalog, held in Glimty inventory.',
    shop_all: 'All {count}',
    stock_in: 'In stock',
    stock_low: '{count} left',
    stock_out: 'Sold out',
    stock_in_count: '{count} in stock',
    stock_low_long: 'Low stock — {count} left',
    colors: 'Colors: {list}',
    ask_about: 'Ask Glimty about this gift',
    more_cat: 'More {label}',
    source_note: 'From the You Brands catalog. <a href="{url}">View on you.no</a>',
    also_in: 'Also in {label}',
    sku_line: '{brand} · SKU {sku}',

    not_found_title: 'Not found — Glimty',
    not_found_h1: 'That page is not here.',
    not_found_p: 'The assistant is, though.',

    assistant_title: 'Glimty assistant',
    assistant_head: 'Your gift assistant',
    assistant_sub: 'Finds a gift, wraps it, or keeps the dates',
    assistant_placeholder: 'Tell me who it’s for, or pick a path above',
    assistant_send: 'Send',
    assistant_back: 'Back to Glimty home',
    widget_name: 'Glimty',
    widget_sub: 'Personal gift assistant',
    widget_close: 'Close chat',
    widget_placeholder: 'Type a message',

    cat_drinkware: 'Drinkware',
    cat_drinkware_hint: 'Bottles, flasks, and cups from You and Georg Jensen',
    cat_travel: 'Travel',
    cat_travel_hint: 'Packs and wash bags that survive a week away',
    cat_bags: 'Bags',
    cat_bags_hint: 'GOTS cotton and canvas shoppers',
    cat_home: 'Home & spa',
    cat_home_hint: 'Lexington terry — robes and hotel towels',
    cat_tableware: 'Table',
    cat_tableware_hint: 'Iittala and Georg Jensen for the table',
    cat_outdoors: 'Outdoors',
    cat_outdoors_hint: 'Gerber tools for cooking away from a kitchen',

    recipient_partner: 'Partner',
    recipient_parent: 'Parent',
    recipient_friend: 'Friend',
    recipient_colleague: 'Colleague',
    recipient_kid: 'A child',
    recipient_other: 'Someone else',
    occasion_birthday: 'Birthday',
    occasion_anniversary: 'Anniversary',
    occasion_holiday: 'Holiday',
    occasion_housewarming: 'Housewarming',
    occasion_thank_you: 'Thank you',
    occasion_just_because: 'Just because',
    budget_modest: 'Under $40',
    budget_mid: '$40–80',
    budget_generous: '$80–150',
    budget_open: '$150+',
    interest_style: 'Style',
    interest_home: 'Home',
    interest_food: 'Food & drink',
    interest_outdoors: 'Outdoors',
    interest_music: 'Music',
    interest_books: 'Books',
    interest_wellness: 'Wellness',
    interest_experience: 'Experiences',
    interest_flowers: 'Flowers',
    planned_count: '{count} planned',

    chat_welcome: 'Hi — I am Glimty, your personal gift assistant. I find a gift that fits the person, not a generic “top 10” list. What do you need today?',
    chat_need_gift: 'I need a gift',
    chat_wrapping: 'Gift wrapping',
    chat_planner: 'Gift planner',
    chat_who: 'Who are we shopping for?',
    chat_occasion: 'Got it — a gift for your {who}. What’s the occasion?',
    chat_budget: 'What budget feels comfortable? I will stay inside it.',
    chat_interests_have: 'I have a sense of their taste. Add anything I missed, or tell me that’s enough.',
    chat_interests_ask: 'What are they into? Pick a few — or just write it in your own words.',
    chat_interests_enough: 'Those are enough',
    chat_interest_noted: 'Noted — {label}. Anything else, or shall I pick gifts?',
    chat_recommend: 'Here are three gifts I would actually give your {who} for a {occasion}. Tap one to choose it, or ask me to look again.',
    chat_recommend_from_text: 'I pulled a shortlist from what you just told me.',
    chat_recommend_more: 'A few more, still inside your brief.',
    chat_recommend_updated: 'Updated the brief and looked again.',
    chat_show_others: 'Show me others',
    chat_change_brief: 'Change the brief',
    chat_start_over: 'Start over',
    chat_wrap_with_gift: 'I can wrap the {name}, write a short card, and have it sent. Where should it go?',
    chat_wrap_no_gift: 'I can wrap, write a card, and send a gift for you. Do you already have the gift, or should I find one first?',
    chat_wrap_to_them: 'Send to the recipient',
    chat_wrap_to_me: 'Send it to me',
    chat_wrap_skip: 'Skip wrapping',
    chat_find_first: 'Find a gift first',
    chat_have_gift: 'I already have a gift',
    chat_planner_intro: 'Tell me who you need a gift for and when you need it. I will keep a quiet list and can suggest ideas when the date gets close.',
    chat_planner_existing: '\n\nAlready on your list:\n{list}',
    chat_planner_add: 'Add someone',
    chat_find_now: 'Find a gift now',
    chat_clear_list: 'Clear the list',
    chat_planner_format: 'Write it like this: “Mom, birthday, June 12” — name, occasion, date.',
    chat_chosen: 'Good eye. The {name} is ${price}. I can wrap it, add it to your planner, or leave you with this pick.',
    chat_chosen_fallback: 'I have that one marked.',
    chat_view_gift: 'View this gift',
    chat_wrap_and_send: 'Wrap and send it',
    chat_add_planner: 'Add to planner',
    chat_thats_all: 'That’s all I needed',
    chat_wrap_skip_done: 'No wrapping — the gift itself is enough. Come back when you need the next one.',
    chat_another: 'Start another gift',
    chat_wrap_have_prompt: 'Tell me what the gift is, and the line you want on the card. I will take it from there.',
    chat_wrap_card_ask: 'Sending to {who}. What should the card say? A short line is better than a speech.',
    chat_delivery_you: 'you',
    chat_delivery_them: 'the recipient',
    chat_done: 'I will be here whenever the next gift comes up. No rush.',
    chat_find_another: 'Find another gift',
    chat_open_planner: 'Open the planner',
    chat_card_noted_gift: 'Card noted. I will wrap the {name} and send it to {who}. “{note}” will be on the card.',
    chat_card_noted: 'Card noted: “{note}”. Send me the gift details whenever you have them, and I will handle wrapping.',
    chat_add_this_planner: 'Add this to the planner',
    chat_planner_almost: 'Almost — try “Alex, anniversary, March 3” so I can file it.',
    chat_find_instead: 'Find a gift instead',
    chat_fallback: 'I can find a gift, wrap one you already have, or keep a planner. Tell me who it is for, or pick a path below.',
    chat_locale_nb: 'Språket er norsk. Jeg svarer på norsk fra nå.',
    chat_locale_en: 'Language is English. I will answer in English from here.',
    chat_who_them: 'them',
    chat_occasion_moment: 'this moment',
    chat_planner_someone: 'Someone',
    chat_planner_soon: 'Soon',
    chat_planner_to_choose: 'To choose',
    chat_planner_gift: 'Gift to choose',
    chat_error: 'I could not reach the assistant just then.'
  }
};

function normalizeLocale(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'en' || raw.startsWith('en-')) return 'en';
  if (raw === 'nb' || raw === 'no' || raw === 'nn' || raw.startsWith('nb') || raw.startsWith('no')) return 'nb';
  return DEFAULT_LOCALE;
}

function t(locale, key, vars = {}) {
  const lang = normalizeLocale(locale);
  const raw = (UI[lang] && UI[lang][key]) || UI[DEFAULT_LOCALE][key] || key;
  return String(raw).replace(/\{(\w+)\}/g, (_, name) => (vars[name] != null ? String(vars[name]) : ''));
}

function uiPack(locale) {
  const lang = normalizeLocale(locale);
  const keys = [
    'assistant_send', 'assistant_placeholder', 'widget_placeholder', 'widget_close',
    'nav_start_over', 'chat_error', 'lang_label', 'home_cat_gifts', 'catalog_empty',
    'chat_sending', 'chat_open_gift',
    'recipient_partner', 'recipient_parent', 'recipient_friend', 'recipient_colleague',
    'recipient_kid', 'recipient_other',
    'occasion_birthday', 'occasion_anniversary', 'occasion_holiday', 'occasion_housewarming',
    'occasion_thank_you', 'occasion_just_because',
    'budget_modest', 'budget_mid', 'budget_generous', 'budget_open',
    'interest_style', 'interest_home', 'interest_food', 'interest_outdoors',
    'interest_music', 'interest_books', 'interest_wellness', 'interest_experience', 'interest_flowers',
    'planned_count'
  ];
  const pack = {};
  keys.forEach((key) => { pack[key] = t(lang, key); });
  return pack;
}

function colorName(value, locale) {
  const entry = COLORS[value];
  if (!entry) return value;
  return entry[normalizeLocale(locale)] || value;
}

function localizeGift(item, locale) {
  if (!item) return null;
  const lang = normalizeLocale(locale);
  const extra = lang === 'nb' ? PRODUCTS[item.id] : null;
  const name = extra?.name || item.name;
  const blurb = extra?.blurb || item.blurb;
  const why = extra?.why || item.why;
  const description = extra?.description || item.description || `${blurb} ${why}`.trim();
  const colors = (item.colors || []).map((color) => colorName(color, lang));
  return {
    id: item.id,
    sku: item.sku,
    name,
    brand: item.brand,
    price: item.price,
    category: item.category,
    blurb,
    why,
    description,
    image: item.image,
    stock: item.stock,
    colors,
    href: '/gift/' + item.id,
    sourceUrl: item.sourceUrl
  };
}

function categoryCopy(id, locale) {
  return {
    id,
    label: t(locale, `cat_${id}`),
    hint: t(locale, `cat_${id}_hint`)
  };
}

function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

function resolveLocale(req) {
  const query = req.query || {};
  if (query.lang) return normalizeLocale(query.lang);
  const cookies = parseCookies(req.headers?.cookie);
  if (cookies.glimty_lang) return normalizeLocale(cookies.glimty_lang);
  return DEFAULT_LOCALE;
}

function localeCookie(locale) {
  return `glimty_lang=${normalizeLocale(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function langHref(path, locale) {
  const clean = String(path || '/').split('?')[0] || '/';
  return `${clean}?lang=${locale}`;
}

module.exports = {
  DEFAULT_LOCALE,
  LOCALES,
  UI,
  PRODUCTS,
  t,
  uiPack,
  normalizeLocale,
  localizeGift,
  categoryCopy,
  colorName,
  parseCookies,
  resolveLocale,
  localeCookie,
  langHref
};
