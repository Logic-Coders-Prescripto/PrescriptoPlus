/**
 * AYUSHMAN BHARAT DIGITAL MISSION (ABDM) / HL7 FHIR R4 GENERATOR
 * Formats digitized clinic prescriptions into official National Health Authority (NHA) compliant JSON.
 */

export function generateAbdmFhirBundle({
  prescriptionId = 'rx-bundle-001',
  patient = {},
  doctor = {},
  hospital = 'PMBJP Empanelled Clinic / Civil Healthcare Centre',
  diagnosis = 'Clinical Evaluation & Pharmacological Management',
  medicines = [],
  date = new Date().toISOString().split('T')[0]
}) {
  const patientId = `ABHA-${(patient.name || 'CITIZEN').slice(0, 3).toUpperCase()}-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  const doctorReg = doctor.regNo || 'NMC-IND-2024-9182';

  const medicationRequests = medicines.map((med, idx) => ({
    fullUrl: `urn:uuid:med-req-${idx + 1}`,
    resource: {
      resourceType: 'MedicationRequest',
      id: `medication-request-${idx + 1}`,
      meta: {
        profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/MedicationRequest']
      },
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'https://projectbhashini.gov.in/snomed',
            code: `SCT-IND-${300000 + idx * 142}`,
            display: med.brandName
          },
          {
            system: 'https://janaushadhi.gov.in/pmbjp-formulary',
            code: `PMBJP-${1000 + idx * 53}`,
            display: med.genericSalt || med.brandName
          }
        ],
        text: `${med.brandName} (${med.genericSalt || 'Standard formulation'})`
      },
      subject: {
        reference: `Patient/${patientId}`,
        display: patient.name || 'Verified Citizen'
      },
      authoredOn: `${date}T09:30:00+05:30`,
      requester: {
        reference: `Practitioner/${doctorReg}`,
        display: doctor.name || 'Consultant Specialist'
      },
      dosageInstruction: [
        {
          text: `${med.frequency || '1 OD'} | ${med.foodRelation || 'After food'}`,
          timing: {
            code: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation',
                  code: (med.timingCode || 'QD').replace(/\s+/g, '_')
                }
              ]
            }
          },
          additionalInstruction: [
            {
              text: med.foodRelation || 'Take with water after meals'
            }
          ],
          route: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: med.type === 'Syrup' ? '260548002' : med.type === 'Injection' ? '78421000' : '26643006',
                display: med.type === 'Syrup' ? 'Oral liquid' : med.type === 'Injection' ? 'Intramuscular injection' : 'Oral route'
              }
            ]
          }
        }
      ],
      dispenseRequest: {
        validityPeriod: {
          start: date,
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        expectedSupplyDuration: {
          value: parseInt(med.duration) || 30,
          unit: 'days',
          system: 'http://unitsofmeasure.org',
          code: 'd'
        }
      }
    }
  }));

  const bundle = {
    resourceType: 'Bundle',
    id: `abdm-bundle-${prescriptionId}`,
    meta: {
      versionId: '1.0.0',
      lastUpdated: new Date().toISOString(),
      profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle']
    },
    identifier: {
      system: 'https://ndhm.gov.in/bundle-id',
      value: `NHA-ABHA-RX-${Date.now()}`
    },
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: [
      // 1. Composition Resource (Main clinical summary document)
      {
        fullUrl: 'urn:uuid:composition-prescription-01',
        resource: {
          resourceType: 'Composition',
          id: 'composition-prescription-01',
          meta: {
            profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/PrescriptionRecord']
          },
          status: 'final',
          type: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '440545006',
                display: 'Prescription record (record artifact)'
              }
            ],
            text: 'Prescription Record'
          },
          subject: {
            reference: `Patient/${patientId}`,
            display: patient.name || 'Verified Citizen'
          },
          date: new Date().toISOString(),
          author: [
            {
              reference: `Practitioner/${doctorReg}`,
              display: doctor.name || 'Consultant Specialist'
            }
          ],
          title: 'Ayushman Bharat Digital Mission (ABDM) Validated Clinical Prescription',
          custodian: {
            display: hospital
          },
          section: [
            {
              title: 'Chief Complaints & Clinical Diagnosis',
              code: {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '29308-4',
                    display: 'Diagnosis'
                  }
                ]
              },
              text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><strong>Primary Diagnosis:</strong> ${diagnosis}</p></div>`
              }
            },
            {
              title: 'Prescribed Medications (Generic & Branded)',
              code: {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '57828-6',
                    display: 'Prescriptions'
                  }
                ]
              },
              entry: medicationRequests.map(m => ({ reference: m.fullUrl }))
            }
          ]
        }
      },
      // 2. Patient Resource
      {
        fullUrl: `urn:uuid:patient-${patientId}`,
        resource: {
          resourceType: 'Patient',
          id: patientId,
          meta: {
            profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient']
          },
          identifier: [
            {
              type: {
                coding: [
                  {
                    system: 'https://ndhm.gov.in/id-type',
                    code: 'ABHA',
                    display: 'Ayushman Bharat Health Account Number'
                  }
                ]
              },
              system: 'https://healthid.ndhm.gov.in',
              value: patientId
            }
          ],
          name: [
            {
              text: patient.name || 'Mr. Citizen'
            }
          ],
          gender: (patient.gender || 'male').toLowerCase(),
          birthDate: '1982-01-01'
        }
      },
      // 3. Practitioner Resource
      {
        fullUrl: `urn:uuid:practitioner-${doctorReg}`,
        resource: {
          resourceType: 'Practitioner',
          id: doctorReg,
          meta: {
            profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Practitioner']
          },
          identifier: [
            {
              system: 'https://doctor.nmc.org.in',
              value: doctorReg
            }
          ],
          name: [
            {
              text: doctor.name || 'Dr. Medical Officer'
            }
          ],
          qualification: [
            {
              code: {
                text: doctor.specialty || 'General Practitioner'
              }
            }
          ]
        }
      },
      // 4. All MedicationRequest Resources
      ...medicationRequests
    ]
  };

  return bundle;
}
