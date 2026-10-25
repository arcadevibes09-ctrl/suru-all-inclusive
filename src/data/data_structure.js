//one
// 1. CLASS / STRUCTURE A: Semesters 1 & 2 (Core Foundations)
export const foundationSem1_2Structure = {
  sem1: {
    id: 'sem_1',
    title: 'SEMESTER I',
    subtitle: 'Anatomy, Physiology & Psychology',
    badge: 'SEM 1',
    description: 'Human Anatomy, Physiology, Applied Psychology & Sociology.',
    subjects: {
      anatomy_physiology: {
        title: 'Anatomy & Physiology',
        badge: '4',
        subtitle: 'Body Systems & Structure',
        description: 'Cellular biology, musculoskeletal, nervous, and systemic physiology.',
        systems: {
          core_anat: {
            title: 'Core Anatomy & Physiology',
            topics: [
              { id: 'sem1_anat_cell', title: 'Cellular Processes & Tissues' },
              { id: 'sem1_anat_musculo', title: 'Musculoskeletal System' },
              { id: 'sem1_anat_cardio_resp', title: 'Cardiorespiratory Anatomy & Physio' },
              { id: 'sem1_anat_neuro_endo', title: 'Nervous & Endocrine Physiology' }
            ]
          }
        }
      },
      psychology: {
        title: 'Applied Psychology',
        badge: '3',
        subtitle: 'Human Behavior & Mind',
        description: 'Cognitive processes, developmental psychology, and mental hygiene.',
        systems: {
          core_psych: {
            title: 'Foundations of Psychology',
            topics: [
              { id: 'sem1_psych_intro', title: 'Biology of Human Behavior' },
              { id: 'sem1_psych_cognitive', title: 'Perception, Learning & Memory' },
              { id: 'sem1_psych_personality', title: 'Motivation, Emotion & Personality' }
            ]
          }
        }
      },
      nursing_foundation_1: {
        title: 'Nursing Foundation I',
        badge: '3',
        subtitle: 'Basic Nursing Care',
        description: 'Health care concepts, nursing process, vital signs, and patient safety.',
        systems: {
          core_nf1: {
            title: 'Clinical Basics',
            topics: [
              { id: 'sem1_nf_process', title: 'The Nursing Process & Assessment' },
              { id: 'sem1_nf_vitals', title: 'Vital Signs & Clinical Monitoring' },
              { id: 'sem1_nf_comfort', title: 'Patient Comfort, Rest & Hygiene' }
            ]
          }
        }
      }
    }
  },
  sem2: {
    id: 'sem_2',
    title: 'SEMESTER II',
    subtitle: 'Foundations II, Nutrition & Biochem',
    badge: 'SEM 2',
    description: 'Advanced Nursing Foundations, Biochemistry, Nutrition & Health Informatics.',
    subjects: {
      nursing_foundation_2: {
        title: 'Nursing Foundation II',
        badge: '4',
        subtitle: 'Procedures & Diagnostics',
        description: 'Medication administration, wound care, perioperative basics, and first aid.',
        systems: {
          core_nf2: {
            title: 'Clinical Procedures',
            topics: [
              { id: 'sem2_nf_meds', title: 'Drug Administration Principles' },
              { id: 'sem2_nf_oxygen_fluid', title: 'Oxygenation & Fluid Balance' },
              { id: 'sem2_nf_wound_firstaid', title: 'Wound Care & First Aid Basics' },
              { id: 'sem2_nf_perioperative', title: 'Perioperative Nursing Care' }
            ]
          }
        }
      },
      biochem_nutrition: {
        title: 'Biochemistry & Nutrition',
        badge: '3',
        subtitle: 'Metabolism & Dietetics',
        description: 'Biomolecules, enzymes, therapeutic diets, and nutritional assessment.',
        systems: {
          core_bionut: {
            title: 'Metabolism & Clinical Nutrition',
            topics: [
              { id: 'sem2_bio_macros', title: 'Carbohydrate, Lipid & Protein Metabolism' },
              { id: 'sem2_nut_assessment', title: 'Nutritional Assessment & Meal Planning' },
              { id: 'sem2_nut_therapeutic', title: 'Therapeutic Diets & Deficiencies' }
            ]
          }
        }
      }
    }
  }
};

// 2. CLASS / STRUCTURE B: Semesters 3 & 4 (Clinical Medical-Surgical & Pharmacology)
export const clinicalSem3_4Structure = {
  sem3: {
    id: 'sem_3',
    title: 'SEMESTER III',
    subtitle: 'Microbiology, Patho I, Pharm I & AHN I',
    badge: 'SEM 3',
    description: 'Applied Microbiology, Infection Control, Pathology I, Pharmacology I, and Adult Health I.',
    subjects: {
      microbiology_infection: {
        title: 'Microbiology & Safety',
        badge: '7',
        subtitle: 'Microbes & Infection Control',
        description: 'Pathogenic organisms, immunity, HAI prevention, PPE, sterilization, and BMW.',
        systems: {
          applied_micro: {
            title: 'Applied Microbiology',
            topics: [
              { id: 'sem3_micro_intro', title: 'Microbiology Intro & Microbe Growth' },
              { id: 'sem3_micro_pathogens', title: 'Pathogenic Organisms & Culture Techniques' },
              { id: 'sem3_micro_immunity', title: 'Immunity, Hypersensitivity & Immunization' }
            ]
          },
          infection_control: {
            title: 'Infection Control & Safety',
            topics: [
              { id: 'sem3_ic_hai_ppe', title: 'HAI Prevention, Isolation & PPE' },
              { id: 'sem3_ic_sterilization', title: 'Hand Hygiene, Disinfection & Sterilization' },
              { id: 'sem3_ic_bmw_stewardship', title: 'Bio-Medical Waste & Antibiotic Stewardship' },
              { id: 'sem3_ic_ipsg_safety', title: 'Patient Safety (IPSG) & Occupational Health' }
            ]
          }
        }
      },
      pathology_1: {
        title: 'Pathology I',
        badge: '3',
        subtitle: 'Cellular & Systemic Pathology',
        description: 'Cellular adaptation, systemic pathological changes, and hematology lab tests.',
        systems: {
          core_path1: {
            title: 'Core Pathology I',
            topics: [
              { id: 'sem3_path_cellular', title: 'Intro to Pathology & Cellular Processes' },
              { id: 'sem3_path_systemic', title: 'Pathological Changes in Body Systems' },
              { id: 'sem3_path_blood_lab', title: 'Lab Tests for Blood Disorders' }
            ]
          }
        }
      },
      pharmacology_1: {
        title: 'Pharmacology I',
        badge: '6',
        subtitle: 'Systemic Drug Therapy I',
        description: 'Pharmacokinetics, antiseptics, GI, Respiratory, Cardio, Endocrine, and Chemo.',
        systems: {
          intro_gi_resp: {
            title: 'Intro, GI & Resp',
            topics: [
              { id: 'pharm_intro_principles', title: 'Pharmacokinetics & Drug Admin Intro' },
              { id: 'pharm_gastrointestinal', title: 'GI Drugs (Antacids, PPIs, Antiemetics)' },
              { id: 'pharm_respiratory', title: 'Resp. Drugs (Bronchodilators, Mucolytics)' }
            ]
          },
          cardio_endo_chemo: {
            title: 'Cardio, Endo, Skin & ID',
            topics: [
              { id: 'pharm_cardio_blood', title: 'Cardio Drugs & Blood Thinners' },
              { id: 'pharm_endocrine_thyroid', title: 'Endocrine & Diabetes Pharmacology' },
              { id: 'pharm_skin_infections', title: 'Antiseptics, Skin Drugs & Antimicrobials' }
            ]
          }
        }
      },
      adult_health_1: {
        title: 'Adult Health Nursing I',
        badge: '6',
        subtitle: 'Medical-Surgical Nursing I',
        description: 'Intraoperative care, shock, GI, respiratory, cardiovascular, endocrine & musculoskeletal.',
        systems: {
          foundations_surg: {
            title: 'Perioperative & Shock',
            topics: [
              { id: 'sem3_ahn_wound_or', title: 'Wound Care & Intraoperative OR Management' },
              { id: 'sem3_ahn_shock_fluids', title: 'Management of Shock & Fluid-Electrolyte Imbalance' }
            ]
          },
          systemic_ahn1: {
            title: 'Systemic Disorders I',
            topics: [
              { id: 'sem3_ahn_resp_gi', title: 'Respiratory & GI Disorders Management' },
              { id: 'sem3_ahn_cardio_heme', title: 'Cardiovascular & Hematological Nursing' },
              { id: 'sem3_ahn_endo_integ', title: 'Endocrine & Integumentary Disorders' },
              { id: 'sem3_ahn_musculo_comm', title: 'Musculoskeletal & Communicable Diseases' }
            ]
          }
        }
      }
    }
  },
  sem4: {
    id: 'sem_4',
    title: 'SEMESTER IV',
    subtitle: 'Pharm II, AHN II, Patho II & Ethics',
    badge: 'SEM 4',
    description: 'Integrated Clinical Systems (Neuro, Renal, ENT, OBG, Onco), Genetics, Geriatrics & Ethics.',
    subjects: {
      pharmacology_2: {
        title: 'Pharmacology II',
        badge: '6',
        subtitle: 'Neuro, Renal, OBG & Emergency',
        description: 'Analgesics, psychotropics, diuretics, hormones, chemotherapy, and emergency antidotes.',
        systems: {
          cns_drugs: {
            title: 'Neuro & Psych Pharmacology',
            topics: [
              { id: 'pharm_cns_analgesics', title: 'Analgesics (NSAIDs, Opioids) & Anesthetics' },
              { id: 'pharm_cns_psychotropics', title: 'Psychotropics, Anticonvulsants & Mood Stabilizers' },
              { id: 'pharm_neuro_misc', title: 'Stimulants, Neurodegenerative & Antidotes' }
            ]
          },
          renal_repro_onco: {
            title: 'Renal, OBG, Onco & Emergency',
            topics: [
              { id: 'pharm_renal_diuretics', title: 'Diuretics, Antidiuretics & Urinary Antiseptics' },
              { id: 'pharm_repro_hormones', title: 'Reproductive Hormones, Contraceptives & Tocolytics' },
              { id: 'pharm_onco_immuno', title: 'Chemotherapy, Immunosuppressants & CPR Drugs' }
            ]
          }
        }
      },
      adult_health_2: {
        title: 'Adult Health Nursing II',
        badge: '6',
        subtitle: 'Neuro, Renal, ENT, Burns & ICU',
        description: 'Neuroscience, dialysis, eye/ENT care, reproductive disorders, oncology, and emergency triage.',
        systems: {
          neuro_renal_ent: {
            title: 'Neuro, Renal & Sensory',
            topics: [
              { id: 'ahn_neuro_stroke', title: 'Neurological Care: Stroke, GCS, Seizures & Spinal Injury' },
              { id: 'sem4_ahn_renal', title: 'Renal Failure, Hemodialysis, Calculi & BPH Care' },
              { id: 'sem4_ahn_eye_ent', title: 'Ophthalmology (Cataract, Glaucoma) & ENT Disorders' }
            ]
          },
          repro_onco_emerg: {
            title: 'Repro, Oncology & Critical Care',
            topics: [
              { id: 'sem4_ahn_repro', title: 'Reproductive, Breast & Gynecological Disorders' },
              { id: 'sem4_ahn_onco', title: 'Oncology: Chemo, Radiation, Palliative & HIV Care' },
              { id: 'ahn_emerg_triage', title: 'Emergency Triage, Burns, ICU Protocols & Disaster' }
            ]
          }
        }
      },
      foundations_ethics_path2: {
        title: 'Ethics, Genetics & Path II',
        badge: '5',
        subtitle: 'Professionalism & Lab Diagnostics',
        description: 'Genetics, Geriatrics, Clinical Pathology II, Professionalism, Bioethics & Prescribing.',
        systems: {
          genetics_geriatrics: {
            title: 'Genetics & Geriatrics',
            topics: [
              { id: 'found_genetics_basics', title: 'Genetics, Trisomy 21, Teratogens & Counseling' },
              { id: 'found_geriatrics', title: 'Geriatrics, Dementia, Falls & Polypharmacy' }
            ]
          },
          ethics_pathology: {
            title: 'Ethics, Law & Clinical Lab',
            topics: [
              { id: 'found_prof_nursing_roles', title: 'INC/SNC Regulations & Fundamentals of Prescribing' },
              { id: 'found_ethics_end_of_life', title: 'Bioethics, Dilemma & 17-Point Patient Bill of Rights' },
              { id: 'found_path_lab', title: 'Clinical Pathology: CSF, Sputum, Urine & Stool Analysis' }
            ]
          }
        }
      }
    }
  }
};

