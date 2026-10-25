/**
 * Flygplanslista. `name` sparas i databasen och visas i formularet.
 * `wiki` ar Wikipedia-artiklar som provas i ordning tills en har en bild
 * (redirects foljs). Lagg den mest specifika artikeln forst och
 * familjeartikeln sist. Saknas ett plan: lagg till en rad har.
 */
export type AircraftEntry = { name: string; wiki: string[] };

const group = (wiki: string[], names: string[]): AircraftEntry[] =>
  names.map((name) => ({ name, wiki }));

export const AIRCRAFT: AircraftEntry[] = [
  // Airbus
  ...group(["Airbus A220"], ["Airbus A220-100", "Airbus A220-300"]),
  ...group(["Airbus A300"], ["Airbus A300-600"]),
  ...group(["Airbus A310"], ["Airbus A310-300"]),
  ...group(["Airbus A320 family"], ["Airbus A318", "Airbus A319", "Airbus A320ceo", "Airbus A321ceo"]),
  ...group(
    ["Airbus A320neo family", "Airbus A320 family"],
    ["Airbus A319neo", "Airbus A320neo", "Airbus A321neo", "Airbus A321XLR"],
  ),
  ...group(["Airbus A330"], ["Airbus A330-200", "Airbus A330-300"]),
  ...group(["Airbus A330neo", "Airbus A330"], ["Airbus A330-800", "Airbus A330-900"]),
  ...group(["Airbus A340"], ["Airbus A340-200", "Airbus A340-300", "Airbus A340-500", "Airbus A340-600"]),
  ...group(["Airbus A350"], ["Airbus A350-900", "Airbus A350-1000"]),
  ...group(["Airbus A380"], ["Airbus A380-800"]),
  ...group(["Airbus Helicopters H135", "Eurocopter EC135"], ["Airbus H135"]),
  ...group(["Airbus Helicopters H145", "Eurocopter EC145"], ["Airbus H145"]),
  ...group(["Airbus Helicopters H125", "Eurocopter AS350 Écureuil"], ["Airbus H125"]),

  // Boeing
  ...group(["Boeing 717"], ["Boeing 717-200"]),
  ...group(["Boeing 727"], ["Boeing 727-200"]),
  ...group(["Boeing 737-200", "Boeing 737"], ["Boeing 737-200"]),
  ...group(["Boeing 737 Classic"], ["Boeing 737-300", "Boeing 737-400", "Boeing 737-500"]),
  ...group(
    ["Boeing 737 Next Generation"],
    ["Boeing 737-600", "Boeing 737-700", "Boeing 737-800", "Boeing 737-900", "Boeing 737-900ER", "Boeing 737 BBJ"],
  ),
  ...group(["Boeing 737 MAX"], ["Boeing 737 MAX 7", "Boeing 737 MAX 8", "Boeing 737 MAX 9", "Boeing 737 MAX 10"]),
  ...group(["Boeing 747-200", "Boeing 747"], ["Boeing 747-200"]),
  ...group(["Boeing 747-400", "Boeing 747"], ["Boeing 747-400", "Boeing 747-400F"]),
  ...group(["Boeing 747-8", "Boeing 747"], ["Boeing 747-8 Intercontinental", "Boeing 747-8F"]),
  ...group(["Boeing 757"], ["Boeing 757-200", "Boeing 757-300"]),
  ...group(["Boeing 767"], ["Boeing 767-200", "Boeing 767-300ER", "Boeing 767-300F", "Boeing 767-400ER"]),
  ...group(["Boeing 777"], ["Boeing 777-200", "Boeing 777-200ER", "Boeing 777-200LR", "Boeing 777-300", "Boeing 777-300ER", "Boeing 777F"]),
  ...group(["Boeing 777X", "Boeing 777"], ["Boeing 777-8", "Boeing 777-9"]),
  ...group(["Boeing 787 Dreamliner"], ["Boeing 787-8", "Boeing 787-9", "Boeing 787-10"]),
  ...group(["McDonnell Douglas MD-11"], ["McDonnell Douglas MD-11"]),
  ...group(["McDonnell Douglas MD-80"], ["McDonnell Douglas MD-82", "McDonnell Douglas MD-83", "McDonnell Douglas MD-88"]),
  ...group(["McDonnell Douglas DC-10"], ["McDonnell Douglas DC-10"]),
  ...group(["Douglas DC-3"], ["Douglas DC-3"]),
  ...group(["Douglas DC-6"], ["Douglas DC-6"]),
  ...group(["Concorde"], ["Aerospatiale-BAC Concorde"]),

  // Embraer, Bombardier och regionalflyg
  ...group(["Embraer E-Jet family"], ["Embraer E170", "Embraer E175", "Embraer E190", "Embraer E195"]),
  ...group(["Embraer E-Jet E2 family"], ["Embraer E190-E2", "Embraer E195-E2"]),
  ...group(["Embraer ERJ family", "Embraer ERJ 145 family"], ["Embraer ERJ-145"]),
  ...group(["Bombardier CRJ100/200", "Bombardier CRJ200"], ["Bombardier CRJ-200"]),
  ...group(["Bombardier CRJ700 series"], ["Bombardier CRJ-700", "Bombardier CRJ-900", "Bombardier CRJ-1000"]),
  ...group(["ATR 42"], ["ATR 42-600"]),
  ...group(["ATR 72"], ["ATR 72-600"]),
  ...group(["De Havilland Canada Dash 8", "Dash 8"], ["De Havilland Dash 8 Q400"]),
  ...group(["Saab 340"], ["Saab 340B"]),
  ...group(["Fokker 100"], ["Fokker 100"]),
  ...group(["British Aerospace 146"], ["BAe 146", "Avro RJ85"]),
  ...group(["Dornier 328"], ["Dornier 328"]),
  ...group(["Cessna SkyCourier"], ["Cessna 408 SkyCourier"]),

  // Affarsjet
  ...group(["Cessna CitationJet/CJ"], ["Cessna Citation CJ4"]),
  ...group(["Cessna Citation Longitude"], ["Cessna Citation Longitude"]),
  ...group(["Cessna Citation Latitude"], ["Cessna Citation Latitude"]),
  ...group(["Cessna Citation X"], ["Cessna Citation X"]),
  ...group(["Cessna Citation Mustang"], ["Cessna Citation Mustang"]),
  ...group(["Bombardier Challenger 300"], ["Bombardier Challenger 350"]),
  ...group(["Bombardier Global 7500"], ["Bombardier Global 7500"]),
  ...group(["Gulfstream G650"], ["Gulfstream G650"]),
  ...group(["Gulfstream G700"], ["Gulfstream G700"]),
  ...group(["Dassault Falcon 7X"], ["Dassault Falcon 7X"]),
  ...group(["Dassault Falcon 900"], ["Dassault Falcon 900"]),
  ...group(["Pilatus PC-24"], ["Pilatus PC-24"]),
  ...group(["Honda HA-420 HondaJet", "HondaJet"], ["Honda HA-420 HondaJet"]),
  ...group(["Cirrus Vision SF50"], ["Cirrus Vision SF50"]),
  ...group(["Embraer Phenom 100"], ["Embraer Phenom 100"]),
  ...group(["Embraer Phenom 300"], ["Embraer Phenom 300"]),
  ...group(["Learjet 35"], ["Learjet 35"]),
  ...group(["Learjet 45"], ["Learjet 45"]),

  // Turboprop och enmotoriga turbiner
  ...group(["Beechcraft Super King Air"], ["Beechcraft King Air 350i", "Beechcraft King Air C90"]),
  ...group(["Pilatus PC-12"], ["Pilatus PC-12"]),
  ...group(["Pilatus PC-6 Porter"], ["Pilatus PC-6 Porter"]),
  ...group(["Daher TBM"], ["Daher TBM 930", "Daher TBM 940"]),
  ...group(["Quest Kodiak", "Daher Kodiak"], ["Daher Kodiak 100"]),
  ...group(["Cessna 208 Caravan"], ["Cessna 208B Grand Caravan EX"]),

  // Allmanflyg: Cessna
  ...group(["Cessna 150"], ["Cessna 150"]),
  ...group(["Cessna 152"], ["Cessna 152"]),
  ...group(["Cessna 172"], ["Cessna 172 Skyhawk"]),
  ...group(["Cessna 182 Skylane", "Cessna 182"], ["Cessna 182 Skylane"]),
  ...group(["Cessna 206 Stationair", "Cessna 206"], ["Cessna 206 Stationair"]),
  ...group(["Cessna 310"], ["Cessna 310"]),

  // Allmanflyg: Piper, Beechcraft, Cirrus, Diamond, Mooney
  ...group(["Piper PA-28 Cherokee"], ["Piper PA-28 Cherokee", "Piper PA-28 Archer", "Piper PA-28 Warrior"]),
  ...group(["Piper PA-34 Seneca"], ["Piper PA-34 Seneca"]),
  ...group(["Piper PA-44 Seminole"], ["Piper PA-44 Seminole"]),
  ...group(["Piper PA-46"], ["Piper PA-46 Malibu"]),
  ...group(["Piper J-3 Cub"], ["Piper J-3 Cub"]),
  ...group(["Piper PA-18 Super Cub"], ["Piper PA-18 Super Cub"]),
  ...group(["Beechcraft Bonanza"], ["Beechcraft Bonanza G36"]),
  ...group(["Beechcraft Baron"], ["Beechcraft Baron G58"]),
  ...group(["Beechcraft T-6 Texan II"], ["Beechcraft T-6 Texan II"]),
  ...group(["Cirrus SR20"], ["Cirrus SR20"]),
  ...group(["Cirrus SR22"], ["Cirrus SR22"]),
  ...group(["Diamond DA20"], ["Diamond DA20"]),
  ...group(["Diamond DA40 Diamond Star", "Diamond DA40"], ["Diamond DA40 NG", "Diamond DA40 TDI"]),
  ...group(["Diamond DA42 Twin Star", "Diamond DA42"], ["Diamond DA42"]),
  ...group(["Diamond DA62"], ["Diamond DA62"]),
  ...group(["Mooney M20"], ["Mooney M20"]),

  // Akro, sportflyg och lattflyg
  ...group(["Extra EA-300", "Extra 300"], ["Extra 330LT", "Extra 300"]),
  ...group(["Pitts Special"], ["Pitts S-1-S", "Pitts S-2"]),
  ...group(["CAP 232"], ["CAP 232"]),
  ...group(["CAP 10"], ["Mudry CAP 10"]),
  ...group(["Zlín Z 42", "Zlín Z 142"], ["Zlin Z-142", "Zlin Z-242L"]),
  ...group(["Pipistrel Virus"], ["Pipistrel Virus SW 121"]),
  ...group(["Icon A5"], ["Icon A5"]),
  ...group(["Savage Cub"], ["Savage Cub"]),

  // Helikoptrar
  ...group(["Robinson R22"], ["Robinson R22 Beta II"]),
  ...group(["Robinson R44"], ["Robinson R44 Raven II"]),
  ...group(["Bell 407"], ["Bell 407"]),
  ...group(["Bell 206"], ["Bell 206 JetRanger"]),
  ...group(["Guimbal Cabri G2"], ["Guimbal Cabri G2"]),

  // Historiska och militara
  ...group(["Supermarine Spitfire"], ["Supermarine Spitfire"]),
  ...group(["North American P-51 Mustang"], ["North American P-51D Mustang"]),
  ...group(["Boeing F/A-18E/F Super Hornet"], ["Boeing F/A-18E Super Hornet"]),
  ...group(["General Dynamics F-16 Fighting Falcon"], ["General Dynamics F-16C Fighting Falcon"]),
  ...group(["McDonnell Douglas F-15 Eagle"], ["McDonnell Douglas F-15 Eagle"]),
];
