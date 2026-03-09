---
name: quiz-generator
description: Analyzes an existing Markdown/MDX file, generates a multiple-choice quiz based on the content, and appends the <Quiz /> component to the file.
---

# `quiz-generator` Skill

This skill is designed to analyze an educational Markdown or MDX page, formulate relevant multiple-choice questions, and automatically append an interactive `<Quiz />` component at the bottom of the content.

## When to use this skill
Use this skill when you want to add an interactive knowledge check to a course module, block, or general documentation page.

## Workflow

1. **Read the Content**: Read the specified target `.md` or `.mdx` file.
2. **Analyze and Generate Questions**: 
   - Identify the key learning objectives or key takeaways from the file.
   - Formulate exactly 5 multiple-choice questions. 
   - Ensure there are 3-4 options per question.
   - Provide a clear `explanation` for why the correct answer is correct (and optionally why others are incorrect).
   - Ensure the structure strictly matches the `Question` type:
     ```typescript
     type Question = {
       text: string;
       options: string[];
       correctAnswerIndex: number; // 0-based index
       explanation: string;
     };
     ```
3. **Append the Component**: 
   - If `import Quiz from '@site/src/components/Quiz';` is not present at the top or bottom of the file (or anywhere), add it below the frontmatter or directly before the quiz.
   - Inject the `<Quiz questions={[...]} />` block at the very end of the `.md` or `.mdx` file. 

## Code Example for Injection

```mdx
import Quiz from '@site/src/components/Quiz';

## Knowledge Check

<Quiz 
  questions={[
    {
      text: "What is the primary purpose of X?",
      options: [
        "To do Y",
        "To do Z",
        "All of the above"
      ],
      correctAnswerIndex: 0,
      explanation: "X is explicitly designed to do Y, as mentioned in the section on..."
    }
  ]}
/>
```

## Important Rules
- Do NOT alter existing file contents (theory, headers, definitions) unless explicitly asked to fix them.
- Ensure the questions generated are directly answered or implied by the text in the document.
- Use valid React JSON syntax inside the MDX `<Quiz />` prop (e.g., using double quotes for strings, standard array/object formatting without markdown linting errors).
