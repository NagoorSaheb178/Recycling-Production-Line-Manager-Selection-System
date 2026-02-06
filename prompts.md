
# Master Recruitment Rubrics (V2)

Use these refined rubrics with `puter.ai.chat` to ensure standardized scoring across all manager candidates.

## 1. Professional Crisis Management
**Rubric:**
- 0-30: No industrial safety background.
- 31-60: General management experience; likely needs training on high-risk protocols.
- 61-80: Solid manufacturing/OSHA experience; capable of handling standard failures.
- 81-100: Deep expertise in hazardous materials, emergency response, and rapid recovery.

## 2. Technical Sustainability Index
**Rubric:**
- 0-30: Unfamiliar with waste management tech.
- 31-60: Understands basic recycling; limited knowledge of circular economy.
- 61-80: Knowledge of ISO 14001, LCA, and specific recycling line optimizations.
- 81-100: Expert in zero-waste strategies, advanced material recovery, and carbon accounting.

## 3. Team Motivation & Retention
**Rubric:**
- 0-30: Individual contributor mindset.
- 31-60: Basic supervisor skills; likely struggles with high-turnover shift work.
- 61-80: Proven ability to lead blue-collar teams and maintain safety morale.
- 81-100: Transformational leader with high EQ and experience in industrial labor relations.

## Implementation Standard
All AI requests must strictly follow this JSON response pattern:
```json
{
  "crisis": number,
  "sustainability": number,
  "motivation": number,
  "summary": "string (max 15 words)"
}
```
