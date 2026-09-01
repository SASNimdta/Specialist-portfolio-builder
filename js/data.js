const APP_DATA = {
  "domains": [
    {
      "id": 1,
      "name": "Domain 1",
      "criteria": [
        "1.1",
        "1.2",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "1.8",
        "1.9",
        "1.10",
        "1.11"
      ]
    },
    {
      "id": 2,
      "name": "Domain 2",
      "criteria": [
        "2.1",
        "2.2",
        "2.3",
        "2.4",
        "2.5",
        "2.6",
        "2.7"
      ]
    },
    {
      "id": 3,
      "name": "Domain 3",
      "criteria": [
        "3.1",
        "3.2",
        "3.3",
        "3.4",
        "3.5",
        "3.6",
        "3.7",
        "3.8",
        "3.9",
        "3.10",
        "3.11"
      ]
    },
    {
      "id": 4,
      "name": "Domain 4",
      "criteria": [
        "4.1",
        "4.2"
      ]
    },
    {
      "id": 5,
      "name": "Domain 5",
      "criteria": [
        "5.1",
        "5.2",
        "5.3",
        "5.4",
        "5.5",
        "5.6",
        "5.7",
        "5.8"
      ]
    },
    {
      "id": 6,
      "name": "Domain 6",
      "criteria": [
        "6.1",
        "6.2",
        "6.3",
        "6.4",
        "6.5"
      ]
    }
  ],
  "criteria": [
    {
      "code": "1.1",
      "domain": 1,
      "description": "Practises with the professional values and behaviours expected of all doctors as set out in GMC Good Medical Practice and the Generic Professional Capabilities Framework (or equivalent for dentists).",
      "minimumRequirements": [
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        },
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        },
        {
          "id": "mandatory",
          "label": "Mandatory training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Mandatory training"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "1.2",
      "domain": 1,
      "description": "Demonstrates the underpinning subject-specific competences i.e. knowledge, skills and behaviours relevant to the role setting and scope.",
      "minimumRequirements": [
        {
          "id": "jobplan",
          "label": "Scope of Practice / Job Plan",
          "types": [
            "Scope of Practice / Job Plan"
          ]
        },
        {
          "id": "logbook",
          "label": "Logbook",
          "types": [
            "Logbook"
          ]
        },
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "reference",
          "label": "Reference",
          "types": [
            "Reference"
          ]
        },
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        },
        {
          "id": "course",
          "label": "Accredited or relevant course",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Accredited or relevant course"
          ]
        },
        {
          "id": "cpd",
          "label": "CPD Diary",
          "types": [
            "CPD Diary"
          ]
        },
        {
          "id": "qualification",
          "label": "Qualification",
          "types": [
            "Qualification"
          ]
        }
      ]
    },
    {
      "code": "1.3",
      "domain": 1,
      "description": "Clinically evaluates and manages a patient, formulating a prioritised differential diagnosis, initiating an appropriate management plan, and reviewing and adjusting this depending on the outcomes of treatment.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        },
        {
          "id": "reference",
          "label": "Reference",
          "types": [
            "Reference"
          ]
        },
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        }
      ]
    },
    {
      "code": "1.4",
      "domain": 1,
      "description": "Manages the difficulties of dealing with complexity and uncertainty in the care of patients; employing expertise and clinical decision-making skills of a senior and independent/autonomous practitioner.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        },
        {
          "id": "reference",
          "label": "Reference",
          "types": [
            "Reference"
          ]
        },
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        }
      ]
    },
    {
      "code": "1.5",
      "domain": 1,
      "description": "Critically reflects on own competence, understands own limits, and seeks help when required.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        },
        {
          "id": "reference",
          "label": "Reference",
          "types": [
            "Reference"
          ]
        },
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        }
      ]
    },
    {
      "code": "1.6",
      "domain": 1,
      "description": "Communicates effectively and is able to share decision-making with patients, relatives and carers; treats patients as individuals, promoting a person-centred approach to their care, including self-management.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        },
        {
          "id": "reference",
          "label": "Reference",
          "types": [
            "Reference"
          ]
        },
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        }
      ]
    },
    {
      "code": "1.7",
      "domain": 1,
      "description": "Respects patients' dignity, ensures confidentiality and appropriate communication where potentially difficult or where barriers exist.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        },
        {
          "id": "reference",
          "label": "Reference",
          "types": [
            "Reference"
          ]
        },
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        },
        {
          "id": "edi",
          "label": "EDI training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "EDI training"
          ]
        },
        {
          "id": "bias",
          "label": "Unconscious bias training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Unconscious bias training"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "1.8",
      "domain": 1,
      "description": "Demonstrates key generic clinical skills around consent, humane interventions, safe prescribing and safe use of medical devices.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        },
        {
          "id": "reference",
          "label": "Reference",
          "types": [
            "Reference"
          ]
        },
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "appraisal",
          "label": "Appraisal",
          "types": [
            "Appraisal"
          ]
        },
        {
          "id": "course",
          "label": "Relevant course",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Accredited or relevant course",
            "Other relevant learning"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "1.9",
      "domain": 1,
      "description": "Adheres to professional requirements, participating in annual appraisal, job planning and reviews of performance and progression.",
      "minimumRequirements": [
        {
          "id": "objectives",
          "label": "Appraisal showing completed objectives",
          "types": [
            "Appraisal"
          ],
          "appraisalObjectivesCompleted": true
        }
      ]
    },
    {
      "code": "1.10",
      "domain": 1,
      "description": "Awareness of legal responsibilities relevant to the role, including mental capacity, deprivation of liberty, data protection, equality and diversity.",
      "minimumRequirements": [
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        },
        {
          "id": "learning",
          "label": "Learning, course or qualification",
          "types": [
            "Course / Learning / Training",
            "Qualification"
          ]
        }
      ]
    },
    {
      "code": "1.11",
      "domain": 1,
      "description": "Applies basic principles of public health relevant to the specialty.",
      "minimumRequirements": [
        {
          "id": "jobplan",
          "label": "Scope of Practice / Job Plan",
          "types": [
            "Scope of Practice / Job Plan"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "2.1",
      "domain": 2,
      "description": "Awareness of leadership responsibilities and demonstrates appropriate leadership behaviour in unfamiliar, complex or unpredictable situations.",
      "minimumRequirements": [
        {
          "id": "change",
          "label": "Initiative that effected change",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Initiative that effected change"
          ]
        },
        {
          "id": "collab",
          "label": "Collaborative leadership work",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Collaborative leadership work"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "2.2",
      "domain": 2,
      "description": "Demonstrates understanding of leadership principles, approaches and techniques and adapts leadership behaviours to improve engagement and outcomes.",
      "minimumRequirements": [
        {
          "id": "leadcourse",
          "label": "Leadership training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Leadership training"
          ]
        },
        {
          "id": "leadership",
          "label": "Effective leadership",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Effective leadership"
          ]
        }
      ]
    },
    {
      "code": "2.3",
      "domain": 2,
      "description": "Develops effective relationships across teams and promotes multidisciplinary and interprofessional team working.",
      "minimumRequirements": [
        {
          "id": "mdt",
          "label": "MDT Evidence",
          "types": [
            "MDT Evidence"
          ]
        },
        {
          "id": "teamwork",
          "label": "Teamwork",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Teamwork"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "2.4",
      "domain": 2,
      "description": "Critically reflects on decision-making processes and explains decisions honestly and transparently.",
      "minimumRequirements": [
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "2.5",
      "domain": 2,
      "description": "Critically appraises performance of self, colleagues, peers and systems to enhance performance and support development.",
      "minimumRequirements": [
        {
          "id": "success",
          "label": "Successful situation",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Success"
          ]
        }
      ]
    },
    {
      "code": "2.6",
      "domain": 2,
      "description": "Demonstrates ability to challenge others, escalating concerns when necessary.",
      "minimumRequirements": [
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "2.7",
      "domain": 2,
      "description": "Develops practice in response to changing population health need and horizon scans for future developments.",
      "minimumRequirements": [
        {
          "id": "logbook",
          "label": "Logbook",
          "types": [
            "Logbook"
          ]
        },
        {
          "id": "outcome",
          "label": "Outcome data or audit",
          "types": [
            "Outcome Data",
            "Audit"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "3.1",
      "domain": 3,
      "description": "Takes prompt action where there is an issue with safety or quality of patient care and raises and escalates concerns through clinical governance systems.",
      "minimumRequirements": [
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "3.2",
      "domain": 3,
      "description": "Applies basic human factors principles and practice at individual, team, organisation and system levels.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        },
        {
          "id": "human",
          "label": "Human Factors training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Human Factors training"
          ]
        }
      ]
    },
    {
      "code": "3.3",
      "domain": 3,
      "description": "Collaborates with multidisciplinary and interprofessional teams to manage risk and issues across organisations and settings.",
      "minimumRequirements": [
        {
          "id": "involve",
          "label": "Example of involvement",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Involvement"
          ]
        },
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "3.4",
      "domain": 3,
      "description": "Advocates for and contributes to organisational learning.",
      "minimumRequirements": [
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "3.5",
      "domain": 3,
      "description": "Seeks feedback and involvement from individuals, families, carers, communities and colleagues in safety and quality service improvement reviews.",
      "minimumRequirements": [
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        }
      ]
    },
    {
      "code": "3.6",
      "domain": 3,
      "description": "Leads new practice and service redesign in response to feedback, evaluation and need, promoting best practice.",
      "minimumRequirements": [
        {
          "id": "success",
          "label": "Example of success",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Success"
          ]
        }
      ]
    },
    {
      "code": "3.7",
      "domain": 3,
      "description": "Evaluates and audits own and others' clinical practice and acts on the findings.",
      "minimumRequirements": [
        {
          "id": "change",
          "label": "Successful change",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Successful change"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "3.8",
      "domain": 3,
      "description": "Reflects on personal behaviour and practice, responding to learning opportunities.",
      "minimumRequirements": [
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "3.9",
      "domain": 3,
      "description": "Implements quality improvement methods and repeats quality improvement cycles to refine practice, designing projects and evaluating impact.",
      "minimumRequirements": [
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "qi",
          "label": "Quality Improvement Project",
          "types": [
            "Quality Improvement Project"
          ]
        },
        {
          "id": "qitraining",
          "label": "Quality Improvement training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Quality Improvement training"
          ]
        }
      ]
    },
    {
      "code": "3.10",
      "domain": 3,
      "description": "Critically appraises and synthesises outcomes of audit, inquiries, critical incidents or complaints and implements appropriate changes.",
      "minimumRequirements": [
        {
          "id": "involve",
          "label": "Example of involvement",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Involvement"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "3.11",
      "domain": 3,
      "description": "Engages with relevant stakeholders to develop and implement robust governance systems and systematic documentation processes.",
      "minimumRequirements": [
        {
          "id": "involve",
          "label": "Example of involvement",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Involvement"
          ]
        },
        {
          "id": "msf",
          "label": "Multisource Feedback",
          "types": [
            "Multisource Feedback"
          ]
        }
      ]
    },
    {
      "code": "4.1",
      "domain": 4,
      "description": "Recognises and takes responsibility for safeguarding children, young people and adults.",
      "minimumRequirements": [
        {
          "id": "safe",
          "label": "Safeguarding training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "Safeguarding training"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "4.2",
      "domain": 4,
      "description": "Applies appropriate equality and diversity legislation, including disability discrimination requirements, in patient care.",
      "minimumRequirements": [
        {
          "id": "edi",
          "label": "EDI training",
          "types": [
            "Course / Learning / Training"
          ],
          "subtypes": [
            "EDI training"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "5.1",
      "domain": 5,
      "description": "Critically assesses own learning needs and ensures a personal development plan reflects clinical practice and relevant generic capabilities.",
      "minimumRequirements": [
        {
          "id": "audit",
          "label": "Audit",
          "types": [
            "Audit"
          ]
        },
        {
          "id": "success",
          "label": "Example of success",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Success"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "5.2",
      "domain": 5,
      "description": "Promotes and participates in individual and team learning and supports educational needs across professional groups.",
      "minimumRequirements": [
        {
          "id": "teach",
          "label": "Teaching or training evidence",
          "types": [
            "Teaching / Training Evidence"
          ],
          "subtypes": [
            "Teaching students",
            "Teaching doctors or dentists in training",
            "Teaching allied health professionals",
            "Team or multidisciplinary learning"
          ]
        },
        {
          "id": "involve",
          "label": "Example of involvement",
          "types": [
            "Workplace Example"
          ],
          "subtypes": [
            "Involvement"
          ]
        },
        {
          "id": "outcome",
          "label": "Outcome data or audit",
          "types": [
            "Outcome Data",
            "Audit"
          ]
        }
      ]
    },
    {
      "code": "5.3",
      "domain": 5,
      "description": "Identifies and creates safe and supportive working and learning environments.",
      "minimumRequirements": [
        {
          "id": "guideline",
          "label": "Guideline awareness",
          "types": [
            "Guideline Evidence"
          ],
          "subtypes": [
            "Guideline awareness"
          ]
        }
      ]
    },
    {
      "code": "5.4",
      "domain": 5,
      "description": "Can act as a role model, educator, supervisor, coach or mentor for medical and non-medical practitioners.",
      "minimumRequirements": [
        {
          "id": "role",
          "label": "Role model, educator, supervisor, coach or mentor",
          "types": [
            "Teaching / Training Evidence"
          ],
          "subtypes": [
            "Role-model activity",
            "Supervision",
            "Coaching or mentoring",
            "Teaching experience"
          ]
        }
      ]
    },
    {
      "code": "5.5",
      "domain": 5,
      "description": "Creates effective learning opportunities and provides developmental feedback to learners and doctors or dentists in training.",
      "minimumRequirements": [
        {
          "id": "success",
          "label": "Teaching success",
          "types": [
            "Teaching / Training Evidence"
          ],
          "subtypes": [
            "Teaching success"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "5.6",
      "domain": 5,
      "description": "Plans and provides effective teaching and training activities as required by the role.",
      "minimumRequirements": [
        {
          "id": "experience",
          "label": "Teaching experience",
          "types": [
            "Teaching / Training Evidence"
          ],
          "subtypes": [
            "Teaching experience"
          ]
        }
      ]
    },
    {
      "code": "5.7",
      "domain": 5,
      "description": "Understands how to raise concerns about the behaviour or performance of a learner under clinical supervision.",
      "minimumRequirements": [
        {
          "id": "intervention",
          "label": "Successful learner intervention",
          "types": [
            "Teaching / Training Evidence"
          ],
          "subtypes": [
            "Successful learner intervention"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "5.8",
      "domain": 5,
      "description": "Takes part in patient education.",
      "minimumRequirements": [
        {
          "id": "patientedu",
          "label": "Patient education",
          "types": [
            "Teaching / Training Evidence"
          ],
          "subtypes": [
            "Patient education"
          ]
        },
        {
          "id": "patient",
          "label": "Patient Feedback",
          "types": [
            "Patient Feedback"
          ]
        }
      ]
    },
    {
      "code": "6.1",
      "domain": 6,
      "description": "Keeps up to date with current research and best practice through CPD, independent study and reflection.",
      "minimumRequirements": [
        {
          "id": "cpd",
          "label": "CPD Diary",
          "types": [
            "CPD Diary"
          ]
        }
      ]
    },
    {
      "code": "6.2",
      "domain": 6,
      "description": "Critically appraises literature, conducts searches and reviews, and disseminates best practice including from quality improvement projects.",
      "minimumRequirements": [
        {
          "id": "research",
          "label": "Research training or NIHR recruitment",
          "types": [
            "Course / Learning / Training",
            "Research Activity"
          ],
          "subtypes": [
            "Research training",
            "NIHR study recruitment"
          ]
        },
        {
          "id": "abstract",
          "label": "Conference presentation or abstract",
          "types": [
            "Presentation / Publication"
          ],
          "subtypes": [
            "Conference presentation",
            "Conference abstract"
          ]
        },
        {
          "id": "peer",
          "label": "Peer Review Activity",
          "types": [
            "Peer Review Activity"
          ]
        },
        {
          "id": "publication",
          "label": "Publication or guideline development",
          "types": [
            "Presentation / Publication",
            "Guideline Evidence"
          ],
          "subtypes": [
            "Publication",
            "Guideline development"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "6.3",
      "domain": 6,
      "description": "Locates and uses clinical guidelines appropriately.",
      "minimumRequirements": [
        {
          "id": "guidelines",
          "label": "Use of guidelines in clinical practice",
          "types": [
            "Guideline Evidence"
          ],
          "subtypes": [
            "Use in clinical practice"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    },
    {
      "code": "6.4",
      "domain": 6,
      "description": "Communicates and interprets research evidence meaningfully for patients to support shared decision-making.",
      "minimumRequirements": [
        {
          "id": "change",
          "label": "Implementation of evidence-based change",
          "types": [
            "Guideline Evidence",
            "Workplace Example"
          ],
          "subtypes": [
            "Implementation of evidence-based change",
            "Evidence-based change"
          ]
        }
      ]
    },
    {
      "code": "6.5",
      "domain": 6,
      "description": "Works towards identifying research needs and gaps in knowledge, networking within and outside the organisation.",
      "minimumRequirements": [
        {
          "id": "research",
          "label": "Research Activity",
          "types": [
            "Research Activity"
          ]
        },
        {
          "id": "interview",
          "label": "Interview",
          "types": [
            "Interview"
          ]
        }
      ]
    }
  ],
  "evidenceTypes": [
    {
      "id": "Appraisal",
      "order": 1,
      "secondaryOptions": [],
      "suggestedDomains": [
        1
      ],
      "suggestedCriteria": [
        "1.1",
        "1.2",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "1.8",
        "1.9"
      ]
    },
    {
      "id": "Scope of Practice / Job Plan",
      "order": 2,
      "secondaryOptions": [],
      "suggestedDomains": [
        1
      ],
      "suggestedCriteria": [
        "1.2",
        "1.11"
      ]
    },
    {
      "id": "Logbook",
      "order": 3,
      "secondaryOptions": [],
      "suggestedDomains": [
        1,
        2
      ],
      "suggestedCriteria": [
        "1.2",
        "2.7"
      ]
    },
    {
      "id": "Audit",
      "order": 4,
      "secondaryOptions": [],
      "suggestedDomains": [
        1,
        2,
        3,
        5
      ],
      "suggestedCriteria": [
        "1.2",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "1.8",
        "2.7",
        "3.9",
        "5.1",
        "5.2"
      ]
    },
    {
      "id": "Quality Improvement Project",
      "order": 5,
      "secondaryOptions": [],
      "suggestedDomains": [
        3
      ],
      "suggestedCriteria": [
        "3.9"
      ]
    },
    {
      "id": "Outcome Data",
      "order": 6,
      "secondaryOptions": [],
      "suggestedDomains": [
        2,
        5
      ],
      "suggestedCriteria": [
        "2.7",
        "5.2"
      ]
    },
    {
      "id": "Multisource Feedback",
      "order": 7,
      "secondaryOptions": [],
      "suggestedDomains": [
        1,
        3
      ],
      "suggestedCriteria": [
        "1.1",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "1.8",
        "3.2",
        "3.3",
        "3.5",
        "3.11"
      ]
    },
    {
      "id": "Patient Feedback",
      "order": 8,
      "secondaryOptions": [],
      "suggestedDomains": [
        1,
        3,
        5
      ],
      "suggestedCriteria": [
        "1.1",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "1.8",
        "3.5",
        "5.8"
      ]
    },
    {
      "id": "Reference",
      "order": 9,
      "secondaryOptions": [],
      "suggestedDomains": [
        1
      ],
      "suggestedCriteria": [
        "1.2",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "1.8"
      ]
    },
    {
      "id": "Interview",
      "order": 10,
      "secondaryOptions": [],
      "suggestedDomains": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "suggestedCriteria": [
        "1.1",
        "1.7",
        "1.8",
        "1.10",
        "1.11",
        "2.1",
        "2.3",
        "2.4",
        "2.6",
        "2.7",
        "3.1",
        "3.2",
        "3.3",
        "3.4",
        "3.7",
        "3.8",
        "3.10",
        "4.1",
        "4.2",
        "5.1",
        "5.5",
        "5.7",
        "6.2",
        "6.3",
        "6.5"
      ]
    },
    {
      "id": "Course / Learning / Training",
      "order": 11,
      "secondaryOptions": [
        "Mandatory training",
        "Safeguarding training",
        "EDI training",
        "Unconscious bias training",
        "Human Factors training",
        "Quality Improvement training",
        "Leadership training",
        "Research training",
        "Accredited or relevant course",
        "Other relevant learning"
      ],
      "suggestedDomains": [
        1,
        2,
        3,
        4,
        6
      ],
      "suggestedCriteria": [
        "1.1",
        "1.2",
        "1.7",
        "1.8",
        "1.10",
        "2.2",
        "3.2",
        "3.9",
        "4.1",
        "4.2",
        "6.2"
      ]
    },
    {
      "id": "CPD Diary",
      "order": 12,
      "secondaryOptions": [],
      "suggestedDomains": [
        1,
        6
      ],
      "suggestedCriteria": [
        "1.2",
        "6.1"
      ]
    },
    {
      "id": "Qualification",
      "order": 13,
      "secondaryOptions": [],
      "suggestedDomains": [
        1
      ],
      "suggestedCriteria": [
        "1.2",
        "1.10"
      ]
    },
    {
      "id": "Workplace Example",
      "order": 14,
      "secondaryOptions": [
        "Initiative that effected change",
        "Collaborative leadership work",
        "Effective leadership",
        "Teamwork",
        "Involvement",
        "Success",
        "Successful change",
        "Successful intervention",
        "Evidence-based change",
        "Use of guidelines in clinical practice",
        "Patient education"
      ],
      "suggestedDomains": [
        2,
        3,
        5,
        6
      ],
      "suggestedCriteria": [
        "2.1",
        "2.2",
        "2.3",
        "2.5",
        "3.3",
        "3.6",
        "3.7",
        "3.10",
        "3.11",
        "5.1",
        "5.2",
        "6.4"
      ]
    },
    {
      "id": "MDT Evidence",
      "order": 15,
      "secondaryOptions": [],
      "suggestedDomains": [
        2
      ],
      "suggestedCriteria": [
        "2.3"
      ]
    },
    {
      "id": "Teaching / Training Evidence",
      "order": 16,
      "secondaryOptions": [
        "Teaching students",
        "Teaching doctors or dentists in training",
        "Teaching allied health professionals",
        "Team or multidisciplinary learning",
        "Teaching experience",
        "Teaching success",
        "Learner feedback",
        "Developmental feedback",
        "Supervision",
        "Coaching or mentoring",
        "Role-model activity",
        "Successful learner intervention",
        "Patient education"
      ],
      "suggestedDomains": [
        5
      ],
      "suggestedCriteria": [
        "5.2",
        "5.4",
        "5.5",
        "5.6",
        "5.7",
        "5.8"
      ]
    },
    {
      "id": "Guideline Evidence",
      "order": 17,
      "secondaryOptions": [
        "Guideline awareness",
        "Use in clinical practice",
        "Guideline development",
        "Implementation of evidence-based change"
      ],
      "suggestedDomains": [
        5,
        6
      ],
      "suggestedCriteria": [
        "5.3",
        "6.2",
        "6.3",
        "6.4"
      ]
    },
    {
      "id": "Research Activity",
      "order": 18,
      "secondaryOptions": [
        "Participation in research",
        "NIHR study recruitment",
        "Research project",
        "Current limitations in evidence",
        "Research needs or evidence gaps",
        "Research collaboration or networking"
      ],
      "suggestedDomains": [
        6
      ],
      "suggestedCriteria": [
        "6.2",
        "6.5"
      ]
    },
    {
      "id": "Presentation / Publication",
      "order": 19,
      "secondaryOptions": [
        "Conference presentation",
        "Conference abstract",
        "Publication",
        "Guideline development"
      ],
      "suggestedDomains": [
        6
      ],
      "suggestedCriteria": [
        "6.2"
      ]
    },
    {
      "id": "Peer Review Activity",
      "order": 20,
      "secondaryOptions": [],
      "suggestedDomains": [
        6
      ],
      "suggestedCriteria": [
        "6.2"
      ]
    }
  ],
  "scoring": {
    "minimumWeight": 70,
    "strengthWeight": 30,
    "darkGreenStrengthPoints": 2,
    "newTypePoints": 1,
    "repeatTypePoints": 0.5,
    "repeatTypeCap": 1
  },
  "totalCriteria": 44
};
