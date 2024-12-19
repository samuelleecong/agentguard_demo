import React, { useState, useEffect } from 'react';
import { demoData } from './demoData';
import './AgentGuardDemo.css';

const AgentGuardDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [streamingText, setStreamingText] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);

  const steps = [
    {
      title: 'Unsafe Workflow Detection',
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
      title: 'Safety Constraints Generation',
      content: demoData.safetyConstraintOutput.constraint_content['apply_safe_constraints.sh'],
      files: ['apply_safe_constraints.sh', 'tests/sandbox_safety_constraints.te']
    },
    {
      title: 'Constraint Validation',
      content: Object.entries(demoData.constraintValidationOutput.testCases)
        .map(([_, output]: [string, { command: string; result: string }]) => "\n" + output.command + "\n" + output.result).join("\n")  
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
      let index = 0;
      const text = steps[currentStep].content;
      const streamInterval = setInterval(() => {
        if (index < text.length - 1) {
          setStreamingText(prev => prev + text[index]);
          index++;
        } else {
          clearInterval(streamInterval);
          setGeneratedFiles(prev => [...prev, ...(steps[currentStep].files || [])]);
          setTimeout(() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(prev => prev + 1);
              setStreamingText('');
            }
          }, 1000);
        }
      }, 10);

      return () => clearInterval(streamInterval);
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
        <div className="output-window">
          <div className="window-header">
            <div className="window-title">Output</div>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <pre className="output-content">
            {streamingText}
          </pre>
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