// 3. CLASS / STRUCTURE C: Semester 5 (Specialty Nursing, Community, Education & Law)
export const specialtySem5Structure = {
  sem5: {
    id: 'sem_5',
    title: 'SEMESTER V',
    subtitle: 'Child, Mental, Community, Forensic & EdTech',
    badge: 'SEM 5',
    description: 'Child Health I, Mental Health I, Community Health I, Forensic Nursing & Educational Tech.',
    subjects: {
      child_health_1: {
        title: 'Child Health Nursing I',
        badge: '6',
        subtitle: 'Pediatrics & Neonatology',
        description: 'Growth & development, ENBC/NRP neonatal care, IMNCI, respiratory/endocrine & PLS.',
        systems: {
          peds_foundations: {
            title: 'Growth, Development & Neonatology',
            topics: [
              { id: 'sem5_chn_intro', title: 'Modern Child Care, Preventive Pediatrics & Pain Scales (FLACC)' },
              { id: 'sem5_chn_growth', title: 'Healthy Child: Growth Theories (Piaget, Erikson) & BFHI' },
              { id: 'sem5_chn_neonate', title: 'Neonate Care: NRP Resuscitation, KMC, LBW & Hyperbilirubinemia' }
            ]
          },
          peds_clinical: {
            title: 'IMNCI, Disorders & Emergencies',
            topics: [
              { id: 'sem5_chn_imnci', title: 'IMNCI Principles & Case Management Strategies' },
              { id: 'sem5_chn_resp_endo', title: 'Pediatric Disorders: TEF, Croup, Asthma & Juvenile Diabetes' },
              { id: 'sem5_chn_emergencies', title: 'Childhood Emergencies: Poisoning, Burns, Drowning & PLS' }
            ]
          }
        }
      },
      mental_health_1: {
        title: 'Mental Health Nursing I',
        badge: '6',
        subtitle: 'Psychiatry & Psychopathology',
        description: 'MSE assessment, therapeutic communication, psychopharmacology, ECT, schizophrenia & mood.',
        systems: {
          psych_foundations: {
            title: 'Assessment, IPR & Modalities',
            topics: [
              { id: 'sem5_mhn_intro', title: 'Mental Health Concepts, ICD-11/DSM-5 & Defense Mechanisms' },
              { id: 'sem5_mhn_mse_ipr', title: 'Mental Status Exam (MSE), Johari Window & Therapeutic IPR' },
              { id: 'sem5_mhn_therapies', title: 'Psychopharmacology, ECT & Psychological Therapies (CBT)' }
            ]
          },
          psych_disorders: {
            title: 'Major Psychiatric Disorders',
            topics: [
              { id: 'sem5_mhn_schizo', title: 'Schizophrenia & Psychotic Disorders Management' },
              { id: 'sem5_mhn_mood', title: 'Mood Disorders: Bipolar Disorder, Mania & Major Depression' },
              { id: 'sem5_mhn_neurotic', title: 'Neurotic & Stress Disorders: OCD, PTSD, Phobias & Somatoform' }
            ]
          }
        }
      },
      community_health_1: {
        title: 'Community Health I',
        badge: '6',
        subtitle: 'Epidemiology, Env Science & Programs',
        description: 'Health care delivery (PHC/CHC/HWC), environmental sanitation, BCC, epidemiology & NHPs.',
        systems: {
          comm_planning_env: {
            title: 'Health Planning, Env & Nutrition',
            topics: [
              { id: 'sem5_comm_concepts', title: 'Public Health, Levels of Prevention & PHC/HWC Delivery' },
              { id: 'sem5_comm_env', title: 'Environmental Sanitation, Safe Water, Pollution & Waste Disposal' },
              { id: 'sem5_comm_nut_bcc', title: 'Community Nutrition, Food-Borne Illness & BCC Health Education' }
            ]
          },
          comm_epi_programs: {
            title: 'Home Visits, Epidemiology & NHP',
            topics: [
              { id: 'sem5_comm_home_epi', title: 'Home Visit Bag Technique, Epidemiological Triad & Outbreak Investigation' },
              { id: 'sem5_comm_communicable', title: 'Communicable Diseases (Vector, TB, HIV) & NTEP/NVBDCP' },
              { id: 'sem5_comm_ncd_school', title: 'Non-Communicable Diseases (NPCDCS) & School Health Services' }
            ]
          }
        }
      },
      forensic_nursing: {
        title: 'Forensic Nursing & Law',
        badge: '5',
        subtitle: 'Evidence Preservation & Indian Law',
        description: 'Forensic science, sexual abuse care, evidence collection, IPC, CrPC, IE Act & POCSO.',
        systems: {
          core_forensic: {
            title: 'Forensic Care & Legal System',
            topics: [
              { id: 'sem5_for_science', title: 'Forensic Science Lab (FSL), Violence & Sexual Abuse Epidemiology' },
              { id: 'sem5_for_roles', title: 'Forensic Nurse Scope, Ethics & INC/SNC Acts' },
              { id: 'sem5_for_evidence', title: 'Forensic Team, Post-Mortem & Biological Evidence Preservation' },
              { id: 'sem5_for_rights', title: 'Indian Constitution: Rights of Victim & Accused, NHRC' },
              { id: 'sem5_for_laws', title: 'Indian Courts (JMFC to Apex), IPC, CrPC, IE Act & POCSO Act' }
            ]
          }
        }
      },
      educational_technology: {
        title: 'Educational Tech (EdTech)',
        badge: '5',
        subtitle: 'Nursing Education & Pedagogy',
        description: 'Learning theories, curriculum planning, microteaching, AV media, OSCE & counseling.',
        systems: {
          core_edtech: {
            title: 'Teaching, Media & Evaluation',
            topics: [
              { id: 'sem5_ed_foundations', title: 'Educational Philosophies, Learning Theories & Blended Learning' },
              { id: 'sem5_ed_curriculum', title: 'Learner Styles (Kolb), Curriculum Design & Lesson Planning' },
              { id: 'sem5_ed_methods', title: 'Teaching Methods: Microteaching, PBL, Simulation & Bedside Clinic' },
              { id: 'sem5_ed_media_eval', title: 'AV Media, E-Learning & Assessment Tools (MCQ, OSCE, Checklist)' },
              { id: 'sem5_ed_guidance', title: 'Guidance vs Counseling, Grievance Redressal & Evidence-Based Teaching' }
            ]
          }
        }
      }
    }
  }
};

