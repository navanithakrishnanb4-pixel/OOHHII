# OHI Evidence Dataset

Derived from public CDC/NCHS NHANES 2011-2012 files: OCQ_G, PFQ_G, RDQ_G, MCQ_G and DEMO_G.

Purpose: evidence/reference data for OHI occupational-health intelligence. It is NOT a clinically validated risk-score training set and must not be used to claim diagnosis or accuracy.

Processing: datasets were joined on NHANES SEQN, then SEQN was removed. Only OHI-relevant variables were retained. Refused/dont-know/special numeric codes and missingness remain and must be interpreted with the official codebooks; NHANES uses age-specific eligibility and skip patterns.

Files: ohi_evidence_subset.csv, ohi_variable_dictionary.csv, ohi_dataset_profile.json.

Official sources: CDC/NCHS NHANES 2011-2012 OCQ_G, PFQ_G, RDQ_G, MCQ_G and DEMO_G documentation.
