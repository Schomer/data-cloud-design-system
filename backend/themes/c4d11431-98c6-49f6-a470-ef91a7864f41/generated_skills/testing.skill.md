---
name: testing_skill
description: Performs Automated Multimodal Visual QA and Functional Testing on the generated data application.
---

# Static QA and Testing Skill

This skill is responsible for verifying the quality, layout, and functionality of the generated application code before it is finalized.

## Responsibilities

1. **Visual Quality Assurance:** Ensure the application adheres to `design/visual_spec.skill.md` rules. Ensure colors match the designated theme, and layout elements use correct Tailwind arbitrary classes.
2. **Functional Feature Verification:** Systematically verify every single UI control (buttons, date pickers, dropdowns, specific category filters) generated in the code.
3. **Mock UI Rejection:** If a feature does not work (e.g. clicking a date picker does not filter data, or a 'Download PDF' button is a dead link), the app MUST fail the testing phase and be returned to the generation step for fixing or removal of the dead element.
4. **Contextual Validation:** Confirm that any helper "tips" or textual instructions in the UI correspond to working features.

## Workflow

1. A static checklist QA pass is performed on the generated code.
2. The model answers the following questions about its own generated code:
   - Does every filter have a corresponding state variable and handler?
   - Does every button have an `onClick` that executes real logic?
   - Are there any hardcoded `href="#"` or empty `onClick={() => {}}` stubs?
   - Does every chart receive data from state variables, NOT hardcoded arrays inside the render step?
3. If any check fails, generate an explicit failure report highlighting which feature failed, requiring its immediate removal or functional implementation.
