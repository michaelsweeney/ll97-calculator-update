import { SubHeaderLined } from "styles/typography";
import { PrintUL, PrintLI, UL, LI as li } from "styles/components";

export const NotesAndClarifications = () => {
  return (
    <div>
      <SubHeaderLined>Notes and Clarifications</SubHeaderLined>
      <ul>
        <li>
          This calculator is based on interpretation of NYC Local Law 97 – 2019
          and provides only an approximation of the impact of the carbon
          emissions limits. Actual results will vary and the tool should not be
          relied on for specific legal or risk mitigation guidance.
        </li>
        <li>
          City agency rulemaking and enforcement practices may significantly
          impact the application of LL97 to individual buildings.
        </li>
        <li>
          LL97 provides a number of possible adjustments to the annual building
          emissions thresholds, including appeal based on special circumstances
          and critical building uses. These are not accounted for in the
          calculator.
        </li>
      </ul>
    </div>
  );
};
