// OHI Knowledge Base - Bilingual (English/Tamil) Data Layer
// Exposes the static knowledge configurations for direct browser usage.
// Keep in sync with the JSON files in the same directory.

window.OHI_KNOWLEDGE = {
  // Symptom Domains Configuration
  symptom_domains: {
    "domains": [
      {
        "id": "respiratory",
        "name_en": "Respiratory Health",
        "name_ta": "சுவாச ஆரோக்கியம்",
        "description_en": "Screening for issues related to lungs, breathing, and airway irritation from dust and fumes.",
        "description_ta": "தூசி மற்றும் புகையால் ஏற்படும் நுரையீரல், சுவாசம் மற்றும் காற்றுப்பாதை எரிச்சல் தொடர்பான பிரச்சனைகளை கண்டறிதல்.",
        "symptoms": ["cough", "phlegm", "wheeze", "chest_tightness", "breath_difficulty"]
      },
      {
        "id": "musculoskeletal",
        "name_en": "Musculoskeletal Health",
        "name_ta": "தசை மற்றும் எலும்பு ஆரோக்கியம்",
        "description_en": "Screening for body pain, joint stiffness, and physical strain from heavy lifting or standing.",
        "description_ta": "அதிக எடை தூக்குதல் அல்லது நீண்ட நேரம் நிற்பதால் ஏற்படும் உடல் வலி, மூட்டு வலி மற்றும் உடல் ரீதியான அழுத்தத்தை கண்டறிதல்.",
        "symptoms": ["back_pain", "hand_pain", "shoulder_pain", "knee_pain", "standing_pain"]
      },
      {
        "id": "neurological_sensory",
        "name_en": "Neurological & Sensory",
        "name_ta": "நரம்பியல் மற்றும் உணர்வுத்திறன்",
        "description_en": "Screening for nerve compression symptoms like numbness, tingling, and grip weakness.",
        "description_ta": "மரத்துப்போதல், ஊசி குத்துவது போன்ற உணர்வு மற்றும் பிடி பலவீனம் போன்ற நரம்பு அழுத்த அறிகுறிகளை கண்டறிதல்.",
        "symptoms": ["numbness_tingling", "grip_weakness", "hand_pain"]
      },
      {
        "id": "hearing",
        "name_en": "Hearing & Noise Impact",
        "name_ta": "கேள்வித்திறன் மற்றும் சத்தம்",
        "description_en": "Screening for hearing difficulty and ringing in ears (tinnitus) due to loud workplace machinery.",
        "description_ta": "வேலை செய்யும் இடத்தில் அதிக சத்தத்தினால் ஏற்படும் கேட்கும் திறன் குறைபாடு மற்றும் காதில் ஒலித்தல் (டினிடஸ்) போன்றவற்றை கண்டறிதல்.",
        "symptoms": ["hearing_difficulty", "ringing_ears"]
      },
      {
        "id": "vision_eye",
        "name_en": "Vision & Eye Irritation",
        "name_ta": "பார்வை மற்றும் கண் எரிச்சல்",
        "description_en": "Screening for eye burning, watering, or redness from fumes, chemicals, or intense light.",
        "description_ta": "புகை, இரசாயனங்கள் அல்லது கடுமையான வெளிச்சத்தால் ஏற்படும் கண் எரிச்சல், நீர் வடிதல் அல்லது கண் சிவத்தல் போன்றவற்றை கண்டறிதல்.",
        "symptoms": ["eye_burning", "eye_watering", "eye_redness"]
      },
      {
        "id": "skin",
        "name_en": "Skin & Contact Dermatitis",
        "name_ta": "சரும ஆரோக்கியம்",
        "description_en": "Screening for skin rashes, itching, or dryness from handling chemicals or raw materials.",
        "description_ta": "இரசாயனங்கள் அல்லது மூலப்பொருட்களை கையாளுவதால் ஏற்படும் தோல் தடிப்புகள், அரிப்பு அல்லது வறட்சி போன்றவற்றை கண்டறிதல்.",
        "symptoms": ["skin_rash", "skin_itching", "skin_dryness"]
      },
      {
        "id": "heat_fatigue",
        "name_en": "Heat & Fatigue",
        "name_ta": "வெப்பம் மற்றும் சோர்வு",
        "description_en": "Screening for dehydration, heat cramps, and severe exhaustion in hot work environments.",
        "description_ta": "வெப்பமான பணிச்சூழலில் நீரிழப்பு, தசைப்பிடிப்பு மற்றும் கடுமையான சோர்வு ஆகியவற்றை கண்டறிதல்.",
        "symptoms": ["fatigue", "dizziness", "excessive_thirst", "muscle_cramps"]
      },
      {
        "id": "psychosocial_stress",
        "name_en": "Workplace Stress & Wellbeing",
        "name_ta": "வேலை அழுத்தமும் நல்வாழ்வும்",
        "description_en": "Screening for work-related sleep disturbances, anxiety, and general physical fatigue.",
        "description_ta": "வேலை தொடர்பான தூக்கமின்மை, பதற்றம் மற்றும் பொதுவான உடல் சோர்வு ஆகியவற்றை கண்டறிதல்.",
        "symptoms": ["stress", "sleep_disturbance", "headache"]
      }
    ]
  },

  // Occupations Configuration
  occupations: {
    "occupations": [
      {
        "id": "mining_quarry",
        "name_en": "Mining / Quarry",
        "name_ta": "சுரங்கம் / கல் குவாரி",
        "exposures": ["mineral_dust", "noise", "heavy_physical_work"],
        "screening_domains": ["respiratory", "hearing", "musculoskeletal"],
        "physical_workload": "Heavy lifting, standing for long periods, stooping/kneeling, exposure to vibrating tools.",
        "sources": ["NHANES_OCQ_G", "NIOSH_Silicosis_Screening"]
      },
      {
        "id": "construction",
        "name_en": "Construction",
        "name_ta": "கட்டிட வேலை (கட்டுமானம்)",
        "exposures": ["mineral_dust", "noise", "heavy_physical_work"],
        "screening_domains": ["musculoskeletal", "hearing", "respiratory"],
        "physical_workload": "Repetitive lifting, climbing steps, stooping/bending, pushing/pulling heavy objects.",
        "sources": ["NHANES_OCQ_G", "NHANES_PFQ_G"]
      },
      {
        "id": "welding_fabrication",
        "name_en": "Welding / Fabrication",
        "name_ta": "வெல்டிங் மற்றும் மெட்டல் ஃபேப்ரிகேஷன்",
        "exposures": ["other_fumes", "noise", "radiation_eye_strain"],
        "screening_domains": ["respiratory", "vision_eye", "hearing", "musculoskeletal"],
        "physical_workload": "Awkward postures, reaching overhead, holding heavy welding torches, fine gripping.",
        "sources": ["NHANES_OCQ_G", "OSHA_Welding_Fumes"]
      },
      {
        "id": "textile",
        "name_en": "Textile",
        "name_ta": "நெசவு / ஜவுளித் தொழில்",
        "exposures": ["organic_dust", "noise", "repetitive_manual_work"],
        "screening_domains": ["respiratory", "musculoskeletal", "hearing"],
        "physical_workload": "Repetitive manual wrapping, standing for long hours, fine finger grasping, arm pulling.",
        "sources": ["NHANES_OCQ_G", "WHO_Byssinosis_Prevention"]
      },
      {
        "id": "chemical_industrial",
        "name_en": "Chemical / Industrial work",
        "name_ta": "இரசாயன / தொழிற்சாலை வேலை",
        "exposures": ["exhaust_fumes", "other_fumes", "chemical_contact"],
        "screening_domains": ["respiratory", "skin", "vision_eye"],
        "physical_workload": "Handling chemical containers, walking on concrete surfaces, donning full PPE for long hours.",
        "sources": ["NHANES_OCQ_G", "NIOSH_Occupational_Dermatitis"]
      },
      {
        "id": "other",
        "name_en": "Other / General Work",
        "name_ta": "இதர / பொதுவான வேலை",
        "exposures": [],
        "screening_domains": ["general_wellbeing"],
        "physical_workload": "Variable physical demands.",
        "sources": ["NHANES_DEMO_G"]
      }
    ]
  },

  // Exposure Knowledge Configuration
  exposure_knowledge: {
    "exposures": [
      {
        "id": "mineral_dust",
        "name_en": "Mineral Dust",
        "name_ta": "கனிம தூசி",
        "description_en": "Inhalation of stone, silica, sand, brick, concrete or coal dust at worksites.",
        "description_ta": "வேலை செய்யும் இடங்களில் கல், சிலிக்கா, மணல், செங்கல், கான்கிரீட் அல்லது நிலக்கரி தூசியை சுவாசிப்பது.",
        "typical_sources": ["Rock drilling", "stone crushing", "concrete cutting", "mining"],
        "nhanes_variable": "OCQ510",
        "symptoms_to_monitor": ["cough", "phlegm", "breath_difficulty", "wheeze"],
        "risk_reasons_en": ["Exposed to mineral dust (e.g. silica, coal) which is a known risk factor for respiratory issues like silicosis."],
        "risk_reasons_ta": ["சுவாசக் கோளாறுகளை (எ.கா. சிலிகோசிஸ்) ஏற்படுத்தக்கூடிய கனிம தூசிக்கு ஆளாகியுள்ளார்."]
      },
      {
        "id": "organic_dust",
        "name_en": "Organic Dust",
        "name_ta": "கரிம தூசி (இயற்கை தூசி)",
        "description_en": "Inhalation of cotton, grain, wood, flour, or fabric dust.",
        "description_ta": "பруத்தி, தானியம், மரம், மாவு அல்லது துணி தூசியை சுவாசிப்பது.",
        "typical_sources": ["Textile spinning", "woodworking", "grain silo handling", "flour mills"],
        "nhanes_variable": "OCQ530",
        "symptoms_to_monitor": ["cough", "wheeze", "chest_tightness"],
        "risk_reasons_en": ["Exposed to organic dusts (e.g. cotton fibers, wood dust) which can trigger occupational asthma or byssinosis."],
        "risk_reasons_ta": ["பருத்தி இழை அல்லது மரத்தூள் போன்ற கரிம தூசிகளால் ஆஸ்துமா அல்லது பைசினோசிஸ் ஏற்படும் ஆபத்து உள்ளது."]
      },
      {
        "id": "exhaust_fumes",
        "name_en": "Exhaust Fumes",
        "name_ta": "புகை மற்றும் உமிழ்வுகள்",
        "description_en": "Inhalation of diesel exhaust, forklift smoke, or engine fumes in enclosed areas.",
        "description_ta": "மூடிய இடங்களில் டீசல் புகை, போர்க்லிஃப்ட் புகை அல்லது எஞ்சின் புகையை சுவாசிப்பது.",
        "typical_sources": ["Warehouse driving", "loading docks", "heavy machinery operation"],
        "nhanes_variable": "OCQ550",
        "symptoms_to_monitor": ["cough", "dizziness", "eye_burning"],
        "risk_reasons_en": ["Exposed to heavy vehicle/diesel exhaust fumes, which can cause acute airway inflammation."],
        "risk_reasons_ta": ["டீசல் மற்றும் எஞ்சின் புகையால் சுவாசக் குழாய்களில் அலற்சி அல்லது எரிச்சல் ஏற்படலாம்."]
      },
      {
        "id": "other_fumes",
        "name_en": "Chemical & Metal Fumes",
        "name_ta": "இரசாயன மற்றும் உலோகப் புகை",
        "description_en": "Inhalation of welding fumes, solvent vapors, paint spray, or acid mists.",
        "description_ta": "வெல்டிங் புகை, கரைப்பான்கள், பெயிண்ட் ஸ்ப்ரே அல்லது அமில நீராவியை சுவாசிப்பது.",
        "typical_sources": ["Metal welding", "soldering", "spray painting", "chemical mixing"],
        "nhanes_variable": "OCQ570",
        "symptoms_to_monitor": ["cough", "eye_burning", "dizziness", "breath_difficulty"],
        "risk_reasons_en": ["Exposed to toxic chemical vapours or metal welding fumes, which may cause metal fume fever or chronic lung damage."],
        "risk_reasons_ta": ["வெல்டிங் மற்றும் இரசாயன புகைகளால் நுரையீரல் பாதிப்பு அல்லது காய்ச்சல் போன்ற அறிகுறிகள் ஏற்படலாம்."]
      },
      {
        "id": "noise",
        "name_en": "Loud Noise",
        "name_ta": "அதிக சத்தம்",
        "description_en": "Exposure to loud machinery, drills, crushers, or generators without hearing protection.",
        "description_ta": "காது பாதுகாப்பு உபகரணங்கள் இல்லாமல் இயந்திரங்கள், துளையப்பான்கள் அல்லது ஜெனரேட்டர்களின் அதிக சத்தத்திற்கு ஆளாவது.",
        "typical_sources": ["Heavy drill operations", "compressors", "crushing plants", "looms"],
        "nhanes_variable": null,
        "symptoms_to_monitor": ["hearing_difficulty", "ringing_ears"],
        "risk_reasons_en": ["Exposed to high noise levels which can lead to noise-induced hearing loss (NIHL) or tinnitus."],
        "risk_reasons_ta": ["அதிக சத்தத்திற்கு ஆளாகுவதால் கேட்கும் திறன் இழப்பு அல்லது காதில் இரைச்சல் ஏற்படலாம்."]
      },
      {
        "id": "heavy_physical_work",
        "name_en": "Heavy Physical Work",
        "name_ta": "கடினமான உடல் உழைப்பு",
        "description_en": "Lifting heavy materials, continuous stooping, or carrying heavy objects during the shift.",
        "description_ta": "வேலையின் போது கனமான பொருட்களை தூக்குவது, தொடர்ந்து குனிவது அல்லது சுமப்பது.",
        "typical_sources": ["Manual bricklaying", "bag carrying", "shoveling", "scaffolding"],
        "nhanes_variable": "PFQ061E",
        "symptoms_to_monitor": ["back_pain", "shoulder_pain", "knee_pain", "standing_pain"],
        "risk_reasons_en": ["Heavy physical load and frequent lifting can lead to cumulative musculoskeletal disorders (MSDs) and joint wear."],
        "risk_reasons_ta": ["கடினமான உடல் உழைப்பினால் தசைநார் கோளாறுகள் மற்றும் மூட்டு வலி ஏற்பட வாய்ப்புள்ளது."]
      },
      {
        "id": "repetitive_manual_work",
        "name_en": "Repetitive Manual Work",
        "name_ta": "தொடர்ச்சியான ஒரே மாதிரியான வேலை",
        "description_en": "Performing repetitive wrist/hand movements, gripping tools, or pulling levers continuously.",
        "description_ta": "தொடர்ச்சியாக மணிக்கட்டு/கை அசைவுகள், கருவிகளைப் பிடித்தல் அல்லது நெம்புகோல்களை இழுத்தல் போன்ற வேலைகளைச் செய்வது.",
        "typical_sources": ["Textile stitching", "weaving", "assembly line packing", "hand welding"],
        "nhanes_variable": "PFQ061P",
        "symptoms_to_monitor": ["hand_pain", "numbness_tingling", "grip_weakness"],
        "risk_reasons_en": ["Repetitive hand/wrist exertion increases risk for nerve compression syndromes like Carpal Tunnel Syndrome."],
        "risk_reasons_ta": ["தொடர்ச்சியான கை அசைவுகளால் நரம்புகள் அழுத்தப்பட்டு மணிக்கட்டு வலி (கார்பல் டன்னல்) ஏற்படலாம்."]
      }
    ]
  },

  // Sources Configuration
  sources: {
    "sources": [
      {
        "id": "NHANES_DEMO_G",
        "organization": "CDC/NCHS",
        "dataset": "NHANES 2011-2012 Demographics (DEMO_G)",
        "year": "2012",
        "description": "Standard demographic information including age, gender, and language of sample participants.",
        "url": "https://wwwn.cdc.gov/Nchs/Nhanes/2011-2012/DEMO_G.htm"
      },
      {
        "id": "NHANES_OCQ_G",
        "organization": "CDC/NCHS",
        "dataset": "NHANES 2011-2012 Occupational Questionnaire (OCQ_G)",
        "year": "2012",
        "description": "Self-reported occupational exposures to mineral dusts, organic dusts, exhaust fumes, other fumes, and work duration details.",
        "url": "https://wwwn.cdc.gov/Nchs/Nhanes/2011-2012/OCQ_G.htm"
      },
      {
        "id": "NHANES_PFQ_G",
        "organization": "CDC/NCHS",
        "dataset": "NHANES 2011-2012 Physical Functioning (PFQ_G)",
        "year": "2012",
        "description": "Physical functioning limitations, difficulty walking, climbing stairs, stooping, lifting, standing, or grasping objects.",
        "url": "https://wwwn.cdc.gov/Nchs/Nhanes/2011-2012/PFQ_G.htm"
      },
      {
        "id": "NHANES_RDQ_G",
        "organization": "CDC/NCHS",
        "dataset": "NHANES 2011-2012 Respiratory Questionnaire (RDQ_G)",
        "year": "2012",
        "description": "Respiratory symptoms including chronic cough, phlegm production, wheezing episodes, wheezing during exercise, and dry cough at night.",
        "url": "https://wwwn.cdc.gov/Nchs/Nhanes/2011-2012/RDQ_G.htm"
      },
      {
        "id": "NHANES_MCQ_G",
        "organization": "CDC/NCHS",
        "dataset": "NHANES 2011-2012 Medical Conditions (MCQ_G)",
        "year": "2012",
        "description": "Medical condition histories, doctor-diagnosed chronic bronchitis, emphysema, arthritis, or asthma.",
        "url": "https://wwwn.cdc.gov/Nchs/Nhanes/2011-2012/MCQ_G.htm"
      },
      {
        "id": "NIOSH_Silicosis_Screening",
        "organization": "NIOSH",
        "dataset": "Silicosis Medical Monitoring Guidelines",
        "year": "2018",
        "description": "Recommended health screening guidelines for workers exposed to respirable crystalline silica.",
        "url": "https://www.cdc.gov/niosh/topics/silica/"
      },
      {
        "id": "WHO_Byssinosis_Prevention",
        "organization": "WHO/ILO",
        "dataset": "Prevention of Occupational Respiratory Diseases",
        "year": "2013",
        "description": "Guidelines for health surveillance of workers exposed to organic cotton and flax dusts.",
        "url": "https://www.who.int/publications/i/item/9789241505987"
      },
      {
        "id": "OHI_DEMO_SIMULATION",
        "organization": "OHI Platform Development",
        "dataset": "Demo / Simulated Workers Profile Data",
        "year": "2026",
        "description": "SIMULATED worker profile data created purely for demonstration and UI testing purposes.",
        "url": ""
      }
    ]
  },

  // Question Bank Configuration
  question_bank: {
    "questions": [
      {
        "id": "q_emergency_check",
        "domain": "respiratory",
        "text_en": "Are you experiencing severe chest pain, severe difficulty breathing, or coughing up blood?",
        "text_ta": "நெஞ்சு வலி, கடுமையான மூச்சுத்திணறல் அல்லது இருமலில் இரத்தம் வருகிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்", "is_emergency": true},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை", "is_emergency": false}
        ],
        "nhanes_variable": "MCQ040",
        "trigger": "always_first"
      },
      {
        "id": "q_main_symptom",
        "domain": "general_wellbeing",
        "text_en": "What is your main health concern or symptom today?",
        "text_ta": "இன்று உங்களுக்கு உள்ள முக்கிய உடல்நலப் பிரச்சனை அல்லது அறிகுறி என்ன?",
        "options": [
          {"value": "cough", "label_en": "Cough", "label_ta": "இருமல்"},
          {"value": "body_pain", "label_en": "Body/Back Pain", "label_ta": "உடல்/முதுகு வலி"},
          {"value": "hand_pain", "label_en": "Hand/Wrist Pain", "label_ta": "கை/மணிக்கட்டு வலி"},
          {"value": "eye_irritation", "label_en": "Eye Irritation", "label_ta": "கண் எரிச்சல்/நீர் வடிதல்"},
          {"value": "hearing_difficulty", "label_en": "Hearing Difficulty", "label_ta": "கேட்பதில் சிரமம்"},
          {"value": "skin_rash", "label_en": "Skin Rash/Itching", "label_ta": "தோல் அரிப்பு/தடிப்பு"},
          {"value": "fatigue", "label_en": "Extreme Fatigue/Dizziness", "label_ta": "கடுமையான சோர்வு/தலைச்சுற்றல்"},
          {"value": "none", "label_en": "No Symptoms (Just Check-in)", "label_ta": "அறிகுறிகள் ஏதுமில்லை (வழக்கமான பதிவு)"}
        ],
        "nhanes_variable": null,
        "trigger": "initial"
      },
      {
        "id": "q_cough_present",
        "domain": "respiratory",
        "text_en": "Do you have a cough?",
        "text_ta": "உங்களுக்கு இருமல் இருக்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "RDQ031",
        "trigger": "cough_domain"
      },
      {
        "id": "q_cough_work_related",
        "domain": "respiratory",
        "text_en": "Does the cough become worse while you are working?",
        "text_ta": "வேலை செய்யும்போது இருமல் அதிகமாகிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "cough_details"
      },
      {
        "id": "q_cough_after_work",
        "domain": "respiratory",
        "text_en": "Does the cough continue even after leaving the work area?",
        "text_ta": "வேலை செய்யும் இடத்தை விட்டு வெளியேறிய பிறகும் இருமல் தொடர்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "cough_details"
      },
      {
        "id": "q_breath_difficulty",
        "domain": "respiratory",
        "text_en": "Do you experience breathing difficulty or chest tightness?",
        "text_ta": "மூச்சு விடுவதில் கஷ்டம் அல்லது நெஞ்சு இறுக்கம் ஏதேனும் உள்ளதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "RDQ070",
        "trigger": "respiratory_details"
      },
      {
        "id": "q_phlegm_present",
        "domain": "respiratory",
        "text_en": "Do you bring up phlegm (sputum) most days?",
        "text_ta": "பெரும்பாலான நாட்களில் நெஞ்சிலிருந்து சளி வருகிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "RDQ050",
        "trigger": "respiratory_details"
      },
      {
        "id": "q_back_pain_present",
        "domain": "musculoskeletal",
        "text_en": "Do you feel pain in your lower back or shoulders?",
        "text_ta": "உங்களுக்கு கீழ் முதுகு அல்லது தோள்பட்டையில் வலி இருக்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "PFQ059",
        "trigger": "body_pain_domain"
      },
      {
        "id": "q_pain_worse_work",
        "domain": "musculoskeletal",
        "text_en": "Does your body pain get worse while lifting or carrying heavy objects?",
        "text_ta": "கனமான பொருட்களை தூக்கும்போதோ அல்லது வேலை செய்யும்போதோ வலி அதிகமாகிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "PFQ061E",
        "trigger": "musculoskeletal_details"
      },
      {
        "id": "q_pain_improve_rest",
        "domain": "musculoskeletal",
        "text_en": "Does the pain get better when you rest or take days off?",
        "text_ta": "ஓய்வு எடுக்கும்போது அல்லது விடுமுறை நாட்களில் வலி குறைகிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "musculoskeletal_details"
      },
      {
        "id": "q_standing_difficulty",
        "domain": "musculoskeletal",
        "text_en": "Do you find standing for long hours (more than 2 hours) very difficult?",
        "text_ta": "நீண்ட நேரம் (2 மணி நேரத்திற்கு மேல்) நிற்பதில் கடுமையான சிரமம் இருக்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "PFQ061M",
        "trigger": "musculoskeletal_details"
      },
      {
        "id": "q_hand_pain_details",
        "domain": "musculoskeletal",
        "text_en": "Do you feel pain or numbness in your hands, fingers, or wrists?",
        "text_ta": "உங்களுக்கு கைகள், விரல்கள் அல்லது மணிக்கட்டில் வலி அல்லது மரத்துப்போதல் இருக்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "PFQ061P",
        "trigger": "hand_pain_domain"
      },
      {
        "id": "q_numbness_tingling",
        "domain": "neurological_sensory",
        "text_en": "Do you feel a tingling 'pins and needles' feeling or numbness in your fingers?",
        "text_ta": "விரல்களில் மரத்துப்போதல் அல்லது ஊசி குத்துவது போன்ற உணர்வு இருக்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "neurological_details"
      },
      {
        "id": "q_grip_weakness",
        "domain": "neurological_sensory",
        "text_en": "Do you have difficulty holding small tools or feel weakness in your grip?",
        "text_ta": "சிறிய கருவிகளைப் பிடிப்பதில் சிரமம் அல்லது கைகளில் பலவீனம் இருக்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": "PFQ061P",
        "trigger": "neurological_details"
      },
      {
        "id": "q_eye_irritation_details",
        "domain": "vision_eye",
        "text_en": "Are you experiencing eye burning, redness, or watering?",
        "text_ta": "கண்களில் எரிச்சல், நீர் வடிதல் அல்லது கண் சிவந்து போயுள்ளதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "eye_domain"
      },
      {
        "id": "q_hearing_details",
        "domain": "hearing",
        "text_en": "Do you have difficulty hearing conversations in your work environment?",
        "text_ta": "வேலை செய்யும் இடத்தில் மற்றவர்கள் பேசுவதைக் கேட்பதில் சிரமம் உள்ளதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "hearing_domain"
      },
      {
        "id": "q_ringing_ears",
        "domain": "hearing",
        "text_en": "Do you hear a ringing or buzzing sound in your ears (tinnitus)?",
        "text_ta": "காதுகளில் இரைச்சல் அல்லது ரிங் சத்தம் (ரிங்கிங்) கேட்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "hearing_domain"
      },
      {
        "id": "q_skin_details",
        "domain": "skin",
        "text_en": "Do you have itching, red rashes, or dry cracks on your skin?",
        "text_ta": "தோலில் தடிப்புகள், அரிப்பு அல்லது வறண்ட வெடிப்புகள் ஏதேனும் இருக்கிறதா?",
        "options": [
          {"value": "yes", "label_en": "Yes", "label_ta": "ஆமாம்"},
          {"value": "no", "label_en": "No", "label_ta": "இல்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "skin_domain"
      },
      {
        "id": "q_ppe_use",
        "domain": "general_wellbeing",
        "text_en": "Do you regularly use Personal Protective Equipment (PPE) like masks, gloves, or earplugs?",
        "text_ta": "முகமூடி, கையுறைகள் அல்லது காது செருகிகள் போன்ற பாதுகாப்பு உபகரணங்களை (PPE) தொடர்ந்து அணிகிறீர்களா?",
        "options": [
          {"value": "always", "label_en": "Always", "label_ta": "எப்போதும்"},
          {"value": "sometimes", "label_en": "Sometimes", "label_ta": "சில நேரங்களில்"},
          {"value": "never", "label_en": "Never", "label_ta": "அணிவதில்லை"}
        ],
        "nhanes_variable": null,
        "trigger": "general_details"
      }
    ]
  },

  // Branching Rules Configuration
  branching_rules: {
    "rules": [
      {
        "question_id": "q_emergency_check",
        "branches": [
          {"condition": "yes", "next_question": "emergency_terminate"},
          {"condition": "no", "next_question": "q_main_symptom"}
        ]
      },
      {
        "question_id": "q_main_symptom",
        "branches": [
          {"condition": "cough", "next_question": "q_cough_work_related"},
          {"condition": "body_pain", "next_question": "q_back_pain_present"},
          {"condition": "hand_pain", "next_question": "q_hand_pain_details"},
          {"condition": "eye_irritation", "next_question": "q_eye_irritation_details"},
          {"condition": "hearing_difficulty", "next_question": "q_hearing_details"},
          {"condition": "skin_rash", "next_question": "q_skin_details"},
          {"condition": "fatigue", "next_question": "q_ppe_use"},
          {
            "condition": "none",
            "next_question_by_occupation": {
              "mining_quarry": "q_cough_present",
              "construction": "q_back_pain_present",
              "welding_fabrication": "q_eye_irritation_details",
              "textile": "q_cough_present",
              "chemical_industrial": "q_cough_present",
              "default": "q_ppe_use"
            }
          }
        ]
      },
      {
        "question_id": "q_cough_present",
        "branches": [
          {"condition": "yes", "next_question": "q_cough_work_related"},
          {"condition": "sometimes", "next_question": "q_cough_work_related"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_cough_work_related",
        "branches": [
          {"condition": "yes", "next_question": "q_cough_after_work"},
          {"condition": "sometimes", "next_question": "q_cough_after_work"},
          {"condition": "no", "next_question": "q_breath_difficulty"}
        ]
      },
      {
        "question_id": "q_cough_after_work",
        "branches": [
          {"condition": "always", "next_question": "q_breath_difficulty"},
          {"condition": "yes", "next_question": "q_breath_difficulty"},
          {"condition": "sometimes", "next_question": "q_breath_difficulty"},
          {"condition": "no", "next_question": "q_breath_difficulty"}
        ]
      },
      {
        "question_id": "q_breath_difficulty",
        "branches": [
          {"condition": "always", "next_question": "q_phlegm_present"},
          {"condition": "yes", "next_question": "q_phlegm_present"},
          {"condition": "sometimes", "next_question": "q_phlegm_present"},
          {"condition": "no", "next_question": "q_phlegm_present"}
        ]
      },
      {
        "question_id": "q_phlegm_present",
        "branches": [
          {"condition": "always", "next_question": "q_ppe_use"},
          {"condition": "yes", "next_question": "q_ppe_use"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_back_pain_present",
        "branches": [
          {"condition": "yes", "next_question": "q_pain_worse_work"},
          {"condition": "sometimes", "next_question": "q_pain_worse_work"},
          {"condition": "no", "next_question": "q_standing_difficulty"}
        ]
      },
      {
        "question_id": "q_pain_worse_work",
        "branches": [
          {"condition": "always", "next_question": "q_pain_improve_rest"},
          {"condition": "yes", "next_question": "q_pain_improve_rest"},
          {"condition": "sometimes", "next_question": "q_pain_improve_rest"},
          {"condition": "no", "next_question": "q_pain_improve_rest"}
        ]
      },
      {
        "question_id": "q_pain_improve_rest",
        "branches": [
          {"condition": "always", "next_question": "q_standing_difficulty"},
          {"condition": "yes", "next_question": "q_standing_difficulty"},
          {"condition": "no", "next_question": "q_standing_difficulty"}
        ]
      },
      {
        "question_id": "q_standing_difficulty",
        "branches": [
          {"condition": "always", "next_question": "q_ppe_use"},
          {"condition": "yes", "next_question": "q_ppe_use"},
          {"condition": "sometimes", "next_question": "q_ppe_use"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_hand_pain_details",
        "branches": [
          {"condition": "yes", "next_question": "q_numbness_tingling"},
          {"condition": "sometimes", "next_question": "q_numbness_tingling"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_numbness_tingling",
        "branches": [
          {"condition": "yes", "next_question": "q_grip_weakness"},
          {"condition": "no", "next_question": "q_grip_weakness"}
        ]
      },
      {
        "question_id": "q_grip_weakness",
        "branches": [
          {"condition": "always", "next_question": "q_ppe_use"},
          {"condition": "yes", "next_question": "q_ppe_use"},
          {"condition": "sometimes", "next_question": "q_ppe_use"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_eye_irritation_details",
        "branches": [
          {"condition": "always", "next_question": "q_ppe_use"},
          {"condition": "yes", "next_question": "q_ppe_use"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_hearing_details",
        "branches": [
          {"condition": "always", "next_question": "q_ringing_ears"},
          {"condition": "yes", "next_question": "q_ringing_ears"},
          {"condition": "sometimes", "next_question": "q_ringing_ears"},
          {"condition": "no", "next_question": "q_ringing_ears"}
        ]
      },
      {
        "question_id": "q_ringing_ears",
        "branches": [
          {"condition": "always", "next_question": "q_ppe_use"},
          {"condition": "yes", "next_question": "q_ppe_use"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_skin_details",
        "branches": [
          {"condition": "always", "next_question": "q_ppe_use"},
          {"condition": "yes", "next_question": "q_ppe_use"},
          {"condition": "no", "next_question": "q_ppe_use"}
        ]
      },
      {
        "question_id": "q_ppe_use",
        "branches": [
          {"condition": "always", "next_question": "complete_screening"},
          {"condition": "sometimes", "next_question": "complete_screening"},
          {"condition": "never", "next_question": "complete_screening"}
        ]
      }
    ]
  },

  // Risk Scoring Rules Configuration
  risk_rules: {
    "risk_scoring_rules": {
      "base_score": 10,
      "emergency_score": 100,
      "max_score": 100,
      "min_score": 0,
      "thresholds": [
        {
          "max": 34,
          "level": "Low concern",
          "level_ta": "குறைந்த கவலை / சாதாரண நிலை",
          "action_en": "Continue routine safety practices and PPE usage. Keep monitoring your health.",
          "action_ta": "வழக்கமான பாதுகாப்பு நடைமுறைகள் மற்றும் PPE-ஐத் தொடரவும். உடல்நலத்தைக் கண்காணித்து வரவும்."
        },
        {
          "min": 35,
          "max": 54,
          "level": "Needs attention",
          "level_ta": "கவனம் தேவை",
          "action_en": "Review PPE fitting and report any worsening symptoms. Consider a checkup if symptoms persist.",
          "action_ta": "பாதுகாப்பு உபகரணங்களின் பொருத்தத்தை சரிபார்க்கவும். அறிகுறிகள் நீடித்தால் பரிசோதனை செய்யவும்."
        },
        {
          "min": 55,
          "max": 79,
          "level": "Higher concern",
          "level_ta": "அதிக கவலை / தீவிரக் கண்காணிப்பு",
          "action_en": "Please visit the on-site clinic or consult a healthcare professional. Review workplace exposures.",
          "action_ta": "பணிமனை மருத்துவமனை அல்லது மருத்துவரை அணுகவும். வேலை செய்யும் இடத்தில் தூசியைக் குறைக்கவும்."
        },
        {
          "min": 80,
          "level": "Urgent evaluation recommended",
          "level_ta": "உடனடி மருத்துவ ஆலோசனை தேவை",
          "action_en": "Seek immediate professional medical evaluation. Avoid further high-exposure work until checked.",
          "action_ta": "உடனடியாக மருத்துவரை அணுகி சிகிச்சை பெறவும். பரிசோதனை முடியும் வரை தூசியில் வேலை செய்ய வேண்டாம்."
        }
      ],
      "exposure_symptom_overlap_rules": [
        {
          "id": "quarry_dust_cough",
          "occupation": "mining_quarry",
          "symptoms": ["cough", "phlegm", "breath_difficulty"],
          "points": 25,
          "reason_en": "Respiratory symptom reported in a high dust mining/quarry workspace, indicating risk of mineral dust exposure effects.",
          "reason_ta": "குவாரி வேலையில் தூசியின் தாக்கத்தால் சுவாசக் கோளாறுக்கான அறிகுறிகள் கண்டறியப்பட்டுள்ளன."
        },
        {
          "id": "welder_fume_eye",
          "occupation": "welding_fabrication",
          "symptoms": ["eye_burning", "eye_watering", "eye_redness", "eye_irritation"],
          "points": 20,
          "reason_en": "Eye irritation reported by a welder, indicating potential exposure to welding fumes or lack of eye protection.",
          "reason_ta": "வெல்டிங் வேலையில் கண் எரிச்சல் கண்டறியப்பட்டுள்ளது. பாதுகாப்பு கவசம் அணிவதை உறுதி செய்யவும்."
        },
        {
          "id": "construction_lifting_pain",
          "occupation": "construction",
          "symptoms": ["back_pain", "shoulder_pain", "knee_pain", "standing_pain"],
          "points": 20,
          "reason_en": "Body or joint pain reported in heavy physical construction work, raising musculoskeletal strain concern.",
          "reason_ta": "கட்டுமான வேலையில் பளு தூக்குவதால் தசைநார் மற்றும் மூட்டு வலி அழுத்தங்கள் கண்டறியப்பட்டுள்ளன."
        },
        {
          "id": "textile_dust_cough",
          "occupation": "textile",
          "symptoms": ["cough", "wheeze", "chest_tightness"],
          "points": 20,
          "reason_en": "Cough or chest tightness reported in textile work, indicating potential organic dust (byssinosis) exposure risks.",
          "reason_ta": "ஜவுளி மற்றும் நெசவுத் தொழிலில் தூசியால் சுவாசக் கோளாறுக்கான அறிகுறிகள் கண்டறியப்பட்டுள்ளன."
        },
        {
          "id": "textile_manual_pain",
          "occupation": "textile",
          "symptoms": ["hand_pain", "numbness_tingling", "grip_weakness"],
          "points": 15,
          "reason_en": "Repetitive hand/wrist pain in textile assembly work, indicating repetitive strain injury risk.",
          "reason_ta": "தொடர்ச்சியான தையல்/நெசவு வேலையினால் மணிக்கட்டு நரம்பு அழுத்த வலி அறிகுறிகள் கண்டறியப்பட்டுள்ளன."
        },
        {
          "id": "chemical_fume_cough",
          "occupation": "chemical_industrial",
          "symptoms": ["cough", "breath_difficulty", "eye_burning"],
          "points": 20,
          "reason_en": "Cough or burning eyes in chemical industrial work, indicating potential chemical fume inhalation or contact.",
          "reason_ta": "இரசாயனப் புகையினால் கண் எரிச்சல் அல்லது சுவாசக் கோளாறு அறிகுறிகள் கண்டறியப்பட்டுள்ளன."
        }
      ],
      "work_relation_rules": [
        {
          "trigger_question": "q_cough_work_related",
          "answer": "yes",
          "points": 20,
          "reason_en": "Symptoms worsen during work, strongly suggesting workplace environmental triggers.",
          "reason_ta": "வேலை செய்யும்போது அறிகுறிகள் அதிகமாகிறது, இது வேலை செய்யும் இடத்தின் தாக்கத்தை காட்டுகிறது."
        },
        {
          "trigger_question": "q_pain_worse_work",
          "answer": "yes",
          "points": 20,
          "reason_en": "Musculoskeletal pain worsens during physical labor, suggesting work-related strain.",
          "reason_ta": "வேலை செய்யும்போது வலி அதிகமாகிறது, இது உடல் உழைப்பு அழுத்தத்தை காட்டுகிறது."
        },
        {
          "trigger_question": "q_cough_after_work",
          "answer": "yes",
          "points": 10,
          "reason_en": "Symptoms persist after leaving work, which can indicate cumulative or chronic respiratory reaction.",
          "reason_ta": "வேலை முடிந்த பிறகும் இருமல் தொடர்கிறது, இது சுவாசப் பாதையில் நீண்டகால எரிச்சலைக் குறிக்கிறது."
        }
      ],
      "severity_rules": [
        {
          "trigger_question": "q_breath_difficulty",
          "answer": "yes",
          "points": 20,
          "reason_en": "Reporting shortness of breath or chest tightness is a critical screening marker for lung function concern.",
          "reason_ta": "நெஞ்சு இறுக்கம் அல்லது மூச்சுத்திணறல் இருப்பது கண்டறியப்பட்டுள்ளது."
        },
        {
          "trigger_question": "q_numbness_tingling",
          "answer": "yes",
          "points": 15,
          "reason_en": "Nerve compression marker (numbness/tingling) reported in extremities.",
          "reason_ta": "விரல்களில் மரத்துப்போதல் அல்லது நரம்பு அழுத்தத்திற்கான உணர்வு கண்டறியப்பட்டுள்ளது."
        },
        {
          "trigger_question": "q_ringing_ears",
          "answer": "yes",
          "points": 10,
          "reason_en": "Ringing or buzzing in ears (tinnitus) reported, indicating acoustic/noise exposure strain.",
          "reason_ta": "காதுகளில் இரைச்சல் சத்தம் (tinnitus) கேட்கிறது, இது அதிக சத்தத்தின் தாக்கத்தைக் காட்டுகிறது."
        }
      ],
      "ppe_rules": [
        {
          "answer": "never",
          "points": 15,
          "reason_en": "Lack of personal protective equipment (PPE) usage increases susceptibility to exposures.",
          "reason_ta": "பாதுகாப்பு உபகரணங்களை (PPE) அணியாமல் வேலை செய்வது பாதிப்பு அடையும் அபாயத்தை அதிகரிக்கிறது."
        },
        {
          "answer": "sometimes",
          "points": 5,
          "reason_en": "Inconsistent personal protective equipment (PPE) usage leaves periods of unprotected exposure.",
          "reason_ta": "பாதுகாப்பு உபகரணங்களை (PPE) சில நேரங்களில் மட்டுமே அணிவது போதுமான பாதுகாப்பை தராது."
        },
        {
          "answer": "always",
          "points": -10,
          "reason_en": "Consistent PPE use helps mitigate exposure risk, reducing overall screening concern.",
          "reason_ta": "தொடர்ந்து பாதுகாப்பு உபகரணங்களை (PPE) அணிவது பாதிப்பு அடையும் அபாயத்தைக் குறைக்கிறது."
        }
      ]
    }
  }
};
