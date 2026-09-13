'use strict';

const CATEGORIES = [
  {
    "id": "drinkware",
    "label": "Drinkware",
    "hint": "Bottles, flasks, and cups from You and Georg Jensen"
  },
  {
    "id": "travel",
    "label": "Travel",
    "hint": "Packs and wash bags that survive a week away"
  },
  {
    "id": "bags",
    "label": "Bags",
    "hint": "GOTS cotton and canvas shoppers"
  },
  {
    "id": "home",
    "label": "Home & spa",
    "hint": "Lexington terry — robes and hotel towels"
  },
  {
    "id": "tableware",
    "label": "Table",
    "hint": "Iittala and Georg Jensen for the table"
  },
  {
    "id": "outdoors",
    "label": "Outdoors",
    "hint": "Gerber tools for cooking away from a kitchen"
  }
];

const ITEMS = [
  {
    "id": "almere",
    "brand": "You",
    "category": "drinkware",
    "price": 38,
    "stock": 42,
    "colors": [
      "White",
      "Steel grey",
      "Black",
      "Navy",
      "Olive"
    ],
    "name": "Almere recycled steel bottle",
    "blurb": "A 0.5 L recycled-steel bottle in a gift box — cold for a day, hot for half of one.",
    "why": "The default good bottle: quiet colors, no plastic body, ready to wrap.",
    "tags": [
      "food",
      "outdoors",
      "practical",
      "wellness"
    ],
    "occasions": [
      "birthday",
      "thank-you",
      "holiday",
      "just-because"
    ],
    "recipients": [
      "partner",
      "friend",
      "colleague",
      "parent"
    ],
    "sku": "5307",
    "image": "/images/gifts/5307-almere.jpg",
    "sourceUrl": "https://www.you.no/products/5307-almere",
    "sourceDescription": "Lekker drikkeflaske i rustfritt resirkulert stål. Dobbelisolert for ekstra lang bevaring av kald og varm drikke. Tidløst design med skrukork. Leveres i gaveeske. Flasken holder drikke kald opp til 24 timer eller varm opp til 12 timer.",
    "description": "A 0.5 L recycled-steel bottle in a gift box — cold for a day, hot for half of one. The default good bottle: quiet colors, no plastic body, ready to wrap."
  },
  {
    "id": "groningen",
    "brand": "You",
    "category": "drinkware",
    "price": 42,
    "stock": 28,
    "colors": [
      "White",
      "Olive",
      "Navy",
      "Steel",
      "Black"
    ],
    "name": "Groningen bottle with bamboo cap",
    "blurb": "Recycled steel, bamboo-topped cap, 0.6 L, packed in a gift box.",
    "why": "Same usefulness as Almere, with a warmer lid that feels like a present.",
    "tags": [
      "food",
      "outdoors",
      "home"
    ],
    "occasions": [
      "birthday",
      "thank-you",
      "housewarming"
    ],
    "recipients": [
      "partner",
      "friend",
      "colleague",
      "parent"
    ],
    "sku": "5306",
    "image": "/images/gifts/5306-groningen.jpg",
    "sourceUrl": "https://www.you.no/products/5306-groningen",
    "sourceDescription": "Lekker drikkeflaske i rustfritt resirkulert stål. Dobbelisolert for ekstra lang bevaring av kald og varm drikke. Tidløst design, stålfarget skrukork med dekorativ",
    "description": "Recycled steel, bamboo-topped cap, 0.6 L, packed in a gift box. Same usefulness as Almere, with a warmer lid that feels like a present."
  },
  {
    "id": "bree",
    "brand": "You",
    "category": "drinkware",
    "price": 36,
    "stock": 35,
    "colors": [
      "White",
      "Black",
      "Pink",
      "Turquoise",
      "Navy"
    ],
    "name": "Bree steel bottle",
    "blurb": "Powder-coated steel with a contrast neck and a grip handle on the cap.",
    "why": "A bottle people actually carry — the handle is the whole point.",
    "tags": [
      "food",
      "outdoors",
      "practical"
    ],
    "occasions": [
      "birthday",
      "just-because",
      "thank-you"
    ],
    "recipients": [
      "friend",
      "colleague",
      "partner",
      "parent"
    ],
    "sku": "5303",
    "image": "/images/gifts/5303-bree.jpg",
    "sourceUrl": "https://www.you.no/products/5303-bree",
    "sourceDescription": "Stilfull drikkeflaske i rustfritt stål. Dobbelisolert for ekstra lang bevaring av kald og varm drikke. Pulverlakkert hoveddel og kontrastfelt i rustfritt stål øverst mot flaskehalsen, gir et tidløst men moderne design. Skrukork med gripehåndtak. Leveres i gaveeske. Flasken holder drikke kald opp til 24 timer eller varm opp til 12 timer.",
    "description": "Powder-coated steel with a contrast neck and a grip handle on the cap. A bottle people actually carry — the handle is the whole point."
  },
  {
    "id": "geer-thermos",
    "brand": "You",
    "category": "drinkware",
    "price": 48,
    "stock": 22,
    "colors": [
      "White",
      "Black",
      "Cobalt Blue"
    ],
    "name": "Geer thermos",
    "blurb": "Powder-coated steel flask in 0.5 or 1.0 L, push-button cap, gift box.",
    "why": "For the person who still pours coffee at a desk six hours later.",
    "tags": [
      "food",
      "outdoors",
      "home"
    ],
    "occasions": [
      "birthday",
      "holiday",
      "thank-you"
    ],
    "recipients": [
      "parent",
      "colleague",
      "friend",
      "partner"
    ],
    "sku": "5301",
    "image": "/images/gifts/5301-geer-thermos.jpg",
    "sourceUrl": "https://www.you.no/products/5301-geer-thermos",
    "sourceDescription": "Dobbeltisolert, solid og pulverlakkert ståltermos i to størrelser. Termosen holder drikke kald opptil 24 timer eller varm opp til 12 timer. Skrukork med trykk-knappåpning. Leveres i gaveeske.",
    "description": "Powder-coated steel flask in 0.5 or 1.0 L, push-button cap, gift box. For the person who still pours coffee at a desk six hours later."
  },
  {
    "id": "luxembourg",
    "brand": "You",
    "category": "drinkware",
    "price": 40,
    "stock": 18,
    "colors": [
      "White",
      "Black",
      "Navy",
      "Olive",
      "Steel"
    ],
    "name": "Luxembourg carry-handle bottle",
    "blurb": "Double-wall steel with a silicone carry handle and a matte coat.",
    "why": "Easy to hang on a bag. Looks finished, not gym-coded.",
    "tags": [
      "food",
      "outdoors",
      "practical"
    ],
    "occasions": [
      "birthday",
      "just-because"
    ],
    "recipients": [
      "friend",
      "colleague",
      "partner"
    ],
    "sku": "5300",
    "image": "/images/gifts/5300-luxembourg.jpg",
    "sourceUrl": "https://www.you.no/products/5300-luxembourg",
    "sourceDescription": "Smart drikkeflaske i rustfritt stål. Dobbeltisolert for ekstra lang bevaring av kald og varm drikke. Flasken holder drikke kald opptil 24 timer eller varm opp til 12 timer. Stålfarget skrukork og praktisk bærehåndtak i silikon. Leveres i gaveeske. Pulverlakkert matt.",
    "description": "Double-wall steel with a silicone carry handle and a matte coat. Easy to hang on a bag. Looks finished, not gym-coded."
  },
  {
    "id": "sky-thermo-cup",
    "brand": "Georg Jensen",
    "category": "drinkware",
    "price": 89,
    "stock": 14,
    "colors": [
      "Black",
      "White",
      "Rose",
      "Blue",
      "Polished steel"
    ],
    "name": "Georg Jensen Sky thermo cup",
    "blurb": "Aurélien Barbry’s 0.4 L vacuum cup — leak-proof lid, fits a car holder, exclusive to You Brands.",
    "why": "A design object that still earns its keep on the commute.",
    "tags": [
      "food",
      "style",
      "home"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "thank-you",
      "holiday"
    ],
    "recipients": [
      "partner",
      "colleague",
      "friend",
      "parent"
    ],
    "sku": "FIGJSKYTHERMO",
    "image": "/images/gifts/figjskythermo-sky-thermo-cup.jpg",
    "sourceUrl": "https://www.you.no/products/figjskythermo-sky-thermo-cup",
    "sourceDescription": "Den franske designeren Aurélien Barbry står bak Sky termokruset, som naturlig forener estetikk med funksjonalitet. Den asymmetriske formen på kruset kombineres med praktiske funksjoner, slik at du kan ta med kruset på farten. Termokruset har et dobbelt vakuumlag som holder drikken varm i opptil tre timer, fra kokepunktet til 60 °C. Det lekkasjesikre lokket har en praktisk trykknappfunksjon og kan enkelt skrus av for rengjøring. Oppvask for hånd anbefales. Termokruset er designet slik at det passer til alle standard koppholdere. 0,4L.",
    "description": "Aurélien Barbry’s 0.4 L vacuum cup — leak-proof lid, fits a car holder, exclusive to You Brands. A design object that still earns its keep on the commute."
  },
  {
    "id": "sky-travel-cup",
    "brand": "Georg Jensen",
    "category": "drinkware",
    "price": 92,
    "stock": 11,
    "colors": [
      "Black",
      "White",
      "Steel"
    ],
    "name": "Georg Jensen Sky travel cup",
    "blurb": "0.4 L double-wall cup with a steel straw lid. Sized for a proper grip.",
    "why": "For someone who wants the Sky line, but iced.",
    "tags": [
      "food",
      "style",
      "outdoors"
    ],
    "occasions": [
      "birthday",
      "just-because"
    ],
    "recipients": [
      "partner",
      "friend",
      "colleague"
    ],
    "sku": "FIGJSKYTRAVEL",
    "image": "/images/gifts/figjskytravel-sky-travel-cup.jpg",
    "sourceUrl": "https://www.you.no/products/figjskytravel-sky-travel-cup",
    "sourceDescription": "Sky Travel Cup 0,4L i vakkert stilig design med høy funksjonalitet. Lokk med sugerør i rustfritt stål. Dobbeltlags vakuumvegger for å holde drikken kald. Passer til alle generiske koppholdere. Størrelsestilpasset for ekstra godt grep.",
    "description": "0.4 L double-wall cup with a steel straw lid. Sized for a proper grip. For someone who wants the Sky line, but iced."
  },
  {
    "id": "eindhoven",
    "brand": "You",
    "category": "drinkware",
    "price": 34,
    "stock": 40,
    "colors": [
      "White",
      "Black",
      "Navy",
      "Olive",
      "Steel"
    ],
    "name": "Eindhoven steel bottle",
    "blurb": "Clean steel bottle with a steel-colored screw cap, packed for gifting.",
    "why": "When you want a bottle without a story attached.",
    "tags": [
      "food",
      "practical"
    ],
    "occasions": [
      "thank-you",
      "just-because",
      "holiday"
    ],
    "recipients": [
      "colleague",
      "friend",
      "parent"
    ],
    "sku": "5294",
    "image": "/images/gifts/5294-eindhoven.jpg",
    "sourceUrl": "https://www.you.no/products/5294-eindhoven",
    "sourceDescription": "Lekker drikkeflaske i rustfritt stål. Dobbelisolert for ekstra lang bevaring av kald og varm drikke. Tidløst design med stålfarget skrukork. Leveres i gaveeske. Flasken holder drikke kald opp til 24 timer eller varm opp til 12 timer.",
    "description": "Clean steel bottle with a steel-colored screw cap, packed for gifting. When you want a bottle without a story attached."
  },
  {
    "id": "flanderen",
    "brand": "You",
    "category": "drinkware",
    "price": 35,
    "stock": 26,
    "colors": [
      "White",
      "Black",
      "Navy",
      "Olive"
    ],
    "name": "Flanderen drinking bottle",
    "blurb": "Powder-coated double-wall steel with a black hard-plastic drinking lid.",
    "why": "One-handed sipping. Desk, train, sideline.",
    "tags": [
      "food",
      "practical",
      "outdoors"
    ],
    "occasions": [
      "birthday",
      "thank-you"
    ],
    "recipients": [
      "friend",
      "colleague",
      "parent"
    ],
    "sku": "5302",
    "image": "/images/gifts/5302-flanderen.jpg",
    "sourceUrl": "https://www.you.no/products/5302-flanderen",
    "sourceDescription": "Drikkeflaske i dobbelisolert og pulverlakkert stål. Lokk i sort hardplast med drikketut og hempe. Leveres i gaveeske. Flasken holder drikke kald opp til 24 timer eller varm opp til 12 timer.",
    "description": "Powder-coated double-wall steel with a black hard-plastic drinking lid. One-handed sipping. Desk, train, sideline."
  },
  {
    "id": "thorn-cup",
    "brand": "You",
    "category": "drinkware",
    "price": 29,
    "stock": 33,
    "colors": [
      "Black",
      "White",
      "Navy"
    ],
    "name": "Thorn thermo cup 0.38 L",
    "blurb": "Egg-shaped steel cup that keeps a drink hot or cold without a stem in the way.",
    "why": "Small enough for a colleague, nice enough to keep.",
    "tags": [
      "food",
      "practical"
    ],
    "occasions": [
      "thank-you",
      "just-because",
      "holiday"
    ],
    "recipients": [
      "colleague",
      "friend",
      "parent"
    ],
    "sku": "5295",
    "image": "/images/gifts/5295-thorn-thermo-cup.jpg",
    "sourceUrl": "https://www.you.no/products/5295-thorn-thermo-cup",
    "sourceDescription": "Eggformet termokopp i rustfritt stål. Stettløst glass som holder drikken kald eller varm. Trendy og lekkert design. Lokk i hardplast med åpne/lukke drikkeåpning. Bidra til å redusere bruk av plast. Bruk stål som et varig og miljøvennlig alternativ.",
    "description": "Egg-shaped steel cup that keeps a drink hot or cold without a stem in the way. Small enough for a colleague, nice enough to keep."
  },
  {
    "id": "leiden-cup",
    "brand": "You",
    "category": "drinkware",
    "price": 28,
    "stock": 31,
    "colors": [
      "Black",
      "White",
      "Steel"
    ],
    "name": "Leiden thermo cup 0.38 L",
    "blurb": "A compact steel cup — the plastic-free daily driver.",
    "why": "Under forty dollars and still feels chosen.",
    "tags": [
      "food",
      "practical"
    ],
    "occasions": [
      "thank-you",
      "just-because"
    ],
    "recipients": [
      "colleague",
      "friend"
    ],
    "sku": "5296",
    "image": "/images/gifts/5296-leiden-thermo-cup.jpg",
    "sourceUrl": "https://www.you.no/products/5296-leiden-thermo-cup",
    "sourceDescription": "Bidra til å redusere bruk av plast. Bruk stål som et varig og miljøvennlig alternativ.",
    "description": "A compact steel cup — the plastic-free daily driver. Under forty dollars and still feels chosen."
  },
  {
    "id": "rotterdam-cup",
    "brand": "You",
    "category": "drinkware",
    "price": 31,
    "stock": 24,
    "colors": [
      "Black",
      "White",
      "Navy"
    ],
    "name": "Rotterdam cup 0.4 L",
    "blurb": "Steel travel cup with a simple lid and a shape that sits in a holder.",
    "why": "Unfussy. The right host or desk gift.",
    "tags": [
      "food",
      "home"
    ],
    "occasions": [
      "thank-you",
      "housewarming"
    ],
    "recipients": [
      "colleague",
      "friend",
      "parent"
    ],
    "sku": "5279",
    "image": "/images/gifts/5279-rotterdam.jpg",
    "sourceUrl": "https://www.you.no/products/5279-rotterdam",
    "sourceDescription": "Bidra til å redusere bruk av plast. Bruk stål som et varig og miljøvennlig alternativ.",
    "description": "Steel travel cup with a simple lid and a shape that sits in a holder. Unfussy. The right host or desk gift."
  },
  {
    "id": "waco",
    "brand": "You",
    "category": "drinkware",
    "price": 46,
    "stock": 16,
    "colors": [
      "Black",
      "White",
      "Steel"
    ],
    "name": "Waco vacuum thermos",
    "blurb": "Vacuum-insulated steel flask, two sizes, push-button screw cap.",
    "why": "Cabin, boat, long Saturday. It holds the heat.",
    "tags": [
      "food",
      "outdoors"
    ],
    "occasions": [
      "birthday",
      "holiday"
    ],
    "recipients": [
      "parent",
      "friend",
      "partner"
    ],
    "sku": "5002",
    "image": "/images/gifts/5002-waco.jpg",
    "sourceUrl": "https://www.you.no/products/5002-waco",
    "sourceDescription": "Vakuumisolert og solid ståltermos i to størrelser. Skrukork med trykk-knappåpnig. Flasken holder drikke kald opp til 24 timer eller varm opp til 12 timer. Leveres i gaveeske.",
    "description": "Vacuum-insulated steel flask, two sizes, push-button screw cap. Cabin, boat, long Saturday. It holds the heat."
  },
  {
    "id": "wabasca",
    "brand": "You",
    "category": "drinkware",
    "price": 44,
    "stock": 9,
    "colors": [
      "Steel"
    ],
    "name": "Wabasca steel thermos",
    "blurb": "Bare steel vacuum flask with a push-button cap. Built to be used hard.",
    "why": "For the person who already owns too many coated bottles.",
    "tags": [
      "food",
      "outdoors"
    ],
    "occasions": [
      "birthday",
      "holiday"
    ],
    "recipients": [
      "parent",
      "friend"
    ],
    "sku": "5001",
    "image": "/images/gifts/5001-wabasca.jpg",
    "sourceUrl": "https://www.you.no/products/5001-wabasca",
    "sourceDescription": "Vakuumisolert og solid ståltermos i to størrelser. Skrukork med trykk-knappåpning. Flasken holder drikke kald opp til 24 timer eller varm opp til 12 timer. Leveres i gaveeske.",
    "description": "Bare steel vacuum flask with a push-button cap. Built to be used hard. For the person who already owns too many coated bottles."
  },
  {
    "id": "transitt-backpack",
    "brand": "You",
    "category": "travel",
    "price": 68,
    "stock": 15,
    "colors": [
      "Grey",
      "Black"
    ],
    "name": "Transitt backpack",
    "blurb": "25 L recycled polyester pack: laptop sleeve from the side or top, organized pockets, water-repellent face.",
    "why": "The commuter bag that does not look like IT issued it.",
    "tags": [
      "style",
      "practical",
      "outdoors"
    ],
    "occasions": [
      "birthday",
      "holiday"
    ],
    "recipients": [
      "partner",
      "friend",
      "colleague"
    ],
    "sku": "8968",
    "image": "/images/gifts/8968-transitt-backpack.jpg",
    "sourceUrl": "https://www.you.no/products/8968-transitt-backpack",
    "sourceDescription": "Mange gjenvinningsstasjoner tar imot gjenstander til ombruk, noen har også har egne ombruksbutikker. Sjekk hvilke tilbud din kommune har.",
    "description": "25 L recycled polyester pack: laptop sleeve from the side or top, organized pockets, water-repellent face. The commuter bag that does not look like IT issued it."
  },
  {
    "id": "k2-backpack",
    "brand": "You",
    "category": "travel",
    "price": 54,
    "stock": 27,
    "colors": [
      "Navy",
      "Black/Grey",
      "Black/Orange",
      "Red",
      "Safety yellow"
    ],
    "name": "K2 backpack",
    "blurb": "25 L recycled-polyester pack with swappable contrast straps and a zippered side pocket.",
    "why": "Color without looking like a kids’ bag. Easy to live with.",
    "tags": [
      "outdoors",
      "practical",
      "style"
    ],
    "occasions": [
      "birthday",
      "holiday",
      "just-because"
    ],
    "recipients": [
      "friend",
      "partner",
      "parent"
    ],
    "sku": "8926",
    "image": "/images/gifts/8926-k2.jpg",
    "sourceUrl": "https://www.you.no/products/8926-k2",
    "sourceDescription": "Ryggsekk i resirkulert polyester med smart design og en utbyttbar kontraststropp. Det romslige hovedrommet har en praktisk glidelåslomme for verdisaker, mens sidelommer med glidelås gir rask tilgang til småting. De polstrede bærestroppene og den justerbare bryststroppen sørger for optimal komfort – uansett om du er på vei til jobb, skole eller ut på tur.",
    "description": "25 L recycled-polyester pack with swappable contrast straps and a zippered side pocket. Color without looking like a kids’ bag. Easy to live with."
  },
  {
    "id": "transfer-duffel",
    "brand": "You",
    "category": "travel",
    "price": 72,
    "stock": 12,
    "colors": [
      "Grey",
      "Black"
    ],
    "name": "Transfer duffel",
    "blurb": "Two-way top zip, hidden backpack straps in the lid, recycled polyester.",
    "why": "Weekend bag that still fits under a seat.",
    "tags": [
      "outdoors",
      "travel",
      "practical"
    ],
    "occasions": [
      "birthday",
      "holiday"
    ],
    "recipients": [
      "partner",
      "friend",
      "parent"
    ],
    "sku": "8969",
    "image": "/images/gifts/8969-transfer-duffelbag.jpg",
    "sourceUrl": "https://www.you.no/products/8969-transfer-duffelbag",
    "sourceDescription": "Toveis glidelåsåpning i toppen til hovedrom, Skjulte bærestropper til rygg i lokket. F",
    "description": "Two-way top zip, hidden backpack straps in the lid, recycled polyester. Weekend bag that still fits under a seat."
  },
  {
    "id": "rocky-backpack",
    "brand": "You",
    "category": "travel",
    "price": 62,
    "stock": 17,
    "colors": [
      "Black",
      "Grey",
      "Navy"
    ],
    "name": "Rocky backpack",
    "blurb": "A simpler, more practical take on the Transitt — same recycled cloth, fewer gizmos.",
    "why": "For the person who hated the last bag’s extra zippers.",
    "tags": [
      "practical",
      "outdoors",
      "style"
    ],
    "occasions": [
      "birthday",
      "holiday"
    ],
    "recipients": [
      "friend",
      "colleague",
      "partner"
    ],
    "sku": "8970",
    "image": "/images/gifts/8970-rocky-backpack.jpg",
    "sourceUrl": "https://www.you.no/products/8970-rocky-backpack",
    "sourceDescription": "Rocky er en ny, enklere og kanskje mer praktisk utgave av den populære ryggsekken 8926 K2. Rocky er produsert i resirkulert polyester med samme smarte design. Den velkjente kontraststroppen på framsiden leveres utredd, slik at eventuell bearbeiding på frontlomme blir mer effektiv, og man kan selv velge å sette stroppen på etterpå. Det romslige hovedrommet har egen PC-lomme, praktisk glidelåslomme for verdisaker, og sidelommer med glidelås. Polstrede bærestropper og sørger for optimal komfort – uansett om du er på vei til jobb, skole eller ut på tur. De små endringene gjør Rocky til en godt alternativ på pris, uten at det går utover kvaliteten. GRS-sertifisert metervare CU 1298291.",
    "description": "A simpler, more practical take on the Transitt — same recycled cloth, fewer gizmos. For the person who hated the last bag’s extra zippers."
  },
  {
    "id": "travel-toiletry",
    "brand": "You",
    "category": "travel",
    "price": 28,
    "stock": 34,
    "colors": [
      "Black"
    ],
    "name": "Travel toiletry bag",
    "blurb": "A hanging wash bag that actually stays open in a hotel bathroom.",
    "why": "The gift people use the next Thursday.",
    "tags": [
      "practical",
      "travel",
      "wellness"
    ],
    "occasions": [
      "birthday",
      "thank-you",
      "holiday"
    ],
    "recipients": [
      "friend",
      "partner",
      "parent",
      "colleague"
    ],
    "sku": "8955",
    "image": "/images/gifts/8955-travel-toiletry.jpg",
    "sourceUrl": "https://www.you.no/products/8955-travel-toiletry",
    "sourceDescription": "Mange gjenvinningsstasjoner tar imot gjenstander til ombruk, noen har også har egne ombruksbutikker. Sjekk hvilke tilbud din kommune har.",
    "description": "A hanging wash bag that actually stays open in a hotel bathroom. The gift people use the next Thursday."
  },
  {
    "id": "k2-urban",
    "brand": "You",
    "category": "travel",
    "price": 58,
    "stock": 13,
    "colors": [
      "Black",
      "Navy",
      "Grey"
    ],
    "name": "K2 Urban backpack",
    "blurb": "The K2 cut in a quieter city cloth — same bones, less trail.",
    "why": "Office to train without looking packed for a hike.",
    "tags": [
      "style",
      "practical"
    ],
    "occasions": [
      "birthday",
      "holiday"
    ],
    "recipients": [
      "colleague",
      "partner",
      "friend"
    ],
    "sku": "8929",
    "image": "/images/gifts/8929-k2-urban.jpg",
    "sourceUrl": "https://www.you.no/products/8929-k2-urban",
    "sourceDescription": "Vår populære backpack i et oppgradert og lekkert design – perfekt for både byliv og hverdag. Laget av resirkulert materiale og utstyrt med et romslig hovedrom med egen PC-lomme, sidelomme med glidelås, samt polstrede bærestropper og justerbar bryststropp for maksimal komfort.",
    "description": "The K2 cut in a quieter city cloth — same bones, less trail. Office to train without looking packed for a hike."
  },
  {
    "id": "canvas-tote",
    "brand": "Westford Mill",
    "category": "bags",
    "price": 24,
    "stock": 48,
    "colors": [
      "Natural",
      "Navy",
      "Black",
      "Olive",
      "Red"
    ],
    "name": "Everyday canvas tote",
    "blurb": "An oversized modern canvas shopper that works as bag or beach holdall.",
    "why": "Big enough for a market. Cheap enough to give twice.",
    "tags": [
      "home",
      "practical",
      "style"
    ],
    "occasions": [
      "thank-you",
      "housewarming",
      "just-because"
    ],
    "recipients": [
      "friend",
      "parent",
      "colleague"
    ],
    "sku": "BBW610",
    "image": "/images/gifts/bbw610-everyday-canvas-tote.jpg",
    "sourceUrl": "https://www.you.no/products/bbw610-everyday-canvas-tote",
    "sourceDescription": "Ekstra stor og god canvasveske designet i moderne stil. Passer perfekt både som strandveske og shopping bag. Bred og stor flate for bearbeiding.",
    "description": "An oversized modern canvas shopper that works as bag or beach holdall. Big enough for a market. Cheap enough to give twice."
  },
  {
    "id": "gots-tote-basic",
    "brand": "You",
    "category": "bags",
    "price": 12,
    "stock": 80,
    "colors": [
      "Natural",
      "Black"
    ],
    "name": "GOTS organic cotton tote — Basic",
    "blurb": "Light GOTS-certified organic cotton net. The everyday bag you stop forgetting.",
    "why": "A host gift that is not a candle.",
    "tags": [
      "home",
      "practical"
    ],
    "occasions": [
      "thank-you",
      "housewarming",
      "just-because"
    ],
    "recipients": [
      "colleague",
      "friend",
      "parent"
    ],
    "sku": "6601",
    "image": "/images/gifts/6601-gots-handlenett-basic.jpg",
    "sourceUrl": "https://www.you.no/products/6601-gots-handlenett-basic",
    "sourceDescription": "Klassisk handlenett i GOTS-sertifisert økologisk bomull. Den lette kvaliteten og det tidløse designet gjør det til et populært profilprodukt med mange bruksområder.",
    "description": "Light GOTS-certified organic cotton net. The everyday bag you stop forgetting. A host gift that is not a candle."
  },
  {
    "id": "gots-tote-classic",
    "brand": "You",
    "category": "bags",
    "price": 16,
    "stock": 64,
    "colors": [
      "Natural",
      "Navy",
      "Black"
    ],
    "name": "GOTS organic cotton tote — Classic",
    "blurb": "Heavier GOTS organic cotton shopper. Built to be used, not folded once.",
    "why": "The version that survives a year of groceries.",
    "tags": [
      "home",
      "practical"
    ],
    "occasions": [
      "thank-you",
      "housewarming"
    ],
    "recipients": [
      "parent",
      "friend",
      "colleague"
    ],
    "sku": "6602",
    "image": "/images/gifts/6602-gots-handlenett-classic.jpg",
    "sourceUrl": "https://www.you.no/products/6602-gots-handlenett-classic",
    "sourceDescription": "Klassisk GOTS-sertifisert handlenett i kraftig økologisk bomull – slitesterkt, romslig og perfekt for profilering.",
    "description": "Heavier GOTS organic cotton shopper. Built to be used, not folded once. The version that survives a year of groceries."
  },
  {
    "id": "lexington-bathrobe",
    "brand": "Lexington",
    "category": "home",
    "price": 168,
    "stock": 8,
    "colors": [
      "White",
      "Charcoal",
      "Tan",
      "Vintage green"
    ],
    "name": "Lexington Original bathrobe",
    "blurb": "Plush unisex terry robe with a shawl collar and front pockets. The house robe.",
    "why": "Anniversary or holiday — it feels like a hotel they get to keep.",
    "tags": [
      "home",
      "wellness",
      "style"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "holiday",
      "housewarming"
    ],
    "recipients": [
      "partner",
      "parent"
    ],
    "sku": "LX10007002",
    "image": "/images/gifts/lx10007002-lexington-original-bathrobe.jpg",
    "sourceUrl": "https://www.you.no/products/lx10007002-lexington-original-bathrobe",
    "sourceDescription": "½ brystvidde: 61 cm i størrelse M (3 cm forskjell mellom størrelsene) Lengde bak: 124 cm (1 cm forskjell mellom størrelsene)",
    "description": "Plush unisex terry robe with a shawl collar and front pockets. The house robe. Anniversary or holiday — it feels like a hotel they get to keep."
  },
  {
    "id": "lexington-towel",
    "brand": "Lexington",
    "category": "home",
    "price": 39,
    "stock": 21,
    "colors": [
      "White/Beige",
      "Grey/Dark Gray",
      "Beige/Beige"
    ],
    "name": "Lexington Hotel towel",
    "blurb": "600 g/m² combed terry. The towel people steal from hotels, sold honestly.",
    "why": "A housewarming that gets used the first night.",
    "tags": [
      "home",
      "wellness"
    ],
    "occasions": [
      "housewarming",
      "thank-you",
      "holiday"
    ],
    "recipients": [
      "friend",
      "parent",
      "partner"
    ],
    "sku": "LX10082100",
    "image": "/images/gifts/lx10082100-lexington-hotel-towel.jpg",
    "sourceUrl": "https://www.you.no/products/lx10082100-lexington-hotel-towel",
    "sourceDescription": "Dette håndkleet med Lexington-merke er et must for SPA-dager eller avslapning ved bassenget.",
    "description": "600 g/m² combed terry. The towel people steal from hotels, sold honestly. A housewarming that gets used the first night."
  },
  {
    "id": "teema-mug",
    "brand": "Iittala",
    "category": "tableware",
    "price": 32,
    "stock": 36,
    "colors": [
      "White",
      "Grey",
      "Black",
      "Pink",
      "Blue",
      "Linen"
    ],
    "name": "Iittala Teema mug 0.3 L",
    "blurb": "Kaj Franck, 1952. Circle, square, rectangle — a 0.3 L mug that mixes with the whole Teema family.",
    "why": "The Nordic mug people already recognize. Safe, and not boring.",
    "tags": [
      "food",
      "home",
      "style"
    ],
    "occasions": [
      "thank-you",
      "housewarming",
      "birthday",
      "just-because"
    ],
    "recipients": [
      "friend",
      "colleague",
      "parent",
      "partner"
    ],
    "sku": "FII10KRU03",
    "image": "/images/gifts/fii10kru03-teema-mug-0-3.jpg",
    "sourceUrl": "https://www.you.no/products/fii10kru03-teema-mug-0-3",
    "sourceDescription": "Design Kaj Franck 1952. Multifunksjonelt servise med uendelige kombinasjonsmuligheter som tilfredsstiller mange ulike behov på kjøkkenet. Teema er ildfast, kan fryses, tåler mikrobølgeovn og oppvaskmaskin. Du kan derfor både tilberede, servere og oppbevare mat i Teema. Et stilrent servise basert på de tre basisformene: sirkel, kvadrat og rektangel. I følge Kaj Franck var farge eneste nødvendige dekor.",
    "description": "Kaj Franck, 1952. Circle, square, rectangle — a 0.3 L mug that mixes with the whole Teema family. The Nordic mug people already recognize. Safe, and not boring."
  },
  {
    "id": "bernadotte-carafe",
    "brand": "Georg Jensen",
    "category": "tableware",
    "price": 189,
    "stock": 6,
    "colors": [
      "Crystal"
    ],
    "name": "Bernadotte carafe 1.1 L",
    "blurb": "Hand-blown crystal carafe with Sigvard Bernadotte’s fluting and a silver-tone cap.",
    "why": "A table gift that looks like you meant the dinner.",
    "tags": [
      "food",
      "home",
      "style",
      "experience"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "holiday",
      "housewarming"
    ],
    "recipients": [
      "partner",
      "parent",
      "friend"
    ],
    "sku": "FIGJ10019511",
    "image": "/images/gifts/figj10019511-bernadotte-carafe-1-1l.jpg",
    "sourceUrl": "https://www.you.no/products/figj10019511-bernadotte-carafe-1-1l",
    "sourceDescription": "Den klassiske elegansen til denne Bernadotte-karaffelen i håndblåste krystall, gjør den perfekt til servering av vann eller fruktjuice. Den smale formen gjør at den enkelt får plass i kjøleskapdøren og holder innholdet kjølig, og den karakteristiske riflede overflaten er ikke bare dekorativ, men gir også et godt grep.",
    "description": "Hand-blown crystal carafe with Sigvard Bernadotte’s fluting and a silver-tone cap. A table gift that looks like you meant the dinner."
  },
  {
    "id": "bernadotte-plate",
    "brand": "Georg Jensen",
    "category": "tableware",
    "price": 72,
    "stock": 14,
    "colors": [
      "Porcelain"
    ],
    "name": "Bernadotte dinner plate",
    "blurb": "Porcelain plate with Bernadotte’s strict fluted rim — functionalism you can stack.",
    "why": "One plate is a taste. A pair is a setting.",
    "tags": [
      "food",
      "home",
      "style"
    ],
    "occasions": [
      "housewarming",
      "wedding",
      "holiday"
    ],
    "recipients": [
      "partner",
      "friend",
      "parent"
    ],
    "sku": "FIGJ10019208",
    "image": "/images/gifts/figj10019208-bernadotte-dinner-plate.jpg",
    "sourceUrl": "https://www.you.no/products/figj10019208-bernadotte-dinner-plate",
    "sourceDescription": "Ved å kombinere de strenge rillene som kjennetegner Bernadottes funksjonalistiske estetikk med en diskré og moderne flat form gir denne porselenstallerkenen bordet et minimalistisk preg. De små rillene rundt kanten av tallerkenen tilfører både et dekorativt og taktilt element som er interessant og rammer inn maten uten å ta all oppmerksomheten.",
    "description": "Porcelain plate with Bernadotte’s strict fluted rim — functionalism you can stack. One plate is a taste. A pair is a setting."
  },
  {
    "id": "bernadotte-bowl",
    "brand": "Georg Jensen",
    "category": "tableware",
    "price": 84,
    "stock": 10,
    "colors": [
      "Stainless steel"
    ],
    "name": "Bernadotte bowl, medium",
    "blurb": "Fluted stainless bowl — salad, fruit, or just sitting on a shelf looking sure of itself.",
    "why": "Steel, not porcelain. Survives a real kitchen.",
    "tags": [
      "food",
      "home",
      "style"
    ],
    "occasions": [
      "housewarming",
      "wedding",
      "holiday"
    ],
    "recipients": [
      "partner",
      "parent",
      "friend"
    ],
    "sku": "FIGJ10015891",
    "image": "/images/gifts/figj10015891-bernadotte-bowl-medium.jpg",
    "sourceUrl": "https://www.you.no/products/figj10015891-bernadotte-bowl-medium",
    "sourceDescription": "Denne middels store skålen i rustfritt stål er inspirert av klassikerne, men har fått et helt moderne uttrykk som er både dekorativt og praktisk. Med den karakteristiske rillede designen fra sølvtøyet som ble utviklet av Prins Sigvard Bernadotte på 1930-tallet, er skålen egnet for servering av all slags mat.",
    "description": "Fluted stainless bowl — salad, fruit, or just sitting on a shelf looking sure of itself. Steel, not porcelain. Survives a real kitchen."
  },
  {
    "id": "bernadotte-flutes",
    "brand": "Georg Jensen",
    "category": "tableware",
    "price": 210,
    "stock": 5,
    "colors": [
      "Crystal"
    ],
    "name": "Bernadotte champagne flutes, set of 6",
    "blurb": "Six fluted crystal flutes. New Year, a wedding, or a Friday that deserves glass.",
    "why": "The anniversary gift that is not jewelry and not a weekend away.",
    "tags": [
      "food",
      "experience",
      "style",
      "home"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "holiday"
    ],
    "recipients": [
      "partner",
      "parent"
    ],
    "sku": "FIGJ10019698",
    "image": "/images/gifts/figj10019698-bernadotte-champagne-flute-glass-6-pcs.jpg",
    "sourceUrl": "https://www.you.no/products/figj10019698-bernadotte-champagne-flute-glass-6-pcs",
    "sourceDescription": "De rillede og geometriske linjene som kjennetegner Sigvard Bernadottes designspråk er en vakker detalj på disse elegante champagneglassene. Glassene er laget av krystall og er perfekte til alle anledninger som skal feires med en skål i champagne.",
    "description": "Six fluted crystal flutes. New Year, a wedding, or a Friday that deserves glass. The anniversary gift that is not jewelry and not a weekend away."
  },
  {
    "id": "bernadotte-wine",
    "brand": "Georg Jensen",
    "category": "tableware",
    "price": 198,
    "stock": 7,
    "colors": [
      "Crystal"
    ],
    "name": "Bernadotte red wine glasses, set of 6",
    "blurb": "Six wine glasses with Bernadotte’s geometric flute. Dinner becomes a decision.",
    "why": "For the couple who already cook. You bring the table.",
    "tags": [
      "food",
      "experience",
      "home",
      "style"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "holiday",
      "housewarming"
    ],
    "recipients": [
      "partner",
      "parent",
      "friend"
    ],
    "sku": "FIGJ10019230",
    "image": "/images/gifts/figj10019230-bernadotte-red-wine-glass-6-pcs.jpg",
    "sourceUrl": "https://www.you.no/products/figj10019230-bernadotte-red-wine-glass-6-pcs",
    "sourceDescription": "En del av gleden ved et godt glass vin ligger i presentasjonen, og disse elegante og moderne rødvinsglassene gir årgangsvinen den respekten den fortjener. De myke rillene tilfører ikke bare en art deco-inspirert detalj som fanger blikket, men har også funksjonalitet som gjør at glasset kan holdes godt fast.",
    "description": "Six wine glasses with Bernadotte’s geometric flute. Dinner becomes a decision. For the couple who already cook. You bring the table."
  },
  {
    "id": "schiphol-cup",
    "brand": "You",
    "category": "drinkware",
    "price": 26,
    "stock": 38,
    "colors": [
      "Black",
      "White",
      "Navy"
    ],
    "name": "Schiphol thermo cup 0.3 L",
    "blurb": "Light steel cup with a hard-plastic open/close lid. Airport-sized.",
    "why": "A thank-you that does not look like leftover merch.",
    "tags": [
      "food",
      "practical"
    ],
    "occasions": [
      "thank-you",
      "just-because"
    ],
    "recipients": [
      "colleague",
      "friend"
    ],
    "sku": "5299",
    "image": "/images/gifts/5299-schiphol-thermocup.jpg",
    "sourceUrl": "https://www.you.no/products/5299-schiphol-thermocup",
    "sourceDescription": "Lett og lekker termokopp i rustfritt stål. Lokk i sort hardplast med åpne/lukke-funksjon. Dobbeltisolert for ekstra lang bevaring av kald og varm drikke. Leveres i gaveeske. Pulverlakkert matt.",
    "description": "Light steel cup with a hard-plastic open/close lid. Airport-sized. A thank-you that does not look like leftover merch."
  },
  {
    "id": "liege-cup",
    "brand": "You",
    "category": "drinkware",
    "price": 33,
    "stock": 20,
    "colors": [
      "Black",
      "White",
      "Navy",
      "Olive"
    ],
    "name": "Liège thermo cup 0.24 L",
    "blurb": "Powder-coated steel espresso-scale cup with a contrast steel base.",
    "why": "Short drink, long commute. Looks like it belongs on a table.",
    "tags": [
      "food",
      "style"
    ],
    "occasions": [
      "thank-you",
      "birthday"
    ],
    "recipients": [
      "colleague",
      "partner",
      "friend"
    ],
    "sku": "5305",
    "image": "/images/gifts/5305-liege.jpg",
    "sourceUrl": "https://www.you.no/products/5305-liege",
    "sourceDescription": "Lekker termokopp i rustfritt stål. Pulverlakkert overflate og kontrastbunn i kork. Lokk i hardplast med åpne/lukke drikkeåpning.",
    "description": "Powder-coated steel espresso-scale cup with a contrast steel base. Short drink, long commute. Looks like it belongs on a table."
  },
  {
    "id": "namur-cup",
    "brand": "You",
    "category": "drinkware",
    "price": 32,
    "stock": 19,
    "colors": [
      "Black",
      "White",
      "Navy",
      "Olive"
    ],
    "name": "Namur thermo cup 0.42 L",
    "blurb": "Larger powder-coated steel cup with a smoked hard-plastic sip lid.",
    "why": "When a 0.3 L cup is a joke and a bottle is too much.",
    "tags": [
      "food",
      "practical"
    ],
    "occasions": [
      "birthday",
      "thank-you"
    ],
    "recipients": [
      "friend",
      "colleague",
      "parent"
    ],
    "sku": "5304",
    "image": "/images/gifts/5304-namur.jpg",
    "sourceUrl": "https://www.you.no/products/5304-namur",
    "sourceDescription": "Termokopp i rustfri og pulverlakkert stål. Lokk i sotet hardplast med åpne/lukke drikkeåpning. Leveres i gaveeske.",
    "description": "Larger powder-coated steel cup with a smoked hard-plastic sip lid. When a 0.3 L cup is a joke and a bottle is too much."
  },
  {
    "id": "gerber-spork",
    "brand": "Gerber",
    "category": "outdoors",
    "price": 29,
    "stock": 23,
    "colors": [
      "Onyx"
    ],
    "name": "Gerber Devour multi-spork",
    "blurb": "Nine tools in one: fork, spoon, serrated edge, bottle opener, package opener — camp kit, pocket size.",
    "why": "For the friend who eats outside more than in.",
    "tags": [
      "outdoors",
      "food",
      "practical"
    ],
    "occasions": [
      "birthday",
      "holiday",
      "just-because"
    ],
    "recipients": [
      "friend",
      "partner",
      "parent"
    ],
    "sku": "FIG1028484",
    "image": "/images/gifts/fig1028484-devour-cook-eat-clean-spork-onyx.jpg",
    "sourceUrl": "https://www.you.no/products/fig1028484-devour-cook-eat-clean-spork-onyx",
    "sourceDescription": "Med sine 9 funksjoner er Devour Multi-Spork det eneste verktøyet du trenger for matlaging, spising og rengjøring når du er på tur. Lett og sammenleggbar gjør den enkel å ha med i sekken.",
    "description": "Nine tools in one: fork, spoon, serrated edge, bottle opener, package opener — camp kit, pocket size. For the friend who eats outside more than in."
  },
  {
    "id": "gerber-tongs",
    "brand": "Gerber",
    "category": "outdoors",
    "price": 34,
    "stock": 18,
    "colors": [
      "Onyx"
    ],
    "name": "Gerber ComplEAT tongs",
    "blurb": "Nesting camp tongs from the ComplEAT set — the meal tool you bring when the kitchen is a stove.",
    "why": "Pairs with the spork. Or stands alone next to a cabin gift.",
    "tags": [
      "outdoors",
      "food",
      "practical"
    ],
    "occasions": [
      "birthday",
      "holiday"
    ],
    "recipients": [
      "friend",
      "parent",
      "partner"
    ],
    "sku": "FIG1028486",
    "image": "/images/gifts/fig1028486-compleat-cook-eat-clean-tong-onyx.jpg",
    "sourceUrl": "https://www.you.no/products/fig1028486-compleat-cook-eat-clean-tong-onyx",
    "sourceDescription": "På tur er det viktigste måltidet det du snart skal spise. Gerbers ComplEAT er et bestikk med gaffel, skje, stekespade og multiverktøy med fire funksjoner som også holder alle delene sammen. Satt sammen fungerer også CompIEAT som tang for matlaging.",
    "description": "Nesting camp tongs from the ComplEAT set — the meal tool you bring when the kitchen is a stove. Pairs with the spork. Or stands alone next to a cabin gift."
  }
];

