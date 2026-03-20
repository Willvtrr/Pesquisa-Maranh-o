
export type Gender = 'Masculino' | 'Feminino';
export type AgeGroup = '16-24' | '25-34' | '35-44' | '45-59' | '60+';
export type MesoRegion = 'Norte' | 'Sul' | 'Oeste' | 'Leste' | 'Centro' | 'Metrop.';
export type ApprovalStatus = 'Aprova' | 'Desaprova' | 'NS/NR';

export interface SurveyRecord {
  id: number;
  gender: Gender;
  age: AgeGroup;
  region: MesoRegion;
  city: string;
  approval: ApprovalStatus;
  candidate: string;
}

const citiesByRegion: Record<MesoRegion, string[]> = {
  Metrop.: ['São Luís', 'São José de Ribamar', 'Paço do Lumiar', 'Raposa'],
  Norte: ['Rosário', 'Itapecuru Mirim', 'Pinheiro', 'Cururupu', 'Viana'],
  Sul: ['Balsas', 'Carolina', 'Riachão', 'Estreito', 'São Raimundo das Mangabeiras'],
  Oeste: ['Imperatriz', 'Açailândia', 'Grajaú', 'Barra do Corda', 'Buriticupu'],
  Leste: ['Caxias', 'Timon', 'Codó', 'Bacabal', 'Coroatá'],
  Centro: ['Pedreiras', 'Presidente Dutra', 'Colinas', 'São Mateus do Maranhão', 'Barra do Corda'],
};

const candidates = ['Candidato A', 'Candidato B', 'Candidato C', 'Candidato D', 'Branco/Nulo', 'Indeciso'];
const ageGroups: AgeGroup[] = ['16-24', '25-34', '35-44', '45-59', '60+'];
const genders: Gender[] = ['Masculino', 'Feminino'];

export const generateSurveyData = (): SurveyRecord[] => {
  const records: SurveyRecord[] = [];
  const regions: MesoRegion[] = ['Metrop.', 'Norte', 'Sul', 'Oeste', 'Leste', 'Centro'];
  
  for (let i = 1; i <= 1817; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const city = citiesByRegion[region][Math.floor(Math.random() * citiesByRegion[region].length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const age = ageGroups[Math.floor(Math.random() * ageGroups.length)];
    
    let approval: ApprovalStatus = 'NS/NR';
    const rand = Math.random();
    if (rand < 0.55) approval = 'Aprova';
    else if (rand < 0.85) approval = 'Desaprova';

    let candidate = candidates[0];
    const cRand = Math.random();
    if (cRand < 0.35) candidate = candidates[0];
    else if (cRand < 0.60) candidate = candidates[1];
    else if (cRand < 0.75) candidate = candidates[2];
    else if (cRand < 0.85) candidate = candidates[3];
    else if (cRand < 0.95) candidate = candidates[5];
    else candidate = candidates[4];

    records.push({
      id: i,
      gender,
      age,
      region,
      city,
      approval,
      candidate,
    });
  }
  return records;
};

export const RAW_SURVEY_DATA = generateSurveyData();
