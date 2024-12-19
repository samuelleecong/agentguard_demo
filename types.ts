export interface Tool {
    tool_name: string;
    tool_capabilities: string;
  }
  
  export interface UnsafeWorkflow {
    task_scenario: string;
    risks: string;
    violated_security_principle: string;
    unsafe_workflow: string;
  }
  
  export interface ValidationStep {
    step: string;
    result: "PASSED" | "FAILED";
    details: string;
  }
  
  export interface WorkflowIdentification {
    tool_list: Tool[];
    unsafe_workflows: UnsafeWorkflow[];
  }
  
  export interface TestCaseGeneration {
    script_file: string;
  }
  

  interface WorkflowValidation {
    testCases: Array<{
      command: string;
      result: string;
    }>;
  }
  
  
  export interface SafetyConstraint {
    bash_path: string;
    constraints_file_path: string[];
    constraint_content: {
      [key: string]: string;
    };
  }
  

  interface ConstraintValidation {
    testCases: Array<{
      command: string;
      result: string;
    }>;
  }
  
  
  export interface DemoData {
    unsafeWorkflowOutput: WorkflowIdentification;
    testCaseOutput: TestCaseGeneration;
    workflowValidationOutput: WorkflowValidation;
    safetyConstraintOutput: SafetyConstraint;
    constraintValidationOutput: ConstraintValidation;
    testCaseContent: string;
  }