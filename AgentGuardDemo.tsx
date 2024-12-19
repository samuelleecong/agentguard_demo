import React, { useState, useEffect } from 'react';
import { demoData } from './demoData';
import './AgentGuardDemo.css';

const WorkflowSummary: React.FC<{ data: typeof demoData }> = ({ data }) => (
  <div className="workflow-summary">
    <h2>Security Analysis Workflow Summary</h2>
    
    <div className="summary-section">
      <h3>1. Identified Security Risks</h3>
      {data.unsafeWorkflowOutput.unsafe_workflows.map((workflow, i) => (
        <div key={i} className="summary-item">
          <div className="summary-header">
            <strong>{workflow.task_scenario}</strong>
            <span className="risk-tag">Risk Level: High</span>
          </div>
          <div className="summary-details">
            <p><strong>Principle Violated:</strong> {workflow.violated_security_principle}</p>
            <details>
              <summary>View Details</summary>
              <p>{workflow.risks}</p>
              <p>{workflow.unsafe_workflow}</p>
            </details>
          </div>
        </div>
      ))}
    </div>

    <div className="summary-section">
      <h3>2. Test Results</h3>
      <div className="test-results">
        {data.workflowValidationOutput.testCases.map((test, i) => (
          <div key={i} className="test-result">
            <span className="test-indicator unsafe">⚠️ {test.result}</span>
            <details>
              <summary>Test Command</summary>
              <code>{test.command}</code>
            </details>
          </div>
        ))}
      </div>
    </div>

    <div className="summary-section">
      <h3>3. Applied Safety Constraints</h3>
      <div className="constraints">
        <strong>Generated Files:</strong>
        <ul>
          <li>apply_safe_constraints.sh</li>
          <li>sandbox_safety_constraints.te</li>
        </ul>
        <details>
          <summary>View Constraints</summary>
          <pre>{data.safetyConstraintOutput.constraint_content['tests/sandbox_safety_constraints.te']}</pre>
        </details>
      </div>
    </div>

    <div className="summary-section">
      <h3>4. Validation Results</h3>
      <div className="validation-results">
        {data.constraintValidationOutput.testCases.map((test, i) => (
          <div key={i} className="test-result">
            <span className="test-indicator safe">✅ {test.result}</span>
            <details>
              <summary>Validation Command</summary>
              <code>{test.command}</code>
            </details>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AgentGuardDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [streamingText, setStreamingText] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  const steps = [
    {
      title: 'Unsafe Workflow Identification',
      content: JSON.stringify(demoData.unsafeWorkflowOutput, null, 2),
      files: []
    },
    {
      title: 'Test Case Generation',
      content: demoData.testCaseContent,
      files: [demoData.testCaseOutput.script_file]
    },
    {
      title: 'Workflow Validation',
      content: Object.entries(demoData.workflowValidationOutput.testCases)
        .map(([_, output]: [string, { command: string; result: string }]) => "\n" + output.command + "\n" + output.result).join("\n")  
    },
    {
      title: 'Safety Constraint Generation',
      content: demoData.safetyConstraintOutput.constraint_content['apply_safe_constraints.sh'],
      files: ['apply_safe_constraints.sh', 'tests/sandbox_safety_constraints.te']
    },
    {
      title: 'Safety Constraint Validation',
      content: Object.entries(demoData.constraintValidationOutput.testCases)
        .map(([_, output]: [string, { command: string; result: string }]) => "\n" + output.command + "\n" + output.result).join("\n")  
    },
    {
      title: 'Security Analysis Report',
      content: '',
      files: [],
      customContent: (
        <div className="security-report">
          <div className="report-header">
            <h2>🛡️ Security Analysis Complete</h2>
            <div className="report-stats">
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Risks Addressed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">4/4</span>
                <span className="stat-label">Tests Passed</span>
              </div>
            </div>
          </div>

          <div className="report-grid">
            <div className="report-section risks">
              <h3>🔍 Identified Risks</h3>
              {demoData.unsafeWorkflowOutput.unsafe_workflows.map((workflow, i) => (
                <div key={i} className="risk-card">
                  <div className="risk-header">
                    <span className="risk-badge">High Risk</span>
                    <h4>{workflow.task_scenario}</h4>
                  </div>
                  <p>{workflow.risks}</p>
                  <div className="risk-footer">
                    <span className="violation-tag">
                      {workflow.violated_security_principle}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="report-section solutions">
              <h3>🛠️ Applied Solutions</h3>
              <div className="solution-cards">
                <div className="solution-card">
                  <h4>Security Constraints</h4>
                  <ul className="constraint-list">
                    {['Execution Controls', 'File Access Restrictions', 'Process Isolation'].map((constraint, i) => (
                      <li key={i}>✓ {constraint}</li>
                    ))}
                  </ul>
                </div>
                <div className="solution-card">
                  <h4>Validation Results</h4>
                  {demoData.constraintValidationOutput.testCases.map((test, i) => (
                    <div key={i} className="validation-result">
                      <span className="success-check">✓</span>
                      <code>{test.command}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setStreamingText(steps[index].content);
    setGeneratedFiles(() => {
      const newFiles = new Set<string>();
      for (let i = 0; i <= index; i++) {
        steps[i].files?.forEach(file => newFiles.add(file));
      }
      return Array.from(newFiles);
    });
    setIsStreaming(false);
  };

  useEffect(() => {
    if (currentStep < steps.length && isStreaming) {
      if (steps[currentStep].customContent) {
        setStreamingText('');
        setIsStreaming(false);
      } else {
        let index = 0;
        const text = steps[currentStep].content;
        const streamInterval = setInterval(() => {
          if (index < text.length - 1) {
            setStreamingText(prev => prev + text[index]);
            index++;
          } else {
            clearInterval(streamInterval);
            setGeneratedFiles(prev => [...prev, ...(steps[currentStep].files || [])]);
            if (currentStep === steps.length - 1) {
              setTimeout(() => setShowSummary(true), 1000);
            } else {
              setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setStreamingText('');
              }, 1000);
            }
          }
        }, 10);

        return () => clearInterval(streamInterval);
      }
    }
  }, [currentStep, isStreaming]);

  return (
    <div className="agent-guard-demo">
      <div className="steps-container">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index === currentStep ? 'active' : ''} 
                       ${index < currentStep ? 'completed' : ''}`}
            onClick={() => handleStepClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="main-content">
      <div className={`${!steps[currentStep].customContent ? 'output-window' : ''}`}>
          {isStreaming && (
            <div className="window-header">
              <div className="window-title">Output</div>
              <div className="window-controls">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div className="output-content">
            {steps[currentStep].customContent || streamingText}
          </div>
        </div>

        <div className="files-panel">
          <h3>Generated Files</h3>
          <div className="file-list">
            {generatedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <svg className="file-icon" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                </svg>
                <span>{file}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentGuardDemo;