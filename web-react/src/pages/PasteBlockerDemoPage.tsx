import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { CodeEditor } from '../components/CodeEditor';
import { TypeOnlyInput } from '../components/TypeOnlyInput';

/**
 * Demo page to showcase paste blocking functionality
 * This demonstrates how paste prevention works across different input types
 */
export function PasteBlockerDemoPage() {
  const [codeValue, setCodeValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [pasteAttempts, setPasteAttempts] = useState(0);

  const handlePasteAttempt = () => {
    setPasteAttempts((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Reveal>
        <div>
          <h1 className="text-3xl font-bold text-ink">Paste Blocker Demo</h1>
          <p className="mt-2 text-base text-muted">
            All inputs on this page block pasting to ensure users type their solutions
          </p>
        </div>
      </Reveal>

      {/* Stats Card */}
      <Reveal delay={0.05}>
        <div className="rounded-2xl border border-line bg-gradient-to-br from-warn/10 to-transparent p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warn-soft text-2xl">
              ⚠️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-ink">Paste Blocking Active</h3>
              <p className="text-sm text-muted">
                {pasteAttempts === 0
                  ? 'Try pasting into any field below'
                  : `${pasteAttempts} paste ${pasteAttempts === 1 ? 'attempt' : 'attempts'} blocked so far`}
              </p>
            </div>
            <div className="rounded-xl bg-warn px-4 py-2 text-center">
              <div className="text-2xl font-bold text-white">{pasteAttempts}</div>
              <div className="text-xs text-white/80">Blocked</div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Code Editor Example */}
      <Reveal delay={0.1}>
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Code Editor (For Proof Challenges)</h2>
            <p className="text-sm text-muted">
              Full-featured code editor with syntax highlighting and line numbers
            </p>
          </div>
          <CodeEditor
            value={codeValue}
            onChange={setCodeValue}
            language="javascript"
            placeholder="function solution() {&#10;  // Type your code here...&#10;}"
            minHeight="250px"
            maxHeight="400px"
            onPasteAttempt={handlePasteAttempt}
          />
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="text-xs font-semibold text-muted">Try these paste attempts:</p>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              <li>• <kbd className="rounded bg-elevated px-1.5 py-0.5 font-mono text-ink">Ctrl+V</kbd> or <kbd className="rounded bg-elevated px-1.5 py-0.5 font-mono text-ink">Cmd+V</kbd></li>
              <li>• Right-click → Paste</li>
              <li>• <kbd className="rounded bg-elevated px-1.5 py-0.5 font-mono text-ink">Shift+Insert</kbd></li>
            </ul>
          </div>
        </div>
      </Reveal>

      {/* Text Input Example */}
      <Reveal delay={0.15}>
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Single Line Input</h2>
            <p className="text-sm text-muted">
              For short answer questions or code snippets
            </p>
          </div>
          <TypeOnlyInput
            value={textValue}
            onChange={setTextValue}
            placeholder="Type a function name or short answer..."
            type="text"
            onPasteAttempt={handlePasteAttempt}
          />
        </div>
      </Reveal>

      {/* Textarea Example */}
      <Reveal delay={0.2}>
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Multi-line Text Area</h2>
            <p className="text-sm text-muted">
              For explanations or longer text responses
            </p>
          </div>
          <TypeOnlyInput
            value={textareaValue}
            onChange={setTextareaValue}
            placeholder="Explain your solution here..."
            type="textarea"
            rows={6}
            onPasteAttempt={handlePasteAttempt}
          />
        </div>
      </Reveal>

      {/* How It Works */}
      <Reveal delay={0.25}>
        <div className="rounded-2xl border border-brand/30 bg-brand-soft p-6">
          <h2 className="text-lg font-bold text-brand">How Paste Blocking Works</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink">
            <li className="flex gap-3">
              <span className="text-brand">✓</span>
              <div>
                <strong>Clipboard Events:</strong> Intercepts paste events from clipboard
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-brand">✓</span>
              <div>
                <strong>Keyboard Shortcuts:</strong> Blocks Ctrl+V, Cmd+V, and Shift+Insert
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-brand">✓</span>
              <div>
                <strong>Context Menu:</strong> Disables right-click paste on input fields
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-brand">✓</span>
              <div>
                <strong>Visual Feedback:</strong> Shows warning toasts when paste is attempted
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-brand">✓</span>
              <div>
                <strong>Tracking:</strong> Counts and displays blocked paste attempts
              </div>
            </li>
          </ul>
        </div>
      </Reveal>

      {/* Usage Example */}
      <Reveal delay={0.3}>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-lg font-bold text-ink mb-4">Usage in Your Components</h2>
          
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">1. Import the component:</p>
              <pre className="rounded-lg bg-elevated p-3 text-xs font-mono text-ink overflow-x-auto">
{`import { CodeEditor } from '../components/CodeEditor';
import { TypeOnlyInput } from '../components/TypeOnlyInput';`}
              </pre>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink">2. Use in your JSX:</p>
              <pre className="rounded-lg bg-elevated p-3 text-xs font-mono text-ink overflow-x-auto">
{`<CodeEditor
  value={code}
  onChange={setCode}
  language="javascript"
  placeholder="Type your solution..."
/>

<TypeOnlyInput
  value={answer}
  onChange={setAnswer}
  placeholder="Type your answer..."
/>`}
              </pre>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink">3. Or use the hook directly:</p>
              <pre className="rounded-lg bg-elevated p-3 text-xs font-mono text-ink overflow-x-auto">
{`import { usePasteBlocker } from '../utils/pasteBlocker';

const pasteBlocker = usePasteBlocker();

<input {...pasteBlocker} />`}
              </pre>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