// Unified Semester Map combining all 3 classes
export const semesterCatalog = {
  sem_1: foundationSem1_2Structure.sem1,
  sem_2: foundationSem1_2Structure.sem2,
  sem_3: clinicalSem3_4Structure.sem3,
  sem_4: clinicalSem3_4Structure.sem4,
  sem_5: specialtySem5Structure.sem5
};

// Helper: Get all flattened topics for a single subject object
export const getTopicsFromSubject = (subjectObj) => {
  if (!subjectObj || !subjectObj.systems) return [];
  const list = [];
  for (const sysKey in subjectObj.systems) {
    const sys = subjectObj.systems[sysKey];
    sys.topics.forEach((t) => {
      list.push({
        id: t.id,
        title: t.title,
        subtitle: sys.title
      });
    });
  }
  return list;
};

// Helper: Get all topics across an entire semester (useful for Trials/Arena)
export const getAllTopicsForSemester = (semKey) => {
  const sem = semesterCatalog[semKey];
  if (!sem || !sem.subjects) return [];
  const list = [];
  for (const subKey in sem.subjects) {
    const sub = sem.subjects[subKey];
    list.push(...getTopicsFromSubject(sub));
  }
  return list;
};

// Legacy compatibility export so any other file importing `courseStructure` won't break
export const courseStructure = clinicalSem3_4Structure.sem4.subjects;
