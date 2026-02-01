# Zadání pro Playwright Automation

## Kontext
Jedním z našich produktů je **Dovolená za Benefity**.
Jedná se o multiproduct aplikaci s:
- Několika jazykovými mutacemi
- Více variantami, které vypadají podobně
- Kompletně vizuálně odlišným whitelabelem

**Odkazy na podobné varianty produktu:**
- Varianta 1: https://test-fe-pl.dovolena-za-benefity.cz
- Varianta 2: https://test-fe-cz.dovolena-za-benefity.cz
- Whitelabel: https://wa-fe-dzb-pluxee-cz-preprod.azurewebsites.net

---
## Úkol: Praktická implementace v Playwrightu

**Časový limit:** Maximálně 1 MD (man-day) - **TOTO JE TVRDÝ LIMIT**. Vybranému kandidátovi čas proplatíme.

V případě jakýchkoliv dotazů se ptej. Urči si vlastní deadline, do kdy zadání vypracuješ, a ten dodrž.

### Zadání
Ve spolupráci s AI vytvoř set automatizovaných testů v **Playwrightu**, které pokryjí **náš produkt Dovolená za Benefity**:

#### Happy Path
Nákup ubytování s kombinací:
- Použití voucheru (validní kód ti poskytneme)
- Platba Pluxee
- Platba převodem

**Poznámka:** Polský produkt nemá platební metodu Pluxee - zde použij pouze voucher + převodem. Zajímá nás, jak tento rozdíl vyřešíš.

**Důležité:** Během testu pokryj co nejvíc features produktu. Chceme vidět, že jeden test kontroluje více věcí v každém kroku cesty.

**Výzva:** Jednou z výzev, kterou budeš muset vyřešit, je jak získáš správný booking link. Tento problém je součástí úkolu a chceme vidět tvé řešení.

#### Unhappy Path 1
Nákup produktu, který nelze zakoupit online.
- https://www.booking.com/Share-FY8kPf -> tento objekt nelze platit online

#### Unhappy Path 2
Pokus o rezervaci více pokojů, než je počet dospělých, pro které nakupujeme.

#### Unhappy Path 3
Použití neplatného voucheru při checkoutu - mělo by zobrazit chybovou hlášku.

### Technické požadavky
- Framework: **Playwright** (povinně)
- Testy musí skutečně fungovat proti live produktu (odkazy výše)
- Produkt je veřejný, nepotřebuješ credentials
- Řeš rozdíly mezi variantami (Pluxee platba vs. bez ní) - způsob řešení je na tobě, ale je pro nás důležitý
- Spuštění pouze lokálně (bez CI/CD setup)
- Reporting: stačí Playwright default report
- Kód musí být čitelný a maintainovatelný

### Co odevzdej
1. GitHub repository s funkčním kódem testů
2. README s:
   - Instrukcemi jak spustit
   - Popisem struktury a architektury testů
   - Popisem jak jsi využil AI v procesu tvorby
   - Stručnou reflexí (3-5 vět) - co bys dělal jinak, pokud bys měl víc času

### Hodnotíme
- Kvalitu a strukturu kódu
- Dobrý základ pro budoucí rozšiřitelnost
- Řešení rozdílů mezi variantami produktu
- Schopnost efektivně využít AI
- Praktičnost řešení pro reálné nasazení

---

## Důležité poznámky
- Ptej se, pokud ti cokoliv není jasné
- **1 MD je skutečné maximum** - raději odevzdat méně, ale v limitu
- Očekáváme aktivní využití AI - zajímá nás, jak s ním umíš pracovat
- Pokud tě vybereme, čas ti proplatíme
- **Pokud narazíš na nejasnost:** Udělej rozumné rozhodnutí a zdokumentuj ho v README. Chceme vidět tvůj problem-solving a komunikační schopnosti.
