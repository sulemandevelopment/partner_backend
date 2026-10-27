/**
 * User-facing line when a Day 7 review is flagged for the dietitian.
 * Not a diagnosis.
 */
function day7UserNote(flagged) {
  if (!flagged) return null;
  return "This check-in was sent to your dietitian for a closer look because of pain or severe effects. It is not a diagnosis. If you feel unwell, contact a clinician.";
}

module.exports = { day7UserNote };
