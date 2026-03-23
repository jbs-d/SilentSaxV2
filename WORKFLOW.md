# SilentSax Workflow

## Working Style
- Plan before making non-trivial changes
- Do not rewrite large parts of the app unless necessary
- Implement only the next smallest meaningful step
- Keep code changes minimal and local
- Prefer simple, clean solutions over clever ones

## Before Coding
Always read:
- PROJECT_VISION.md
- CURRENT_STATUS.md
- NEXT_STEPS.md
- WORKFLOW.md

Before implementation:
1. Summarize what is already implemented
2. Identify what is missing
3. Choose the next smallest meaningful MVP step
4. Explain which files will be changed

## Implementation Rules
- Focus on the current MVP only
- Do not implement Bluetooth yet
- Do not make manual note input the main flow

## Verification
Do not mark work as done without checking it.

## Code Quality
- Keep services, UI, and domain logic separated
- Avoid unnecessary dependencies
- Avoid hacky fixes if a clean local solution is possible

## Documentation
- Update CURRENT_STATUS.md after meaningful progress
- Update NEXT_STEPS.md when priorities change