const BUDGETS = {
  modest: { id: 'modest', label: 'Under $40', max: 40 },
  mid: { id: 'mid', label: '$40–80', min: 40, max: 80 },
  generous: { id: 'generous', label: '$80–150', min: 80, max: 150 },
  open: { id: 'open', label: '$150+', min: 150 }
};

function publicGift(item, locale) {
  const i18n = require('./i18n');
  return i18n.localizeGift(item, locale);
}

function listGifts(locale) {
  return ITEMS.map((item) => publicGift(item, locale));
}

function listCategories(locale) {
  const i18n = require('./i18n');
  return CATEGORIES.map((cat) => ({
    ...i18n.categoryCopy(cat.id, locale),
    count: ITEMS.filter((item) => item.category === cat.id).length
  }));
}

function getGift(id) {
  const item = ITEMS.find((row) => row.id === id);
  return item || null;
}

function getByCategory(categoryId) {
  return ITEMS.filter((item) => item.category === categoryId);
}

function related(id, limit = 3) {
  const item = getGift(id);
  if (!item) return [];
  return ITEMS.filter((row) => row.category === item.category && row.id !== id).slice(0, limit);
}

function scoreGift(gift, brief) {
  let score = 0;
  if (brief.recipient && gift.recipients.includes(brief.recipient)) score += 4;
  if (brief.occasion && gift.occasions.includes(brief.occasion)) score += 3;
  if (brief.interests && brief.interests.length) {
    const hits = brief.interests.filter((tag) => gift.tags.includes(tag)).length;
    score += hits * 2;
  }
  if (brief.budget) {
    const band = BUDGETS[brief.budget];
    if (band) {
      const min = band.min ?? 0;
      const max = band.max ?? Infinity;
      if (gift.price >= min && gift.price <= max) score += 3;
      else score -= 2;
    }
  }
  if (gift.stock <= 0) score -= 10;
  return score;
}

function recommend(brief, limit = 3, excludeIds = [], locale) {
  const excluded = new Set(excludeIds);
  return ITEMS
    .filter((gift) => !excluded.has(gift.id) && gift.stock > 0)
    .map((gift) => ({ gift, score: scoreGift(gift, brief) }))
    .sort((a, b) => b.score - a.score || a.gift.price - b.gift.price)
    .slice(0, limit)
    .map((entry) => publicGift(entry.gift, locale));
}

function stockStatus(item) {
  if (item.stock <= 0) return 'out';
  if (item.stock <= 8) return 'low';
  return 'in';
}

function featuredByCategory(locale, limit = 6) {
  const seen = new Set();
  const out = [];
  for (const item of ITEMS) {
    if (seen.has(item.category)) continue;
    seen.add(item.category);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out.map((item) => publicGift(item, locale));
}

module.exports = {
  CATEGORIES,
  ITEMS,
  GIFTS: ITEMS,
  BUDGETS,
  listGifts,
  listCategories,
  getGift,
  getByCategory,
  related,
  recommend,
  publicGift,
  stockStatus,
  featuredByCategory
};
