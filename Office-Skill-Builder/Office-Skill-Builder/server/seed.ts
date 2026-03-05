import { db } from "./db";
import { lessons, exercises } from "@shared/schema";

export async function seedDatabase() {
  const existingLessons = await db.select().from(lessons);
  if (existingLessons.length > 0) return;

  const [lesson1] = await db.insert(lessons).values({
    title: "Office Terms & Definitions",
    description: "Learn and match key office administration vocabulary with their correct meanings.",
    icon: "BookOpen",
    color: "blue",
    orderIndex: 1,
  }).returning();

  const [lesson2] = await db.insert(lessons).values({
    title: "Document Structure",
    description: "Practice arranging the components of official documents in the correct order.",
    icon: "FileText",
    color: "green",
    orderIndex: 2,
  }).returning();

  const [lesson3] = await db.insert(lessons).values({
    title: "Document Placement",
    description: "Place document blocks (header, body, signature, etc.) in their correct positions.",
    icon: "Layout",
    color: "purple",
    orderIndex: 3,
  }).returning();

  const [lesson4] = await db.insert(lessons).values({
    title: "Document Classification",
    description: "Classify documents by department and storage duration rules.",
    icon: "FolderOpen",
    color: "orange",
    orderIndex: 4,
  }).returning();

  const [lesson5] = await db.insert(lessons).values({
    title: "Labor Contract Cases",
    description: "Read real-life case scenarios and choose the correct decision about labor contracts.",
    icon: "Briefcase",
    color: "red",
    orderIndex: 5,
  }).returning();

  const [lesson6] = await db.insert(lessons).values({
    title: "Office Guessing Game",
    description: "Read clever riddles about office tools and supplies. Who am I?",
    icon: "HelpCircle",
    color: "teal",
    orderIndex: 6,
  }).returning();

  // Lesson 1: Definition Matching
  await db.insert(exercises).values([
    {
      lessonId: lesson1.id,
      type: "definition_matching",
      title: "Match Office Terms",
      instructions: "Match each term on the left with its correct definition on the right.",
      orderIndex: 1,
      data: {
        pairs: [
          { term: "Memorandum", definition: "An internal written message sent between departments or staff within an organization." },
          { term: "Invoice", definition: "A commercial document requesting payment for goods or services provided." },
          { term: "Minutes", definition: "An official written record of what was discussed and decided in a meeting." },
          { term: "Agenda", definition: "A list of topics to be discussed during a scheduled meeting." },
          { term: "Circular", definition: "A document distributed to many people containing announcements or information." },
        ]
      }
    },
    {
      lessonId: lesson1.id,
      type: "definition_matching",
      title: "Document Types Matching",
      instructions: "Match each document type with its correct definition.",
      orderIndex: 2,
      data: {
        pairs: [
          { term: "Directive", definition: "An official instruction or order issued by a higher authority to subordinates." },
          { term: "Receipt", definition: "A written acknowledgment that something (money or goods) has been received." },
          { term: "Petition", definition: "A formal written request signed by many people and addressed to an authority." },
          { term: "Report", definition: "A detailed document presenting findings, analysis, or recommendations on a topic." },
          { term: "Contract", definition: "A legally binding written agreement between two or more parties." },
        ]
      }
    }
  ]);

  // Lesson 2: Component Arrangement
  await db.insert(exercises).values([
    {
      lessonId: lesson2.id,
      type: "component_arrangement",
      title: "Arrange a Business Letter",
      instructions: "Drag and drop the components to arrange them in the correct order for a formal business letter.",
      orderIndex: 1,
      data: {
        components: [
          { id: "1", label: "Sender's Address", correctOrder: 1 },
          { id: "2", label: "Date", correctOrder: 2 },
          { id: "3", label: "Recipient's Address", correctOrder: 3 },
          { id: "4", label: "Salutation (Dear...)", correctOrder: 4 },
          { id: "5", label: "Body / Main Content", correctOrder: 5 },
          { id: "6", label: "Closing (Yours sincerely...)", correctOrder: 6 },
          { id: "7", label: "Signature & Name", correctOrder: 7 },
        ]
      }
    },
    {
      lessonId: lesson2.id,
      type: "component_arrangement",
      title: "Arrange Meeting Minutes",
      instructions: "Arrange the sections of a meeting minutes document in the correct order.",
      orderIndex: 2,
      data: {
        components: [
          { id: "1", label: "Title: Meeting Minutes", correctOrder: 1 },
          { id: "2", label: "Date, Time, and Location", correctOrder: 2 },
          { id: "3", label: "List of Attendees", correctOrder: 3 },
          { id: "4", label: "Agenda Items Discussed", correctOrder: 4 },
          { id: "5", label: "Decisions Made", correctOrder: 5 },
          { id: "6", label: "Action Items & Responsibilities", correctOrder: 6 },
          { id: "7", label: "Next Meeting Date", correctOrder: 7 },
          { id: "8", label: "Secretary's Signature", correctOrder: 8 },
        ]
      }
    }
  ]);

  // Lesson 3: Document Block Placement
  await db.insert(exercises).values([
    {
      lessonId: lesson3.id,
      type: "document_block_placement",
      title: "Place Official Letter Blocks",
      instructions: "Place each document block in its correct position on the letter template.",
      orderIndex: 1,
      data: {
        positions: [
          { id: "top-left", label: "Top Left", correctBlock: "Letterhead / Company Logo" },
          { id: "top-right", label: "Top Right", correctBlock: "Date" },
          { id: "left-address", label: "Left Address Area", correctBlock: "Recipient's Name and Address" },
          { id: "subject", label: "Subject Line", correctBlock: "RE: Subject of the Letter" },
          { id: "body", label: "Main Body", correctBlock: "Letter Content" },
          { id: "bottom-left", label: "Bottom Left", correctBlock: "Sender's Signature & Stamp" },
          { id: "bottom-right", label: "Bottom Right", correctBlock: "Page Number" },
        ],
        blocks: [
          "Letterhead / Company Logo",
          "Date",
          "Recipient's Name and Address",
          "RE: Subject of the Letter",
          "Letter Content",
          "Sender's Signature & Stamp",
          "Page Number",
        ]
      }
    },
    {
      lessonId: lesson3.id,
      type: "document_block_placement",
      title: "Place Report Blocks",
      instructions: "Place each section in its correct position on the official report template.",
      orderIndex: 2,
      data: {
        positions: [
          { id: "cover", label: "Cover Area", correctBlock: "Report Title & Logo" },
          { id: "prepared-by", label: "Prepared By Section", correctBlock: "Author's Name & Department" },
          { id: "toc", label: "After Cover", correctBlock: "Table of Contents" },
          { id: "intro", label: "First Chapter", correctBlock: "Introduction" },
          { id: "findings", label: "Main Section", correctBlock: "Findings & Analysis" },
          { id: "conclusion", label: "Last Chapter", correctBlock: "Conclusion & Recommendations" },
          { id: "appendix", label: "After Conclusion", correctBlock: "Appendices" },
        ],
        blocks: [
          "Report Title & Logo",
          "Author's Name & Department",
          "Table of Contents",
          "Introduction",
          "Findings & Analysis",
          "Conclusion & Recommendations",
          "Appendices",
        ]
      }
    }
  ]);

  // Lesson 4: Document Classification
  await db.insert(exercises).values([
    {
      lessonId: lesson4.id,
      type: "document_classification",
      title: "Classify by Department",
      instructions: "Classify each document by selecting the correct department it belongs to.",
      orderIndex: 1,
      data: {
        documents: [
          { id: "1", name: "Employee Salary Slip", correctCategory: "Human Resources" },
          { id: "2", name: "Annual Budget Report", correctCategory: "Finance" },
          { id: "3", name: "Customer Purchase Order", correctCategory: "Sales & Marketing" },
          { id: "4", name: "Server Maintenance Log", correctCategory: "IT Department" },
          { id: "5", name: "Job Application Form", correctCategory: "Human Resources" },
          { id: "6", name: "Supplier Invoice", correctCategory: "Finance" },
        ],
        categories: ["Human Resources", "Finance", "Sales & Marketing", "IT Department", "Administration"]
      }
    },
    {
      lessonId: lesson4.id,
      type: "document_classification",
      title: "Classify by Storage Duration",
      instructions: "Classify each document by how long it should be kept according to standard archiving rules.",
      orderIndex: 2,
      data: {
        documents: [
          { id: "1", name: "Tax Records", correctCategory: "10 Years" },
          { id: "2", name: "Employee Contracts", correctCategory: "Permanently" },
          { id: "3", name: "Daily Meeting Notes", correctCategory: "1 Year" },
          { id: "4", name: "Financial Audit Report", correctCategory: "10 Years" },
          { id: "5", name: "Visitor Log Book", correctCategory: "3 Years" },
          { id: "6", name: "Company Founding Documents", correctCategory: "Permanently" },
        ],
        categories: ["1 Year", "3 Years", "5 Years", "10 Years", "Permanently"]
      }
    }
  ]);

  // Lesson 5: Labor Contract Cases
  await db.insert(exercises).values([
    {
      lessonId: lesson5.id,
      type: "labor_contract_case",
      title: "Employment Contract Scenarios",
      instructions: "Read each case carefully and select the most correct decision based on labor law principles.",
      orderIndex: 1,
      data: {
        cases: [
          {
            id: "1",
            scenario: "Ahmet was hired on a 6-month probation. After 5 months, his employer wants to end the contract without giving a reason. Ahmet has performed well. What should happen?",
            options: [
              "The employer can terminate immediately without notice since it's a probation period.",
              "The employer must provide a valid reason and written notice even during probation.",
              "Ahmet must resign first before the contract can end.",
              "The probation period must be extended automatically.",
            ],
            correctOption: 1,
            explanation: "Even during probation, termination requires a valid written reason and proper notice in most labor laws. Employers cannot simply dismiss without cause."
          },
          {
            id: "2",
            scenario: "Fatma works 50 hours per week but her contract states 40 hours. She has not been paid overtime for 3 months. What is the correct action?",
            options: [
              "Extra hours are part of the job, so no overtime is owed.",
              "Fatma should request overtime pay in writing from her employer.",
              "Fatma must accept the situation as her contract does not mention overtime.",
              "She should immediately quit without notice.",
            ],
            correctOption: 1,
            explanation: "Hours beyond the contracted limit qualify as overtime and must be compensated. Fatma has the right to request this payment formally in writing."
          },
          {
            id: "3",
            scenario: "A company wants to change an employee's workplace from Istanbul to Ankara without his agreement. The employee refuses. What is the correct situation?",
            options: [
              "The company can force the transfer since they are the employer.",
              "A workplace change requires the employee's written consent unless the contract allows it.",
              "The employee must accept or resign.",
              "The company must pay double salary to force the transfer.",
            ],
            correctOption: 1,
            explanation: "Changing fundamental working conditions like location requires the employee's written consent unless specifically allowed in the contract."
          }
        ]
      }
    },
    {
      lessonId: lesson5.id,
      type: "labor_contract_case",
      title: "Contract Rights & Obligations",
      instructions: "Analyze each workplace scenario and choose the correct decision.",
      orderIndex: 2,
      data: {
        cases: [
          {
            id: "1",
            scenario: "Mehmet has been working for 4 years. The company goes bankrupt. What happens to his severance pay?",
            options: [
              "He loses his right to severance since the company is bankrupt.",
              "He must wait until the bankruptcy process ends, then may receive severance from company assets.",
              "The government automatically pays severance in all bankruptcy cases.",
              "He receives double severance pay due to bankruptcy.",
            ],
            correctOption: 1,
            explanation: "Employee severance claims are prioritized during bankruptcy proceedings. Workers have a right to receive their entitlements from company assets when available."
          },
          {
            id: "2",
            scenario: "Zeynep signed a contract with a non-compete clause. After leaving her job, a competitor offered her a better position. What should she consider?",
            options: [
              "Non-compete clauses have no legal standing, so she can join freely.",
              "She should review the clause duration and scope, as it may legally restrict her for a period.",
              "She must get permission from her former employer before accepting any job.",
              "Non-compete only applies if she was a manager.",
            ],
            correctOption: 1,
            explanation: "Non-compete clauses can be legally binding within reasonable limits (time, geography, scope). Zeynep should review hers carefully and possibly consult a lawyer."
          }
        ]
      }
    }
  ]);

  // Lesson 6: Who Am I Guessing Game
  await db.insert(exercises).values([
    {
      lessonId: lesson6.id,
      type: "guessing_game",
      title: "Who Am I? - Office Objects",
      instructions: "Read each riddle carefully and type or select the correct answer.",
      orderIndex: 1,
      data: {
        riddles: [
          {
            id: "1",
            clue: "I am widely used in offices and help people stay alert. People drink me when they feel tired. What am I?",
            answer: "Coffee",
            options: ["Tea", "Coffee", "Water", "Juice"],
          },
          {
            id: "2",
            clue: "I have many teeth but I never bite. I hold papers together without making holes. What am I?",
            answer: "Stapler",
            options: ["Paperclip", "Scissors", "Stapler", "Ruler"],
          },
          {
            id: "3",
            clue: "People look at me all day but I am not a mirror. I show them words, numbers, and images. Without electricity, I am useless. What am I?",
            answer: "Computer Screen",
            options: ["Telephone", "Computer Screen", "Whiteboard", "Projector"],
          },
          {
            id: "4",
            clue: "I am thin, flat, and white. Thousands of words are written on me every day. You can fold me or cut me. What am I?",
            answer: "Paper",
            options: ["Notebook", "Paper", "Envelope", "Card"],
          },
          {
            id: "5",
            clue: "I sit on a desk and ring. When someone speaks into me, their voice travels far away. What am I?",
            answer: "Telephone",
            options: ["Radio", "Intercom", "Telephone", "Speaker"],
          },
        ]
      }
    },
    {
      lessonId: lesson6.id,
      type: "guessing_game",
      title: "Who Am I? - Document Riddles",
      instructions: "Guess the document or office item from the clues given.",
      orderIndex: 2,
      data: {
        riddles: [
          {
            id: "1",
            clue: "I am created when two parties agree. I have rules, rights, and duties. Breaking me has consequences. What am I?",
            answer: "Contract",
            options: ["Letter", "Report", "Contract", "Invoice"],
          },
          {
            id: "2",
            clue: "People write down what happened at meetings using me. I record decisions and who attended. What am I?",
            answer: "Meeting Minutes",
            options: ["Agenda", "Meeting Minutes", "Memo", "Report"],
          },
          {
            id: "3",
            clue: "I travel in an envelope. I have a sender, a recipient, and a subject. Offices send me every day. What am I?",
            answer: "Official Letter",
            options: ["Invoice", "Official Letter", "Circular", "Form"],
          },
          {
            id: "4",
            clue: "I list all topics to be discussed before a meeting begins. Without me, meetings have no direction. What am I?",
            answer: "Agenda",
            options: ["Minutes", "Agenda", "Memo", "Directive"],
          },
          {
            id: "5",
            clue: "I am proof that money changed hands. People keep me for records and tax purposes. What am I?",
            answer: "Receipt",
            options: ["Invoice", "Receipt", "Contract", "Report"],
          },
        ]
      }
    }
  ]);

  console.log("Database seeded successfully!");
}
