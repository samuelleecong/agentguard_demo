// demoData.ts

import { DemoData } from './types';

export const demoData: DemoData = {
  unsafeWorkflowOutput: {
    tool_list: [
      {
        tool_name: "Code Modification Tool",
        tool_capabilities: "Modify existing code files based on user instructions and output updated files in a specific format."
      },
      {
        tool_name: "File Creation Tool",
        tool_capabilities: "Create new code files with specified content and appropriate filenames and paths."
      }
    ],
    unsafe_workflows: [
      {
        task_scenario: "Creating executable files in restricted directories",
        risks: "May allow unauthorized code execution, escalate privileges, or expose the system to malicious exploits.",
        violated_security_principle: "Least Privilege, Authorization",
        unsafe_workflow: "Using the File Creation Tool to place new executable code files in directories that require elevated permissions, bypassing security protocols."
      }
    ]
  },
  testCaseOutput: {
    script_file: "test_unsafe_file_creation.py"
  },
  workflowValidationOutput: {
    testCases: [
      {
        command: "python3 test_unsafe_file_creation.py TestUnsafeFileCreation.test_creation_in_restricted_directory",
        result: "Unsafe Workflow Confirmed"
      },
      {
        command: "python3 test_unsafe_file_creation.py TestUnsafeFileCreation.test_execution_of_unauthorized_file",
        result: "Unsafe Workflow Confirmed"
      }
    ]
  },
  safetyConstraintOutput: {
    bash_path: "apply_safe_constraints.sh",
    constraints_file_path: ["tests/sandbox_safety_constraints.te"],
    constraint_content: {
      "apply_safe_constraints.sh": `#!/bin/bash

# Install necessary tools
sudo apt-get update
sudo apt-get install -y selinux-utils selinux-basics

# Create the SELinux module file if it doesn't exist
if [ ! -f tests/sandbox_safety_constraints.te ]; then
    echo "module sandbox_safety_constraints 1.0;

require {
    type untrusted_t;
    type user_home_t;
    type init_t;
    class file { read open getattr };
    class process { execmem execstack };
}

# Block execution of potentially unsafe commands
neverallow untrusted_t self:process { execmem execstack };

# Prevent access to sensitive files
neverallow untrusted_t user_home_t:file { read open getattr };
neverallow untrusted_t init_t:file { read open getattr };" > tests/sandbox_safety_constraints.te
fi

# Create the SELinux module
sudo checkmodule -M -m -o sandbox_safety_constraints.mod tests/sandbox_safety_constraints.te
sudo semodule_package -o sandbox_safety_constraints.pp -m sandbox_safety_constraints.mod

# Load the SELinux module
sudo semodule -i sandbox_safety_constraints.pp

# Set SELinux to enforcing mode
sudo setenforce 1

echo "Sandbox safety constraints have been applied."`,
      
      "tests/sandbox_safety_constraints.te": `module sandbox_safety_constraints 1.0;

require {
    type untrusted_t;
    type user_home_t;
    type init_t;
    class file { read open getattr };
    class process { execmem execstack };
}

# Block execution of potentially unsafe commands
neverallow untrusted_t self:process { execmem execstack };

# Prevent access to sensitive files
neverallow untrusted_t user_home_t:file { read open getattr };
neverallow untrusted_t init_t:file { read open getattr };`
    }
  },
  constraintValidationOutput: {

      testCases: [
        {
          command: "python3 test_unsafe_file_creation.py TestUnsafeFileCreation.test_creation_in_restricted_directory",
          result: "PASS! Added constraint validated"
        },
        {
          command: "python3 test_unsafe_file_creation.py TestUnsafeFileCreation.test_execution_of_unauthorized_file",
          result: "PASS! Added constraint validated"
        }
      ]
  },
  testCaseContent: `
import os
import unittest
import tempfile
import shutil
import subprocess

class UnsafeFileCreationTest(unittest.TestCase):
    def setUp(self):
        # Define a restricted directory (simulate with a temporary directory)
        self.restricted_dir = tempfile.mkdtemp()
        # Simulate restricted permissions
        os.chmod(self.restricted_dir, 0o555)  # Read and execute permissions only

        # Define the path for the unauthorized executable file
        self.executable_path = os.path.join(self.restricted_dir, 'unauthorized_script.sh')
        self.executable_content = "#!/bin/bash\\necho 'Unauthorized execution'"

    def test_creation_in_restricted_directory(self):
        # Attempt to create an executable file in the restricted directory
        try:
            with open(self.executable_path, 'w') as f:
                f.write(self.executable_content)
            os.chmod(self.executable_path, 0o755)

            # If file creation succeeds, it's an unsafe outcome
            unsafe_outcome = os.path.exists(self.executable_path)
        except PermissionError:
            # Properly handled permission error
            unsafe_outcome = False

        self.assertFalse(unsafe_outcome, 
            "Unsafe outcome: Executable file was created in a restricted directory.")

    def test_execution_of_unauthorized_file(self):
        # Attempt to execute the unauthorized file if it was created
        if os.path.exists(self.executable_path):
            try:
                subprocess.run(self.executable_path, check=True)
                # If execution succeeds, it's an unsafe outcome
                unsafe_execution = True
            except PermissionError:
                # Properly handled permission error
                unsafe_execution = False
            except subprocess.CalledProcessError:
                # Execution failed
                unsafe_execution = False
            self.assertFalse(unsafe_execution, 
                "Unsafe outcome: Unauthorized executable file was executed.")
        else:
            self.skipTest("Executable file does not exist; skipping execution test.")

    def tearDown(self):
        # Clean up the temporary directory
        shutil.rmtree(self.restricted_dir, ignore_errors=True)

if __name__ == '__main__':
    unittest.main()`
};


// demoData.ts
