# Workouttrackerfrontend

Detta är frontenden till ett workouttracker projekt. 

I workouttracker så kan man som registrerad och inloggad användare skapa träningspass, dessa träningspass kan man sedan genomföra själv eller med andra. Det finns även möjlighet att köpa premium workoutpass via vår Stripeintegration (Mockat kort: 424242424242424242 och resten strunt samma så länge giltiga inputs). 

Vi har även en hjälpsam AI-chatbot som kan hjälpa er med att konstruera ett träningspass som passar era behov och önskemål. 

Appen kan köras lokalt givet att man också kör mot lokal backend eller mot deployad backend. 

Appen finns även deployad, länk till deployad/online version finns ängst ner i denna readme.

Appen har byggts genom flera angular komponenter genererade genom angular cli och kommandot ng g c, har sedan byggt upp drygt en komponent per sida och vissa gränsöverskridande komponenter (header och footer).

# Techstack:

- TypeScript
- Angular
- Tailwind
- Websocket
- Stripe 

# Start

Appen startas lokalt genom två steg:

    npm install (detta installerar allting som är i projektet baserat på package.json).
    ng serve (detta startar appen lokalt på localhost:4200).

För att appen ska fungera behöver du köra backenden först, instruktioner för att göra detta finns i backend repot. 

Backend repo: https://github.com/YLudvig/Workouttracker

Deployad sida: https://sea-lion-app-9hnsk.ondigitalocean.app/
